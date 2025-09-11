<template>
  <div class="p-8 mx-auto max-w-7xl">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <h2 class="mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text">
          <slot name="header-title"></slot>
        </h2>
        <slot name="header-action"></slot>
      </div>
      <p class="text-slate-600">
        <slot name="header-description"></slot>
      </p>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
// ダッシュボードレイアウトには特別なロジックは不要
</script>
