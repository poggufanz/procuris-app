<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    // Order matters: on a fresh DB these become user IDs 1..6, referenced by the
    // employee-service (employees.user_id) and purchase-service (requested_by/approved_by).
    public function run(): void
    {
        $users = [
            ['name' => 'Super Admin',              'email' => 'super@procuris.test',      'role' => 'superadmin',       'branch_id' => null],
            ['name' => 'Admin HRD',                'email' => 'hrd@procuris.test',        'role' => 'admin_hrd',        'branch_id' => null],
            ['name' => 'Admin Cabang Bandung',     'email' => 'cabang.bdg@procuris.test', 'role' => 'admin_cabang',     'branch_id' => 2],
            ['name' => 'Karyawan Surabaya',        'email' => 'karyawan@procuris.test',   'role' => 'karyawan',         'branch_id' => 3],
            ['name' => 'Admin Purchasing',         'email' => 'purchasing@procuris.test', 'role' => 'admin_purchasing', 'branch_id' => null],
            ['name' => 'Staff Purchasing Bandung', 'email' => 'staff.bdg@procuris.test',  'role' => 'staff_purchasing', 'branch_id' => 2],
        ];

        foreach ($users as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name'      => $u['name'],
                    'role'      => $u['role'],
                    'branch_id' => $u['branch_id'],
                    'password'  => 'password',
                    'is_active' => true,
                ],
            );
        }
    }
}
