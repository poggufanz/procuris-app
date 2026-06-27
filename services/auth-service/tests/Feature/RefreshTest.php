<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

function loginAndGetRefresh(string $email = 'a@b.test'): string
{
    User::factory()->create(['email' => $email, 'password' => 'password']);
    return postJson('/auth/login', ['email' => $email, 'password' => 'password'])
        ->json('refresh_token');
}

it('issues a new access token for a valid refresh token', function () {
    $refresh = loginAndGetRefresh();

    postJson('/auth/refresh', ['refresh_token' => $refresh])
        ->assertOk()
        ->assertJsonStructure(['access_token', 'token_type', 'expires_in']);
});

it('rejects an unknown refresh token', function () {
    postJson('/auth/refresh', ['refresh_token' => 'garbage'])
        ->assertStatus(401)
        ->assertJson(['message' => 'Invalid refresh token']);
});

it('rejects an expired refresh token', function () {
    $refresh = loginAndGetRefresh();
    \App\Models\RefreshToken::query()->update(['expires_at' => now()->subDay()]);

    postJson('/auth/refresh', ['refresh_token' => $refresh])
        ->assertStatus(401);
});

it('rejects a revoked refresh token', function () {
    $refresh = loginAndGetRefresh();
    \App\Models\RefreshToken::query()->update(['revoked_at' => now()]);

    postJson('/auth/refresh', ['refresh_token' => $refresh])
        ->assertStatus(401);
});
