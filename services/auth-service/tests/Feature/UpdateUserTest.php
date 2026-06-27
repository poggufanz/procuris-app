<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\patchJson;
use function Pest\Laravel\putJson;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

function superAuthToken(): string
{
    User::factory()->create(['email' => 'super@x.test', 'password' => 'password', 'role' => 'superadmin']);
    return postJson('/auth/login', ['email' => 'super@x.test', 'password' => 'password'])->json('access_token');
}

it('superadmin can update a user', function () {
    $token = superAuthToken();
    $user = User::factory()->create(['role' => 'karyawan']);
    putJson("/auth/users/{$user->id}", [
        'name' => 'Updated Name',
        'email' => $user->email,
        'role' => 'admin_hrd',
        'branch_id' => null,
    ], ['Authorization' => "Bearer {$token}"])->assertOk()->assertJsonFragment(['role' => 'admin_hrd']);
});

it('superadmin can deactivate a user', function () {
    $token = superAuthToken();
    $user = User::factory()->create(['is_active' => true]);
    patchJson("/auth/users/{$user->id}/deactivate", [], ['Authorization' => "Bearer {$token}"])
        ->assertOk()->assertJsonFragment(['is_active' => false]);
    expect($user->fresh()->is_active)->toBeFalse();
});

it('returns 404 for unknown user on update', function () {
    $token = superAuthToken();
    putJson('/auth/users/9999', [
        'name' => 'X', 'email' => 'x@x.test', 'role' => 'karyawan', 'branch_id' => null,
    ], ['Authorization' => "Bearer {$token}"])->assertNotFound();
});

it('non-superadmin cannot update a user', function () {
    User::factory()->create(['email' => 'user@x.test', 'password' => 'password', 'role' => 'karyawan']);
    $token = postJson('/auth/login', ['email' => 'user@x.test', 'password' => 'password'])->json('access_token');
    $user = User::factory()->create();
    putJson("/auth/users/{$user->id}", [
        'name' => 'X', 'email' => 'y@x.test', 'role' => 'karyawan', 'branch_id' => null,
    ], ['Authorization' => "Bearer {$token}"])->assertForbidden();
});
