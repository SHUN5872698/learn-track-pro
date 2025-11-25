<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningSession extends Model
{
    use HasFactory;

    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'learning_content_id',
        'section_id',
        'study_minutes',
        'memo',
        'mood_rating',
        'session_type',
        'studied_at',
    ];

    /**
     * 属性のデフォルト値
     *
     * @var array
     */
    protected $attributes = [
        'session_type' => 'manual',
    ];

    /**
     * 属性の型キャスト定義
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'user_id' => 'integer',
            'learning_content_id' => 'integer',
            'section_id' => 'integer',
            'study_minutes' => 'integer',
            'memo' => 'string',
            'mood_rating' => 'integer',
            'session_type' => 'string',
            'studied_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * この学習記録を作成したユーザーを取得
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * この学習記録に関連する学習コンテンツを取得
     *
     * @return BelongsTo
     */
    public function learningContent(): BelongsTo
    {
        return $this->belongsTo(LearningContent::class);
    }

    /**
     * この学習記録に関連するセクションを取得
     *
     * @return BelongsTo
     */
    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
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
