export const SITE_URL = 'https://skip-bo-strategy-analysis.netlify.app';
export const SITE_NAME = 'Skip-Bo Strategy Analyzer';
export const SITE_LOCALE = 'de';

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

export function applyPageSeo(seo: PageSeo, path: string): void {
    if (typeof document === 'undefined') return;
    const url = pageUrl(path);

    document.title = seo.title;

    upsertMeta('name', 'description', seo.description);
    upsertLink('canonical', url);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.description);
    upsertMeta('property', 'og:url', url);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.description);

    upsertLink('alternate', url, 'hreflang', SITE_LOCALE);
    upsertLink('alternate', url, 'hreflang', 'x-default');
}

export const routeSeo: Record<string, PageSeo> = {
    '/': {
        title: 'Skip-Bo Strategy Analyzer – Skip-Bo Strategien simulieren & wissenschaftlich analysieren',
        description:
            'Simulieren Sie tausende Skip-Bo-Runden direkt im Browser und vergleichen Sie Strategien (Optimiert, Zufall, Spontan) wissenschaftlich: Gewinnraten, Spieldauer, statistische Signifikanz und Rohdaten.'
    },
    '/about': {
        title: 'Über das Projekt | Skip-Bo Strategy Analyzer',
        description:
            'Hintergrund, Technologie und Methodik des Skip-Bo Strategy Analyzers: eine Browser-App zur wissenschaftlichen Evaluation von Skip-Bo Strategien.'
    },
    '/data': {
        title: 'Data Explorer – Rohdaten der Skip-Bo Simulationen | Skip-Bo Strategy Analyzer',
        description:
            'Rohdaten aller Skip-Bo Simulationsläufe: Sieger, Züge, Jokereinsatz und Spieldauer in einer sortier- und durchsuchbaren Tabelle.'
    },
    '/rules': {
        title: 'Offizielle Skip-Bo Spielregeln einfach erklärt | Skip-Bo Strategy Analyzer',
        description:
            'Die offiziellen Skip-Bo Regeln verständlich erklärt: Spielziel, Stock, Bau- und Ablagestapel, Joker und Siegbedingung.'
    },
    '/strategy': {
        title: 'Skip-Bo Strategien im Vergleich: Optimiert, Zufall, Spontan | Skip-Bo Strategy Analyzer',
        description:
            'Wie die Skip-Bo Strategien Optimiert, Zufall, Spontan und Fortgeschritten funktionieren und welche Gewinnchancen sie im direkten Duell bieten.'
    },
    '/analysis': {
        title: 'Die perfekte Skip-Bo Strategie – Erkenntnisse aus 1.000.000 Simulationen | Skip-Bo Strategy Analyzer',
        description:
            'Erkenntnisse aus 1.000.000 simulierten Skip-Bo-Runden mit einem Reinforcement-Learning-Agenten (TD-λ): So spielen Sie Skip-Bo optimal.'
    },
    '/validation': {
        title: 'Validierung & Methodik der Skip-Bo Analyse | Skip-Bo Strategy Analyzer',
        description:
            'Wie die Skip-Bo Simulationen wissenschaftlich validiert werden: statistische Signifikanz, gepaarte Tests, Effektstärken und Power-Analyse.'
    }
};
