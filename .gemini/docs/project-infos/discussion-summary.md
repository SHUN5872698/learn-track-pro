# これまでの議論の要点まとめ（最新版：2025年11月6日更新）

## 背景・経緯

### プロジェクトの概要

- **プロジェクト名**: LearnTrack Pro - プログラミング学習管理プラットフォーム
- **技術スタック**: Laravel 12 / Vue 3 (Composition API) / Pinia / MySQL 8.0
- **構成**: モノリシックSPA
- **現在の状態**: Phase 3-5完了 → SSL化完了、HTTPS本番稼働中

### 目的・目標

- 転職活動用ポートフォリオとして公開
- 実用的なDevOps経験の習得（Docker本番運用、Git戦略、自動化）
- コスト最適化を最優先

### 主要な制約

- TypeScript不使用、Bootstrap/jQuery/Options API禁止
- 個人開発のため実装工数を最小限に
- デプロイ優先、完璧主義を避ける
- **予算制約**: 月1,000-3,000円（転職活動期間3-6ヶ月）
- **Git管理対象**: `laravel-docker/src/`のみ（インフラ設定は対象外）

---

## 完了・確定事項

### プロジェクトの現在地

- ✅ Phase 0-2: アプリケーション開発完了（10/14-22）
- ✅ Phase 3-1: デプロイ先選定完了（10/23）
- ✅ Phase 3-2: VPS環境構築完了（10/25-30）
- ✅ Phase 3-3: Git戦略実装完了（10/30）
- ✅ Phase 3-4: Laravel初期化とデプロイ準備完了（11/3-4）
- ✅ Phase 3-5: SSL化とドメイン設定完了（11/5-6）

### 直近完了した実装（11/5-6）

1. ✅ Xserver VPSサブドメイン取得（[learn-track-pro.xvps.jp](http://learn-track-pro.xvps.jp)）
2. ✅ Let's Encrypt SSL証明書取得
3. ✅ Apache VirtualHost完全設定（HTTP/HTTPS、IP/ドメイン対応）
4. ✅ ファイル権限問題解決（storage/とbootstrap/cache/）
5. ✅ HTTPS本番稼働開始

### 作成済みドキュメント

- 環境構築メモ①〜⑧（Ubuntu設定、MySQL、バックアップ、Docker、アプリ環境、Git戦略、Laravel初期化、SSL/ドメイン）
- 手動デプロイフロー
- プロンプトテンプレート

---

## これまでの議論で確定した方針

### 1. VPS環境でのファイル権限設定

**要点**: `storage/`と`bootstrap/cache/`は`www-data:www-data`所有、パーミッション775

**判断基準**: Webサーバープロセス（www-data）がファイル作成・書き込みを行うため、適切な所有権が必須

**トラブル回避**: git clone直後に必ず設定することで時限爆弾的なPermission deniedエラーを防止

### 2. Apache VirtualHost完全設定戦略

**4つのVirtualHost構成**:

- HTTP:80 - IPアドレス用（ドメインへリダイレクト）
- HTTP:80 - ドメイン用（HTTPSへリダイレクト）
- HTTPS:443 - IPアドレス用（ドメインへリダイレクト）
- HTTPS:443 - ドメイン用（メインアプリ実行）

**判断基準**: SEO重複コンテンツ防止、ユーザー体験向上、セキュリティ最適化

**Chrome対応**: 自動HTTPS化に対応するためHTTPS:443のIP用VirtualHostも必須

### 3. IPアドレス用VirtualHostでの.htaccess無効化

**要点**: IPアドレスでアクセスされた場合、`AllowOverride None`でLaravelの`.htaccess`を無効化

**判断基準**: リダイレクトを確実に実行し、Laravelのルーティングより優先

### 4. Git戦略とブランチ管理

**ブランチ構成**:

- **main**: 本番環境専用
- **develop**: 開発・統合環境
- **feature**: 個別機能開発

**.gitattributes による環境別ファイル保護**:

- `config/cors.php merge=ours`: 本番設定を保護
- `.gitignore merge=ours`: .gemini/除外設定を保護

**運用ルール**:

- ローカル設定変更はdevelopでコミット
- 本番設定変更はmainで直接コミット

詳細: 環境構築メモ⑥参照

### 5. Docker本番環境の構成

**リソース制限（メモリ2GB環境）**:

- PHPコンテナ: 最大1GB（limits）、最低512MB（reservations）
- MySQL（ホスト）: 512-768MB
- システム予約: 256MB

**platform設定**: `platform: linux/amd64`（Xserver VPS = x86_64）

**MySQL接続**: `extra_hosts: host.docker.internal:host-gateway`

**判断基準**: OOM Killer発動を防ぎシステム全体の安定性維持

詳細: 環境構築メモ⑤参照

### 6. Docker Compose設定の最適化

**image指定の扱い**: ローカル開発環境では`image`指定を削除、`dockerfile: Dockerfile`を明示

**判断基準**: BuildKitキャッシュの不要な蓄積を防ぎ、ビルド動作を安定化

### 7. .dockerignore設定

**配置場所**: `laravel-docker/.dockerignore`（1ファイルのみ）

**Git管理**: しない（`src/`外のため対象外）

**VPSへの配置**: 手動でscpコピー（初回のみ）

**判断基準**: ビルド速度の維持とキャッシュ効率の向上

### 8. BuildKitキャッシュ管理戦略

**ローカル環境**: 週1回、7日以上前のキャッシュ削除（手動）

**VPS環境**: 週1回、30日以上前のキャッシュ削除（cron自動）

**判断基準**: 環境の特性に応じた最適なキャッシュ保持期間

### 9. Cronジョブ設定

**MySQLバックアップ**: 毎日午前4時

**Dockerキャッシュクリーンアップ**: 毎週日曜午前3時

**実行時刻の分散理由**: CPU・ディスクI/O競合を回避

**登録ユーザー**: rootユーザー（デプロイ時の初期化防止）

詳細: 環境構築メモ⑦参照

### 10. 手順書作成の統一ルール

**見出し構造**: 見出し4（####）禁止、見出し3（###）まで使用、以下は太字

**コールアウトの制約**: コードブロック/コマンド不可、インラインコードと簡潔な箇条書きのみ

**判断基準**: 手順書の可読性と保守性の向上

### 11. MySQL自動バックアップ

**バックアップ**: cronで毎日午前4時、7日間保持

**復旧最適化**: mysqldumpに`DROP TABLE IF EXISTS`含まれる → DB初期化不要

詳細: 環境構築メモ③参照

### 12. デプロイ先選定

**結論**: Xserver VPS 2GB（月1,150円）

**AWS断念理由**: EC2+RDS月4,947円（予算の3-5倍）

### 13. ハイブリッド構成

**構成**: LaravelのみDocker化、MySQLは直接インストール

**理由**: LaravelはCI/CD自動化が目的、MySQLはメモリ2GBでの安定性優先

### 14. VPS環境構築

**SSH認証多層防御**: `PasswordAuthentication no` + `PermitEmptyPasswords no` + `KbdInteractiveAuthentication no`

**socket activation**: Ubuntu 24.04では無効化が正解

**fail2ban**: 動的防御でブルートフォース攻撃防止

詳細: 環境構築メモ①参照

### 15. Phase 0-2の確定方針

**Axiosインスタンス**:

- `/api/*` → `import api from '@/plugins/axios'`
- `/fortify/*`, `/sanctum/*` → `import axios from 'axios'`

**エラーハンドリング**: 再スロー必須、ストア使用直前初期化

**レスポンシブ**: `md:`のみ使用、`sm:`不使用

---

## やってはいけないこと

1. SSHパスワード認証を有効化
2. rootで直接ログイン許可
3. socket activation有効でポート変更
4. fail2banなしでSSH開放
5. MySQLのDocker化
6. バックアップ復旧時にDB削除・再作成
7. mainでローカル用設定をコミット
8. .gitattributesなしで環境別ファイル管理
9. docker-compose.ymlにimage指定とbuild指定を併記
10. BuildKitキャッシュを放置
11. git clone後にstorage/権限設定をしない
12. IPアドレスアクセスをリダイレクトせず放置

---

## 技術選択と教訓

### 重要な技術選択の判断

1. **Xserver VPS選択**: AWS断念（コスト5倍） → 予算内実現最優先
2. **ハイブリッド構成**: Laravel Docker化 + MySQL直接 → メモリ2GB環境での安定性
3. **4つのVirtualHost戦略**: HTTP/HTTPS、IP/ドメインすべてカバー → SEO・UX・セキュリティ最適化

### 重要な教訓

1. **Permission deniedは時限爆弾**: ファイル権限問題は初回git clone時に予防的に設定すべき
2. **Webサーバーユーザー所有権の重要性**: www-dataが書き込むファイルはwww-data所有が必須
3. **Chrome自動HTTPS化対応**: HTTPS:443のIP用VirtualHostも必要
4. **コスト最適化最優先**: クラウドブランドより予算内実現
5. **技術的背景理解重要**: ファイル権限、BuildKitキャッシュ、merge=ours
6. **多層防御**: 単一対策では不十分
7. **Git戦略事前設計**: 環境別ファイル問題を未然防止
8. **ドキュメント品質統一**: 見出し構造とコールアウトの制約で保守性向上

---

## 次のアクション

### Phase 3-6: CI/CD構築（優先度: 中）

**工数**: 2-3日

**作業内容**:

- GitHub Actionsによる自動テスト
- 自動デプロイパイプライン構築
- デプロイ通知設定

### Phase 4: 監視・ログ設定（優先度: 低）

**工数**: 1-2日

**作業内容**:

- アクセスログ分析
- エラー通知設定
- パフォーマンス監視

---

## 特記事項

### プロジェクト健全性

- **進捗**: 優良（Phase 3-5完了、HTTPS本番稼働中）
- **技術的負債**: 最小限
- **ドキュメント**: 優良（全手順記録済み、SSL化まで完了）
- **自動化**: 良好（バックアップ、キャッシュクリーンアップ）
- **セキュリティ**: 優良（SSL/TLS、SSH多層防御、fail2ban）

### 現在の状態

**本番環境**: 完全稼働中（https://learn-track-pro.xvps.jp）

**次の焦点**: CI/CD自動化（任意）

---

**最終更新**: 2025年11月6日
