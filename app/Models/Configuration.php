<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Configuration extends Model
{
    use HasUuids;

    protected $fillable = [
        'key',
        'group',
        'value',
        'type',
    ];

    protected $casts = [
        'type' => \App\Enums\Configuration\Type::class,
    ];
}
