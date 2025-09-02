<?php

namespace App\Filament\Resources\Newsletter\Pages;

use App\Filament\Resources\Newsletter\NewsletterResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewNewsletter extends ViewRecord
{
    protected static string $resource = NewsletterResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}