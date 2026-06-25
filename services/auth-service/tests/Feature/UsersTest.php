<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

function superToken(): string
{
    $super = User::factory()->create(['email' => 'super@b.test', 'password' => 'password', 'role' => 'superadmin']);
    return postJson('/auth/login', ['email' => 'super@b.test', 'password' => 'password'])->json('access_token');
}

function nonSuperToken(): string
{
    User::factory()->create(['email' => 'user@b.test', 'password' => 'password', 'role' => 'karyawan']);
    return postJson('/auth/login', ['email' => 'user@b.test', 'password' => 'password'])->json('access_token');
}

it('superadmin can list users', function () {
    $token = superToken();
    getJson('/auth/users', ['Authorization' => "Bearer {$token}"])->assertOk();
});

it('non-superadmin cannot list users', function () {
    $token = nonSuperToken();
    getJson('/auth/users', ['Authorization' => "Bearer {$token}"])->assertForbidden();
});

it('unauthenticated cannot list users', function () {
    getJson('/auth/users')->assertUnauthorized();
});

it('superadmin can create a user', function () {
    $token = superToken();
    $res = postJson('/auth/users', [
        'name' => 'Test User',
        'email' => 'new@b.test',
        'password' => 'secret123',
        'role' => 'admin_hrd',
        'branch_id' => null,
    ], ['Authorization' => "Bearer {$token}"])->assertCreated();
    expect($res->json('email'))->toBe('new@b.test');
});

it('non-superadmin cannot create a user', function () {
    $token = nonSuperToken();
    postJson('/auth/users', [
        'name' => 'Test User',
        'email' => 'new2@b.test',
        'password' => 'secret123',
        'role' => 'karyawan',
    ], ['Authorization' => "Bearer {$token}"])->assertForbidden();
});

it('create user validates required fields', function () {
    $token = superToken();
    postJson('/auth/users', [], ['Authorization' => "Bearer {$token}"])->assertUnprocessable();
});
