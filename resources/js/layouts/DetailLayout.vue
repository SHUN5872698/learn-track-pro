<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50/30">
    <div class="max-w-md p-4 mx-auto md:max-w-4xl md:p-8">
      <div class="p-4 border shadow-lg md:p-8 bg-white/70 backdrop-blur-md rounded-2xl border-white/20">
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
          <slot />
        </div>

        <!-- アクションボタン -->
        <div v-if="$slots.actions" class="flex justify-end pt-6 mt-6 space-x-4 border-t border-slate-200">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DetailBreadcrumb from '@/components/layout/DetailBreadcrumb.vue';
import DetailSectionHeader from '@/components/layout/DetailSectionHeader.vue';
</script>
