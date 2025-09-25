<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LearningSessionResource extends JsonResource
{
    /**
     * リソースを配列に変換
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'learning_content_id' => $this->learning_content_id,
            'section_id' => $this->section_id,
            'study_minutes' => $this->study_minutes,
            'memo' => $this->memo,
            'mood_rating' => $this->mood_rating,
            'session_type' => $this->session_type,
            'studied_at' => $this->studied_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'learning_content' => new LearningContentResource($this->whenLoaded('learningContent')),
            'section' => new SectionResource($this->whenLoaded('section')),
        ];
    }
}
