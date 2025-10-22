<template>
  <!-- 全体レポートコンポーネント -->
  <DashboardLayout>
    <template #header-title>学習レポート</template>
    <template #header-description>あなたの学習活動の概要と統計です。</template>

    <!-- ローディング中の表示 -->
    <div v-if="isLoading" class="py-10 text-center">
      <LoadingSpinner size="lg" message="データを読み込んでいます..." />
    </div>
    <div v-else>
      <!-- 統計サマリーカード -->
      <div class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- 総学習時間 -->
        <div class="p-6 transition-all duration-300 transform border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl hover:shadow-xl border-white/20 hover:scale-105">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl">
                <ClockIcon class="w-10 h-10 text-violet-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-500">総学習時間</p>
              <p class="text-xl font-bold md:text-2xl text-slate-900">{{ totalStudyTime }}</p>
            </div>
          </div>
        </div>

        <!-- 完了コース数 -->
        <div class="p-6 transition-all duration-300 transform border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl hover:shadow-xl border-white/20 hover:scale-105">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                <CheckBadgeIcon class="w-10 h-10 text-emerald-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-500">完了コース数</p>
              <p class="text-xl font-bold md:text-2xl text-slate-900">{{ completedCoursesCount }}</p>
            </div>
          </div>
        </div>

        <!-- 平均学習時間 -->
        <div class="p-6 transition-all duration-300 transform border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl hover:shadow-xl border-white/20 hover:scale-105">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                <ChartBarIcon class="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-500">平均学習時間</p>
              <p class="text-xl font-bold md:text-2xl text-slate-900">{{ averageStudyTimePerDay }}</p>
            </div>
          </div>
        </div>

        <!-- 連続学習日数 -->
        <div class="p-6 transition-all duration-300 transform border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl hover:shadow-xl border-white/20 hover:scale-105">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
                <FireIcon class="w-10 h-10 text-amber-600" />
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-slate-500">連続学習日数</p>
              <p class="text-xl font-bold md:text-2xl text-slate-900">{{ consecutiveStudyDays }}日</p>
            </div>
          </div>
        </div>
      </div>

      <!-- グラフセクション -->
      <div class="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-5">
        <div class="p-6 border shadow-lg lg:col-span-3 bg-white/70 backdrop-blur-md rounded-2xl border-white/20">
          <h3 class="mb-4 text-lg font-semibold text-slate-800">月別学習時間 (直近6ヶ月)</h3>
          <div class="h-80">
            <BarChart :data="monthlyStudyData" />
          </div>
        </div>
        <div class="p-6 border shadow-lg lg:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl border-white/20">
          <h3 class="mb-4 text-lg font-semibold text-slate-800">技術別学習時間</h3>
          <div class="h-80">
            <PieChart :data="techStudyData" />
          </div>
        </div>
      </div>

      <!-- 最近の学習活動 -->
      <div class="p-6 border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl border-white/20">
        <h3 class="mb-4 text-lg font-semibold text-slate-800">最近の学習活動（学習内容別）</h3>
        <div v-if="paginatedRecords.length > 0" class="space-y-4">
          <LearningRecordCard v-for="record in paginatedRecords" :key="record.id" :record="record" @edit="router.push(`/learning-contents/${record.learning_content_id}/sessions/${record.id}/edit`)" @delete="openDeleteModal(record)">
            <template #additional-info="{ record }">
              <div>
                <span class="text-sm text-slate-600"
                  >学習内容:
                  <router-link :to="`/learning/${record.learning_content_id}/progress`" class="font-medium text-violet-600 hover:underline"> {{ record.learning_content?.title }} </router-link>
                </span>
              </div>
              <div>
                <span class="text-sm text-slate-600">セクション: {{ record.section?.title }} </span>
              </div>
            </template>
          </LearningRecordCard>

          <Pagination :total-items="allContentSessionsRecords.length" :items-per-page="recordItemsPerPage" :current-page="recordCurrentPage" @update:currentPage="recordCurrentPage = $event" />
        </div>
        <div v-else class="py-10 text-center text-slate-500">
          <p>学習記録はまだありません。</p>
        </div>
      </div>
    </div>
  </DashboardLayout>

  <Teleport to="#app">
    <DeleteRecordConfirmModal :is-open="isModalOpen" :record="recordToDelete" :is-submitting="isSubmitting" @confirm="confirmDelete" @cancel="isModalOpen = false" />
  </Teleport>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ClockIcon, CheckBadgeIcon, ChartBarIcon, FireIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// Pinia ストア
import { useAuthStore } from '@/stores/auth';
// コンポーザブル
import { useLearningData } from '@/composables/useLearningData';
import { useReportStore } from '@/stores/reports';
import { useLoading } from '@/composables/ui/useLoading';

// コンポーネント
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import DeleteRecordConfirmModal from '@/components/learning/DeleteRecordConfirmModal.vue';
import LearningRecordCard from '@/components/learning/LearningRecordCard.vue';
import Pagination from '@/components/common/Pagination.vue';
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';

// ========================================
// ユーティリティ関数（純粋関数）
// ========================================
import { generateTechColor } from '@/utils/chartColors';
import { formatDateTime, formatMinutes } from '@/utils/dateFormatters';

// ========================================
// 初期設定
// ========================================
const router = useRouter();
const authStore = useAuthStore();
const reportStore = useReportStore();

// ========================================
// コンポーザブル実行
// ========================================
// 学習データ全般を管理するコンポーザブルから必要な状態とアクションを取得
const { learningContents, deleteStudySession, fetchContents } = useLearningData();
const { isLoading, withLoading } = useLoading();

// ========================================
// 状態管理
// ========================================
// 内容別の最新学習記録
const latestSessionsByContent = ref([]);
// ページネーション
const recordCurrentPage = ref(1);
const recordItemsPerPage = 5;

// UI状態
const isSubmitting = ref(false);
// 削除モーダル
const isModalOpen = ref(false);
const recordToDelete = ref(null);

// ========================================
// 算出プロパティ
// ========================================
// --- データ集計ロジック ---
// 全ての学習セッションの合計学習時間を計算し、フォーマットして返す
const totalStudyTime = computed(() => {
  const totalMinutes = reportStore.statisticsSummary.total_study_minutes;
  return formatMinutes(totalMinutes);
});

// ステータスが「completed」の学習コンテンツの数をカウントする
const completedCoursesCount = computed(() => {
  return reportStore.statisticsSummary.completed_courses_count;
});

// 学習記録からユニークな学習日を抽出し、新しい順にソートして連続学習日数を計算する
const consecutiveStudyDays = computed(() => {
  return reportStore.statisticsSummary.consecutive_study_days;
});

// アクティブな学習日ごとの平均学習時間を計算し、日々の学習習慣を把握する
const averageStudyTimePerDay = computed(() => {
  const averageMinutes = reportStore.statisticsSummary.average_study_time_per_day;
  return formatMinutes(Math.round(averageMinutes));
});

// 現在の月から遡って6ヶ月前の1日を計算し、集計期間の開始日とする
const monthlyStudyData = computed(() => {
  // APIデータを元に6ヶ月分のデータを生成
  const monthlyTotals = {};
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  // 初期化
  for (let i = 0; i < 6; i++) {
    const date = new Date(sixMonthsAgo);
    date.setMonth(date.getMonth() + i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyTotals[monthKey] = 0;
  }

  // APIデータをマージ
  reportStore.monthlyData.forEach((item) => {
    if (monthlyTotals.hasOwnProperty(item.month)) {
      monthlyTotals[item.month] = item.total_minutes;
    }
  });

  return {
    labels: Object.keys(monthlyTotals).map((key) => `${key.split('-')[1]}月`),
    datasets: [
      {
        label: '学習時間 (分)',
        backgroundColor: '#7c3aed',
        borderRadius: 8,
        data: Object.values(monthlyTotals),
      },
    ],
  };
});

// 技術別の学習時間を集計し、円グラフ表示用のデータ形式に変換する
const techStudyData = computed(() => {
  const techData = reportStore.technologyData;

  let displayData;
  if (techData.length > 10) {
    const top9 = techData.slice(0, 9);
    const othersTotal = techData.slice(9).reduce((sum, item) => sum + Number(item.total_minutes || 0), 0);
    displayData = [
      ...top9.map((item) => ({
        name: item.technology_name,
        minutes: Number(item.total_minutes || 0),
      })),
    ];
    if (othersTotal > 0) {
      displayData.push({ name: 'その他', minutes: othersTotal });
    }
  } else {
    displayData = techData.map((item) => ({
      name: item.technology_name,
      minutes: Number(item.total_minutes || 0),
    }));
  }

  return {
    labels: displayData.map((item) => item.name),
    datasets: [
      {
        backgroundColor: displayData.map((item) => (item.name === 'その他' ? 'rgba(156, 163, 175, 0.8)' : generateTechColor(item.name))),
        data: displayData.map((item) => item.minutes),
      },
    ],
  };
});

// 全ての学習記録を整形し、ソート
const allContentSessionsRecords = computed(() => {
  return latestSessionsByContent.value.map((session) => ({
    ...session,
    learningContentTitle: session.learning_content?.title || 'N/A',
    sectionTitle: session.section?.title || 'N/A',
  }));
});

// ページネーションされた学習記録リスト
const paginatedRecords = computed(() => {
  const startIndex = (recordCurrentPage.value - 1) * recordItemsPerPage;
  const endIndex = startIndex + recordItemsPerPage;
  return allContentSessionsRecords.value.slice(startIndex, endIndex);
});

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  // ログアウト中は処理をスキップ
  if (!authStore.isLoggedIn) {
    return;
  }
  await withLoading('reports-init', async () => {
    if (learningContents.value.length === 0) {
      await fetchContents();
    }
    // 並列実行でパフォーマンス向上
    await Promise.all([reportStore.fetchStatisticsSummary(), reportStore.fetchMonthlyStatistics(6), reportStore.fetchTechnologyStatistics(), fetchLatestSessionsByContent()]);
  });
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ
// 削除モーダルを開く
const openDeleteModal = (record) => {
  recordToDelete.value = record;
  isModalOpen.value = true;
};

// API関連処理
// 最新学習記録の取得
async function fetchLatestSessionsByContent() {
  try {
    const response = await axios.get('/api/learning-sessions/statistics/latest-by-content');
    latestSessionsByContent.value = response.data.data || [];
  } catch (error) {
    console.error('最新学習記録の取得に失敗しました:', error);
    latestSessionsByContent.value = [];
  }
}

// 削除確認時の処理
const confirmDelete = async () => {
  if (!recordToDelete.value) {
    isModalOpen.value = false;
    return;
  }
  const recordId = recordToDelete.value.id;
  // モーダルを先に閉じることで表示崩れを防止
  isModalOpen.value = false;
  // ボタンの無効化
  isSubmitting.value = true;

  try {
    // 削除処理API
    await deleteStudySession(recordId);

    // withLoadingでローディング状態を管理しながらデータ再取得
    await withLoading('delete-record', async () => {
      await Promise.all([reportStore.fetchStatisticsSummary(), reportStore.fetchMonthlyStatistics(6), reportStore.fetchTechnologyStatistics(), fetchLatestSessionsByContent()]);
    });
  } catch (error) {
    console.error('削除処理に失敗しました:', error);
    // エラー時もリストを再取得してデータ整合性を保つ
    await withLoading('delete-record-error', async () => {
      await fetchLatestSessionsByContent();
    });
  } finally {
    // フォーム送信状態をリセット
    isSubmitting.value = false;
    // 初期化
    recordToDelete.value = null;
  }
};
</script>
