<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeIndexRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'branch_id'   => ['nullable', 'integer', 'exists:branches,id'],
            'position_id' => ['nullable', 'integer', 'exists:positions,id'],
            'status'      => ['nullable', 'in:aktif,nonaktif,kontrak_berakhir'],
            'search'      => ['nullable', 'string', 'max:100'],
        ];
    }
}
