<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PushNotificationRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'user_ids' => ['required', 'array', 'min:1'],
            'user_ids.*' => ['required', 'integer', 'min:1'],
            'type' => ['required', 'string', 'max:100'],
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'reference_id' => ['nullable', 'integer'],
        ];
    }
}
