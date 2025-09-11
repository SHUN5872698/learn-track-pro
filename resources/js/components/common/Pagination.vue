<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center mt-6 space-x-2">
    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1 text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:hover:bg-gray-200">前へ</button>
    <button v-for="page in displayPageNumbers" :key="page" @click="goToPage(page)" :class="['px-3 py-1 rounded-md transition-colors', currentPage === page ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
      {{ page }}
    </button>
    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1 text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:hover:bg-gray-200">次へ</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
  },
  currentPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:currentPage']);

// 総ページ数を計算: 総アイテム数と1ページあたりのアイテム数から、必要なページ数を算出
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

// 表示するページ番号の配列を計算: ページネーションUIに表示するページ番号を動的に生成
const displayPageNumbers = computed(() => {
  const pages = [];
  const maxDisplay = 5; // 表示するページ番号の最大数
  const current = props.currentPage;
  const total = totalPages.value;

  // 総ページ数が最大表示数以下の場合は全てのページを表示
  if (total <= maxDisplay) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // 現在のページを中心にページ番号を生成
    let start = Math.max(1, current - Math.floor(maxDisplay / 2));
    let end = Math.min(total, start + maxDisplay - 1);

    // 終端に達した場合、開始を調整してmaxDisplay個表示を維持
    if (end - start + 1 < maxDisplay) {
      start = Math.max(1, total - maxDisplay + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  return pages;
});

// 指定されたページへ遷移: ページ番号が有効な範囲内であることを確認し、親コンポーネントにイベントを発行
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page);
  }
};
</script>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
