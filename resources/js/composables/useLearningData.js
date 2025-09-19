import { computed } from 'vue';
import { useUser } from './useUser';
import { useMenuState } from './ui/useMenuState';
import { useLearningContentStore } from '@/stores/learningContent';
import { useSectionStore } from '@/stores/sections';
import { useLearningContents } from './learning/useLearningContents';
import { useLearningSessions } from './learning/useLearningSessions';
import { useMasterDataStore } from '../stores/masterData';

// 学習関連の全データを集約し、操作ロジックを提供するコンポーザブル
export const useLearningData = () => {
  // ユーザー情報管理コンポーザブルからユーザーデータを取得
  const { user } = useUser();
  // メニュー状態管理コンポーザブルからアクティブメニューIDと設定関数を取得
  const { activeMenuId, setActiveMenu } = useMenuState();
  const contentStore = useLearningContentStore();
  const sectionStore = useSectionStore();
  // マスターデータストアから技術データを取得
  const masterDataStore = useMasterDataStore();

  // マスターデータストアの技術データをリアクティブに取得
  const technologies = computed(() => masterDataStore.technologies);

  // 学習コンテンツ関連のデータとアクションを学習コンテンツコンポーザブルから取得
  const { learningContents, learningContentsRaw, createContent, updateLearningContent, deleteContent, completeContent, reopenContent, loading, error, pagination, fetchContents } = useLearningContents();

  // 学習セッション関連のデータとアクションを学習セッションコンポーザブルから取得
  const {
    learningSessions,
    addStudySession: _addStudySession,
    updateStudySession: _updateStudySession,
    deleteStudySession: _deleteStudySession,
    getRecordCountForSection,
  } = useLearningSessions(
    (contentId) => contentStore.fetchContents(),
    (sectionId, newStatus) => sectionStore.updateSectionStatus(sectionId, newStatus)
  );

  // 学習コンテンツ削除のシンプルなラッパー
  const deleteLearningContentWrapper = async (contentId) => {
    await contentStore.deleteContent(contentId);
  };

  return {
    user,
    learningContents,
    learningContentsRaw,
    sections: computed(() => sectionStore.sections),
    learningSessions,
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
    addStudySession: (sessionData) => _addStudySession(sessionData, user),
    updateStudySession: (updatedSessionData) => _updateStudySession(updatedSessionData),
    deleteStudySession: (sessionId) => _deleteStudySession(sessionId),
    setActiveMenu,
    getRecordCountForSection,
  };
};
