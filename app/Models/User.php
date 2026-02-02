<?php

namespace App\Models;

use DateTimeInterface;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
    ];

    /**
     * JSONシリアライズ時に非表示にする属性
     *
     * @var array<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * JSONレスポンスに追加する動的属性
     *
     * @var array<string>
     */
    protected $appends = ['has_avatar', 'initials'];

    /**
     * 属性の型キャスト定義
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'avatar' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * このユーザーが作成した学習内容を取得
     *
     * @return HasMany
     */
    public function learningContents(): HasMany
    {
        return $this->hasMany(LearningContent::class);
    }

    /**
     * このユーザーの学習記録を取得
     *
     * @return HasMany
     */
    public function learningSessions(): HasMany
    {
        return $this->hasMany(LearningSession::class);
    }

    /**
     * プロフィール画像の有無を判定
     *
     * @return bool
     */
    public function getHasAvatarAttribute(): bool
    {
        return !empty($this->avatar);
    }

    /**
     * プロフィール画像のURLを取得
     *
     * @return string|null
     */
    public function getAvatarAttribute(?string $value): ?string
    {
        if (empty($value)) {
            return null;
        }
        // publicディレクトリからの相対パスでURLを生成
        return Storage::disk('public')->url('images/avatars/' . $value);
    }

    /**
     * プロフィール画像未設定時に表示するイニシャルを生成
     *
     * @return string
     */
    public function getInitialsAttribute(): string
    {
        if (!$this->name) {
            return '';
        }

        $trimmedName = trim($this->name);

        // 日本語の文字が含まれているかチェック
        if (preg_match('/[　-〿぀-ゟ゠-ヿ一-鿿]/u', $trimmedName)) {
            // 日本語名の場合、最初の2文字を返す
            return mb_substr($trimmedName, 0, 2);
        } else {
            // 英語名の場合
            $parts = array_filter(explode(' ', $trimmedName));
            if (count($parts) > 1) {
                // 複数の単語がある場合、各単語の頭文字を結合
                return implode('', array_map(fn($part) => strtoupper($part[0]), $parts));
            } elseif (strlen($trimmedName) > 1) {
                // 単語が1つで2文字以上の場合
                return strtoupper(substr($trimmedName, 0, 2));
            } else {
                // 1文字のみの場合
                return strtoupper($trimmedName);
            }
        }
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
