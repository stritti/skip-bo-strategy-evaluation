<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="text-center mb-10">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('rules.title') }}</h1>
      <p class="text-gray-500">{{ t('rules.subtitle') }}</p>
    </div>

    <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-8">
      <section>
        <h3 class="text-xl font-bold text-red-600 mb-3 flex items-center gap-2">
          <i class="ph-bold ph-target text-2xl"></i> {{ t('rules.s1h') }}
        </h3>
        <p class="text-gray-700" v-html="t('rules.s1p1')"></p>
        <p class="text-sm italic mt-2 text-gray-500">{{ t('rules.s1p2') }}</p>
      </section>

      <hr class="border-gray-200">

      <section>
        <h3 class="text-xl font-bold text-red-600 mb-3 flex items-center gap-2">
          <i class="ph-bold ph-deck-of-cards text-2xl"></i> {{ t('rules.s2h') }}
        </h3>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p class="font-semibold text-gray-800 mb-2">{{ t('rules.deckH') }}</p>
            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li v-html="t('rules.deckL1')"></li>
              <li v-html="t('rules.deckL2')"></li>
            </ul>
          </div>

          <p class="font-semibold text-gray-800">{{ t('rules.setupH') }}</p>
          <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li v-html="t('rules.setupL1')"></li>
            <li>{{ t('rules.setupL2') }}</li>
            <li v-html="t('rules.setupL3')"></li>
            <li v-html="t('rules.setupL4')"></li>
          </ul>
        </div>
      </section>

      <hr class="border-gray-200">

      <section>
        <h3 class="text-xl font-bold text-red-600 mb-3 flex items-center gap-2">
          <i class="ph-bold ph-sign-post text-2xl"></i> {{ t('rules.s3h') }}
        </h3>

        <p class="text-gray-700 mb-4">{{ t('rules.s3intro') }}</p>
        <ol class="list-decimal list-inside text-gray-700 space-y-3 ml-4">
          <li v-html="t('rules.s3l1')"></li>
          <li>
            <span v-html="t('rules.s3l2')"></span>
            <ul class="list-disc list-inside text-gray-600 space-y-1 mt-1 ml-4">
              <li>{{ t('rules.s3l2a') }}</li>
              <li v-html="t('rules.s3l2b')"></li>
              <li v-html="t('rules.s3l2c')"></li>
            </ul>
          </li>
          <li v-html="t('rules.s3l3')"></li>
          <li v-html="t('rules.s3l4')"></li>
          <li v-html="t('rules.s3l5')"></li>
        </ol>
      </section>

      <hr class="border-gray-200">

      <section>
        <h3 class="text-xl font-bold text-red-600 mb-3 flex items-center gap-2">
          <i class="ph-bold ph-diamond text-2xl"></i> {{ t('rules.s4h') }}
        </h3>
        <p class="text-gray-700">{{ t('rules.s4p') }}</p>
        <div class="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
          <p class="font-bold text-red-800">{{ t('rules.s4boxH') }}</p>
          <p class="text-sm text-red-700" v-html="t('rules.s4boxP')"></p>
        </div>
      </section>

    </div>
  </div>
</template>
