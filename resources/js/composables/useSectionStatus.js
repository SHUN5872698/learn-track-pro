export const useSectionStatus = () => {
  // DB値を表示用の2状態にマッピング
  const normalizeStatus = (dbStatus) => {
    // 'not_started' は 'in_progress' として扱う
    return dbStatus === 'completed' ? 'completed' : 'in_progress';
  };

  // セクション完了状態のトグル
  const toggleSectionComplete = (section) => {
    const currentDisplay = normalizeStatus(section.status);
    // 完了 ↔ 進行中の切り替え
    return currentDisplay === 'completed' ? 'in_progress' : 'completed';
  };

  // 学習内容の完了可能状態を判定
  const isContentCompletable = (sections) => {
    return sections.length > 0 && sections.every((s) => normalizeStatus(s.status) === 'completed');
  };

  // 完了セクション数の計算
  const countCompletedSections = (sections) => {
    return sections.filter((s) => normalizeStatus(s.status) === 'completed').length;
  };

  return {
    normalizeStatus,
    toggleSectionComplete,
    isContentCompletable,
    countCompletedSections,
  };
};
