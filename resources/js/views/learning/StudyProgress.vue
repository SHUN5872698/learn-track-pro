<template>
  <!-- 学習レポート（個別）コンポーネント -->
  <div class="max-w-4xl p-8 mx-auto">
    <!-- メインカード（概要とグラフ統合） -->
    <DetailLayout>
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

      <template #section-header>
        <h2 class="mb-2 text-2xl font-bold text-slate-800">個別レポート: {{ learningContent ? learningContent.title : '' }}</h2>
        <p class="text-slate-600">直近30日間の個別レポートを確認できます。</p>
      </template>

      <!-- ローディング -->
      <div v-if="loading" class="py-10 text-center">
        <p class="text-slate-500">データを読み込んでいます...</p>
      </div>

      <div v-else-if="learningContent">
        <!-- 日別学習時間グラフ -->
        <div>
          <h3 class="mb-4 text-lg font-semibold text-slate-800">日別学習時間</h3>
          <div class="h-80">
            <LineChart :data="dailyStudyData" />
          </div>
        </div>
      </div>

      <div v-else class="text-center text-slate-500">
        <p>学習コンテンツが見つかりません。</p>
      </div>
    </DetailLayout>

    <!-- 学習記録一覧カード（独立したカード） -->
    <div v-if="learningContent" class="max-w-4xl p-8 mx-auto">
      <div class="p-8 border shadow-lg bg-white/70 backdrop-blur-md rounded-2xl border-white/20">
        <h3 class="mb-4 text-lg font-semibold text-slate-800">学習記録一覧</h3>

        <div v-if="paginatedRecords.length > 0" class="space-y-4">
          <div v-for="record in paginatedRecords" :key="record.id" class="p-5 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="font-semibold text-slate-800">
                  {{ formatDate(record.studied_at) }}
                  <span class="text-slate-600">({{ formatTimeOnly(record.studied_at) }})</span>
                </p>
                <p class="text-sm text-slate-600">
                  セクション:
                  <router-link :to="`/learning/${contentId}/section/${record.section_id}`" class="font-medium text-violet-600 hover:underline">
                    {{ record.sectionTitle }}
                  </router-link>
                </p>
                <p class="text-sm text-slate-600">学習時間: {{ formatMinutes(record.study_minutes) }}</p>
                <div class="flex items-center mt-1">
                  <span class="mr-1 text-sm text-slate-600">調子:</span>
                  <StarIcon v-for="r in 5" :key="r" class="w-4 h-4" :class="r <= record.mood_rating ? 'text-yellow-400' : 'text-gray-300'" />
                </div>
                <p v-if="record.memo" class="mt-2 text-sm text-slate-700">メモ: {{ record.memo }}</p>
              </div>
              <div class="flex ml-4 space-x-2">
                <BaseButton variant="icon-primary" size="md" :left-icon="PencilIcon" :icon-only="true" @click="router.push(`/learning-contents/${contentId}/sessions/${record.id}/edit`)"> 記録を編集 </BaseButton>
                <DeleteButton variant="icon-danger" size="sm" @click="openDeleteModal(record)"> 記録を削除 </DeleteButton>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="py-10 text-center text-slate-500">
          <p>この学習コンテンツの学習記録はまだありません。</p>
        </div>

        <!-- ページネーションコントロール -->
        <Pagination :total-items="allContentSessionsRecords.length" :items-per-page="recordItemsPerPage" :current-page="recordCurrentPage" @update:currentPage="recordCurrentPage = $event" />

        <!-- アクションボタン -->
        <div class="flex justify-end pt-6 mt-6 space-x-4 border-t border-slate-200">
          <BackButton @click="router.back()" />
        </div>
      </div>
    </div>
  </div>

  <!-- 削除確認モーダル -->
  <Teleport to="#app">
    <ConfirmModal :is-open="isModalOpen" title="学習記録を削除しますか？" confirm-button-text="削除" @confirm="confirmDelete" @cancel="isModalOpen = false">
      <template #content>
        <div v-if="recordToDelete" class="p-4 mb-6 text-sm border rounded-lg bg-slate-50 border-slate-200">
          <p><span class="font-semibold">日時:</span> {{ formatDate(recordToDelete.studied_at) }} {{ formatTimeOnly(recordToDelete.studied_at) }}</p>
          <p><span class="font-semibold">学習時間:</span> {{ formatMinutes(recordToDelete.study_minutes) }}</p>
          <p v-if="recordToDelete.memo" class="mt-2"><span class="font-semibold">メモ:</span> {{ recordToDelete.memo }}</p>
        </div>
        <p class="mb-6 text-slate-600">この操作は元に戻せません。</p>
      </template>
    </ConfirmModal>
  </Teleport>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftIcon, StarIcon, PencilIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// コンポーザブル
import { useLearningData } from '../../composables/useLearningData';

// コンポーネント
import LineChart from '../../components/charts/LineChart.vue';
import DetailLayout from '../../layouts/DetailLayout.vue';
import ConfirmModal from '../../components/common/ConfirmModal.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import DeleteButton from '../../components/common/buttons/DeleteButton.vue';
import BackButton from '../../components/common/buttons/BackButton.vue';
import Pagination from '../../components/common/Pagination.vue';

// ========================================
// ユーティリティ関数（純粋関数）
// ========================================
import { formatDate, formatTimeOnly, formatMinutes } from '../../utils/dateFormatters';

// ========================================
// 初期設定
// ========================================
const route = useRoute();
const router = useRouter();

// ========================================
// コンポーザブル実行
// ========================================
// 学習データ全般を管理するコンポーザブルから必要な状態とアクションを取得
const { learningContents, sections, deleteStudySession, fetchContents, loading } = useLearningData();

// ========================================
// 状態管理
// ========================================
// 日別統計データを格納するリアクティブな参照
const dailyStatisticsData = ref([]);
// 特定の学習コンテンツに紐づくセッションデータを格納するリアクティブな参照
const contentSessions = ref([]);

// ページネーション
const recordCurrentPage = ref(1);
const recordItemsPerPage = 5;
// 削除モーダル
const isModalOpen = ref(false);
const recordToDelete = ref(null);

// ========================================
// 算出プロパティ
// ========================================
// ルートパラメータから学習コンテンツIDを取得
const contentId = computed(() => parseInt(route.params.id, 10));
// 取得したコンテンツIDに基づいて、学習コンテンツの情報を算出
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
  // 30日間の日別学習時間を初期化
  const dailyTotals = {};
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  // 過去30日間の日付を生成し、初期値を0に設定
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    dailyTotals[dateKey] = 0;
  }

  // APIから取得した日別統計データをマージ
  dailyStatisticsData.value.forEach((item) => {
    if (dailyTotals.hasOwnProperty(item.date)) {
      dailyTotals[item.date] = Number(item.total_minutes || 0);
    }
  });

  // Chart.jsのデータ形式に変換
  return {
    labels: Object.keys(dailyTotals).map((key) => new Date(key).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })),
    datasets: [
      {
        label: '学習時間 (分)',
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.3,
        fill: true,
        data: Object.values(dailyTotals),
      },
    ],
  };
});

// ========================================
// ライフサイクル
// ========================================
onMounted(async () => {
  loading.value = true;
  // 学習コンテンツがまだロードされていない場合、ロードをトリガー
  if (learningContents.value.length === 0) {
    await fetchContents();
  }

  // 日別統計データをAPIから取得
  try {
    const response = await axios.get(`/api/learning-contents/${contentId.value}/statistics/daily`, {
      params: { days: 30 },
    });
    dailyStatisticsData.value = response.data;
  } catch (error) {
    console.error('日別統計の取得に失敗しました:', error);
  }

  // 学習セッションデータをAPIから取得
  try {
    const response = await axios.get('/api/learning-sessions', {
      params: { learning_content_id: contentId.value },
    });
    contentSessions.value = response.data.data || [];
  } catch (error) {
    console.error('学習セッションの取得に失敗しました:', error);
  }
  loading.value = false;
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

// 削除確認時の処理
const confirmDelete = async () => {
  if (recordToDelete.value) {
    const recordId = recordToDelete.value.id;
    isModalOpen.value = false;
    // 削除処理
    await deleteStudySession(recordId);

    // 削除したアイテムをcontentSessionsから除外
    contentSessions.value = contentSessions.value.filter((session) => session.id !== recordId);

    // 日別統計も再取得
    try {
      const response = await axios.get(`/api/learning-contents/${contentId.value}/statistics/daily`, {
        params: { days: 30 },
      });
      dailyStatisticsData.value = response.data;
    } catch (error) {
      console.error('日別統計の再取得に失敗しました:', error);
    }

    // モーダルが完全に閉じた後にrecordToDeleteをクリア
    setTimeout(() => {
      recordToDelete.value = null;
    }, 300);
  } else {
    isModalOpen.value = false;
    recordToDelete.value = null;
  }
};
</script>
