<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VendorIndexRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'is_active' => ['nullable', 'boolean'],
            'search' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'between:1,100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
