<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('hashes the password and exposes jwt custom claims', function () {
    $user = User::factory()->create([
        'role' => 'admin_hrd',
        'branch_id' => 7,
        'password' => 'secret123',
    ]);

    expect($user->password)->not->toBe('secret123');
    expect(Illuminate\Support\Facades\Hash::check('secret123', $user->password))->toBeTrue();
    expect($user->getJWTCustomClaims())->toBe(['role' => 'admin_hrd', 'branch_id' => 7]);
    expect($user->is_active)->toBeTrue();
});

it('seeds a superadmin', function () {
    $this->seed();
    $admin = User::where('email', 'super@procuris.test')->first();
    expect($admin)->not->toBeNull();
    expect($admin->role)->toBe('superadmin');
});
