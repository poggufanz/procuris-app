<?php

use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

it('logs in with valid credentials and issues tokens', function () {
    $user = User::factory()->create(['email' => 'a@b.test', 'password' => 'password']);

    $res = postJson('/auth/login', ['email' => 'a@b.test', 'password' => 'password']);

    $res->assertOk()
        ->assertJsonStructure(['access_token', 'refresh_token', 'token_type', 'expires_in']);
    expect(RefreshToken::where('user_id', $user->id)->count())->toBe(1);
    // raw refresh token is never stored verbatim
    expect(RefreshToken::where('token_hash', $res->json('refresh_token'))->exists())->toBeFalse();
});

it('rejects a wrong password with a generic 401', function () {
    User::factory()->create(['email' => 'a@b.test', 'password' => 'password']);
    postJson('/auth/login', ['email' => 'a@b.test', 'password' => 'nope'])
        ->assertStatus(401)
        ->assertJson(['message' => 'Invalid credentials']);
});

it('rejects an unknown email with the same generic 401', function () {
    postJson('/auth/login', ['email' => 'ghost@b.test', 'password' => 'password'])
        ->assertStatus(401)
        ->assertJson(['message' => 'Invalid credentials']);
});

it('blocks an inactive account with 403', function () {
    User::factory()->create(['email' => 'a@b.test', 'password' => 'password', 'is_active' => false]);
    postJson('/auth/login', ['email' => 'a@b.test', 'password' => 'password'])
        ->assertStatus(403)
        ->assertJson(['message' => 'Account is inactive']);
});

it('422s on missing fields', function () {
    postJson('/auth/login', [])->assertStatus(422);
});
