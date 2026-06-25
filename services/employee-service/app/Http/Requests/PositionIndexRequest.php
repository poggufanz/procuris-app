<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PositionIndexRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'division'  => ['nullable', 'string', 'max:100'],
            'search'    => ['nullable', 'string', 'max:100'],
        ];
    }
}
