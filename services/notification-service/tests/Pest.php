<?php

uses(Tests\TestCase::class)->in('Feature');

use App\Repositories\ArrayNotificationRepository;
use Illuminate\Support\Facades\Http;

function fakeIdentity(array $identity): array
{
    $GLOBALS['__identity'] = $identity;
    Http::fake(['*/auth/me' => fn () => Http::response($GLOBALS['__identity'], 200)]);
    return ['Authorization' => 'Bearer test-token'];
}

function actingAsRole(string $role, ?int $userId = 1, bool $active = true): array
{
    return fakeIdentity([
        'id' => $userId, 'name' => 'Test', 'email' => 't@test',
        'role' => $role, 'branch_id' => null, 'is_active' => $active,
    ]);
}

function flushNotifications(): void
{
    ArrayNotificationRepository::flush();
}

function serviceHeader(): array
{
    return ['X-Service-Secret' => config('services.service_secret')];
}
