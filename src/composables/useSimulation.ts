/**
 * Simulation Composable for Skip-Bo Game
 * Handles all simulation state, logic, and data management
 */

import { ref, reactive, computed } from 'vue';
import { SkipBoGame } from '../game/SkipBoGame';
import type { GameResult, LogEntry } from '../game/types';
import { generateMockRow } from '../services/csvExportService';

export function useSimulation() {
    // --- Configuration ---
    const minGames = 100;
    const maxGamesLimit = 10000;
    const stepGames = 100;
    const totalRows = 1000000; // Fixed for data explorer

    // --- Simulation State ---
    const maxGamesConfig = ref(1000);
    const gameCounter = ref(0);
    const progress = ref(0);
    const isSimulating = ref(false);
    const isFinished = ref(false);
    const logs = ref<LogEntry[]>([]);
    const tempJokersPlayed = ref(0);

    // --- Data Table State ---
    const rawData = ref<GameResult[]>([]);
    const currentPage = ref(1);
    const pageSize = 15;

    // --- Statistical Results ---
    const realResults = reactive({
        winsP1: 0,
        winsP2: 0,
        totalTurns: 0,
        totalJokers: 0,
    });

    // --- Computed Statistics ---
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

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * pageSize;
        const end = start + pageSize;
        return rawData.value.slice(start, end);
    });

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

        // Only show a small subset of real-time logs to prevent UI overload
        if (logs.value.length < 7 || type === 'RESET') {
            logs.value.unshift({
                id: Date.now() + Math.random(),
                time: `[${timeStr}]`,
                type: type,
                color: color,
                text: text
            });
        }
        if (logs.value.length > 10) logs.value.pop();
    };

    // --- Simulation Core ---
    const runSimulation = (): void => {
        if (isSimulating.value || isFinished.value) return;

        isSimulating.value = true;
        gameCounter.value = 0;

        // Reset real results
        realResults.winsP1 = 0;
        realResults.winsP2 = 0;
        realResults.totalTurns = 0;
        realResults.totalJokers = 0;
        rawData.value = [];

        // Create simulation app interface for game
        const app = {
            logEvent,
            tempJokersPlayed: 0
        };
        const game = new SkipBoGame(app);
        const batchSize = 100;
        let totalGamesRun = 0;

        logEvent('START', `Starte Echtsimulation von ${maxGamesConfig.value.toLocaleString('de-DE')} Runden...`);

        const processBatch = (): void => {
            const start = Date.now();

            for (let i = 0; i < batchSize; i++) {
                if (totalGamesRun >= maxGamesConfig.value) break;

                // Reset jokers counter for each game
                app.tempJokersPlayed = 0;
                const result = game.run();

                // Collect real statistics
                if (result.winner.includes('Spieler 1')) {
                    realResults.winsP1++;
                } else if (result.winner.includes('Spieler 2')) {
                    realResults.winsP2++;
                }
                realResults.totalTurns += result.turns;
                realResults.totalJokers += result.jokers;

                // Store only a sample of the real game results for the table demo
                if (rawData.value.length < pageSize) {
                    rawData.value.push(result);
                }

                totalGamesRun++;
                gameCounter.value = totalGamesRun;
            }

            const end = Date.now();
            const batchTime = end - start;
            logEvent('INFO', `Batch ${Math.floor(totalGamesRun / batchSize)} beendet (${batchTime}ms).`);

            progress.value = (totalGamesRun / maxGamesConfig.value) * 100;

            if (totalGamesRun < maxGamesConfig.value) {
                // Continue to the next batch
                setTimeout(processBatch, 10);
            } else {
                // Simulation finished
                isSimulating.value = false;
                isFinished.value = true;

                // Generate mock rows for table explorer
                const numSamples = Math.min(totalRows, 500);
                for (let i = 0; i < numSamples; i++) {
                    const mockRow = generateMockRow(
                        totalRows - i,
                        averageTurns.value,
                        averageJokers.value,
                        winRateP1.value
                    );
                    rawData.value.push(mockRow);
                }

                logEvent('SUCCESS', `Simulation von ${maxGamesConfig.value.toLocaleString('de-DE')} Runden abgeschlossen!`);
            }
        };

        processBatch();
    };

    // --- Reset Functionality ---
    const resetSimulation = (): void => {
        gameCounter.value = 0;
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

        // Computed
        winRateP1,
        averageTurns,
        averageJokers,
        formattedCounter,
        buttonText,
        buttonClass,
        paginatedData,

        // Methods
        logEvent,
        runSimulation,
        resetSimulation,
        nextPage,
        prevPage
    };
}
