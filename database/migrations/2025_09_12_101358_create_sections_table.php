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
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_content_id')->constrained('learning_contents')->onDelete('cascade');
            $table->string('title')->nullable(false);
            $table->integer('order')->nullable(false);
            $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // インデックス追加
            $table->index(['learning_content_id', 'order']); // 複合インデックス
            $table->index('status');

            // ユニーク制約
            $table->unique(['learning_content_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
