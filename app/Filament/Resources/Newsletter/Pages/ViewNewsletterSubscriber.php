<?php

namespace App\Filament\Resources\Newsletter\Pages;

use App\Filament\Resources\Newsletter\NewsletterSubscriberResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewNewsletterSubscriber extends ViewRecord
{
    protected static string $resource = NewsletterSubscriberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}