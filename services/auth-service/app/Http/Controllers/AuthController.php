<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RefreshRequest;
use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Account is inactive'], 403);
        }

        $accessToken = JWTAuth::fromUser($user);

        $raw = Str::random(64);
        RefreshToken::create([
            'user_id' => $user->id,
            'token_hash' => hash('sha256', $raw),
            'expires_at' => now()->addDays(7),
        ]);

        return response()->json([
            'access_token' => $accessToken,
            'refresh_token' => $raw,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
        ]);
    }

    public function refresh(RefreshRequest $request): JsonResponse
    {
        $row = RefreshToken::where('token_hash', hash('sha256', $request->refresh_token))
            ->whereNull('revoked_at')
            ->where('expires_at', '>', now())
            ->first();

        if (! $row) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        }

        $user = User::find($row->user_id);
        if (! $user || ! $user->is_active) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        }

        return response()->json([
            'access_token' => JWTAuth::fromUser($user),
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
        ]);
    }

    public function me(): JsonResponse
    {
        return response()->json(Auth::user());
    }

    public function logout(RefreshRequest $request): JsonResponse
    {
        RefreshToken::where('token_hash', hash('sha256', $request->refresh_token))
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now()]);

        return response()->json(['message' => 'Logged out']);
    }
}
