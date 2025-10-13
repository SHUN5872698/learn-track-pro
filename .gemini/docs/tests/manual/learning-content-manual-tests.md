## **1. 学習内容一覧**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningContentController.php**: `index` - ログインユーザーの学習内容一覧を取得します。
- **app/Http/Controllers/LearningSessionController.php**: `latestByContent` - ダッシュボードの「最近の学習活動」セクションで、学習内容ごとの最新の学習記録を取得するために利用されます。

**Piniaストア:**

- **resources/js/stores/learningContent.js**: `fetchContents` - 学習内容一覧データをAPIから取得し、ストアに保存します。
- **resources/js/stores/learningSession.js**: `fetchLearningSessions` - 学習セッション一覧データをAPIから取得し、ストアに保存します。

**Composables:**

- **resources/js/composables/useLearningData.js**: `learningContents` - 学習内容一覧データを提供します。`fetchContents`、`fetchLearningSessions`アクションを呼び出します。
- **resources/js/composables/ui/useLoading.js**: データ読み込み中のローディング状態を管理します。

**コンポーネント:**

- **resources/js/views/Dashboard.vue**: 学習内容一覧のメインビューです。
- **resources/js/components/learning/LearningContentCard.vue**: 個々の学習内容をカード形式で表示します。
- **resources/js/components/learning/StatsOverview.vue**: 学習統計の概要を表示します。
- **resources/js/layouts/DashboardLayout.vue**: ダッシュボードのレイアウトを提供します。
- **resources/js/components/common/LoadingSpinner.vue**: データ読み込み中に表示されるスピナーです。
- **resources/js/components/common/BaseButton.vue**: 「学習を追加」ボタンとして使用されます。
- **resources/js/components/common/ConfirmModal.vue**: 学習内容削除時の確認モーダルです。

### 1.1学習コンテンツの表示:

- [ ]  ログイン後、ダッシュボード (`/dashboard`) にアクセスし、登録されている学習コンテンツがカード形式で正しく表示されることを確認してください。
- [ ]  「進行中の学習」と「完了した学習」のセクションにコンテンツが分類されて表示されることを確認してください。
- [ ]  各カードにタイトル、技術アイコン、技術名、ステータス、進捗率、完了セクション数/総セクション数、総学習時間、最終学習日が表示されることを確認してください。

### 1.2ソート順の確認:

- [ ]  「進行中の学習」セクションで、`latestSessionUpdatedAt`が最新のものが優先され、次に`status`が`in_progress`のものが優先され、最後に`updated_at`が最新のものが優先されるソート順であることを確認してください。
- [ ]  「完了した学習」セクションで、`latestSessionUpdatedAt`が最新のものが優先され、次に`updated_at`が最新のものが優先されるソート順であることを確認してください。

### 1.3統計概要の表示:

- [ ]  「学習中コース」、「完了セクション」、「平均進捗」の各統計情報が正しく表示されることを確認してください。

### 1.4空の状態:

- [ ]  学習コンテンツが一つも登録されていない場合、「進行中の学習コンテンツはありません。」および「完了した学習コンテンツはありません。」と表示されることを確認してください。

### 1.5「学習を追加」ボタン:

- [ ]  「学習を追加」ボタンをクリックすると、学習内容新規作成ページ (`/learning-contents/create`) に遷移することを確認してください。

### 1.6カードメニューの操作:

- [ ]  各学習コンテンツカードの三点リーダーアイコンをクリックすると、メニューが表示されることを確認してください。
- [ ]  メニュー外をクリックすると、メニューが閉じることを確認してください。
    - 別のカードをクリック、サイドメニューをクリックだと別ページに遷移してしまう
- [ ]  メニュー内の各項目（編集、詳細、レポート、完了にする/学習を再開、削除）が、コンテンツのステータスに応じて適切に表示/非表示されることを確認してください。

### 1.7ローディング表示:

- [ ]  学習コンテンツの取得中にスピナーが表示されることを確認してください。

### 1.8APIエラーハンドリング:

- [ ]  API通信でエラーが発生した場合、適切なエラーメッセージが表示されることを確認してください。
    - APIからデータが取得できない場合の例外処理が不足していました

---

## **2. 学習内容新規作成**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningContentController.php**: `store` - 新しい学習内容とそれに紐づくセクションをデータベースに保存します。
- **app/Http/Requests/StoreLearningContentRequest.php**: 学習内容作成リクエストのサーバーサイドバリデーションルールを定義します。
- **app/Http/Controllers/SectionController.php**: `store` - 新しいセクションをデータベースに保存します。

**Piniaストア:**

- **resources/js/stores/learningContent.js**: `createContent` - 学習内容作成APIを呼び出し、ストアに新しい学習内容を追加します。

**Composables:**

- **resources/js/composables/useLearningContentForm.js**: 学習内容作成フォームのデータを管理します。
- **resources/js/composables/useWizardForm.js**: ウィザード形式のステップ管理とバリデーションロジックを提供します。
- **resources/js/composables/useLearningData.js**: `technologies` - 技術選択ドロップダウンのデータを提供します。

**コンポーネント:**

- **resources/js/views/learning/LearningContentCreate.vue**: 学習内容新規作成のウィザード形式フォームを提供します。
- **resources/js/components/learning/wizard/TechnologySelector.vue**: 技術選択ドロップダウンです。
- **resources/js/components/learning/wizard/SectionListEditor.vue**: セクションの追加、編集、並び替えを行うリストエディタです。
- **resources/js/components/learning/wizard/WizardNavigation.vue**: ウィザードのステップ間を移動するボタンを提供します。
- **resources/js/components/learning/wizard/WizardStepIndicator.vue**: ウィザードの現在のステップを表示します。
- **resources/js/layouts/DetailLayout.vue**: 学習内容作成ページのレイアウトを提供します。
- **resources/js/components/common/ConfirmModal.vue**: 未保存の変更がある場合の確認モーダルです。
- **resources/js/components/common/SuccessToast.vue**: 学習内容作成成功時のトースト通知を表示します。

**バリデーション:**

- **resources/js/validators/learningContentValidator.js**: `LearningContentCreate.vue`でクライアントサイドの入力値（技術、タイトル、概要、セクション）のバリデーションに使用されます。

### **2.1ウィザードフロー**:

- [ ]  「学習を追加」ボタンから新規作成ページ (`/learning-contents/create`) に移動し、ウィザード形式でステップが進行することを確認してください。
- [ ]  各ステップのタイトルと説明が正しく表示されることを確認してください。

### **2.2 Step 1: 基本情報入力**:

**正常な入力**:

- [ ]  有効な技術、タイトル、概要を入力し、「次へ」ボタンをクリックするとStep 2に進むことを確認してください。

**バリデーションエラー**:

- [ ]  技術を未選択のまま「次へ」をクリックし、「技術を選択してください」と表示されることを確認してください。
- [ ]  タイトルを空欄にして「次へ」をクリックし、「タイトルは必須項目です。」と表示されることを確認してください。
- [ ]  タイトルを51文字以上にして「次へ」をクリックし、「タイトルは50文字以内で入力してください」と表示されることを確認してください。
- [ ]  概要を501文字以上にして「次へ」をクリックし、「概要は500文字以内で入力してください」と表示されることを確認してください。

### **2.3 Step 2: セクション設定**:

**セクションの追加/削除/並び替え**:

- [ ]  「セクションを追加」ボタンで新しいセクションが追加されることを確認してください。
- [ ]  セクションが複数ある場合、各セクションの削除ボタンでセクションが削除されることを確認してください。
- [ ]  セクションが1つしかない場合、削除ボタンが無効化されることを確認してください。
- [ ]  ドラッグハンドルでセクションの並び順が変更できることを確認してください。

**バリデーションエラー**:

- [ ]  セクションタイトルを空欄にして「次へ」をクリックし、「すべてのセクションにタイトルを入力してください」と表示されることを確認してください。
- [ ]  セクションタイトルを51文字以上にして「次へ」をクリックし、「セクションのタイトルは50文字以内で入力してください」と表示されることを確認してください。

### **2.4 Step 3: 確認**:

- [ ]  入力した基本情報とセクション情報が正しく表示されることを確認してください。
- [ ]  「すぐに学習を開始する」チェックボックスのON/OFFで、作成後の学習ステータスが`in_progress`または`not_started`になることを確認してください。
- [ ]  「作成する」ボタンをクリックすると、学習内容が登録され、詳細ページにリダイレクトされることを確認してください。

### **2.5「キャンセル」ボタン**:

- [ ]  フォームに未保存の変更がある状態で「キャンセル」をクリックすると、確認モーダルが表示されることを確認してください。
- [ ]  確認モーダルで「破棄」を選択すると、変更が破棄されダッシュボードに戻ることを確認してください。

### **2.6 ローディング表示**:

- [ ]  学習内容作成中に「作成する」ボタンがローディング状態になることを確認してください。

### **2.7 APIエラーハンドリング**:

- [ ]  API通信でエラーが発生した場合、適切なエラーメッセージが表示されることを確認してください。
    - データ取得や更新に失敗した場合、条件に応じた適切な例外処理を改善する必要があります

---

## **3. 学習内容詳細**

### **関連ファイル**

コントローラー:

- **App\Http\Controllers\LearningContentController**:`index`
- **App\Http\Controllers\SectionController**:`index`
- **App\Http\Controllers\LearningSessionController**:`index`
- **App\Http\Controllers\SectionController**:`updateStatus`

**コンポーネント:**

- **resources/js/views/learning/LearningContentDetail.vue**

### 3.1 詳細情報の表示:

- [ ]  ダッシュボードから学習コンテンツカードをクリックして詳細ページ (`/learning/:id`) に移動し、タイトル、技術、ステータス、作成日、最終学習日、概要が正しく表示されることを確認してください。
- [ ]  進捗バーと進捗率（%）、完了セクション数/総セクション数、総学習時間が正しく表示されることを確認してください。

### 3.2 セクション一覧の表示:

- [ ]  登録されているセクションが一覧で表示され、各セクションのタイトルとステータスが正しく表示されることを確認してください。
- [ ]  セクションがない場合、「この学習コンテンツには、まだセクションが登録されていません。」と表示されることを確認してください。

### 3.3 セクションステータスの切り替え:

- [ ]  各セクションのチェックマークアイコンをクリックすると、ステータスが「学習中」と「完了」で切り替わることを確認してください。
- [ ]  ステータス切り替え後、進捗バーと進捗率がリアルタイムで更新されることを確認してください。

### 3.4 セクション記録一覧への遷移:

- [ ]  各セクションの項目をクリックすると、そのセクションの学習記録一覧ページ (`/learning/:id/section/:sectionId`) に遷移することを確認してください。

### 3.5 「個別レポート」ボタン:

- [ ]  「個別レポート」ボタンをクリックすると、個別レポートページ (`/learning/:id/progress`) に遷移することを確認してください。

### 3.6 「内容を編集」ボタン:

- [ ]  「内容を編集」ボタンをクリックすると、学習内容編集ページ (`/learning/:id/edit`) に遷移することを確認してください。

### 3.7 ローディング表示:

- [ ]  学習内容詳細の取得中にスピナーが表示されることを確認してください。

### 3.8 APIエラーハンドリング:

- [ ]  存在しない学習コンテンツIDでアクセスした場合など、適切なエラーメッセージが表示されることを確認してください。
    - APIからデータが取得できない場合の例外処理が不足していました。

---

## **4. 学習内容編集**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningContentController.php**: `show` - 指定されたIDの学習内容の詳細を取得します。
- **app/Http/Controllers/SectionController.php**: `index` - 指定された学習内容のセクション一覧を取得します。
- **app/Http/Controllers/SectionController.php**: `updateStatus` - セクションのステータスを更新します。
- **app/Http/Controllers/LearningSessionController.php**: `byContent` - 指定された学習コンテンツの学習記録一覧を取得します。

**Piniaストア:**

- **resources/js/stores/learningContent.js**: `fetchContents` - 学習内容一覧データをAPIから取得し、ストアに保存します。
- **resources/js/stores/sections.js**: `fetchSections` - 指定された学習内容のセクション一覧データをAPIから取得し、ストアに保存します。
- **resources/js/stores/learningSession.js**: `fetchLearningSessions` - 指定された学習コンテンツの学習記録一覧データをAPIから取得し、ストアに保存します。

**Composables:**

- **resources/js/composables/useLearningData.js**: `learningContents` - 学習内容データを提供します。`fetchContents`、`getRecordCountForSection`アクションを呼び出します。
- **resources/js/composables/learning/useSections.js**: `updateSectionStatus`、`normalizeStatus`、`toggleSectionComplete` - セクションのステータス更新ロジックを提供します。
- **resources/js/composables/ui/useLoading.js**: データ読み込み中のローディング状態を管理します。

**コンポーネント:**

- **resources/js/views/learning/LearningContentDetail.vue**: 学習内容の詳細情報、セクション一覧、進捗バーなどを表示します。
- **resources/js/layouts/DetailLayout.vue**: 学習内容詳細ページのレイアウトを提供します。
- **resources/js/components/common/LoadingSpinner.vue**: データ読み込み中に表示されるスピナーです。
- **resources/js/components/common/BaseButton.vue**: 「個別レポート」や「内容を編集」ボタンとして使用されます。
- **resources/js/components/common/buttons/BackButton.vue**: 前のページに戻るボタンです。
- **resources/js/components/common/Pagination.vue**: セクション一覧のページネーション機能を提供します。

### **4.1 既存情報の表示**:

- [ ]  学習内容詳細ページから「内容を編集」ボタンをクリックして編集ページ (`/learning/:id/edit`) に移動し、既存の学習内容情報がフォームに正しく表示されることを確認してください。
- [ ]  セクション情報も正しく表示され、並び順が維持されていることを確認してください。

### **4.2ウィザードフロー**:

- [ ]  ウィザード形式でステップが進行することを確認してください。

### **4.3 Step 1: 基本情報編集**:

- [ ]  技術、タイトル、概要、ステータスを変更し、「次へ」ボタンをクリックするとStep 2に進むことを確認してください。

**バリデーションエラー**:

- [ ]  新規作成時と同様のバリデーションエラーが発生することを確認してください。

### **4.4 Step 2: セクション設定**:

**セクションの追加/削除/並び替え**:

- [ ]  新しいセクションを追加できることを確認してください。
- [ ]  既存のセクションを削除できることを確認してください（ただし、最低1つのセクションは削除不可）。
- [ ]  セクションの並び順を変更できることを確認してください。

**バリデーションエラー**:

- [ ]  新規作成時と同様のバリデーションエラーが発生することを確認してください。

### **4.4 Step 3: 確認**:

- [ ]  変更された基本情報とセクション情報が、変更前後の差分を含めて正しく表示されることを確認してください。
- [ ]  「更新する」ボタンをクリックすると、学習内容が更新され、詳細ページにリダイレクトされることを確認してください。

**「キャンセル」ボタン**:

- [ ]  フォームに未保存の変更がある状態で「キャンセル」をクリックすると、確認モーダルが表示されることを確認してください。
- [ ]  確認モーダルで「破棄」を選択すると、変更が破棄され前のページに戻ることを確認してください。

### **4.5 ローディング表示**:

- [ ]  学習内容更新中に「更新する」ボタンがローディング状態になることを確認してください。

### **4.6 APIエラーハンドリング**:

- [ ]  API通信でエラーが発生した場合、適切なエラーメッセージが表示されることを確認してください。
    - データ取得や更新に失敗した場合、条件に応じた適切な例外処理を改善する必要があります

---

## **5. 学習内容の削除**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningContentController.php**: `destroy` - 指定された学習内容をデータベースから削除します。

**Piniaストア:**

- **resources/js/stores/learningContent.js**: `deleteContent` - 学習内容削除APIを呼び出し、ストアから該当学習内容を削除します。

**Composables:**

- **resources/js/composables/useLearningData.js**: `deleteLearningContent` - 学習内容削除処理を`learningContentStore`に委譲します。

**コンポーネント:**

- **resources/js/components/learning/LearningContentCard.vue**: 学習内容カードの三点リーダーメニューから削除アクションをトリガーします。
- **resources/js/components/common/ConfirmModal.vue**: 学習内容削除時の確認モーダルです。

### **5.1 正常な削除**:

- [ ]  ダッシュボードの学習コンテンツカードメニューから「削除」を選択してください。
- [ ]  確認モーダルが表示され、コンテンツのタイトルが正しく表示されることを確認してください。
- [ ]  確認モーダルで「削除」を選択すると、学習コンテンツが一覧から削除されることを確認してください。

### **5.2 関連データ削除の確認**:

- [ ]  削除した学習コンテンツに関連するセクションや学習記録がデータベースから削除されていることを確認してください。

### **5.3 ローディング表示**:

- [ ]  削除処理中にローディング表示が適切に行われることを確認してください。

### **5.4 APIエラーハンドリング**:

- [ ]  API通信でエラーが発生した場合、適切なエラーメッセージが表示されることを確認してください。
    - APIが実行できなかった場合の例外処理が不足していました

---

## **6. 学習内容の完了/再開**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningContentController.php**: `complete` - 指定された学習内容を完了状態に更新します。
- **app/Http/Controllers/LearningContentController.php**: `reopen` - 指定された学習内容を再開状態に更新します。

**Piniaストア:**

- **resources/js/stores/learningContent.js**: `completeContent` - 学習内容完了APIを呼び出し、ストアの学習内容を更新します。
- **resources/js/stores/learningContent.js**: `reopenContent` - 学習内容再開APIを呼び出し、ストアの学習内容を更新します。

**Composables:**

- **resources/js/composables/useLearningData.js**: `completeContent`、`reopenContent` - 学習内容の完了/再開処理を`learningContentStore`に委譲します。

**コンポーネント:**

- **resources/js/components/learning/LearningContentCard.vue**: 学習内容カードの三点リーダーメニューから完了/再開アクションをトリガーします。
- **resources/js/components/common/ConfirmModal.vue**: 完了/再開処理自体に確認モーダルは使用されていませんが、削除処理などで使用される汎用モーダルです。

### 6.1 学習内容の完了:

- [ ]  進捗率が100%の学習コンテンツのカードメニューから「完了にする」を選択してください。
- [ ]  ステータスが「完了済」に変わり、「完了した学習」セクションに移動することを確認してください。
- [ ]  進捗率が100%未満の学習コンテンツで「完了にする」を選択しようとすると、エラーメッセージが表示されるか、メニュー項目が表示されないことを確認してください。

### 6.2 学習内容の再開:

- [ ]  ステータスが「完了済」の学習コンテンツのカードメニューから「学習を再開」を選択してください。
- [ ]  ステータスが「学習中」に変わり、「進行中の学習」セクションに移動することを確認してください。

### 6.3 ローディング表示:

- [ ]  完了/再開処理中にローディング表示が適切に行われることを確認してください。
    - メニューが閉じると同時にダッシュボード表示が自動的に再計算される仕様のため、ローディング表示の実装は不要でした。

### 6.4 APIエラーハンドリング:

- [ ]  API通信でエラーが発生した場合、適切なエラーメッセージが表示されることを確認してください。
    - APIが実行できなかった場合の例外処理が不足していました
