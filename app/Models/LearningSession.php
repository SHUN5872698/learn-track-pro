<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningSession extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
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
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'user_id' => 'integer',
        'learning_content_id' => 'integer',
        'section_id' => 'integer',
        'study_minutes' => 'integer',
        'mood_rating' => 'integer',
        'studied_at' => 'datetime',
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'session_type' => 'manual',
    ];
}
