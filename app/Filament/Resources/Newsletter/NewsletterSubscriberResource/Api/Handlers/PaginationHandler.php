<?php

namespace App\Filament\Resources\Newsletter\NewsletterSubscriberResource\Api\Handlers;

use Rupadana\ApiService\Http\Handlers;
use App\Filament\Resources\Newsletter\NewsletterSubscriberResource;
use Illuminate\Http\Request;

class PaginationHandler extends Handlers
{
    public static string | null $uri = '/';
    public static string | null $resource = NewsletterSubscriberResource::class;

    public static function getMethod()
    {
        return Handlers::GET;
    }

    public static function getModel()
    {
        return static::$resource::getModel();
    }

    public function handler(Request $request)
    {
        $query = static::getModel()::query();

        $query = static::getEloquentQuery();

        $model = $query->paginate($request->query('per_page', 15));

        return static::sendSuccessResponse($model, 'Successfully Get List Resource');
    }
}