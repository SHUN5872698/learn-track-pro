<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TechnologyController;
use App\Http\Controllers\LearningContentController;

// 認証不要のマスターデータAPI
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/technologies', [TechnologyController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'me']);
    Route::put('/user/profile', [UserController::class, 'profile']);

    Route::apiResource('learning-contents', LearningContentController::class);
    Route::put('/learning-contents/{learning_content}/complete', [LearningContentController::class, 'complete']);
    Route::put('/learning-contents/{learning_content}/reopen', [LearningContentController::class, 'reopen']);
});
