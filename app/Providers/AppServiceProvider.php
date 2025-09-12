<?php

namespace App\Providers;

use App\Models\DineOutSource;
use App\Observers\DineOutSourceObserver;
use App\Services\Ollama;
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

        // Register Ollama service as singleton
        $this->app->singleton(Ollama::class, function ($app) {
            return new Ollama();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
       \SolutionForest\FilamentTranslateField\Facades\FilamentTranslateField::defaultLocales(['en', 'id', 'ko']);
       
       // Register model observers
       DineOutSource::observe(DineOutSourceObserver::class);
    }
}
