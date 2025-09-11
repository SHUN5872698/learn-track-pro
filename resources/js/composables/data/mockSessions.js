import { ref } from 'vue';

export const mockSessions = ref([
  // ===========================================================
  // Laravel完全マスター
  // ===========================================================
  // セクション1: イントロダクション
  { id: 1, user_id: 1, learning_content_id: 1, section_id: 1, study_minutes: 120, memo: 'Laravelの概要とフレームワークの特徴を理解', mood_rating: 4, session_type: 'manual', studied_at: '2025-06-01T09:30' },
  { id: 2, user_id: 1, learning_content_id: 1, section_id: 1, study_minutes: 90, memo: '学習計画の立て方を確認', mood_rating: 3, session_type: 'manual', studied_at: '2025-06-02T14:15' },

  // セクション2: 環境構築
  { id: 3, user_id: 1, learning_content_id: 1, section_id: 2, study_minutes: 180, memo: 'Composerのインストールと設定', mood_rating: 2, session_type: 'manual', studied_at: '2025-06-03T10:00' },
  { id: 4, user_id: 1, learning_content_id: 1, section_id: 2, study_minutes: 150, memo: 'Laravelプロジェクトの作成完了', mood_rating: 4, session_type: 'manual', studied_at: '2025-06-04T16:30' },
  { id: 5, user_id: 1, learning_content_id: 1, section_id: 2, study_minutes: 75, memo: '.envファイルの設定確認', mood_rating: 5, session_type: 'manual', studied_at: '2025-06-05T11:45' },

  // セクション3: ルーティング
  { id: 6, user_id: 1, learning_content_id: 1, section_id: 3, study_minutes: 240, memo: '基本的なルートの定義方法', mood_rating: 4, session_type: 'manual', studied_at: '2025-06-08T09:00' },
  { id: 7, user_id: 1, learning_content_id: 1, section_id: 3, study_minutes: 120, memo: 'ルートパラメータの使い方', mood_rating: 3, session_type: 'manual', studied_at: '2025-06-09T13:20' },
  { id: 8, user_id: 1, learning_content_id: 1, section_id: 3, study_minutes: 90, memo: 'ルートミドルウェアの実装', mood_rating: 4, session_type: 'manual', studied_at: '2025-06-10T15:00' },

  // セクション4: コントローラー
  { id: 9, user_id: 1, learning_content_id: 1, section_id: 4, study_minutes: 200, memo: 'コントローラーの基本構造理解', mood_rating: 5, session_type: 'manual', studied_at: '2025-06-12T10:30' },
  { id: 10, user_id: 1, learning_content_id: 1, section_id: 4, study_minutes: 160, memo: 'RESTfulコントローラーの作成', mood_rating: 3, session_type: 'manual', studied_at: '2025-06-13T14:45' },

  // セクション5: ビュー
  { id: 11, user_id: 1, learning_content_id: 1, section_id: 5, study_minutes: 150, memo: 'Bladeテンプレートエンジンの基礎', mood_rating: 4, session_type: 'manual', studied_at: '2025-06-15T09:15' },
  { id: 12, user_id: 1, learning_content_id: 1, section_id: 5, study_minutes: 120, memo: 'レイアウトファイルの作成', mood_rating: 5, session_type: 'manual', studied_at: '2025-06-16T16:00' },
  { id: 13, user_id: 1, learning_content_id: 1, section_id: 5, study_minutes: 80, memo: 'コンポーネントの使い方', mood_rating: 3, session_type: 'manual', studied_at: '2025-06-17T12:30' },

  // セクション6: データベース設計
  { id: 14, user_id: 1, learning_content_id: 1, section_id: 6, study_minutes: 300, memo: 'マイグレーションファイルの作成', mood_rating: 2, session_type: 'manual', studied_at: '2025-06-19T09:00' },
  { id: 15, user_id: 1, learning_content_id: 1, section_id: 6, study_minutes: 180, memo: 'テーブル設計の見直し', mood_rating: 4, session_type: 'manual', studied_at: '2025-06-20T15:30' },

  // セクション7: Eloquent ORM
  { id: 16, user_id: 1, learning_content_id: 1, section_id: 7, study_minutes: 240, memo: 'Eloquentモデルの基本操作', mood_rating: 5, session_type: 'manual', studied_at: '2025-06-22T10:00' },
  { id: 17, user_id: 1, learning_content_id: 1, section_id: 7, study_minutes: 200, memo: 'リレーションシップの実装', mood_rating: 3, session_type: 'manual', studied_at: '2025-06-23T14:15' },
  { id: 18, user_id: 1, learning_content_id: 1, section_id: 7, study_minutes: 120, memo: 'アクセサとミューテータ', mood_rating: 4, session_type: 'manual', studied_at: '2025-06-24T11:45' },

  // セクション8: フォーム処理
  { id: 19, user_id: 1, learning_content_id: 1, section_id: 8, study_minutes: 180, memo: 'フォームバリデーションの実装', mood_rating: 4, session_type: 'manual', studied_at: '2025-06-26T09:30' },
  { id: 20, user_id: 1, learning_content_id: 1, section_id: 8, study_minutes: 150, memo: 'CSRFプロテクションの確認', mood_rating: 3, session_type: 'manual', studied_at: '2025-06-27T16:20' },
  { id: 21, user_id: 1, learning_content_id: 1, section_id: 8, study_minutes: 90, memo: 'ファイルアップロード機能', mood_rating: 5, session_type: 'manual', studied_at: '2025-06-28T13:00' },

  // セクション9: 認証システム
  { id: 22, user_id: 1, learning_content_id: 1, section_id: 9, study_minutes: 360, memo: 'Laravel Breezeの導入と設定', mood_rating: 2, session_type: 'manual', studied_at: '2025-06-30T09:00' },
  { id: 23, user_id: 1, learning_content_id: 1, section_id: 9, study_minutes: 210, memo: 'ログイン・ログアウト機能の確認', mood_rating: 4, session_type: 'manual', studied_at: '2025-07-01T15:45' },
  { id: 24, user_id: 1, learning_content_id: 1, section_id: 9, study_minutes: 120, memo: 'パスワードリセット機能', mood_rating: 3, session_type: 'manual', studied_at: '2025-07-02T12:15' },

  // セクション10: ミドルウェア
  { id: 25, user_id: 1, learning_content_id: 1, section_id: 10, study_minutes: 180, memo: 'カスタムミドルウェアの作成', mood_rating: 4, session_type: 'manual', studied_at: '2025-07-04T10:30' },
  { id: 26, user_id: 1, learning_content_id: 1, section_id: 10, study_minutes: 100, memo: 'ミドルウェアグループの設定', mood_rating: 5, session_type: 'manual', studied_at: '2025-07-05T14:00' },

  // セクション11: API開発
  { id: 27, user_id: 1, learning_content_id: 1, section_id: 11, study_minutes: 270, memo: 'RESTful APIの基本設計', mood_rating: 3, session_type: 'manual', studied_at: '2025-07-07T09:15' },
  { id: 28, user_id: 1, learning_content_id: 1, section_id: 11, study_minutes: 200, memo: 'APIリソースクラスの活用', mood_rating: 4, session_type: 'manual', studied_at: '2025-07-08T16:30' },
  { id: 29, user_id: 1, learning_content_id: 1, section_id: 11, study_minutes: 150, memo: 'APIトークン認証の実装', mood_rating: 2, session_type: 'manual', studied_at: '2025-07-09T11:00' },

  // セクション12: テスト
  { id: 30, user_id: 1, learning_content_id: 1, section_id: 12, study_minutes: 240, memo: 'PHPUnitの基本的な使い方', mood_rating: 3, session_type: 'manual', studied_at: '2025-07-11T10:00' },
  { id: 31, user_id: 1, learning_content_id: 1, section_id: 12, study_minutes: 180, memo: 'フィーチャーテストの作成', mood_rating: 4, session_type: 'manual', studied_at: '2025-07-12T15:20' },
  { id: 32, user_id: 1, learning_content_id: 1, section_id: 12, study_minutes: 120, memo: 'モックとファクトリの使用', mood_rating: 5, session_type: 'manual', studied_at: '2025-07-13T13:45' },

  // セクション13: キューとジョブ
  { id: 33, user_id: 1, learning_content_id: 1, section_id: 13, study_minutes: 200, memo: 'ジョブクラスの作成方法', mood_rating: 4, session_type: 'manual', studied_at: '2025-07-15T09:30' },
  { id: 34, user_id: 1, learning_content_id: 1, section_id: 13, study_minutes: 160, memo: 'キューワーカーの設定', mood_rating: 3, session_type: 'manual', studied_at: '2025-07-16T14:15' },

  // セクション14: イベントとリスナー
  { id: 35, user_id: 1, learning_content_id: 1, section_id: 14, study_minutes: 180, memo: 'イベント駆動プログラミングの理解', mood_rating: 2, session_type: 'manual', studied_at: '2025-07-18T11:00' },
  { id: 36, user_id: 1, learning_content_id: 1, section_id: 14, study_minutes: 140, memo: 'カスタムイベントの作成', mood_rating: 4, session_type: 'manual', studied_at: '2025-07-19T16:45' },
  { id: 37, user_id: 1, learning_content_id: 1, section_id: 14, study_minutes: 90, memo: 'リスナーの登録と実行', mood_rating: 5, session_type: 'manual', studied_at: '2025-07-20T12:30' },

  // セクション15: 通知システム
  { id: 38, user_id: 1, learning_content_id: 1, section_id: 15, study_minutes: 220, memo: 'メール通知の実装', mood_rating: 3, session_type: 'manual', studied_at: '2025-07-22T10:15' },
  { id: 39, user_id: 1, learning_content_id: 1, section_id: 15, study_minutes: 150, memo: 'データベース通知の設定', mood_rating: 4, session_type: 'manual', studied_at: '2025-07-23T15:00' },

  // セクション16: ファイルストレージ
  { id: 40, user_id: 1, learning_content_id: 1, section_id: 16, study_minutes: 180, memo: 'ローカルストレージの設定', mood_rating: 4, session_type: 'manual', studied_at: '2025-07-25T09:45' },
  { id: 41, user_id: 1, learning_content_id: 1, section_id: 16, study_minutes: 120, memo: 'S3ストレージの連携', mood_rating: 3, session_type: 'manual', studied_at: '2025-07-26T14:30' },
  { id: 42, user_id: 1, learning_content_id: 1, section_id: 16, study_minutes: 90, memo: 'ファイルの暗号化処理', mood_rating: 2, session_type: 'manual', studied_at: '2025-07-27T11:15' },

  // セクション17: キャッシュ
  { id: 43, user_id: 1, learning_content_id: 1, section_id: 17, study_minutes: 160, memo: 'Redisキャッシュの設定', mood_rating: 5, session_type: 'manual', studied_at: '2025-07-29T10:00' },
  { id: 44, user_id: 1, learning_content_id: 1, section_id: 17, study_minutes: 140, memo: 'クエリキャッシュの実装', mood_rating: 4, session_type: 'manual', studied_at: '2025-07-30T16:20' },

  // セクション18: パフォーマンス最適化
  { id: 45, user_id: 1, learning_content_id: 1, section_id: 18, study_minutes: 300, memo: 'N+1問題の解決方法', mood_rating: 3, session_type: 'manual', studied_at: '2025-08-01T09:30' },
  { id: 46, user_id: 1, learning_content_id: 1, section_id: 18, study_minutes: 200, memo: 'データベースインデックスの最適化', mood_rating: 4, session_type: 'manual', studied_at: '2025-08-02T13:15' },
  { id: 47, user_id: 1, learning_content_id: 1, section_id: 18, study_minutes: 120, memo: 'レスポンス時間の測定', mood_rating: 5, session_type: 'manual', studied_at: '2025-08-03T15:45' },

  // セクション19: セキュリティ
  { id: 48, user_id: 1, learning_content_id: 1, section_id: 19, study_minutes: 240, memo: 'XSS対策の実装', mood_rating: 2, session_type: 'manual', studied_at: '2025-08-05T10:30' },
  { id: 49, user_id: 1, learning_content_id: 1, section_id: 19, study_minutes: 180, memo: 'SQLインジェクション対策', mood_rating: 4, session_type: 'manual', studied_at: '2025-08-06T14:00' },
  { id: 50, user_id: 1, learning_content_id: 1, section_id: 19, study_minutes: 150, memo: 'HTTPS設定とセキュリティヘッダー', mood_rating: 3, session_type: 'manual', studied_at: '2025-08-07T11:30' },

  // セクション20: デプロイ
  { id: 51, user_id: 1, learning_content_id: 1, section_id: 20, study_minutes: 360, memo: '本番環境への初回デプロイ', mood_rating: 2, session_type: 'manual', studied_at: '2025-08-25T09:00' },
  { id: 52, user_id: 1, learning_content_id: 1, section_id: 20, study_minutes: 180, memo: 'CI/CDパイプラインの構築', mood_rating: 4, session_type: 'manual', studied_at: '2025-08-26T15:30' },
  { id: 53, user_id: 1, learning_content_id: 1, section_id: 20, study_minutes: 120, memo: 'デプロイの自動化完了', mood_rating: 5, session_type: 'manual', studied_at: '2025-08-27T13:15' },
  { id: 54, user_id: 1, learning_content_id: 1, section_id: 20, study_minutes: 90, memo: '最終確認とまとめ', mood_rating: 5, session_type: 'manual', studied_at: '2025-08-28T17:00' },

  // ===========================================================
  // PHP8.5の内容確認
  // ===========================================================
  { id: 55, user_id: 1, learning_content_id: 5, section_id: 50, study_minutes: 30, memo: 'RFCの概要確認', mood_rating: 3, session_type: 'manual', studied_at: '2025-08-23T11:00' },
  { id: 56, user_id: 1, learning_content_id: 5, section_id: 51, study_minutes: 75, memo: 'JITコンパイルについて', mood_rating: 4, session_type: 'manual', studied_at: '2025-08-24T16:00' },
  { id: 57, user_id: 1, learning_content_id: 5, section_id: 52, study_minutes: 45, memo: '配列関数の新機能確認', mood_rating: 4, session_type: 'manual', studied_at: '2025-08-25T10:30' },
  { id: 58, user_id: 1, learning_content_id: 5, section_id: 53, study_minutes: 60, memo: 'Random拡張の使い方', mood_rating: 3, session_type: 'manual', studied_at: '2025-08-26T14:00' },
  { id: 59, user_id: 1, learning_content_id: 5, section_id: 54, study_minutes: 90, memo: 'クラス機能の詳細', mood_rating: 5, session_type: 'manual', studied_at: '2025-08-27T09:15' },
  { id: 60, user_id: 1, learning_content_id: 5, section_id: 55, study_minutes: 120, memo: '型システムの理解', mood_rating: 4, session_type: 'manual', studied_at: '2025-08-28T13:30' },
  { id: 61, user_id: 1, learning_content_id: 5, section_id: 56, study_minutes: 30, memo: '非推奨機能のチェック', mood_rating: 3, session_type: 'manual', studied_at: '2025-08-29T11:00' },
  { id: 62, user_id: 1, learning_content_id: 5, section_id: 57, study_minutes: 45, memo: 'パフォーマンス計測', mood_rating: 4, session_type: 'manual', studied_at: '2025-08-30T15:45' },
  { id: 63, user_id: 1, learning_content_id: 5, section_id: 58, study_minutes: 90, memo: 'セキュリティ機能の確認', mood_rating: 4, session_type: 'manual', studied_at: '2025-08-31T10:00' },
  { id: 64, user_id: 1, learning_content_id: 5, section_id: 59, study_minutes: 120, memo: '既存コードの移行計画', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-01T14:00' },

  // ===========================================================
  // Vue.js 3 実践ガイド
  // ===========================================================
  { id: 65, user_id: 1, learning_content_id: 2, section_id: 21, study_minutes: 120, memo: 'Vueの基本構文', mood_rating: 4, session_type: 'manual', studied_at: '2024-08-18T13:00' },
  { id: 66, user_id: 1, learning_content_id: 2, section_id: 22, study_minutes: 150, memo: 'Composition APIの基礎', mood_rating: 5, session_type: 'manual', studied_at: '2024-08-19T10:00' },
  { id: 67, user_id: 1, learning_content_id: 2, section_id: 23, study_minutes: 90, memo: 'Vue Routerの設定', mood_rating: 3, session_type: 'manual', studied_at: '2024-08-20T14:30' },
  { id: 68, user_id: 1, learning_content_id: 2, section_id: 24, study_minutes: 120, memo: 'Piniaの状態管理', mood_rating: 4, session_type: 'manual', studied_at: '2024-08-21T09:00' },
  { id: 69, user_id: 1, learning_content_id: 2, section_id: 25, study_minutes: 180, memo: 'コンポーネント設計パターン', mood_rating: 5, session_type: 'manual', studied_at: '2024-08-22T13:30' },
  { id: 70, user_id: 1, learning_content_id: 2, section_id: 26, study_minutes: 210, memo: 'TypeScript導入', mood_rating: 3, session_type: 'manual', studied_at: '2024-08-23T10:00' },
  { id: 71, user_id: 1, learning_content_id: 2, section_id: 27, study_minutes: 150, memo: 'Vitestでのテスト', mood_rating: 4, session_type: 'manual', studied_at: '2024-08-24T14:00' },
  { id: 72, user_id: 1, learning_content_id: 2, section_id: 28, study_minutes: 120, memo: 'バンドル最適化', mood_rating: 4, session_type: 'manual', studied_at: '2024-08-25T11:00' },
  { id: 73, user_id: 1, learning_content_id: 2, section_id: 29, study_minutes: 240, memo: 'Nuxt.js入門', mood_rating: 5, session_type: 'manual', studied_at: '2024-08-26T09:30' },

  // ===========================================================
  // React基礎からNext.jsまで
  // ===========================================================
  { id: 74, user_id: 1, learning_content_id: 3, section_id: 36, study_minutes: 180, memo: 'JSXとコンポーネント', mood_rating: 4, session_type: 'manual', studied_at: '2024-09-02T10:00' },
  { id: 75, user_id: 1, learning_content_id: 3, section_id: 37, study_minutes: 150, memo: 'useStateとuseEffect', mood_rating: 5, session_type: 'manual', studied_at: '2024-09-03T14:00' },
  { id: 76, user_id: 1, learning_content_id: 3, section_id: 38, study_minutes: 120, memo: 'Context APIの実装', mood_rating: 3, session_type: 'manual', studied_at: '2024-09-04T11:30' },
  { id: 77, user_id: 1, learning_content_id: 3, section_id: 39, study_minutes: 240, memo: 'Redux Toolkitの導入', mood_rating: 4, session_type: 'manual', studied_at: '2024-09-05T09:00' },
  { id: 78, user_id: 1, learning_content_id: 3, section_id: 40, study_minutes: 90, memo: 'React Routerの設定', mood_rating: 4, session_type: 'manual', studied_at: '2024-09-06T15:00' },
  { id: 79, user_id: 1, learning_content_id: 3, section_id: 41, study_minutes: 180, memo: 'React.memoとuseMemo', mood_rating: 5, session_type: 'manual', studied_at: '2024-09-07T10:30' },

  // ===========================================================
  // Dockerの基礎学習
  // ===========================================================
  // Dockerの概要と仮想化技術
  { id: 80, user_id: 1, learning_content_id: 4, section_id: 71, study_minutes: 120, memo: 'Dockerとコンテナ技術の概要', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-01T09:00' },
  { id: 81, user_id: 1, learning_content_id: 4, section_id: 71, study_minutes: 90, memo: 'VMとコンテナの違い', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-01T11:00' },
  { id: 82, user_id: 1, learning_content_id: 4, section_id: 71, study_minutes: 60, memo: 'Dockerの歴史と背景', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-01T15:30' },
  { id: 83, user_id: 1, learning_content_id: 4, section_id: 71, study_minutes: 120, memo: 'コンテナのメリット整理', mood_rating: 5, session_type: 'manual', studied_at: '2025-09-02T09:00' },
  { id: 84, user_id: 1, learning_content_id: 4, section_id: 71, study_minutes: 45, memo: 'ユースケースの確認', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-02T14:00' },

  // Dockerのインストールと環境構築
  { id: 85, user_id: 1, learning_content_id: 4, section_id: 72, study_minutes: 180, memo: 'Docker Desktopのインストール', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-03T09:00' },
  { id: 86, user_id: 1, learning_content_id: 4, section_id: 72, study_minutes: 150, memo: 'WSL2の設定', mood_rating: 2, session_type: 'manual', studied_at: '2025-09-03T10:00' },
  { id: 87, user_id: 1, learning_content_id: 4, section_id: 72, study_minutes: 90, memo: 'dockerコマンド確認', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-03T15:00' },
  { id: 88, user_id: 1, learning_content_id: 4, section_id: 72, study_minutes: 120, memo: 'トラブルシューティング', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-04T09:30' },
  { id: 89, user_id: 1, learning_content_id: 4, section_id: 72, study_minutes: 60, memo: 'Docker Hubアカウント作成', mood_rating: 5, session_type: 'manual', studied_at: '2025-09-04T13:00' },
  { id: 90, user_id: 1, learning_content_id: 4, section_id: 72, study_minutes: 75, memo: '環境変数の設定', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-04T16:00' },
  { id: 91, user_id: 1, learning_content_id: 4, section_id: 72, study_minutes: 45, memo: '動作確認完了', mood_rating: 5, session_type: 'manual', studied_at: '2025-09-05T11:00' },

  // Dockerイメージの基本
  { id: 92, user_id: 1, learning_content_id: 4, section_id: 73, study_minutes: 150, memo: 'イメージのpullとrun', mood_rating: 5, session_type: 'manual', studied_at: '2025-09-06T09:00' },
  { id: 93, user_id: 1, learning_content_id: 4, section_id: 73, study_minutes: 180, memo: 'レイヤーの概念理解', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-06T10:30' },
  { id: 94, user_id: 1, learning_content_id: 4, section_id: 73, study_minutes: 120, memo: 'タグとバージョニング', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-06T14:30' },
  { id: 95, user_id: 1, learning_content_id: 4, section_id: 73, study_minutes: 90, memo: 'イメージの削除と管理', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-07T09:00' },

  // コンテナの作成と管理
  { id: 96, user_id: 1, learning_content_id: 4, section_id: 74, study_minutes: 90, memo: 'コンテナのライフサイクル', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-07T15:30' },
  { id: 97, user_id: 1, learning_content_id: 4, section_id: 74, study_minutes: 60, memo: 'docker runの詳細', mood_rating: 5, session_type: 'manual', studied_at: '2025-09-08T09:00' },
  { id: 98, user_id: 1, learning_content_id: 4, section_id: 74, study_minutes: 120, memo: 'コンテナ内での作業', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-08T10:30' },
  { id: 99, user_id: 1, learning_content_id: 4, section_id: 74, study_minutes: 150, memo: 'execコマンドの活用', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-08T14:00' },
  { id: 100, user_id: 1, learning_content_id: 4, section_id: 74, study_minutes: 75, memo: 'ログの確認方法', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-09T09:00' },
  { id: 101, user_id: 1, learning_content_id: 4, section_id: 74, study_minutes: 90, memo: 'リソース制限の設定', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-09T11:00' },
  { id: 102, user_id: 1, learning_content_id: 4, section_id: 74, study_minutes: 120, memo: 'コンテナの自動再起動', mood_rating: 5, session_type: 'manual', studied_at: '2025-09-09T14:30' },
  { id: 103, user_id: 1, learning_content_id: 4, section_id: 74, study_minutes: 45, memo: 'トラブルシューティング', mood_rating: 2, session_type: 'manual', studied_at: '2025-09-09T16:30' },

  // Dockerfileの作成
  { id: 104, user_id: 1, learning_content_id: 4, section_id: 75, study_minutes: 240, memo: 'Dockerfile作成の基礎', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-10T09:00' },
  { id: 105, user_id: 1, learning_content_id: 4, section_id: 75, study_minutes: 180, memo: 'FROM, RUN, CMD命令', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-10T14:00' },
  { id: 106, user_id: 1, learning_content_id: 4, section_id: 75, study_minutes: 120, memo: 'COPY vs ADD', mood_rating: 5, session_type: 'manual', studied_at: '2025-09-11T09:30' },
  { id: 107, user_id: 1, learning_content_id: 4, section_id: 75, study_minutes: 90, memo: 'ENV変数の設定', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-11T11:30' },
  { id: 108, user_id: 1, learning_content_id: 4, section_id: 75, study_minutes: 150, memo: 'ベストプラクティス', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-11T14:00' },
  { id: 109, user_id: 1, learning_content_id: 4, section_id: 75, study_minutes: 60, memo: '.dockerignoreの活用', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-11T16:30' },

  // ボリュームとデータ永続化
  { id: 110, user_id: 1, learning_content_id: 4, section_id: 76, study_minutes: 120, memo: 'ボリュームマウントの設定', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-12T09:00' },
  { id: 111, user_id: 1, learning_content_id: 4, section_id: 76, study_minutes: 180, memo: 'bind mountとvolume', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-12T10:30' },
  { id: 112, user_id: 1, learning_content_id: 4, section_id: 76, study_minutes: 90, memo: 'データの永続化戦略', mood_rating: 5, session_type: 'manual', studied_at: '2025-09-12T15:00' },

  // ネットワーキング
  { id: 113, user_id: 1, learning_content_id: 4, section_id: 77, study_minutes: 160, memo: 'ブリッジネットワークの構築', mood_rating: 2, session_type: 'manual', studied_at: '2025-09-13T09:00' },
  { id: 114, user_id: 1, learning_content_id: 4, section_id: 77, study_minutes: 120, memo: 'コンテナ間通信', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-13T11:00' },
  { id: 115, user_id: 1, learning_content_id: 4, section_id: 77, study_minutes: 90, memo: 'ポートマッピング', mood_rating: 5, session_type: 'manual', studied_at: '2025-09-13T14:00' },
  { id: 116, user_id: 1, learning_content_id: 4, section_id: 77, study_minutes: 150, memo: 'カスタムネットワーク作成', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-14T09:30' },
  { id: 117, user_id: 1, learning_content_id: 4, section_id: 77, study_minutes: 60, memo: 'DNSとサービス検出', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-14T14:00' },

  // Docker Compose入門
  { id: 118, user_id: 1, learning_content_id: 4, section_id: 78, study_minutes: 200, memo: 'docker-compose.ymlの作成', mood_rating: 5, session_type: 'manual', studied_at: '2025-09-15T09:00' },
  { id: 119, user_id: 1, learning_content_id: 4, section_id: 78, study_minutes: 180, memo: 'サービスの定義', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-15T14:00' },
  { id: 120, user_id: 1, learning_content_id: 4, section_id: 78, study_minutes: 120, memo: 'depends_onの使い方', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-16T09:30' },
  { id: 121, user_id: 1, learning_content_id: 4, section_id: 78, study_minutes: 90, memo: '環境変数の管理', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-16T11:30' },
  { id: 122, user_id: 1, learning_content_id: 4, section_id: 78, study_minutes: 150, memo: 'ボリュームの共有', mood_rating: 5, session_type: 'manual', studied_at: '2025-09-16T14:00' },
  { id: 123, user_id: 1, learning_content_id: 4, section_id: 78, study_minutes: 75, memo: 'スケーリング設定', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-17T10:00' },
  { id: 124, user_id: 1, learning_content_id: 4, section_id: 78, study_minutes: 60, memo: 'コマンド操作', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-17T14:30' },

  // マルチステージビルド
  { id: 125, user_id: 1, learning_content_id: 4, section_id: 79, study_minutes: 180, memo: 'ビルドの最適化テクニック', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-18T09:00' },
  { id: 126, user_id: 1, learning_content_id: 4, section_id: 79, study_minutes: 120, memo: 'レイヤーキャッシュの活用', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-18T14:00' },
  { id: 127, user_id: 1, learning_content_id: 4, section_id: 79, study_minutes: 90, memo: 'イメージサイズ削減', mood_rating: 5, session_type: 'manual', studied_at: '2025-09-19T10:00' },
  { id: 128, user_id: 1, learning_content_id: 4, section_id: 79, study_minutes: 60, memo: '本番用イメージの作成', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-19T15:00' },

  // セキュリティとベストプラクティス
  { id: 129, user_id: 1, learning_content_id: 4, section_id: 80, study_minutes: 150, memo: 'セキュリティベストプラクティス', mood_rating: 3, session_type: 'manual', studied_at: '2025-09-20T09:00' },
  { id: 130, user_id: 1, learning_content_id: 4, section_id: 80, study_minutes: 120, memo: 'rootlessコンテナ', mood_rating: 2, session_type: 'manual', studied_at: '2025-09-20T14:00' },
  { id: 131, user_id: 1, learning_content_id: 4, section_id: 80, study_minutes: 90, memo: 'イメージスキャン', mood_rating: 4, session_type: 'manual', studied_at: '2025-09-21T10:00' },
]);
