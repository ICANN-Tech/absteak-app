<?php

namespace App\Filament\Resources\Newsletter\NewsletterSubscriberResource\Api;

use Rupadana\ApiService\ApiService;
use App\Filament\Resources\Newsletter\NewsletterSubscriberResource;
use Illuminate\Routing\Router;

class NewsletterSubscriberApiService extends ApiService
{
    protected static string | null $resource = NewsletterSubscriberResource::class;

    public static function handlers(): array
    {
        return [
            Handlers\CreateHandler::class,
            Handlers\UpdateHandler::class,
            Handlers\DetailHandler::class,
            Handlers\PaginationHandler::class,
            Handlers\DeleteHandler::class,
        ];
    }
}