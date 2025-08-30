<?php
namespace App\Filament\Resources\Reservations\ReservationResource\Api\Handlers;

use Illuminate\Http\Request;
use Rupadana\ApiService\Http\Handlers;
use App\Filament\Resources\Reservations\ReservationResource;
use App\Filament\Resources\Reservations\ReservationResource\Api\Requests\UpdateReservationRequest;

class UpdateHandler extends Handlers {
    public static string | null $uri = '/{id}';
    public static string | null $resource = ReservationResource::class;

    public static function getMethod()
    {
        return Handlers::PUT;
    }

    public static function getModel() {
        return static::$resource::getModel();
    }


    /**
     * Update Reservation
     *
     * @param UpdateReservationRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handler(UpdateReservationRequest $request)
    {
        $id = $request->route('id');

        $model = static::getModel()::find($id);

        if (!$model) return static::sendNotFoundResponse();

        $model->fill($request->all());

        $model->save();

        return static::sendSuccessResponse($model, "Successfully Update Resource");
    }
}