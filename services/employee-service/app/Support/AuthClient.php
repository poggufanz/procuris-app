<?php

namespace App\Support;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class AuthClient
{
    public function me(string $authorization): ?array
    {
        $response = Http::withHeaders(['Authorization' => $authorization])
            ->acceptJson()
            ->connectTimeout(2)
            ->timeout(3)
            ->get(rtrim((string) config('services.auth.url'), '/').'/auth/me');

        if ($response->successful()) {
            return $response->json();
        }
        if ($response->clientError()) {
            return null;
        }
        throw new ConnectionException('Auth service returned '.$response->status());
    }

    /** @return array<int,string> map of user id => name; empty on any failure (caller falls back to id). */
    public function namesByIds(string $authorization, array $ids): array
    {
        $ids = array_values(array_unique(array_filter(array_map('intval', $ids))));
        if ($ids === []) {
            return [];
        }

        try {
            $response = Http::withHeaders(['Authorization' => $authorization])
                ->acceptJson()
                ->connectTimeout(2)
                ->timeout(3)
                ->get(rtrim((string) config('services.auth.url'), '/').'/auth/users/lookup', ['ids' => implode(',', $ids)]);
        } catch (ConnectionException) {
            return [];
        }

        if (! $response->successful()) {
            return [];
        }

        return collect($response->json())->pluck('name', 'id')->all();
    }
}
