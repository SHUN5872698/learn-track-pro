<template>
  <div class="flex flex-col items-center justify-center">
    <!-- スピナー本体 -->
    <svg :class="spinnerClasses" xmlns="<http://www.w3.org/2000/svg>" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>

    <!-- オプションメッセージ -->
    <p v-if="message" class="mt-3 text-sm text-gray-600">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  message: {
    type: String,
    default: '',
  },
});

// サイズに応じたクラスを設定
const spinnerClasses = computed(() => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return ['animate-spin', 'text-violet-600', sizeClasses[props.size]];
});
</script>
