```markdown
# これまでの議論の要点まとめ（最新版：2025年10月14日更新）

## 背景・経緯

### プロジェクトの概要

- **プロジェクト名**: LearnTrack Pro - プログラミング学習管理プラットフォーム
- **開発期間**: 2025年9月3日〜10月14日（6週間）
- **開発者**: 藤井俊祐氏（転職活動用ポートフォリオ）
- **現在の状態**: ✅ MVP完成（2025年10月7日） → ✅ **Phase 0完全完了（2025年10月14日）**

### 技術スタック

- **Backend**: Laravel 12.x / Sanctum / Fortify / MySQL 8.0
- **Frontend**: Vue.js 3 (Composition API) / Pinia / Vue Router / TailwindCSS / Headless UI
- **構成**: モノリシックSPA（Laravel/Vue同一サーバー）

### 主要な制約

- TypeScript不使用、Bootstrapクラス禁止、jQuery禁止、Options API禁止
- 個人開発のため実装工数を最小限に

---

## 完了・確定事項

### プロジェクトの現在地

- ✅ MVP完成（2025年10月7日）
- ✅ **Phase 0完全完了（2025年10月14日）**
    - Phase 0.0: 401/419処理（2025年10月13日）
    - Phase 0.1-0.3: 403/404対応（2025年10月13日）
    - Phase 0.4-0.7: 500エラー対応（2025年10月14日）
- 📝 **Phase 0進捗: 100%完了（7/7タスク完了）**

### 実装済みファイル（Phase 0全体）

**フロントエンド（新規/変更）**:

- `resources/js/plugins/axios.js` - 全エラーハンドリングのインターセプター
- `resources/js/stores/errorModal.js` - エラーモーダル状態管理
- `resources/js/components/common/GlobalErrorModal.vue` - 500エラーモーダル
- `resources/js/views/NotFound.vue` - 403/404エラーページ（改修）
- `resources/js/App.vue` - GlobalErrorModalの配置
- `resources/js/stores/learningContent.js` - エラー再スロー対応
- `resources/js/views/Dashboard.vue` - onMountedエラーハンドリング

### 作成済みの主要ドキュメント

- `.gemini/docs/architectures/[api-error-handling-specification.md](http://api-error-handling-specification.md)` - APIエラーハンドリング実装仕様書
- `.gemini/docs/tests/[api-error-handling-manual-test-list.md](http://api-error-handling-manual-test-list.md)` - 手動テストリスト（全項目完了）
- その他手動テストドキュメント、機能拡張ロードマップ

---

## Phase 0: デプロイ前の必須修正（✅完了）

### 完了タスク

1. ✅ **Phase 0.0**: Axios Interceptor基本設定と401/419処理
2. ✅ **Phase 0.1**: NotFound.vueの改修
3. ✅ **Phase 0.2**: Axios Interceptorに403/404処理を追加
4. ✅ **Phase 0.3**: 403/404の動作確認
5. ✅ **Phase 0.4**: エラーモーダルストアの実装
6. ✅ **Phase 0.5**: GlobalErrorModalの実装
7. ✅ **Phase 0.6**: Axios Interceptorに500処理を追加
8. ✅ **Phase 0.7**: 500エラーの段階的検証（全テスト完了）

**Phase 0実装期間**: 2日（2025年10月13日〜14日）

---

## これまでの議論で確定した方針

### 1. Axios Interceptorの実装パターン（★最重要）

**循環参照の回避**:

- `plugins/axios.js`で`router.push()`は使わない
- 解決策：`window.location.href = '/login'`

**Axiosインスタンスの使い分け**:

| エンドポイント | インポート | 理由 |
| --- | --- | --- |
| `/api/*` | `import api from '@/plugins/axios'` | 401エラー時にログイン画面へリダイレクト必要 |
| `/fortify/*` | `import axios from 'axios'` | ログイン失敗で401は正常なレスポンス |
| `/sanctum/*` | `import axios from 'axios'` | CSRF Cookie取得、エラー処理不要 |

**重要な理解**:

- `import axios from 'axios'` と `import api from '@/plugins/axios'` は**全く別のもの**
- インポート元が違う = インスタンスが違う = インターセプターの有無が違う

---

### 2. APIエラーハンドリングの方針（全実装完了）

**対応するHTTPステータスコード**:

| ステータス | 対応方法 | 実装場所 | 状態 |
| --- | --- | --- | --- |
| **401/419** | ログイン画面へリダイレクト | Axios Interceptor | ✅完了 |
| **403** | NotFound.vue へ遷移（type=forbidden） | Axios Interceptor | ✅完了 |
| **404** | NotFound.vue へ遷移（type=notfound） | Axios Interceptor | ✅完了 |
| **422** | フォーム内にエラー表示 | 各コンポーネント | ✅完了 |
| **429** | 実装しない（個人利用アプリ） | - | N/A |
| **500** | GlobalErrorModal表示 | Axios Interceptor | ✅完了 |

**表示方法**:

- モーダルまたはコンポーネント表示で統一
- トースト通知は使用しない

**エラーフロー**:

```
API Error → Axios Interceptor
  ↓
401/419 → Login画面
403/404 → NotFound.vue
422 → Form Error
500+ → GlobalErrorModal
```

---

### 3. エラーモーダルストアの初期化タイミング（★重要）

**問題**: トップレベルで`useErrorModalStore()`を呼ぶとPinia未初期化エラー

**解決策**:

```jsx
// ❌ トップレベルでの呼び出し（NG）
import { useErrorModalStore } from '@/stores/errorModal';
const errorModalStore = useErrorModalStore(); // Pinia未初期化

// ✅ インターセプター内での呼び出し（OK）
if (status >= 500) {
  const errorModalStore = useErrorModalStore(); // この時点でPinia初期化済み
  errorModalStore.showError();
}
```

**原則**: ストアは使用する直前に初期化する

---

### 4. エラー再スローの重要性（★重要）

**問題**: ストアでエラーをキャッチして握りつぶすと、Axios Interceptorに到達しない

**正しいパターン**:

```jsx
// stores/learningContent.js
async fetchContents() {
  try {
    const response = await api.fetchLearningContents(params);
    this.contents = [response.data.data](http://response.data.data);
  } catch (error) {
    this.error = '学習内容の読み込みに失敗しました。';
    console.error('エラー:', error);
    throw error; // ← 必須：Interceptorへエラーを伝播
  } finally {
    this.loading = false;
  }
}
```

**理由**:

- モーダル表示（Interceptor）
- 呼び出し元へのエラー通知（throw error）
- 両方が必要

---

### 5. GlobalErrorModalの配置（★重要）

**問題**: レイアウト内に配置すると、親要素のスタイル影響を受ける

**正しい配置**:

```
<!-- App.vue -->
<template>
  <component :is="layout">
    <router-view />
  </component>
  <GlobalErrorModal /> <!-- レイアウトの外 -->
</template>
```

**理由**:

- z-index競合を回避
- 完全に独立した表示
- HeadlessUI Dialogの`z-index: 50`が正しく機能

---

### 6. Conventional Commits タイプの判断基準

**判断フロー**:

1. ユーザーは新しいことができるようになったか？ → YES: `feat`
2. 既存機能が正しく動作していなかったか？ → YES: `fix`
3. 外部から見た動作は変わらないか？ → YES: `refactor`

**Phase 0の判断**:

- Phase 0.0: `feat(auth)` - 401エラー時の自動リダイレクトは新機能
- Phase 0.1-0.3: `feat(error)` - 403/404エラーページは新機能
- Phase 0.4-0.7: `feat(error)` - 500エラーモーダルは新機能

---

### 7. ドキュメント管理の方針（★重要）

**活用フロー**:

1. **TasksDB（初期検討）**: 内容確定前の段階的更新
2. **AI対話**: 実装工程を具体化
3. **開発ドキュメント管理DB（最終文書化）**: 確定内容のみ保存

**ファイル命名規則**:

- 英語のケバブケース（ハイフン区切り）で統一
- 例: [`api-error-handling-specification.md`](http://api-error-handling-specification.md)

**Git管理**:

- TasksDBの内容はGit管理しない（変更履歴が多すぎる）
- 開発ドキュメント管理DBの確定版のみGit管理
- 相対パス: `.gemini/docs/{category}/{filename}.md`

---

## やってはいけないこと（★重要）

### 1. Axios Interceptorでrouter.pushを使う

**理由**: 循環参照が発生する

**正しい方法**: `window.location.href = '/login'`

---

### 2. 全てのaxiosインポートを統一する

**間違い**: useAuth.jsで全て`api`を使う

**正しい**: `/api/*`は`api`、`/fortify/*`と`/sanctum/*`は`axios`

---

### 3. ストアでエラーを握りつぶす

**間違い**:

```jsx
catch (error) {
  console.error(error);
  // throw error; がない
}
```

**正しい**:

```jsx
catch (error) {
  console.error(error);
  throw error; // 必須
}
```

---

### 4. トップレベルでストアを初期化

**間違い**:

```jsx
import { useErrorModalStore } from '@/stores/errorModal';
const errorModalStore = useErrorModalStore(); // Pinia未初期化
```

**正しい**:

```jsx
// 使用する直前に初期化
if (status >= 500) {
  const errorModalStore = useErrorModalStore();
}
```

---

### 5. GlobalErrorModalをレイアウト内に配置

**間違い**:

```
<template>
  <component :is="layout">
    <router-view />
    <GlobalErrorModal /> <!-- レイアウトの中 -->
  </component>
</template>
```

**正しい**:

```
<template>
  <component :is="layout">
    <router-view />
  </component>
  <GlobalErrorModal /> <!-- レイアウトの外 -->
</template>
```

---

### 6. HTTPステータスコードをユーザーに直接見せる

「403」「404」「500」という表示は避け、ユーザーフレンドリーなメッセージに変換

---

### 7. トースト通知の使用

視認性が低く、デザインに合わない。モーダル表示で統一

---

### 8. 部分的なデータ表示

いずれか1つでもAPI取得に失敗したら、ページ全体にエラー表示

---

### 9. Notionページの大規模一括編集

`replaceContent`は危険（復元機能なし）。`replaceContentRange`で該当箇所のみ変更

---

## 除外・後回し事項

- **ネットワークエラー（クライアント側）**: モノリシック構成のため発生可能性低
- **429エラー**: 個人利用アプリのため発生可能性極めて低
- **ページ遷移時の認証確認強化**: パフォーマンスとのトレードオフで現状維持
- **DELETE処理時のモーダル連携**: 実装フェーズで検討（500エラー時は削除確認モーダルを閉じてからエラーモーダル表示）
- **console.log/errorの削除**: Phase 1以降で検討（環境変数制御またはViteで自動削除）

---

## 次のアクション

### Phase 0完了後の選択肢（優先度順）

### 選択肢1: console.log/errorの整理（工数: 0.5-1日）

**方法**:

1. **環境変数制御**（推奨）
    - `utils/logger.js`を作成
    - 開発環境のみログ出力
2. **Viteで自動削除**
    - 本番ビルド時に`console.*`を完全削除
3. **手動削除**
    - 最もシンプルだが、再追加の手間

**判断**: 後回しでもOK（セキュリティ上の緊急性は低い）

---

### 選択肢2: Phase 1（UI/UX改善）へ進む（工数: 要見積もり）

**内容**:

- ローディング状態の改善
- エラーメッセージの改善
- アニメーション追加

---

### 選択肢3: Phase 2（レスポンシブ対応）へ進む（工数: 要見積もり）

**内容**:

- モバイル対応
- タブレット対応

---

### 選択肢4: Phase 3（デプロイ準備）へ進む（工数: 要見積もり）

**内容**:

- 環境変数設定
- ビルド設定
- デプロイ手順書作成

---

### 推奨アクション

**Phase 0完了を区切りとして、次の大きな方向性を決定する**

1. ポートフォリオとして十分な品質か評価
2. さらに改善する場合、何を優先するか決定
3. デプロイ準備を開始するか判断

---

## 特記事項

### プロジェクトの健全性評価

**進捗状況**: ✅ 良好

- MVP完成（2025年10月7日）
- Phase 0完全完了（2025年10月14日）
- 2日で7タスク完了（計画通り）

**技術的負債**: ✅ 最小限

- console.log/errorの整理は後回しでOK
- その他の負債なし

**ドキュメント充実度**: ✅ 優良

- 実装仕様書、テストリスト完備
- ディレクトリ構造、コーディング規約整備
- 使い分けガイド、実践フロー文書化

---

### 重要な教訓

### 1. エラーハンドリングの3原則

1. **再スロー**: ストアでキャッチしても`throw error`
2. **初期化タイミング**: ストアは使用直前に初期化
3. **配置**: GlobalErrorModalはレイアウトの外

---

### 2. デバッグの効率化

- エラーログから「エラーがどこで止まったか」を特定
- Axios Interceptorに到達しているか確認
- ストアで握りつぶされていないか確認

---

### 3. ドキュメント管理の実践

- TasksDB → AI対話 → 開発ドキュメント管理DB
- Git管理は確定版のみ
- 無駄な変更履歴を避ける

---

### 4. 個人開発の現実的な優先順位付け

- すべてのエラーに対応する必要はない
- 実際に発生する可能性が高いエラーのみ対応
- パフォーマンスとのトレードオフを意識
```
