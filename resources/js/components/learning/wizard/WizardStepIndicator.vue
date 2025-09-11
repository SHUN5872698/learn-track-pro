<template>
  <!-- ウィザードのステップインジケーターコンポーネント -->
  <div class="flex justify-center mb-8">
    <div class="flex items-center w-full max-w-lg">
      <!-- 各ステップをループで表示 -->
      <div v-for="(stepName, index) in stepNames" :key="index" class="flex items-center" :class="{ 'flex-1': index < stepNames.length - 1 }">
        <div class="flex flex-col items-center text-center min-w-0 min-w-[80px]">
          <!-- ステップ番号の表示: 現在のステップに応じて背景色と文字色が変わる -->
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300', currentStep >= index + 1 ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-500']">
            {{ index + 1 }}
          </div>
          <!-- ステップ名の表示: 現在のステップに応じて文字色が変わる -->
          <span :class="['mt-2 text-xs font-medium text-center transition-colors duration-300 whitespace-nowrap', currentStep >= index + 1 ? 'text-violet-700' : 'text-gray-500']">{{ stepName }}</span>
        </div>
        <!-- ステップ間のプログレスバー: 最後のステップ以外に表示 -->
        <div v-if="index < stepNames.length - 1" class="flex-1 h-1 mx-2 bg-gray-200">
          <!-- プログレスバーの進捗: 現在のステップに応じて幅が変わる -->
          <div class="h-full transition-all duration-500 bg-violet-600" :style="{ width: currentStep > index + 1 ? '100%' : currentStep === index + 1 ? '0%' : '0%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 親コンポーネントから受け取るプロパティを定義
defineProps({
  currentStep: { // 現在アクティブなステップの番号
    type: Number,
    required: true,
  },
  stepNames: { // 各ステップの名称を格納した配列
    type: Array,
    required: true,
  },
});
</script>
