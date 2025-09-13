<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningContent extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
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
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'user_id' => 'integer',
        'technology_id' => 'integer',
        'total_sections' => 'integer',
        'completed_sections' => 'integer',
        'completed_at' => 'datetime',
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'total_sections' => 0,
        'completed_sections' => 0,
        'status' => 'not_started',
    ];
}
