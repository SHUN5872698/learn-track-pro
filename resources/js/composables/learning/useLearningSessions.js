import { mockSessions } from '@/composables/data/mockSessions';

export const learningSessions = mockSessions;

export const useLearningSessions = (updateLearningContentStats, updateSectionStatus) => {
  // 新しい学習記録を追加し、関連する統計情報を更新する
  const addStudySession = (sessionData, user) => {
    const newSession = {
      id: learningSessions.value.length + 1,
      user_id: user.id,
      ...sessionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    learningSessions.value.push(newSession);
    // 依存関係をコールバックで解決し、関心の分離を維持する
    updateLearningContentStats(sessionData.learning_content_id);
    updateSectionStatus(sessionData.section_id);
  };

  // 既存の学習記録を更新し、関連する統計情報を再計算する
  const updateStudySession = (updatedSessionData) => {
    const index = learningSessions.value.findIndex((s) => s.id === updatedSessionData.id);
    if (index !== -1) {
      learningSessions.value[index] = { ...learningSessions.value[index], ...updatedSessionData };
      // 依存関係をコールバックで解決し、関心の分離を維持する
      updateLearningContentStats(updatedSessionData.learning_content_id);
      updateSectionStatus(updatedSessionData.section_id);
    }
  };

  // 指定されたIDの学習記録を削除し、関連する統計情報を更新する
  const deleteStudySession = (sessionId) => {
    const sessionIndex = learningSessions.value.findIndex((s) => s.id === sessionId);
    if (sessionIndex === -1) return;

    const sessionToDelete = learningSessions.value[sessionIndex];
    learningSessions.value.splice(sessionIndex, 1);

    // 依存関係をコールバックで解決し、関心の分離を維持する
    updateLearningContentStats(sessionToDelete.learning_content_id);
    updateSectionStatus(sessionToDelete.section_id);
  };

  // 特定の学習コンテンツに紐づく全ての学習記録を削除する
  const deleteSessionsByContentId = (contentId) => {
    learningSessions.value = learningSessions.value.filter((s) => s.learning_content_id !== contentId);
  };

  // 特定のセクションに紐づく学習記録の件数を取得する
  const getRecordCountForSection = (sectionId) => {
    return learningSessions.value.filter((s) => s.section_id === sectionId).length;
  };

  return {
    learningSessions,
    addStudySession,
    updateStudySession,
    deleteStudySession,
    deleteSessionsByContentId,
    getRecordCountForSection,
  };
};
