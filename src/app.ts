import type { Component } from 'vue';
import { createApp as createVueApp, createSSRApp } from 'vue';
import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/bold';
import '@phosphor-icons/web/fill';
// Self-hosted fonts (previously loaded from Google Fonts)
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import './assets/styles/main.css';
import './assets/styles/custom.css';
import { createAppRouter } from './router';
import { createAppI18n, isEnPath, LOCALE_STORAGE_KEY } from './i18n';
import { applyPageSeo, resolveRouteSeo } from './utils/seo';
import { createAppPinia } from './stores/pinia';

export function createApp({ Page }: { Page: Component }) {
    const app = import.meta.env.SSR ? createSSRApp(Page) : createVueApp(Page);
    const router = createAppRouter();
    app.use(router);
    app.use(createAppPinia());
    const i18n = createAppI18n();
    app.use(i18n);

    router.beforeEach((to, _from, next) => {
        const locale = isEnPath(to.path) ? 'en' : 'de';
        i18n.global.locale.value = locale;
        if (typeof document !== 'undefined') {
            document.documentElement.lang = locale;
        }
        if (
            !import.meta.env.SSR &&
            to.path === '/' &&
            typeof localStorage !== 'undefined' &&
            localStorage.getItem(LOCALE_STORAGE_KEY) === 'en'
        ) {
            next({ path: '/en', query: to.query });
            return;
        }
        next();
    });

    router.afterEach((to) => {
        applyPageSeo(resolveRouteSeo(to.path).seo, to.path);
    });

    return { app, router };
}
