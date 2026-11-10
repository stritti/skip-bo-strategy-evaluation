import type { RouteRecordRaw } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import DataExplorerView from '../views/DataExplorerView.vue';
import RulesView from '../views/RulesView.vue';
import StrategyView from '../views/StrategyView.vue';
import AnalysisView from '../views/AnalysisView.vue';
import ValidationView from '../views/ValidationView.vue';
import AboutView from '../views/AboutView.vue';
import { routeSeo, type PageSeo } from '../utils/seo';

declare module 'vue-router' {
    interface RouteMeta {
        seo?: PageSeo;
    }
}

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'dashboard',
        component: DashboardView,
        meta: { seo: routeSeo['/'] }
    },
    {
        path: '/about',
        name: 'about',
        component: AboutView,
        meta: { seo: routeSeo['/about'] }
    },
    {
        path: '/data',
        name: 'data',
        component: DataExplorerView,
        meta: { seo: routeSeo['/data'] }
    },
    {
        path: '/rules',
        name: 'rules',
        component: RulesView,
        meta: { seo: routeSeo['/rules'] }
    },
    {
        path: '/strategy',
        name: 'strategy',
        component: StrategyView,
        meta: { seo: routeSeo['/strategy'] }
    },
    {
        path: '/analysis',
        name: 'analysis',
        component: AnalysisView,
        meta: { seo: routeSeo['/analysis'] }
    },
    {
        path: '/validation',
        name: 'validation',
        component: ValidationView,
        meta: { seo: routeSeo['/validation'] }
    }
];
