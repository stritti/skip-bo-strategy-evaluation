
import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import DataExplorerView from '../views/DataExplorerView.vue';
import RulesView from '../views/RulesView.vue';
import StrategyView from '../views/StrategyView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: DashboardView
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
        }
    ]
});

export default router;
