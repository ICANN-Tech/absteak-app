<?php
namespace App\Filament\Resources\Reservations\ReservationResource\Api\Handlers;

use Illuminate\Http\Request;
use Rupadana\ApiService\Http\Handlers;
use App\Filament\Resources\Reservations\ReservationResource;
use App\Filament\Resources\Reservations\ReservationResource\Api\Requests\CreateReservationRequest;

class CreateHandler extends Handlers {
    public static string | null $uri = '/';
    public static string | null $resource = ReservationResource::class;
    public static bool $public = true;


    public static function getMethod()
    {
        return Handlers::POST;
    }

    public static function getModel() {
        return static::$resource::getModel();
    }

    /**
     * Create Reservation
     *
     * @param CreateReservationRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handler(CreateReservationRequest $request)
    {
        $model = new (static::getModel());

        $model->fill($request->all());

        $model->save();

        return static::sendSuccessResponse($model, "Successfully Create Resource");
    }
}