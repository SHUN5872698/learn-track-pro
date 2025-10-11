このドキュメントは、LearnTrack Proのレポート・統計機能に関する手動テストケースを定義します。

## 相互リンク

[レポート・統計機能](https://www.notion.so/2859d86c12e880b085f2c5e1412c58f0?pvs=21) 

.gemini/docs/tests/manual/reports-manual-tests.md

---

## **1. 全体レポート**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningSessionController.php**:
    - `statisticsSummary`: 全体レポートの統計サマリーデータを取得するために利用されます。
    - `monthlyStatistics`: 月別学習時間グラフのデータを取得するために利用されます。
    - `technologyStatistics`: 技術別学習時間グラフのデータを取得するために利用されます。
    - `latestByContent`: 最近の学習活動（学習内容別）のデータを取得するために利用されます。
    - `destroy`: 学習記録の削除処理に利用されます。

**Piniaストア:**

- **resources/js/stores/auth.js**: ユーザーの認証状態を管理します。`Reports.vue`ではログイン状態の確認に利用されます。
- **resources/js/stores/reports.js**: レポート関連の統計データを管理します。`Reports.vue`では各種統計データ（サマリー、月別、技術別）の取得と表示に利用されます。
- **resources/js/stores/learningContent.js**: 学習コンテンツのデータを管理します。`Reports.vue`では`useLearningData`コンポーザブルを介して学習コンテンツのデータを取得しています。

**Composables:**

- **resources/js/composables/useLearningData.js**: 学習コンテンツや学習記録に関するデータと操作ロジックを集約します。`Reports.vue`では学習コンテンツの取得、学習記録の削除、最新学習記録の取得などに利用されます。
- **resources/js/composables/ui/useLoading.js**: ローディング状態を管理します。`Reports.vue`ではデータ取得中のローディング表示に利用されます。

**コンポーネント:**

- **resources/js/layouts/DashboardLayout.vue**: 全体レポートページのレイアウトを提供します。
- **resources/js/components/common/LoadingSpinner.vue**: データ読み込み中のスピナーを表示します。
- **resources/js/components/learning/DeleteRecordConfirmModal.vue**: 学習記録削除の確認モーダルです。
- **resources/js/components/learning/LearningRecordCard.vue**: 個々の学習記録をカード形式で表示します。
- **resources/js/components/common/Pagination.vue**: 学習記録一覧のページネーション機能を提供します。
- **resources/js/components/charts/BarChart.vue**: 月別学習時間を示す棒グラフを表示します。
- **resources/js/components/charts/PieChart.vue**: 技術別学習時間を示す円グラフを表示します。

**ユーティリティ:**

- **resources/js/utils/chartColors.js**: チャートの色を動的に生成するために利用されます。
- **resources/js/utils/dateFormatters.js**: 日付や時間を整形するために利用されます。

### 1.1 ページへのアクセス:

- [ ]  ログイン後、サイドバーの「学習レポート」をクリックして、全体レポートページ (`/reports`) に遷移することを確認してください。

### 1.2 統計サマリーの表示:

- [ ]  「総学習時間」、「完了コース数」、「平均学習時間/日」、「連続学習日数」の各統計情報が正しく表示されることを確認してください。
- [ ]  学習記録がない場合、各項目が「0」または「N/A」と表示されることを確認してください。

### 1.3 月別学習時間グラフ:

- [ ]  「月別学習時間 (直近6ヶ月)」の棒グラフが正しく表示されることを確認してください。
- [ ]  グラフのY軸ラベルが「時間」単位で表示され、ツールチップに「時間:分」形式で表示されることを確認してください。
- [ ]  学習記録がない場合、グラフが空または0で表示されることを確認してください。

### 1.4 技術別学習時間グラフ:

- [ ]  「技術別学習時間」の円グラフが正しく表示されることを確認してください。
- [ ]  グラフの凡例に技術名と割合（%）が表示され、ツールチップに「時間:分」形式で表示されることを確認してください。
- [ ]  学習記録がない場合、グラフが空または0で表示されることを確認してください。

### 1.5 最近の学習活動:

- [ ]  「最近の学習活動（学習内容別）」セクションに、各学習内容の最新の学習記録がカード形式で表示されることを確認してください。
- [ ]  各カードに日時、学習時間、メモ、調子、学習内容タイトル、セクションタイトルが表示されることを確認してください。
- [ ]  学習記録がない場合、「学習記録はまだありません。」と表示されることを確認してください。
- [ ]  学習記録カードの編集ボタン、削除ボタンが正しく機能することを確認してください。
    - 内容に学習内容名とセクション名がもれていた
- [ ]  学習内容タイトルまたはセクションタイトルをクリックすると、それぞれの詳細ページに遷移することを確認してください。

### 1.6 ページネーション:

- [ ]  「最近の学習活動」セクションで、学習記録が多数ある場合、ページネーションが表示され、ページ切り替えが正しく機能することを確認してください。

### 1.7 ローディング表示:

- [ ]  レポートデータの取得中にスピナーが表示されることを確認してください。

### 1.8 APIエラーハンドリング:

- [ ]  API通信でエラーが発生した場合、適切なエラーメッセージが表示されることを確認してください。
    - APIからデータが取得できない場合の例外処理が不足していました。

---

## **2. 個別レポート**

### **関連ファイル**

**コントローラー:**

- **app/Http/Controllers/LearningSessionController.php**:
    - `dailyStatisticsByContent`: `/api/learning-contents/{contentId}/statistics/daily` (GET) - 特定の学習コンテンツの日別統計データを取得するために利用されます。
    - `index`: `/api/learning-sessions` (GET) - 特定の学習コンテンツに紐づく学習記録一覧を取得するために利用されます。
    - `destroy`: `/api/learning-sessions/{id}` (DELETE) - 学習記録の削除処理に利用されます。

**Piniaストア:**

- **resources/js/stores/auth.js**: ユーザーの認証状態を管理します。`StudyProgress.vue`ではログイン状態の確認に利用されます。
- **resources/js/stores/learningContent.js**: 学習コンテンツのデータを管理します。`StudyProgress.vue`では`useLearningData`コンポーザブルを介して学習コンテンツのデータを取得しています。
- **resources/js/stores/sections.js**: セクションのデータを管理します。`StudyProgress.vue`では`useLearningData`コンポーザブルを介してセクションのデータを取得しています。

**Composables:**

- **resources/js/composables/useLearningData.js**: 学習コンテンツや学習記録に関するデータと操作ロジックを集約します。`StudyProgress.vue`では学習コンテンツの取得、学習記録の削除などに利用されます。
- **resources/js/composables/ui/useLoading.js**: ローディング状態を管理します。`StudyProgress.vue`ではデータ取得中のローディング表示に利用されます。

**コンポーネント:**

- **resources/js/layouts/MultiCardDetailLayout.vue**: 個別レポートページのレイアウトを提供します。
- **resources/js/components/common/LoadingSpinner.vue**: データ読み込み中に表示されるスピナーです。
- **resources/js/components/common/buttons/BackButton.vue**: 前のページに戻るボタンです。
- **resources/js/components/learning/LearningRecordCard.vue**: 個々の学習記録をカード形式で表示します。
- **resources/js/components/common/Pagination.vue**: 学習記録一覧のページネーション機能を提供します。
- **resources/js/components/learning/DeleteRecordConfirmModal.vue**: 学習記録削除時の確認モーダルです。
- **resources/js/components/charts/LineChart.vue**: 日別学習時間を示す折れ線グラフを表示します。

**ユーティリティ:**

- **resources/js/utils/dateFormatters.js**: 日付や時間を整形するために利用されます。

### 2.1 ページへのアクセス:

- [ ]  学習コンテンツ詳細ページまたはダッシュボードの学習コンテンツカードメニューから「レポート」を選択して、個別レポートページ (`/learning/:id/progress`) に遷移することを確認してください。

### 2.2 日別学習時間グラフ:

- [ ]  「日別学習時間」の折れ線グラフが正しく表示されることを確認してください。
- [ ]  グラフのX軸ラベルが日付で表示され、Y軸ラベルが「時間:分」単位で表示されることを確認してください。
- [ ]  ツールチップに「時間:分」形式で表示されることを確認してください。
- [ ]  学習記録がない場合、グラフが空または0で表示されることを確認してください。
- [ ]  今日の日付の学習記録がある場合、そのポイントが他のポイントと異なる色で表示されることを確認してください。

### 2.3 学習記録一覧:

- [ ]  「学習記録一覧」セクションに、その学習コンテンツに紐づく全ての学習記録がカード形式で表示されることを確認してください。
- [ ]  各カードに日時、学習時間、メモ、調子、セクションタイトルが表示されることを確認してください。
- [ ]  学習記録がない場合、「この学習コンテンツの学習記録はまだありません。」と表示されることを確認してください。
- [ ]  学習記録カードの編集ボタン、削除ボタンが正しく機能することを確認してください。
- [ ]  セクションタイトルをクリックすると、セクション別学習記録一覧ページに遷移することを確認してください。

### 2.4 ページネーション:

- [ ]  「学習記録一覧」セクションで、学習記録が多数ある場合、ページネーションが表示され、ページ切り替えが正しく機能することを確認してください。

### 2.5 「戻る」ボタン:

- [ ]  「戻る」ボタンをクリックすると、前のページ（通常は学習コンテンツ詳細ページ）に戻ることを確認してください。

### 2.6 ローディング表示:

- [ ]  レポートデータの取得中にスピナーが表示されることを確認してください。

### 2.7 APIエラーハンドリング:

- [ ]  API通信でエラーが発生した場合、適切なエラーメッセージが表示されることを確認してください。
    - APIからデータが取得できない場合の例外処理が不足していました。

---
