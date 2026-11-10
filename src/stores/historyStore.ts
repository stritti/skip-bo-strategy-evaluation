/**
 * History Store: persistence and access to simulation runs
 * (local IndexedDB runs + shared runs from public/data/runs).
 */

import { ref } from 'vue';
import { defineStore } from 'pinia';
import { dbService, type SimulationRun } from '../services/dbService';
import { entryToSummaryRun, normalizeSharedRun, type SharedRunIndexEntry } from '../services/sharedRuns';
import { useSimulationStore } from './simulationStore';

export const useHistoryStore = defineStore('history', () => {
    // --- State ---
    const history = ref<SimulationRun[]>([]);
    const currentRunId = ref<number | null>(null);
    const currentSeed = ref<number | null>(null);
    const aggregatedResults = ref<{
        strategyP1: string;
        strategyP2: string;
        games: number;
        winsP1: number;
        winsP2: number;
        winRateP1: number;
    }[]>([]);
    const loadRequestCounter = ref(0);

    // --- Shared runs ---
    // Shared runs are committed to public/data/runs/ in the repo. The index carries
    // precomputed aggregates, so the history list loads without downloading full runs;
    // per-game results of a shared run are fetched lazily when the run is opened.
    const loadSharedRuns = async (): Promise<SimulationRun[]> => {
        try {
            const base = import.meta.env.BASE_URL;
            const indexRes = await fetch(`${base}data/runs/index.json`);
            if (!indexRes.ok) return [];
            const entries = await indexRes.json() as SharedRunIndexEntry[];
            // negative ids below -1000: -1 is reserved for the "all runs" aggregate view
            return entries.map((entry, i) => ({ ...entryToSummaryRun(entry), id: -(1000 + i) }));
        } catch {
            return [];
        }
    };

    const fetchSharedRunDetails = async (file: string): Promise<SimulationRun | null> => {
        try {
            const base = import.meta.env.BASE_URL;
            const res = await fetch(`${base}data/runs/${file}`);
            if (!res.ok) return null;
            return normalizeSharedRun(await res.json());
        } catch {
            return null;
        }
    };

    const loadHistory = async () => {
        const [local, shared] = await Promise.all([dbService.getAllRuns(), loadSharedRuns()]);
        history.value = [...local, ...shared];
        history.value.sort((a, b) => b.timestamp - a.timestamp); // Newest first
    };

    // --- History Actions ---
    const loadRun = async (run: SimulationRun) => {
        const sim = useSimulationStore();
        const requestId = ++loadRequestCounter.value;

        // Shared runs arrive as summaries from the index; fetch full results lazily
        if (run.shared && run.file && run.results.length === 0) {
            const full = await fetchSharedRunDetails(run.file);
            if (requestId !== loadRequestCounter.value) return; // a newer selection superseded this request
            if (!full) {
                sim.logEvent('WARN', `Details für geteilten Lauf "${run.file}" konnten nicht geladen werden.`);
                return;
            }
            run = { ...full, id: run.id, file: run.file };
        }

        // Restore configuration and state
        currentRunId.value = run.id || null;
        currentSeed.value = run.seed ?? null;
        sim.maxGamesConfig = run.gamesCount;
        sim.gameCounter = run.gamesCount;

        // Restore statistics
        sim.realResults.winsP1 = run.winsP1;
        sim.realResults.winsP2 = run.winsP2;
        sim.realResults.ties = run.ties ?? 0;
        sim.realResults.totalTurns = run.totalTurns;
        sim.realResults.totalJokers = run.totalJokers;

        // Restore detailed data
        if (run.results) {
            sim.rawData = JSON.parse(JSON.stringify(run.results));
        } else {
            sim.rawData = [];
            sim.logEvent('WARN', 'Konnte Details für diesen Lauf nicht laden (Daten fehlen).');
        }

        sim.isSimulating = false;
        sim.isFinished = true;
        sim.progress = 100;

        sim.logEvent('INFO', `Historischen Lauf vom ${new Date(run.timestamp).toLocaleString('de-DE')} geladen.`);
    };

    const clearHistory = async () => {
        await dbService.clearHistory();
        history.value = [];
        useSimulationStore().logEvent('INFO', 'Simulations-Historie gelöscht.');
    };

    // --- Aggregated Analysis ---
    const loadAllRuns = async () => {
        const sim = useSimulationStore();
        if (history.value.length === 0) return;

        // Shared runs only carry summaries in the index; fetch their details so the
        // aggregate view includes their games in rawData (Data Explorer, exports, charts)
        await Promise.all(history.value.map(async (run) => {
            if (run.shared && run.file && run.results.length === 0) {
                const full = await fetchSharedRunDetails(run.file);
                if (full) run.results = full.results;
            }
        }));

        // Prevent watcher from triggering reset during update
        sim.isFinished = false;

        // Reset state
        sim.realResults.winsP1 = 0;
        sim.realResults.winsP2 = 0;
        sim.realResults.ties = 0;
        sim.realResults.totalTurns = 0;
        sim.realResults.totalJokers = 0;
        sim.rawData = [];
        aggregatedResults.value = []; // Reset aggregation

        let totalGames = 0;
        const groupingMap = new Map<string, {
            p1: string;
            p2: string;
            games: number;
            w1: number;
            w2: number;
        }>();

        // Aggregate all runs
        history.value.forEach(run => {
            // Global Totals
            sim.realResults.winsP1 += run.winsP1;
            sim.realResults.winsP2 += run.winsP2;
            sim.realResults.ties += run.ties ?? 0;
            sim.realResults.totalTurns += run.totalTurns;
            sim.realResults.totalJokers += run.totalJokers;
            totalGames += run.gamesCount;

            // Grouping Logic
            const key = `${run.strategyP1}|${run.strategyP2}`;
            if (!groupingMap.has(key)) {
                groupingMap.set(key, {
                    p1: run.strategyP1,
                    p2: run.strategyP2,
                    games: 0,
                    w1: 0,
                    w2: 0
                });
            }
            const group = groupingMap.get(key)!;
            group.games += run.gamesCount;
            group.w1 += run.winsP1;
            group.w2 += run.winsP2;

            if (run.results) {
                // Offset ids so aggregated rows keep unique keys across runs
                const offset = sim.rawData.length;
                sim.rawData.push(...run.results.map(r => ({ ...r, id: offset + r.id })));
            }
        });

        aggregatedResults.value = Array.from(groupingMap.values()).map(g => ({
            strategyP1: g.p1,
            strategyP2: g.p2,
            games: g.games,
            winsP1: g.w1,
            winsP2: g.w2,
            winRateP1: g.games > 0 ? g.w1 / g.games : 0
        })).sort((a, b) => b.games - a.games); // Most played first

        currentRunId.value = -1; // -1 indicates "All Runs"
        currentSeed.value = null; // aggregated across runs
        sim.gameCounter = totalGames;
        sim.maxGamesConfig = totalGames; // Show total as goal
        sim.isSimulating = false;
        sim.isFinished = true;
        sim.progress = 100;

        sim.logEvent('SUCCESS', `${history.value.length} Simulationen erfolgreich aggregiert geladen.`);
    };

    return {
        // State
        history,
        currentRunId,
        currentSeed,
        aggregatedResults,

        // Actions
        loadHistory,
        loadRun,
        loadAllRuns,
        clearHistory
    };
});
