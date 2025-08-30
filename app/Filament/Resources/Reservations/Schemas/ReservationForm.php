<?php

namespace App\Filament\Resources\Reservations\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TimePicker;
use Filament\Schemas\Schema;

class ReservationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                TextInput::make('phone')
                    ->tel()
                    ->required(),
                DatePicker::make('reservation_date')
                    ->required(),
                TimePicker::make('reservation_time')
                    ->required(),
                TextInput::make('number_of_people')
                    ->required()
                    ->numeric(),
                Textarea::make('special_requests')
                    ->columnSpanFull(),
            ]);
    }
}
