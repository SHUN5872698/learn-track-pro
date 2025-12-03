import { computed } from 'vue';
import { useLearningContentStore } from '@/stores/learningContent';
import { useMasterDataStore } from '@/stores/masterData';
import { useSectionStatus } from '@/composables/useSectionStatus';

// 学習内容関連のデータと操作ロジックを提供するコンポーザブル
export function useLearningContents() {
  const contentStore = useLearningContentStore();
  const masterDataStore = useMasterDataStore();

  // ストアの学習内容データを整形し、進捗率や技術名を追加
  const learningContents = computed(() => {
    return contentStore.contents.map((content) => {
      // 進捗率を計算し、0除算を回避
      const progress = content.total_sections > 0 ? Math.round((content.completed_sections / content.total_sections) * 100) : 0;

      return {
        ...content,
        // APIからeager loadされた技術情報をそのまま利用
        technology: content.technology?.name || '不明',
        progress,
        // API実装まで一時的に固定値またはnullを設定
        totalStudyMinutes: 0,
        latestSessionUpdatedAt: content.updated_at, // 代わりにコンテンツ自体の更新日を使用
      };
    });
  });

  // ストアの生データをそのまま取得
  const learningContentsRaw = computed(() => contentStore.contents);

  // セクションステータス関連のヘルパー関数を取得
  const { countCompletedSections } = useSectionStatus();

  // 学習内容の統計情報（完了セクション数、総セクション数）を更新
  const _updateLearningContentStats = (contentId, sections) => {
    // 指定されたコンテンツIDに紐づくセクションのみをフィルタリング
    const contentSections = sections.filter((s) => s.learning_content_id === contentId);
    // 完了セクション数を再計算
    const completedSections = countCompletedSections(contentSections);
    // ストアの統計情報を更新し、UIに反映
    contentStore.updateContentStats({
      contentId,
      completed_sections: completedSections,
      total_sections: contentSections.length,
    });
  };

  return {
    learningContentsRaw,
    learningContents,
    // 新しい学習内容を作成
    createContent: (data) => contentStore.createContent(data),
    // 既存の学習内容を更新
    updateLearningContent: (id, data) => contentStore.updateContent(id, data),
    // 学習内容を削除
    deleteLearningContent: (id) => contentStore.deleteContent(id),
    // 学習内容を完了状態に設定
    completeContent: (id) => contentStore.completeContent(id),
    // 学習内容を再開状態に設定
    reopenContent: (id) => contentStore.reopenContent(id),
    // 学習内容の統計情報を更新するための内部ヘルパー
    _updateLearningContentStats,
    // ロード状態をリアクティブに取得
    loading: computed(() => contentStore.loading),
    // エラー状態をリアクティブに取得
    error: computed(() => contentStore.error),
    // ページネーション情報をリアクティブに取得
    pagination: computed(() => contentStore.pagination),
    // 学習内容をフェッチ
    fetchContents: (page) => contentStore.fetchContents(page),
    // フィルタを設定
    setFilter: (filters) => contentStore.setFilter(filters),
    // ソートを設定
    setSort: (sort) => contentStore.setSort(sort),
  };
}
