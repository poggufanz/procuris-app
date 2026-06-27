<?php

use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('persists a refresh token and casts timestamps', function () {
    $user = User::factory()->create();

    $token = RefreshToken::create([
        'user_id' => $user->id,
        'token_hash' => hash('sha256', 'raw-value'),
        'expires_at' => now()->addDays(7),
    ]);

    expect($token->revoked_at)->toBeNull();
    expect($token->expires_at)->toBeInstanceOf(Illuminate\Support\Carbon::class);
    expect($token->user->id)->toBe($user->id);
});
