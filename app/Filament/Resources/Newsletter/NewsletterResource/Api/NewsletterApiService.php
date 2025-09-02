<?php

namespace App\Filament\Resources\Newsletter\NewsletterResource\Api;

use Rupadana\ApiService\ApiService;
use App\Filament\Resources\Newsletter\NewsletterResource;
use Illuminate\Routing\Router;

class NewsletterApiService extends ApiService
{
    protected static string | null $resource = NewsletterResource::class;

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