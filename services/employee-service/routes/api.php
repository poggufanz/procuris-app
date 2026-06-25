<?php

use App\Http\Controllers\BranchController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PositionController;
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

    Route::get('positions', [PositionController::class, 'index']);
    Route::get('positions/tree', [PositionController::class, 'tree']);
    Route::get('positions/{id}', [PositionController::class, 'show'])->whereNumber('id');

    Route::middleware('role:superadmin,admin_hrd')->group(function () {
        Route::post('positions', [PositionController::class, 'store']);
        Route::put('positions/{id}', [PositionController::class, 'update']);
        Route::delete('positions/{id}', [PositionController::class, 'destroy']);
    });

    Route::get('employees', [EmployeeController::class, 'index']);
    Route::get('employees/{id}', [EmployeeController::class, 'show'])->whereNumber('id');

    Route::middleware('role:superadmin,admin_hrd,admin_cabang')->group(function () {
        Route::post('employees', [EmployeeController::class, 'store']);
        Route::put('employees/{id}', [EmployeeController::class, 'update']);
        Route::delete('employees/{id}', [EmployeeController::class, 'destroy']);
    });
});
