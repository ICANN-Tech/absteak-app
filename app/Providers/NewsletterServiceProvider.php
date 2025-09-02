<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Newsletter\NewsletterRepositoryInterface;
use App\Repositories\Newsletter\NewsletterRepository;
use App\Repositories\Newsletter\NewsletterSubscriberRepositoryInterface;
use App\Repositories\Newsletter\NewsletterSubscriberRepository;
use App\Repositories\Newsletter\NewsletterLogRepositoryInterface;
use App\Repositories\Newsletter\NewsletterLogRepository;

class NewsletterServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register Newsletter Repository
        $this->app->singleton(NewsletterRepositoryInterface::class, function ($app) {
            return new NewsletterRepository();
        });

        // Register NewsletterSubscriber Repository
        $this->app->singleton(NewsletterSubscriberRepositoryInterface::class, function ($app) {
            return new NewsletterSubscriberRepository();
        });

        // Register NewsletterLog Repository
        $this->app->singleton(NewsletterLogRepositoryInterface::class, function ($app) {
            return new NewsletterLogRepository();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}