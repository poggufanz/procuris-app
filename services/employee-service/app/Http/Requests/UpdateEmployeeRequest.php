<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'user_id'                 => ['required', 'integer', Rule::unique('employees', 'user_id')->ignore($id)],
            'nama_lengkap'            => ['required', 'string', 'max:150'],
            'nomor_induk_karyawan'    => ['required', 'string', 'max:30', Rule::unique('employees', 'nomor_induk_karyawan')->ignore($id)],
            'alamat'                  => ['required', 'string'],
            'branch_id'               => ['required', 'integer', 'exists:branches,id'],
            'position_id'             => ['required', 'integer', 'exists:positions,id'],
            'tanggal_gabung'          => ['required', 'date'],
            'tanggal_mulai_kontrak'   => ['required', 'date'],
            'tanggal_akhir_kontrak'   => ['nullable', 'date'],
            'status'                  => ['required', 'in:aktif,nonaktif,kontrak_berakhir'],
        ];
    }
}
