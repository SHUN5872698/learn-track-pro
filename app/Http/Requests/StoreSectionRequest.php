<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSectionRequest extends FormRequest
{
    /**
     * ユーザーがこのリクエストを行うことを承認されているか判定
     */
    public function authorize(): bool
    {
        // 認可はコントローラーのGateで行うため、ここではtrueを返す
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
            'title' => ['required', 'string', 'max:50'],
            'order' => ['required', 'integer', 'min:1'],
        ];
    }
}
