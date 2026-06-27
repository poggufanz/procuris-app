<?php

namespace App\Support;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class AuthClient
{
    public function me(string $authorization): ?array
    {
        $response = Http::withHeaders(['Authorization' => $authorization])
            ->acceptJson()->connectTimeout(2)->timeout(3)
            ->get(rtrim((string) config('services.auth.url'), '/').'/auth/me');

        if ($response->successful()) {
            return $response->json();
        }
        if ($response->clientError()) {
            return null;
        }
        throw new ConnectionException('Auth service returned '.$response->status());
    }
}
