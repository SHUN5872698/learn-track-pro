<?php

namespace App\Providers;

use App\Models\LearningContent;
use App\Policies\LearningContentPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * アプリケーションのポリシーマッピング
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        LearningContent::class => LearningContentPolicy::class,
    ];

    /**
     * 認証 / 認可サービスを登録
     */
    public function boot(): void
    {
        //
    }
}