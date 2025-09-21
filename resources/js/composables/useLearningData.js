import { computed } from 'vue';
import { useUser } from './useUser';
import { useMenuState } from './ui/useMenuState';
import { useLearningContentStore } from '@/stores/learningContent';
import { useSectionStore } from '@/stores/sections';
import { useLearningContents } from './learning/useLearningContents';
import { useMasterDataStore } from '../stores/masterData';
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

  // 学習コンテンツ関連のデータとアクションを学習コンテンツコンポーザブルから取得
  const { learningContents, learningContentsRaw, createContent, updateLearningContent, deleteContent, completeContent, reopenContent, loading, error, pagination, fetchContents } = useLearningContents();

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
