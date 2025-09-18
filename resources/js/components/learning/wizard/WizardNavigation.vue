<template>
  <!-- ウィザードのナビゲーションボタンコンテナ -->
  <div class="flex justify-between pt-6 border-t">
    <!-- キャンセルボタン: showCancelがtrueの場合に表示 -->
    <CancelButton v-if="showCancel" @click="$emit('cancel')" />
    <div class="flex space-x-4">
      <!-- 戻るボタン: showBackがtrueの場合に表示 -->
      <BackButton v-if="showBack" @click="$emit('back')" />
      <!-- 次へボタン: showNextがtrueの場合に表示 -->
      <BaseButton v-if="showNext" variant="primary" :right-icon="ArrowRightIcon" @click="$emit('next')">次へ</BaseButton>
      <!-- 作成する/送信ボタン: showSubmitがtrueの場合に表示 -->
      <BaseButton v-if="showSubmit" type="button" variant="primary" @click="$emit('submit')">
        {{ submitText }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ArrowRightIcon } from '@heroicons/vue/24/solid';
import BaseButton from '../../common/BaseButton.vue';
import CancelButton from '../../common/buttons/CancelButton.vue';
import BackButton from '../../common/buttons/BackButton.vue';

// 親コンポーネントから受け取るプロパティを定義
defineProps({
  currentStep: Number, // 現在のステップ番号
  totalSteps: Number, // 全ステップ数
  showCancel: { type: Boolean, default: true }, // キャンセルボタンの表示/非表示
  showBack: { type: Boolean, default: false }, // 戻るボタンの表示/非表示
  showNext: { type: Boolean, default: false }, // 次へボタンの表示/非表示
  showSubmit: { type: Boolean, default: false }, // 送信ボタンの表示/非表示
  submitText: { type: String, default: '作成する' }, // 送信ボタンのテキスト
});

// 親コンポーネントに発行するイベントを定義
defineEmits(['cancel', 'back', 'next', 'submit']);
</script>
