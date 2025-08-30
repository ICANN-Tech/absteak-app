<?php
namespace App\Filament\Resources\Reservations\ReservationResource\Api\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Reservation;

/**
 * @property Reservation $resource
 */
class ReservationTransformer extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return $this->resource->toArray();
    }
}
