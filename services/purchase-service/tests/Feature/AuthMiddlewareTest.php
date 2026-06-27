<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

beforeEach(function () {
    Route::middleware('auth.remote')->get('/_probe', fn () => response()->json(['ok' => true]));
});

it('401s without an Authorization header', function () {
    $this->getJson('/_probe')->assertStatus(401);
});

it('401s when auth returns 401', function () {
    Http::fake(['*/auth/me' => Http::response(['message' => 'Unauthenticated'], 401)]);
    $this->getJson('/_probe', ['Authorization' => 'Bearer x'])->assertStatus(401);
});

it('503s when auth returns a genuine 500', function () {
    Http::fake(['*/auth/me' => Http::response('err', 500)]);
    $this->getJson('/_probe', ['Authorization' => 'Bearer x'])->assertStatus(503);
});

it('403s a deactivated user with a still-valid token', function () {
    $this->getJson('/_probe', actingAsRole('admin_purchasing', null, active: false))->assertStatus(403);
});

it('403s a deactivated user serialized as integer 0', function () {
    $headers = fakeIdentity(['id' => 1, 'role' => 'admin_purchasing', 'branch_id' => null, 'is_active' => 0]);
    $this->getJson('/_probe', $headers)->assertStatus(403);
});

it('passes a valid active identity through', function () {
    $this->getJson('/_probe', actingAsRole('admin_purchasing'))->assertOk();
});
