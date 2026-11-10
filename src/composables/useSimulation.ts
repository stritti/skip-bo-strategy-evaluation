/**
 * Compatibility facade over the Pinia stores (simulationStore + historyStore).
 * Components keep the familiar `simulation.x.value` access pattern via storeToRefs.
 */

import { storeToRefs } from 'pinia';
import { useSimulationStore, minGames, maxGamesLimit, stepGames } from '../stores/simulationStore';
import { useHistoryStore } from '../stores/historyStore';

export function useSimulation() {
    const sim = useSimulationStore();
    const hist = useHistoryStore();

    return {
        // Configuration constants
        minGames,
        maxGamesLimit,
        stepGames,

        // State + getters as refs (simulationStore)
        ...storeToRefs(sim),

        // State + getters as refs (historyStore)
        ...storeToRefs(hist),

        // Actions
        logEvent: sim.logEvent,
        runSimulation: sim.runSimulation,
        resetSimulation: sim.resetSimulation,
        nextPage: sim.nextPage,
        prevPage: sim.prevPage,
        toggleSort: sim.toggleSort,
        loadHistory: hist.loadHistory,
        loadRun: hist.loadRun,
        loadAllRuns: hist.loadAllRuns,
        clearHistory: hist.clearHistory
    };
}
