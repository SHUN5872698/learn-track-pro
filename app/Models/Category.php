<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    /**
     * カテゴリー名の定数定義
     */
    const PROGRAMMING = 'Programming';
    const INFRASTRUCTURE = 'Infrastructure';
    const SERVICE = 'Service';
    const DEVELOPMENT = 'Development';
    const AI = 'AI';
    const OTHER = 'Other';

    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'icon',
        'description',
    ];

    /**
     * 属性の型キャスト定義
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'name' => 'string',
            'icon' => 'string',
            'description' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * このカテゴリーに属する技術を取得
     *
     * @return HasMany
     */
    public function technologies(): HasMany
    {
        return $this->hasMany(Technology::class);
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
}
