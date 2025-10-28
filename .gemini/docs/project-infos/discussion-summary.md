# これまでの議論の要点まとめ（最新版：2025年10月28日更新）

## 背景・経緯

### プロジェクトの概要

- **プロジェクト名**: LearnTrack Pro - プログラミング学習管理プラットフォーム
- **技術スタック**: Laravel 12 / Vue 3 (Composition API) / Pinia / MySQL 8.0
- **構成**: モノリシックSPA
- **現在の状態**: ✅ Phase 3-2完了（Docker / Docker Composeインストール）（10/28） → 🎯 **Phase 3-2残作業進行中（本番用Dockerファイル作成）** ← 今ここ

### 目的・目標

- 転職活動用ポートフォリオとして公開
- 実用的なDevOps経験の習得（Docker本番運用、CI/CD）
- コスト最適化を最優先

### 主要な制約

- TypeScript不使用、Bootstrap/jQuery/Options API禁止
- 個人開発のため実装工数を最小限に
- デプロイ優先、完璧主義を避ける
- **予算制約**: 月1,000-3,000円（転職活動期間3-6ヶ月）

---

## 完了・確定事項

### プロジェクトの現在地

- ✅ Phase 0-2: アプリケーション開発完了（10/14-22）
- ✅ Phase 3-1: デプロイ先選定完了（10/23）
- ✅ Phase 3-2: VPS環境構築完了（10/25-28）
- 🔄 **Phase 3-2: 本番用Dockerファイル作成準備中（10/28）**

### Phase 3-2完了内容（10/25-28）

- ✅ `【XserVPS】環境構築メモ①【Ubuntuの設定】`（SSH、セキュリティ、fail2ban）
- ✅ `【XserVPS】環境構築メモ②【MYSQLセットアップ】`（MySQL直接インストール、phpMyAdmin）
- ✅ `【XserVPS】環境構築メモ③【MYSQL自動バックアップ設定】`（cron、バックアップスクリプト、復旧手順）
- ✅ `【XserVPS】環境構築メモ④【Docker / Docker Composeのインストール】`（Docker 28.5.1、Docker Compose v2.40.2）

### 作成済みドキュメント

**Phase 3-1（デプロイ先選定）**:

- デプロイ先選定の詳細ドキュメント（AWS vs VPS比較）

**Phase 3-2（VPS環境構築）**:

- Ubuntu初期設定、MySQL直接インストール、MySQL自動バックアップ・復旧、Docker / Docker Composeインストール

---

## これまでの議論で確定した方針

### 1. Docker / Docker Composeインストールの方針（★新規・重要）

**パケットフィルター設定**:

- HTTP（80番）とHTTPS（443番）ポートを事前に開放
- SSH 22番ポートは閉じる（19000番に変更済み）

**インストール方針**:

- Docker公式リポジトリを使用
- Docker Compose v2（プラグイン形式）採用
- `docker compose`（ハイフンなし）コマンド使用

**Dockerコンテナ管理コマンドの使い分け**:

- `docker ps -a`: システム全体のコンテナ状態確認
- `docker compose ps -a`: Composeプロジェクトのコンテナのみ確認
- 判断基準: プロジェクト単位で管理する場合は`docker compose ps -a`

詳細: `【XserVPS】環境構築メモ④【Docker / Docker Composeのインストール】` 参照

### 2. MySQL自動バックアップの方針（★重要）

**バックアップ設定**:

- cronで毎日午前4時に自動実行
- `.my.cnf`でパスワード管理（セキュリティ強化）
- 7日間保持、古いファイルは自動削除

**復旧手順の最適化**:

- mysqldumpのSQLファイルには`DROP TABLE IF EXISTS`が含まれる
- **データベース初期化は不要** → 直接インポートで既存テーブルは自動削除・再作成
- 判断基準: mysqldumpの仕組みを理解し、不要な手順を排除

詳細: `【XserVPS】環境構築メモ③【MYSQL自動バックアップ設定】` 参照

### 3. デプロイ先選定の判断基準（★最重要）

**結論**: Xserver VPS 2GB（月1,150円）を採用

**AWS断念の理由**:

- EC2 + RDS: 月4,947円（予算の約3-5倍）
- RDSの機能（自動バックアップ等）はVPSでcron実装可能
- 小規模アプリではAWSの利点を活かせない

**判断基準**: コスト最適化 > クラウドブランド

### 4. ハイブリッド構成の採用（★最重要）

**構成**: LaravelのみDocker化、MySQLは直接インストール

**理由**:

- **LaravelのみDocker化**: CI/CDでイメージビルド自動化が目的
- **MySQLは直接インストール**: メモリ2GBでの安定性、過去の経験で複雑化して断念
- **AWS RDS構想と同じ発想**: 外部DBサービスとして扱う

### 5. VPS環境構築の方針（★重要）

**SSH認証の多層防御**:

- `PasswordAuthentication no` + `PermitEmptyPasswords no` + `KbdInteractiveAuthentication no`
- この3つがセットで鍵認証のみを強制

**socket activationの理解**:

- Ubuntu 24.04では22番ポート固定
- VPS用途では無効化が正解

**fail2banの役割**:

- パケットフィルター（静的防御）だけでは不十分
- fail2ban（動的防御）でブルートフォース攻撃を検知・ブロック

詳細: `【XserVPS】環境構築メモ①【Ubuntuの設定】` 参照

### 6. Phase 0-2の確定方針

**Axiosインスタンスの使い分け**:

- `/api/*` → `import api from '@/plugins/axios'`
- `/fortify/*`, `/sanctum/*` → `import axios from 'axios'`

**エラーハンドリングの3原則**:

1. 再スロー必須
2. ストアは使用直前に初期化
3. GlobalErrorModalはApp.vue直下

**レスポンシブ対応の2サイズ戦略**:

- モバイル（〜767px）とデスクトップ（768px〜）のみ
- `md:`使用、`sm:`は使用しない

---

## やってはいけないこと（★重要）

**Phase 3-2（VPS環境構築）**:

1. **SSHのパスワード認証を有効にする**
2. **rootユーザーで直接ログインを許可**
3. **socket activationを有効なままポート変更**
4. **fail2banなしでSSHポートを開放**
5. **MySQLのDocker化**
6. **バックアップ復旧時にデータベースを削除・再作成**

**Phase 0-2（アプリケーション開発）**:

1. **Axiosインスタンスの混同** - `/api/*`で`axios`を使う
2. **ストアでエラーを握りつぶす** - `throw error;`必須
3. **TailwindCSSの`sm:`使用** - `md:`のみ使用
4. **完璧主義** - リスクベースで優先度判断

---

## 技術選択と教訓

### 重要な教訓

1. **コスト最適化が最優先**: クラウドブランドよりも予算内で実現可能な構成
2. **過去の経験を活かす**: Docker全体化の複雑さを経験済み → ハイブリッド構成
3. **VPSで実装可能なAWS機能は多い**: cron、fail2ban等で代替可能
4. **技術的背景の理解が重要**: socket activation、fail2ban、mysqldump等の仕組み理解
5. **多層防御の考え方**: 一つの対策だけでは不十分
6. **ドキュメントの視覚化**: Mermaid図、表、calloutで理解度向上

---

## 次のアクション

### Phase 3-2残作業: 本番用Dockerファイル作成（優先度: ★★★★★）

**工数見積**: 1-2日

**作業内容**:

1. [本番用docker-compose.prod](http://本番用docker-compose.prod).ymlの作成
2. Laravel用Dockerfileの作成
3. Apache/PHP設定の最適化
4. Laravel デプロイ、動作確認

**ブランチ例**: `chore/docker-production-config`

### Phase 3-3: CI/CD構築（次のフェーズ）

**工数見積**: 2-3日

---

## 特記事項

### プロジェクトの健全性評価

- **進捗状況**: ✅ 優良（Phase 3-2 VPS環境構築完了）
- **技術的負債**: ✅ 最小限
- **ドキュメント**: ✅ 優良（VPS環境構築の全手順を詳細記録済み）

### デプロイまでのクリティカルパス

**約3-5日**:

- Phase 3-2残作業（本番Dockerファイル作成）: 1-2日
- Phase 3-3（CI/CD）: 2-3日
