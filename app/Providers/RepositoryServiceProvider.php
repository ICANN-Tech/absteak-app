<?php

namespace App\Providers;

use App\Repositories\General\ConfigurationRepository;
use App\Repositories\General\ConfigurationRepositoryEloquent;
use Illuminate\Support\ServiceProvider;

/**
 * Repository Service Provider
 * 
 * Registers repository interfaces with their concrete implementations
 * for dependency injection throughout the application.
 * 
 * @package App\Providers
 * @author ABSteak Development Team
 * @version 1.0.0
 */
class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register(): void
    {
        // Bind ConfigurationRepository interface to its implementation
        $this->app->bind(
            ConfigurationRepository::class,
            ConfigurationRepositoryEloquent::class
        );
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot(): void
    {
        //
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array<int, string>
     */
    public function provides(): array
    {
        return [
            ConfigurationRepository::class,
        ];
    }
}