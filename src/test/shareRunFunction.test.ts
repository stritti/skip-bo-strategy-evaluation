import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler from '../../netlify/functions/share-run';

const SHARE_TOKEN = 'test-share-token';
const GH_TOKEN = 'ghp_test_token';
const ENDPOINT = 'https://skip-bo-strategy-analysis.netlify.app/.netlify/functions/share-run';

const validRun = {
    version: 1,
    metadata: {
        exportDate: new Date().toISOString(),
        totalGames: 2,
        strategyP1: 'Optimiert',
        strategyP2: 'Zufall',
        seed: 123
    },
    results: [
        { id: 1, winner: 'P1', winnerId: 0, turns: 42, duration: 3, starter: 'P1', jokers: 1, strategy: 'Optimiert', seed: 1001 },
        { id: 2, winner: 'P2', winnerId: 1, turns: 55, duration: 4, starter: 'P2', jokers: 0, strategy: 'Zufall', seed: 1002 }
    ]
};

function makeRequest(body: string, token: string | null = SHARE_TOKEN, method = 'POST', origin?: string): Request {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (origin) headers['Origin'] = origin;
    return new Request(ENDPOINT, { method, headers, body: method === 'GET' || method === 'HEAD' ? undefined : body });
}

function mockGitHub(opts: { duplicate?: boolean; branchExists?: boolean; prExists?: boolean } = {}) {
    const calls: Array<{ url: string; method: string; body?: string }> = [];
    const mock = vi.fn(async (url: unknown, init?: RequestInit): Promise<Response> => {
        const u = String(url);
        const m = init?.method ?? 'GET';
        const body = typeof init?.body === 'string' ? init.body : undefined;
        calls.push({ url: u, method: m, body });
        const json = (data: unknown, status = 200) =>
            new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
        if (u.includes('/contents/public/data/runs/') && m === 'GET') {
            return opts.duplicate ? json({ name: 'x.json' }) : new Response('Not Found', { status: 404 });
        }
        if (u.includes('/git/refs/heads/main')) return json({ object: { sha: 'abc123' } });
        if (u.includes('/git/refs') && m === 'POST') {
            return opts.branchExists ? json({ message: 'Reference already exists' }, 422) : json({ ref: 'refs/heads/x' }, 201);
        }
        if (u.includes('/contents/public/data/runs/') && m === 'PUT') return json({ content: { path: 'public/data/runs/x.json' } }, 201);
        if (u.includes('/pulls') && m === 'POST') {
            return opts.prExists
                ? json({ message: 'Validation Failed' }, 422)
                : json({ html_url: 'https://github.com/stritti/skip-bo-strategy-evaluation/pull/99' }, 201);
        }
        if (u.includes('/pulls') && m === 'GET') return json([{ html_url: 'https://github.com/stritti/skip-bo-strategy-evaluation/pull/98' }]);
        return json({ message: `unexpected ${m} ${u}` }, 500);
    });
    return { mock, calls };
}

beforeEach(() => {
    process.env.SHARE_TOKEN = SHARE_TOKEN;
    process.env.GITHUB_TOKEN = GH_TOKEN;
    process.env.GITHUB_REPOSITORY = 'stritti/skip-bo-strategy-evaluation';
});

afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.SHARE_TOKEN;
    delete process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_REPOSITORY;
    delete process.env.SHARE_ALLOWED_ORIGINS;
});

describe('share-run function (netlify)', () => {
    it('rejects non-POST methods with 405', async () => {
        const res = await handler(makeRequest('', SHARE_TOKEN, 'GET'));
        expect(res.status).toBe(405);
    });

    it('returns 503 when env is not configured', async () => {
        delete process.env.SHARE_TOKEN;
        const res = await handler(makeRequest(JSON.stringify(validRun)));
        expect(res.status).toBe(503);
    });

    it('rejects missing or wrong token with 401 (and never touches GitHub)', async () => {
        const { mock, calls } = mockGitHub();
        vi.stubGlobal('fetch', mock);
        expect((await handler(makeRequest(JSON.stringify(validRun), null))).status).toBe(401);
        expect((await handler(makeRequest(JSON.stringify(validRun), 'wrong'))).status).toBe(401);
        expect(calls.length).toBe(0);
    });

    it('rejects a disallowed Origin with 403', async () => {
        const res = await handler(makeRequest(JSON.stringify(validRun), SHARE_TOKEN, 'POST', 'https://evil.example'));
        expect(res.status).toBe(403);
    });

    it('accepts the production origin', async () => {
        const { mock } = mockGitHub();
        vi.stubGlobal('fetch', mock);
        const res = await handler(
            makeRequest(JSON.stringify(validRun), SHARE_TOKEN, 'POST', 'https://skip-bo-strategy-analysis.netlify.app')
        );
        expect(res.status).toBe(201);
    });

    it('rejects oversized bodies with 413', async () => {
        const res = await handler(makeRequest('x'.repeat(500_001)));
        expect(res.status).toBe(413);
    });

    it('rejects invalid JSON with 400', async () => {
        const res = await handler(makeRequest('{not json'));
        expect(res.status).toBe(400);
    });

    it('rejects schema-invalid runs with 400 (seed missing)', async () => {
        const { mock } = mockGitHub();
        vi.stubGlobal('fetch', mock);
        const bad = { version: 1, metadata: { strategyP1: 'Optimiert', strategyP2: 'Zufall' }, results: validRun.results };
        const res = await handler(makeRequest(JSON.stringify(bad)));
        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toMatch(/schema/);
    });

    it('rejects duplicates with 409', async () => {
        const { mock } = mockGitHub({ duplicate: true });
        vi.stubGlobal('fetch', mock);
        const res = await handler(makeRequest(JSON.stringify(validRun)));
        expect(res.status).toBe(409);
    });

    it('creates branch, commits the run file and opens a PR (201)', async () => {
        const { mock, calls } = mockGitHub();
        vi.stubGlobal('fetch', mock);
        const res = await handler(makeRequest(JSON.stringify(validRun)));
        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body.file).toBe('optimiert-vs-zufall-seed-123.json');
        expect(body.branch).toBe('share/run-optimiert-vs-zufall-seed-123');
        expect(body.prUrl).toBe('https://github.com/stritti/skip-bo-strategy-evaluation/pull/99');

        const put = calls.find(c => c.method === 'PUT' && c.url.includes('/contents/public/data/runs/'));
        expect(put).toBeDefined();
        const putBody = JSON.parse(put!.body!);
        expect(putBody.branch).toBe(body.branch);
        expect(Buffer.from(putBody.content, 'base64').toString('utf-8')).toBe(JSON.stringify(validRun));

        const pr = calls.find(c => c.method === 'POST' && c.url.endsWith('/pulls'));
        expect(pr).toBeDefined();
        expect(JSON.parse(pr!.body!).base).toBe('main');

        const authHeaders = (mock.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
        expect(authHeaders['Authorization']).toBe(`Bearer ${GH_TOKEN}`);
    });

    it('reuses an existing branch and returns the already-open PR on 422', async () => {
        const { mock } = mockGitHub({ branchExists: true, prExists: true });
        vi.stubGlobal('fetch', mock);
        const res = await handler(makeRequest(JSON.stringify(validRun)));
        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body.prUrl).toBe('https://github.com/stritti/skip-bo-strategy-evaluation/pull/98');
    });
});
