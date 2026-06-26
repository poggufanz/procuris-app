<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::post('notify', [NotificationController::class, 'push']);

Route::middleware('auth.remote')->group(function () {
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('notifications/read-all', [NotificationController::class, 'readAll']);
    Route::patch('notifications/{id}/read', [NotificationController::class, 'markRead']);
});
