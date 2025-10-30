<?php

namespace Database\Seeders;

use App\Models\LearningContent;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class LearningContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $learningContents = [
            [
                'id' => 1,
                'user_id' => 1,
                'technology_id' => 1,
                'title' => 'Laravel完全マスター',
                'description' => 'Laravelの基礎から応用まで、実践的なWebアプリケーション開発を学習',
                'total_sections' => 20,
                'completed_sections' => 20,
                'status' => 'completed',
                'completed_at' => Carbon::parse('2024-08-25 00:00:00'),
            ],
            [
                'id' => 2,
                'user_id' => 1,
                'technology_id' => 2,
                'title' => 'Vue.js 3 実践ガイド',
                'description' => 'Vue.js 3のComposition APIとTypeScriptを使ったモダンなフロントエンド開発',
                'total_sections' => 15,
                'completed_sections' => 9,
                'status' => 'in_progress',
                'completed_at' => null,
            ],
            [
                'id' => 3,
                'user_id' => 1,
                'technology_id' => 3,
                'title' => 'React基礎からNext.jsまで',
                'description' => 'Reactの基礎概念からNext.jsを使った本格的なWebアプリケーション開発まで',
                'total_sections' => 10,
                'completed_sections' => 6,
                'status' => 'in_progress',
                'completed_at' => null,
            ],
            [
                'id' => 4,
                'user_id' => 1,
                'technology_id' => 18,
                'title' => 'Dockerの基礎学習',
                'description' => 'コンテナ化の基礎とDockerの再確認',
                'total_sections' => 10,
                'completed_sections' => 9,
                'status' => 'in_progress',
                'completed_at' => null,
            ],
            [
                'id' => 5,
                'user_id' => 1,
                'technology_id' => 4,
                'title' => 'PHP8.5の内容確認',
                'description' => 'PHP8.5で実装されるRFCの確認',
                'total_sections' => 10,
                'completed_sections' => 10,
                'status' => 'in_progress',
                'completed_at' => null,
            ],
            [
                'id' => 999,
                'user_id' => 1,
                'technology_id' => 39,
                'title' => '0件テスト',
                'description' => '0件テスト',
                'total_sections' => 0,
                'completed_sections' => 0,
                'status' => 'not_started',
                'completed_at' => null,
            ],
        ];

        foreach ($learningContents as $learningContentData) {
            LearningContent::updateOrCreate(
                ['id' => $learningContentData['id']],
                array_merge($learningContentData, [
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ])
            );
        }
    }
}
