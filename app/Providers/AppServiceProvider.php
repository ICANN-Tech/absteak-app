<?php

namespace App\Providers;

use App\Services\Redis;
use App\Services\Vault;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register Redis service as singleton
        $this->app->singleton(Redis::class, function ($app) {
            return new Redis();
        });

        // Register Vault service as singleton
        $this->app->singleton(Vault::class, function ($app) {
            return new Vault();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
