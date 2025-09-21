<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLearningSessionRequest extends FormRequest
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
            'learning_content_id' => ['required', 'integer', 'exists:learning_contents,id'],
            'section_id' => ['required', 'integer', 'exists:sections,id'],
            'study_minutes' => ['required', 'integer', 'min:1', 'max:1440'],
            'memo' => ['nullable', 'string', 'max:1000'],
            'mood_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'session_type' => ['required', 'string', 'in:manual,stopwatch'],
            'studied_at' => ['required', 'date'],
        ];
    }
}
