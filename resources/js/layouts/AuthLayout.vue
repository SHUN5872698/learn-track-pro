<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex items-center justify-center min-h-screen px-4 py-12">
      <!-- ログインフォームのカードコンテナ -->
      <div class="z-10 w-full max-w-md p-4 space-y-8 bg-white shadow-lg md:p-8 rounded-xl">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
// 認証レイアウトには特別なロジックは不要
</script>
