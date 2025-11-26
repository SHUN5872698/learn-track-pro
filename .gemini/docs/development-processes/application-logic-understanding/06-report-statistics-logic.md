## Backend理解（Controller→Model）

### 概要

レポート・統計機能は、ユーザーの学習モチベーションを維持するための重要な機能です。
複雑な集計処理を伴いますが、現状は開発速度と凝集度を優先し、Controller内にロジックを実装しています。
SQLの集計関数や日付操作関数を積極的に活用し、PHP側でのループ処理を減らす工夫が見られます。

**主要ファイル**:

```markdown
### Controller
@app/Http/Controllers/LearningSessionController.php

### Model
@app/Models/LearningSession.php
@app/Models/LearningContent.php
@app/Models/Technology.php

### Route
@routes/api.php

### Database
@database/migrations/2025_09_12_112014_create_learning_sessions_table.php

```

### 質問1: 統計ロジックの実装場所

プロンプト

```markdown
### 質問1: 統計ロジックの実装場所

LearningSessionControllerの統計系メソッドについて教えてください。

### 確認したいこと
1. `statisticsSummary`メソッドではどのような指標を計算していますか？
2. 連続学習日数の計算ロジックはどのように実装されていますか？
3. なぜ専用の`ReportController`やServiceクラスを作成しなかったのですか？

```

### 統計指標の計算

- **総学習時間**: `sum('study_minutes')`で単純集計。
- **完了コース数**: `LearningContent`モデルの`status`が`completed`のものをカウント。
- **平均学習時間**: 総学習時間 / 学習日数（ユニークな日付数）。0除算対策済み。
- **連続学習日数**: 最新の学習日から遡って、日付が連続しているかをPHP側でループチェック。

### 実装場所の判断

**理由**:

1. **リソースの関連性**: 統計情報は「学習記録（LearningSession）」の集合体であるため、同コントローラーに置くのが自然と判断。
2. **規模感**: 現状のメソッド数であれば、ファイルを分割するオーバーヘッドよりも、1箇所にまとまっているメリット（検索性）が大きい。
3. **将来性**: 統計機能がさらに複雑化（例：グラフの種類が増える、CSVエクスポート追加など）した段階で、`ReportController`や`StatisticsService`への切り出しを検討。

### 私の理解

- 

### 質問2: SQLによるデータ集計とパフォーマンス

プロンプト

```markdown
### 質問2: SQLによるデータ集計とパフォーマンス

`monthlyStatistics`や`technologyStatistics`でのデータ取得方法について教えてください。

### 確認したいこと
1. PHP側ではなくSQL側で集計を行っている理由は？
2. `technologyStatistics`でのJOINの使い方は？
3. 大量データになった場合のパフォーマンスへの配慮は？

```

### SQL側での集計

**実装**:

- `monthlyStatistics`: `DATE_FORMAT(studied_at, "%Y-%m")`でグルーピングし、`SUM(study_minutes)`で集計。
- `technologyStatistics`: `learning_contents`と`technologies`をJOINし、技術名ごとにグルーピングして集計。

**理由**:

- **メモリ効率**: 全レコードをPHPに取得してから計算すると、データ量増加に伴いメモリ不足になるリスクがあるため。
- **計算速度**: データベースエンジンの方が集計処理に最適化されているため。

### パフォーマンスへの配慮

- **インデックス**: `studied_at`や外部キー（`user_id`, `learning_content_id`）にインデックスが効いていることが前提。
- **期間制限**: `monthlyStatistics`や`dailyStatistics`では、`where`句で期間を絞り込むことでスキャン範囲を限定。

### 私の理解

- 

### 質問3: 最新学習記録の取得（サブクエリ）

プロンプト

```markdown
### 質問3: 最新学習記録の取得（サブクエリ）

`latestByContent`メソッドの実装について教えてください。

### 確認したいこと
1. 「学習内容ごとの最新の1件」をどのように取得していますか？
2. サブクエリを使用している意図は？
3. Eager Loading（`with`）は使われていますか？

```

### 実装内容

**クエリ構造**:

```php
LearningSession::whereIn('id', function ($query) {
    $query->select(DB::raw('MAX(id)'))
        ->from('learning_sessions')
        ->where('user_id', Auth::id())
        ->groupBy('learning_content_id');
})
->with(['learningContent', 'section'])
->get();

```

**解説**:

1. **サブクエリ**: `learning_content_id`ごとに最大の`id`（つまり最新のレコード）を抽出。
2. **メインクエリ**: そのIDリストに合致するレコードを取得。
3. **Eager Loading**: 結果に対して`learningContent`と`section`をロードし、N+1問題を回避。

### 私の理解

- 

---

## Frontend理解（Store→Component）

### 概要

レポート画面では、複数のAPIエンドポイントからデータを取得し、Chart.jsを用いて視覚的に表示します。
非同期処理の並列実行や、グラフ用データの整形ロジックが主なポイントです。

**主要ファイル**:

```markdown
### Store
@resources/js/stores/reports.js

### View
@resources/js/views/Reports.vue
@resources/js/views/learning/StudyProgress.vue

### Component
@resources/js/components/charts/BarChart.vue
@resources/js/components/charts/PieChart.vue
@resources/js/components/learning/LearningRecordCard.vue

### Composable
@resources/js/composables/useLearningData.js
```

### 質問1: Storeの構造とAPI連携

プロンプト

```markdown
### 質問1: Storeの構造とAPI連携

`stores/reports.js`の実装について教えてください。

### 確認したいこと
1. stateはどのように分割されていますか？
2. 複数の統計APIをどのように管理していますか？
3. エラーハンドリングの方針は？
```

### Stateの構造

- `statisticsSummary`: サマリー情報（オブジェクト）。
- `monthlyData`: 月別データ（配列）。
- `technologyData`: 技術別データ（配列）。
- `dailyData`: 日別データ（配列）。
- `loading`: 全体的なローディング状態。

### API連携

- 各統計データごとに独立したAction（`fetchStatisticsSummary`, `fetchMonthlyStatistics`など）を用意。
- 画面側で必要なデータだけを選択して取得できる設計。

### 私の理解

### 質問2: データの可視化と整形（Reports.vue）

プロンプト

```markdown
### 質問2: データの可視化と整形（Reports.vue）

`Reports.vue`でのデータ整形ロジックについて教えてください。

### 確認したいこと
1. APIから取得したデータを、Chart.jsが読める形式にどのように変換していますか？
2. `monthlyStudyData`での「データがない月の埋め合わせ」は行っていますか？
3. `techStudyData`での「その他」の集約ロジックは？

```

### データ整形ロジック

**月別データ（`monthlyStudyData`）**:

- **0埋め**: 直近6ヶ月分の月キーを生成し、APIデータが存在しない月は0分として埋める処理を実装。これによりグラフのX軸が途切れないようにしている。

**技術別データ（`techStudyData`）**:

- **上位表示**: データ数が多い場合、上位9件を表示し、それ以外を「その他」として合算するロジックをComputedプロパティ内で実装。円グラフが見づらくなるのを防いでいる。

### 私の理解

- 

### 質問3: 非同期データの並列取得

プロンプト

```markdown
### 質問3: 非同期データの並列取得

`onMounted`でのデータ取得処理について教えてください。

### 確認したいこと
1. 複数のAPIリクエストをどのように実行していますか？
2. `Promise.all`を使うメリットは？
3. ローディング表示の制御は？

```

### 実装内容

```jsx
await withLoading('reports-init', async () => {
  await Promise.all([
    reportStore.fetchStatisticsSummary(),
    reportStore.fetchMonthlyStatistics(6),
    reportStore.fetchTechnologyStatistics(),
    fetchLatestSessionsByContent()
  ]);
});

```

**解説**:

1. **Promise.all**: 4つの独立したAPIリクエストを並列に開始。
2. **メリット**: 全てのリクエストを直列（awaitの連続）で待つよりも、トータルの待ち時間が短縮される（最も遅いリクエストの時間で済む）。
3. **ローディング**: `withLoading`コンポーザブルを使い、全ての処理が完了するまでローディングスピナーを表示。

### 私の理解

- 

### 質問4: 個別レポート画面（StudyProgress.vue）の実装

プロンプト

```markdown
### 質問4: 個別レポート画面（StudyProgress.vue）の実装

`StudyProgress.vue`の実装について教えてください。

### 確認したいこと
1. `dailyStudyData`算出プロパティで、APIデータをChart.js形式に変換する際、タイムゾーンの問題（`T00:00:00`の付与など）をどのように解決していますか？
2. ページネーションの実装は、`Reports.vue`と比べてどのような違いがありますか？（`contentSessions`の使用など）
3. 削除モーダルの制御（`openDeleteModal`）で、二重送信防止のためにどのような工夫をしていますか？

```

### データの変換とタイムゾーン

**実装**:

```jsx
const date = new Date(item.date + 'T00:00:00');

```

**解説**:
APIから返ってくる日付文字列（例: "2025-11-26"）をそのまま`new Date()`すると、ブラウザによってはUTCとして解釈され、日本時間（JST）では前日になってしまうことがあります。
これを防ぐため、明示的に時刻部分（`T00:00:00`）を付与して、ローカルタイムとして扱われるようにしています。

### ページネーションとデータソース

- **Reports.vue**: ストア（`reportStore`）や複数のAPIからデータを集約して表示。
- **StudyProgress.vue**: 特定のコンテンツIDに紐づくセッションのみをAPIから取得し、`contentSessions`というローカルなrefで管理。ページネーションのロジック自体（`slice`を使う方法）は共通ですが、データソースのスコープが異なります。

### 削除時の二重送信防止

- `isSubmitting`フラグを使用。
- `openDeleteModal`内で`if (isSubmitting.value) return;`とすることで、削除処理中に再度モーダルを開こうとする操作をブロックしています。

### 私の理解

- 

### 質問5: Chart.jsラッパーコンポーネント（BarChart / PieChart）の深掘り

プロンプト

```markdown
### 質問5: Chart.jsラッパーコンポーネント（BarChart / PieChart）の深掘り

`BarChart.vue`と`PieChart.vue`の実装について、Chart.jsの挙動を中心に教えてください。

### 確認したいこと
1. `chartOptions`を`computed`にしている理由はなんですか？（静的なオブジェクトではダメなのですか？）
2. `BarChart.vue`でY軸の目盛り（`stepSize`, `suggestedMax`）を動的に計算しているロジックの意図は？
3. `PieChart.vue`で、凡例（Legend）やツールチップにパーセンテージを表示するために、どのようなカスタマイズを行っていますか？

```

### chartOptionsをcomputedにする理由

**理由**:
データ（`props.data`）が変化した際に、グラフのオプション（特にY軸の最大値やツールチップの内容など）も動的に再計算させるためです。
例えば、学習時間が0分の時と100時間の時では、適切なY軸のスケールが異なります。`computed`にすることで、データ更新に合わせてグラフの見た目を自動的に最適化できます。

### Y軸目盛りの動的計算（BarChart）

**ロジック**:

```jsx
if (maxValue <= 300) {
  stepSize = 60; // 1時間刻み
} else if (maxValue <= 600) {
  stepSize = 120; // 2時間刻み
} // ...

```

**意図**:
Chart.jsのデフォルト設定では、中途半端な数値（例: 1.5時間など）で目盛りが引かれることがあります。
学習時間は「時間単位」で把握したいため、データの最大値に応じて「1時間刻み」「5時間刻み」など、人間が見やすいキリの良い数値を強制的に設定しています。

### パーセンテージ表示のカスタマイズ（PieChart）

**実装（凡例）**:

```jsx
generateLabels: function (chart) {
  // ...
  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
  return {
    text: `${label} (${percentage}%)`,
    // ...
  };
}

```

**解説**:
Chart.js標準の凡例はラベル名しか表示しません。
`generateLabels`コールバックをオーバーライドし、データセットの合計値を計算した上で、各項目の割合（%）を算出し、ラベルテキストに結合して返しています。これにより、グラフを見なくても数値的な割合が把握できるようになります。

### 私の理解

- 

---

## 統合理解と説明練習

---
