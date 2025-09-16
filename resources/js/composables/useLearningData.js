import { computed } from 'vue';
import { useUser } from './useUser';
import { useMenuState } from './ui/useMenuState';
import { useLearningContents } from './learning/useLearningContents';
import { useSections } from './learning/useSections';
import { useLearningSessions } from './learning/useLearningSessions';
import { useMasterDataStore } from '../stores/masterData';

export const useLearningData = () => {
  const { user } = useUser();
  const { activeMenuId, setActiveMenu } = useMenuState();
  const masterDataStore = useMasterDataStore();

  const technologies = computed(() => masterDataStore.technologies);
  const categories = computed(() => masterDataStore.categories);

  // 各コンポーザブルをインスタンス化
  const { learningContentsRaw, learningContents, addLearningContent: _addLearningContent, updateLearningContent: _updateLearningContent, deleteLearningContent: _deleteLearningContent, completeContent, reopenContent, _updateLearningContentStats } = useLearningContents();

  const { sections, addSections, updateSectionStatus, deleteSectionsByContentId, updateSections, normalizeStatus, toggleSectionComplete } = useSections();

  // 依存関係を注入
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

  // 既存のAPIを維持するためのラッパー関数
  const addLearningContent = (formData) => {
    console.log('【useLearningData.addLearningContent】受信フォームデータ:', formData);

    const newContentId = _addLearningContent(formData, user);
    const newSections = formData.sections.map((s, index) => {
      const section = { ...s, learning_content_id: newContentId };
      console.log(`【useLearningData】マッピング後セクション ${index + 1}:`, section);
      return section;
    });

    addSections(newSections);
    return newContentId;
  };

  // 学習コンテンツと関連セクションをまとめて更新し、統計を再計算する
  const updateLearningContent = (contentId, updatedData) => {
    _updateLearningContent(contentId, updatedData);
    updateSections(contentId, updatedData.sections);
    _updateLearningContentStats(contentId, sections.value);
  };

  // 学習コンテンツに関連するセクションと学習記録もまとめて削除する
  const deleteLearningContent = (contentId) => {
    _deleteLearningContent(contentId);
    deleteSectionsByContentId(contentId);
    deleteSessionsByContentId(contentId);
  };

  return {
    user,
    learningContents,
    learningContentsRaw,
    completeContent,
    reopenContent,
    sections,
    learningSessions,
    addStudySession: (sessionData) => _addStudySession(sessionData, user),
    deleteStudySession: (sessionId) => _deleteStudySession(sessionId),
    deleteLearningContent,
    addLearningContent,
    updateLearningContent,
    updateStudySession: (updatedSessionData) => _updateStudySession(updatedSessionData),
    updateSectionStatus,
    activeMenuId,
    setActiveMenu,
    getRecordCountForSection,
    technologies,
    _updateLearningContentStats,
    normalizeStatus,
    toggleSectionComplete,
  };
};
