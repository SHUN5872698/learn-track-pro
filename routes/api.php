<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TechnologyController;
use App\Http\Controllers\LearningContentController;
use App\Http\Controllers\SectionController;

// 認証不要のマスターデータAPI
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/technologies', [TechnologyController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', [UserController::class, 'me']);
    Route::put('/user/profile', [UserController::class, 'profile']);

    // LearningContent routes
    Route::apiResource('learning-contents', LearningContentController::class);
    Route::put('/learning-contents/{learning_content}/complete', [LearningContentController::class, 'complete']);
    Route::put('/learning-contents/{learning_content}/reopen', [LearningContentController::class, 'reopen']);

    // Section routes
    Route::get('/learning-contents/{learningContent}/sections', [SectionController::class, 'index']);
    Route::post('/sections', [SectionController::class, 'store']);
    Route::put('/sections/{section}', [SectionController::class, 'update']);
    Route::delete('/sections/{section}', [SectionController::class, 'destroy']);
    Route::put('/sections/{section}/status', [SectionController::class, 'updateStatus']);
    Route::put('/learning-contents/{learningContent}/sections/bulk', [SectionController::class, 'bulkUpdate']);
});
