## **1. 422エラーとの分離確認（バリデーションエラー）**

### **関連ファイル**

**Axios Interceptor:**

- **resources/js/plugins/axios.js**: 422エラーは `return Promise.reject(error)` でフォームに伝播

**バリデーション:**

- **app/Http/Requests/StoreLearningSessionRequest.php**: サーバーサイドバリデーション
- **resources/js/validators/studySessionValidator.js**: クライアントサイドバリデーション

**コンポーネント:**

- **resources/js/views/learning/StudySessionCreate.vue**: 学習記録作成フォーム
- **resources/js/components/common/GlobalErrorModal.vue**: 500エラー専用モーダル（422では表示されない）

### 1.1 テスト準備（422エラーを発生させる）:

- [x]  `resources/js/validators/studySessionValidator.js` の学習時間バリデーションを一時的に緩和してください。

```jsx
// 元のコード（1分以上、1440分以下）
if (minutes < 1 || minutes > 1440) {
  errors.value.studyTime = '学習時間は1分以上、1日（24時間）以内で入力してください。';
}

// テスト用コード（0分以上に変更）
if (minutes < 0 || minutes > 1440) {
  errors.value.studyTime = '学習時間は0分以上、1日（24時間）以内で入力してください。';
}

```

### 1.2 422エラー時にGlobalErrorModalが表示されないことを確認:

- [x]  学習記録作成ページ（`/learning-contents/:id/record`）にアクセスしてください。
- [x]  学習セクションを選択し、学習時間を**0分**に設定してください。
- [x]  「記録を保存」をクリックしてください。
- [x]  クライアントサイドバリデーションを通過し、サーバーサイドで422エラーが返されることを確認してください。
- [x]  フォーム内にサーバーから返されたバリデーションエラーメッセージが表示されることを確認してください。
- [x]  GlobalErrorModalが**表示されない**ことを確認してください。

### 1.3 テスト後のクリーンアップ:

- [x]  `resources/js/validators/studySessionValidator.js` を元に戻してください（`minutes < 1` に修正）。

---

## **2. 500エラーハンドリング（ダッシュボード読み込み）**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningContentController.php**: `index` - 学習内容一覧を取得
- **app/Http/Controllers/LearningSessionController.php**: `latestByContent` - 最新の学習記録を取得

**Piniaストア:**

- **resources/js/stores/learningContent.js**: `fetchContents` - 学習内容一覧データをAPIから取得
- **resources/js/stores/learningSession.js**: `fetchLearningSessions` - 学習記録データをAPIから取得
- **resources/js/stores/errorModal.js**: `showError` - GlobalErrorModalを表示

**Composables:**

- **resources/js/composables/useLearningData.js**: 学習データの取得と管理
- **resources/js/composables/ui/useLoading.js**: ローディング状態の管理

**コンポーネント:**

- **resources/js/views/Dashboard.vue**: ダッシュボードのメインビュー
- **resources/js/components/common/GlobalErrorModal.vue**: 500エラー専用モーダル
- **resources/js/components/common/LoadingSpinner.vue**: ローディングスピナー

**Axios Interceptor:**

- **resources/js/plugins/axios.js**: 500系エラーを捕捉してGlobalErrorModalを表示

### 2.1 テスト準備:

- [x]  `app/Http/Controllers/LearningContentController.php` の `index` メソッドの先頭に `abort(500, 'Test Error');` を追加してください。

### 2.2 500エラー時のモーダル表示:

- [x]  ブラウザで `/dashboard` にアクセスし、ローディングスピナーが表示されることを確認してください。
- [x]  GlobalErrorModalが表示されることを確認してください。
- [x]  モーダルのタイトルが「エラーが発生しました」と表示されることを確認してください。
- [x]  モーダルのメッセージが「サーバーエラーが発生しました」と表示されることを確認してください。
- [x]  「ページを再読み込み」「ダッシュボードへ戻る」の2つのボタンが表示されることを確認してください。

### 2.3 モーダルの動作確認:

- [x]  背景（オーバーレイ）をクリックしても、モーダルが閉じないことを確認してください。
- [x]  ESCキーを押しても、モーダルが閉じないことを確認してください。

### 2.4 テスト後のクリーンアップ:

- [x]  `app/Http/Controllers/LearningContentController.php` から `abort(500, 'Test Error');` を削除してください。

---

## **3. 500エラーハンドリング（学習記録削除）**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningSessionController.php**: `destroy` - 学習記録を削除

**Piniaストア:**

- **resources/js/stores/learningSession.js**: `deleteLearningSession` - 学習記録削除API呼び出し
- **resources/js/stores/errorModal.js**: `showError` - GlobalErrorModalを表示

**Composables:**

- **resources/js/composables/useLearningData.js**: `deleteStudySession` - 学習記録削除処理

**コンポーネント:**

- **resources/js/components/learning/LearningRecordCard.vue**: 学習記録カード
- **resources/js/components/learning/DeleteRecordConfirmModal.vue**: 削除確認モーダル
- **resources/js/components/common/GlobalErrorModal.vue**: 500エラー専用モーダル

**Axios Interceptor:**

- **resources/js/plugins/axios.js**: 500系エラーを捕捉

### 3.1 テスト準備:

- [x]  `app/Http/Controllers/LearningSessionController.php` の `destroy` メソッドの先頭に `abort(500, 'Test Error');` を追加してください。

### 3.2 500エラー時のモーダル表示:

- [x]  セクション別学習記録一覧ページで任意の記録の削除ボタンをクリックし、削除確認モーダルが表示されることを確認してください。
- [x]  削除確認モーダルで「削除」をクリックし、確認モーダルが閉じることを確認してください。
- [x]  GlobalErrorModalが表示されることを確認してください。
- [x]  モーダルのタイトルとメッセージが正しく表示されることを確認してください。

### 3.3 テスト後のクリーンアップ:

- [x]  `app/Http/Controllers/LearningSessionController.php` から `abort(500, 'Test Error');` を削除してください。

---

## **4. 500エラーハンドリング（全体レポート読み込み）**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningSessionController.php**: `statisticsSummary` - 統計サマリーを取得

**Piniaストア:**

- **resources/js/stores/reports.js**: `fetchStatistics` - レポート統計データをAPIから取得
- **resources/js/stores/errorModal.js**: `showError` - GlobalErrorModalを表示

**Composables:**

- **resources/js/composables/ui/useLoading.js**: ローディング状態の管理

**コンポーネント:**

- **resources/js/views/Reports.vue**: 全体レポートのメインビュー
- **resources/js/components/common/GlobalErrorModal.vue**: 500エラー専用モーダル
- **resources/js/components/common/LoadingSpinner.vue**: ローディングスピナー

**Axios Interceptor:**

- **resources/js/plugins/axios.js**: 500系エラーを捕捉

### 4.1 テスト準備:

- [x]  `app/Http/Controllers/LearningSessionController.php` の `statisticsSummary` メソッドの先頭に `abort(500, 'Test Error');` を追加してください。

### 4.2 500エラー時のモーダル表示:

- [x]  サイドバーから「学習レポート」をクリックし、ローディングスピナーが表示されることを確認してください。
- [x]  GlobalErrorModalが表示されることを確認してください。
- [x]  モーダルのタイトルとメッセージが正しく表示されることを確認してください。

### 4.3 テスト後のクリーンアップ:

- [x]  `app/Http/Controllers/LearningSessionController.php` から `abort(500, 'Test Error');` を削除してください。

---

## **5. モーダルボタン動作確認**

### **関連ファイル**

**コンポーネント:**

- **resources/js/components/common/GlobalErrorModal.vue**: ボタンのクリックイベント処理

**Piniaストア:**

- **resources/js/stores/errorModal.js**: モーダルの表示/非表示管理

### 5.1 「ページを再読み込み」ボタン:

- [x]  任意の500エラーを発生させ（例: ダッシュボード読み込み）、GlobalErrorModalが表示されることを確認してください。
- [x]  「ページを再読み込み」ボタンをクリックし、ページ全体が再読み込みされること（`window.location.reload()`）を確認してください。
- [x]  URLが変わらないことを確認してください。
- [x]  `abort(500)` を削除していれば正常に表示されることを確認してください。

### 5.2 「ダッシュボードへ戻る」ボタン:

- [x]  レポートページで500エラーを発生させ、GlobalErrorModalが表示されることを確認してください。
- [x]  「ダッシュボードへ戻る」ボタンをクリックし、ダッシュボード (`/dashboard`) にリダイレクトされることを確認してください。
- [x]  ダッシュボードが正常に表示されることを確認してください。

---

## **6. 統合テスト（エラー種別の分離確認）**

### **関連ファイル**

**Axios Interceptor:**

- **resources/js/plugins/axios.js**: 全エラー種別のハンドリング

**コンポーネント:**

- **resources/js/views/NotFound.vue**: 403/404エラー用ページ
- **resources/js/components/common/GlobalErrorModal.vue**: 500エラー用モーダル

### 6.1 エラー種別ごとの適切なハンドリング:

- [x]  **401エラー**: Cookie削除後API呼び出しで、ログイン画面へリダイレクトされることを確認してください
- [x]  **403エラー**: 他ユーザーのURL参照で、NotFound.vue (type=forbidden) が表示されることを確認してください
- [x]  **404エラー**: 削除済みデータアクセスで、NotFound.vue (type=notfound) が表示されることを確認してください
- [x]  **422エラー**: バリデーションエラーで、フォーム内エラー表示されることを確認してください
- [x]  **500エラー**: サーバーエラーで、GlobalErrorModalが表示されることを確認してください

### 6.2 複数画面での500エラー確認:

- [x]  ダッシュボード（学習内容一覧）で500エラーが発生し、GlobalErrorModalが表示されることを確認してください。
- [x]  学習内容詳細ページで500エラーが発生し、GlobalErrorModalが表示されることを確認してください。
- [x]  学習記録削除時に500エラーが発生し、GlobalErrorModalが表示されることを確認してください。
- [x]  全体レポートで500エラーが発生し、GlobalErrorModalが表示されることを確認してください。
- [x]  個別レポートで500エラーが発生し、GlobalErrorModalが表示されることを確認してください。

### 6.3 ローディング状態の確認:

- [x]  500エラー時に `isLoading = false` になり、GlobalErrorModalが表示されることを確認してください。
- [x]  401/403/404エラー時に `isLoading = true` のままで、ページ遷移完了までローディング表示が継続されることを確認してください（ちらつき防止）。

---

## **7. 既存テストリストの未完了項目**

### 7.1 学習内容管理:

- [x]  1.8 学習内容一覧のAPIエラーハンドリング
- [x]  2.7 学習内容新規作成のAPIエラーハンドリング
- [x]  3.8 学習内容詳細のAPIエラーハンドリング
- [x]  4.6 学習内容編集のAPIエラーハンドリング
- [x]  5.4 学習内容削除のAPIエラーハンドリング
- [x]  6.4 完了/再開のAPIエラーハンドリング

### 7.2 学習記録:

- [x]  1.8 学習記録作成のAPIエラーハンドリング

### 7.3 レポート・統計:

- [x]  1.8 全体レポートのAPIエラーハンドリング
- [x]  2.7 個別レポートのAPIエラーハンドリング

---
