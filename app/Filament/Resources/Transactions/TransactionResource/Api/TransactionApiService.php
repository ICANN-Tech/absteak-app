<?php
namespace App\Filament\Resources\Transactions\TransactionResource\Api;

use Rupadana\ApiService\ApiService;
use App\Filament\Resources\Transactions\TransactionResource;
use Illuminate\Routing\Router;


class TransactionApiService extends ApiService
{
    protected static string | null $resource = TransactionResource::class;

    public static function handlers() : array
    {
        return [
            Handlers\CreateHandler::class,
            Handlers\UpdateHandler::class,
            Handlers\DeleteHandler::class,
            Handlers\PaginationHandler::class,
            Handlers\DetailHandler::class,
            Handlers\WebhookHandler::class
        ];

    }
}
