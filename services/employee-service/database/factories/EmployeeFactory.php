<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition(): array
    {
        return [
            'user_id' => $this->faker->unique()->numberBetween(1, 100000),
            'nama_lengkap' => $this->faker->name(),
            'nomor_induk_karyawan' => sprintf('%d.%02d.%05d',
                $this->faker->numberBetween(2020, 2026),
                $this->faker->numberBetween(1, 12),
                $this->faker->unique()->numberBetween(1, 99999)),
            'alamat' => $this->faker->address(),
            'branch_id' => Branch::factory(),
            'position_id' => Position::factory(),
            'tanggal_gabung' => $this->faker->date(),
            'tanggal_mulai_kontrak' => $this->faker->date(),
            'tanggal_akhir_kontrak' => null,
            'status' => 'aktif',
        ];
    }
}
