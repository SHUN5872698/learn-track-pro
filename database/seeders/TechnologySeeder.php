<?php

namespace Database\Seeders;

use App\Models\Technology;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TechnologySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $technologies = [
            // Programming
            ['id' => 1, 'category_id' => 1, 'name' => 'Laravel', 'icon' => 'laravel-icon.png'],
            ['id' => 2, 'category_id' => 1, 'name' => 'Vue.js', 'icon' => 'vue-icon.png'],
            ['id' => 3, 'category_id' => 1, 'name' => 'React', 'icon' => 'react-icon.png'],
            ['id' => 4, 'category_id' => 1, 'name' => 'PHP', 'icon' => 'php-icon.png'],
            ['id' => 5, 'category_id' => 1, 'name' => 'JavaScript', 'icon' => 'javascript-icon.png'],
            ['id' => 6, 'category_id' => 1, 'name' => 'TypeScript', 'icon' => 'typescript-icon.png'],
            ['id' => 7, 'category_id' => 1, 'name' => 'Python', 'icon' => 'python-icon.png'],
            ['id' => 8, 'category_id' => 1, 'name' => 'Ruby', 'icon' => 'ruby-icon.png'],
            ['id' => 9, 'category_id' => 1, 'name' => 'Java', 'icon' => 'java-icon.png'],
            ['id' => 10, 'category_id' => 1, 'name' => 'HTML', 'icon' => 'html-icon.png'],
            ['id' => 11, 'category_id' => 1, 'name' => 'CSS', 'icon' => 'css-icon.png'],
            ['id' => 12, 'category_id' => 1, 'name' => 'Next.js', 'icon' => 'next-js-icon.png'],
            ['id' => 13, 'category_id' => 1, 'name' => 'TailwindCSS', 'icon' => 'tailwindcss-icon.png'],

            // Infrastructure
            ['id' => 14, 'category_id' => 2, 'name' => 'Linux', 'icon' => 'linux-icon.png'],
            ['id' => 15, 'category_id' => 2, 'name' => 'Nginx', 'icon' => 'nginx-icon.png'],
            ['id' => 16, 'category_id' => 2, 'name' => 'Apache', 'icon' => 'apache-icon.png'],
            ['id' => 17, 'category_id' => 2, 'name' => 'Network', 'icon' => 'network-icon.png'],
            ['id' => 18, 'category_id' => 2, 'name' => 'Docker', 'icon' => 'docker-icon.png'],
            ['id' => 19, 'category_id' => 2, 'name' => 'AWS', 'icon' => 'aws-icon.png'],
            ['id' => 20, 'category_id' => 2, 'name' => 'Azure', 'icon' => 'azure-icon.png'],

            // Service
            ['id' => 21, 'category_id' => 3, 'name' => 'Git', 'icon' => 'git-icon.png'],
            ['id' => 22, 'category_id' => 3, 'name' => 'GitHub', 'icon' => 'github-icon.png'],
            ['id' => 23, 'category_id' => 3, 'name' => 'VSCode', 'icon' => 'vscode-icon.png'],
            ['id' => 24, 'category_id' => 3, 'name' => 'Obsidian', 'icon' => 'obsidian-icon.png'],
            ['id' => 25, 'category_id' => 3, 'name' => 'SendGrid', 'icon' => 'sendgrid-icon.png'],
            ['id' => 26, 'category_id' => 3, 'name' => 'Figma', 'icon' => 'figma-icon.png'],

            // Development
            ['id' => 27, 'category_id' => 4, 'name' => '開発', 'icon' => 'agile-icon.png'],
            ['id' => 28, 'category_id' => 4, 'name' => 'システム設計', 'icon' => 'development-icon.png'],
            ['id' => 29, 'category_id' => 4, 'name' => 'UI/UX設計', 'icon' => 'system-design-icon.png'],
            ['id' => 30, 'category_id' => 4, 'name' => 'アジャイル開発', 'icon' => 'ui:ux-icon.png'],
            ['id' => 31, 'category_id' => 4, 'name' => 'テスト駆動開発', 'icon' => 'test-icon.png'],

            // AI
            ['id' => 32, 'category_id' => 5, 'name' => 'ChatGPT', 'icon' => 'chatgpt-icon.png'],
            ['id' => 33, 'category_id' => 5, 'name' => 'Claude', 'icon' => 'claude-icon.png'],
            ['id' => 34, 'category_id' => 5, 'name' => 'Gemini', 'icon' => 'gemini-icon.png'],
            ['id' => 35, 'category_id' => 5, 'name' => 'LangChain', 'icon' => 'langchain-icon.png'],
            ['id' => 36, 'category_id' => 5, 'name' => 'Prompt Engineering', 'icon' => 'prompt-icon.png'],

            // Other
            ['id' => 37, 'category_id' => 6, 'name' => 'ビジネススキル', 'icon' => 'business-icon.png'],
            ['id' => 38, 'category_id' => 6, 'name' => 'マインドセット', 'icon' => 'mind-icon.png'],
            ['id' => 39, 'category_id' => 6, 'name' => 'その他', 'icon' => 'other-icon.png'],
        ];

        foreach ($technologies as $technologyData) {
            Technology::updateOrCreate(
                ['id' => $technologyData['id']],
                array_merge($technologyData, [
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ])
            );
        }
    }
}
