# Vue.js コーディング規約

## あなたの役割
あなたはJavaScript、Vue 3、TailwindCSSのエキスパートです。

## コードスタイルと構造
- 簡潔で技術的に正確なJavaScriptコードを書く
- Composition API使用、Options API禁止
- コード重複よりモジュール化を優先
- 説明的な変数名（isLoading、hasError、canDelete等）
- ファイル構造：export → composables → helpers → static
- インデント：スペース2個

## `<script setup>`の記載順序

### 必須の順序ルール：
```javascript
<script setup>
// ========================================
// 1. 外部ライブラリのインポート
// ========================================
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// ========================================
// 2. 内部モジュールのインポート
// ========================================
// 2.1 コンポーザブル
import { useLearningData } from '@/composables/useLearningData';
import { useAuth } from '@/composables/useAuth';

// 2.2 コンポーネント（レイアウト → 共通 → 機能別）
import DetailLayout from '@/layouts/DetailLayout.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import SectionSelector from '@/components/common/SectionSelector.vue';
import LearningCard from '@/components/learning/LearningCard.vue';

// 2.3 ユーティリティ・ヘルパー
import { formatDate } from '@/utils/dateHelpers';
import { validateEmail } from '@/validators/userValidators';

// ========================================
// 3. Props定義
// ========================================
const props = defineProps({
  modelValue: Object,
  sections: Array,
  hasError: Boolean,
});

// ========================================
// 4. Emits定義
// ========================================
const emit = defineEmits(['update:modelValue', 'submit', 'cancel']);

// ========================================
// 5. ルーター・ルート
// ========================================
const route = useRoute();
const router = useRouter();

// ========================================
// 6. コンポーザブルの実行
// ========================================
const { user, isAuthenticated } = useAuth();
const { learningContents, addContent } = useLearningData();

// ========================================
// 7. リアクティブな変数（ref/reactive）
// ========================================
const isLoading = ref(false);
const formData = reactive({
  title: '',
  description: '',
});

// ========================================
// 8. 算出プロパティ（computed）
// ========================================
const canSubmit = computed(() => {
  return formData.title && !isLoading.value;
});

const filteredContents = computed(() => {
  // 複雑な計算ロジック
});

// ========================================
// 9. Watch
// ========================================
watch(() => props.modelValue, (newValue) => {
  // 処理
});

watchEffect(() => {
  // 処理
});

// ========================================
// 10. メソッド（イベントハンドラ → ヘルパー関数）
// ========================================
// 10.1 イベントハンドラ（handle〜）
const handleSubmit = async () => {
  // 処理
};

const handleCancel = () => {
  // 処理
};

// 10.2 ヘルパー関数
const validateForm = () => {
  // 処理
};

const formatData = (data) => {
  // 処理
};

// ========================================
// 11. ライフサイクルフック
// ========================================
onMounted(() => {
  // 初期化処理
});

onUnmounted(() => {
  // クリーンアップ処理
});

// ========================================
// 12. Provide（親コンポーネントの場合）
// ========================================
provide('validationContext', {
  errors: validationErrors,
  clearErrors,
});

// ========================================
// 13. Inject（子コンポーネントの場合）
// ========================================
const { errors, clearErrors } = inject('validationContext');
</script>
```

### セクションコメントのガイドライン：
- 主要なセクションは`// ========================================`で区切る
- サブセクションは`// --------`または番号付きコメントで区切る
- 各セクションにわかりやすい日本語コメントを付ける

## 命名規則

### ディレクトリ・ファイル
- ディレクトリ：kebab-case（例：auth-wizard/）
- コンポーネント：PascalCase（例：AuthWizard.vue、DeleteConfirmModal.vue）
- Composables：camelCase（例：useAuthState.js）
- ユーティリティ：camelCase（例：formatDate.js）

### 変数・関数
- 関数名：camelCase（例：handleDelete）
- 定数オブジェクト：UPPER_SNAKE_CASE
- ブール値：is/has/can接頭辞使用

### Vue Router
- ルートのnameプロパティ：kebab-case（例：learning-detail、profile-edit）
- コンポーネントのインポート：ファイル上部で事前インポート

```javascript
// router.js の例
import Home from './views/Home.vue';
import LearningDetail from './views/learning/LearningDetail.vue';
import ProfileEdit from './views/profile/ProfileEdit.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/learning/:id',
    name: 'learning-detail',
    component: LearningDetail
  },
  {
    path: '/profile/edit',
    name: 'profile-edit',
    component: ProfileEdit
  }
];
```

## JavaScript規約
- アロー関数を優先使用
- constを基本とし、必要時のみlet使用
- 単純な条件文は省略記法使用
- テンプレートリテラル使用

## Vue 3ベストプラクティス
- `<script setup>`構文使用
- ref、reactive、computed適切に使い分け
- provide/inject適切に活用
- カスタムcomposables作成

## UI・スタイリング

### 基本ルール
- TailwindCSSユーティリティクラスのみ使用
- カスタムCSSクラス定義禁止
- Bootstrapライクなクラス（btn-primary等）使用禁止
- モバイルファーストアプローチ
- レスポンシブデザイン必須

### カラーパレット
- メインカラー
  - violet-600, violet-700（プライマリ）
  - emerald-600, emerald-700（セカンダリ）
  - slate系（テキスト・背景）
  - red-600（削除・警告）

- 技術識別色
  - red系：Laravel
  - emerald系：Vue.js
  - blue系：React

### デザイン原則
- 角丸：rounded-2xl, rounded-xl（大きめ）
- 影：shadow-xl, shadow-lg
- 透明感：bg-white/70, backdrop-blur-md
- グラデーション：bg-gradient-to-r
- アニメーション：transition-all duration-200

### コンポーネントスタイル例
```javascript
// ボタン（プライマリ）
"bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-xl px-4 py-2 shadow-lg hover:shadow-xl"

// カード
"bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6"

// モーダル背景
"bg-black/30 backdrop-blur-sm"
```
