# 1. ペルソナ
AIに特定の専門家としての役割を与えることで、回答の視点やトーンを固定。
## 最重要基本原則
**このプロジェクトに関するいかなるタスクを実行する前にも、Gemini CLIは必ず以下の記憶ファイルを読み込み、そこに記載されたルールを絶対的な制約として厳守すること。**
- **記憶ファイル**: `.gemini/memorys/gemini-cli-behavior-rules.md`

---

# 2. プロジェクト概要と目的
プロジェクトが何であるか、その目的やビジネスドメインを説明。
## 概要


---

# 3. 主要技術とスタック
使用している言語、フレームワーク、データベース、アーキテクチャ（マイクロサービス、MVCなど）を明記。

## 実装済み機能


## 技術スタック
- Backend:
- Frontend:
- Database:

## コーディング規約
- 

## アーキテクチャ
- 

## 開発規則
- 

## 主要コマンド
- 

---

# 4. コーディング規約とスタイルガイド（Coding Conventions & Style Guide）
フォーマット（インデント、1行文字数）、命名規則、コーディングスタイル（PEP 8等）、テスト要件を定義。
## コーディング規約
- 

---

# 5. 開発ワークフローとルール
依存関係の追加方法、コミットメッセージの規約、CI/CDパイプラインの場所など、開発プロセスに関するルールを記述。

## ルール
### 命名規則
#### .mdファイルの命名規則
- **ケバブケース (`kebab-case`)**: すべての `.md` ファイルは、小文字のケバブケースで命名する。
  - **例:** `pinia-migration.md`
- **理由**: Web開発の標準的な慣習に従い、URLとの親和性やプロジェクト全体の一貫性を高めるため。

## ワークフロー
### `workflow:separate-concerns`
**目的**: Gitのステージングされた変更を分析し、Conventional Commits仕様に基づいた論理的な関心事の塊に分離します。
**アクション**:
1.  プロンプト [.gemini/prompts/separate-concerns-prompt.md](./prompts/separate-concerns-prompt.md) を読み込み、その指示に従って関心の分離と出力を行います。

### `workflow:generate-commit-message`
**目的**: 指定された論理的な関心事の塊に基づき、Conventional Commits仕様に準拠したコミットメッセージを生成し、指定されたファイルに出力します。

以下の「関心事の塊」セクションに、`workflow:separate-concerns`で分離された論理的な関心事の塊（タイプ、説明、関連ファイルを含む）を貼り付けてください。

**アクション**:
1.  プロンプト [.gemini/prompts/commit-message-prompt.md](./prompts/commit-message-prompt.md) を読み込み、その指示に従ってコミットメッセージの生成とファイル出力を実行します。

### `workflow:generate-tasks`
**目的**: ユーザーからのゴールと現状分析に基づき、依存関係が明記された構造化タスクリストを生成します。
**アクション**:
1.  プロンプト [.gemini/prompts/generate-tasks-prompt.md](./prompts/generate-tasks-prompt.md) を読み込み、その指示に従ってタスクリストを生成します。
2.  生成されたタスクリストを `.gemini/outputs/generated-tasks.md` ファイルに出力します。

### `workflow:update-roadmap`
**目的**: 特定のマイルストーンの進捗状況を更新します。
**アクション**:
1.  プロンプト [.gemini/prompts/update-roadmap-prompt.md](./prompts/update-roadmap-prompt.md) を読み込み、その指示に従って `.gemini/docs/project-roadmap.md` を更新します。

### `workflow:guided-execution`
**目的**: ユーザーがタスクを段階的に実行できるよう、詳細な手順と説明を提供し、ユーザーの主体的な実行をサポートします。
**アクション**:
1.  プロンプト [.gemini/prompts/guided-execution-prompt.md](./prompts/guided-execution-prompt.md) を読み込み、現在のステップ、コマンド、説明などを埋め込んでユーザーに提示します。
2.  ユーザーがコマンドを実行し、結果を報告するのを待ちます。
3.  ユーザーの報告に基づいて、次のステップを提示します。

### `workflow:add-comments`
**目的**: WebアプリケーションでGeminiCLI以外の方法で生成・編集されたコードに対して、処理の意図が明確になるコメントを自動追加します。
**アクション**:
1.  プロンプト [.gemini/prompts/add-comments-prompt.md](./prompts/add-comments-prompt.md) を読み込み、その指示に従ってコメントの生成と追加を行います。
2.  指定されたファイルを読み込みます。
3.  コードの構造と処理内容を解析します。
4.  コメントが必要な箇所を特定し、1行の簡潔なコメントを生成・追加します。
5.  コメント追加後のファイルを出力します。
6.  適用したコメント基準をルールファイル用に出力します（オプション）。
**引数**:
- `<ファイルパス>`: コメントを追加するファイルのパス。複数指定可能。
- `--dry-run`: コメント追加のシミュレーションを行い、変更をファイルに書き込みません。
- `--export-rules`: 適用したコメント基準を`.gemini/memorys/gemini-cli-behavior-rules.md`に追記できる形式で出力します。

### `workflow:move-documents`
**目的**: 指定されたファイルを適切なディレクトリに移動させます。
**アクション**:
1.  プロンプト [.gemini/prompts/move-documents-prompt.md](./prompts/move-documents-prompt.md) を読み込み、その指示に従ってファイルの移動を実行します。

---

# 6. 制約
AIに「してほしくないこと」を明確に伝える。
