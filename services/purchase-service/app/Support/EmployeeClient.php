<?php

namespace App\Support;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class EmployeeClient
{
    /** @return array<int, array<string, mixed>> active branch rows */
    public function activeBranches(string $authorization): array
    {
        $response = Http::withHeaders(['Authorization' => $authorization])
            ->acceptJson()->connectTimeout(2)->timeout(3)
            ->get(rtrim((string) config('services.employee.url'), '/').'/branches', ['per_page' => 1000]);

        if ($response->successful()) {
            $json = $response->json();
            return array_values($json['data'] ?? $json ?? []);
        }
        if ($response->clientError()) {
            throw new BranchUnauthorizedException('Employee rejected token: '.$response->status());
        }
        throw new ConnectionException('Employee service returned '.$response->status());
    }
}
