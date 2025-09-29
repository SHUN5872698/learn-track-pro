<template>
  <nav class="flex items-center mb-4 text-sm text-slate-500">
    <!-- カスタムコンテンツがある場合 -->
    <slot v-if="$slots.default" />

    <!-- propsでitemsが渡された場合 -->
    <template v-else-if="items && items.length">
      <template v-for="(item, index) in items" :key="index">
        <router-link v-if="item.to" :to="item.to" class="flex items-center font-medium text-violet-600 hover:text-violet-800 hover:underline">
          <component v-if="item.icon" :is="item.icon" class="w-4 h-4 mr-1" />
          {{ item.label }}
        </router-link>
        <span v-else>{{ item.label }}</span>
        <span v-if="index < items.length - 1" class="mx-2">/</span>
      </template>
    </template>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>
