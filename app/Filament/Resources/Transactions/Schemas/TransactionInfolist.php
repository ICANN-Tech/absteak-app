<?php

namespace App\Filament\Resources\Transactions\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TransactionInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Transaction Overview')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextEntry::make('transaction_id')
                                    ->label('Transaction ID')
                                    ->copyable()
                                    ->weight('bold')
                                    ->size('lg'),
                                
                                TextEntry::make('type')
                                    ->label('Type')
                                    ->badge()
                                    ->color(fn (string $state): string => match ($state) {
                                        'reservation' => 'primary',
                                        'order' => 'success',
                                        'refund' => 'warning',
                                        default => 'gray',
                                    }),
                                
                                TextEntry::make('status')
                                    ->label('Status')
                                    ->badge()
                                    ->color(fn (string $state): string => match ($state) {
                                        'pending' => 'warning',
                                        'processing' => 'info',
                                        'completed' => 'success',
                                        'failed' => 'danger',
                                        'cancelled' => 'gray',
                                        default => 'gray',
                                    }),
                            ]),
                        
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('amount')
                                    ->label('Amount')
                                    ->money('IDR')
                                    ->weight('bold')
                                    ->size('lg')
                                    ->color('success'),
                                
                                TextEntry::make('expires_at')
                                    ->label('Expires At')
                                    ->dateTime()
                                    ->placeholder('No expiration')
                                    ->color(function ($record) {
                                        if (!$record->expires_at) return null;
                                        return $record->expires_at->isPast() ? 'danger' : 'warning';
                                    }),
                            ]),
                    ]),
                
                Section::make('Customer Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('customer_name')
                                    ->label('Customer Name')
                                    ->weight('semibold'),
                                
                                TextEntry::make('customer_email')
                                    ->label('Email Address')
                                    ->copyable()
                                    ->icon('heroicon-o-envelope'),
                            ]),
                        
                        TextEntry::make('customer_phone')
                            ->label('Phone Number')
                            ->copyable()
                            ->icon('heroicon-o-phone')
                            ->placeholder('Not provided'),
                    ]),
                
                Section::make('Additional Details')
                    ->schema([
                        TextEntry::make('notes')
                            ->label('Notes')
                            ->placeholder('No notes available')
                            ->columnSpanFull(),
                        
                        TextEntry::make('metadata')
                            ->label('Metadata')
                            ->placeholder('No metadata available')
                            ->columnSpanFull()
                            ->formatStateUsing(function ($state) {
                                if (empty($state)) return 'No metadata available';
                                return is_string($state) ? $state : json_encode($state, JSON_PRETTY_PRINT);
                            }),
                    ])
                    ->collapsible(),
                
                Section::make('System Information')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextEntry::make('created_at')
                                    ->label('Created At')
                                    ->dateTime()
                                    ->since(),
                                
                                TextEntry::make('updated_at')
                                    ->label('Last Updated')
                                    ->dateTime()
                                    ->since(),
                                
                                TextEntry::make('id')
                                    ->label('Internal ID')
                                    ->copyable(),
                            ]),
                    ])
                    ->collapsible()
                    ->collapsed(),
            ]);
    }
}
