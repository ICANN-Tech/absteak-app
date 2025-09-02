<?php

namespace App\Filament\Resources\Transactions\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TransactionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Transaction Details')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('transaction_id')
                                    ->label('Transaction ID')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255)
                                    ->placeholder('TXN-XXXXXXXX')
                                    ->helperText('Unique identifier for this transaction'),
                                
                                Select::make('type')
                                    ->label('Transaction Type')
                                    ->required()
                                    ->options([
                                        'reservation' => 'Reservation',
                                        'order' => 'Order',
                                        'refund' => 'Refund',
                                    ])
                                    ->default('reservation'),
                            ]),
                        
                        Grid::make(2)
                            ->schema([
                                Select::make('status')
                                    ->label('Status')
                                    ->required()
                                    ->options([
                                        'pending' => 'Pending',
                                        'processing' => 'Processing',
                                        'completed' => 'Completed',
                                        'failed' => 'Failed',
                                        'cancelled' => 'Cancelled',
                                    ])
                                    ->default('pending'),
                                
                                TextInput::make('amount')
                                    ->label('Amount')
                                    ->required()
                                    ->numeric()
                                    ->minValue(0)
                                    ->prefix('IDR')
                                    ->placeholder('0.00')
                                    ->helperText('Transaction amount in Indonesian Rupiah'),
                            ]),
                        
                        DateTimePicker::make('expires_at')
                            ->label('Expires At')
                            ->nullable()
                            ->helperText('When this transaction expires (optional)'),
                    ]),
                
                Section::make('Customer Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('customer_name')
                                    ->label('Customer Name')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('John Doe'),
                                
                                TextInput::make('customer_email')
                                    ->label('Customer Email')
                                    ->required()
                                    ->email()
                                    ->maxLength(255)
                                    ->placeholder('john@example.com'),
                            ]),
                        
                        TextInput::make('customer_phone')
                            ->label('Customer Phone')
                            ->tel()
                            ->maxLength(20)
                            ->placeholder('+62 812 3456 7890')
                            ->helperText('Customer contact number'),
                    ]),
                
                Section::make('Additional Information')
                    ->schema([
                        Textarea::make('notes')
                            ->label('Notes')
                            ->rows(3)
                            ->maxLength(1000)
                            ->placeholder('Additional notes or comments about this transaction')
                            ->columnSpanFull(),
                        
                        Textarea::make('metadata')
                            ->label('Metadata (JSON)')
                            ->rows(4)
                            ->placeholder('{"key": "value"}')
                            ->helperText('Additional metadata in JSON format')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->collapsed(),
            ]);
    }
}
