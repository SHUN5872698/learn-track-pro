# GitHub Issue作成

このプロンプトは、課題内容をGitHub Issueとして作成する `workflow:create-github-issue` の実行をガイドします。

## パラメータ:

### 必須
- `issue_summary`: Issue化する課題の概要（簡潔な説明でOK）
- `reference_files`: 参照するファイルパス（コード、ドキュメント）

### オプション（指定がなければAIが参照ファイルから自動判断）
- `template`: 使用するテンプレート（bug_report / feature_request）
- `labels`: 付与するラベル（カンマ区切り）
- `priority`: 優先度（high / medium / low）
- `issue_content`: 詳細な課題内容（指定がなければ参照ファイルから抽出）

## ステップ:

1. **引数の解析**: ユーザーのリクエストから各パラメータを抽出します。
2. **参照ファイルの読み込み**: 指定された `reference_files` の内容を読み込みます。
3. **自動判断（オプション未指定時）**: 参照ファイルの内容から以下を自動判断します：
   - 課題の詳細な説明
   - 該当コードの特定
   - 種別（バグ/脆弱性/機能改善/リファクタリング）
   - テンプレート（bug_report / feature_request）
   - ラベル
   - 優先度
4. **テンプレートの選択**: `template` に基づいて適切なIssueテンプレートを選択します。
5. **Issue内容の生成**: 以下の構造でIssue内容を生成します。
6. **GitHub MCPでIssue作成**: 生成した内容でIssueを作成します。

## 自動判断の基準:

### テンプレート判断
| 種別 | テンプレート |
|------|-------------|
| バグ、脆弱性、データ整合性の問題 | bug_report |
| 機能改善、新機能、リファクタリング | feature_request |

### ラベル判断
| キーワード・特徴 | ラベル |
|-----------------|--------|
| セキュリティ、認可漏れ、検証不足、他ユーザーのデータに影響 | `bug`, `security` |
| データ整合性、不整合、計算ミス | `bug` |
| リファクタリング、コード品質、Fat Controller | `refactoring` |
| 新機能、UI改善 | `enhancement` |
| ドキュメント改善 | `documentation` |
| 作業の停止 | `wontfix` |


### 優先度判断
| 基準 | 優先度 |
|------|--------|
| セキュリティ脆弱性、データ整合性に影響、他ユーザーのデータに影響しうる | `priority:high` |
| コード品質、一貫性の問題、将来的な保守性 | `priority:medium` |
| 軽微な改善、将来のリスク軽減 | `priority:low` |

## テンプレート別構造:

### Bug Report (`bug_report`)
```

**Describe the bug**

[課題の詳細説明]

**To Reproduce**

[再現手順または該当コード箇所]

1. ...
2. ...
3. ...

**Expected behavior**

[期待される動作]

**Current Code**

[該当コードの引用（参照ファイルから抽出）]

**Screenshots**

[該当する場合はスクリーンショットを追加。UIに関係ない場合は「N/A」]

**Desktop (please complete the following information):**

[該当する場合は記入。バックエンドのみの問題の場合は「N/A」]

- OS: [e.g. macOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Smartphone (please complete the following information):**

[該当する場合は記入。バックエンドのみの問題の場合は「N/A」]

- Device: [e.g. iPhone6]
- OS: [e.g. iOS8.1]
- Browser: [e.g. stock browser, safari]
- Version: [e.g. 22]

**Additional context**

- Target file: `[対象ファイル]`
- Discovery location: [発見場所]

**Suggested Fix**

[修正案と修正コード例]

```

### Feature Request (`feature_request`)
```

**Is your feature request related to a problem? Please describe.**

[問題の説明]

**Describe the solution you'd like**

[希望する解決策]

**Describe alternatives you've considered**

[検討した代替案]

**Current Code**

[現在のコード（参照ファイルから抽出）]

**Additional context**

[その他のコンテキストやスクリーンショット]

- Target file: `[対象ファイル]`

**Suggested Implementation**

[実装案と実装コード例]

```

## ラベル付与基準:

### 種別ラベル（必須）
- `bug`: バグ・脆弱性
- `enhancement`: 機能改善・新機能
- `refactoring`: リファクタリング
- `security`: セキュリティ関連
- `documentation`: ドキュメント改善
- `wontfix`: 作業の停止

### 優先度ラベル（必須）
- `priority:high`: セキュリティ脆弱性、データ整合性に影響
- `priority:medium`: コード品質、一貫性の問題
- `priority:low`: 保守性向上、将来のリスク軽減

## Suggested Fix / Suggested Implementation の基準:

### 含めるべき内容:
1. **修正方針の説明**: 何をどう修正するかの概要
2. **修正コード例**: 具体的なコード例（Before/After形式推奨）
3. **注意点**: 実装時の注意事項（あれば）

### コード例の書き方:
- 既存コードの問題箇所を明示
- 修正後のコードを完全な形で提示
- コメントで修正意図を補足

## セクション省略の判断基準:

### バックエンド/APIの問題の場合:
- **Screenshots**: 「N/A」と記入
- **Desktop/Smartphone**: 「N/A」と記入

### フロントエンド/UIの問題の場合:
- **Screenshots**: 可能な限りスクリーンショットを追加
- **Desktop/Smartphone**: 該当する環境情報を記入

## 出力形式:

Issue作成後、以下を報告します：
- Issue番号とURL
- 付与したラベル（自動判断した場合はその旨も記載）
- Issue本文のサマリー

## 使用例:

### シンプルな使い方（推奨）
```

workflow:create-github-issue

未来日付バリデーションの不整合をイシューとして登録してください

参照ファイル:

- app/Http/Controllers/LearningSessionController.php
- .gemini/docs/development-processes/application-logic-understanding/[06-report-statistics-logic.md](http://06-report-statistics-logic.md)

```

### 詳細を明示的に指定する場合（バックエンドのバグ報告）
```

workflow:create-github-issue

課題名: セクション一括更新の削除前チェック不足

種別: 脆弱性

詳細: bulkUpdate()の削除前チェックで「削除対象IDが実際に存在するか」を検証していない

対象ファイル: app/Http/Controllers/SectionController.php

参照ファイル:

- app/Http/Controllers/SectionController.php
- .gemini/docs/development-processes/application-logic-understanding/[03-learning-content-logic.md](http://03-learning-content-logic.md)

--template bug_report

--labels bug,security

--priority high

```

### 詳細を明示的に指定する場合（フロントエンドの機能改善）
```

workflow:create-github-issue

課題名: 時間入力コントロールの循環機能追加

種別: 機能改善

詳細: 時間入力で0のときに▼ボタンを押すと23に変更する循環機能を追加

対象ファイル: resources/js/components/common/TimeInputModal.vue

参照ファイル:

- resources/js/components/common/TimeInputModal.vue

--template feature_request

--labels enhancement

--priority low

```

### チャットの流れからIssue化
```

workflow:create-github-issue

先ほど議論した問題をIssue化してください

参照ファイル:

- [議論で言及されたファイル]

```

## リポジトリ設定:
- リポジトリ: SHUN5872698/learn-track-pro
- テンプレートパス:
[.github/ISSUE_TEMPLATE/bug_report.md](../../.github/ISSUE_TEMPLATE/bug_report.md)
[.github/ISSUE_TEMPLATE/feature_request.md](../../.github/ISSUE_TEMPLATE/feature_request.md)
