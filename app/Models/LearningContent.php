<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LearningContent extends Model
{
    use HasFactory;

    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'technology_id',
        'title',
        'description',
        'total_sections',
        'completed_sections',
        'status',
        'completed_at',
    ];

    /**
     * 属性のデフォルト値
     *
     * @var array
     */
    protected $attributes = [
        'total_sections' => 0,
        'completed_sections' => 0,
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
            'user_id' => 'integer',
            'technology_id' => 'integer',
            'total_sections' => 'integer',
            'completed_sections' => 'integer',
            'status' => 'string',
            'completed_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * この学習内容を作成したユーザーを取得
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * この学習内容が使用している技術を取得
     *
     * @return BelongsTo
     */
    public function technology(): BelongsTo
    {
        return $this->belongsTo(Technology::class);
    }

    /**
     * この学習内容に含まれるセクションを取得
     *
     * @return HasMany
     */
    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }

    /**
     * この学習内容の学習記録を取得
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
