<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TechnologyController;
use App\Http\Controllers\LearningContentController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\LearningSessionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| エンドポイント一覧:
| - 公開API: カテゴリー、技術情報
| - 認証API: ユーザー、学習内容、セクション、学習セッション、統計
|
*/

// ============================================
// 公開API（認証不要）
// ============================================
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/technologies', [TechnologyController::class, 'index']);

// ============================================
// 認証が必要なAPI
// ============================================
Route::middleware('auth:sanctum')->group(function () {

    // ----------------------------------------
    // ユーザー管理
    // ----------------------------------------
    Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'me']);
        Route::put('/profile', [UserController::class, 'profile']);
    });

    // ----------------------------------------
    // 学習内容管理
    // ----------------------------------------
    Route::apiResource('learning-contents', LearningContentController::class);

    Route::prefix('learning-contents/{learningContent}')->group(function () {
        // ステータス操作
        Route::put('complete', [LearningContentController::class, 'complete']);
        Route::put('reopen', [LearningContentController::class, 'reopen']);

        // セクション関連
        Route::get('sections', [SectionController::class, 'index']);
        Route::put('sections/bulk', [SectionController::class, 'bulkUpdate']);

        // 学習セッション
        Route::get('sessions', [LearningSessionController::class, 'byContent']);
    });

    // 特定コンテンツの統計
    Route::get(
        'learning-contents/{contentId}/statistics/daily',
        [LearningSessionController::class, 'dailyStatisticsByContent']
    );

    // ----------------------------------------
    // セクション管理
    // ----------------------------------------
    Route::prefix('sections')->group(function () {
        Route::post('/', [SectionController::class, 'store']);
        Route::put('{section}', [SectionController::class, 'update']);
        Route::delete('{section}', [SectionController::class, 'destroy']);
        Route::put('{section}/status', [SectionController::class, 'updateStatus']);
        Route::get('{section}/sessions', [LearningSessionController::class, 'bySection']);
    });

    // ----------------------------------------
    // 学習セッション管理
    // ----------------------------------------
    // CRUD操作
    Route::apiResource('learning-sessions', LearningSessionController::class);

    // 統計情報（グループ化）
    Route::prefix('learning-sessions/statistics')->group(function () {
        Route::get('summary', [LearningSessionController::class, 'statisticsSummary']);
        Route::get('monthly', [LearningSessionController::class, 'monthlyStatistics']);
        Route::get('daily', [LearningSessionController::class, 'dailyStatistics']);
        Route::get('by-technology', [LearningSessionController::class, 'technologyStatistics']);
        Route::get('latest-by-content', [LearningSessionController::class, 'latestByContent']);
    });
});
