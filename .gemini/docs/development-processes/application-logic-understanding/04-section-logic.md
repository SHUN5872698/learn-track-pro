## Backend理解（Controller→Model）

### 概要

セクション管理は、学習内容（親）に従属するリソースとして設計されていますが、ステータス更新や削除などの操作は独立したエンドポイントを持っています。

**主要ファイル**:

```markdown
### Controller
@app/Http/Controllers/SectionController.php

### Model
@app/Models/Section.php

### Request
@app/Http/Requests/StoreSectionRequest.php
@app/Http/Requests/UpdateSectionRequest.php
@app/Http/Requests/UpdateSectionStatusRequest.php

### Route
@routes/api.php

```

### 質問1: セクション削除とデータの整合性

プロンプト

```markdown
### 質問1: セクション削除とデータの整合性

SectionControllerのdestroyメソッドについて教えてください。
- 学習記録（LearningSession）が存在するセクションを削除した場合、学習記録はどうなりますか？
- DBの外部キー制約（ON DELETE CASCADE）に依存していますか？それともアプリケーション側で制御していますか？
- 「最低1つのセクションが必要」というチェック以外に、削除をブロックする条件はありますか？

```

### 質問2: セクション単体のステータス更新ロジック

プロンプト

```markdown
### 質問2: セクション単体のステータス更新ロジック

SectionControllerのupdateStatusメソッドについて教えてください。
- ステータスを「完了」から「未完了」に戻した場合、親（LearningContent）のcompleted_sectionsはどのように更新されますか？
- 親のステータス（completedなど）への影響はありますか？自動的に未完了に戻りますか？
- completed_atカラムの扱いはどうなっていますか？（未完了に戻した時にnullになる？）

```

### 質問3: APIレスポンス構造とResourceクラス

プロンプト

```markdown
### 質問3: APIレスポンス構造とResourceクラス

SectionControllerのindexメソッドやstoreメソッドのレスポンスについて教えてください。
- API Resourceクラス（SectionResourceなど）を使用していますか？それとも直接配列を返していますか？
- その判断理由は何ですか？（マスターデータAPIと同様の理由？それとも別の理由？）
- レスポンスに学習記録（learning_records）を含めるケースはありますか？

```

---

## Frontend理解（Store→Component）

### 概要

セクションの状態は `sectionsStore` で管理され、`learningContentStore` とは独立してAPI通信を行いますが、データの整合性を保つために連携しています。

**主要ファイル**:

```markdown
### Store
@resources/js/stores/sections.js

### Component
@resources/js/views/learning/LearningContentDetail.vue
@resources/js/components/learning/SectionList.vue

```

### 質問1: sectionsStoreのデータ管理戦略

プロンプト

```markdown
### 質問1: sectionsStoreのデータ管理戦略

stores/sections.jsの実装について教えてください。
- fetchSectionsアクションで、既存のセクションリストをフィルタリングして置き換える実装（this.sections.filter...）になっているのはなぜですか？
- learningContentStoreにもsectionsが含まれている場合がありますが、なぜ独立したsectionsStoreが必要なのですか？
- 2つのストア間でデータの不整合が起きないようにどのような工夫をしていますか？

```

### 質問2: 詳細画面でのセクション操作とUI反映

プロンプト

```markdown
### 質問2: 詳細画面でのセクション操作とUI反映

学習詳細画面（LearningContentDetail.vueなど）でセクションを完了にした時の処理フローを教えてください。
- ユーザーがチェックボックスをクリックした際、sectionsStoreのどのアクションが呼ばれますか？
- APIレスポンスを待たずにUIを更新する「楽観的UI更新」は実装されていますか？
- セクション完了後、親の学習内容の進捗率（プログレスバー）はどのように再計算・更新されますか？

```

---

## 統合理解と説明練習

---
