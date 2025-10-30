<template>
  <div :class="containerClasses">
    <img v-if="user.avatar && !imageError" :src="user.avatar" :alt="user.name" :class="imageClasses" @error="handleImageError" />
    <div v-else :class="initialsClasses">
      {{ userInitials }}
    </div>
  </div>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { ref, computed } from 'vue';

// ========================================
// 初期設定
// ========================================
const props = defineProps({
  user: {
    type: Object,
    required: true,
    validator: (value) => 'name' in value, // userオブジェクトにはnameプロパティが必須
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
});

// ========================================
// 状態管理
// ========================================
// 画像の読み込みエラー状態を管理
const imageError = ref(false);

// ========================================
// 算出プロパティ
// ========================================
// アバターコンテナの動的なクラスを生成
const containerClasses = computed(() => {
  let sizeClass = '';
  switch (props.size) {
    case 'sm':
      sizeClass = 'w-8 h-8 text-sm'; // 32px
      break;
    case 'md':
      sizeClass = 'w-12 h-12 text-lg'; // 48px
      break;
    case 'lg':
      sizeClass = 'w-24 h-24 text-3xl'; // 96px
      break;
  }
  return [`rounded-full overflow-hidden flex-shrink-0`, sizeClass];
});

// アバター画像の動的なクラスを生成
const imageClasses = computed(() => {
  return [`object-cover w-full h-full`];
});

// イニシャル表示の動的なクラスを生成
const initialsClasses = computed(() => {
  return [`w-full h-full flex items-center justify-center font-bold text-white bg-gradient-to-r from-violet-600 to-emerald-600`];
});

// ユーザー名からイニシャルを生成
const userInitials = computed(() => {
  if (!props.user || !props.user.name) {
    return '';
  }

  const name = props.user.name.trim();

  // 日本語の文字（漢字、ひらがな、カタカナ）が含まれているかチェック
  const hasJapanese = /[　-〿぀-ゟ゠-ヿ一-鿿]/.test(name);

  if (hasJapanese) {
    // 日本語名の場合、最初の2文字を返す
    return name.substring(0, 2);
  } else {
    // 英語名の場合
    const parts = name.split(' ').filter((part) => part.length > 0);
    if (parts.length > 1) {
      // 複数の単語がある場合、各単語の最初の文字を結合
      return parts.map((part) => part.charAt(0).toUpperCase()).join('');
    } else if (name.length > 1) {
      // 単語が1つで2文字以上ある場合、最初の2文字を大文字で返す
      return name.substring(0, 2).toUpperCase();
    } else {
      // 1文字しかない場合、その文字を大文字で返す
      return name.toUpperCase();
    }
  }
});

// ========================================
// メソッド
// ========================================
// 画像読み込みエラー時の処理
const handleImageError = () => {
  imageError.value = true;
};
</script>
