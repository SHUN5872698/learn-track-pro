# 安全なコマンド実行スクリプト

## 概要

頻繁に使う読み取り専用コマンドを自動承認で実行するためのスクリプトです。

## 使用可能なコマンド

### Git関連（読み取り専用）

```bash
# Gitステータス確認
.gemini/scripts/safe-commands.sh git-status

# ステージングされた変更の差分確認
.gemini/scripts/safe-commands.sh git-diff

# コミットログ確認（デフォルト10件）
.gemini/scripts/safe-commands.sh git-log

# コミットログ確認（件数指定）
.gemini/scripts/safe-commands.sh git-log 20

# ステータス + 差分 + ログを一括確認
.gemini/scripts/safe-commands.sh git-diff-staged
```

### 出力ファイル確認

```bash
# 分離された関心事の確認
.gemini/scripts/safe-commands.sh cat-separated-concerns

# 生成されたコミットメッセージの確認
.gemini/scripts/safe-commands.sh cat-commit-message
```

## ワークフローでの使用例

### separate-concerns-prompt.md

```markdown
### 最重要ルール
- **必ず `.gemini/scripts/safe-commands.sh git-diff-staged` を実行し、ステージングされた変更内容を正確に把握すること。**
```

### commit-message-prompt.md

```markdown
## 最終アクション
1. コミットメッセージを生成
2. チェックリストで確認
3. **必ず**`.gemini/outputs/commit-message-for-docs.md` に出力
4. `.gemini/scripts/safe-commands.sh cat-commit-message` を実行し、内容が正しく書き込まれていることを確認
```

## 安全性について

### ✅ 自動承認で実行可能（SafeToAutoRun: true）

- `git status -s` - ファイル状態の確認のみ
- `git diff --cached` - ステージングされた変更の確認のみ
- `git log` - コミット履歴の確認のみ
- `cat` - ファイル内容の読み取りのみ

### ❌ 承認が必要（SafeToAutoRun: false）

- `git commit` - コミットの作成
- `git push` - リモートへの送信
- `git merge` - ブランチのマージ
- `git rebase` - コミット履歴の書き換え
- `git reset` - 変更の取り消し
- `git checkout` - ブランチの切り替え

## 新しいコマンドの追加方法

`safe-commands.sh` に新しいケースを追加します：

```bash
case "$1" in
  # 既存のコマンド...
  
  "新しいコマンド名")
    実行するコマンド
    ;;
esac
```

## トラブルシューティング

### 実行権限エラーが出る場合

```bash
chmod +x .gemini/scripts/safe-commands.sh
```

### コマンドが見つからない場合

プロジェクトルートから相対パスで実行してください：

```bash
.gemini/scripts/safe-commands.sh git-status
```
