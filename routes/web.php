<?php

use Illuminate\Support\Facades\Route;

// パスワードリセット用のルート
Route::get('/reset-password/{token}', function ($token) {
    // とりあえずホームにリダイレクト（後で実装予定）
    return redirect('/');
})->name('password.reset');

// SPAのキャッチオール
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
