<template>
  <!-- 学習記録カードコンポーネント -->
  <div class="p-5 bg-white border rounded-lg shadow-sm">
    <div class="flex flex-col gap-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <!-- 日時 -->
          <div>
            <span class="font-semibold text-slate-800">{{ formatDateTime(record.studied_at) }}</span>
          </div>

          <!-- 追加情報スロット（学習内容リンクやセクションリンク） -->
          <slot name="additional-info" :record="record"></slot>

          <!-- 学習時間 -->
          <div>
            <span class="text-sm text-slate-600">学習時間: {{ formatMinutes(record.study_minutes) }} </span>
          </div>

          <!-- 調子 -->
          <div class="flex items-center mt-1">
            <span class="mr-1 text-sm text-slate-600">調子:</span>
            <StarIcon v-for="r in 5" :key="r" class="w-4 h-4" :class="r <= record.mood_rating ? 'text-yellow-400' : 'text-gray-300'" />
          </div>
        </div>

        <!-- ボタン -->
        <div class="flex space-x-2 shrink-0">
          <BaseButton variant="icon-primary" size="md" :left-icon="PencilIcon" :icon-only="true" @click="$emit('edit', record)"> 記録を編集 </BaseButton>
          <DeleteButton variant="icon-danger" size="sm" @click="$emit('delete', record)"> 記録を削除 </DeleteButton>
        </div>
      </div>

      <!-- メモ -->
      <div v-if="record.memo">
        <div class="p-3 mt-1 rounded-xl bg-slate-50">
          <p class="text-sm text-slate-600">メモ:</p>
          <p class="text-sm break-words whitespace-pre-wrap text-slate-700">{{ record.memo }}</p>
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
