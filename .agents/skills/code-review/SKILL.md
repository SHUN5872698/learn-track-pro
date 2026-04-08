---
name: code-review
description: コードレビューを行う時に使用するスキル。「レビューして」「このコード見て」「PRチェックして」などのリクエストがあった場合に自動で適用される。
---

## レビュー手順（ステップ）

### Step 1: 差分の取得

`git diff` または指定されたPR・ファイルから、レビュー対象の差分（変更内容）を取得する。

### Step 2: 対象ファイルの特定・チェックリストの適用

差分に含まれるファイルがLaravel（PHP）かVue.js（JS/TS）か、あるいは両方かを判定し、`resources/review-checklist.md` を参照して対象種別のチェック項目を確認する。

- Laravel ファイル → Laravel チェックリストを適用
- Vue.js ファイル → Vue.js チェックリストを適用
- 共通項目（セキュリティ・パフォーマンス等）は常に確認する

### Step 3: 指摘事項の分類

各指摘を以下の分類に基づいてカテゴライズする（下記「指摘分類と優先度」参照）。

### Step 4: 結果の出力

### Step 4: 結果の出力

`examples/review-output-style.md` に定義されたフォーマットに従い、レビュー結果をチャットのレスポンスとして返す。
ファイルの生成・保存は一切行わない。

## 指摘分類と優先度

| 分類 | 絵文字 | 定義 | 対応の必要性 |
|------|--------|------|-------------|
| Critical | 🔴 | セキュリティリスク・バグ・動作不正を引き起こす問題 | 必須対応 |
| Warning | 🟡 | コーディング規約違反・可読性・保守性の問題 | 推奨対応 |
| Suggestion | 🟢 | ベストプラクティス・改善提案・任意の最適化 | 任意対応 |

### 分類の判断基準（プロジェクト固有）

- **🔴 Critical**: SQLインジェクション、認証バイパス、NullPointerException等の実害リスク
- **🟡 Warning**: Laravelのレイヤー責任分離違反（Controllerにビジネスロジック）、PSR-12違反、`strict_types=1` 未宣言、Options API使用（Vueでは禁止）
- **🟢 Suggestion**: N+1クエリの最適化提案、命名の改善、コメント追加など

> **注意**: Laravelのレイヤー責任分離（ControllerにService層を通すべきビジネスロジックが直接書かれている）は 🟡 Warning として扱う。現状Service層はプロフィール画像アップロードのみ導入済みであり、段階的分離を前提としているため。

## 参照ファイル

- **チェックリスト**: [`resources/review-checklist.md`](resources/review-checklist.md)
- **出力フォーマット・トーン見本**: [`examples/review-output-style.md`](examples/review-output-style.md)
- **Laravelコーディング規約**: [`.gemini/docs/development-processes/laravel-coding-standards.md`](../../../.gemini/docs/development-processes/laravel-coding-standards.md)
- **Vue.jsコーディング規約**: [`.gemini/docs/development-processes/vue-coding-standards.md`](../../../.gemini/docs/development-processes/vue-coding-standards.md)
