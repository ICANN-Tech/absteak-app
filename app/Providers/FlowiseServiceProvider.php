<?php

namespace App\Providers;

use App\Repositories\Flowise\FlowiseRepository;
use App\Repositories\Flowise\FlowiseRepositoryInterface;
use App\Services\Mongo;
use App\Services\Redis;
use App\Services\Vault;
use Illuminate\Support\ServiceProvider;

/**
 * Flowise Service Provider
 * 
 * Registers Flowise-related services and repositories in Laravel's service container.
 * This provider ensures proper dependency injection and singleton management for
 * Flowise chat functionality.
 * 
 * @package App\Providers
 * @author ABSteak Development Team
 * @version 1.0.0
 */
class FlowiseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register(): void
    {
        // Register the FlowiseRepository as a singleton
        $this->app->singleton(FlowiseRepositoryInterface::class, function ($app) {
            return new FlowiseRepository(
                $app->make(Mongo::class),
                $app->make(Redis::class),
                $app->make(Vault::class)
            );
        });

        // Also bind the concrete class for direct injection
        $this->app->singleton(FlowiseRepository::class, function ($app) {
            return $app->make(FlowiseRepositoryInterface::class);
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot(): void
    {
        // Any bootstrapping logic can go here
        // For example, publishing configuration files, views, etc.
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array<int, string>
     */
    public function provides(): array
    {
        return [
            FlowiseRepositoryInterface::class,
            FlowiseRepository::class,
        ];
    }
}