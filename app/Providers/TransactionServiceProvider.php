<?php

namespace App\Providers;

use App\Repositories\Transaction\TransactionRepository;
use App\Repositories\Transaction\TransactionRepositoryInterface;
use Illuminate\Support\ServiceProvider;

/**
 * Transaction Service Provider
 * 
 * Registers Transaction-related services and repositories in Laravel's service container.
 * This provider ensures proper dependency injection and singleton management for
 * transaction data access functionality.
 * 
 * @package App\Providers
 * @author ABSteak Development Team
 * @version 1.0.0
 */
class TransactionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register(): void
    {
        // Register the TransactionRepository as a singleton
        $this->app->singleton(TransactionRepositoryInterface::class, function ($app) {
            return new TransactionRepository();
        });

        // Also bind the concrete class for direct injection
        $this->app->singleton(TransactionRepository::class, function ($app) {
            return $app->make(TransactionRepositoryInterface::class);
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
            TransactionRepositoryInterface::class,
            TransactionRepository::class,
        ];
    }
}