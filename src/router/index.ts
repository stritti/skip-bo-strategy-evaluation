import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import DataExplorerView from '../views/DataExplorerView.vue';
import RulesView from '../views/RulesView.vue';
import StrategyView from '../views/StrategyView.vue';
import AnalysisView from '../views/AnalysisView.vue';
import ValidationView from '../views/ValidationView.vue';
import AboutView from '../views/AboutView.vue';
import { applyPageSeo, DEFAULT_SEO, type PageSeo } from '../utils/seo';

declare module 'vue-router' {
    interface RouteMeta {
        seo?: PageSeo;
    }
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: DashboardView,
            meta: {
                seo: {
                    title: 'Skip-Bo Strategy Analyzer – Skip-Bo Strategien simulieren & wissenschaftlich analysieren',
                    description:
                        'Simulieren Sie tausende Skip-Bo-Runden direkt im Browser und vergleichen Sie Strategien (Optimiert, Zufall, Spontan) wissenschaftlich: Gewinnraten, Spieldauer, statistische Signifikanz und Rohdaten.'
                }
            }
        },
        {
            path: '/about',
            name: 'about',
            component: AboutView,
            meta: {
                seo: {
                    title: 'Über das Projekt | Skip-Bo Strategy Analyzer',
                    description:
                        'Hintergrund, Technologie und Methodik des Skip-Bo Strategy Analyzers: eine Browser-App zur wissenschaftlichen Evaluation von Skip-Bo Strategien.'
                }
            }
        },
        {
            path: '/data',
            name: 'data',
            component: DataExplorerView,
            meta: {
                seo: {
                    title: 'Data Explorer – Rohdaten der Skip-Bo Simulationen | Skip-Bo Strategy Analyzer',
                    description:
                        'Rohdaten aller Skip-Bo Simulationsläufe: Sieger, Züge, Jokereinsatz und Spieldauer in einer sortier- und durchsuchbaren Tabelle.'
                }
            }
        },
        {
            path: '/rules',
            name: 'rules',
            component: RulesView,
            meta: {
                seo: {
                    title: 'Offizielle Skip-Bo Spielregeln einfach erklärt | Skip-Bo Strategy Analyzer',
                    description:
                        'Die offiziellen Skip-Bo Regeln verständlich erklärt: Spielziel, Stock, Bau- und Ablagestapel, Joker und Siegbedingung.'
                }
            }
        },
        {
            path: '/strategy',
            name: 'strategy',
            component: StrategyView,
            meta: {
                seo: {
                    title: 'Skip-Bo Strategien im Vergleich: Optimiert, Zufall, Spontan | Skip-Bo Strategy Analyzer',
                    description:
                        'Wie die Skip-Bo Strategien Optimiert, Zufall, Spontan und Fortgeschritten funktionieren und welche Gewinnchancen sie im direkten Duell bieten.'
                }
            }
        },
        {
            path: '/analysis',
            name: 'analysis',
            component: AnalysisView,
            meta: {
                seo: {
                    title: 'Die perfekte Skip-Bo Strategie – Erkenntnisse aus 1.000.000 Simulationen | Skip-Bo Strategy Analyzer',
                    description:
                        'Erkenntnisse aus 1.000.000 simulierten Skip-Bo-Runden mit einem Reinforcement-Learning-Agenten (TD-λ): So spielen Sie Skip-Bo optimal.'
                }
            }
        },
        {
            path: '/validation',
            name: 'validation',
            component: ValidationView,
            meta: {
                seo: {
                    title: 'Validierung & Methodik der Skip-Bo Analyse | Skip-Bo Strategy Analyzer',
                    description:
                        'Wie die Skip-Bo Simulationen wissenschaftlich validiert werden: statistische Signifikanz, gepaarte Tests, Effektstärken und Power-Analyse.'
                }
            }
        }
    ]
});

router.afterEach((to) => {
    applyPageSeo(to.meta.seo ?? DEFAULT_SEO, to.path);
});

export default router;
