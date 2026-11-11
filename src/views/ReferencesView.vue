<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n({ useScope: 'global' });

const wikiUrl = computed(() =>
  locale.value === 'en'
    ? 'https://en.wikipedia.org/wiki/Skip-Bo'
    : 'https://de.wikipedia.org/wiki/Skip-Bo'
);
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-12">

    <!-- Hero Section -->
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border-2 border-red-200">
        <i class="ph-fill ph-books text-xl"></i>
        {{ t('nav.knowledge') }}
      </div>
      <h1 class="text-4xl font-bold text-gray-900">{{ t('references.title') }}</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        {{ t('references.sub') }}
      </p>
    </div>

    <!-- Official rules & game -->
    <section class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <i class="ph-bold ph-scroll text-red-600"></i>
        {{ t('references.rulesH') }}
      </h2>
      <ul class="space-y-3">
        <li>
          <a href="https://service.mattel.com/instruction_sheets/42050.pdf"
             target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-red-300 hover:bg-red-50 transition-colors group">
            <i class="ph-bold ph-file-pdf text-2xl text-red-600"></i>
            <span class="flex-1">
              <span class="block font-bold text-gray-900">{{ t('references.mattel') }}</span>
              <span class="block text-sm text-gray-600">{{ t('references.mattelSub') }}</span>
            </span>
            <i class="ph-bold ph-arrow-square-out text-gray-400 group-hover:text-red-600"></i>
          </a>
        </li>
        <li>
          <a :href="wikiUrl"
             target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-red-300 hover:bg-red-50 transition-colors group">
            <i class="ph-bold ph-globe text-2xl text-blue-600"></i>
            <span class="flex-1">
              <span class="block font-bold text-gray-900">{{ t('references.wiki') }}</span>
              <span class="block text-sm text-gray-600">{{ t('references.wikiSub') }}</span>
            </span>
            <i class="ph-bold ph-arrow-square-out text-gray-400 group-hover:text-red-600"></i>
          </a>
        </li>
      </ul>
    </section>

    <!-- Scientific foundations -->
    <section class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <i class="ph-bold ph-graduation-cap text-blue-600"></i>
        {{ t('references.sciH') }}
      </h2>
      <ul class="space-y-3">
        <li>
          <a href="/documents/jahnke-studienarbeit-07.pdf"
             target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <i class="ph-bold ph-file-pdf text-2xl text-blue-600"></i>
            <span class="flex-1">
              <span class="block font-bold text-gray-900">{{ t('references.jahnke') }}</span>
              <span class="block text-sm text-gray-600">{{ t('references.jahnkeSub') }}</span>
            </span>
            <i class="ph-bold ph-arrow-square-out text-gray-400 group-hover:text-blue-600"></i>
          </a>
        </li>
        <li>
          <a href="https://jmvidal.cse.sc.edu/library/sutton88a.pdf"
             target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <i class="ph-bold ph-file-pdf text-2xl text-blue-600"></i>
            <span class="flex-1">
              <span class="block font-bold text-gray-900">{{ t('references.sutton88') }}</span>
              <span class="block text-sm text-gray-600">{{ t('references.sutton88Sub') }}</span>
            </span>
            <i class="ph-bold ph-arrow-square-out text-gray-400 group-hover:text-blue-600"></i>
          </a>
        </li>
        <li>
          <a href="https://web.stanford.edu/class/psych209/Readings/SuttonBartoIPRLBook2ndEd.pdf"
             target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <i class="ph-bold ph-book-open text-2xl text-blue-600"></i>
            <span class="flex-1">
              <span class="block font-bold text-gray-900">{{ t('references.suttonBarto') }}</span>
              <span class="block text-sm text-gray-600">{{ t('references.suttonBartoSub') }}</span>
            </span>
            <i class="ph-bold ph-arrow-square-out text-gray-400 group-hover:text-blue-600"></i>
          </a>
        </li>
      </ul>
    </section>

    <!-- This project -->
    <section class="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <i class="ph-bold ph-github-logo text-purple-600"></i>
        {{ t('references.projectH') }}
      </h2>
      <ul class="space-y-3">
        <li>
          <a href="/documents/Deterministic_SkipBo_HPVP_Agent_Analysis.pdf"
             target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-colors group">
            <i class="ph-bold ph-file-pdf text-2xl text-purple-600"></i>
            <span class="flex-1">
              <span class="block font-bold text-gray-900">{{ t('references.paper') }}</span>
              <span class="block text-sm text-gray-600">{{ t('references.paperSub') }}</span>
            </span>
            <i class="ph-bold ph-arrow-square-out text-gray-400 group-hover:text-purple-600"></i>
          </a>
        </li>
        <li>
          <a href="https://github.com/stritti/skip-bo-strategy-evaluation"
             target="_blank" rel="noopener noreferrer"
             class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-colors group">
            <i class="ph-bold ph-github-logo text-2xl text-purple-600"></i>
            <span class="flex-1">
              <span class="block font-bold text-gray-900">{{ t('references.repo') }}</span>
              <span class="block text-sm text-gray-600">{{ t('references.repoSub') }}</span>
            </span>
            <i class="ph-bold ph-arrow-square-out text-gray-400 group-hover:text-purple-600"></i>
          </a>
        </li>
      </ul>
    </section>

  </div>
</template>
