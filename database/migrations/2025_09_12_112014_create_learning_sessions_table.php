<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('learning_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('learning_content_id')->constrained('learning_contents')->onDelete('cascade');
            $table->foreignId('section_id')->constrained('sections')->onDelete('cascade');
            $table->integer('study_minutes')->nullable(false);
            $table->text('memo')->nullable();
            $table->integer('mood_rating')->nullable();
            $table->enum('session_type', ['manual', 'stopwatch'])->default('manual');
            $table->timestamp('studied_at');
            $table->timestamps();
            
            // インデックス追加
            $table->index('studied_at');
            $table->index(['user_id', 'studied_at']); // 複合インデックス（ユーザー別の学習履歴取得用）
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_sessions');
    }
};
