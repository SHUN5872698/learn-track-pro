<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LearningContentResource extends JsonResource
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
            'technology_id' => $this->technology_id,
            'title' => $this->title,
            'description' => $this->description,
            'total_sections' => $this->total_sections,
            'completed_sections' => $this->completed_sections,
            'status' => $this->status,
            'completed_at' => $this->completed_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'technology' => new TechnologyResource($this->whenLoaded('technology')),
            'sections' => SectionResource::collection($this->whenLoaded('sections')),
        ];
    }
}
