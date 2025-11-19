<template>
  <!-- 学習ダッシュボードコンポーネント -->
  <DashboardLayout>
    <template #header-title>学習ダッシュボード</template>
    <template #header-action>
      <BaseButton variant="primary" :left-icon="PlusCircleIcon" @click="goToCreatePage" class="ml-auto">学習を追加</BaseButton>
    </template>
    <template #header-description>あなたの学習進捗を管理・追跡します</template>

    <!-- ローディング中の表示 -->
    <div v-if="isLoading" class="py-10 text-center">
      <LoadingSpinner size="lg" message="データを読み込んでいます..." />
    </div>
    <div v-else>
      <!-- 学習統計概要を表示するコンポーネント -->
      <StatsOverview :learningContents="learningContents" />

      <!-- 進行中の学習コンテンツをカード形式で表示するセクション -->
      <div class="mb-6">
        <h3 class="mb-4 text-lg font-semibold md:text-xl text-slate-900">進行中の学習</h3>
        <div v-if="inProgressContents.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <LearningContentCard v-for="content in inProgressContents" :key="content.id" :content="content" />
        </div>
        <div v-else class="py-8 text-center md:py-10 text-slate-500">
          <p>進行中の学習コンテンツはありません。</p>
        </div>
      </div>

      <!-- 完了した学習コンテンツをカード形式で表示するセクション -->
      <div class="pt-6 mb-6 border-t border-slate-200">
        <h3 class="mb-4 text-lg font-semibold md:text-xl text-slate-900">完了した学習</h3>
        <div v-if="completedContents.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <LearningContentCard v-for="content in completedContents" :key="content.id" :content="content" />
        </div>
        <div v-else class="py-8 text-center md:py-10 text-slate-500">
          <p>完了した学習コンテンツはありません。</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PlusCircleIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// コンポーザブル
import { useLearningData } from '@/composables/useLearningData';
import { useLoading } from '@/composables/ui/useLoading';

// コンポーネント
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import LearningContentCard from '@/components/learning/LearningContentCard.vue';
import StatsOverview from '@/components/learning/StatsOverview.vue';

// ========================================
// 初期設定
// ========================================
const router = useRouter();

// ========================================
// コンポーザブル実行
// ========================================
const { learningContents, fetchContents, fetchLearningSessions } = useLearningData();
const { isLoading, withLoading } = useLoading();

// ========================================
// 算出プロパティ
// ========================================
/**
 * 進行中の学習コンテンツをフィルタリングし、優先度順にソート
 *
 * ソートの優先順位（上から順に適用）:
 * 1. 最新の学習記録がある学習コンテンツを先頭に配置
 * 2. 「学習中」を「未着手」より先頭に配置
 * 3. 学習コンテンツ自体の更新日時が新しいものを先頭に配置
 *
 * sort()の比較関数の仕組み:
 * - 負の値を返す → a（第1引数）をb（第2引数）より前に配置
 * - 正の値を返す → b（第2引数）をa（第1引数）より前に配置
 * - 0を返す → 順序を変更しない
 */
const inProgressContents = computed(() => {
  return learningContents.value
    .filter((content) => content.status === 'in_progress' || content.status === 'not_started')
    .sort((a, b) => {
      // a, b = 比較対象の2つの学習コンテンツオブジェクト
      // 優先度1: 最新の学習記録日時で比較
      if (a.latestSessionUpdatedAt && b.latestSessionUpdatedAt) {
        const timeDiff = new Date(b.latestSessionUpdatedAt).getTime() - new Date(a.latestSessionUpdatedAt).getTime();
        if (timeDiff !== 0) {
          // b（第2引数）の方が新しい → 正の値 → bを前に配置
          // a（第1引数）の方が新しい → 負の値 → aを前に配置
          return timeDiff;
        }
      } else if (a.latestSessionUpdatedAt) {
        // aのみ学習記録あり → aを前に配置
        return -1;
      } else if (b.latestSessionUpdatedAt) {
        // bのみ学習記録あり → bを前に配置
        return 1;
      }
      // 優先度2: 「学習中」を「未着手」より前に配置
      if (a.status === 'in_progress' && b.status === 'not_started') return -1; // aを前に
      if (a.status === 'not_started' && b.status === 'in_progress') return 1; // bを前に
      // 優先度3: 学習コンテンツ自体の更新日時で比較（新しいものを前に）
      // b（第2引数）の方が新しい → 正の値 → bを前に配置
      // a（第1引数）の方が新しい → 負の値 → aを前に配置
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
});

/**
 * 完了した学習コンテンツをフィルタリングし、優先度順にソート
 *
 * ソートの優先順位（上から順に適用）:
 * 1. 最新の学習記録がある学習コンテンツを先頭に配置
 * 2. 学習コンテンツ自体の更新日時が新しいものを先頭に配置
 */
const completedContents = computed(() => {
  return learningContents.value
    .filter((content) => content.status === 'completed')
    .sort((a, b) => {
      // a, b = 比較対象の2つの学習コンテンツオブジェクト
      // 優先度1: 最新の学習記録日時で比較
      if (a.latestSessionUpdatedAt && b.latestSessionUpdatedAt) {
        const timeDiff = new Date(b.latestSessionUpdatedAt).getTime() - new Date(a.latestSessionUpdatedAt).getTime();
        if (timeDiff !== 0) {
          // b（第2引数）の方が新しい → 正の値 → bを前に配置
          // a（第1引数）の方が新しい → 負の値 → aを前に配置
          return timeDiff;
        }
      } else if (a.latestSessionUpdatedAt) {
        // aのみ学習記録あり → aを前に配置
        return -1;
      } else if (b.latestSessionUpdatedAt) {
        // bのみ学習記録あり → bを前に配置
        return 1;
      }
      // 優先度2: 学習コンテンツ自体の更新日時で比較（新しいものを前に）
      // b（第2引数）の方が新しい → 正の値 → bを前に配置
      // a（第1引数）の方が新しい → 負の値 → aを前に配置
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
});

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  // withLoadingで非同期処理をラップ
  await withLoading('dashboard-init', async () => {
    // 並列実行でパフォーマンス向上
    await Promise.all([fetchContents(), fetchLearningSessions()]);
  });
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ
const goToCreatePage = () => {
  router.push('/learning-contents/create');
};
</script>
