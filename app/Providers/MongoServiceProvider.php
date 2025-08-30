<?php

namespace App\Providers;

use App\Services\Mongo;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;

/**
 * MongoDB Service Provider
 * 
 * Registers the MongoDB service in Laravel's service container
 * and handles service configuration and dependency injection.
 * 
 * @package App\Providers
 * @author ABSteak Development Team
 * @version 1.0.0
 */
class MongoServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register(): void
    {
        // Register MongoDB service as singleton
        $this->app->singleton(Mongo::class, function ($app) {
            try {
                // Get configuration from environment
                $connectionString = $this->buildConnectionString();
                $databaseName = env('MONGO_DATABASE', 'absteak_db');
                
                // Create and return MongoDB service instance
                $mongoService = new Mongo($connectionString, $databaseName);
                
                Log::info('MongoDB service registered successfully', [
                    'database' => $databaseName,
                    'provider' => self::class
                ]);
                
                return $mongoService;
            } catch (\Exception $e) {
                Log::error('Failed to register MongoDB service', [
                    'error' => $e->getMessage(),
                    'provider' => self::class
                ]);
                
                throw $e;
            }
        });
        
        // Register alias for easier access
        $this->app->alias(Mongo::class, 'mongo');
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot(): void
    {
        // Test MongoDB connection on boot if in development
        if ($this->app->environment('local', 'development')) {
            $this->testConnection();
        }
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array<int, string>
     */
    public function provides(): array
    {
        return [
            Mongo::class,
            'mongo'
        ];
    }

    /**
     * Build MongoDB connection string from environment variables
     *
     * @return string MongoDB connection string
     */
    private function buildConnectionString(): string
    {
        $host = env('MONGO_HOST', 'mongodb');
        $port = env('MONGO_PORT', 27017);
        $username = env('MONGO_USERNAME', 'admin');
        $password = env('MONGO_PASSWORD', 'admin_password_2024');
        $database = env('MONGO_DATABASE', 'absteak_db');
        
        // Build connection string with authentication
        return "mongodb://{$username}:{$password}@{$host}:{$port}/{$database}";
    }

    /**
     * Test MongoDB connection during service boot
     *
     * @return void
     */
    private function testConnection(): void
    {
        try {
            $mongo = $this->app->make(Mongo::class);
            
            if ($mongo->ping()) {
                Log::info('MongoDB connection test successful', [
                    'provider' => self::class
                ]);
            } else {
                Log::warning('MongoDB connection test failed', [
                    'provider' => self::class
                ]);
            }
        } catch (\Exception $e) {
            Log::error('MongoDB connection test error', [
                'error' => $e->getMessage(),
                'provider' => self::class
            ]);
        }
    }
}