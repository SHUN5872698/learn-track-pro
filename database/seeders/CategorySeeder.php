<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'id' => 1,
                'name' => 'Programming',
                'icon' => 'programming-icon.png',
                'description' => 'プログラミング言語、フレームワーク、ライブラリ',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 2,
                'name' => 'Infrastructure',
                'icon' => 'infrastructure-icon.png',
                'description' => 'サーバー、ネットワーク、クラウド、コンテナ技術',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 3,
                'name' => 'Service',
                'icon' => 'service-icon.png',
                'description' => 'Webサービス、開発ツール、生産性向上ツール',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 4,
                'name' => 'Development',
                'icon' => 'development-icon.png',
                'description' => '設計、開発手法、プロジェクト管理、実践的な開発',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 5,
                'name' => 'AI',
                'icon' => 'ai-icon.png',
                'description' => 'AI、機械学習、LLM、プロンプトエンジニアリング',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 6,
                'name' => 'Other',
                'icon' => 'other-icon.png',
                'description' => 'ビジネススキル、マインドセット、その他の学習',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::updateOrCreate(
                ['id' => $categoryData['id']],
                $categoryData
            );
        }
    }
}
