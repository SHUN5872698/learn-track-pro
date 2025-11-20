## Backend理解（Controller→Model）

### 概要

<aside>
⚠️

**Service層は未実装**

- Controller内に直接ビジネスロジックを記述している
- 2025年11月17日時点では仕様理解を優先し、時間があればリファクタリングに取り組むこととする
</aside>

**主要ファイル**:

```markdown
### Controller
@app/Http/Controllers/LearningContentController.php
@app/Http/Controllers/SectionController.php

### Model
@app/Models/LearningContent.php
@app/Models/Section.php

### Request
@app/Http/Requests/StoreLearningContentRequest.php
@app/Http/Requests/UpdateLearningContentRequest.php
@app/Http/Requests/BulkUpdateSectionsRequest.php

### Policies
app/Policies/LearningContentPolicy.php

### Route
@routes/api.php

### migrations
database/migrations/2025_09_12_101358_create_sections_table.php
```

### 質問1: Controller実装とビジネスロジック

プロンプト

```markdown
### 質問1: Controller実装とビジネスロジック

LearningContentControllerとSectionControllerの実装について教えてください。

#### 前提
- Service層は未実装
- Controller内に直接ビジネスロジックが記述されている

#### 確認したいこと
1. 各エンドポイントとControllerメソッドの対応は？
2. なぜController内に直接ビジネスロジックを書いているのか？
3. Controller内のビジネスロジックには何があるか？
4. 認可処理の実装は？（Gate::authorize()）
```

### エンドポイントとメソッドの対応

| Controller | エンドポイント | メソッド | 概要 |
| --- | --- | --- | --- |
| LearningContent | GET /api/learning-contents | index() | 一覧取得 |
|  | POST /api/learning-contents | store() | 新規作成 |
|  | PUT /api/learning-contents/{id}/complete | complete() | 完了 |
|  | PUT /api/learning-contents/{id}/reopen | reopen() | 再開 |
| Section | POST /api/sections | store() | セクション追加 |
|  | PUT /api/sections/{id}/status | updateStatus() | ステータス更新 |
|  | PUT /api/.../sections/bulk | bulkUpdate() | 一括更新 |

### なぜController内に直接ビジネスロジックを書いているのか

**判断理由**:

1. MVP段階での開発速度優先（スケジュール逼迫）
2. マスターデータAPI（Controller→Model直接）との一貫性
3. ビジネスロジックの複雑さが限定的（外部API連携なし）

### Controller内のビジネスロジック

**LearningContentController**:

- トランザクション管理（store: 学習内容+セクション同時作成）
- ステータス変更の条件判定（complete: 全セクション完了チェック、reopen: 完了状態チェック）
- Eager Loading（N+1問題対策: `with(\\\\\\\['technology.category', 'sections'\\\\\\\])`）

**SectionController**:

- トランザクション管理（store/destroy/updateStatus/bulkUpdate）
- `total_sections/completed_sections`の自動更新（increment/decrement）
- セクション一括更新の複雑なロジック（order一時退避でユニーク制約回避）
- 最低1セクション保持チェック（destroy/bulkUpdate）

### 認可処理（Gate::authorize()）

**実装内容**:

- `Gate::authorize('view', \\\\\\\$learningContent)`: 閲覧権限チェック
- `Gate::authorize('update', \\\\\\\$learningContent)`: 更新権限チェック
- ポリシー（LearningContentPolicy）で権限判定：`\\\\\\\$user-\\\\\\\>id === \\\\\\\$learningContent-\\\\\\\>user_id`

**判断基準**:

- ユーザーは自分の学習内容のみ操作可能
- 権限なしの場合、403 Forbiddenレスポンスを自動返却

### 私の理解

- API実装時にキャパオーバーで動くものを優先し、ビジネスロジックの切り分けは後回しにした
- findOrFailは存在しないレコードへのアクセス時に404を自動返却（RESTful APIの設計原則）
- トランザクション管理でデータ整合性を保証（学習内容+セクションの原子性）
- Policyは「ユーザーに紐づいた内容のみ操作可能」を実装（認可処理）

### 質問2: トランザクション管理とデータ整合性

プロンプト

```markdown
### 質問2: トランザクション管理とデータ整合性

Controller内のトランザクション処理について教えてください。

#### 確認したいこと
1. どこでトランザクション管理を使っているか？
2. なぜトランザクションが必要なのか？
3. トランザクション内でincrement()/decrement()を使う理由は？
4. エラー時のロールバック処理は自動？手動？
```

### トランザクション使用箇所

**LearningContentController**:

- store(): 学習内容+セクション同時作成

**SectionController**:

- store(): セクション作成+total_sections更新
- destroy(): セクション削除+統計情報更新
- updateStatus(): ステータス変更+completed_sections更新
- bulkUpdate(): セクション一括更新（削除/更新/新規作成+統計情報再計算）

### なぜトランザクションが必要か

**理由**:

1. 複数テーブルへの書き込みの原子性保証（全成功 or 全失敗）
2. 学習内容とセクションは必ずセットで存在すべき（データ整合性）
3. エラー時の自動ロールバックでデータ不整合を防止

### increment/decrementを使う理由

**利点**:

1. 競合状態の回避（読み込みと書き込みをアトミックに実行）
2. SELECT不要でパフォーマンス向上
3. total_sections/completed_sectionsと実数の整合性を保証

**例外**:

- bulkUpdate()ではcount()で再計算（複雑な一括操作のため確実性を優先）

### ロールバック処理

**自動実行**:

- `DB::transaction`のクロージャ内で例外発生時、自動ロールバック
- 正常終了時は自動コミット
- 手動で`DB::rollBack()`を呼ぶ必要なし

### 私の理解

- 学習内容とセクションの整合性担保のためトランザクション必須
- increment/decrementはアトミック操作で競合状態を回避（DBから取得せず効率的）
- Laravelの自動ロールバック機能でエラー時の整合性を保証

### 質問3: バリデーションとエラーハンドリング

プロンプト

```markdown
### 質問3: バリデーションとエラーハンドリング

学習内容管理のバリデーションルールについて教えてください。

#### 確認したいこと
1. StoreLearningContentRequest/UpdateLearningContentRequestの内容は？
2. Controller内のビジネスルールチェックは？
3. BulkUpdateSectionsRequestのバリデーションは？
4. エラーレスポンスの形式は？
```

### FormRequestバリデーション

**StoreLearningContentRequest（新規作成）**:

- technology_id: 必須、整数、technologiesテーブルに存在
- title: 必須、最大50文字
- description: 任意、最大500文字
- sections: 必須配列、最低1つ、各タイトル最大50文字
- startImmediately: 真偽値

**UpdateLearningContentRequest（更新）**:

- technology_id/title/description: sometimes（送信時のみ検証）
- status: sometimes、not_started/in_progress/completedのいずれか

**BulkUpdateSectionsRequest（一括更新）**:

- sections: 必須配列、最低1つ（id/title/order）
- deleted_section_ids: 任意配列（削除対象のID）

### Controller内のビジネスルールチェック

**complete()**:

- 全セクション完了チェック（completed_sections == total_sections）
- 未完了の場合422エラー

**reopen()**:

- 完了状態チェック（status == 'completed'）
- 完了していない場合422エラー

**destroy()（Section）**:

- 最低1セクション保持チェック（sections()->count() > 1）
- 違反時422エラー

### エラーレスポンス形式

**422 Unprocessable Entity**:

- FormRequest失敗時に自動返却
- レスポンス形式: `\\\\\\\{"message": "...", "errors": \\\\\\\{"field": \\\\\\\["error"\\\\\\\]\\\\\\\}\\\\\\\}`
- Controller内の手動エラーも422で統一

### 私の理解

- FormRequestで入力値検証、Controller内でビジネスルール検証の2段階
- 422エラーで統一されたエラーハンドリング

### 質問4: ModelとリレーションとEager Loading

プロンプト

```markdown
### 質問4: ModelとリレーションとEager Loading

LearningContentモデルとSectionモデルの実装について教えてください。

#### 確認したいこと
1. LearningContentとSectionのリレーション定義は？
2. LearningContentと他モデルのリレーションは？
3. Eager Loadingの実装は？
4. total_sections/completed_sectionsの更新方法は？
5. Accessorの実装は？（あれば）
```

### LearningContentとSectionのリレーション

**リレーション定義**:

- LearningContent → Section: hasMany（1対多）
- Section → LearningContent: belongsTo（多対1）
- マイグレーション: `onDelete('cascade')`で親削除時に子も自動削除

### LearningContentと他モデルのリレーション

**定義されているリレーション**:

- User（作成者）: belongsTo（多対1）
- Technology（使用技術）: belongsTo（多対1）
- LearningSession（学習記録）: hasMany（1対多）

### Eager Loadingの実装

**使用箇所**:

- index(): `with(\\\\\\\['technology.category', 'sections'\\\\\\\])`
- show(): `load('technology.category', 'sections')`

**N+1問題を避ける理由**:

- Eager Loadingなし: 1 + N(technology) + N(category) + N(sections) = 最大1 + 3N回のクエリ
- Eager Loadingあり: 4回のクエリ（学習内容、technology、category、sections）
- N=100の場合: 301回 vs 4回の差（パフォーマンス大幅改善）

### total_sections/completed_sectionsの更新方法

**increment/decrementの使用**:

- store()/destroy()/updateStatus()で使用
- アトミック操作で競合状態を回避（質問2で詳細確認済み）

**count()による再計算**:

- bulkUpdate()で使用
- 複雑な一括操作後の確実な整合性保証

### Accessorの実装

**現状**: 実装なし（progress_percentage等）

**理由**:

- データ加工の責務は原則Vue側に持たせる方針
- API側は生データを返し、表示ロジックはフロント側で処理

### 私の理解

- カウンター方式（total_sections/completed_sections）はパフォーマンス最適化のため採用（毎回sectionsテーブルからcount()するより効率的）
- データ加工は原則Vue側だが、パフォーマンス影響がある場合はAPI側での加工も検討する柔軟性を持つ

### 質問5: セクション一括更新の複雑なロジック

プロンプト

```markdown
### 質問5: セクション一括更新の複雑なロジック

PUT /api/learning-contents/{learningContentId}/sections/bulkの実装について教えてください。

#### 確認したいこと
1. なぜ「一時的に退避」が必要なのか？
2. 既存セクション更新と新規作成の判別方法は？
3. 削除前チェックの実装は？
4. 統計情報の再計算方法は？
```

### 実装の4ステップ

**処理フロー**:

1. 削除処理（削除前チェック付き）
2. 既存セクションを一時的に退避（order + 10000）
3. 正しい位置に配置（既存更新 or 新規作成）
4. 統計情報更新（total_sections/completed_sectionsの再計算）

### なぜ「一時的に退避」が必要か

**理由**: orderカラムのユニーク制約回避

- マイグレーション: `learning_content_id`と`order`の複合ユニーク制約
- 問題：並び替え時に一時的に重複が発生（例：order=1→2、order=2→1の入れ替え）
- 解決策：`DB::raw('id + 10000')`で一時的に大きな値に退避

**注意点**:

- ID + 10000が将来的に既存orderと重複するリスクあり（長期運用時）
- サービス展開時はロジックの見直しが必要（[セクション一括更新のバリデーション改善（保留中）](https://www.notion.so/2af9d86c12e8804780cfcff57d90e827?pvs=21)に改善案を記録）

### 既存セクション更新と新規作成の判別

**判別方法**: `isset(\\\$sectionData\\\['id'\\\])`

- idあり → 既存セクション更新
- idなし（null） → 新規セクション作成

### 削除前チェック

**実装内容**:

```php
$remainingCount = $learningContent->sections()->count() - count($validated['deleted_section_ids']);
if ($remainingCount < 1) {
    abort(422, '最低1つのセクションが必要です。');
}
```

**注意点**:

- 現在の実装は「削除対象IDが実際に存在するか」を考慮していない
- 他の学習内容のセクションIDが含まれていても計算に含まれる
- バリデーション改善の余地あり（詳細は[セクション一括更新のバリデーション改善（保留中）](https://www.notion.so/2af9d86c12e8804780cfcff57d90e827?pvs=21)）

### 統計情報の再計算

**count()による再計算を採用**:

- `total_sections`: `\\\$learningContent-\\\>sections()-\\\>count()`
- `completed_sections`: `\\\$learningContent-\\\>sections()-\\\>where('status', 'completed')-\\\>count()`

**increment/decrementを使わない理由**:

- 一括操作は複雑（削除/追加/ステータス変更が同時発生）
- 個別にincrement/decrementを適用するとロジックが複雑化
- count()で最終状態を直接カウントする方が確実

### 私の理解

- ユニーク制約回避のため一時退避（order + 10000）を採用したが、サービス展開時は代替案の検討が必要
- count()再計算は複雑な一括操作での確実性を優先した判断（単純操作ではincrement/decrementが適切）

### 質問6: Service層リファクタリングの検討

プロンプト

```markdown
### 質問6: Service層リファクタリングの検討（将来の改善）

現在はController内にビジネスロジックがあるが、Service層導入を検討する場合について教えてください。

#### 確認したいこと
1. Service層を導入するメリットは？
2. どのロジックをServiceに移すべきか？
3. Service層の構成案は？
4. MVP完成後のリファクタリング優先度は？
```

### Service層を導入するメリット

**主なメリット**:

1. Controllerのスリム化（HTTPリクエスト処理に集中）
2. ビジネスロジックの再利用性（CLI、イベントリスナー等からも利用可能）
3. テスタビリティの向上（HTTPから独立したユニットテスト）
4. 関心の分離（Controller=HTTP、Service=ビジネスロジック、Model=データ）
5. 保守性と拡張性の向上（変更の影響範囲が限定的）

### Serviceに移すべきロジック

**移行対象**:

- 学習内容+セクション同時作成（LearningContentController@store()）
- セクション一括更新（SectionController@bulkUpdate()）
- ステータス変更の条件判定（complete()、reopen()）
- トランザクション管理（DB::transaction）
- increment/decrementによるカウンター更新

**判断基準**:

- 複数のモデル操作を含む
- ビジネスルールが含まれる
- トランザクション管理が必要
- 再利用される可能性がある

### Service層の構成案

**推奨構成（リソースごとに定義）**:

- `app/Services/Application/LearningContentService.php`：学習内容に関するビジネスロジック
- `app/Services/Application/SectionService.php`：セクションに関するビジネスロジック
- 必要に応じてサービス間でDI（依存性注入）

**参考**:

- Laravelコーディング規約（`.gemini/docs/development-processes/`[`laravel-coding-standards.md`](http://laravel-coding-standards.md)）に詳細記載
- ドメインサービス（`app/Services/Domain/`）は複雑なロジックで検討

### リファクタリング優先度

**高優先度**:

- bulkUpdate()：最も複雑なロジック（削除/更新/追加/並び替えが同時発生）
- store()：学習内容+セクション同時作成

**中優先度**:

- トランザクション管理のService層への集約

**低優先度**:

- シンプルなCRUD処理（update()、destroy()など）

### 私の理解

- 理論は理解しているが実践経験がないため、まずはトランザクション処理に絞ってロジック切り分けを試す
- Service層の構成はLaravelコーディング規約を基準に、実践時はAIと相談して方針決定
- 優先順位は機能拡張ロードマップで他タスクとのバランスを考慮して再定義する

### まとめ

プロンプト

```markdown
## 理解したいこと（Why）
- なぜ現在はController内にビジネスロジックがあるのか？
- トランザクション管理の重要性は？
- セクション一括更新の複雑さの理由は？
- Service層導入のタイミングは？
```

### なぜController内にビジネスロジックがあるのか

**判断理由**:

- MVP段階での開発速度優先（スケジュール逼迫）
- マスターデータAPIとの一貫性（Controller→Model直接）
- ビジネスロジックの複雑さが限定的（外部API連携なし）

**振り返り**:

- Requests層やコーディング規約を導入していたため、確認不足で問題ないと思い込んでいた
- 適切なコンテキスト提供とAIとの壁打ちで実装は成功したが、Service層の切り分けなど深いレベルのチェックが漏れていた
- 実務では「たまたまうまくいった」では不適切。AIには責任を持たせられないため、自身が責任を負う必要がある

### トランザクション管理の重要性

**重要性**:

- 学習内容とセクションのどちらかが失敗すると整合性が取れず、バグの温床になる
- 複数テーブルへの書き込みの原子性保証（全成功 or 全失敗）
- エラー時の自動ロールバックでデータ不整合を防止

**効率化**:

- increment/decrementでアトミック操作（競合状態回避、SELECT不要）
- bulkUpdate()ではcount()再計算（複雑な一括操作のため確実性優先）

### セクション一括更新の複雑さの理由

**理由**: orderカラムのユニーク制約回避

- `learning_content_id`と`order`の複合ユニーク制約により、単純なupdate文では制約違反エラー
- 一時退避（order + 10000）で重複を回避

**発見した課題**:

- 現在の実装は「削除対象IDが実際に存在するか」を考慮していない（[セクション一括更新のバリデーション改善（保留中）](https://www.notion.so/2af9d86c12e8804780cfcff57d90e827?pvs=21)）
- ID + 10000が長期運用時に重複するリスク（サービス展開時に見直し必要）

### Service層導入のタイミング

**導入計画**:

- 時期：CI/CD実装あたりで検討（他の優先タスクとのバランス考慮）
- 対象：まずはbulkUpdate()やstore()から（最も複雑なロジック）
- アプローチ：小さく段階的に進める（実践経験がないため）

**見積もりへの反映**:

- 次回作成時は理解とレビューの時間を見積もりに含める
- どの程度前段階で詰めてドキュメント化すべきかを検討

### 私の理解

- 開発速度優先でController内にロジックを配置したが、Service層の切り分けなど深いチェックが不足していた
- トランザクション管理とincrement/decrementでデータ整合性とパフォーマンスを両立し、ユニーク制約回避のため一時退避を採用
- AIとの協業で実装は成功したが、「たまたま」は実務では不適切。AIに責任を持たせられないため、自身が理解し責任を負う必要がある
- Service層は段階的に導入し、見積もりやドキュメント化の基準を今回の経験から確立する

---

## Frontend理解（Store→Composable→Component）

### 概要

学習内容管理はウィザード形式での作成・編集を採用。Pinia Store（データ層）→ Composable（ビジネスロジック層）→ Component（UI層）の責務分離を明確化。

**主要ファイル**:

```markdown
### Store
@resources/js/stores/learningContent.js
@resources/js/stores/sections.js

### Composable
@resources/js/composables/useLearningContentForm.js
@resources/js/composables/useWizardForm.js
@resources/js/composables/useLearningData.js

### Component
@resources/js/views/Reports.vue
@resources/js/views/learning/LearningContentCreate.vue
@resources/js/views/learning/LearningContentEdit.vue
@resources/js/views/learning/LearningContentDetail.vue
@resources/js/views/learning/StudyProgress.vue
@resources/js/components/learning/wizard/SectionListEditor.vue
@resources/js/components/learning/wizard/TechnologySelector.vue
@resources/js/components/learning/wizard/WizardNavigation.vue
@resources/js/components/learning/wizard/WizardStepIndicator.vue
```

### 質問1: Pinia Storeの実装（learningContentStore）

プロンプト

```markdown
### 質問1: Pinia Storeの実装（learningContentStore）

stores/learningContent.jsの実装を教えてください。

#### 確認したいこと
1. stateの構造は？
   - contents（学習内容一覧）
   - loading/error
2. actionsの実装は？
   - fetchContents（一覧取得）
   - createContent（作成）
   - updateContent（更新）
   - deleteContent（削除）
   - completeContent（完了）
   - reopenContent（再開）
3. gettersの実装は？
   - contentById（IDで取得）
   - inProgressContents（学習中のみ）
   - completedContents（完了済みのみ）
4. sectionsStoreとの連携は？
   - セクション一覧の取得タイミング
   - データの同期方法
```

### stateの構造

- **contents**: 学習内容一覧（配列）
- **pagination**: APIのメタ情報（current_page、total、per_page等）
- **loading**: APIリクエスト中の状態管理（グローバル管理で効率化）
- **error**: エラーメッセージ（単一文字列、ウィザード形式のため開発者向け）
- **filters / sort**: 将来の拡張用（現状未使用）

### actionsの実装

**主要アクション**:

- `fetchContents(page)`: API一覧取得、loading/pagination/contents更新
- `createContent(data)`: 作成後sectionsStoreに追加＆一覧再取得
- `updateContent(id, data)`: 更新後ストア内のcontentsを最新化
- `deleteContent(id)`: 削除後contentsからフィルタリング
- `completeContent(id)` / `reopenContent(id)`: ステータス変更（共通ヘルパー`_updateStatus`使用）
- `setFilter` / `setSort`: 将来の拡張用（現状fetchContentsと未連携）
- `updateContentStats`: sectionsStoreからの統計情報同期用

### gettersの実装

**contentById**:

- `state.contents`から指定IDの学習内容を検索（`Array.find()`）
- Piniaのキャッシュ機能：`state.contents`が変更されない限り結果をキャッシュ
- 詳細ページ遷移時の効率的なデータ取得に活用

### sectionsStoreとの連携

**相互作用**:

- `createContent`: 作成時にsectionsStoreにも追加（一貫性保持）
- `sectionsStore`からの更新: セクション変更後`fetchContents()`で統計情報更新
- `updateSectionStatus`: 手動計算でcontentsを直接更新（即座反映）

### 私の理解

- ウィザード形式のため、errorは単一文字列で開発者向けメッセージ（学習内容/セクションどちらに問題があるか判別用）
- setFilter/setSortは将来の拡張用（Dashboard.vueとは別ロジック）
- Piniaのキャッシュ機能で詳細ページ遷移を効率化
- 学習内容とセクションの整合性が重要で、どちらか更新時は両方を最新化

### 質問2: Composableの責務分離

プロンプト

```markdown
### 質問2: Composableの責務分離

学習内容管理に関連するComposableについて教えてください。

#### 確認したいこと
1. useLearningContentFormの役割は？
   - フォームデータ管理（reactive）
   - バリデーション実装
   - 初期化ロジック
2. useWizardFormの役割は？
   - ステップ管理（currentStep: 1→2→3）
   - 各ステップのバリデーション
   - 未保存警告（isDirty検知）
3. useLearningDataの役割は？
   - learningContentStoreとsectionsStoreの集約
   - なぜファサードパターンを使うのか？
   - 複数Storeの連携ロジック
4. 責務分離の判断基準は？
   - Store = API通信＋状態管理
   - Composable = ビジネスロジック＋UI状態＋複数Store連携
   - Component = UI表示＋イベントハンドリング
```

### useLearningContentFormの役割

- フォームデータ管理（reactive）とv-modelでの双方向バインディング
- 未保存変更検知（`hasUnsavedChanges`）によるページ離脱警告
- JSON文字列化でのディープ比較により、確認画面での差分表示にも活用

### useWizardFormの役割

- ステップ管理（`currentStep`）と遷移制御（nextStep/prevStep）
- 各ステップのバリデーション実行と`validationErrors`管理
- 未保存警告は`useLearningContentForm`の`hasUnsavedChanges`を利用（このComposable自体は持たない）

### useLearningDataの役割

**ファサードパターンの理由**:

1. コンポーネントの複雑性軽減（複数Storeとの直接やり取りを回避）
2. ビジネスロジックの再利用性向上
3. 関心事の分離（Store=データ永続化、Composable=UIとビジネスロジックの橋渡し）

### 責務分離の判断基準

| 層 | 責務 |
| --- | --- |
| Store | API通信、グローバル状態管理、データキャッシュ |
| Composable | UI固有のロジック、フォームデータ管理、複数Storeの集約・加工 |
| Component | UI表示、イベントハンドリング、Composableのメソッド呼び出し |

### 私の理解

- フォームデータ管理とウィザードステップ管理を分離し、責務を明確化
- `useLearningData`でStore間の整合性を保証するが、Store自身も直接連携する実装が混在（厳密な徹底は未達成）
- AI駆動開発で動作は確認済みだが、基礎理解（getter/actionの使い分け）は浅い自覚あり

### 質問3: ウィザード形式のフロー実装

プロンプト

```markdown
### 質問3: ウィザード形式のフロー実装

LearningContentCreate.vue/LearningContentEdit.vueのウィザードフローについて教えてください。

#### ウィザードの構成
- Step 1: 基本情報入力（TechnologySelector.vue）
- Step 2: セクション設定（SectionListEditor.vue）
- Step 3: 確認画面（親コンポーネント内）

#### 確認したいこと
1. ステップ間の遷移制御は？
   - 「次へ」ボタンのバリデーション実行
   - 「戻る」ボタンの動作（データ保持）
   - useWizardFormの役割
2. 各ステップのデータ保持方法は？
   - reactive vs ref の使い分け
   - ウィザード内でのデータ共有（provide/inject？）
3. 確認画面での差分表示（編集時）の実装は？
   - 変更前後の比較ロジック
   - 追加/更新/削除の検知
4. 未保存警告の実装は？
   - どのタイミングでモーダル表示？
   - データ変更の検知方法（isDirty）
   - ConfirmModal.vueの使用
```

### ステップ間の遷移制御

- **親コンポーネントが主導**: バリデーションやデータ操作は親が担当し、`useWizardForm`はステップ番号管理のみを行う
- **バリデーション**: `handleNext`で各ステップのバリデーションを実行し、成功時のみ`nextStep`を呼ぶ
- **データ保持**: フォームデータは親コンポーネントにあり、ステップ移動しても保持される

### 各ステップのデータ保持方法

- **Reactive**: フォームデータは`reactive`で管理し、v-modelとの親和性を確保
- **Props/Emits**: 親から子へデータを渡し、イベントで更新を受け取る（単方向データフロー）

### 確認画面での差分表示（編集時）

- **LCSアルゴリズム**: セクションの追加・削除・順序変更を正確に検知するために採用
- **比較ロジック**: 初期データ（`originalData`）と現在のフォームデータを比較して差分を表示

### 未保存警告の実装

- **検知方法**: `JSON.stringify`によるディープチェックで`hasUnsavedChanges`を判定
- **表示タイミング**: キャンセル操作時に変更がある場合のみモーダルを表示

### 私の理解

- 親コンポーネントがデータとロジックを統括し、`useWizardForm`や子コンポーネントは責務を限定している
- 複雑なセクション差分検知にLCSアルゴリズムを採用し、ユーザーに正確な変更履歴を提供するUXを実現している

### 質問4: セクション管理のUI実装

プロンプト

```markdown
### 質問4: セクション管理のUI実装

SectionListEditor.vueの実装について教えてください。

#### 確認したいこと
1. セクションの追加/削除の実装は？
   - 最低1つのセクション必須の制御
   - 削除ボタンの無効化ロジック（sections.length <= 1）
   - 配列操作（push/splice）
2. ドラッグ&ドロップの実装は？
   - 使用ライブラリ：VueDraggable
   - v-model でのデータバインディング
   - order（並び順）の自動更新
3. セクション一括更新のデータ構造生成は？
   - 新規セクション：{id: null, title, order}
   - 既存セクション：{id: number, title, order}
   - 削除セクション：deleted_section_ids配列
   - どのタイミングでこのデータを生成？
4. バリデーションの実装は？
   - タイトル必須チェック
   - 文字数制限（50文字）
   - learningContentValidator.jsの使用
```

### 私の理解

（GeminiCLIからの回答を貼り付け後、ここに記入してください）

### 質問5: 完了/再開機能の実装

プロンプト

```markdown
### 質問5: 完了/再開機能の実装

ダッシュボードの学習内容カードメニューから実行できる完了/再開機能について教えてください。

#### 確認したいこと
1. 完了にする機能の実装は？
   - 進捗率100%チェック（フロントエンド）
   - API呼び出し：PUT /api/learning-contents/{id}/complete
   - UIの更新（「進行中」→「完了した学習」へ移動）
   - ソート順の変更
2. 学習を再開する機能の実装は？
   - API呼び出し：PUT /api/learning-contents/{id}/reopen
   - UIの更新（「完了した学習」→「進行中」へ移動）
   - ステータス変更の反映
3. メニュー項目の表示/非表示制御は？
   - 進捗率100%未満：完了ボタン非表示
   - status = 'completed'：再開ボタン表示
   - computed プロパティの使用
4. ローディング表示とエラーハンドリングは？
   - メニュー操作中のローディング
   - APIエラー時のエラーモーダル表示
```

### 私の理解

（GeminiCLIからの回答を貼り付け後、ここに記入してください）

### まとめ

プロンプト

```markdown
### 理解したいこと（Why）
- なぜウィザード形式を採用したのか？（UX設計）
- Composableの責務分離の基準は？（Store vs Composable）
- セクション管理のUX設計の意図は？（並び替え、最低1つ必須）
- データフローの全体像は？（Component→Composable→Store→API→Backend）
```

### 私の理解

（GeminiCLIからの回答を貼り付け後、ここに記入してください）

---

## 統合理解と説明練習

---
