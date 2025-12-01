import { computed } from 'vue';
import { useLearningSessionStore } from '@/stores/learningSession';
import { useLearningContentStore } from '@/stores/learningContent';
import { useSectionStore } from '@/stores/section';

/**
 * 学習セッション管理のComposable
 * Store層をラップし、ビジネスロジックを提供
 */
export const useLearningSessions = () => {
  const sessionStore = useLearningSessionStore();
  const contentStore = useLearningContentStore();
  const sectionStore = useSectionStore();

  // 状態
  const learningSessions = computed(() => sessionStore.sessions);
  const loading = computed(() => sessionStore.loading);
  const error = computed(() => sessionStore.error);
  const errors = computed(() => sessionStore.errors);

  /**
   * 新しい学習記録を追加し、関連する統計情報を更新する
   */
  const addStudySession = async (sessionData) => {
    try {
      // 学習記録を作成
      await sessionStore.createLearningSession(sessionData);

      // 関連する統計情報を更新
      await contentStore.fetchLearningContent(sessionData.learning_content_id);
      await sectionStore.fetchSection(sessionData.section_id);

      return true;
    } catch (error) {
      console.error('学習記録の追加に失敗:', error);
      return false;
    }
  };

  /**
   * 既存の学習記録を更新し、関連する統計情報を再計算する
   */
  const updateStudySession = async (id, sessionData) => {
    try {
      // 学習記録を更新
      await sessionStore.updateLearningSession(id, sessionData);

      // 関連する統計情報を更新
      if (sessionData.learning_content_id) {
        await contentStore.fetchLearningContent(sessionData.learning_content_id);
      }
      if (sessionData.section_id) {
        await sectionStore.fetchSection(sessionData.section_id);
      }

      return true;
    } catch (error) {
      console.error('学習記録の更新に失敗:', error);
      return false;
    }
  };

  /**
   * 指定されたIDの学習記録を削除し、関連する統計情報を更新する
   */
  const deleteStudySession = async (sessionId) => {
    try {
      // 削除前にセッション情報を取得
      const session = sessionStore.sessionById(sessionId);
      if (!session) return false;

      // 学習記録を削除
      await sessionStore.deleteLearningSession(sessionId);

      // 関連する統計情報を更新
      await contentStore.fetchLearningContent(session.learning_content_id);
      await sectionStore.fetchSection(session.section_id);

      return true;
    } catch (error) {
      console.error('学習記録の削除に失敗:', error);
      return false;
    }
  };

  /**
   * 特定の学習内容に紐づく全ての学習記録を取得
   */
  const fetchSessionsByContentId = async (contentId) => {
    try {
      await sessionStore.fetchLearningSessionsByContent(contentId);
      return true;
    } catch (error) {
      console.error('学習記録の取得に失敗:', error);
      return false;
    }
  };

  /**
   * 特定のセクションに紐づく全ての学習記録を取得
   */
  const fetchSessionsBySectionId = async (sectionId) => {
    try {
      await sessionStore.fetchLearningSessionsBySection(sectionId);
      return true;
    } catch (error) {
      console.error('学習記録の取得に失敗:', error);
      return false;
    }
  };

  /**
   * 特定のセクションに紐づく学習記録の件数を取得する
   */
  const getRecordCountForSection = (sectionId) => {
    return sessionStore.sessionsBySectionId(sectionId).length;
  };

  return {
    // 状態
    learningSessions,
    loading,
    error,
    errors,

    // アクション
    addStudySession,
    updateStudySession,
    deleteStudySession,
    fetchSessionsByContentId,
    fetchSessionsBySectionId,
    getRecordCountForSection,

    // Getters
    sessionById: (id) => sessionStore.sessionById(id),
    sessionsByContentId: (contentId) => sessionStore.sessionsByContentId(contentId),
    sessionsBySectionId: (sectionId) => sessionStore.sessionsBySectionId(sectionId),
    totalStudyMinutes: computed(() => sessionStore.totalStudyMinutes),
  };
};
