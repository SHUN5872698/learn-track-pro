<template>
  <!-- 学習記録カードコンポーネント -->
  <div class="p-4 bg-white border rounded-lg shadow-sm md:p-5">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div class="flex-1 min-w-0 space-y-1">
          <!-- 日時 -->
          <div>
            <span class="text-sm font-semibold md:text-base text-slate-800"> {{ formatDateTime(record.studied_at) }} </span>
          </div>

          <!-- 追加情報スロット（学習内容リンクやセクションリンク） -->
          <slot name="additional-info" :record="record"></slot>

          <!-- 学習時間 -->
          <div>
            <span class="text-xs md:text-sm text-slate-600">学習時間: {{ formatMinutes(record.study_minutes) }} </span>
          </div>

          <!-- 調子 -->
          <div class="flex items-center">
            <span class="mr-1 text-xs md:text-sm text-slate-600">調子:</span>
            <StarIcon v-for="r in 5" :key="r" class="w-4 h-4 md:w-5 md:h-5" :class="r <= record.mood_rating ? 'text-yellow-400' : 'text-gray-300'" />
          </div>
        </div>

        <!-- ボタン -->
        <div class="flex justify-end space-x-2 md:shrink-0">
          <BaseButton variant="icon-primary" size="md" :left-icon="PencilIcon" :icon-only="true" @click="$emit('edit', record)"> 記録を編集 </BaseButton>
          <DeleteButton variant="icon-danger" size="sm" @click="$emit('delete', record)"> 記録を削除 </DeleteButton>
        </div>
      </div>

      <!-- メモ -->
      <div v-if="record.memo">
        <div class="p-3 rounded-xl bg-slate-50">
          <p class="text-xs md:text-sm text-slate-600">メモ:</p>
          <p class="text-xs break-words whitespace-pre-wrap md:text-sm text-slate-700">{{ record.memo }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { StarIcon, PencilIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
// コンポーネント
import BaseButton from '@/components/common/BaseButton.vue';
import DeleteButton from '@/components/common/buttons/DeleteButton.vue';

// ========================================
// ユーティリティ関数（純粋関数）
// ========================================
import { formatDateTime, formatMinutes } from '@/utils/dateFormatters';

defineProps({
  record: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit', 'delete']);
</script>
