<?php

namespace App\Filament\Resources\Reservations\ReservationResource\Api\Handlers;

use App\Filament\Resources\SettingResource;
use App\Filament\Resources\Reservations\ReservationResource;
use Rupadana\ApiService\Http\Handlers;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Http\Request;
use App\Filament\Resources\Reservations\ReservationResource\Api\Transformers\ReservationTransformer;

class DetailHandler extends Handlers
{
    public static string | null $uri = '/{booking_code}';
    public static string | null $resource = ReservationResource::class;
    public static bool $public = true;


    /**
     * Show Reservation
     *
     * @param Request $request
     * @return ReservationTransformer
     */
    public function handler(Request $request)
    {
        $id = $request->route('id');
        
        $query = static::getEloquentQuery();

        $query = QueryBuilder::for(
            $query->where(static::getKeyName(), $id)
        )
            ->first();

        if (!$query) return static::sendNotFoundResponse();

        return new ReservationTransformer($query);
    }
}
