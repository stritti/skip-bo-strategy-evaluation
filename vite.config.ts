import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { DEFAULT_SEO, resolveRouteSeo, pageUrl, dePathOf, enPathOf, normalizePath, SITE_URL } from './src/utils/seo'

const escapeAttr = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const replaceMetaContent = (html: string, attr: 'name' | 'property', key: string, content: string): string =>
    html.replace(
        new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`),
        `$1${escapeAttr(content)}$2`
    )

const replaceLinkHref = (html: string, rel: string, href: string, extraAttr?: string, extraValue?: string): string => {
    const extra = extraAttr ? `\\s+${extraAttr}="${extraValue}"` : ''
    return html.replace(
        new RegExp(`(<link\\s+rel="${rel}"${extra}\\s+href=")[^"]*(")`),
        `$1${escapeAttr(href)}$2`
    )
}

// Shared runs committed to public/data/runs/ get a prerendered permalink /runs/<seed>
const runsIndex = JSON.parse(
    readFileSync(fileURLToPath(new URL('./public/data/runs/index.json', import.meta.url)), 'utf-8')
) as { file: string; label?: string; strategyP1?: string; strategyP2?: string; gamesCount?: number; winsP1?: number; seed?: number }[]

const runPaths = runsIndex.flatMap(e => e.seed !== undefined ? [`/runs/${e.seed}`, `/en/runs/${e.seed}`] : [])

const runSeoFor = (deRoute: string, locale: 'de' | 'en') => {
    const seed = deRoute.split('/').filter(Boolean).pop()
    const entry = runsIndex.find(e => String(e.seed) === seed)
    if (!entry) return null
    const winRate = entry.gamesCount ? ((entry.winsP1 ?? 0) / entry.gamesCount * 100).toFixed(1) : '0'
    return locale === 'en'
        ? {
            title: `${entry.label ?? `Run ${seed}`} | Skip-Bo Strategy Analyzer`,
            description: `${entry.strategyP1} vs. ${entry.strategyP2} — N=${entry.gamesCount}, win rate P1 ${winRate}%, seed ${seed}. Reproducible: re-simulated in CI.`
        }
        : {
            title: `${entry.label ?? `Lauf ${seed}`} | Skip-Bo Strategy Analyzer`,
            description: `${entry.strategyP1} vs. ${entry.strategyP2} — N=${entry.gamesCount}, Gewinnrate P1 ${winRate}%, Seed ${seed}. Reproduzierbar: in CI re-simuliert.`
        }
}

const runJsonLd = (deRoute: string, url: string): string => {
    const seed = deRoute.split('/').filter(Boolean).pop()
    const entry = runsIndex.find(e => String(e.seed) === seed)
    if (!entry) return ''
    const dataset = {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name: entry.label ?? `Skip-Bo simulation run (seed ${seed})`,
        description: `${entry.strategyP1} vs. ${entry.strategyP2}, N=${entry.gamesCount}, wins P1/P2: ${entry.winsP1}/${entry.winsP2}, seed ${seed}`,
        url,
        license: 'https://opensource.org/licenses/MIT',
        distribution: {
            '@type': 'DataDownload',
            encodingFormat: 'application/json',
            contentUrl: `${SITE_URL}/data/runs/${entry.file}`
        }
    }
    return `<script type="application/ld+json">${JSON.stringify(dataset)}</script>`
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        vue()
    ],
    base: '/', // Root path for Netlify deployment
    ssgOptions: {
        script: 'async',
        formatting: 'minify',
        dirStyle: 'nested',
        includeAllRoutes: false,
        includedRoutes: (paths) => [...paths.filter(p => !p.includes(':')), ...runPaths],
        onBeforePageRender(route, indexHTML) {
            const normalized = normalizePath(route)
            const { seo, locale } = resolveRouteSeo(normalized)
            const dePath = dePathOf(normalized)
            const runSeo = dePath.startsWith('/runs/') ? runSeoFor(dePath, locale) : null
            const meta = runSeo ?? seo ?? DEFAULT_SEO
            const url = pageUrl(normalized)
            let html = indexHTML.replace(
                /<html lang="[^"]*">/,
                `<html lang="${locale}">`
            )
            html = html.replace(
                /<title>[^<]*<\/title>/,
                `<title>${escapeAttr(meta.title)}</title>`
            )
            html = replaceMetaContent(html, 'name', 'description', meta.description)
            html = replaceMetaContent(html, 'property', 'og:locale', locale === 'en' ? 'en_US' : 'de_DE')
            html = replaceMetaContent(html, 'property', 'og:title', meta.title)
            html = replaceMetaContent(html, 'property', 'og:description', meta.description)
            html = replaceMetaContent(html, 'property', 'og:url', url)
            html = replaceMetaContent(html, 'name', 'twitter:title', meta.title)
            html = replaceMetaContent(html, 'name', 'twitter:description', meta.description)
            html = replaceLinkHref(html, 'canonical', url)
            html = replaceLinkHref(html, 'alternate', pageUrl(dePath), 'hreflang', 'de')
            html = replaceLinkHref(html, 'alternate', pageUrl(enPathOf(dePath)), 'hreflang', 'en')
            html = replaceLinkHref(html, 'alternate', pageUrl(dePath), 'hreflang', 'x-default')
            html = html.replace('<!--RUN-JSONLD-->', dePath.startsWith('/runs/') ? runJsonLd(dePath, url) : '')
            return html
        }
    }
})
