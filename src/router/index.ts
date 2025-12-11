import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import DataExplorerView from '../views/DataExplorerView.vue';
import RulesView from '../views/RulesView.vue';
import StrategyView from '../views/StrategyView.vue';
import AnalysisView from '../views/AnalysisView.vue';
import AboutView from '../views/AboutView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: DashboardView
        },
        {
            path: '/about',
            name: 'about',
            component: AboutView
        },
        {
            path: '/data',
            name: 'data',
            component: DataExplorerView
        },
        {
            path: '/rules',
            name: 'rules',
            component: RulesView
        },
        {
            path: '/strategy',
            name: 'strategy',
            component: StrategyView
        },
        {
            path: '/analysis',
            name: 'analysis',
            component: AnalysisView
        }
    ]
});

export default router;
