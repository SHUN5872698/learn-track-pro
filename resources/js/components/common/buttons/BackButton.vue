<!-- 戻るボタンコンポーネント -->
<template>
  <BaseButton variant="secondary" :left-icon="ArrowUturnLeftIcon" @click="$emit('click', $event)">
    <slot>戻る</slot>
  </BaseButton>
</template>

<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import { ArrowUturnLeftIcon } from '@heroicons/vue/24/solid';

defineProps({
  // BaseButtonのpropsを継承し、オーバーライド可能にする
});

defineEmits(['click']);
</script>
