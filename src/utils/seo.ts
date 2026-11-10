import { runsIndex } from '../generated/runsIndex';

export const SITE_URL = 'https://skip-bo-strategy-analysis.netlify.app';
export const SITE_NAME = 'Skip-Bo Strategy Analyzer';
export const SITE_LOCALE = 'de';

// Run permalinks are keyed by file basename (unique), e.g. /runs/<file-without-.json>.
// Seed is accepted as a fallback for readability/backward compatibility.
export function runIdOfFile(file: string): string {
    return file.replace(/\.json$/, '');
}

export function findRunEntry(dePath: string) {
    const parts = dePath.split('/').filter(Boolean);
    if (parts[0] !== 'runs' || parts.length !== 2) return null;
    const id = parts[1];
    return runsIndex.find(e => runIdOfFile(e.file) === id || String(e.seed) === id) ?? null;
}

export function runSeoFor(dePath: string, locale: Locale): PageSeo | null {
    const entry = findRunEntry(dePath);
    if (!entry) return null;
    const winRate = entry.gamesCount ? ((entry.winsP1 ?? 0) / entry.gamesCount * 100).toFixed(1) : '0';
    return locale === 'en'
        ? {
            title: `${entry.label ?? `Run ${entry.seed}`} | ${SITE_NAME}`,
            description: `${entry.strategyP1} vs. ${entry.strategyP2} — N=${entry.gamesCount}, win rate P1 ${winRate}%, seed ${entry.seed}. Reproducible: re-simulated in CI.`
        }
        : {
            title: `${entry.label ?? `Lauf ${entry.seed}`} | ${SITE_NAME}`,
            description: `${entry.strategyP1} vs. ${entry.strategyP2} — N=${entry.gamesCount}, Gewinnrate P1 ${winRate}%, Seed ${entry.seed}. Reproduzierbar: in CI re-simuliert.`
        };
}

export function runJsonLdObject(dePath: string, url: string) {
    const entry = findRunEntry(dePath);
    if (!entry) return null;
    return {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name: entry.label ?? `Skip-Bo simulation run (seed ${entry.seed})`,
        description: `${entry.strategyP1} vs. ${entry.strategyP2}, N=${entry.gamesCount}, wins P1/P2: ${entry.winsP1}/${entry.winsP2}, seed ${entry.seed}`,
        url,
        license: 'https://opensource.org/licenses/MIT',
        distribution: {
            '@type': 'DataDownload',
            encodingFormat: 'application/json',
            contentUrl: `${SITE_URL}/data/runs/${entry.file}`
        }
    };
}

export function runJsonLdHtml(dePath: string, url: string): string {
    const obj = runJsonLdObject(dePath, url);
    if (!obj) return '';
    return `<script type="application/ld+json" data-run-jsonld>${JSON.stringify(obj)}</script>`;
}

export interface PageSeo {
    title: string;
    description: string;
}

export const DEFAULT_SEO: PageSeo = {
    title: `${SITE_NAME} – Skip-Bo Strategien simulieren & wissenschaftlich analysieren`,
    description:
        'Simulieren Sie tausende Skip-Bo-Runden direkt im Browser und vergleichen Sie Strategien (Optimiert, Zufall, Spontan) wissenschaftlich: Gewinnraten, Spieldauer, statistische Signifikanz und Rohdaten.'
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string, extraAttr?: string, extraValue?: string): void {
    const selector = extraAttr
        ? `link[rel="${rel}"][${extraAttr}="${extraValue}"]`
        : `link[rel="${rel}"]`;
    let el = document.head.querySelector<HTMLLinkElement>(selector);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        if (extraAttr && extraValue) el.setAttribute(extraAttr, extraValue);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
}

export function pageUrl(path: string): string {
    return `${SITE_URL}${path === '/' ? '/' : path}`;
}

export type Locale = 'de' | 'en';

export function normalizePath(path: string): string {
    if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
    return path;
}

export function isEnPath(path: string): boolean {
    const p = normalizePath(path);
    return p === '/en' || p.startsWith('/en/');
}

export function dePathOf(path: string): string {
    const p = normalizePath(path);
    if (p === '/en') return '/';
    return isEnPath(p) ? p.slice(3) : p;
}

export function enPathOf(dePath: string): string {
    return dePath === '/' ? '/en' : `/en${dePath}`;
}

export function applyPageSeo(seo: PageSeo, rawPath: string): void {
    if (typeof document === 'undefined') return;
    const path = normalizePath(rawPath);
    const url = pageUrl(path);
    const dePath = dePathOf(path);
    const locale: Locale = isEnPath(path) ? 'en' : 'de';

    document.title = seo.title;
    document.documentElement.lang = locale;

    upsertMeta('name', 'description', seo.description);
    upsertLink('canonical', url);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:locale', locale === 'en' ? 'en_US' : 'de_DE');
    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.description);
    upsertMeta('property', 'og:url', url);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.description);

    upsertLink('alternate', pageUrl(dePath), 'hreflang', 'de');
    upsertLink('alternate', pageUrl(enPathOf(dePath)), 'hreflang', 'en');
    upsertLink('alternate', pageUrl(dePath), 'hreflang', 'x-default');

    // Per-run Dataset JSON-LD: upsert on run pages, remove elsewhere (client-side navigation)
    const RUN_JSONLD_SELECTOR = 'script[type="application/ld+json"][data-run-jsonld]';
    const existingJsonLd = document.head.querySelector(RUN_JSONLD_SELECTOR);
    const jsonLdObj = runJsonLdObject(dePath, url);
    if (jsonLdObj) {
        const script = existingJsonLd ?? document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-run-jsonld', '');
        script.textContent = JSON.stringify(jsonLdObj);
        if (!existingJsonLd) document.head.appendChild(script);
    } else if (existingJsonLd) {
        existingJsonLd.remove();
    }
}

export function resolveRouteSeo(path: string): { seo: PageSeo; locale: Locale } {
    const p = dePathOf(path);
    const locale: Locale = isEnPath(path) ? 'en' : 'de';
    if (p.startsWith('/runs/')) {
        const runSeo = runSeoFor(p, locale);
        if (runSeo) return { seo: runSeo, locale };
        return { seo: routeSeo['/runs/:runId'][locale], locale };
    }
    const entry = routeSeo[p] ?? routeSeo['/'];
    return { seo: entry[locale], locale };
}

export const routeSeo: Record<string, { de: PageSeo; en: PageSeo }> = {
    '/': {
        de: {
            title: 'Skip-Bo Strategy Analyzer – Skip-Bo Strategien simulieren & wissenschaftlich analysieren',
            description:
                'Simulieren Sie tausende Skip-Bo-Runden direkt im Browser und vergleichen Sie Strategien (Optimiert, Zufall, Spontan) wissenschaftlich: Gewinnraten, Spieldauer, statistische Signifikanz und Rohdaten.'
        },
        en: {
            title: 'Skip-Bo Strategy Analyzer – Simulate & scientifically analyze Skip-Bo strategies',
            description:
                'Simulate thousands of real Skip-Bo games right in your browser and compare strategies (Optimized, Random, Impulsive) scientifically: win rates, game duration, statistical significance and raw data.'
        }
    },
    '/about': {
        de: {
            title: 'Über das Projekt | Skip-Bo Strategy Analyzer',
            description:
                'Hintergrund, Technologie und Methodik des Skip-Bo Strategy Analyzers: eine Browser-App zur wissenschaftlichen Evaluation von Skip-Bo Strategien.'
        },
        en: {
            title: 'About the Project | Skip-Bo Strategy Analyzer',
            description:
                'Background, technology and methodology of the Skip-Bo Strategy Analyzer: a browser app for the scientific evaluation of Skip-Bo strategies.'
        }
    },
    '/data': {
        de: {
            title: 'Data Explorer – Rohdaten der Skip-Bo Simulationen | Skip-Bo Strategy Analyzer',
            description:
                'Rohdaten aller Skip-Bo Simulationsläufe: Sieger, Züge, Jokereinsatz und Spieldauer in einer sortier- und durchsuchbaren Tabelle.'
        },
        en: {
            title: 'Data Explorer – Raw data of the Skip-Bo simulations | Skip-Bo Strategy Analyzer',
            description:
                'Raw data of all Skip-Bo simulation runs: winner, turns, joker usage and game duration in a sortable, searchable table.'
        }
    },
    '/rules': {
        de: {
            title: 'Offizielle Skip-Bo Spielregeln einfach erklärt | Skip-Bo Strategy Analyzer',
            description:
                'Die offiziellen Skip-Bo Regeln verständlich erklärt: Spielziel, Stock, Bau- und Ablagestapel, Joker und Siegbedingung.'
        },
        en: {
            title: 'Official Skip-Bo game rules explained simply | Skip-Bo Strategy Analyzer',
            description:
                'The official Skip-Bo rules explained: objective, stockpile, build and discard piles, jokers and the winning condition.'
        }
    },
    '/strategy': {
        de: {
            title: 'Skip-Bo Strategien im Vergleich: Optimiert, Zufall, Spontan | Skip-Bo Strategy Analyzer',
            description:
                'Wie die Skip-Bo Strategien Optimiert, Zufall, Spontan und Fortgeschritten funktionieren und welche Gewinnchancen sie im direkten Duell bieten.'
        },
        en: {
            title: 'Skip-Bo strategies compared: Optimized, Random, Impulsive | Skip-Bo Strategy Analyzer',
            description:
                'How the Skip-Bo strategies Optimized, Random, Impulsive and Advanced work and what their odds are in a direct duel.'
        }
    },
    '/analysis': {
        de: {
            title: 'Die perfekte Skip-Bo Strategie – Erkenntnisse aus 1.000.000 Simulationen | Skip-Bo Strategy Analyzer',
            description:
                'Erkenntnisse aus 1.000.000 simulierten Skip-Bo-Runden mit einem Reinforcement-Learning-Agenten (TD-λ): So spielen Sie Skip-Bo optimal.'
        },
        en: {
            title: 'The perfect Skip-Bo strategy – insights from 1,000,000 simulations | Skip-Bo Strategy Analyzer',
            description:
                'Insights from 1,000,000 simulated Skip-Bo rounds with a reinforcement learning agent (TD-λ): how to play Skip-Bo optimally.'
        }
    },
    '/validation': {
        de: {
            title: 'Validierung & Methodik der Skip-Bo Analyse | Skip-Bo Strategy Analyzer',
            description:
                'Wie die Skip-Bo Simulationen wissenschaftlich validiert werden: statistische Signifikanz, gepaarte Tests, Effektstärken und Power-Analyse.'
        },
        en: {
            title: 'Validation & methodology of the Skip-Bo analysis | Skip-Bo Strategy Analyzer',
            description:
                'How the Skip-Bo simulations are scientifically validated: statistical significance, paired tests, effect sizes and power analysis.'
        }
    },
    '/runs/:runId': {
        de: {
            title: 'Geteilter Simulationslauf | Skip-Bo Strategy Analyzer',
            description:
                'Geteilter, seed-reproduzierbarer Skip-Bo Simulationslauf mit Aggregaten und allen Einzelergebnissen als JSON (CI re-simuliert jeden Lauf).'
        },
        en: {
            title: 'Shared simulation run | Skip-Bo Strategy Analyzer',
            description:
                'Shared, seed-reproducible Skip-Bo simulation run with aggregates and all per-game results as JSON (CI re-simulates every run).'
        }
    }
};
