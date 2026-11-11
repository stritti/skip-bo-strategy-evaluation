<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import StatsExplainer from '../components/dashboard/StatsExplainer.vue';
const { t } = useI18n({ useScope: 'global' });
// Scientific Validation View - Displays methodology and accuracy verification
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-12">
    
    <!-- Hero Section -->
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border-2 border-green-200">
        <i class="ph-fill ph-seal-check text-xl"></i>
        {{ t('validation.badge') }}
      </div>
      <h1 class="text-4xl font-bold text-gray-900">{{ t('validation.title') }}</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        {{ t('validation.sub') }}
      </p>
    </div>

    <!-- Key Validation Badges -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition">
        <div class="w-16 h-16 bg-green-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <i class="ph-fill ph-check-circle text-3xl"></i>
        </div>
        <h3 class="font-bold text-lg text-gray-900 mb-2">{{ t('validation.ruleCompliantH') }}</h3>
        <p class="text-sm text-gray-600">
          <span v-html="t('validation.ruleCompliantP')"></span>
        </p>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 text-center hover:shadow-lg transition">
        <div class="w-16 h-16 bg-blue-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <i class="ph-fill ph-function text-3xl"></i>
        </div>
        <h3 class="font-bold text-lg text-gray-900 mb-2">{{ t('validation.mathCorrectH') }}</h3>
        <p class="text-sm text-gray-600">
          <span v-html="t('validation.mathCorrectP')"></span>
        </p>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 text-center hover:shadow-lg transition">
        <div class="w-16 h-16 bg-purple-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <i class="ph-fill ph-chart-line text-3xl"></i>
        </div>
        <h3 class="font-bold text-lg text-gray-900 mb-2">{{ t('validation.statValidH') }}</h3>
        <p class="text-sm text-gray-600">
          <span v-html="t('validation.statValidP')"></span>
        </p>
      </div>
    </div>

    <!-- Deck Composition -->
    <section class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <i class="ph-bold ph-cards text-red-600"></i>
        {{ t('validation.deckTitle') }}
      </h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span class="font-medium text-gray-700">{{ t('validation.numberedCards') }}</span>
          <span class="font-mono font-bold text-blue-600">144 {{ t('validation.cards') }}</span>
        </div>
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span class="font-medium text-gray-700">{{ t('validation.jokers') }}</span>
          <span class="font-mono font-bold text-purple-600">18 {{ t('validation.cards') }}</span>
        </div>
        <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <span class="font-bold text-gray-900">{{ t('validation.totalDeck') }}</span>
          <span class="font-mono font-bold text-green-600 text-xl">162 {{ t('validation.cards') }}</span>
        </div>
      </div>
      <div class="mt-4 flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-gray-700">
          <strong>{{ t('validation.matchesSpec') }}</strong>
        </p>
        <a href="https://service.mattel.com/instruction_sheets/42050.pdf" 
           target="_blank" 
           rel="noopener noreferrer"
           class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap">
          <i class="ph-bold ph-file-pdf"></i>
          {{ t('validation.officialRules') }}
          <i class="ph-bold ph-arrow-square-out text-xs"></i>
        </a>
      </div>
    </section>

    <!-- Randomness Quality -->
    <section class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <i class="ph-bold ph-shuffle text-blue-600"></i>
        {{ t('validation.randomnessTitle') }}
      </h2>
      <div class="bg-white rounded-xl p-6 border border-blue-100">
        <h3 class="font-bold text-lg text-gray-900 mb-3">{{ t('validation.fisherYates') }}</h3>
        <ul class="space-y-2 text-sm text-gray-700">
          <li class="flex items-start gap-2">
            <i class="ph-fill ph-check text-green-500 mt-1"></i>
            <span><span v-html="t('validation.unbiased')"></span></span>
          </li>
          <li class="flex items-start gap-2">
            <i class="ph-fill ph-check text-green-500 mt-1"></i>
            <span><span v-html="t('validation.timeComplexity')"></span></span>
          </li>
          <li class="flex items-start gap-2">
            <i class="ph-fill ph-check text-green-500 mt-1"></i>
            <span><span v-html="t('validation.uniform')"></span></span>
          </li>
        </ul>
      </div>
      <div class="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
        <p class="text-sm text-gray-700">
          <span v-html="t('validation.rngSource')"></span>
        </p>
      </div>
    </section>

    <!-- Academic Reference -->
    <section class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <i class="ph-bold ph-graduation-cap text-blue-600"></i>
        {{ t('validation.academicTitle') }}
      </h2>
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
        <h3 class="font-bold text-gray-900 mb-2">{{ t('validation.jahnke') }}</h3>
        <p class="text-gray-700 mb-3 italic">
          {{ t('validation.jahnkePaper') }}
        </p>
        <p class="text-sm text-gray-600 mb-4">
          {{ t('validation.uni') }}
        </p>
        <a href="https://gki.informatik.uni-freiburg.de/papers/studienarbeiten/jahnke-studienarbeit-07.pdf" 
           target="_blank" 
           rel="noopener noreferrer"
           class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
          <i class="ph-bold ph-file-pdf"></i>
          {{ t('validation.downloadPdf') }}
          <i class="ph-bold ph-arrow-square-out text-xs"></i>
        </a>
      </div>
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <h4 class="font-bold text-sm text-gray-700 mb-2">{{ t('validation.keyFindings') }}</h4>
          <ul class="text-sm text-gray-600 space-y-1 list-disc ml-5">
            <li>{{ t('validation.tdEffective') }}</li>
            <li>{{ t('validation.vsvMetric') }}</li>
            <li>{{ t('validation.jokerConservation') }}</li>
          </ul>
        </div>
        <div class="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 class="font-bold text-sm text-gray-700 mb-2">{{ t('validation.ourImpl') }}</h4>
          <ul class="text-sm text-gray-600 space-y-1 list-disc ml-5">
            <li>{{ t('validation.optBased') }}</li>
            <li>{{ t('validation.vsvPrio') }}</li>
            <li>{{ t('validation.descDiscard') }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Statistical Validity -->
    <section class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <i class="ph-bold ph-chart-bar text-green-600"></i>
        {{ t('validation.statValidityTitle') }}
      </h2>
      <div class="space-y-6">
        <div>
          <h3 class="font-bold text-lg text-gray-800 mb-3">{{ t('validation.sampleReco') }}</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 border-b-2 border-gray-200">
                  <th class="text-left p-3 font-bold text-gray-700">{{ t('validation.colCI') }}</th>
                  <th class="text-center p-3 font-bold text-gray-700">{{ t('validation.colTolerance') }}</th>
                  <th class="text-center p-3 font-bold text-gray-700">{{ t('validation.colMinN') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-100">
                  <td class="p-3 font-medium text-gray-900">95% CI</td>
                  <td class="p-3 text-center font-mono">±1%</td>
                  <td class="p-3 text-center font-mono font-bold text-green-600">9,604</td>
                </tr>
                <tr class="border-b border-gray-100 bg-green-50">
                  <td class="p-3 font-medium text-gray-900">99% CI</td>
                  <td class="p-3 text-center font-mono">±0.5%</td>
                  <td class="p-3 text-center font-mono font-bold text-green-600">66,430</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
          <p class="text-sm text-gray-700">
            <strong>{{ t('validation.appSupports') }}</strong><br>
            {{ t('validation.appSupportsP') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Known Limitations -->
    <section class="bg-yellow-50 rounded-2xl border-2 border-yellow-200 p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <i class="ph-bold ph-warning text-yellow-600"></i>
        {{ t('validation.limitationsTitle') }}
      </h2>
      <div class="space-y-3">
        <div class="bg-white p-4 rounded-lg border border-yellow-200">
          <h4 class="font-bold text-sm text-gray-800 mb-1">{{ t('validation.lim1h') }}</h4>
          <p class="text-sm text-gray-600">
            {{ t('validation.lim1p') }}
          </p>
        </div>
        <div class="bg-white p-4 rounded-lg border border-yellow-200">
          <h4 class="font-bold text-sm text-gray-800 mb-1">{{ t('validation.lim2h') }}</h4>
          <p class="text-sm text-gray-600">
            {{ t('validation.lim2p') }}
          </p>
        </div>
        <div class="bg-white p-4 rounded-lg border border-yellow-200">
          <h4 class="font-bold text-sm text-gray-800 mb-1">{{ t('validation.lim3h') }}</h4>
          <p class="text-sm text-gray-600">
            {{ t('validation.lim3p') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Plain-language statistics glossary -->
    <StatsExplainer />

    <!-- Certification Footer -->
    <div class="text-center p-8 bg-gray-50 rounded-2xl border border-gray-200">
      <div class="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg mb-4">
        <i class="ph-fill ph-seal-check text-2xl"></i>
        <span>{{ t('validation.approved') }}</span>
      </div>
      <p class="text-sm text-gray-500">
        {{ t('validation.validatedOn') }}<br>
        {{ t('validation.methodology') }}
      </p>
    </div>

  </div>
</template>
