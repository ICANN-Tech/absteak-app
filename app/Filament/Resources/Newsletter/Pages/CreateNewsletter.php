<?php

namespace App\Filament\Resources\Newsletter\Pages;

use App\Filament\Resources\Newsletter\NewsletterResource;
use Filament\Resources\Pages\CreateRecord;

class CreateNewsletter extends CreateRecord
{
    protected static string $resource = NewsletterResource::class;
}