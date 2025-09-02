<?php

namespace App\Filament\Resources\Newsletter\Pages;

use App\Filament\Resources\Newsletter\NewsletterSubscriberResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNewsletterSubscribers extends ListRecords
{
    protected static string $resource = NewsletterSubscriberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Create action removed - subscribers are managed externally
        ];
    }
}