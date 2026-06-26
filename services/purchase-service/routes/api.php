<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\VendorController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth.remote')->group(function () {
    Route::middleware('role:superadmin,admin_purchasing,staff_purchasing,admin_cabang')->group(function () {
        Route::get('vendors', [VendorController::class, 'index']);
        Route::get('vendors/{id}', [VendorController::class, 'show'])->whereNumber('id');
        Route::get('vendors/{id}/purchase-history', [VendorController::class, 'purchaseHistory'])->whereNumber('id');
        Route::get('items', [ItemController::class, 'index']);
        Route::get('items/{id}', [ItemController::class, 'show'])->whereNumber('id');
        Route::get('purchase-orders', [PurchaseOrderController::class, 'index']);
        Route::get('purchase-orders/{id}', [PurchaseOrderController::class, 'show'])->whereNumber('id');
        Route::patch('purchase-orders/{id}/cancel', [PurchaseOrderController::class, 'cancel'])->whereNumber('id');
    });

    Route::middleware('role:superadmin,admin_purchasing')->group(function () {
        Route::post('vendors', [VendorController::class, 'store']);
        Route::put('vendors/{id}', [VendorController::class, 'update']);
        Route::patch('vendors/{id}/deactivate', [VendorController::class, 'deactivate']);
        Route::post('items', [ItemController::class, 'store']);
        Route::put('items/{id}', [ItemController::class, 'update']);
        Route::patch('items/{id}/deactivate', [ItemController::class, 'deactivate']);
        Route::patch('purchase-orders/{id}/approve', [PurchaseOrderController::class, 'approve'])->whereNumber('id');
        Route::patch('purchase-orders/{id}/reject', [PurchaseOrderController::class, 'reject'])->whereNumber('id');
    });

    Route::middleware('role:superadmin,staff_purchasing,admin_cabang')->group(function () {
        Route::post('purchase-orders', [PurchaseOrderController::class, 'store']);
        Route::put('purchase-orders/{id}/items', [PurchaseOrderController::class, 'updateItems'])->whereNumber('id');
        Route::patch('purchase-orders/{id}/submit', [PurchaseOrderController::class, 'submit'])->whereNumber('id');
        Route::patch('purchase-orders/{id}/receive', [PurchaseOrderController::class, 'receive'])->whereNumber('id');
    });
});
