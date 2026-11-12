// https://vike.dev/onRenderHtml
import type { Component } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { dangerouslySkipEscape } from 'vike/server';
import type { PageContextServer } from 'vike/types';
import { createApp } from '../src/app';
import { applyServerSeo } from '../src/utils/seo';
import indexHtml from '../index.html?raw';

export { onRenderHtml };

async function onRenderHtml(pageContext: PageContextServer) {
    const { app, router } = createApp({ Page: pageContext.Page as Component });

    // set the router to the desired URL before rendering
    router.push(pageContext.urlPathname);
    await router.isReady();

    const appHtml = await renderToString(app);

    const documentHtml = applyServerSeo(indexHtml, pageContext.urlPathname).replace(
        '<div id="app"></div>',
        `<div id="app">${appHtml}</div>`
    );

    return { documentHtml: dangerouslySkipEscape(documentHtml) };
}
