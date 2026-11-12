// https://vike.dev/onRenderClient
import type { Component } from 'vue';
import type { PageContextClient } from 'vike/types';
import { createApp } from '../src/app';

export { onRenderClient };

async function onRenderClient(pageContext: PageContextClient) {
    const { app, router } = createApp({ Page: pageContext.Page as Component });
    await router.isReady();
    app.mount('#app');
}
