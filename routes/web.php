<?php

use Illuminate\Support\Facades\Route;

// パスワードリセット用のルート
Route::get('/reset-password/{token}', function ($token) {
    return view('app'); // SPAのエントリーポイントを返す
})->middleware('guest')->name('password.reset');

// SPAのキャッチオール
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
