<script setup lang="ts">
/**
 * Effect Size Display Component
 * Shows Cohen's d with visual magnitude indicator
 */

interface Props {
    effectSize: number;
    interpretation: string;
    magnitude: 'negligible' | 'small' | 'medium' | 'large';
    label: string;
}

const props = defineProps<Props>();

const getMagnitudeColor = (mag: string): string => {
    switch (mag) {
        case 'large': return 'bg-red-100 text-red-800 border-red-300';
        case 'medium': return 'bg-orange-100 text-orange-800 border-orange-300';
        case 'small': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
};

const getMagnitudeIcon = (mag: string): string => {
    switch (mag) {
        case 'large': return 'ph-fill ph-fire';
        case 'medium': return 'ph-fill ph-trend-up';
        case 'small': return 'ph-fill ph-equals';
        default: return 'ph-fill ph-minus';
    }
};
</script>

<template>
    <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex items-center justify-between mb-3">
            <div class="text-sm font-medium text-gray-700">{{ label }}</div>
            <div 
                :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border-2', getMagnitudeColor(magnitude)]"
            >
                <i :class="getMagnitudeIcon(magnitude)"></i>
                {{ interpretation }}
            </div>
        </div>
        <div class="flex items-baseline gap-2">
            <div class="text-3xl font-mono font-bold text-gray-900">d = {{ effectSize.toFixed(2) }}</div>
            <div class="text-sm text-gray-500">Cohen's d</div>
        </div>
        <div class="mt-2 text-xs text-gray-600">
            {{ effectSize >= 0.8 ? 'Praktisch sehr relevant' : effectSize >= 0.5 ? 'Praktisch relevant' : 'Begrenzte praktische Relevanz' }}
        </div>
    </div>
</template>
