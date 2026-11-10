import { ViteSSG } from 'vite-ssg'
import '@phosphor-icons/web/regular'
import '@phosphor-icons/web/bold'
import '@phosphor-icons/web/fill'
// Self-hosted fonts (previously loaded from Google Fonts)
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/700.css'
import './assets/styles/main.css'
import './assets/styles/custom.css'
import App from './App.vue'
import { routes } from './router'
import { applyPageSeo, DEFAULT_SEO } from './utils/seo'

export const createApp = ViteSSG(
    App,
    { routes, base: import.meta.env.BASE_URL },
    ({ router }) => {
        router.afterEach((to) => {
            applyPageSeo(to.meta.seo ?? DEFAULT_SEO, to.path);
        });
    }
)
