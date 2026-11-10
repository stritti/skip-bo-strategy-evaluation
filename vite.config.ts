import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import {
    DEFAULT_SEO,
    resolveRouteSeo,
    runSeoFor,
    runJsonLdHtml,
    runIdOfFile,
    pageUrl,
    dePathOf,
    enPathOf,
    normalizePath
} from './src/utils/seo'
import { runsIndex } from './src/generated/runsIndex'

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

// Shared runs committed to public/data/runs/ get a prerendered permalink /runs/<runId>
const runPaths = runsIndex.flatMap(e => [`/runs/${runIdOfFile(e.file)}`, `/en/runs/${runIdOfFile(e.file)}`])

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
            const meta = dePath.startsWith('/runs/') ? (runSeoFor(dePath, locale) ?? seo) : (seo ?? DEFAULT_SEO)
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
            html = html.replace('<!--RUN-JSONLD-->', dePath.startsWith('/runs/') ? runJsonLdHtml(dePath, url) : '')
            return html
        }
    }
})
