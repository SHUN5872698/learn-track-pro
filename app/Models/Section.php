<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    use HasFactory;

    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'learning_content_id',
        'title',
        'order',
        'status',
        'completed_at',
    ];

    /**
     * 属性のデフォルト値
     *
     * @var array
     */
    protected $attributes = [
        'status' => 'not_started',
    ];

    /**
     * 属性の型キャスト定義
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'learning_content_id' => 'integer',
            'title' => 'string',
            'order' => 'integer',
            'status' => 'string',
            'completed_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * このセクションに関連する学習内容を取得
     *
     * @return BelongsTo
     */
    public function learningContent(): BelongsTo
    {
        return $this->belongsTo(LearningContent::class);
    }

    /**
     * このセクションの学習記録を取得
     *
     * @return HasMany
     */
    public function learningSessions(): HasMany
    {
        return $this->hasMany(LearningSession::class);
    }

    /**
     * 日付を配列/JSON用にフォーマット
     *
     * @param DateTimeInterface $date
     * @return string
     * @phpstan-param \DateTime|\Carbon\Carbon $date
     */
    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s');
    }
}
