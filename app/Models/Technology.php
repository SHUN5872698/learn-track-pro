<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Technology extends Model
{
    use HasFactory;

    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'category_id',
        'name',
        'icon',
    ];

    /**
     * 属性の型キャスト定義
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'category_id' => 'integer',
            'name' => 'string',
            'icon' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * この技術が属するカテゴリーを取得
     *
     * @return BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * この技術を使用している学習コンテンツを取得
     *
     * @return HasMany
     */
    public function learningContents(): HasMany
    {
        return $this->hasMany(LearningContent::class);
    }

    /**
     * 日付を配列/JSON用にフォーマット
     *
     * @param DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s');
    }

    /**
     * カテゴリー別の技術を取得するスコープ
     *
     * @param \\Illuminate\\Database\\Eloquent\\Builder $query
     * @param int $categoryId
     * @return \\Illuminate\\Database\\Eloquent\\Builder
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }
}
