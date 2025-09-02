<?php

namespace App\Filament\Resources\Newsletter\Pages;

use App\Filament\Resources\Newsletter\NewsletterLogResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNewsletterLogs extends ListRecords
{
    protected static string $resource = NewsletterLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Create action removed - logs are generated automatically
        ];
    }
}