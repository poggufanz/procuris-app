<?php

uses(Tests\TestCase::class)->in('Feature');

use Illuminate\Support\Facades\Http;

function actingAsRole(string $role, ?int $branchId = null, bool $active = true): array
{
    Http::fake([
        '*/auth/me' => Http::response([
            'id' => 1, 'name' => 'Test', 'email' => 't@test',
            'role' => $role, 'branch_id' => $branchId, 'is_active' => $active,
        ], 200),
    ]);
    return ['Authorization' => 'Bearer test-token'];
}
