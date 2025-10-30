import { ref } from 'vue';

// ウィザードフォームのステップ管理とバリデーションロジックを提供するコンポーザブル
export function useWizardForm(totalSteps = 3) {
  // 現在のウィザードステップを管理するリアクティブな参照
  const currentStep = ref(1);
  // バリデーションエラーメッセージを格納するリアクティブな配列
  const validationErrors = ref([]);

  // 次のステップへ進む関数
  const nextStep = () => {
    // 現在のステップが総ステップ数未満の場合のみ、ステップを進める
    if (currentStep.value < totalSteps) {
      currentStep.value++;
    }
  };

  // 前のステップへ戻る関数
  const prevStep = () => {
    // 現在のステップが1より大きい場合のみ、ステップを戻す
    if (currentStep.value > 1) {
      currentStep.value--;
      validationErrors.value = []; // ステップを戻る際に、現在のバリデーションエラーをクリアする
    }
  };

  // 指定されたバリデーション関数を実行し、エラーを更新・チェックする関数
  const validateStep = (validationFunction) => {
    const errors = validationFunction(); // バリデーション関数を実行し、エラーを取得
    validationErrors.value = errors; // 取得したエラーをリアクティブなvalidationErrorsに設定
    return errors.length === 0; // エラーがなければtrue（バリデーション成功）、あればfalse（バリデーション失敗）を返す
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    validationErrors,
    validateStep,
  };
}
