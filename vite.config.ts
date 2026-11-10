import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { DEFAULT_SEO, resolveRouteSeo, pageUrl, dePathOf, enPathOf } from './src/utils/seo'

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
        includeAllRoutes: true,
        onBeforePageRender(route, indexHTML) {
            const { seo, locale } = resolveRouteSeo(route)
            const meta = seo ?? DEFAULT_SEO
            const url = pageUrl(route)
            const dePath = dePathOf(route)
            let html = indexHTML.replace(
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
            return html
        }
    }
})
