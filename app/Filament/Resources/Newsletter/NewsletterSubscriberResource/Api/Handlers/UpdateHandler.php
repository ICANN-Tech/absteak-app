<?php

namespace App\Filament\Resources\Newsletter\NewsletterSubscriberResource\Api\Handlers;

use Rupadana\ApiService\Http\Handlers;
use App\Filament\Resources\Newsletter\NewsletterSubscriberResource;
use Illuminate\Http\Request;

class UpdateHandler extends Handlers
{
    public static string | null $uri = '/{id}';
    public static string | null $resource = NewsletterSubscriberResource::class;

    public static function getMethod()
    {
        return Handlers::PUT;
    }

    public static function getModel()
    {
        return static::$resource::getModel();
    }

    public function handler(Request $request)
    {
        $id = $request->route('id');

        $model = static::getModel()::find($id);

        if (!$model) {
            return static::sendNotFoundResponse("Resource Not Found");
        }

        $model->fill($request->all());

        $model->save();

        return static::sendSuccessResponse($model, "Successfully Updated Resource");
    }
}