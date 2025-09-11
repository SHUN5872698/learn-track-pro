import { mockSections } from '../data/mockSections';

export const sections = mockSections;

export const useSections = () => {
  // 新しい学習コンテンツに紐づくセクションを一括で追加する
  const addSections = (newSections) => {
    console.log('【addSections】受信したセクション:', newSections);

    const lastSectionId = sections.value.length > 0 ? Math.max(...sections.value.map((s) => s.id)) : 0;
    newSections.forEach((section, index) => {
      const newSection = {
        ...section,
        id: lastSectionId + index + 1,
        status: section.status || 'not_started',
        completed_at: section.completed_at || null,
      };
      console.log(`【addSections】追加するセクション ${index + 1}:`, {
        title: newSection.title,
        status: newSection.status,
        order: newSection.order,
      });
      sections.value.push(newSection);
    });
  };

  // 特定のセクションのステータスを更新する
  const updateSectionStatus = (sectionId, newStatus = null) => {
    const sectionIndex = sections.value.findIndex((s) => s.id === sectionId);
    if (sectionIndex !== -1) {
      if (newStatus) {
        // 明示的なステータスが指定された場合
        sections.value[sectionIndex].status = newStatus;
        if (newStatus === 'completed') {
          sections.value[sectionIndex].completed_at = new Date().toISOString();
        } else {
          sections.value[sectionIndex].completed_at = null;
        }
      } else {
        // ステータスが指定されていない場合（学習記録からの自動更新）
        if (sections.value[sectionIndex].status === 'not_started') {
          sections.value[sectionIndex].status = 'in_progress';
        }
      }
    }
  };

  // 特定の学習コンテンツに紐づく全てのセクションを削除する
  const deleteSectionsByContentId = (contentId) => {
    sections.value = sections.value.filter((s) => s.learning_content_id !== contentId);
  };

  // 特定の学習コンテンツのセクションリストを、既存の状態を維持しつつ更新する
  const updateSections = (contentId, updatedSections) => {
    const otherSections = sections.value.filter((s) => s.learning_content_id !== contentId);
    const originalContentSections = sections.value.filter((s) => s.learning_content_id === contentId);

    const newContentSections = updatedSections.map((sectionData, index) => {
      const originalSection = originalContentSections.find((os) => os.id === sectionData.id);
      return {
        id: sectionData.id,
        learning_content_id: contentId,
        title: sectionData.title,
        order: index + 1,
        status: originalSection ? originalSection.status : 'not_started',
        completed_at: originalSection ? originalSection.completed_at : null,
      };
    });

    sections.value = [...otherSections, ...newContentSections];
  };

  // ステータスを正規化する関数
  const normalizeStatus = (status) => {
    if (!status) return 'not_started';
    const validStatuses = ['not_started', 'in_progress', 'completed'];
    return validStatuses.includes(status) ? status : 'not_started';
  };

  // チェックボックスクリックでステータスを切り替える関数
  const toggleSectionComplete = (section) => {
    const currentStatus = normalizeStatus(section.status);
    return currentStatus === 'completed' ? 'in_progress' : 'completed';
  };

  return {
    sections,
    addSections,
    updateSectionStatus,
    deleteSectionsByContentId,
    updateSections,
    normalizeStatus,
    toggleSectionComplete,
  };
};
