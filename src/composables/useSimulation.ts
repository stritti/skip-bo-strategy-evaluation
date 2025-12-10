/**
 * Simulation Composable for Skip-Bo Game
 * Handles all simulation state, logic, and data management
 */

import { ref, computed, reactive, nextTick, watch, onMounted } from 'vue';
import { SkipBoGame } from '../game/SkipBoGame';
import type { SimulationApp, GameResult, Strategy, LogEntry } from '../game/types';

import { dbService, type SimulationRun } from '../services/dbService';

// --- Global State (Singleton Pattern) ---
// Configuration
const minGames = 100;
const maxGamesLimit = 10000;
const stepGames = 100;
const totalRows = 1000000; // Fixed for data explorer

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

// Statistical Results (Current Run)
const realResults = reactive({
    winsP1: 0,
    winsP2: 0,
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

    // --- Cumulative Statistics ---
    const cumulativeStats = computed(() => {
        if (history.value.length === 0) return null;

        const totalGames = history.value.reduce((sum, run) => sum + run.gamesCount, 0);
        const totalWinsP1 = history.value.reduce((sum, run) => sum + run.winsP1, 0);
        const totalTurns = history.value.reduce((sum, run) => sum + run.totalTurns, 0);
        const totalJokers = history.value.reduce((sum, run) => sum + run.totalJokers, 0);

        return {
            totalRuns: history.value.length,
            totalGames,
            winRateP1: totalGames > 0 ? totalWinsP1 / totalGames : 0,
            avgTurns: totalGames > 0 ? totalTurns / totalGames : 0,
            avgJokers: totalGames > 0 ? totalJokers / totalGames : 0
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
    const loadHistory = async () => {
        history.value = await dbService.getAllRuns();
        history.value.sort((a, b) => b.timestamp - a.timestamp); // Newest first
    };

    // --- History Actions ---
    const loadRun = (run: SimulationRun) => {
        // Restore configuration and state
        currentRunId.value = run.id || null;
        maxGamesConfig.value = run.gamesCount;
        gameCounter.value = run.gamesCount;

        // Restore statistics
        realResults.winsP1 = run.winsP1;
        realResults.winsP2 = run.winsP2;
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

    // --- Simulation Core ---
    const runSimulation = (): void => {
        if (isSimulating.value || isFinished.value) return;

        isSimulating.value = true;
        gameCounter.value = 0;
        currentRunId.value = null; // Reset current loaded ID for new simulation

        // Reset real results
        realResults.winsP1 = 0;
        realResults.winsP2 = 0;
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

        const game = new SkipBoGame(verboseApp, strategyP1.value, strategyP2.value);
        const batchSize = 100;
        let totalGamesRun = 0;

        logEvent('START', `Starte Echtsimulation von ${maxGamesConfig.value.toLocaleString('de-DE')} Runden...`);

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
                if (result.winner.includes('Spieler 1')) {
                    realResults.winsP1++;
                } else if (result.winner.includes('Spieler 2')) {
                    realResults.winsP2++;
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
                    results: JSON.parse(JSON.stringify(rawData.value)) // Clone to ensure clean storage
                };

                dbService.saveRun(runData).then(async (newId) => {
                    logEvent('SUCCESS', 'Ergebnis in Historie gespeichert.');

                    // Update history list
                    await loadHistory();

                    // Auto-load the new run directly
                    const runWithId = { ...runData, id: newId };
                    loadRun(runWithId);
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
        progress.value = 0;
        isSimulating.value = false;
        isFinished.value = false;
        rawData.value = [];
        currentPage.value = 1;
        realResults.winsP1 = 0;
        realResults.winsP2 = 0;
        realResults.totalTurns = 0;
        realResults.totalJokers = 0;

        logEvent('RESET', 'Simulation erfolgreich zurückgesetzt. Bereit für Neustart.');
    };

    // --- Pagination ---
    const nextPage = (): void => {
        if ((currentPage.value * pageSize) < totalRows) {
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
        totalRows,

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
        sortColumn,
        sortDirection,
        strategyP1,
        strategyP2,

        // Computed
        winRateP1,
        averageTurns,
        averageJokers,
        cumulativeStats,
        formattedCounter,
        buttonText,
        buttonClass,
        paginatedData,

        // Methods
        logEvent,
        runSimulation,
        resetSimulation,
        clearHistory,
        loadRun,
        nextPage,
        prevPage,
        toggleSort
    };
}
