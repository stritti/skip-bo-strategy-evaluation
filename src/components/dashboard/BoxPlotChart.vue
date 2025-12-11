<script setup lang="ts">
/**
 * Box Plot Component
 * Displays distribution quartiles using custom SVG rendering
 */

interface Props {
    data: {
        min: number;
        q1: number;
        median: number;
        q3: number;
        max: number;
        iqr: number;
    };
    label: string;
    color?: string;
    unit?: string;
}

const props = withDefaults(defineProps<Props>(), {
    color: '#3b82f6', // blue-500
    unit: ''
});

// SVG dimensions
const width = 400;
const height = 120;
const margin = { top: 20, right: 20, bottom: 30, left: 60 };
const plotWidth = width - margin.left - margin.right;
const plotHeight = height - margin.top - margin.bottom;

// Scale calculation
const getXPosition = (value: number): number => {
    const { min, max } = props.data;
    const range = max - min;
    if (range === 0) return plotWidth / 2;
    return ((value - min) / range) * plotWidth;
};
</script>

<template>
    <div class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="ph-bold ph-chart-bar-horizontal text-blue-600"></i>
            {{ label }}
        </h3>

        <!-- SVG Box Plot -->
        <svg :width="width" :height="height" class="mx-auto">
            <g :transform="`translate(${margin.left}, ${margin.top})`">
                <!-- Whisker line (Min to Max) -->
                <line
                    :x1="getXPosition(data.min)"
                    :y1="plotHeight / 2"
                    :x2="getXPosition(data.max)"
                    :y2="plotHeight / 2"
                    stroke="#9ca3af"
                    stroke-width="2"
                />

                <!-- Min whisker -->
                <line
                    :x1="getXPosition(data.min)"
                    :y1="plotHeight / 2 - 15"
                    :x2="getXPosition(data.min)"
                    :y2="plotHeight / 2 + 15"
                    stroke="#9ca3af"
                    stroke-width="2"
                />

                <!-- Max whisker -->
                <line
                    :x1="getXPosition(data.max)"
                    :y1="plotHeight / 2 - 15"
                    :x2="getXPosition(data.max)"
                    :y2="plotHeight / 2 + 15"
                    stroke="#9ca3af"
                    stroke-width="2"
                />

                <!-- Box (Q1 to Q3) -->
                <rect
                    :x="getXPosition(data.q1)"
                    :y="plotHeight / 2 - 20"
                    :width="getXPosition(data.q3) - getXPosition(data.q1)"
                    height="40"
                    :fill="color"
                    fill-opacity="0.3"
                    :stroke="color"
                    stroke-width="2"
                />

                <!-- Median line -->
                <line
                    :x1="getXPosition(data.median)"
                    :y1="plotHeight / 2 - 20"
                    :x2="getXPosition(data.median)"
                    :y2="plotHeight / 2 + 20"
                    :stroke="color"
                    stroke-width="3"
                />

                <!-- Labels -->
                <text
                    :x="getXPosition(data.min)"
                    :y="-5"
                    text-anchor="middle"
                    class="text-xs fill-gray-600"
                >
                    Min: {{ data.min.toFixed(1) }}{{ unit }}
                </text>
                <text
                    :x="getXPosition(data.median)"
                    :y="plotHeight + 10"
                    text-anchor="middle"
                    class="text-xs fill-gray-900 font-bold"
                >
                    Median: {{ data.median.toFixed(1) }}{{ unit }}
                </text>
                <text
                    :x="getXPosition(data.max)"
                    :y="-5"
                    text-anchor="middle"
                    class="text-xs fill-gray-600"
                >
                    Max: {{ data.max.toFixed(1) }}{{ unit }}
                </text>
            </g>
        </svg>

        <!-- Statistics Table -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
            <div class="bg-gray-50 p-3 rounded-lg text-center">
                <div class="text-xs text-gray-500 font-medium">Min</div>
                <div class="text-lg font-mono font-bold text-gray-900">{{ data.min.toFixed(1) }}</div>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg text-center">
                <div class="text-xs text-gray-500 font-medium">Q1</div>
                <div class="text-lg font-mono font-bold text-gray-900">{{ data.q1.toFixed(1) }}</div>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg text-center border-2 border-blue-200">
                <div class="text-xs text-blue-700 font-bold">Median</div>
                <div class="text-lg font-mono font-bold text-blue-900">{{ data.median.toFixed(1) }}</div>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg text-center">
                <div class="text-xs text-gray-500 font-medium">Q3</div>
                <div class="text-lg font-mono font-bold text-gray-900">{{ data.q3.toFixed(1) }}</div>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg text-center">
                <div class="text-xs text-gray-500 font-medium">Max</div>
                <div class="text-lg font-mono font-bold text-gray-900">{{ data.max.toFixed(1) }}</div>
            </div>
        </div>

        <!-- IQR Info -->
        <div class="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
            <strong>IQR (Interquartilsabstand):</strong> {{ data.iqr.toFixed(1) }}{{ unit }} — 
            Mittlere 50% der Werte liegen zwischen {{ data.q1.toFixed(1) }} und {{ data.q3.toFixed(1) }}.
        </div>
    </div>
</template>
