<?php

namespace Database\Seeders;

use App\Repositories\RedisNotificationRepository;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    // Inbox lives in Redis (prd.md), not MySQL. user IDs 5/6 match the auth-service users.
    // Tolerant: if Redis is down, skip instead of failing the whole seed run.
    public function run(): void
    {
        try {
            $repo = app(RedisNotificationRepository::class);

            $repo->push(6, 'po_status', 'PO Disetujui', 'PO/BDG/2026/0003 telah disetujui oleh Admin Purchasing.', 3);
            $repo->push(6, 'po_status', 'PO Diterima', 'Barang untuk PO/BDG/2026/0004 telah diterima.', 4);
            $repo->push(6, 'po_status', 'PO Ditolak', 'PO/BDG/2026/0005 ditolak: budget cabang belum tersedia.', 5);
            $repo->push(5, 'po_status', 'PO Menunggu Persetujuan', 'PO/BDG/2026/0002 menunggu persetujuan Anda.', 2);
            $repo->push(6, 'contract_expiring', 'Kontrak Akan Berakhir', 'Kontrak kerja Anda berakhir pada 2027-01-15.', null);

            $this->command->info('Seeded sample notifications into Redis.');
        } catch (\Throwable $e) {
            $this->command->warn('Skip notification seed (Redis unreachable?): ' . $e->getMessage());
        }
    }
}
