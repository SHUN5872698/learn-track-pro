# これまでの議論の要点まとめ（最新版：2025年10月30日更新）

## 背景・経緯

### プロジェクトの概要

- **プロジェクト名**: LearnTrack Pro - プログラミング学習管理プラットフォーム
- **技術スタック**: Laravel 12 / Vue 3 (Composition API) / Pinia / MySQL 8.0
- **構成**: モノリシックSPA
- **現在の状態**: 🎯 **Phase 3-2完了** → **次はPhase 3-3（Git戦略実装 + Laravel初期化）** ← 今ここ

### 目的・目標

- 転職活動用ポートフォリオとして公開
- 実用的なDevOps経験の習得（Docker本番運用、Git戦略）
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
- ✅ Phase 3-2: VPS環境構築完了（10/25-30）

### 直近完了した実装（10/28-30）

1. ✅ Docker / Docker Compose インストール
2. ✅ アプリケーション動作環境の構築（Dockerfile、docker-compose.yml、Apache設定、Git clone）
3. ✅ Git戦略ドキュメント化（.gitattributes、merge=ours）
4. ✅ リソース制限設定（メモリ2GB環境対応）
5. ✅ 環境構築メモ④⑤⑥作成完了

### 作成済みドキュメント

- 環境構築メモ①〜⑥（Ubuntu設定、MySQL、バックアップ、Docker、アプリ環境、Git戦略）

---

## これまでの議論で確定した方針

### 1. Git戦略とブランチ管理（★最重要・新規）

**ブランチ構成**:

- **main**: 本番環境専用
- **develop**: 開発・統合環境
- **feature**: 個別機能開発

**.gitattributes による環境別ファイル保護**:

- `config/cors.php merge=ours`: 本番設定を保護
- `docker-compose.yml merge=ours`: 環境別設定を保護
- mainでdevelopマージ時、本番設定は自動保持

**運用ルール**:

- ローカル設定変更はdevelopでコミット
- 本番設定変更はmainで直接コミット

**判断基準**: 環境別の設定ファイルコンフリクトを防ぐ

詳細: 環境構築メモ⑥参照

### 2. Docker本番環境の構成（★最重要）

**リソース制限（メモリ2GB環境）**:

- PHPコンテナ: 最大1GB（limits）、最低512MB（reservations）
- MySQL（ホスト）: 512-768MB
- システム予約: 256MB

**platform設定**:

- `platform: linux/amd64` が正しい
- Xserver VPS = x86_64 = amd64

**MySQL接続**:

- `extra_hosts: host.docker.internal:host-gateway`

**判断基準**: OOM Killer発動を防ぎシステム全体の安定性維持

詳細: 環境構築メモ⑤参照

### 3. Docker / Docker Compose インストール

**パケットフィルター**: HTTP（80）、HTTPS（443）開放、SSH（22）閉じる

**インストール方針**:

- Docker公式リポジトリ使用
- Docker Compose v2（プラグイン形式）
- `docker compose`（ハイフンなし）使用

詳細: 環境構築メモ④参照

### 4. MySQL自動バックアップ

**バックアップ**: cronで毎日午前4時、7日間保持

**復旧最適化**: mysqldumpに`DROP TABLE IF EXISTS`含まれる → DB初期化不要

詳細: 環境構築メモ③参照

### 5. デプロイ先選定

**結論**: Xserver VPS 2GB（月1,150円）

**AWS断念理由**: EC2+RDS月4,947円（予算の3-5倍）

**判断基準**: コスト最適化 > クラウドブランド

### 6. ハイブリッド構成

**構成**: LaravelのみDocker化、MySQLは直接インストール

**理由**:

- LaravelのみDocker化: CI/CD自動化が目的
- MySQL直接: メモリ2GBでの安定性

### 7. VPS環境構築

**SSH認証多層防御**:

- `PasswordAuthentication no` + `PermitEmptyPasswords no` + `KbdInteractiveAuthentication no`

**socket activation**: Ubuntu 24.04では無効化が正解

**fail2ban**: 動的防御でブルートフォース攻撃防止

詳細: 環境構築メモ①参照

### 8. Phase 0-2の確定方針

**Axiosインスタンス**:

- `/api/*` → `import api from '@/plugins/axios'`
- `/fortify/*`, `/sanctum/*` → `import axios from 'axios'`

**エラーハンドリング**: 再スロー必須、ストア使用直前初期化

**レスポンシブ**: `md:`のみ使用、`sm:`不使用

---

## やってはいけないこと（★重要）

### Phase 3-2（VPS環境構築）

1. **SSHパスワード認証を有効化**
2. **rootで直接ログイン許可**
3. **socket activation有効でポート変更**
4. **fail2banなしでSSH開放**
5. **MySQLのDocker化**
6. **バックアップ復旧時にDB削除・再作成**

### Git戦略

1. **mainでローカル用設定をコミット**
2. **.gitattributesなしで環境別ファイル管理**
3. **mainとdevelopで別ファイルとして管理**

### Phase 0-2

1. **Axiosインスタンス混同**
2. **ストアでエラー握りつぶし**
3. **TailwindCSS `sm:`使用**
4. **完璧主義**

---

## 技術選択と教訓

### 重要な教訓

1. **コスト最適化最優先**: クラウドブランドより予算内実現
2. **過去経験活用**: Docker全体化複雑化経験 → ハイブリッド構成
3. **VPSでAWS機能代替可能**: cron、fail2ban等
4. **技術的背景理解重要**: socket activation、fail2ban、mysqldump、merge=ours
5. **多層防御**: 単一対策では不十分
6. **Git戦略事前設計**: 環境別ファイル問題を未然防止

---

## 次のアクション

### Phase 3-3: Laravel初期化とデプロイ（優先度: ★★★★★）

**工数**: 1-2日

**作業内容**:

1. `.env`作成と本番設定
2. `composer install --no-dev`
3. Dockerビルド・起動（`docker compose build` / `up -d`）
4. Laravel初期化（`key:generate` / `migrate`）
5. 動作確認

**ドキュメント**: 環境構築メモ⑦作成

### 補完: Git戦略実装（優先度: ★★★★☆）

**工数**: 0.5日

**作業内容**:

1. `.gitattributes`作成
2. mainへ初回マージ
3. 本番設定保護確認

詳細: 環境構築メモ⑥参照

---

## 特記事項

### プロジェクト健全性

- **進捗**: ✅ 優良（Phase 3-2完了）
- **技術的負債**: ✅ 最小限
- **ドキュメント**: ✅ 優良（全手順記録済み）

### デプロイまでクリティカルパス

**約1-3日**:

- Laravel初期化+動作確認: 1-2日
- Git戦略実装: 0.5日（並行可）

---

**最終更新**: 2025年10月30日
