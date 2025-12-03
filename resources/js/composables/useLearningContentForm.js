import { reactive, computed, ref } from 'vue';

// 学習内容のフォームデータと変更検知を管理するComposable
export function useLearningContentForm(initialData = null) {
  // フォームのデフォルト状態を定義
  const defaultState = {
    technology_id: null, // 学習する技術のID
    title: '', // 学習内容のタイトル
    description: '', // 学習内容の説明
    sections: [{ id: Date.now(), title: '', order: 1 }], // セクション（最低1つ必須、仮IDはDate.now()で生成）
    status: 'not_started', // 学習ステータスのデフォルト値
    startImmediately: true, // 作成後すぐに学習を開始するかどうか
  };

  // reactiveでフォームデータを管理（v-modelとの双方向バインディングのため）
  const form = reactive({ ...defaultState, ...initialData });

  // 未保存変更検知用の初期状態（JSON文字列でディープコピー保存）
  const initialForm = ref(JSON.stringify(form));

  // フォームに未保存の変更があるかをチェック（ページ離脱時の警告に使用）
  const hasUnsavedChanges = computed(() => {
    // JSON文字列化してディープ比較（ネストしたオブジェクトも正確に比較するため）
    return JSON.stringify(form) !== initialForm.value;
  });

  // フォームを指定データで初期化（編集時に既存データを読み込むため）
  const initializeForm = (data) => {
    Object.assign(form, { ...defaultState, ...data });
    initialForm.value = JSON.stringify(form); // 初期状態を更新（変更検知の基準点をリセット）
  };

  // フォームを初期状態に戻す（編集キャンセル時に使用）
  const resetForm = () => {
    Object.assign(form, JSON.parse(initialForm.value)); // JSON.parseでディープコピー復元
  };

  return {
    form,
    hasUnsavedChanges,
    resetForm,
    initializeForm,
  };
}
