<?php

namespace App\Filament\Resources\Newsletter\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\KeyValueEntry;
use Filament\Schemas\Schema;

class NewsletterSubscriberInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('email')
                    ->label('Email Address')
                    ->copyable(),
                
                TextEntry::make('first_name')
                    ->label('First Name'),
                
                TextEntry::make('last_name')
                    ->label('Last Name'),
                
                IconEntry::make('is_active')
                    ->label('Active Subscription')
                    ->boolean(),
                
                TextEntry::make('email_verified_at')
                    ->label('Email Verified')
                    ->dateTime()
                    ->placeholder('Not verified'),
                
                TextEntry::make('subscriber_status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Active & Verified' => 'success',
                        'Active & Unverified' => 'warning',
                        'Inactive & Verified' => 'gray',
                        'Inactive & Unverified' => 'danger',
                        default => 'gray',
                    }),
                
                TextEntry::make('verification_token')
                    ->label('Verification Token')
                    ->visible(fn ($record) => $record->verification_token)
                    ->copyable(),
                
                TextEntry::make('unsubscribe_token')
                    ->label('Unsubscribe Token')
                    ->visible(fn ($record) => $record->unsubscribe_token)
                    ->copyable(),
                
                KeyValueEntry::make('preferences')
                    ->label('Subscription Preferences')
                    ->columnSpanFull(),
                
                TextEntry::make('source')
                    ->label('Subscription Source'),
                
                TextEntry::make('ip_address')
                    ->label('IP Address')
                    ->copyable(),
                
                TextEntry::make('user_agent')
                    ->label('User Agent')
                    ->columnSpanFull(),
                
                TextEntry::make('created_at')
                    ->label('Subscribed At')
                    ->dateTime(),
                
                TextEntry::make('updated_at')
                    ->label('Last Updated')
                    ->dateTime(),
            ]);
    }
}