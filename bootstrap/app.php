<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withProviders([
        App\Providers\FortifyServiceProvider::class,
    ])
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();

        $middleware->redirectGuestsTo(fn($guard) => match ($guard) {
            'web' => '/login',     // webガードの場合は/loginにリダイレクト
            default => '/login',   // その他のガード（apiなど）も/loginにリダイレクト
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
