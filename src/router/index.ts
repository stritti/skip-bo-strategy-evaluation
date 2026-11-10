import type { RouteRecordRaw } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import DataExplorerView from '../views/DataExplorerView.vue';
import RulesView from '../views/RulesView.vue';
import StrategyView from '../views/StrategyView.vue';
import AnalysisView from '../views/AnalysisView.vue';
import ValidationView from '../views/ValidationView.vue';
import AboutView from '../views/AboutView.vue';
import RunView from '../views/RunView.vue';

declare module 'vue-router' {
    interface RouteMeta {
        seoKey?: string;
        locale?: 'de' | 'en';
    }
}

const baseRoutes = [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/data', name: 'data', component: DataExplorerView },
    { path: '/rules', name: 'rules', component: RulesView },
    { path: '/strategy', name: 'strategy', component: StrategyView },
    { path: '/analysis', name: 'analysis', component: AnalysisView },
    { path: '/validation', name: 'validation', component: ValidationView },
    { path: '/runs/:seed', name: 'run', component: RunView }
] as const;

export const routes: RouteRecordRaw[] = baseRoutes.flatMap((r) => [
    {
        path: r.path,
        name: r.name,
        component: r.component,
        meta: { seoKey: r.path, locale: 'de' as const }
    },
    {
        path: r.path === '/' ? '/en' : `/en${r.path}`,
        name: `en-${r.name}`,
        component: r.component,
        meta: { seoKey: r.path, locale: 'en' as const }
    }
]);
