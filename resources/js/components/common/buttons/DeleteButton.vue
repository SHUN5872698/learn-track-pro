<!-- /src/components/common/buttons/DeleteButton.vue -->
<!-- 削除ボタンコンポーネント -->
<template>
  <BaseButton variant="danger" :left-icon="TrashIcon" @click="$emit('click', $event)">
    <slot>削除</slot>
  </BaseButton>
</template>

<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import { TrashIcon } from '@heroicons/vue/24/solid';

defineProps({
  // BaseButtonのpropsを継承し、オーバーライド可能にする
});

defineEmits(['click']);
</script>
