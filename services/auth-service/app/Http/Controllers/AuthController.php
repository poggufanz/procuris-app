<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
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
}
