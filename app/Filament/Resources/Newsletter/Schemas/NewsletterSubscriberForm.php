<?php

namespace App\Filament\Resources\Newsletter\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class NewsletterSubscriberForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('email')
                    ->email()
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),
                
                TextInput::make('first_name')
                    ->maxLength(255),
                
                TextInput::make('last_name')
                    ->maxLength(255),
                
                Toggle::make('is_active')
                    ->label('Active Subscription')
                    ->default(true),
                
                DateTimePicker::make('email_verified_at')
                    ->label('Email Verified At'),
                
                TextInput::make('verification_token')
                    ->label('Verification Token')
                    ->maxLength(255)
                    ->disabled()
                    ->dehydrated(false),
                
                TextInput::make('unsubscribe_token')
                    ->label('Unsubscribe Token')
                    ->maxLength(255)
                    ->disabled()
                    ->dehydrated(false),
                
                KeyValue::make('preferences')
                    ->label('Subscription Preferences')
                    ->keyLabel('Preference')
                    ->valueLabel('Value')
                    ->columnSpanFull(),
                
                TextInput::make('source')
                    ->label('Subscription Source')
                    ->maxLength(255)
                    ->placeholder('e.g., website, api, import'),
                
                TextInput::make('ip_address')
                    ->label('IP Address')
                    ->maxLength(45)
                    ->disabled()
                    ->dehydrated(false),
                
                TextInput::make('user_agent')
                    ->label('User Agent')
                    ->maxLength(500)
                    ->disabled()
                    ->dehydrated(false)
                    ->columnSpanFull(),
            ]);
    }
}