<?php

namespace App\Http\Middleware;

use App\Support\AuthClient;
use Closure;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RemoteAuth
{
    public function __construct(private AuthClient $auth) {}

    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->header('Authorization');
        if (! $header) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        try {
            $identity = $this->auth->me($header);
        } catch (ConnectionException) {
            return response()->json(['message' => 'Auth service unavailable'], 503);
        }

        if (! is_array($identity) || ! isset($identity['role'])) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        if (array_key_exists('is_active', $identity)
            && ! filter_var($identity['is_active'], FILTER_VALIDATE_BOOLEAN)) {
            return response()->json(['message' => 'Account is inactive'], 403);
        }

        $request->attributes->set('identity', $identity);
        return $next($request);
    }
}
