<template>
  <!-- 詳細レイアウトコンポーネント -->
  <div class="max-w-4xl p-8 mx-auto">
    <div class="p-8 border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl border-white/20">
      <!-- パンくずリスト（オプション） -->
      <div v-if="$slots.breadcrumb" class="mb-6">
        <slot name="breadcrumb"></slot>
      </div>

      <!-- セクションヘッダー（オプション） -->
      <div v-if="$slots['section-header'] || title || description || $slots['header-meta']" class="p-6 mb-6 bg-slate-50 rounded-xl">
        <!-- タイトル（props または slot） -->
        <h2 v-if="title || $slots['section-title']" class="mb-2 text-2xl font-bold text-slate-800">
          <slot name="section-title">{{ title }}</slot>
        </h2>

        <!-- メタ情報（統計など） -->
        <div v-if="$slots['header-meta']" class="flex space-x-6 text-slate-600">
          <slot name="header-meta"></slot>
        </div>

        <!-- 説明文（props または slot） -->
        <p v-if="description || $slots['section-description']" class="text-slate-600">
          <slot name="section-description">{{ description }}</slot>
        </p>

        <!-- カスタムヘッダーコンテンツ（後方互換性のため残す） -->
        <slot name="section-header"></slot>
      </div>

      <!-- メインコンテンツ -->
      <slot></slot>

      <!-- アクションボタン（オプション） -->
      <div v-if="$slots.actions" class="flex justify-end pt-8 mt-8 space-x-4 border-t border-slate-200">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
// propsでタイトルと説明を受け取れるようにする
defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
});
</script>
