import { computed } from 'vue';
import { useUser } from '@/composables/useUser';
import { useMenuState } from '@/composables/ui/useMenuState';
import { useLearningContentStore } from '@/stores/learningContent';
import { useSectionStore } from '@/stores/sections';
import { useLearningContents as useLearningContentsComposable } from '@/composables/learning/useLearningContents';
import { useMasterDataStore } from '@/stores/masterData';
import { useLearningSessionStore } from '@/stores/learningSession';

// 学習関連の全データを集約し、操作ロジックを提供するコンポーザブル
export const useLearningData = () => {
  // ユーザー情報管理コンポーザブルからユーザーデータを取得
  const { user } = useUser();
  // メニュー状態管理コンポーザブルからアクティブメニューIDと設定関数を取得
  const { activeMenuId, setActiveMenu } = useMenuState();
  const contentStore = useLearningContentStore();
  const sectionStore = useSectionStore();
  const sessionStore = useLearningSessionStore();
  // マスターデータストアから技術データを取得
  const masterDataStore = useMasterDataStore();

  // マスターデータストアの技術データをリアクティブに取得
  const technologies = computed(() => masterDataStore.technologies);

  // useLearningContentsコンポーザブルから必要なものを取得
  const {
    learningContents: learningContentsFromComposable, // 名前を変更
    learningContentsRaw,
    createContent,
    updateLearningContent,
    deleteContent,
    completeContent,
    reopenContent,
    loading,
    error,
    pagination,
    fetchContents,
  } = useLearningContentsComposable();

  // 各学習コンテンツの総学習時間と最終学習日を計算
  const learningContents = computed(() => {
    return learningContentsFromComposable.value.map((content) => {
      const contentSessions = sessionStore.sessions.filter((session) => session.learning_content_id === content.id);
      const totalStudyMinutes = contentSessions.reduce((sum, session) => sum + session.study_minutes, 0);
      const latestSession = contentSessions.reduce((latest, current) => {
        return !latest || new Date(current.studied_at) > new Date(latest.studied_at) ? current : latest;
      }, null);

      return {
        ...content,
        totalStudyMinutes,
        latestSessionUpdatedAt: latestSession ? latestSession.studied_at : null,
      };
    });
  });

  // 学習コンテンツ削除のシンプルなラッパー
  const deleteLearningContentWrapper = async (contentId) => {
    await contentStore.deleteContent(contentId);
  };

  return {
    user,
    learningContents,
    learningContentsRaw,
    sections: computed(() => sectionStore.sections),
    learningSessions: computed(() => sessionStore.sessions),
    technologies,
    loading,
    error,
    pagination,
    activeMenuId,

    // Actions
    fetchContents,
    fetchLearningSessions: sessionStore.fetchLearningSessions,
    createContent,
    updateLearningContent,
    deleteLearningContent: deleteLearningContentWrapper,
    completeContent,
    reopenContent,
    addStudySession: (sessionData) => sessionStore.createLearningSession(sessionData),
    updateStudySession: (id, data) => sessionStore.updateLearningSession(id, data),
    deleteStudySession: (id) => sessionStore.deleteLearningSession(id),
    setActiveMenu,
    getRecordCountForSection: (sectionId) => {
      const sessions = sessionStore.sessions || [];
      // section_idで直接フィルタ
      return sessions.filter((s) => s.section_id === sectionId).length;
    },
  };
};
