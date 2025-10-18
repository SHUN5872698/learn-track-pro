<template>
  <div class="p-8 mx-auto max-w-7xl">
    <div class="mb-8">
      <!-- タイトル -->
      <h2 class="section-header">
        <slot name="header-title"></slot>
      </h2>

      <!-- ディスクリプションとボタン -->
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <p class="section-subtext">
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
