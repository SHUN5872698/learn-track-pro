<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="mb-4 text-6xl font-bold text-gray-900">404</h1>
      <p class="mb-8 text-xl text-gray-600">ページが見つかりません</p>
      <BaseButton to="/dashboard" variant="primary"> ダッシュボードに戻る </BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../components/common/BaseButton.vue';
</script>
