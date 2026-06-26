<?php

namespace App\Console\Commands;

use App\Repositories\NotificationRepository;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CheckContractExpiry extends Command
{
    protected $signature = 'notifications:check-contracts';
    protected $description = 'Push notifications for employees whose contracts expire in 30 days';

    public function __construct(private NotificationRepository $repo)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $url = rtrim((string) config('services.employee.url'), '/').'/employees';
        $response = Http::acceptJson()->timeout(10)->get($url, [
            'contract_expiry_days' => 30,
            'per_page' => 500,
        ]);

        if (! $response->successful()) {
            Log::error('CheckContractExpiry: employee service returned '.$response->status());
            return self::FAILURE;
        }

        $employees = $response->json('data') ?? [];
        $count = 0;

        foreach ($employees as $employee) {
            $userId = $employee['user_id'] ?? null;
            if (! $userId) {
                continue;
            }
            $name = $employee['nama_lengkap'] ?? 'Karyawan';
            $end = $employee['tanggal_akhir_kontrak'] ?? null;
            $this->repo->push(
                (int) $userId,
                'contract.expiring.soon',
                'Kontrak Segera Berakhir',
                "Kontrak {$name} akan berakhir pada {$end}.",
                $employee['id'] ?? null,
            );
            $count++;
        }

        $this->info("Pushed {$count} contract expiry notifications.");
        return self::SUCCESS;
    }
}
