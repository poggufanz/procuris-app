<?php

use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [\App\Http\Controllers\AuthController::class, 'login'])
        ->middleware('throttle:login');
    Route::post('refresh', [\App\Http\Controllers\AuthController::class, 'refresh']);
    Route::post('logout', [\App\Http\Controllers\AuthController::class, 'logout']);
});
