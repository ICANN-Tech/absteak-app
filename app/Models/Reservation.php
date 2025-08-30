<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'reservation_date',
        'reservation_time',
        'number_of_people',
        'special_requests',
    ];
}
