#!/bin/bash
# 安全な読み取り専用コマンド集
# これらのコマンドは自動承認で実行可能

case "$1" in
  "git-status")
    git status -s
    ;;
  "git-diff")
    git diff --cached
    ;;
  "git-log")
    git log -n "${2:-10}" --pretty=format:'%s%n%b%n---' --no-merges
    ;;
  "git-diff-staged")
    git status -s && git diff --cached && git log -n 10 --pretty=format:'%s%n%b%n---' --no-merges
    ;;
  "cat-separated-concerns")
    cat .gemini/outputs/commit-message/separated-concerns.md
    ;;
  "cat-commit-message")
    cat .gemini/outputs/commit-message/commit-message-for-docs.md
    ;;
  *)
    echo "使用可能なコマンド:"
    echo "  git-status           - git status -s"
    echo "  git-diff             - git diff --cached"
    echo "  git-log [N]          - git log -n N"
    echo "  git-diff-staged      - status + diff + log"
    echo "  cat-separated-concerns"
    echo "  cat-commit-message"
    exit 1
    ;;
esac
