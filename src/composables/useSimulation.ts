/**
 * Simulation Composable for Skip-Bo Game
 * Handles all simulation state, logic, and data management
 */

import { ref, computed, reactive, onMounted } from 'vue';
import { SkipBoGame } from '../game/SkipBoGame';
import { generateSeed } from '../game/utils';
import type { SimulationApp, GameResult, Strategy, LogEntry } from '../game/types';
import {
    calculateConfidenceInterval,
    calculateQuartiles,
    mcnemarExactTest,
    cohensH,
    tCriticalValue
} from '../utils/statistics';

import { dbService, type SimulationRun } from '../services/dbService';
import { normalizeSharedRun, type SharedRunIndexEntry } from '../services/sharedRuns';

// --- Global State (Singleton Pattern) ---
// Configuration
const minGames = 100;
const maxGamesLimit = 10000;
const stepGames = 100;

// Simulation State
const maxGamesConfig = ref(1000);
const gameCounter = ref(0);
const progress = ref(0);
const isSimulating = ref(false);
const isFinished = ref(false);
const logs = ref<LogEntry[]>([]);
const tempJokersPlayed = ref(0);

// Data Table State
const rawData = ref<GameResult[]>([]);
const currentPage = ref(1);
const pageSize = 15;
const sortColumn = ref<keyof GameResult>('id');
const sortDirection = ref<'asc' | 'desc'>('desc');
const strategyP1 = ref<Strategy>('Optimiert');
const strategyP2 = ref<Strategy>('Zufall');

// History State
const history = ref<SimulationRun[]>([]);
const currentRunId = ref<number | null>(null);
const currentSeed = ref<number | null>(null);

// Statistical Results (Current Run)
const realResults = reactive({
    winsP1: 0,
    winsP2: 0,
    ties: 0,
    totalTurns: 0,
    totalJokers: 0,
});

export function useSimulation() {
    // --- Computed Statistics (Current Run) ---
    const winRateP1 = computed(() =>
        maxGamesConfig.value > 0 && gameCounter.value > 0
            ? realResults.winsP1 / gameCounter.value
            : 0
    );

    const averageTurns = computed(() =>
        maxGamesConfig.value > 0 && gameCounter.value > 0
            ? realResults.totalTurns / gameCounter.value
            : 0
    );

    const averageJokers = computed(() =>
        maxGamesConfig.value > 0 && gameCounter.value > 0
            ? realResults.totalJokers / gameCounter.value
            : 0
    );

    const tieRate = computed(() =>
        gameCounter.value > 0
            ? realResults.ties / gameCounter.value
            : 0
    );

    // --- Cumulative Statistics ---
    const cumulativeStats = computed(() => {
        if (history.value.length === 0) return null;

        const totalGames = history.value.reduce((sum, run) => sum + run.gamesCount, 0);
        const totalWinsP1 = history.value.reduce((sum, run) => sum + run.winsP1, 0);
        const totalTies = history.value.reduce((sum, run) => sum + (run.ties ?? 0), 0);
        const totalTurns = history.value.reduce((sum, run) => sum + run.totalTurns, 0);
        const totalJokers = history.value.reduce((sum, run) => sum + run.totalJokers, 0);

        return {
            totalRuns: history.value.length,
            totalGames,
            winRateP1: totalGames > 0 ? totalWinsP1 / totalGames : 0,
            tieRate: totalGames > 0 ? totalTies / totalGames : 0,
            avgTurns: totalGames > 0 ? totalTurns / totalGames : 0,
            avgJokers: totalGames > 0 ? totalJokers / totalGames : 0
        };
    });

    // --- Statistical Metrics (Confidence Intervals) ---
    const winRateP1CI = computed(() => {
        if (gameCounter.value < 30) {
            return { margin: 0, lower: winRateP1.value, upper: winRateP1.value };
        }
        return calculateConfidenceInterval(winRateP1.value, gameCounter.value);
    });

    const averageTurnsCI = computed(() => {
        if (rawData.value.length < 30) {
            return { margin: 0, lower: averageTurns.value, upper: averageTurns.value };
        }
        // For means, use the t-distribution critical value with sample variance (n-1)
        const turns = rawData.value.map(r => r.turns);
        const mean = averageTurns.value;
        const n = turns.length;

        const variance = turns.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (n - 1);
        const stdError = Math.sqrt(variance / n);
        const margin = tCriticalValue(0.95, n - 1) * stdError;

        return {
            margin,
            lower: Math.max(0, mean - margin),
            upper: mean + margin
        };
    });

    // --- Distribution Metrics (Quartiles for Box Plots) ---
    const turnsDistribution = computed(() => {
        if (rawData.value.length === 0) {
            return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0 };
        }
        const turns = rawData.value.map(r => r.turns);
        return calculateQuartiles(turns);
    });

    const durationDistribution = computed(() => {
        if (rawData.value.length === 0) {
            return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0 };
        }
        const durations = rawData.value.map(r => r.duration);
        return calculateQuartiles(durations);
    });

    // --- McNemar exact test (correct test for paired duel outcomes) ---
    const mcnemarResult = computed(() => {
        const decisive = realResults.winsP1 + realResults.winsP2;
        if (strategyP1.value === strategyP2.value || decisive < 30) {
            return {
                statistic: 0,
                pValue: 1,
                isSignificant: false,
                discordantPairs: decisive,
                applicable: false
            };
        }

        const result = mcnemarExactTest(realResults.winsP1, realResults.winsP2);
        return { ...result, applicable: true };
    });

    // --- Effect Size (Cohen's h on the decisive win rate vs. chance 0.5) ---
    const effectSizeResult = computed(() => {
        const decisive = realResults.winsP1 + realResults.winsP2;
        if (strategyP1.value === strategyP2.value || decisive < 30) {
            return {
                value: 0,
                interpretation: 'Nicht berechenbar',
                magnitude: 'negligible' as const,
                applicable: false
            };
        }

        const winRateDecisive = realResults.winsP1 / decisive;
        const result = cohensH(winRateDecisive, 0.5);
        return {
            value: result.h,
            interpretation: result.interpretation,
            magnitude: result.magnitude,
            applicable: true
        };
    });


    // --- Computed UI Helpers ---
    const formattedCounter = computed(() => gameCounter.value.toLocaleString('de-DE'));

    const buttonText = computed(() => {
        if (isSimulating.value) return "Simuliere...";
        if (isFinished.value) return "Simulation zurücksetzen";
        return `${maxGamesConfig.value.toLocaleString('de-DE')} Runden Starten`;
    });

    const buttonClass = computed(() => {
        if (isSimulating.value) return "bg-gray-800 text-gray-400 cursor-wait";
        if (isFinished.value) return "bg-blue-600 text-white hover:bg-blue-700 shadow-lg";
        return "bg-red-600 text-white hover:bg-red-700";
    });

    const sortedData = computed(() => {
        return [...rawData.value].sort((a, b) => {
            const valA = a[sortColumn.value];
            const valB = b[sortColumn.value];

            if (valA === valB) return 0;

            const modifier = sortDirection.value === 'asc' ? 1 : -1;

            if (typeof valA === 'string' && typeof valB === 'string') {
                return valA.localeCompare(valB) * modifier;
            }
            // @ts-ignore
            return (valA - valB) * modifier;
        });
    });

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * pageSize;
        const end = start + pageSize;
        return sortedData.value.slice(start, end);
    });

    // --- Sorting ---
    const toggleSort = (column: keyof GameResult) => {
        if (sortColumn.value === column) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn.value = column;
            sortDirection.value = 'desc'; // Default to desc for new columns (often numbers)
        }
    };

    // --- Logging ---
    const logEvent = (type: string, text: string): void => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('de-DE', {
            hour12: false,
            fractionalSecondDigits: 2
        });

        let color = 'text-blue-400';
        if (type === 'WARN') color = 'text-yellow-400';
        if (type === 'SUCCESS') color = 'text-green-400';
        if (type === 'TURN') color = 'text-gray-500';

        logs.value.unshift({
            id: Date.now() + Math.random(),
            time: `[${timeStr}]`,
            type: type,
            color: color,
            text: text
        });

        if (logs.value.length > 50) logs.value.pop();
    };

    // --- DB Actions ---
    // Shared runs are committed to public/data/runs/ in the repo and fetched from there
    const loadSharedRuns = async (): Promise<SimulationRun[]> => {
        try {
            const base = import.meta.env.BASE_URL;
            const indexRes = await fetch(`${base}data/runs/index.json`);
            if (!indexRes.ok) return [];
            const entries = await indexRes.json() as SharedRunIndexEntry[];
            const runs: SimulationRun[] = [];
            for (const entry of entries) {
                try {
                    const res = await fetch(`${base}data/runs/${entry.file}`);
                    if (!res.ok) continue;
                    const run = normalizeSharedRun(await res.json(), entry);
                    if (!run) continue;
                    // negative ids below -1000: -1 is reserved for the "all runs" aggregate view
                    runs.push({ ...run, id: -(1000 + runs.length) });
                } catch {
                    // skip broken shared run file
                }
            }
            return runs;
        } catch {
            return [];
        }
    };

    const loadHistory = async () => {
        const [local, shared] = await Promise.all([dbService.getAllRuns(), loadSharedRuns()]);
        history.value = [...local, ...shared];
        history.value.sort((a, b) => b.timestamp - a.timestamp); // Newest first
    };

    // --- History Actions ---
    const loadRun = (run: SimulationRun) => {
        // Restore configuration and state
        currentRunId.value = run.id || null;
        currentSeed.value = run.seed ?? null;
        maxGamesConfig.value = run.gamesCount;
        gameCounter.value = run.gamesCount;

        // Restore statistics
        realResults.winsP1 = run.winsP1;
        realResults.winsP2 = run.winsP2;
        realResults.ties = run.ties ?? 0;
        realResults.totalTurns = run.totalTurns;
        realResults.totalJokers = run.totalJokers;

        // Restore detailed data
        if (run.results) {
            rawData.value = JSON.parse(JSON.stringify(run.results));
        } else {
            rawData.value = [];
            logEvent('WARN', 'Konnte Details für diesen Lauf nicht laden (Daten fehlen).');
        }

        isSimulating.value = false;
        isFinished.value = true;
        progress.value = 100;

        logEvent('INFO', `Historischen Lauf vom ${new Date(run.timestamp).toLocaleString('de-DE')} geladen.`);
    };

    const clearHistory = async () => {
        await dbService.clearHistory();
        history.value = [];
        logEvent('INFO', 'Simulations-Historie gelöscht.');
    };

    // --- Aggregated Analysis State ---
    const aggregatedResults = ref<{
        strategyP1: string;
        strategyP2: string;
        games: number;
        winsP1: number;
        winsP2: number;
        winRateP1: number;
    }[]>([]);

    const loadAllRuns = () => {
        if (history.value.length === 0) return;

        // Prevent watcher from triggering reset during update
        isFinished.value = false;

        // Reset state
        realResults.winsP1 = 0;
        realResults.winsP2 = 0;
        realResults.ties = 0;
        realResults.totalTurns = 0;
        realResults.totalJokers = 0;
        rawData.value = [];
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
            realResults.winsP1 += run.winsP1;
            realResults.winsP2 += run.winsP2;
            realResults.ties += run.ties ?? 0;
            realResults.totalTurns += run.totalTurns;
            realResults.totalJokers += run.totalJokers;
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
                // Performance warning: This might be heavy
                // Offset ids so aggregated rows keep unique keys across runs
                const offset = rawData.value.length;
                rawData.value.push(...run.results.map(r => ({ ...r, id: offset + r.id })));
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
        gameCounter.value = totalGames;
        maxGamesConfig.value = totalGames; // Show total as goal
        isSimulating.value = false;
        isFinished.value = true;
        progress.value = 100;

        logEvent('SUCCESS', `${history.value.length} Simulationen erfolgreich aggregiert geladen.`);
    };

    // --- Simulation Core ---
    const runSimulation = (): void => {
        if (isSimulating.value || isFinished.value) return;

        isSimulating.value = true;
        gameCounter.value = 0;
        currentRunId.value = null; // Reset current loaded ID for new simulation

        // Reset real results
        realResults.winsP1 = 0;
        realResults.winsP2 = 0;
        realResults.ties = 0;
        realResults.totalTurns = 0;
        realResults.totalJokers = 0;
        rawData.value = [];

        // Create simulation app interface for game
        const verboseApp: SimulationApp = {
            logEvent: logEvent,
            tempJokersPlayed: 0
        };
        const silentApp: SimulationApp = {
            logEvent: () => { }, // No-op
            tempJokersPlayed: 0
        };

        const seed = generateSeed();
        currentSeed.value = seed;
        const game = new SkipBoGame(verboseApp, strategyP1.value, strategyP2.value, seed);
        const batchSize = 100;
        let totalGamesRun = 0;

        logEvent('START', `Starte Echtsimulation von ${maxGamesConfig.value.toLocaleString('de-DE')} Runden (Seed: ${seed})...`);

        const processBatch = (): void => {
            const start = Date.now();

            for (let i = 0; i < batchSize; i++) {
                if (totalGamesRun >= maxGamesConfig.value) break;

                // Log details only for the 1st game of the batch to keep UI responsive but "alive"
                // Switching the app context allows us to toggle logging on/off dynamically
                game.app = (i === 0) ? verboseApp : silentApp;

                // Reset jokers counter for each game on the active app context
                game.app.tempJokersPlayed = 0;

                const result = game.run();

                // Collect real statistics
                if (result.winnerId === 0) {
                    realResults.winsP1++;
                } else if (result.winnerId === 1) {
                    realResults.winsP2++;
                } else {
                    realResults.ties++;
                }
                realResults.totalTurns += result.turns;
                realResults.totalJokers += result.jokers;

                // Store ALL real game results
                rawData.value.push(result);

                totalGamesRun++;
                gameCounter.value = totalGamesRun;
            }

            const end = Date.now();
            const batchTime = end - start;
            logEvent('INFO', `Batch ${Math.floor(totalGamesRun / batchSize)} beendet(${batchTime}ms).`);

            progress.value = (totalGamesRun / maxGamesConfig.value) * 100;

            if (totalGamesRun < maxGamesConfig.value) {
                // Continue to the next batch
                setTimeout(processBatch, 10);
            } else {
                // Simulation finished
                // Save to DB
                const runData: SimulationRun = {
                    timestamp: Date.now(),
                    gamesCount: totalGamesRun,
                    winsP1: realResults.winsP1,
                    winsP2: realResults.winsP2,
                    strategyP1: strategyP1.value,
                    strategyP2: strategyP2.value,
                    totalTurns: realResults.totalTurns,
                    totalJokers: realResults.totalJokers,
                    ties: realResults.ties,
                    seed,
                    results: JSON.parse(JSON.stringify(rawData.value)) // Clone to ensure clean storage
                };

                dbService.saveRun(runData).then(async (newId) => {
                    logEvent('SUCCESS', 'Ergebnis in Historie gespeichert.');

                    // Update history list
                    await loadHistory();

                    // Auto-load the new run directly
                    const runWithId = { ...runData, id: newId };
                    loadRun(runWithId);

                    // Randomize strategies for the next run (Request from User)
                    const strategies: Strategy[] = ['Optimiert', 'Zufall', 'Spontan', 'Fortgeschritten'];
                    strategyP1.value = strategies[Math.floor(Math.random() * strategies.length)];
                    strategyP2.value = strategies[Math.floor(Math.random() * strategies.length)];
                    logEvent('INFO', `Strategien neu gewürfelt: ${strategyP1.value} vs ${strategyP2.value}`);
                });

                isSimulating.value = false;
                isFinished.value = true;

                logEvent('SUCCESS', `Simulation von ${maxGamesConfig.value.toLocaleString('de-DE')} Runden abgeschlossen!`);
            }
        };

        processBatch();
    };

    // --- Reset Functionality ---
    const resetSimulation = (): void => {
        gameCounter.value = 0;
        currentRunId.value = null;
        currentSeed.value = null;
        progress.value = 0;
        isSimulating.value = false;
        isFinished.value = false;
        rawData.value = [];
        currentPage.value = 1;
        realResults.winsP1 = 0;
        realResults.winsP2 = 0;
        realResults.ties = 0;
        realResults.totalTurns = 0;
        realResults.totalJokers = 0;

        logEvent('RESET', 'Simulation erfolgreich zurückgesetzt. Bereit für Neustart.');
    };

    // --- Pagination ---
    const nextPage = (): void => {
        if ((currentPage.value * pageSize) < rawData.value.length) {
            currentPage.value++;
        }
    };

    const prevPage = (): void => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    // Load history on mount
    onMounted(() => {
        if (history.value.length === 0) {
            loadHistory();
        }
    });

    return {
        // Configuration
        minGames,
        maxGamesLimit,
        stepGames,

        // State
        maxGamesConfig,
        gameCounter,
        progress,
        isSimulating,
        isFinished,
        logs,
        tempJokersPlayed,
        rawData,
        currentPage,
        pageSize,
        history,
        currentRunId,
        currentSeed,
        sortColumn,
        sortDirection,
        strategyP1,
        strategyP2,
        aggregatedResults,

        // Computed
        winRateP1,
        tieRate,
        averageTurns,
        averageJokers,
        cumulativeStats,
        formattedCounter,
        buttonText,
        buttonClass,
        paginatedData,

        // Statistical Metrics
        winRateP1CI,
        averageTurnsCI,
        turnsDistribution,
        durationDistribution,
        mcnemarResult,
        effectSizeResult,

        // Methods
        logEvent,
        runSimulation,
        resetSimulation,
        clearHistory,
        loadRun,
        loadAllRuns,
        nextPage,
        prevPage,
        toggleSort
    };
}
