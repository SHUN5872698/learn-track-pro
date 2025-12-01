## **1. 学習記録作成**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/TechnologyController.php**: `index` - 学習記録作成フォームで選択可能な学習内容のリストを取得するために利用されます。
- **app/Http/Controllers/SectionController.php**: `index` - 学習記録作成フォームで選択可能なセクションのリストを取得するために利用されます。
- **app/Http/Controllers/LearningSessionController.php**: `store` - 新しい学習記録をデータベースに保存します。
- **app/Http/Requests/StoreLearningSessionRequest.php**: 学習記録作成リクエストのサーバーサイドバリデーションルールを定義します。

**Piniaストア:**

- **resources/js/stores/learningContent.js**: `fetchContents` - 学習内容一覧データをAPIから取得し、ストアに保存します。
- **resources/js/stores/sections.js**: `fetchSections` - 指定された学習内容のセクション一覧データをAPIから取得し、ストアに保存します。
- **resources/js/stores/learningSession.js**: `createLearningSession` - 学習記録作成APIを呼び出し、ストアに新しい学習記録を追加します。

**Composables:**

- **resources/js/composables/useStudySessionForm.js**: 学習記録作成フォームのデータを管理し、バリデーション、日付/時刻のフォーマット、モーダル制御などのロジックを提供します。
- **resources/js/composables/ui/useLoading.js**: データ読み込み中のローディング状態を管理します。

**コンポーネント:**

- **resources/js/views/learning/StudySessionCreate.vue**: 学習記録作成フォームのUIを提供します。
- **resources/js/components/learning/StudySessionFormFields.vue**: 学習記録フォームの共通フィールド（セクション選択、学習日、学習時間、メモ、調子）を提供します。
- **resources/js/components/common/DatePickerModal.vue**: 学習日を選択するためのモーダルです。
- **resources/js/components/common/TimeInputModal.vue**: 学習時間または時刻を選択するためのモーダルです。
- **resources/js/layouts/DetailLayout.vue**: 学習記録作成ページのレイアウトを提供します。
- **resources/js/components/common/LoadingSpinner.vue**: データ読み込み中に表示されるスピナーです。
- **resources/js/components/common/ConfirmModal.vue**: 未保存の変更がある場合の確認モーダルです。
- **resources/js/components/common/SuccessToast.vue**: 学習記録作成成功時のトースト通知を表示します。

**バリデーション:**

- **resources/js/validators/studySessionValidator.js**: `StudySessionCreate.vue`でクライアントサイドの入力値のバリデーションに使用されます。

### **1.1 ページへのアクセス**:

- [x]  ダッシュボードの学習内容カードから「記録を追加」ボタンをクリックして、学習記録作成ページ (`/learning-contents/:id/record`) に遷移することを確認してください。
- [x]  学習内容詳細ページから「記録を追加」ボタンをクリックして、学習記録作成ページに遷移することを確認してください。
- [x]  セクション別学習記録一覧ページから「このセクションに記録を追加」ボタンをクリックして、学習記録作成ページに遷移し、セクションが初期選択されていることを確認してください。

### **1.2 正常な学習記録作成**:

- [x]  学習セクションを選択し、学習日、学習時間、メモ（任意）、調子（任意）を入力して「記録を保存」ボタンをクリックしてください。
- [x]  保存後、学習内容詳細ページまたはセクション別学習記録一覧ページにリダイレクトされ、作成した記録が表示されることを確認してください。

### **1.3 日付選択機能**:

- [x]  「学習日」フィールドをクリックすると、日付選択モーダルが表示されることを確認してください。
- [x]  モーダル内で日付を選択し、「確認」ボタンをクリックすると、フォームの学習日が更新されることを確認してください。
- [x]  未来の日付は選択できないことを確認してください。

### **1.4 時刻入力機能**:

- [x]  「学習日」フィールドの時刻部分をクリックすると、時間入力モーダルが表示されることを確認してください。
- [x]  モーダル内で時間と分を選択し、「確認」ボタンをクリックすると、フォームの学習時刻が更新されることを確認してください。
- [x]  「現時刻」ボタンをクリックすると、学習日時が現在の日時にリセットされることを確認してください。

### **1.6 入力文字数表示:**

- [x]  0文字の場合、文字色が灰色で表示されることを確認してください。
- [x]  500文字の場合、文字色が灰色のままであることを確認してください。
- [x]  501文字の場合、文字色が赤色に変わることを確認してください。

### **1.6 バリデーションエラー**:

**学習セクション**:

- [x]  学習セクションを未選択のまま保存し、「学習セクションを選択してください」と表示されることを確認してください。

**学習日**:

- [x]  学習日を空欄のまま保存し、「学習日時を入力してください」と表示されることを確認してください。
    - デフォルトで当日の日付が選択されています
- [x]  未来の日付を選択して保存し、「現在日以降の日時は登録できません」と表示されることを確認してください。
    - 選択不可で実装しました。

**学習時間**:

- [x]  学習時間を0分にして保存し、「学習時間は1分以上で入力してください。」と表示されることを確認してください。
- [x]  学習時間を1440分（24時間）以上にして保存し、「学習時間は1日（24時間）以内で入力してください。」と表示されることを確認してください。

**メモ**:

- [x]  メモを501文字以上にして保存し、「学習メモは500文字以内で入力してください」と表示されることを確認してください。

**調子**:

- [x]  調子を6以上にして保存し、「学習中の調子は1から5の範囲で評価してください」と表示されることを確認してください。
    - 設定不可

### **1.7 「キャンセル」ボタン**:

- [x]  フォームに未保存の変更がある状態で「キャンセル」をクリックすると、確認モーダルが表示されることを確認してください。
- [x]  確認モーダルで「破棄」を選択すると、変更が破棄され前のページに戻ることを確認してください。

### **1.8 ローディング表示**:

- [x]  学習記録作成中に「記録を保存」ボタンがローディング状態になることを確認してください。

### **1.9 APIエラーハンドリング**:

- [x]  API通信でエラーが発生した場合、適切なエラーメッセージが表示されることを確認してください。

---

## **2. 学習記録編集**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningContentController.php**: `index` - 学習記録編集フォームで選択可能な学習内容のリストを取得するために利用されます。
- **app/Http/Controllers/SectionController.php**: `index` - 学習記録編集フォームで選択可能なセクションのリストを取得するために利用されます。
- **app/Http/Controllers/LearningSessionController.php**: `show` - 編集対象の学習記録の詳細を取得します。
- **app/Http/Controllers/LearningSessionController.php**: `update` - 既存の学習記録をデータベースで更新します。
- **app/Http/Requests/UpdateLearningSessionRequest.php**: 学習記録更新リクエストのサーバーサイドバリデーションルールを定義します。

**Piniaストア:**

- **resources/js/stores/learningContent.js**: `fetchContents` - 学習内容一覧データをAPIから取得し、ストアに保存します。
- **resources/js/stores/sections.js**: `fetchSections` - 指定された学習内容のセクション一覧データをAPIから取得し、ストアに保存します。
- **resources/js/stores/learningSession.js**: `fetchLearningSession` - 編集対象の学習記録データをAPIから取得し、ストアに保存します。
- **resources/js/stores/learningSession.js**: `updateLearningSession` - 学習記録更新APIを呼び出し、ストアの学習記録を更新します。

**Composables:**

- **resources/js/composables/useStudySessionForm.js**: 学習記録編集フォームのデータを管理し、バリデーション、日付/時刻のフォーマット、モーダル制御などのロジックを提供します。
- **resources/js/composables/ui/useLoading.js**: データ読み込み中のローディング状態を管理します。

**コンポーネント:**

- **resources/js/views/learning/StudySessionEdit.vue**: 学習記録編集フォームのUIを提供します。
- **resources/js/components/learning/StudySessionFormFields.vue**: 学習記録フォームの共通フィールド（セクション選択、学習日、学習時間、メモ、調子）を提供します。
- **resources/js/components/common/DatePickerModal.vue**: 学習日を選択するためのモーダルです。
- **resources/js/components/common/TimeInputModal.vue**: 学習時間または時刻を選択するためのモーダルです。
- **resources/js/layouts/DetailLayout.vue**: 学習記録編集ページのレイアウトを提供します。
- **resources/js/components/common/LoadingSpinner.vue**: データ読み込み中に表示されるスピナーです。
- **resources/js/components/common/ConfirmModal.vue**: 未保存の変更がある場合の確認モーダルです。
- **resources/js/components/common/SuccessToast.vue**: 学習記録更新成功時のトースト通知を表示します。

**バリデーション:**

- **resources/js/validators/studySessionValidator.js**: `StudySessionEdit.vue`でクライアントサイドの入力値のバリデーションに使用されます。

### **2.1 ページへのアクセス**:

- [x]  セクション別学習記録一覧ページまたは個別レポートページから学習記録カードの編集ボタンをクリックして、学習記録編集ページ (`/learning-contents/:contentId/sessions/:sessionId/edit`) に遷移することを確認してください。
- [x]  既存の学習記録情報がフォームに正しく表示されていることを確認してください。

### **2.2 正常な学習記録更新**:

- [x]  学習セクション、学習日、学習時間、メモ、調子を変更し、「記録を更新」ボタンをクリックしてください。
- [x]  更新後、元のページにリダイレクトされ、変更が反映されていることを確認してください。

### **2.3 入力文字数表示:**

- [x]  0文字の場合、文字色が灰色で表示されることを確認してください。
- [x]  500文字の場合、文字色が灰色のままであることを確認してください。
- [x]  501文字の場合、文字色が赤色に変わることを確認してください。

### **2.4 バリデーションエラー**:

- [x]  新規作成時と同様のバリデーションエラーが発生することを確認してください。

### **2.5 「キャンセル」ボタン**:

- [x]  フォームに未保存の変更がある状態で「キャンセル」をクリックすると、確認モーダルが表示されることを確認してください。
- [x]  確認モーダルで「破棄」を選択すると、変更が破棄され前のページに戻ることを確認してください。

### **2.6 ローディング表示**:

- [x]  学習記録更新中に「記録を更新」ボタンがローディング状態になることを確認してください。

### **2.7 APIエラーハンドリング**:

- [x]  API通信でエラーが発生した場合、適切なエラーメッセージが表示されることを確認してください。

---

## **3. 学習記録削除**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningSessionController.php**: `destroy` - 指定された学習記録をデータベースから削除します。

**Piniaストア:**

- **resources/js/stores/learningSession.js**: `deleteLearningSession` - 学習記録削除APIを呼び出し、ストアから該当学習記録を削除します。

**Composables:**

- **resources/js/composables/useLearningData.js**: `deleteStudySession` - 学習記録削除処理を`learningSessionStore`に委譲します。

**コンポーネント:**

- **resources/js/components/learning/LearningRecordCard.vue**: 学習記録カードの削除ボタンから削除アクションをトリガーします。
- **resources/js/components/learning/DeleteRecordConfirmModal.vue**: 学習記録削除時の確認モーダルです。

### 3.1 正常な学習記録削除:

- [x]  学習記録カードの削除ボタンをクリックし、確認モーダルが表示されることを確認してください。
- [x]  モーダルに削除対象の記録の詳細（日時、学習時間、メモ）が表示されることを確認してください。
    - 全体レポートページでは「学習内容名」「セクション名」、個別レポートページでは「セクション名」を表示させたほうが親切かもしれません。
- [x]  確認モーダルで「削除」を選択すると、学習記録が一覧から削除されることを確認してください。
- [x]  削除後、関連する学習内容の統計情報（総学習時間、完了セクション数など）が正しく更新されることを確認してください。

### 3.2 ローディング表示:

- [x]  削除処理中にローディング表示が適切に行われることを確認してください。

### 3.3 APIエラーハンドリング:

- [x]  API通信でエラーが発生した場合、適切なエラーメッセージが表示されることを確認してください。

---

## **4. セクション別学習記録一覧**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningContentController.php**: `show` - 学習内容のタイトルなどを表示するために利用されます。
- **app/Http/Controllers/SectionController.php**: `index` - セクションのタイトルなどを表示するために利用されます。
- **app/Http/Controllers/LearningSessionController.php**: `bySection` - 指定されたセクションに紐づく学習記録一覧を取得します。
- **app/Http/Controllers/LearningSessionController.php**: `destroy` - 学習記録の削除処理に利用されます。

**Piniaストア:**

- **resources/js/stores/learningContent.js**: `fetchContents` - 学習内容一覧データをAPIから取得し、ストアに保存します。
- **resources/js/stores/sections.js**: `fetchSections` - 指定された学習内容のセクション一覧データをAPIから取得し、ストアに保存します。
- **resources/js/stores/learningSession.js**: `fetchLearningSessions` - 指定されたセクションの学習記録一覧データをAPIから取得し、ストアに保存します。

**Composables:**

- **resources/js/composables/useLearningData.js**: `learningContents`、`sections` - 学習内容とセクションのデータを提供します。`deleteStudySession`アクションを呼び出します。
- **resources/js/composables/ui/useLoading.js**: データ読み込み中のローディング状態を管理します。

**コンポーネント:**

- **resources/js/views/learning/SectionStudyRecords.vue**: セクション別学習記録一覧を表示します。
- **resources/js/layouts/DetailLayout.vue**: セクション別学習記録一覧ページのレイアウトを提供します。
- **resources/js/components/common/LoadingSpinner.vue**: データ読み込み中に表示されるスピナーです。
- **resources/js/components/common/buttons/BackButton.vue**: 前のページに戻るボタンです。
- **resources/js/components/common/BaseButton.vue**: 「このセクションに記録を追加」ボタンとして使用されます。
- **resources/js/components/learning/LearningRecordCard.vue**: 個々の学習記録をカード形式で表示します。
- **resources/js/components/common/Pagination.vue**: 学習記録一覧のページネーション機能を提供します。
- **resources/js/components/learning/DeleteRecordConfirmModal.vue**: 学習記録削除時の確認モーダルです。

### 4.1 **ページへのアクセス**:

- [x]  学習内容詳細ページからセクションをクリックして、セクション別学習記録一覧ページ (`/learning/:id/section/:sectionId`) に遷移することを確認してください。

### 4.2 **記録の表示**:

- [x]  選択したセクションに紐づく学習記録がカード形式で一覧表示されることを確認してください。
- [x]  各カードに日時、学習時間、メモ、調子が表示されることを確認してください。
- [x]  セクションの合計学習時間と記録件数がヘッダーに正しく表示されることを確認してください。

### 4.3 **空の状態**:

- [x]  学習記録がない場合、「このセクションの学習記録はまだありません。」と表示されることを確認してください。

### 4.4 **ページネーション**:

- [x]  学習記録が多数ある場合、ページネーションが表示され、ページ切り替えが正しく機能することを確認してください。

### 4.5 **「このセクションに記録を追加」ボタン**:

- [x]  ボタンをクリックすると、学習記録作成ページに遷移し、現在のセクションが初期選択されていることを確認してください。

### 4.6 **ローディング表示**:

- [x]  学習記録の取得中にスピナーが表示されることを確認してください。

### 4.7 **APIエラーハンドリング**:

- [x]  API通信でエラーが発生した場合、適切なエラーメッセージが表示されることを確認してください。

---
