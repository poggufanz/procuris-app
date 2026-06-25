<?php

use App\Http\Controllers\BranchController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth.remote')->group(function () {
    Route::get('branches', [BranchController::class, 'index']);
    Route::get('branches/tree', [BranchController::class, 'tree']);
    Route::get('branches/{id}', [BranchController::class, 'show'])->whereNumber('id');

    Route::middleware('role:superadmin,admin_hrd')->group(function () {
        Route::post('branches', [BranchController::class, 'store']);
        Route::put('branches/{id}', [BranchController::class, 'update']);
        Route::patch('branches/{id}/deactivate', [BranchController::class, 'deactivate']);
    });
});
