<?php

use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [\App\Http\Controllers\AuthController::class, 'login'])
        ->middleware('throttle:login');
    Route::post('refresh', [\App\Http\Controllers\AuthController::class, 'refresh']);
    Route::post('logout', [\App\Http\Controllers\AuthController::class, 'logout']);

    Route::middleware('auth:api')->group(function () {
        Route::get('me', [\App\Http\Controllers\AuthController::class, 'me']);

        Route::get('users', [\App\Http\Controllers\AuthController::class, 'index'])
            ->middleware('role:superadmin,admin_hrd');

        Route::middleware('role.superadmin')->group(function () {
            Route::post('users', [\App\Http\Controllers\AuthController::class, 'store']);
            Route::put('users/{id}', [\App\Http\Controllers\AuthController::class, 'update']);
            Route::patch('users/{id}/deactivate', [\App\Http\Controllers\AuthController::class, 'deactivate']);
        });
    });
});
