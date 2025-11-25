## Backend理解（Controller→Model）

### 概要

学習記録APIは、CRUD操作に加えて、学習時間の集計や統計データの算出という重要な役割を持っています。
Controllerでデータの集計ロジックを実装している点が特徴的です。

**主要ファイル**:

```markdown
### Controller
@app/Http/Controllers/LearningSessionController.php

### Model
@app/Models/LearningSession.php

### Resource
@app/Http/Resources/LearningSessionResource.php

### Request
@app/Http/Requests/StoreLearningSessionRequest.php
@app/Http/Requests/UpdateLearningSessionRequest.php

### Policy
@app/Policies/LearningSessionPolicy.php

### Route
@routes/api.php

### Database
@database/migrations/2025_09_12_112014_create_learning_sessions_table.php
@database/seeders/LearningSessionSeeder.php

```

### 質問1: Controllerと集計ロジック

プロンプト

```markdown
### 質問1: Controllerと集計ロジック

LearningSessionControllerの実装について教えてください。

#### 確認したいこと
1. 通常のCRUD以外にどのようなメソッドがありますか？
2. `statisticsSummary`や`monthlyStatistics`などの集計ロジックはどこに記述されていますか？
3. なぜServiceクラスやRepositoryパターンを使わず、Controllerに直接記述しているのですか？

```

### 集計メソッドの実装

| メソッド | 役割 | 実装内容 |
| --- | --- | --- |
| `statisticsSummary` | 総学習時間、連続学習日数などのサマリー | UserモデルのリレーションとCarbonを使用した計算 |
| `monthlyStatistics` | 月ごとの学習時間推移 | `DATE_FORMAT`を用いたSQL集計 |
| `technologyStatistics` | 技術ごとの学習時間割合 | `DB::table`を用いたJoinと集計 |
| `dailyStatistics` | 日ごとの学習時間推移 | `DATE`関数を用いたSQL集計 |

### 実装コード例（statisticsSummary）

```php
public function statisticsSummary()
{
    $user = Auth::user();
    // リレーション経由でsum
    $totalMinutes = $user->learningSessions()->sum('study_minutes');

    // 複雑なロジック（連続学習日数）もController内に記述
    $studyDays = $user->learningSessions()
        ->selectRaw('DATE(studied_at) as date')
        // ...省略
        ->pluck('date');

    // ...連続日数計算ロジック

    return response()->json([
        'total_study_minutes' => (int) $totalMinutes,
        // ...
    ]);
}

```

### なぜServiceレイヤーを使わないのか

**判断理由**:

1. **開発スピードとシンプルさ**:
    - 現状の規模では、Controllerに記述しても可読性を著しく損なわないと判断
    - ファイル数を増やさず、ロジックの所在を明確にする（「統計APIのロジックはControllerにある」）
2. **Eloquent/DBファサードの強力さ**:
    - Laravelの機能を使えば、複雑なSQLも数行で書けるため、Serviceに切り出すほどのコード量にならない場合が多い
3. **将来的なリファクタリング**:
    - ロジックが肥大化した時点でService（例: `LearningStatisticsService`）に切り出す方針

### 私の理解

- 

### 質問2: Resourceクラスと日付フォーマット

プロンプト

```markdown
### 質問2: Resourceクラスと日付フォーマット

LearningSessionResourceでのレスポンス整形について教えてください。

#### 確認したいこと
1. マスターデータAPIとは異なり、Resourceクラスを使っている理由は？
2. 日付（studied_at, created_at）のフォーマットはどこで制御していますか？
3. Modelの`serializeDate`との関係は？

```

### Resourceクラスの使用理由

**理由**:

1. **リレーションの条件付きロード**: `whenLoaded`を使用して、N+1問題を避けつつ必要な場合のみ関連データ（学習内容、セクション）を含めるため
2. **フォーマットの統一**: 日時形式やnull値のハンドリングをAPI全体で統一するため

### 日付フォーマットの制御

**LearningSessionResource.php**:

```php
public function toArray(Request $request): array
{
    return [
        // ...
        // Resource内で明示的にフォーマット指定
        'studied_at' => $this->studied_at?->format('Y-m-d H:i:s'),
        'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        // ...
    ];
}

```

**Model (LearningSession.php)**:

```php
protected function serializeDate(DateTimeInterface $date): string
{
    // Resource使用時は無視されるが、直接json_encodeされた場合のために定義
    return $date->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s');
}

```

### 私の理解

- 

### 質問3: 認可（Authorization）

プロンプト

```markdown
### 質問3: 認可（Authorization）

学習記録の操作における権限チェックはどのように実装されていますか？

#### 確認したいこと
1. 他人の学習記録が見られないようになっていますか？
2. Policyクラスは使用していますか？

```

### 実装内容

**Controller**:

```php
public function show(LearningSession $learningSession)
{
    // Policyのviewメソッドを呼び出し
    $this->authorize('view', $learningSession);
    // ...
}

```

**LearningSessionPolicy**:

- `view`, `update`, `delete`: `$user->id === $learningSession->user_id` をチェック
- これにより、IDを知っていても他人の記録にはアクセスできない（403 Forbidden）

### 私の理解

### まとめ

プロンプト

```markdown
## 理解したいこと（Why）
- 統計ロジックをControllerに置くことのメリット・デメリットは？
- Resourceクラスを使うべき境界線はどこか？

```

**設計のポイント**:

- **統計ロジック**: 現状は「関連するコードの凝集度」を優先してControllerに配置。再利用性が必要になったらServiceへ移動。
- **Resourceクラス**: リレーションを含む複雑なレスポンスや、厳密なフォーマット指定が必要な場合に採用。

---

## Frontend理解（Store→Composable→Component）

### 概要

学習記録の管理は、単なるデータの保存だけでなく、学習コンテンツやセクションの進捗状況（統計情報）の更新もトリガーする必要があります。
そのため、Composableパターンを活用して複数のStoreを連携させています。

**主要ファイル**:

```markdown
### Store
@resources/js/stores/learningSession.js

### Composable
@resources/js/composables/learning/useLearningSessions.js
@resources/js/composables/useStudySessionForm.js

### Component
@resources/js/views/learning/StudySessionCreate.vue
@resources/js/views/learning/StudySessionEdit.vue
@resources/js/components/learning/LearningRecordCard.vue
@resources/js/components/learning/StudySessionFormFields.vue

```

### 質問1: Pinia Storeの実装（learningSessionStore）

プロンプト

```markdown
### 質問1: Pinia Storeの実装（learningSessionStore）

stores/learningSession.jsの実装を教えてください。

#### 確認したいこと
1. stateの構造は？
   - sessions（学習記録一覧）
   - statistics（統計データ）
   - loading/error
2. actionsの実装は？
   - fetchLearningSessions（一覧取得）
   - createLearningSession（作成）
   - updateLearningSession（更新）
   - deleteLearningSession（削除）
   - fetchStatistics（統計取得）
3. gettersの実装は？
   - sessionById（IDで取得）
   - sessionsByContentId/SectionId（フィルタリング）
   - totalStudyMinutes（合計時間）

```

### stateの構造

- **sessions**: 学習記録一覧（配列）。APIから取得したデータを保持。
- **statistics**: 統計データ（サマリー、月別、技術別、日別）。
- **loading**: APIリクエスト中の状態管理。
- **error**: エラーメッセージ。
- **errors**: バリデーションエラーオブジェクト（422エラー用）。

### actionsの実装

**主要アクション**:

- `fetchLearningSessions(params)`: APIから一覧取得し、`sessions`を更新。
- `createLearningSession(data)`: API作成呼び出し後、`sessions`に新規データを追加（再取得せず即時反映）。
- `updateLearningSession(id, data)`: API更新呼び出し後、`sessions`内の該当データを更新。
- `deleteLearningSession(id)`: API削除呼び出し後、`sessions`から該当データをフィルタリング削除。
- `fetchStatistics()`: 4つの統計API（サマリー、月別、技術別、日別）を`Promise.all`で並列取得。

### gettersの実装

- **sessionById**: ID指定で特定セッションを検索。
- **sessionsByContentId / sessionsBySectionId**: 特定のコンテンツ/セクションに紐づくセッションをフィルタリング。
- **totalStudyMinutes**: 現在ロードされているセッションの学習時間合計を計算。
- **hasSessionErrors**: バリデーションエラーの有無をチェック。

### 私の理解

### 質問2: Composableの責務分離

プロンプト

```markdown
### 質問2: Composableの責務分離

学習記録管理に関連するComposableについて教えてください。

#### 確認したいこと
1. useLearningSessionsの役割は？
   - 複数Store（Content/Section）との連携
   - ビジネスロジック（記録作成＋統計更新）
2. useStudySessionFormの役割は？
   - フォームデータ管理（reactive）
   - 日時フォーマットロジック
   - モーダル制御（日付/時間）
3. 責務分離の判断基準は？

```

### useLearningSessionsの役割

- **ドメインロジックの集約**: 学習記録の作成・更新・削除に伴う「副作用」（統計情報の更新など）を管理。
- **Store連携**: `learningSessionStore`だけでなく、`learningContentStore`や`sectionStore`のフェッチもトリガーし、データの整合性を保つ。

### useStudySessionFormの役割

- **UIロジックの分離**: フォームの状態管理、バリデーション実行、日付・時刻のフォーマット変換など、Viewに密結合なロジックを担当。
- **モーダル制御**: 日付選択・時間入力モーダルの開閉状態やデータ受け渡しロジックをカプセル化。
- **未保存変更検知**: `initialFormState`と比較して`hasUnsavedChanges`を判定。

### 責務分離の判断基準

| 層 | 責務 |
| --- | --- |
| Store | データ永続化、API通信、グローバル状態管理 |
| useLearningSessions | ドメイン操作（記録する、削除するなど）とそれに伴う複数リソースの整合性管理 |
| useStudySessionForm | 特定のUI（フォーム）に閉じた状態管理とプレゼンテーションロジック |

### 私の理解

- 

### 質問3: 学習記録作成・編集フローの実装

プロンプト

```markdown
### 質問3: 学習記録作成・編集フローの実装

StudySessionCreate.vue / StudySessionEdit.vueの実装について教えてください。

#### 確認したいこと
1. フォームの初期化プロセスは？
   - クエリパラメータ（section_id）の処理
   - 編集時のデータロード
2. バリデーションとエラーハンドリングは？
   - クライアントサイド（validators/studySessionValidator.js）
   - サーバーサイド（422エラー）の表示
3. 日時入力のUX実装は？
   - DatePickerModal / TimeInputModalとの連携
   - 文字列（ISO）とDateオブジェクトの変換

```

### フォームの初期化プロセス

- **作成時**: `useStudySessionForm`の`initializeForm`で初期値を設定。URLクエリパラメータに`section_id`があれば初期選択状態にする。
- **編集時**: `onMounted`でデータをフェッチし、取得したデータでフォームを初期化。

### バリデーションとエラーハンドリング

- **クライアントサイド**: 送信前に`validateStudySessionForm`を実行し、`validationErrors`を表示。
- **サーバーサイド**: 422エラー発生時、`sessionStore.errors`からメッセージを取り出し、各フィールドの下に表示。

### 日時入力のUX実装

- **データ構造**: フォーム上はISO文字列（`YYYY-MM-DDTHH:mm`）で保持。
- **表示**: `Intl.DateTimeFormat`を用いて「2025年08月26日」のように整形して表示。
- **入力**: モーダルコンポーネント（`DatePickerModal`, `TimeInputModal`）を使用し、選択結果をISO文字列に再構築してフォームに反映。

### 私の理解

### 質問4: 学習記録カードと削除フロー

プロンプト

```markdown
### 質問4: 学習記録カードと削除フロー

LearningRecordCard.vueの実装について教えてください。

#### 確認したいこと
1. 表示内容の整形は？
   - 日時フォーマット（utils/dateFormatters）
   - メモの表示制御
2. 削除フローの実装は？
   - イベント発火（emit('delete')）
   - 親コンポーネントでの確認モーダル表示
   - 削除実行後のリスト更新

```

### 表示内容の整形

- **ユーティリティ活用**: `formatDateTime`, `formatMinutes` などの純粋関数を`utils/dateFormatters`からインポートして使用。
- **スロット活用**: `additional-info`スロットを提供し、親コンポーネント（一覧画面など）によって表示内容（学習内容名やセクション名など）を柔軟に変更可能。

### 削除フローの実装

1. **子（Card）**: 削除ボタンクリックで `emit('delete', record)` を発火。
2. **親（List）**: イベントを受け取り、`DeleteRecordConfirmModal`を表示。
3. **確認後**: モーダルの削除実行ボタンで `useLearningSessions.deleteStudySession` を呼び出し。
4. **更新**: Storeから削除され、リストから即座に消える（リアクティブ）。

### 私の理解

- 

---

## 統合理解と説明練習

---
