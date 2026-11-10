/**
 * Simulation Store: simulation state, live statistics and the simulation core.
 * Run persistence/history lives in historyStore.
 */

import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
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
import { trackEvent } from '../utils/analytics';
import { useHistoryStore } from './historyStore';

// Configuration constants
export const minGames = 100;
export const maxGamesLimit = 10000;
export const stepGames = 100;

export const useSimulationStore = defineStore('simulation', () => {
    // --- State ---
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
    // Strategies of the currently loaded/finished run (the selectors get randomized for the next run)
    const lastRunStrategies = ref<{ p1: Strategy; p2: Strategy } | null>(null);

    // Statistical Results (Current Run)
    const realResults = reactive({
        winsP1: 0,
        winsP2: 0,
        ties: 0,
        totalTurns: 0,
        totalJokers: 0,
    });

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

    // --- Cumulative Statistics (across all runs from historyStore) ---
    const cumulativeStats = computed(() => {
        const history = useHistoryStore().history;
        if (history.length === 0) return null;

        const totalGames = history.reduce((sum, run) => sum + run.gamesCount, 0);
        const totalWinsP1 = history.reduce((sum, run) => sum + run.winsP1, 0);
        const totalTies = history.reduce((sum, run) => sum + (run.ties ?? 0), 0);
        const totalTurns = history.reduce((sum, run) => sum + run.totalTurns, 0);
        const totalJokers = history.reduce((sum, run) => sum + run.totalJokers, 0);

        return {
            totalRuns: history.length,
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

    // --- Simulation Core ---
    const runSimulation = (): void => {
        if (isSimulating.value || isFinished.value) return;

        const historyStore = useHistoryStore();

        isSimulating.value = true;
        gameCounter.value = 0;
        historyStore.currentRunId = null; // Reset current loaded ID for new simulation

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
        historyStore.currentSeed = seed;
        lastRunStrategies.value = { p1: strategyP1.value, p2: strategyP2.value };
        const game = new SkipBoGame(verboseApp, strategyP1.value, strategyP2.value, seed);
        const batchSize = 100;
        let totalGamesRun = 0;

        trackEvent('simulation_started', { strategyP1: strategyP1.value, strategyP2: strategyP2.value, games: maxGamesConfig.value });
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
                    version: 1,
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
                    if (newId === null) {
                        logEvent('WARN', 'Lokale Speicherung nicht verfügbar – Lauf wird nicht in der Historie abgelegt.');
                    } else {
                        logEvent('SUCCESS', 'Ergebnis in Historie gespeichert.');

                        // Update history list
                        await historyStore.loadHistory();

                        // Auto-load the new run directly
                        const runWithId = { ...runData, id: newId };
                        historyStore.loadRun(runWithId);
                    }

                    // Randomize strategies for the next run (Request from User)
                    const strategies: Strategy[] = ['Optimiert', 'Zufall', 'Spontan', 'Fortgeschritten'];
                    strategyP1.value = strategies[Math.floor(Math.random() * strategies.length)];
                    strategyP2.value = strategies[Math.floor(Math.random() * strategies.length)];
                    logEvent('INFO', `Strategien neu gewürfelt: ${strategyP1.value} vs ${strategyP2.value}`);
                });

                isSimulating.value = false;
                isFinished.value = true;

                trackEvent('simulation_finished', {
                    strategyP1: strategyP1.value,
                    strategyP2: strategyP2.value,
                    games: totalGamesRun,
                    winsP1: realResults.winsP1,
                    winsP2: realResults.winsP2,
                    ties: realResults.ties,
                    seed
                });
                logEvent('SUCCESS', `Simulation von ${maxGamesConfig.value.toLocaleString('de-DE')} Runden abgeschlossen!`);
            }
        };

        processBatch();
    };

    // --- Reset Functionality ---
    const resetSimulation = (): void => {
        const historyStore = useHistoryStore();
        gameCounter.value = 0;
        historyStore.currentRunId = null;
        historyStore.currentSeed = null;
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

    return {
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
        sortColumn,
        sortDirection,
        strategyP1,
        strategyP2,
        lastRunStrategies,
        realResults,

        // Getters
        winRateP1,
        tieRate,
        averageTurns,
        averageJokers,
        cumulativeStats,
        winRateP1CI,
        averageTurnsCI,
        turnsDistribution,
        durationDistribution,
        mcnemarResult,
        effectSizeResult,
        formattedCounter,
        buttonText,
        buttonClass,
        sortedData,
        paginatedData,

        // Actions
        logEvent,
        runSimulation,
        resetSimulation,
        nextPage,
        prevPage,
        toggleSort
    };
});
