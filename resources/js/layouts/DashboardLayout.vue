<template>
  <div class="p-8 mx-auto max-w-7xl">
    <div class="mb-8">
      <!-- タイトル -->
      <h2 class="mb-3 text-2xl font-bold text-transparent sm:text-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text">
        <slot name="header-title"></slot>
      </h2>

      <!-- ディスクリプションとボタン -->
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <p class="text-slate-600">
          <slot name="header-description"></slot>
        </p>
        <div class="flex-shrink-0">
          <slot name="header-action"></slot>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
// ダッシュボードレイアウトには特別なロジックは不要
</script>
