<template>
  <div class="animate-fade-in">
    <!-- セクションのドラッグ＆ドロップリスト -->
    <draggable :list="localSections" item-key="id" handle=".drag-handle" :animation="300" ghost-class="sortable-ghost" drag-class="sortable-drag" chosen-class="sortable-chosen" @start="isDragging = true" @end="handleDragEnd" class="space-y-4">
      <template #item="{ element: section, index }">
        <div class="flex items-center space-x-1">
          <!-- ドラッグハンドル -->
          <div class="flex-shrink-0 p-1 transition-colors rounded cursor-move drag-handle hover:bg-gray-100">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <span class="flex-shrink-0 text-sm font-semibold text-slate-600"> {{ index + 1 }} .</span>
          <!-- セクションタイトル入力フィールド -->
          <input
            :id="`section-title-${index}`"
            :name="`section-title-${index}`"
            type="text"
            autocomplete="off"
            class="flex-1 min-w-0 px-2 py-2 text-sm placeholder-gray-400 border rounded-md shadow-sm focus:outline-none md:px-3"
            :class="[showSectionBorder(index) ? 'form-input-error' : 'form-input-normal']"
            placeholder="セクションのタイトル"
            :value="section.title"
            @input="sectionTitleModified(index, $event.target.value)"
          />
          <!-- セクション削除ボタン -->
          <!-- セクションが1つしかない場合は削除不可 -->
          <BaseButton
            @click="removeSection(index)"
            variant="icon-danger"
            size="sm"
            class="flex-shrink-0"
            shape="circle"
            :icon-only="true"
            :disabled="localSections.length <= 1"
            :tooltip="localSections.length <= 1 ? '最低1つのセクションが必要です' : ''"
            :tooltip-variant="localSections.length <= 1 ? 'danger' : 'default'"
          >
            ✕
          </BaseButton>
        </div>
      </template>
    </draggable>

    <div class="flex justify-start mt-6">
      <!-- セクション追加ボタン -->
      <button type="button" @click="addSection" class="flex items-center justify-center px-3 py-2 text-xs font-medium text-white transition-all duration-200 transform shadow-md md:text-sm md:px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl hover:shadow-lg hover:scale-105">
        <PlusIcon class="w-4 h-4 mr-1 md:w-5 md:h-5" />
        <span>セクションを追加</span>
      </button>
    </div>

    <!-- セクション追加のヒント -->
    <p v-if="showHint" class="flex items-center justify-start mt-3 text-sm text-slate-500">
      <LightBulbIcon class="w-5 h-5 mr-2 text-yellow-500" />
      セクションは後からでも追加できます。
    </p>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { ref, watch, reactive } from 'vue';
import { PlusIcon, LightBulbIcon } from '@heroicons/vue/24/solid';

// ========================================
// 内部インポート
// ========================================
import draggable from 'vuedraggable';
import BaseButton from '@/components/common/BaseButton.vue';

// プロパティ定義
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  originalSections: {
    type: Array,
    default: () => [],
  },
  showHint: {
    type: Boolean,
    default: false,
  },
  hasError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'request-delete']);

const localSections = ref(JSON.parse(JSON.stringify(props.modelValue)));
const isDragging = ref(false);

// 各セクションの入力状態を管理
const sectionsModified = reactive({});

// 枠線表示の制御（インデックスごと）
const showSectionBorder = (index) => {
  // セクションが空で、かつまだ修正されていない場合に赤枠を表示
  const section = localSections.value[index];
  const isEmpty = !section || !section.title || section.title.trim() === '';
  return props.hasError && isEmpty && !sectionsModified[index];
};

// hasErrorプロップの変更を監視してリセット
watch(
  () => props.hasError,
  (newVal) => {
    if (newVal) {
      // エラーが新しくセットされたら修正状態をリセット
      Object.keys(sectionsModified).forEach((key) => {
        sectionsModified[key] = false;
      });
    }
  }
);

// 親コンポーネントからのmodelValueの変更を監視
watch(
  () => props.modelValue,
  (newValue) => {
    localSections.value = JSON.parse(JSON.stringify(newValue));
  },
  { deep: true }
);

// ========================================
// イベントハンドラ
// ========================================
// セクションのタイトルを更新
const sectionTitleModified = (index, title) => {
  // セクションのタイトルが変更された際に、ローカルの状態と親コンポーネントに通知し、変更フラグを立てる
  const newSections = [...localSections.value];
  newSections[index].title = title;
  emit('update:modelValue', newSections);
  sectionsModified[index] = true; // 変更フラグを立てる
};

const updateSectionOrder = () => {
  // セクションの順序が変更された際に、orderプロパティを更新し、親コンポーネントに通知する
  const updatedSections = localSections.value.map((section, i) => ({
    ...section,
    order: i + 1,
  }));
  emit('update:modelValue', updatedSections);
};

const addSection = () => {
  // 新しいセクションを追加し、親コンポーネントに通知する
  const newSection = { id: `new_${Date.now()}`, title: '', order: localSections.value.length + 1 };
  const newSections = [...localSections.value, newSection];
  emit('update:modelValue', newSections);
};

const handleDragEnd = () => {
  // ドラッグ操作が終了した際に、ドラッグ状態をリセットし、セクションの順序を更新する
  isDragging.value = false;
  updateSectionOrder();
};

const removeSection = (index) => {
  // セクションを削除する際に、編集モードと元のセクションであるかを考慮し、親コンポーネントに通知する
  const section = localSections.value[index];
  const isOriginal = props.originalSections.some((orig) => orig.id === section.id);

  if (props.isEditMode && isOriginal) {
    emit('request-delete', index);
  } else {
    localSections.value.splice(index, 1);
    emit('update:modelValue', localSections.value);
    updateSectionOrder();
  }
};
</script>
