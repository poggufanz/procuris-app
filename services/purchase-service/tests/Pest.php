<?php

uses(Tests\TestCase::class)->in('Feature');

use Illuminate\Support\Facades\Http;

function fakeIdentity(array $identity): array
{
    $GLOBALS['__identity'] = $identity;
    Http::fake(['*/auth/me' => fn () => Http::response($GLOBALS['__identity'], 200)]);
    return ['Authorization' => 'Bearer test-token'];
}

function actingAsRole(string $role, ?int $branchId = null, bool $active = true): array
{
    return fakeIdentity([
        'id' => 1, 'name' => 'Test', 'email' => 't@test',
        'role' => $role, 'branch_id' => $branchId, 'is_active' => $active,
    ]);
}

function actingAsUser(int $userId, string $role, ?int $branchId = null): array
{
    return fakeIdentity([
        'id' => $userId, 'name' => 'Test', 'email' => 't@test',
        'role' => $role, 'branch_id' => $branchId, 'is_active' => true,
    ]);
}

function fakeBranches(array $branches): void
{
    Http::fake([
        '*/auth/me' => fn () => Http::response($GLOBALS['__identity'] ?? [], 200),
        '*/branches*' => Http::response(['data' => $branches], 200),
    ]);
}

function fakeBranchesUnauthorized(): void
{
    Http::fake([
        '*/auth/me' => fn () => Http::response($GLOBALS['__identity'] ?? [], 200),
        '*/branches*' => Http::response(['message' => 'Unauthenticated'], 401),
    ]);
}

function fakeBranchesDown(): void
{
    Http::fake([
        '*/auth/me' => fn () => Http::response($GLOBALS['__identity'] ?? [], 200),
        '*/branches*' => Http::response('err', 500),
    ]);
}
