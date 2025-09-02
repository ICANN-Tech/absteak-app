<?php

namespace App\Filament\Resources\Newsletter\Pages;

use App\Filament\Resources\Newsletter\NewsletterResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNewsletters extends ListRecords
{
    protected static string $resource = NewsletterResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}