<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="mb-4 text-4xl font-bold text-gray-900">{{ title }}</h1>
      <p class="mb-8 text-xl text-gray-600">{{ message }}</p>
      <BaseButton to="/dashboard" variant="primary"> ダッシュボードへ戻る </BaseButton>
    </div>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// ========================================
// 内部インポート
// ========================================
// コンポーネント
import BaseButton from '@/components/common/BaseButton.vue';

// ========================================
// 初期設定
// ========================================
// ルーター・ルート
const route = useRoute();

// ========================================
// 算出プロパティ
// ========================================
// クエリパラメータからtypeを取得
const errorType = computed(() => route.query.type);

// エラー種別に応じた表示内容
const title = computed(() => {
  switch (errorType.value) {
    case 'forbidden':
      return 'アクセスできません';
    case 'notfound':
      return 'データが見つかりません';
    default:
      return 'ページが見つかりません';
  }
});

const message = computed(() => {
  switch (errorType.value) {
    case 'forbidden':
      return 'このページにアクセスする権限がありません';
    case 'notfound':
      return 'お探しのデータは削除されたか、存在しない可能性があります';
    default:
      return 'お探しのページは存在しないか、移動した可能性があります';
  }
});
</script>
