<template>
  <Teleport to="body">
    <!-- トランジションでオーバーレイとパネルのアニメーションを制御 -->
    <!-- v-if="show" で全体の表示/非表示を切り替え -->
    <Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/30"></div>

        <!-- 通知パネル本体 -->
        <Transition appear enter-active-class="transition-all duration-300 ease-out" enter-from-class="scale-90 opacity-0" enter-to-class="scale-100 opacity-100" leave-active-class="transition-all duration-200 ease-in" leave-from-class="scale-100 opacity-100" leave-to-class="scale-95 opacity-0">
          <div class="relative z-10 flex flex-col items-center w-full max-w-sm px-6 py-8 overflow-hidden text-center bg-white shadow-xl rounded-2xl">
            <!-- 成功アイコン -->
            <div class="flex items-center justify-center flex-shrink-0 w-16 h-16 rounded-full bg-emerald-100">
              <CheckCircleIcon class="w-10 h-10 text-emerald-500" aria-hidden="true" />
            </div>

            <!-- メッセージ -->
            <div class="mt-4">
              <h3 class="text-lg font-semibold leading-6 text-gray-900">{{ title }}</h3>
              <p v-if="message" class="mt-2 text-sm text-gray-600">{{ message }}</p>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { watch } from 'vue';
import { CheckCircleIcon } from '@heroicons/vue/24/outline';

// ========================================
// 初期設定
// ========================================
// コンポーネントのプロパティを定義
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 2000,
  },
});

// コンポーネントが発行するイベントを定義
const emit = defineEmits(['close']);

// タイムアウトIDを保持する変数
let timeoutId = null;

// ========================================
// ウォッチャー
// ========================================
// props.show の変更を監視し、表示されたら自動で閉じるタイマーを設定
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      // 既存のタイムアウトがあればクリア
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // 新しいタイムアウトを設定
      timeoutId = setTimeout(() => {
        emit('close');
      }, props.duration);
    }
  }
);
</script>
