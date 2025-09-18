import { computed } from 'vue';
import { useUser } from './useUser';
import { useMenuState } from './ui/useMenuState';
import { useLearningContents } from './learning/useLearningContents';
import { useSections } from './learning/useSections';
import { useLearningSessions } from './learning/useLearningSessions';
import { useMasterDataStore } from '../stores/masterData';

// 学習関連の全データを集約し、操作ロジックを提供するコンポーザブル
export const useLearningData = () => {
  // ユーザー情報管理コンポーザブルからユーザーデータを取得
  const { user } = useUser();
  // メニュー状態管理コンポーザブルからアクティブメニューIDと設定関数を取得
  const { activeMenuId, setActiveMenu } = useMenuState();
  // マスターデータストアから技術データを取得
  const masterDataStore = useMasterDataStore();

  // マスターデータストアの技術データをリアクティブに取得
  const technologies = computed(() => masterDataStore.technologies);

  // 学習コンテンツ関連のデータとアクションを学習コンテンツコンポーザブルから取得
  const { learningContents, learningContentsRaw, createContent, updateLearningContent, deleteContent, completeContent, reopenContent, _updateLearningContentStats, loading, error, pagination, fetchContents } = useLearningContents();

  // セクション関連のデータとアクションをセクションコンポーザブルから取得
  const { sections, addSections, updateSectionStatus, deleteSectionsByContentId, updateSections, normalizeStatus, toggleSectionComplete } = useSections();

  // 学習セッション関連のデータとアクションを学習セッションコンポーザブルから取得
  // 統計情報とセクションステータスの更新をコールバックとして渡し、関心の分離を維持
  const {
    learningSessions,
    addStudySession: _addStudySession,
    updateStudySession: _updateStudySession,
    deleteStudySession: _deleteStudySession,
    deleteSessionsByContentId,
    getRecordCountForSection,
  } = useLearningSessions(
    (contentId) => _updateLearningContentStats(contentId, sections.value),
    (sectionId) => updateSectionStatus(sectionId)
  );

  // 学習コンテンツの基本情報とセクション情報をまとめて更新するためのラッパー関数
  const updateLearningContentWrapper = (contentId, updatedData) => {
    const basicInfo = {
      title: updatedData.title,
      description: updatedData.description,
      technology_id: updatedData.technology_id,
      status: updatedData.status, // <-- この行を追加
    };
    updateLearningContent(contentId, basicInfo);
    updateSections(contentId, updatedData.sections);
    _updateLearningContentStats(contentId, sections.value);
  };

  // 学習コンテンツ、関連セクション、関連学習セッションをまとめて削除するためのラッパー関数
  const deleteLearningContentWrapper = (contentId) => {
    deleteContent(contentId);
    deleteSectionsByContentId(contentId);
    deleteSessionsByContentId(contentId);
  };

  return {
    user,
    learningContents,
    learningContentsRaw,
    sections,
    learningSessions,
    technologies,
    loading,
    error,
    pagination,
    activeMenuId,

    // Actions
    fetchContents,
    createContent,
    updateLearningContent: updateLearningContentWrapper,
    deleteLearningContent: deleteLearningContentWrapper,
    completeContent,
    reopenContent,
    addStudySession: (sessionData) => _addStudySession(sessionData, user),
    updateStudySession: (updatedSessionData) => _updateStudySession(updatedSessionData),
    deleteStudySession: (sessionId) => _deleteStudySession(sessionId),
    updateSectionStatus,
    setActiveMenu,
    getRecordCountForSection,
    normalizeStatus,
    toggleSectionComplete,
  };
};
