<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { SkipBoGame } from '../game/SkipBoGame';
import type { Strategy, MoveOption, LogEntry } from '../game/types';

const props = defineProps<{
  initialStrategyP1?: Strategy;
  initialStrategyP2?: Strategy;
}>();

// State
const strategyP1 = ref<Strategy>(props.initialStrategyP1 || 'Optimiert');
const strategyP2 = ref<Strategy>(props.initialStrategyP2 || 'Zufall');

const game = ref<SkipBoGame | null>(null);
const logs = ref<LogEntry[]>([]);
const currentAction = ref<string>('Bereit zum Start');
const isPlaying = ref(false);
const speed = ref(1000); // ms per step
const autoPlayInterval = ref<number | null>(null);
const currentStepType = ref<'DRAW' | 'THINK' | 'PLAY' | 'DISCARD' | 'DONE'>('DONE');
const nextMoveCache = ref<MoveOption | null>(null);

// Initialize Game
const initGame = () => {
    const appMock = {
        logEvent: (type: string, text: string) => {
             const now = new Date();
             logs.value.unshift({
                id: Date.now() + Math.random(),
                time: now.toLocaleTimeString(),
                type,
                color: type === 'WARN' ? 'text-yellow-500' : (type === 'SUCCESS' ? 'text-green-500' : 'text-gray-500'),
                text
            });
            if(logs.value.length > 20) logs.value.pop();
        },
        tempJokersPlayed: 0
    };
    
    game.value = new SkipBoGame(appMock, strategyP1.value, strategyP2.value);
    game.value.createDeck();
    game.value.deal();
    
    currentStepType.value = 'DRAW';
    currentAction.value = `${game.value.players[0].name} beginnt.`;
    logs.value = [];
};

onMounted(() => {
    initGame();
});

// Controls
const toggleAutoPlay = () => {
    if (isPlaying.value) {
        clearInterval(autoPlayInterval.value!);
        isPlaying.value = false;
    } else {
        isPlaying.value = true;
        step(); // Immediate step
        autoPlayInterval.value = setInterval(() => {
            if (game.value?.winner) {
                toggleAutoPlay();
                return;
            }
            step();
        }, speed.value);
    }
};

const reset = () => {
    if (isPlaying.value) toggleAutoPlay();
    initGame();
};

// Core Animation Loop (Step Logic)
const step = () => {
    if (!game.value || game.value.winner) return;

    const player = game.value.players[game.value.currentPlayerIndex];

    if (currentStepType.value === 'DRAW') {
        currentAction.value = `${player.name} zieht Karten ans Handlimit (5).`;
        game.value.drawCards(player);
        currentStepType.value = 'THINK';
    } 
    else if (currentStepType.value === 'THINK') {
        currentAction.value = `${player.name} überlegt...`;
        const move = game.value.findNextMove(player);
        if (move) {
            nextMoveCache.value = move;
            currentStepType.value = 'PLAY';
            currentAction.value = `${player.name} will ${move.card === 0 ? 'Joker' : move.card} spielen...`;
        } else {
            currentStepType.value = 'DISCARD';
            currentAction.value = `${player.name} kann nichts mehr legen. Bereit zum Ablegen.`;
        }
    } 
    else if (currentStepType.value === 'PLAY') {
        if (nextMoveCache.value) {
            const m = nextMoveCache.value;
            const success = game.value.makePlay(player, m.source, m.card, m.buildPileIndex);
            if (success) {
                if(player.stockpile.length === 0) {
                     currentAction.value = `${player.name} GEWINNT!`;
                     return;
                }
                currentStepType.value = 'THINK'; // Think again
            } else {
                // If failed (shouldnt happen), force discard
                 currentStepType.value = 'DISCARD';
            }
            nextMoveCache.value = null;
        }
    }
    else if (currentStepType.value === 'DISCARD') {
         let discardMove;
        if (player.strategy === 'Fortgeschritten') {
            discardMove = game.value.findDiscard_Advanced(player);
        } else {
            discardMove = game.value.findDiscard_Standard(player);
        }

        if (discardMove) {
             const cardIndex = player.hand.indexOf(discardMove.card);
             if (cardIndex !== -1) {
                 player.hand.splice(cardIndex, 1);
                 player.discardPiles[discardMove.buildPileIndex].push(discardMove.card);
                 game.value.app.logEvent('INFO', `${player.name} legt ${discardMove.card === 0 ? 'Joker' : discardMove.card} ab.`);
             }
        }
        
        // Pass Turn
        game.value.currentPlayerIndex = 1 - game.value.currentPlayerIndex;
        currentStepType.value = 'DRAW';
        const nextName = game.value.players[game.value.currentPlayerIndex].name;
        currentAction.value = `${nextName} ist am Zug.`;
    }
};

</script>

<template>
  <div class="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
    <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <i class="ph-fill ph-swords text-orange-500"></i> Strategie-Duell
        </h3>
        
        <div class="flex items-center gap-4 bg-white dark:bg-slate-700 p-2 rounded-lg border border-gray-200 dark:border-slate-600 shadow-sm">
             <select v-model="strategyP1" @change="reset" class="px-2 py-1 text-sm border rounded bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-white">
                <option value="Optimiert">Optimiert</option>
                <option value="Zufall">Zufall</option>
                <option value="Spontan">Spontan</option>
                <option value="Fortgeschritten">Fortgeschritten</option>
            </select>
            <span class="text-gray-400 font-bold">VS</span>
            <select v-model="strategyP2" @change="reset" class="px-2 py-1 text-sm border rounded bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-white">
                <option value="Optimiert">Optimiert</option>
                <option value="Zufall">Zufall</option>
                <option value="Spontan">Spontan</option>
                <option value="Fortgeschritten">Fortgeschritten</option>
            </select>
        </div>
    </div>

    <!-- Game Board -->
    <div v-if="game" class="relative min-h-[500px] flex flex-col justify-between">
        
        <!-- Player 2 (Top) -->
        <div class="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 transition-all duration-300" 
             :class="{'ring-2 ring-blue-500 shadow-lg scale-[1.01]': game.currentPlayerIndex === 1}">
            <div class="flex justify-between mb-2">
                <span class="font-bold text-gray-700 dark:text-gray-200">Spieler 2 ({{ strategyP2 }})</span>
                <span class="text-xs bg-white dark:bg-slate-700 px-2 py-1 rounded border dark:border-slate-600 dark:text-white" v-if="game.currentPlayerIndex === 1">Am Zug</span>
            </div>
            
            <div class="flex gap-8">
                <!-- Stockpile -->
                <div class="text-center">
                    <div class="text-xs text-gray-400 mb-1">Spielerstapel</div>
                    <div class="w-16 h-24 bg-white dark:bg-slate-700 border-2 border-red-500 rounded-lg flex items-center justify-center shadow-md font-bold text-2xl text-red-600 relative">
                        {{ game.players[1].topStockpileCard === 0 ? '★' : game.players[1].topStockpileCard }}
                        <div class="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                            {{ game.players[1].stockpile.length }}
                        </div>
                    </div>
                </div>

                 <!-- Hand -->
                <div class="flex-1">
                    <div class="text-xs text-gray-400 mb-1">Handkarten</div>
                    <div class="flex gap-2">
                        <div v-for="(card, i) in game.players[1].hand" :key="i"
                             class="w-12 h-16 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded flex items-center justify-center font-bold text-lg shadow-sm text-gray-900 dark:text-white">
                             {{ card === 0 ? '★' : card }}
                        </div>
                    </div>
                </div>
                
                 <!-- Discard Piles -->
                <div>
                     <div class="text-xs text-gray-400 mb-1">Ablagestapel</div>
                     <div class="grid grid-cols-2 gap-2">
                        <div v-for="(pile, i) in game.players[1].discardPiles" :key="i"
                             class="w-10 h-14 bg-gray-200/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                             {{ pile.length > 0 ? (pile[pile.length-1] === 0 ? '★' : pile[pile.length-1]) : '' }}
                        </div>
                     </div>
                </div>
            </div>
        </div>

        <!-- Center: Build Piles & Deck -->
        <div class="flex justify-center items-center gap-8 py-8">
            <div v-for="(pile, i) in game.buildPiles" :key="i"
                 class="w-16 h-24 bg-gray-100 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex items-center justify-center ml-2 relative group">
                 
                 <span v-if="pile.length === 0" class="text-gray-300 dark:text-slate-600 text-xs">1</span>
                 <span v-else class="text-2xl font-bold text-gray-800 dark:text-white">
                    {{ pile[pile.length-1] === 0 ? '★' : pile[pile.length-1] }}
                 </span>
                 
                 <div class="absolute -bottom-6 text-xs text-gray-400">Stapel {{i+1}}</div>
            </div>
            
             <!-- Deck -->
            <div class="ml-12 w-16 h-24 bg-skipbo-blue rounded-lg shadow-md border-2 border-white dark:border-slate-700 flex items-center justify-center">
                <span class="text-white font-bold opacity-50">Deck</span>
                <div class="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-slate-700 text-skipbo-blue text-xs rounded-full flex items-center justify-center shadow font-bold">
                    {{ game.drawPile.length }}
                </div>
            </div>
        </div>

        <!-- Player 1 (Bottom) -->
        <div class="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 transition-all duration-300"
              :class="{'ring-2 ring-blue-500 shadow-lg scale-[1.01]': game.currentPlayerIndex === 0}">
            <div class="flex justify-between mb-2">
                <span class="font-bold text-gray-700 dark:text-gray-200">Spieler 1 ({{ strategyP1 }})</span>
                 <span class="text-xs bg-white dark:bg-slate-700 px-2 py-1 rounded border dark:border-slate-600 dark:text-white" v-if="game.currentPlayerIndex === 0">Am Zug</span>
            </div>
            
            <div class="flex gap-8">
                <!-- Stockpile -->
                <div class="text-center">
                    <div class="text-xs text-gray-400 mb-1">Spielerstapel</div>
                    <div class="w-16 h-24 bg-white dark:bg-slate-700 border-2 border-red-500 rounded-lg flex items-center justify-center shadow-md font-bold text-2xl text-red-600 relative">
                         {{ game.players[0].topStockpileCard === 0 ? '★' : game.players[0].topStockpileCard }}
                         <div class="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                            {{ game.players[0].stockpile.length }}
                        </div>
                    </div>
                </div>

                 <!-- Hand -->
                <div class="flex-1">
                    <div class="text-xs text-gray-400 mb-1">Handkarten</div>
                    <div class="flex gap-2">
                         <div v-for="(card, i) in game.players[0].hand" :key="i"
                             class="w-12 h-16 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded flex items-center justify-center font-bold text-lg shadow-sm text-gray-900 dark:text-white">
                             {{ card === 0 ? '★' : card }}
                        </div>
                    </div>
                </div>
                
                <!-- Discard Piles -->
                <div>
                     <div class="text-xs text-gray-400 mb-1">Ablagestapel</div>
                     <div class="grid grid-cols-2 gap-2">
                        <div v-for="(pile, i) in game.players[0].discardPiles" :key="i"
                             class="w-10 h-14 bg-gray-200/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                             {{ pile.length > 0 ? (pile[pile.length-1] === 0 ? '★' : pile[pile.length-1]) : '' }}
                        </div>
                     </div>
                </div>
            </div>
        </div>

    </div>

    <!-- Controls & Log -->
    <div class="mt-6 flex gap-4 items-start">
        <div class="flex-1 space-y-2">
            
            <div class="bg-white dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600 flex items-center justify-between">
                <div class="font-medium text-lg text-gray-900 dark:text-white">
                    <span v-if="game?.winner" class="text-green-600 font-bold">SPIEL VORBEI! {{ currentAction }}</span>
                    <span v-else>{{ currentAction }}</span>
                </div>
                
                <div class="flex gap-2">
                     <button @click="step" :disabled="!!game?.winner || isPlaying"
                            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
                        <i class="ph-bold ph-skip-forward"></i> Schritt
                    </button>
                    
                    <button @click="toggleAutoPlay" :disabled="!!game?.winner"
                            class="px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                            :class="isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-600 text-white hover:bg-blue-700'">
                        <i :class="isPlaying ? 'ph-bold ph-pause' : 'ph-bold ph-play'"></i>
                        {{ isPlaying ? 'Pause' : 'Auto-Play' }}
                    </button>

                     <button @click="reset" class="px-3 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                        <i class="ph-bold ph-arrow-counter-clockwise text-xl"></i>
                    </button>
                </div>
            </div>
            
             <select v-model="speed" class="w-full p-2 text-sm border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white">
                <option :value="1000">Geschwindigkeit: Normal (1s)</option>
                <option :value="300">Geschwindigkeit: Schnell (0.3s)</option>
                <option :value="50">Geschwindigkeit: Turbo (0.05s)</option>
            </select>

        </div>
        
        <!-- Mini Log -->
        <div class="w-1/3 h-40 overflow-y-auto bg-black/5 dark:bg-black/30 rounded-lg p-2 text-xs font-mono space-y-1 custom-scrollbar">
            <div v-for="log in logs" :key="log.id" :class="log.color">
                <span class="opacity-50 dark:opacity-40">{{log.time}}</span> {{ log.text }}
            </div>
        </div>
    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
</style>
