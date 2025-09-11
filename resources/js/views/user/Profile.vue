<template>
  <!-- プロフィールコンポーネント -->
  <DetailLayout title="プロフィール">
    <!-- アバター部: 直接実装 -->
    <div class="flex justify-center mb-6">
      <div class="relative">
        <img v-if="user.avatar" :src="user.avatar" class="object-cover w-24 h-24 rounded-full" @error="handleImageError" />
        <div v-else class="flex items-center justify-center w-24 h-24 text-3xl font-bold text-white rounded-full bg-gradient-to-r from-violet-600 to-emerald-600">
          {{ userInitials }}
        </div>
      </div>
    </div>

    <!-- ユーザー情報: 名前、メールアドレス、登録日を表示 -->
    <div class="space-y-2 text-center">
      <h3 class="text-2xl font-bold text-slate-900">{{ user.name }}</h3>
      <p class="text-gray-600">{{ user.email }}</p>
      <p class="text-sm text-gray-500">登録日: 2024年1月15日</p>
    </div>

    <template #actions>
      <BaseButton to="/profile/edit" variant="primary" :left-icon="PencilIcon"> 編集 </BaseButton>
    </template>
  </DetailLayout>
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { PencilIcon } from '@heroicons/vue/24/outline';

// ========================================
// 内部インポート
// ========================================
// コンポーザブル
import { useUser } from '../../composables/useUser.js';

// コンポーネント
import BaseButton from '../../components/common/BaseButton.vue';
import DetailLayout from '../../layouts/DetailLayout.vue';

// ========================================
// 初期設定
// ========================================
const router = useRouter();

// コンポーザブル実行
const { user } = useUser();

// ========================================
// 算出プロパティ
// ========================================
// ユーザー名のイニシャルを生成: ユーザーアバターの代替表示として利用するため
const userInitials = computed(() => {
  if (!user.name) return '?';
  const names = user.name.split(' ');
  // 複数の単語からなる名前の場合、各単語の頭文字を結合して表示
  if (names.length >= 2) {
    return names[0][0] + names[1][0];
  }
  // 単一の単語からなる名前の場合、最初の2文字を大文字で表示
  return user.name.substring(0, 2).toUpperCase();
});

// ========================================
// メソッド
// ========================================
// イベントハンドラ
// 画像読み込みエラー時は非表示にする
const handleImageError = (e) => {
  e.target.style.display = 'none';
};
</script>
