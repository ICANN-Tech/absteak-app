<?php

namespace App\Filament\Resources\Newsletter\NewsletterLogResource\Api;

use Rupadana\ApiService\ApiService;
use App\Filament\Resources\Newsletter\NewsletterLogResource;
use Illuminate\Routing\Router;

class NewsletterLogApiService extends ApiService
{
    protected static string | null $resource = NewsletterLogResource::class;

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