<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });
/**
 * Data Export Component
 * Allows exporting simulation data as CSV or JSON
 */

import { ref } from 'vue';
import type { GameResult } from '../../game/types';
import { trackEvent } from '../../utils/analytics';
import { buildSharePayload, getShareToken, saveShareToken, shareRun, ShareError, type ShareResult } from '../../services/shareService';

interface Props {
    data: GameResult[];
    strategyP1: string;
    strategyP2: string;
    seed?: number | null;
    isDisabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isDisabled: false
});

const exportToCSV = () => {
    if (props.data.length === 0) return;

    trackEvent('export_csv', { games: props.data.length, strategyP1: props.strategyP1, strategyP2: props.strategyP2, seed: props.seed ?? 0 });

    // CSV Header
    const headers = ['ID', 'Winner', 'WinnerID', 'Turns', 'Duration (ms)', 'Starter', 'Jokers', 'Strategy', 'Seed'];
    const csvContent = [
        headers.join(','),
        ...props.data.map(row => [
            row.id,
            row.winner,
            row.winnerId ?? '',
            row.turns,
            row.duration,
            row.starter,
            row.jokers,
            row.strategy,
            row.seed
        ].join(','))
    ].join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `skip-bo-simulation-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const showShare = ref(false);
const shareToken = ref(getShareToken());
const shareSending = ref(false);
const shareResult = ref<ShareResult | null>(null);
const shareError = ref('');

const openShare = () => {
    showShare.value = !showShare.value;
    shareResult.value = null;
    shareError.value = '';
    shareToken.value = getShareToken();
};

const submitShare = async () => {
    shareError.value = '';
    shareResult.value = null;
    if (props.seed == null) {
        shareError.value = t('comp.shareNoSeed');
        return;
    }
    const token = shareToken.value.trim();
    if (!token) {
        shareError.value = t('comp.shareTokenRequired');
        return;
    }
    shareSending.value = true;
    try {
        trackEvent('share_run', { games: props.data.length, strategyP1: props.strategyP1, strategyP2: props.strategyP2, seed: props.seed });
        const result = await shareRun(buildSharePayload(props.data, props.strategyP1, props.strategyP2, props.seed), token);
        saveShareToken(token);
        shareResult.value = result;
    } catch (e) {
        if (e instanceof ShareError) {
            const key = { 400: 'comp.shareInvalid', 401: 'comp.shareUnauthorized', 403: 'comp.shareForbidden', 409: 'comp.shareDuplicate', 413: 'comp.shareTooLarge', 503: 'comp.shareNotConfigured' }[e.status];
            shareError.value = key ? t(key) : (e.message || t('comp.shareError'));
        } else {
            shareError.value = t('comp.shareError');
        }
    } finally {
        shareSending.value = false;
    }
};

const exportToJSON = () => {
    if (props.data.length === 0) return;

    trackEvent('export_json', { games: props.data.length, strategyP1: props.strategyP1, strategyP2: props.strategyP2, seed: props.seed ?? 0 });

    const metadata = {
        exportDate: new Date().toISOString(),
        totalGames: props.data.length,
        strategyP1: props.strategyP1,
        strategyP2: props.strategyP2,
        seed: props.seed ?? null
    };

    const exportData = {
        version: 1,
        metadata,
        results: props.data
    };

    const jsonContent = JSON.stringify(exportData, null, 2);

    // Create download
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `skip-bo-simulation-${Date.now()}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
</script>

<template>
    <div class="bg-white rounded-xl border border-gray-200 p-4">
        <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <i class="ph-bold ph-download text-blue-600"></i>
            {{ t('comp.exportTitle') }}
        </h4>
        <p class="text-sm text-gray-600 mb-4">
            {{ t('comp.exportP', { n: data.length.toLocaleString('de-DE') }) }}
        </p>
        <div class="flex gap-3">
            <button
                @click="exportToCSV"
                :disabled="isDisabled || data.length === 0"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
                <i class="ph-bold ph-file-csv"></i>{{ t('data.csv') }}
            </button>
            <button
                @click="exportToJSON"
                :disabled="isDisabled || data.length === 0"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
                <i class="ph-bold ph-file-text"></i>
                JSON
            </button>
            <button
                @click="openShare"
                :disabled="isDisabled || data.length === 0"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
                <i class="ph-bold ph-share-network"></i>
                {{ t('comp.share') }}
            </button>
        </div>
        <div v-if="showShare" class="mt-3 border-t border-gray-200 pt-3">
            <p class="text-xs text-gray-600 mb-2">{{ t('comp.shareP') }}</p>
            <input
                v-model="shareToken"
                type="password"
                :placeholder="t('comp.shareToken')"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p class="mt-1 text-xs text-gray-400">{{ t('comp.shareTokenHint') }}</p>
            <button
                @click="submitShare"
                :disabled="shareSending || data.length === 0"
                class="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
                <i class="ph-bold ph-git-pull-request"></i>
                {{ shareSending ? t('comp.shareSending') : t('comp.shareSubmit') }}
            </button>
            <p v-if="shareError" class="mt-2 text-xs text-red-600">{{ shareError }}</p>
            <p v-if="shareResult" class="mt-2 text-xs text-green-700 break-all">
                {{ t('comp.shareSuccess') }}
                <a :href="shareResult.prUrl" target="_blank" rel="noopener noreferrer" class="underline font-medium">{{ shareResult.prUrl }}</a>
            </p>
        </div>
        <div class="mt-3 text-xs text-gray-500">
            {{ t('comp.exportHint') }}
        </div>
    </div>
</template>
