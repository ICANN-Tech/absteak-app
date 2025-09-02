<?php

namespace App\Filament\Resources\Newsletter\Pages;

use App\Filament\Resources\Newsletter\NewsletterLogResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditNewsletterLog extends EditRecord
{
    protected static string $resource = NewsletterLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}