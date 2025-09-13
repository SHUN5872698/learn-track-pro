<?php

namespace Database\Seeders;

// use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // マスターデータ（本番でも必須）
        $this->call([
            CategorySeeder::class,
            TechnologySeeder::class,
        ]);
        // 開発環境のみ実行
        if (app()->environment('local', 'staging')) {
            $this->call([
                UserSeeder::class,
                CategorySeeder::class,
                TechnologySeeder::class,
                LearningContentSeeder::class,
            ]);
        }
    }
}
