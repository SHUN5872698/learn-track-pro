<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLearningSessionRequest extends FormRequest
{
    /**
     * ユーザーがこのリクエストを行うことを承認されているか判定
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * リクエストに適用されるバリデーションルールを取得
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'learning_content_id' => ['sometimes', 'integer', 'exists:learning_contents,id'],
            'section_id' => ['sometimes', 'integer', 'exists:sections,id'],
            'study_minutes' => ['sometimes', 'integer', 'min:1', 'max:1439'],
            'session_type' => ['sometimes', 'string', 'in:manual,stopwatch'],
            'studied_at' => ['sometimes', 'date', 'before_or_equal:now'],

            // 任意項目
            'memo' => ['nullable', 'string', 'max:500'],
            'mood_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
        ];
    }
}
