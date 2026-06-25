<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

function loginAndGetToken(string $email = 'me@b.test'): string
{
    User::factory()->create(['email' => $email, 'password' => 'password']);
    return postJson('/auth/login', ['email' => $email, 'password' => 'password'])->json('access_token');
}

it('returns the authenticated user', function () {
    $token = loginAndGetToken();
    $res = getJson('/auth/me', ['Authorization' => "Bearer {$token}"])->assertOk();
    expect($res->json('email'))->toBe('me@b.test');
    expect($res->json('role'))->toBe('karyawan');
});

it('returns 401 without a token', function () {
    getJson('/auth/me')->assertUnauthorized();
});

it('returns 401 with an invalid token', function () {
    getJson('/auth/me', ['Authorization' => 'Bearer badtoken'])->assertUnauthorized();
});
