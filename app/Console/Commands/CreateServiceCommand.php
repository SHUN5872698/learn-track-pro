<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class CreateServiceCommand extends Command
{
    protected $signature = 'make:service {name : The name of the service class (e.g., User/AvatarService)}';
    protected $description = 'Create a new service class';

    public function handle(): void
    {
        $name = $this->argument('name');

        // パス解析（User/AvatarService → ['User', 'AvatarService']）
        $parts = explode('/', $name);
        $className = array_pop($parts);
        $subDirectory = implode('/', $parts);

        // ディレクトリパス
        $directoryPath = app_path('Services' . ($subDirectory ? '/' . $subDirectory : ''));

        // ファイルパス
        $filePath = $directoryPath . '/' . $className . '.php';

        // 名前空間
        $namespace = 'App\\Services' . ($subDirectory ? '\\' . str_replace('/', '\\', $subDirectory) : '');

        // ディレクトリ作成
        if (!File::exists($directoryPath)) {
            File::makeDirectory($directoryPath, 0755, true);
        }

        // ファイル存在チェック
        if (File::exists($filePath)) {
            $this->error("Service already exists: {$filePath}");
            return;
        }

        // テンプレート
        $content = <<<PHP
        <?php
        namespace {$namespace};
        class {$className}
        {
          //
        }
        PHP;
        File::put($filePath, $content);
        $this->info("Service created successfully: {$filePath}");
    }
}
