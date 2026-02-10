# GitHub Pull Request作成

このプロンプトは、PR内容を生成し GitHub MCP で Pull Request を作成する `workflow:create-github-pull-request` の実行をガイドします。

---

## パラメータ

### 必須

- `base_branch`: マージ先ブランチ
- `head_branch`: 変更元ブランチ

### 任意（指定がなければAIが自動判断）

- `pr_summary`: PR概要（1〜2文）
- `issue`: Issue番号またはURL
- `draft`: true/false（default: true）
- `labels`: 付与するラベル（CSV）
- `assignees`: アサイン先（CSV）
- `reviewers`: レビュワー（CSV）
- `link_issue`: refs/fixes（default: refs）
- `title`: PRタイトル
- `reference_files`: 参照ファイル（CSV）
- `body_mode`: feature/verification（default: feature）

---

## ステップ

### **1. 引数の解析**

- ユーザー入力から各パラメータを抽出します（未指定の値は空として扱う）。

### **2. テンプレートの読み込み（必須）**

- `.github/PULL_REQUEST_TEMPLATE/[feature.md](<http://feature.md>)` を読み込み、見出し構造を保持したまま本文を生成します。
- 追加・削除・順序変更はしません（空欄は埋めるか「N/A」で埋めます）。

### **3. 差分の把握（必須）**

- `base_branch` と `head_branch` の差分から、変更点を要約します。
- 変更点は「機能名・画面名・API名」で表現し、ファイルパスは本文に出しません。

### **4. Issueの読み込み（任意）**

`issue` が指定されている場合、Issue本文を読み込み、以下を抽出します：

- 背景（問題）
- 目的（解決策）
- 受け入れ条件
- スコープ外
- レビューで確認してほしい観点のヒント

### **5. 自動判断（オプション未指定時）**

差分とIssueの内容から以下を自動判断します：

- PRタイトル（Conventional Commitsのtype相当を推定して短く）
- ラベル（Conventional Commitsのタイプ体系に整合）
- Draft/通常（既定は Draft）
- Issueリンク方式（既定は `Refs`）

### **6. 本文生成（最重要）**

[`feature.md`](http://feature.md/) の各セクションを次の方針で埋めます。

**目的（Why）**

- IssueがあればIssueの問題を要約し、なければ差分から「何のための変更か」を1〜2文で書く。

**関連Issue**

- `link_issue=refs` の場合：`Refs #<issue番号>`
- `link_issue=fixes` の場合：`Fixes #<issue番号>`
- issueが未指定なら「N/A」。

**変更概要（What）**

- 最大3項目。成果ベース。細かい実装詳細は書かない。

**レビューしてほしいこと（Review Focus）**（変更箇所ベース）

次の4観点を、該当するものだけ具体的に書く。該当しない場合は「N/A」。

- バックエンド（API/バリデーション/保存処理）
- フロントエンド（UI/UX/状態管理）
- テスト（観点、正常系/異常系）
- CI（起動条件、対象テスト、実行時間）

**確認手順（How to verify）**

CIの確認と手動確認を再現可能な形で書く（最大3項目）。

検証PRの場合（body_mode=verification）は「CIの起動確認」を最優先にする。

**影響範囲（Impact）**

影響する画面・API・データを機能名で列挙。

**スコープ外（Not included）**

今回やらないことを明記（検証PRの場合は「マージしない」「Issueは閉じない」などもここに書く）。

**補足（Notes）**

判断に迷った点、リスク、次タスク化する事項を短く。

### **7. GitHub MCPでPR作成**

- 生成したタイトル・本文・ラベル等を使い、PRを作成します。
- Draft指定がある場合はDraftで作成します。

### **8. 出力**

PR作成後に以下を報告します：

- PR URL
- base/head、draftの設定
- 付与したラベル（自動判断した場合はその旨）
- Issueリンク方式（refs/fixes）
