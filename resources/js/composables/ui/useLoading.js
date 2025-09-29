import { ref, computed } from 'vue';

/**
 * ローディング状態を管理するComposable
 * 複数の非同期処理を名前付きで管理できる
 */
export function useLoading() {
  // 実行中のタスクを管理するSet
  const loadingTasks = ref(new Set());

  // 1つでもタスクが実行中ならtrue
  const isLoading = computed(() => loadingTasks.value.size > 0);

  /**
   * ローディングを開始
   * @param {string} taskName - タスクの識別名（デフォルト: 'default'）
   */
  const startLoading = (taskName = 'default') => {
    loadingTasks.value.add(taskName);
  };

  /**
   * ローディングを終了
   * @param {string} taskName - タスクの識別名（デフォルト: 'default'）
   */
  const stopLoading = (taskName = 'default') => {
    loadingTasks.value.delete(taskName);
  };

  /**
   * 非同期処理をローディング管理付きで実行
   * @param {string} taskName - タスクの識別名
   * @param {Function} asyncFn - 実行する非同期関数
   * @returns {Promise} 非同期関数の結果
   */
  const withLoading = async (taskName, asyncFn) => {
    startLoading(taskName);
    try {
      return await asyncFn();
    } finally {
      stopLoading(taskName);
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}
