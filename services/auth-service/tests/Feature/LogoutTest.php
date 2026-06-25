<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

it('revokes the refresh token and blocks subsequent refresh', function () {
    User::factory()->create(['email' => 'a@b.test', 'password' => 'password']);
    $refresh = postJson('/auth/login', ['email' => 'a@b.test', 'password' => 'password'])->json('refresh_token');
    postJson('/auth/logout', ['refresh_token' => $refresh])->assertOk()->assertJson(['message' => 'Logged out']);
    expect(\App\Models\RefreshToken::whereNotNull('revoked_at')->count())->toBe(1);
    postJson('/auth/refresh', ['refresh_token' => $refresh])->assertStatus(401);
});

it('is idempotent for an unknown token', function () {
    postJson('/auth/logout', ['refresh_token' => 'garbage'])->assertOk();
});
