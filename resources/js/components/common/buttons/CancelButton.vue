<template>
  <BaseButton variant="secondary" @click="$emit('click', $event)">
    <slot>キャンセル</slot>
  </BaseButton>
</template>

<script setup>
import BaseButton from '@/components/common/BaseButton.vue';

defineProps({
  // BaseButtonのpropsを継承し、オーバーライド可能にする
});

defineEmits(['click']);
</script>
