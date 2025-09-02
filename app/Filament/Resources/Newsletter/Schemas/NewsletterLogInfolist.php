<?php

namespace App\Filament\Resources\Newsletter\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\KeyValueEntry;
use Filament\Schemas\Schema;

class NewsletterLogInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('newsletter.title')
                    ->label('Newsletter')
                    ->placeholder('No newsletter associated'),
                
                TextEntry::make('newsletter_subscriber.email')
                    ->label('Subscriber')
                    ->placeholder('No subscriber associated'),
                
                TextEntry::make('action')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'sent' => 'primary',
                        'opened' => 'success',
                        'clicked' => 'info',
                        'bounced' => 'warning',
                        'complained' => 'danger',
                        'unsubscribed' => 'gray',
                        'subscribed' => 'success',
                        'verified' => 'success',
                        'failed' => 'danger',
                        default => 'gray',
                    }),
                
                TextEntry::make('details')
                    ->columnSpanFull(),
                
                TextEntry::make('ip_address')
                    ->label('IP Address')
                    ->copyable(),
                
                TextEntry::make('user_agent')
                    ->label('User Agent')
                    ->columnSpanFull(),
                
                KeyValueEntry::make('metadata')
                    ->label('Additional Metadata')
                    ->columnSpanFull(),
                
                TextEntry::make('formatted_created_at')
                    ->label('Logged At'),
                
                TextEntry::make('updated_at')
                    ->label('Last Updated')
                    ->dateTime(),
            ]);
    }
}