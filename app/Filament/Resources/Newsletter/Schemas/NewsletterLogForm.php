<?php

namespace App\Filament\Resources\Newsletter\Schemas;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use App\Models\Newsletter;
use App\Models\NewsletterSubscriber;

class NewsletterLogForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('newsletter_id')
                    ->label('Newsletter')
                    ->options(Newsletter::pluck('title', 'id'))
                    ->searchable()
                    ->nullable(),
                
                Select::make('newsletter_subscriber_id')
                    ->label('Subscriber')
                    ->options(NewsletterSubscriber::pluck('email', 'id'))
                    ->searchable()
                    ->nullable(),
                
                Select::make('action')
                    ->options([
                        'sent' => 'Sent',
                        'opened' => 'Opened',
                        'clicked' => 'Clicked',
                        'bounced' => 'Bounced',
                        'complained' => 'Complained',
                        'unsubscribed' => 'Unsubscribed',
                        'subscribed' => 'Subscribed',
                        'verified' => 'Verified',
                        'failed' => 'Failed',
                    ])
                    ->required(),
                
                Textarea::make('details')
                    ->label('Details')
                    ->rows(3)
                    ->columnSpanFull(),
                
                TextInput::make('ip_address')
                    ->label('IP Address')
                    ->maxLength(45),
                
                TextInput::make('user_agent')
                    ->label('User Agent')
                    ->maxLength(500)
                    ->columnSpanFull(),
                
                KeyValue::make('metadata')
                    ->label('Additional Metadata')
                    ->keyLabel('Key')
                    ->valueLabel('Value')
                    ->columnSpanFull(),
            ]);
    }
}