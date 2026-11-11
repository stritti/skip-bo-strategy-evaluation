/**
 * Secure endpoint for sharing local simulation runs from the frontend.
 *
 * POST /.netlify/functions/share-run
 *   Authorization: Bearer <SHARE_TOKEN>
 *   Content-Type: application/json   (run export, see schemas/simulation-run.schema.json)
 *
 * Validates the payload (schema + size cap + numeric seed), then creates a
 * branch, commits the run file to public/data/runs/ and opens a pull request.
 * CI (runs-index workflow + test gate) regenerates the index and re-simulates
 * the run from its seed before merge. The token is never logged.
 *
 * Required env (Netlify site settings):
 *   SHARE_TOKEN        shared secret users enter in the app
 *   GITHUB_TOKEN       fine-grained PAT with contents:write + pull-requests:write
 * Optional:
 *   GITHUB_REPOSITORY  default "stritti/skip-bo-strategy-evaluation"
 *   SHARE_ALLOWED_ORIGINS  comma-separated allowlist (default: production site URL)
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import Ajv2020 from 'ajv/dist/2020.js';
import schema from '../../schemas/simulation-run.schema.json';

const MAX_BODY_BYTES = 500_000; // matches the CI size limit for run files
const RUNS_DIR = 'public/data/runs';
const DEFAULT_ALLOWED_ORIGINS = 'https://skip-bo-strategy-analysis.netlify.app';

function json(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
    });
}

function tokenMatches(provided: string | null, expected: string): boolean {
    if (!provided) return false;
    const a = createHash('sha256').update(provided).digest();
    const b = createHash('sha256').update(expected).digest();
    return timingSafeEqual(a, b);
}

function slugify(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

function extractMeta(data: unknown): { seed?: number; strategyP1?: string; strategyP2?: string } {
    const d = data as Record<string, unknown>;
    if (typeof d?.seed === 'number') {
        return { seed: d.seed, strategyP1: d.strategyP1 as string, strategyP2: d.strategyP2 as string };
    }
    const m = (d?.metadata ?? {}) as Record<string, unknown>;
    return {
        seed: typeof m.seed === 'number' ? m.seed : undefined,
        strategyP1: typeof m.strategyP1 === 'string' ? m.strategyP1 : undefined,
        strategyP2: typeof m.strategyP2 === 'string' ? m.strategyP2 : undefined
    };
}

async function github(repo: string, token: string, path: string, init: RequestInit = {}): Promise<Response> {
    return fetch(`https://api.github.com/repos/${repo}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'skip-bo-share-function',
            'Content-Type': 'application/json',
            ...(init.headers ?? {})
        }
    });
}

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

    const shareToken = process.env.SHARE_TOKEN;
    const ghToken = process.env.GITHUB_TOKEN;
    if (!shareToken || !ghToken) {
        console.error('share-run: SHARE_TOKEN or GITHUB_TOKEN not configured');
        return json({ error: 'sharing is not configured on this deployment' }, 503);
    }

    const origin = req.headers.get('origin');
    const allowed = (process.env.SHARE_ALLOWED_ORIGINS ?? DEFAULT_ALLOWED_ORIGINS)
        .split(',')
        .map(s => s.trim());
    if (origin && !allowed.includes(origin)) return json({ error: 'origin not allowed' }, 403);

    const auth = req.headers.get('authorization') ?? '';
    const provided = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : null;
    if (!tokenMatches(provided, shareToken)) return json({ error: 'unauthorized' }, 401);

    const raw = await req.text();
    if (Buffer.byteLength(raw, 'utf-8') > MAX_BODY_BYTES) {
        return json({ error: `run too large (max ${MAX_BODY_BYTES / 1000} KB)` }, 413);
    }

    let data: unknown;
    try {
        data = JSON.parse(raw);
    } catch {
        return json({ error: 'invalid JSON body' }, 400);
    }

    const validate = new Ajv2020({ strict: false, allErrors: true }).compile(schema);
    if (!validate(data)) {
        const details = (validate.errors ?? [])
            .slice(0, 5)
            .map(e => `${e.instancePath || '/'} ${e.message ?? ''}`.trim());
        return json({ error: 'schema validation failed', details }, 400);
    }

    const meta = extractMeta(data);
    if (typeof meta.seed !== 'number') return json({ error: 'numeric seed required' }, 400);

    const fileName = `${slugify(`${meta.strategyP1 ?? 'p1'}-vs-${meta.strategyP2 ?? 'p2'}-seed-${meta.seed}`)}.json`;
    const branch = `share/run-${fileName.replace(/\.json$/, '')}`;
    const repo = process.env.GITHUB_REPOSITORY ?? 'stritti/skip-bo-strategy-evaluation';
    const owner = repo.split('/')[0];

    const existRes = await github(repo, ghToken, `/contents/${RUNS_DIR}/${fileName}?ref=main`);
    if (existRes.status === 200) return json({ error: 'run already exists', file: fileName }, 409);

    const mainRef = await github(repo, ghToken, '/git/refs/heads/main');
    if (!mainRef.ok) return json({ error: 'cannot read main ref' }, 502);
    const sha = ((await mainRef.json()) as { object: { sha: string } }).object.sha;

    const branchRes = await github(repo, ghToken, '/git/refs', {
        method: 'POST',
        body: JSON.stringify({ ref: `refs/heads/${branch}`, sha })
    });
    if (branchRes.status !== 201 && branchRes.status !== 422) {
        return json({ error: 'cannot create branch' }, 502);
    }

    const putRes = await github(repo, ghToken, `/contents/${RUNS_DIR}/${fileName}`, {
        method: 'PUT',
        body: JSON.stringify({
            message: `feat(runs): shared run ${fileName}`,
            content: Buffer.from(raw, 'utf-8').toString('base64'),
            branch
        })
    });
    if (!putRes.ok) return json({ error: 'cannot commit run file' }, 502);

    const prTitle = `Shared run: ${meta.strategyP1 ?? '?'} vs ${meta.strategyP2 ?? '?'} (seed ${meta.seed})`;
    const prBody = [
        `Automatisch geteilter Simulationslauf (${fileName}).`,
        '',
        '- [ ] CI re-simuliert den Lauf aus dem Seed (Reproduzierbarkeits-Gate)',
        '- [ ] `index.json` / `runsIndex.ts` wurden per CI-Workflow regeneriert',
        '',
        'Quelle: Frontend-Share (`/.netlify/functions/share-run`).'
    ].join('\n');

    const prRes = await github(repo, ghToken, '/pulls', {
        method: 'POST',
        body: JSON.stringify({ title: prTitle, body: prBody, head: branch, base: 'main' })
    });
    if (prRes.status === 422) {
        const list = await github(repo, ghToken, `/pulls?head=${owner}:${branch}&state=open`);
        const arr = (await list.json()) as Array<{ html_url: string }>;
        if (Array.isArray(arr) && arr[0]?.html_url) {
            return json({ file: fileName, branch, prUrl: arr[0].html_url }, 201);
        }
        return json({ error: 'cannot create pull request' }, 502);
    }
    if (!prRes.ok) return json({ error: 'cannot create pull request' }, 502);
    const pr = (await prRes.json()) as { html_url: string };
    return json({ file: fileName, branch, prUrl: pr.html_url }, 201);
}
