<template>
  <!-- 学習レポート（個別）コンポーネント -->
  <div v-if="isLoading" class="py-10 text-center">
    <LoadingSpinner size="lg" message="データを読み込んでいます..." />
  </div>

  <!-- データ取得後の表示 -->
  <MultiCardDetailLayout v-else>
    <!-- パンくずリスト -->
    <template #breadcrumb>
      <nav class="flex items-center text-sm text-slate-500">
        <router-link :to="`/learning/${contentId}`" class="flex items-center font-medium text-violet-600 hover:text-violet-800 hover:underline">
          <ArrowLeftIcon class="w-4 h-4 mr-1" />
          {{ learningContent ? learningContent.title : '' }}
        </router-link>
        <span class="mx-2">/</span>
        <span>個別レポート</span>
      </nav>
    </template>

    <!-- セクションヘッダー -->
    <template #section-header>
      <h2 class="section-header">個別レポート: {{ learningContent ? learningContent.title : '' }}</h2>
      <div class="section-subtext">
        <span>直近30日間の個別レポートを確認できます。</span>
      </div>
    </template>

    <!-- メインコンテンツ（グラフ） -->
    <template #main-content>
      <div v-if="learningContent">
        <h3 class="section-subheader">日別学習時間</h3>
        <div class="h-80">
          <LineChart :data="dailyStudyData" />
        </div>
      </div>
      <div v-else class="text-center text-slate-500">
        <p>学習内容が見つかりません。</p>
      </div>
    </template>

    <!-- 追加カード（学習記録一覧） -->
    <template #additional-cards>
      <div v-if="learningContent" class="p-8 border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl border-white/20">
        <h3 class="section-subheader">学習記録一覧</h3>

        <div v-if="paginatedRecords.length > 0" class="space-y-4">
          <LearningRecordCard v-for="record in paginatedRecords" :key="record.id" :record="record" @edit="router.push(`/learning-contents/${contentId}/sessions/${record.id}/edit`)" @delete="openDeleteModal(record)">
            <template #additional-info="{ record }">
              <div>
                <span class="text-sm text-slate-600"
                  >セクション:
                  <router-link :to="`/learning/${contentId}/section/${record.section_id}`" class="font-medium text-violet-600 hover:underline"> {{ record.section?.title }} </router-link>
                </span>
              </div>
            </template>
          </LearningRecordCard>
          <!-- ページネーション -->
          <Pagination :total-items="allContentSessionsRecords.length" :items-per-page="recordItemsPerPage" :current-page="recordCurrentPage" @update:currentPage="recordCurrentPage = $event" />
        </div>

        <!-- 学習記録が存在しない（未着手）場合の表示 -->
        <div v-else class="py-10 text-center text-slate-500">
          <p>この学習内容の学習記録はまだありません。</p>
        </div>

        <!-- アクションボタン -->
        <div class="flex justify-end pt-6 mt-6 space-x-4 border-t border-slate-200">
          <BackButton @click="router.back()" />
        </div>
      </div>
    </template>
  </MultiCardDetailLayout>

  <Teleport to="#app">
    <DeleteRecordConfirmModal :is-open="isModalOpen" :record="recordToDelete" :is-submitting="isSubmitting" @confirm="confirmDelete" @cancel="isModalOpen = false" />
  </Teleport>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// Piniaストア
import { useAuthStore } from '@/stores/auth';
// コンポーザブル
import { useLearningData } from '@/composables/useLearningData';
import { useLoading } from '@/composables/ui/useLoading';

// コンポーネント
import MultiCardDetailLayout from '@/layouts/MultiCardDetailLayout.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import BackButton from '@/components/common/buttons/BackButton.vue';
import LearningRecordCard from '@/components/learning/LearningRecordCard.vue';
import Pagination from '@/components/common/Pagination.vue';
import DeleteRecordConfirmModal from '@/components/learning/DeleteRecordConfirmModal.vue';
import LineChart from '@/components/charts/LineChart.vue';

// ========================================
// ユーティリティ関数（純粋関数）
// ========================================
import { formatDateTime, formatMinutes } from '@/utils/dateFormatters';

// ========================================
// 初期設定
// ========================================
// ルーター・ルート
const route = useRoute();
const router = useRouter();

// コンポーザブル
const authStore = useAuthStore();
const { learningContents, sections, deleteStudySession, fetchContents } = useLearningData();
const { isLoading, withLoading } = useLoading();

// ========================================
// 状態管理
// ========================================
// 日別統計データを格納するリアクティブな参照
const dailyStatisticsData = ref([]);
// 特定の学習内容に紐づくセッションデータを格納するリアクティブな参照
const contentSessions = ref([]);

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
// ルートパラメータから学習内容IDを取得
const contentId = computed(() => parseInt(route.params.id, 10));
// 取得したコンテンツIDに基づいて、学習内容の情報を算出
const learningContent = computed(() => learningContents.value.find((c) => c.id === contentId.value));

// 学習記録一覧（contentSessionsを使うように変更）
const allContentSessionsRecords = computed(() => {
  // セッションデータを日付でソートし、セクションタイトルを付与して整形
  return contentSessions.value
    .sort((a, b) => new Date(b.studied_at) - new Date(a.studied_at))
    .map((session) => {
      // セッションのsection_idに対応するセクション情報を検索
      const section = sections.value.find((s) => s.id === session.section_id);
      return {
        ...session,
        // セクションタイトルが存在すればそれを使用、なければ'N/A'
        sectionTitle: section?.title || session.section?.title || 'N/A',
      };
    });
});

// ページネーションされた学習記録リスト
const paginatedRecords = computed(() => {
  // 現在のページと1ページあたりのアイテム数に基づいて表示するレコードをスライス
  const startIndex = (recordCurrentPage.value - 1) * recordItemsPerPage;
  const endIndex = startIndex + recordItemsPerPage;
  return allContentSessionsRecords.value.slice(startIndex, endIndex);
});

// グラフデータ
const dailyStudyData = computed(() => {
  // APIから取得したデータが空の場合は早期リターン
  if (!dailyStatisticsData.value || dailyStatisticsData.value.length === 0) {
    return {
      labels: [],
      datasets: [
        {
          label: '学習時間 (分)',
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          tension: 0.3,
          fill: true,
          data: [],
        },
      ],
    };
  }

  // APIから取得したデータをそのまま使用
  const apiData = dailyStatisticsData.value;

  // 今日の日付を取得
  const today = new Date().toISOString().split('T')[0];

  // Chart.jsのデータ形式に変換（シンプルに）
  const chartData = {
    labels: apiData.map((item) => {
      // タイムゾーン問題を回避: "YYYY-MM-DD"に"T00:00:00"を付与してローカルタイムとして解釈させる
      // これを行わないと、ブラウザによってはUTCと解釈され、前日の日付になってしまう可能性がある
      const date = new Date(item.date + 'T00:00:00');
      const isToday = item.date === today;
      const label = date.toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
      });
      return isToday ? `${label}(今日)` : label;
    }),
    datasets: [
      {
        label: '学習時間 (分)',
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.3,
        fill: true,
        data: apiData.map((item) => Number(item.total_minutes || 0)),
        // 今日のポイントを視覚的に区別（オレンジ色）し、ユーザーが現在位置を把握しやすくする
        pointBackgroundColor: apiData.map((item) => (item.date === today ? '#f59e0b' : '#7c3aed')),
        pointRadius: apiData.map((item) => (item.date === today ? 6 : 3)),
      },
    ],
  };

  return chartData;
});

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  // ログアウト中は処理をスキップ
  if (!authStore.isLoggedIn) {
    return;
  }

  await withLoading('study-progress-init', async () => {
    // 学習内容がまだロードされていない場合、ロードをトリガー
    if (learningContents.value.length === 0) {
      await fetchContents();
    }

    // 並列でAPIデータを取得: 独立したリクエストを同時に開始し、待ち時間を短縮
    await Promise.all([
      // 日別統計データをAPIから取得（直近30日分）
      axios
        .get(`/api/learning-contents/${contentId.value}/statistics/daily`, {
          params: { days: 30 },
        })
        .then((response) => {
          dailyStatisticsData.value = response.data;
        })
        .catch((error) => {
          console.error('日別統計の取得に失敗しました:', error);
        }),

      // 学習セッションデータをAPIから取得
      axios
        .get('/api/learning-sessions', {
          params: { learning_content_id: contentId.value },
        })
        .then((response) => {
          contentSessions.value = response.data.data || [];
        })
        .catch((error) => {
          console.error('学習セッションの取得に失敗しました:', error);
        }),
    ]);
  });
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ
// 削除モーダルを開く
const openDeleteModal = (record) => {
  // TODO:削除処理中の場合は新しいモーダルを開かないようにする
  if (isSubmitting.value) {
    return;
  }
  recordToDelete.value = record;
  isModalOpen.value = true;
};

// API関連処理
// 削除確認時の処理
const confirmDelete = async () => {
  if (!recordToDelete.value) {
    isModalOpen.value = false;
    return;
  }
  const recordId = recordToDelete.value.id;
  // モーダルを先に閉じることで表示崩れを防止
  isModalOpen.value = false;
  // ボタンの無効化（二重送信防止）
  isSubmitting.value = true;

  try {
    // 削除処理API
    await deleteStudySession(recordId);

    // 並列でAPIデータを再取得: 削除により統計情報が変化するため、関連データをリフレッシュして整合性を保つ
    await Promise.all([
      // 日別統計データをAPIから取得
      axios
        .get(`/api/learning-contents/${contentId.value}/statistics/daily`, {
          params: { days: 30 },
        })
        .then((response) => {
          dailyStatisticsData.value = response.data;
        }),
      // 学習セッションデータをAPIから取得
      axios
        .get('/api/learning-sessions', {
          params: { learning_content_id: contentId.value },
        })
        .then((response) => {
          contentSessions.value = response.data.data || [];
        }),
    ]);
  } catch (error) {
    console.error('削除処理に失敗しました:', error);
  } finally {
    isSubmitting.value = false;
    recordToDelete.value = null;
  }
};
</script>
