<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVendorRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $id = $this->route('id');
        return [
            'name' => ['required', 'string', 'max:150'],
            'code' => ['required', 'string', 'max:30', Rule::unique('vendors', 'code')->ignore($id)],
            'contact_person' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],
            'address' => ['required', 'string'],
            'npwp' => ['nullable', 'string', 'max:30'],
            'payment_term_days' => ['required', 'integer', 'min:0', 'max:3650'],
            'is_active' => ['boolean'],
        ];
    }
}
