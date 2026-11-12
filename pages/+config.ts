import type { Config } from 'vike/types';

export default {
    // Pre-render all pages at build time (SSG) — HTML files are written to dist/client/
    prerender: true
} satisfies Config;
