// https://vike.dev/onBeforePrerenderStart
import { routes } from '../src/router';
import { runsIndex } from '../src/generated/runsIndex';
import { runIdOfFile } from '../src/utils/seo';

export { onBeforePrerenderStart };

async function onBeforePrerenderStart(): Promise<string[]> {
    // Static routes (de + en variants), excluding parameterized routes
    const staticUrls = routes
        .map((r) => r.path)
        .filter((p) => !p.includes(':'))
        .flatMap((p) => (p === '/' ? ['/', '/en'] : p.startsWith('/en') ? [p] : [p, `/en${p}`]));

    // Per-run permalinks /runs/<runId> (de + en)
    const runUrls = runsIndex.flatMap((e) => {
        const id = runIdOfFile(e.file);
        return [`/runs/${id}`, `/en/runs/${id}`];
    });

    return [...new Set([...staticUrls, ...runUrls])];
}
