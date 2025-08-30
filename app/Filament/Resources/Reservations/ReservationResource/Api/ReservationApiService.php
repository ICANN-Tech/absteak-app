<?php
namespace App\Filament\Resources\Reservations\ReservationResource\Api;

use Rupadana\ApiService\ApiService;
use App\Filament\Resources\Reservations\ReservationResource;
use Illuminate\Routing\Router;


class ReservationApiService extends ApiService
{
    protected static string | null $resource = ReservationResource::class;

    public static function handlers() : array
    {
        return [
            Handlers\CreateHandler::class,
            Handlers\UpdateHandler::class,
            Handlers\DetailHandler::class
        ];

    }
}
