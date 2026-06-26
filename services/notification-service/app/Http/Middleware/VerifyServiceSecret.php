<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyServiceSecret
{
    public function handle(Request $request, Closure $next): Response
    {
        $secret = config('services.service_secret');
        if (! $secret || ! hash_equals((string) $secret, (string) $request->header('X-Service-Secret', ''))) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return $next($request);
    }
}
