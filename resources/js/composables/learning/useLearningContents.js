import { computed } from 'vue';
import { mockLearningContentsRaw } from '../data/mockLearningContents';
import { mockTechnologies } from '../data/mockTechnologies';
import { mockSessions } from '../data/mockSessions';
import { useSectionStatus } from '../useSectionStatus';

// このモジュールはリアクティブな参照を直接エクスポートします
export const learningContentsRaw = mockLearningContentsRaw;
const technologies = mockTechnologies;
const learningSessions = mockSessions; // learningContentsの算出プロパティで使用

export const useLearningContents = () => {
  // 生の学習コンテンツデータに技術名や進捗率などの付加情報を加えて提供する
  const learningContents = computed(() => {
    return learningContentsRaw.value
      .map((content) => {
        const technology = technologies.value.find((t) => t.id === content.technology_id);
        const progress = content.total_sections > 0 ? Math.round((content.completed_sections / content.total_sections) * 100) : 0;
        const totalStudyMinutes = learningSessions.value.filter((session) => session.learning_content_id === content.id).reduce((sum, session) => sum + session.study_minutes, 0);

        const filteredSessions = learningSessions.value.filter((session) => session.learning_content_id === content.id);
        const sortedSessions = filteredSessions.sort((a, b) => new Date(b.studied_at).getTime() - new Date(a.studied_at).getTime());
        const actualLatestSession = sortedSessions[0];

        const latestSessionUpdatedAt = actualLatestSession ? actualLatestSession.studied_at : null;

        const mappedContent = {
          ...content,
          technology: technology ? technology.name : '不明',
          progress,
          totalStudyMinutes,
          completedSections: content.completed_sections,
          totalSections: content.total_sections,
          latestSessionUpdatedAt,
        };
        return mappedContent;
      })
      .sort((a, b) => {
        // ステータスの希望する順序を定義
        const statusOrder = {
          in_progress: 1,
          not_started: 2,
          completed: 3,
        };

        // 1. ステータスでソート (in_progress, not_started, completed)
        const statusComparison = statusOrder[a.status] - statusOrder[b.status];
        if (statusComparison !== 0) {
          return statusComparison;
        }

        // 2. ステータスが同じ場合、latestSessionUpdatedAtでソート (降順)
        const dateA = new Date(a.latestSessionUpdatedAt).getTime();
        const dateB = new Date(b.latestSessionUpdatedAt).getTime();

        if (dateA !== dateB) {
          return dateB - dateA;
        }

        // 3. latestSessionUpdatedAtも同じ場合、content.updated_atでソート (降順)
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  });

  // 新しい学習コンテンツをデータに追加する
  const addLearningContent = (formData, user) => {
    const newContentId = learningContentsRaw.value.length > 0 ? Math.max(...learningContentsRaw.value.map((c) => c.id)) + 1 : 1;
    const newContent = {
      id: newContentId,
      user_id: user.id,
      technology_id: formData.technology_id,
      title: formData.title,
      description: formData.description,
      total_sections: formData.sections.length,
      completed_sections: 0,
      status: formData.startImmediately ? 'in_progress' : 'not_started',
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    learningContentsRaw.value.push(newContent);
    return newContentId;
  };

  // 既存の学習コンテンツの情報を更新する
  const updateLearningContent = (contentId, updatedData) => {
    const contentIndex = learningContentsRaw.value.findIndex((c) => c.id === contentId);
    if (contentIndex !== -1) {
      const contentToUpdate = learningContentsRaw.value[contentIndex];
      Object.assign(contentToUpdate, updatedData, {
        updated_at: new Date().toISOString(),
      });
    }
  };

  // 指定されたIDの学習コンテンツを削除する
  const deleteLearningContent = (contentId) => {
    learningContentsRaw.value = learningContentsRaw.value.filter((c) => c.id !== contentId);
  };

  // 学習コンテンツを完了状態に更新する
  const completeContent = (id) => {
    const index = learningContentsRaw.value.findIndex((content) => content.id === id);
    if (index !== -1) {
      learningContentsRaw.value[index].status = 'completed';
      learningContentsRaw.value[index].completed_at = new Date().toISOString();
    }
  };

  // 完了した学習コンテンツを再び学習中に戻す
  const reopenContent = (id) => {
    const index = learningContentsRaw.value.findIndex((content) => content.id === id);
    if (index !== -1) {
      learningContentsRaw.value[index].status = 'in_progress';
      learningContentsRaw.value[index].completed_at = null;
    }
  };

  const { countCompletedSections } = useSectionStatus();

  // 関連するセクションの状態に基づいて、学習コンテンツの統計情報（完了セクション数など）を更新する
  const _updateLearningContentStats = (contentId, sections) => {
    const contentIndex = learningContentsRaw.value.findIndex((c) => c.id === contentId);
    if (contentIndex === -1) return;

    const contentSections = sections.filter((s) => s.learning_content_id === contentId);
    const completedSections = countCompletedSections(contentSections);
    learningContentsRaw.value[contentIndex].completed_sections = completedSections;
    learningContentsRaw.value[contentIndex].total_sections = contentSections.length;
  };

  return {
    learningContentsRaw,
    learningContents,
    addLearningContent,
    updateLearningContent,
    deleteLearningContent,
    completeContent,
    reopenContent,
    _updateLearningContentStats,
  };
};
