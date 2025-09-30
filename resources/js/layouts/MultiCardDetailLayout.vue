<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30">
    <div class="max-w-4xl p-8 mx-auto space-y-8">
      <!-- メインカード -->
      <div class="p-8 border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl border-white/20">
        <!-- パンくずリスト -->
        <DetailBreadcrumb v-if="$slots.breadcrumb">
          <slot name="breadcrumb" />
        </DetailBreadcrumb>

        <!-- セクションヘッダー -->
        <DetailSectionHeader v-if="$slots['section-header']">
          <slot name="section-header" />
        </DetailSectionHeader>

        <!-- メインコンテンツ -->
        <div class="mt-6">
          <slot name="main-content" />
        </div>

        <!-- メインカードのアクション（オプション） -->
        <div v-if="$slots['main-actions']" class="flex justify-end pt-6 mt-6 space-x-4 border-t border-slate-200">
          <slot name="main-actions" />
        </div>
      </div>

      <!-- 追加カード（複数配置可能） -->
      <slot name="additional-cards" />
    </div>
  </div>
</template>

<script setup>
import DetailBreadcrumb from '@/components/layout/DetailBreadcrumb.vue';
import DetailSectionHeader from '@/components/layout/DetailSectionHeader.vue';
</script>
