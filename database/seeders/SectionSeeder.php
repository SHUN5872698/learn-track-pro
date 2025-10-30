<?php

namespace Database\Seeders;

use App\Models\Section;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sections = [
            // Laravel完全マスター (ID: 1) - 20セクション
            ['id' => 1, 'learning_content_id' => 1, 'title' => 'イントロダクション', 'order' => 1, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 2, 'learning_content_id' => 1, 'title' => '環境構築', 'order' => 2, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 3, 'learning_content_id' => 1, 'title' => 'ルーティング', 'order' => 3, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 4, 'learning_content_id' => 1, 'title' => 'コントローラー', 'order' => 4, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 5, 'learning_content_id' => 1, 'title' => 'ビュー', 'order' => 5, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 6, 'learning_content_id' => 1, 'title' => 'データベース設計', 'order' => 6, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 7, 'learning_content_id' => 1, 'title' => 'Eloquent ORM', 'order' => 7, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 8, 'learning_content_id' => 1, 'title' => 'フォーム処理', 'order' => 8, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 9, 'learning_content_id' => 1, 'title' => '認証システム', 'order' => 9, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 10, 'learning_content_id' => 1, 'title' => 'ミドルウェア', 'order' => 10, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 11, 'learning_content_id' => 1, 'title' => 'API開発', 'order' => 11, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 12, 'learning_content_id' => 1, 'title' => 'テスト', 'order' => 12, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 13, 'learning_content_id' => 1, 'title' => 'キューとジョブ', 'order' => 13, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 14, 'learning_content_id' => 1, 'title' => 'イベントとリスナー', 'order' => 14, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 15, 'learning_content_id' => 1, 'title' => '通知システム', 'order' => 15, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 16, 'learning_content_id' => 1, 'title' => 'ファイルストレージ', 'order' => 16, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 17, 'learning_content_id' => 1, 'title' => 'キャッシュ', 'order' => 17, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 18, 'learning_content_id' => 1, 'title' => 'パフォーマンス最適化', 'order' => 18, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 19, 'learning_content_id' => 1, 'title' => 'セキュリティ', 'order' => 19, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],
            ['id' => 20, 'learning_content_id' => 1, 'title' => 'デプロイ', 'order' => 20, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-08-25 00:00:00')],

            // Vue.js 3 実践ガイド (ID: 2) - 15セクション（9完了、6未完了）
            ['id' => 21, 'learning_content_id' => 2, 'title' => 'Vue.jsの基本', 'order' => 1, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-14 18:00:00')],
            ['id' => 22, 'learning_content_id' => 2, 'title' => 'Composition API', 'order' => 2, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-14 18:00:00')],
            ['id' => 23, 'learning_content_id' => 2, 'title' => 'Vue Router', 'order' => 3, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-14 18:00:00')],
            ['id' => 24, 'learning_content_id' => 2, 'title' => 'Vuex/Pinia', 'order' => 4, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-14 18:00:00')],
            ['id' => 25, 'learning_content_id' => 2, 'title' => 'コンポーネント設計', 'order' => 5, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-14 18:00:00')],
            ['id' => 26, 'learning_content_id' => 2, 'title' => 'TypeScript統合', 'order' => 6, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-14 18:00:00')],
            ['id' => 27, 'learning_content_id' => 2, 'title' => 'テスト戦略', 'order' => 7, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-14 18:00:00')],
            ['id' => 28, 'learning_content_id' => 2, 'title' => 'パフォーマンス最適化', 'order' => 8, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-14 18:00:00')],
            ['id' => 29, 'learning_content_id' => 2, 'title' => 'SSRとNuxt.js', 'order' => 9, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-14 18:00:00')],
            ['id' => 30, 'learning_content_id' => 2, 'title' => 'カスタムディレクティブ', 'order' => 10, 'status' => 'not_started', 'completed_at' => null],
            ['id' => 31, 'learning_content_id' => 2, 'title' => 'プラグイン開発', 'order' => 11, 'status' => 'not_started', 'completed_at' => null],
            ['id' => 32, 'learning_content_id' => 2, 'title' => 'アニメーション', 'order' => 12, 'status' => 'not_started', 'completed_at' => null],
            ['id' => 33, 'learning_content_id' => 2, 'title' => '国際化（i18n）', 'order' => 13, 'status' => 'not_started', 'completed_at' => null],
            ['id' => 34, 'learning_content_id' => 2, 'title' => 'PWA対応', 'order' => 14, 'status' => 'not_started', 'completed_at' => null],
            ['id' => 35, 'learning_content_id' => 2, 'title' => 'デプロイ戦略', 'order' => 15, 'status' => 'not_started', 'completed_at' => null],

            // React基礎からNext.jsまで (ID: 3) - 10セクション（6完了、4未完了）
            ['id' => 36, 'learning_content_id' => 3, 'title' => 'Reactの基礎', 'order' => 1, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 37, 'learning_content_id' => 3, 'title' => 'Hooks詳解', 'order' => 2, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 38, 'learning_content_id' => 3, 'title' => 'Context API', 'order' => 3, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 39, 'learning_content_id' => 3, 'title' => 'Redux基礎', 'order' => 4, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 40, 'learning_content_id' => 3, 'title' => 'React Router', 'order' => 5, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 41, 'learning_content_id' => 3, 'title' => 'パフォーマンス最適化', 'order' => 6, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 42, 'learning_content_id' => 3, 'title' => 'Next.js入門', 'order' => 7, 'status' => 'not_started', 'completed_at' => null],
            ['id' => 43, 'learning_content_id' => 3, 'title' => 'SSRとSSG', 'order' => 8, 'status' => 'not_started', 'completed_at' => null],
            ['id' => 44, 'learning_content_id' => 3, 'title' => 'APIルート', 'order' => 9, 'status' => 'not_started', 'completed_at' => null],
            ['id' => 45, 'learning_content_id' => 3, 'title' => 'データフェッチング', 'order' => 10, 'status' => 'not_started', 'completed_at' => null],

            // PHP8.5の内容確認 (ID: 5) - 10セクション（全て完了）
            ['id' => 50, 'learning_content_id' => 5, 'title' => 'PHP8.5 RFCの概要', 'order' => 1, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 51, 'learning_content_id' => 5, 'title' => 'JITコンパイラの改善', 'order' => 2, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 52, 'learning_content_id' => 5, 'title' => '新しい配列関数', 'order' => 3, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 53, 'learning_content_id' => 5, 'title' => 'Random拡張の改善', 'order' => 4, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 54, 'learning_content_id' => 5, 'title' => 'クラスの新機能', 'order' => 5, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 55, 'learning_content_id' => 5, 'title' => '型システムの強化', 'order' => 6, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 56, 'learning_content_id' => 5, 'title' => '非推奨機能の削除', 'order' => 7, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 57, 'learning_content_id' => 5, 'title' => 'パフォーマンス改善', 'order' => 8, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 58, 'learning_content_id' => 5, 'title' => 'セキュリティ強化', 'order' => 9, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 59, 'learning_content_id' => 5, 'title' => '移行ガイド', 'order' => 10, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],

            // Dockerの基礎学習 (ID: 4) - 10セクション
            ['id' => 71, 'learning_content_id' => 4, 'title' => 'Dockerの概要と仮想化技術', 'order' => 1, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 72, 'learning_content_id' => 4, 'title' => 'Dockerのインストールと環境構築', 'order' => 2, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 73, 'learning_content_id' => 4, 'title' => 'Dockerイメージの基本', 'order' => 3, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 74, 'learning_content_id' => 4, 'title' => 'コンテナの作成と管理', 'order' => 4, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 75, 'learning_content_id' => 4, 'title' => 'Dockerfileの作成', 'order' => 5, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 76, 'learning_content_id' => 4, 'title' => 'ボリュームとデータ永続化', 'order' => 6, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 77, 'learning_content_id' => 4, 'title' => 'ネットワーキング', 'order' => 7, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 78, 'learning_content_id' => 4, 'title' => 'Docker Compose入門', 'order' => 8, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 79, 'learning_content_id' => 4, 'title' => 'マルチステージビルド', 'order' => 9, 'status' => 'completed', 'completed_at' => Carbon::parse('2024-01-10 09:00:00')],
            ['id' => 80, 'learning_content_id' => 4, 'title' => 'セキュリティとベストプラクティス', 'order' => 10, 'status' => 'in_progress', 'completed_at' => null],
        ];

        foreach ($sections as $sectionData) {
            Section::updateOrCreate(
                ['id' => $sectionData['id']],
                array_merge($sectionData, [
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ])
            );
        }
    }
}
