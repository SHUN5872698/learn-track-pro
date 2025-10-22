# これまでの議論の要点まとめ（最新版：2025年10月22日更新）

## 背景・経緯

### プロジェクトの概要

- **プロジェクト名**: LearnTrack Pro - プログラミング学習管理プラットフォーム
- **技術スタック**: Laravel 12 / Vue 3 (Composition API) / Pinia / MySQL 8.0
- **構成**: モノリシックSPA
- **現在の状態**: ✅ MVP完成 → ✅ Phase 0完了 → ✅ Phase 1完了 → ✅ **Phase 2完了（10/22）** → 🎯 **Phase 3準備中**

### 主要な制約

- TypeScript不使用、Bootstrap/jQuery/Options API禁止
- 個人開発のため実装工数を最小限に
- デプロイ優先、完璧主義を避ける

---

## 完了・確定事項

### プロジェクトの現在地

- ✅ Phase 0: APIエラーハンドリング実装（10/14-15）
- ✅ Phase 1: UI/UXレイアウト改善（10/15）
- ✅ **Phase 2: レスポンシブ対応 完了（10/16-22）**
- 🎯 **Phase 3: デプロイ準備 次のフェーズ**

### Phase 2完了内容（10/16-22）

**レスポンシブ対応**: 12/12画面完了（100%）

- Dashboard、LearningContentDetail、LearningContentCreate/Edit
- StudySessionCreate/Edit、Reports、StudyProgress
- Profile、ProfileEdit、SectionStudyRecords
- 全レイアウトファイル（4ファイル）

**コード品質向上**:

- tailwindスタイルのクリーンアップ完了（@apply化、sm:統一、統計カード整理）
- コンソールログ扱いの方針確定・実装（Viteビルド時自動削除）
- 全レイアウトファイルの余白統一

### 作成済みドキュメント

- API設計、エラーハンドリング実装仕様書
- **コンソールログの扱い**（[`console-log-handling.md`](http://console-log-handling.md)）
- **tailwindスタイルのクリーンアップ**（Notionタスク）
- **レスポンシブ対応完了記録**（Notionタスク）
- ディレクトリ構造、要件定義書、機能拡張ロードマップ

---

## これまでの議論で確定した方針

### 1. Axiosインスタンスの使い分け（★最重要）

- `/api/*` → `import api from '@/plugins/axios'`（Interceptor有効）
- `/fortify/*`, `/sanctum/*` → `import axios from 'axios'`（Interceptor無効）

### 2. エラーハンドリングの3原則

1. **再スロー**: ストアでキャッチしても`throw error`必須
2. **初期化タイミング**: ストアは使用直前に初期化
3. **配置**: GlobalErrorModalはApp.vue直下

### 3. レスポンシブ対応の2サイズ戦略（★最重要）

- **モバイル**（〜767px）と**デスクトップ**（768px〜）の2段階のみ
- タブレットはデスクトップレイアウト適用（専用調整なし）
- TailwindCSS `md:` (768px) をメイン境界、**`sm:`は使用しない**
- **理由**: 工数対効果、デプロイ優先

### 4. @apply化による共通スタイル統一（★重要）

- **定義クラス**:
    - `.section-header`: ページタイトル（text-xl md:text-2xl）
    - `.section-subtext`: サブテキスト（text-xs md:text-sm）
    - `.error-container`: エラー表示
    - `.auth-header`: 認証ページタイトル（グラデーション）
    - `.form-label`, `.form-input-base/normal/error`: フォーム関連
    - `.text-counter/over`: 文字数カウンター
- **効果**: コード重複40%削減、デザイン一貫性確保

### 5. コンソールログの扱い（★重要・確定）

- **採用方針**: Viteのビルド時自動削除（環境変数制御は不採用）
- **実装**: `vite.config.js`に`terserOptions`追加（`drop_console: true`）
- **削除されるもの**: アプリケーションコード内の`console.*`のみ
- **削除されないもの**: ブラウザ自身が出力するログ・エラー
- **理由**: 工数最小（設定ファイル1箇所のみ）、検証不要、開発効率維持
- **確認タイミング**: Phase 3デプロイ直前に`npm run build`で確認（所要時間5分）
- 詳細: [`console-log-handling.md`](http://console-log-handling.md)参照

### 6. 全レイアウトファイルの余白統一（★最重要）

- **統一方針**:
    - モバイル: `max-w-md p-4`（幅448px、余白16px）
    - デスクトップ: 各レイアウトの特性に応じた`md:max-w-*`、`md:p-8`（余白32px）
- **対象ファイル**: DashboardLayout、DetailLayout、MultiCardDetailLayout、DefaultLayout
- **例外**: AuthLayout（中央配置の特殊な構造のため対象外）

### 7. DOM構成の統一

- **Detail/Card**: 同じDOM構造を維持、スタイリングで差別化
- **Card**: 常に縦並び（`md:flex-row`なし）、`text-xs`固定
- **Detail**: レスポンシブ（`md:flex-row`あり）、`text-sm md:text-base`

### 8. Pagination.vueの仕様変更

- **モバイル**: 1個表示（← [現在ページ] →）
- **デスクトップ**: 5個表示（← 1 2 3 4 5 →）
- JavaScript監視（`isMobile`）導入

### 9. 完璧主義を避ける例外判断（★重要）

- **原則**: 最小デバイスサイズ（375px）のみの視覚的問題は、機能に支障がなければ許容
- **判断基準**: デプロイ優先、工数対効果、影響範囲の限定性

### 10. ブランチ命名規則（Conventional Commits準拠）

- **設定ファイル変更**: `chore/`プレフィックス（例: `chore/vite-drop-console`）
- **機能追加**: `feat/`、**バグ修正**: `fix/`、**リファクタリング**: `refactor/`
- **注意**: `config/`は非公式のため使用しない

---

## やってはいけないこと（★重要）

1. **Axiosインスタンスの混同** - `/api/*`で`axios`を使う
2. **ストアでエラーを握りつぶす** - `throw error;`必須
3. **TailwindCSSの `sm:` 使用** - モバイル/デスクトップの2段階のみ（`md:`使用）
4. **デスクトップ表示を壊す** - 既存レイアウト維持必須
5. **レイアウトファイルの個別変更** - 複数ページに影響するため一括実施が原則
6. **完璧主義** - リスクベースで優先度判断
7. **ブランチ名に非公式プレフィックス使用** - `config/`等は使わず`chore/`を使用

---

## 技術選択と教訓

### 重要な教訓

1. **完璧主義を避ける**: デプロイ優先、理想より実用性
2. **工数対効果を常に意識**: 影響範囲が広い変更は慎重に
3. **設定ファイルの変更は最小工数で最大効果**: Viteの`terserOptions`で5分の設定が本番セキュリティを確保
4. **@apply化のタイミング**: レスポンシブ対応完了後が効率的
5. **DOM構成統一の重要性**: Detail/Cardで同じ構造を維持
6. **レイアウトファイルの変更は一括実施**: 影響範囲を見極めてから実行

---

## 後回しにした事項

### Phase 2完了後

- 認証画面のレスポンシブ対応 → Phase 3完了後（工数: 0.5日、優先度低）

### Phase 4以降

- 環境変数によるログ制御 → 本番でログ一時有効化が必要になった場合に検討
- 削除アニメーション → 技術的制約により実装断念

---

## 次のアクション

### Phase 3: デプロイ準備（優先度: ★★★★★）

**工数見積**: 別途見積もり

**内容**:

1. **環境構築**
    - AWS/Azure環境選定・構築
    - データベース設定
    - 環境変数設定
    - SSL証明書設定
2. **CI/CD設定**
    - GitHub Actions等の設定
    - 自動デプロイパイプライン構築
3. **本番ビルド確認**
    - `npm run build`実行
    - console.log削除確認（`grep -r "console.log" public/build/assets/`）
    - ビルドファイルの検証
4. **本番環境テスト**
    - 全機能の動作確認
    - レスポンシブ表示確認
    - エラーハンドリング確認

**ブランチ例**:

- `chore/deployment-setup`
- `chore/ci-cd-config`
- `chore/production-build-test`

---

## 特記事項

### プロジェクトの健全性評価

- **進捗状況**: ✅ 優良（Phase 2完了、Phase 3準備完了）
- **技術的負債**: ✅ 最小限（@apply化で大幅削減、コンソールログ削除設定済み）
- **ドキュメント**: ✅ 優良（完備、最新方針も反映済み）

### デプロイまでのクリティカルパス

```
Phase 2完了（10/22） ← 今ここ
  ↓
Phase 3（デプロイ準備）
  - 環境構築
  - CI/CD設定
  - console.log削除確認（5分）
  - 本番環境テスト
  ↓
本番公開
```

**状態**: Phase 2完了、Phase 3準備完了、デプロイ可能な状態
