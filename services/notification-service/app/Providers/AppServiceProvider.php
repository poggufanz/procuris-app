<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use App\Repositories\NotificationRepository;
use App\Repositories\ArrayNotificationRepository;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(NotificationRepository::class, function () {
            if (app()->environment('testing')) {
                return app(ArrayNotificationRepository::class);
            }
            return app(\App\Repositories\RedisNotificationRepository::class);
        });
    }

    public function boot(): void
    {
        Request::macro('identity', function () {
            return $this->attributes->get('identity');
        });
    }
}
