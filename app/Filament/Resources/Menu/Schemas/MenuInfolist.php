<?php

namespace App\Filament\Resources\Menu\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\IconEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MenuInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('name')
                                    ->label('Menu Item Name')
                                    ->weight('bold')
                                    ->size('lg'),
                                
                                TextEntry::make('slug')
                                    ->copyable(),
                            ]),
                        
                        TextEntry::make('description')
                            ->columnSpanFull(),
                        
                        TextEntry::make('ingredients')
                            ->label('Ingredients & Details')
                            ->html()
                            ->columnSpanFull(),
                    ]),
                
                Section::make('Category & Pricing')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextEntry::make('category.name')
                                    ->label('Category')
                                    ->badge()
                                    ->color('primary'),
                                
                                TextEntry::make('price')
                                    ->money('USD')
                                    ->size('lg')
                                    ->weight('bold')
                                    ->color('success'),
                                
                                TextEntry::make('preparation_time')
                                    ->label('Preparation Time')
                                    ->suffix(' minutes')
                                    ->placeholder('Not specified'),
                            ]),
                    ]),
                
                Section::make('Image')
                    ->schema([
                        ImageEntry::make('image')
                            ->label('Menu Item Image')
                            ->disk('minio')
                            ->size(300)
                            ->visible(fn ($record) => $record->image),
                    ])
                    ->visible(fn ($record) => $record->image),
                
                Section::make('Additional Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('allergens')
                                    ->badge()
                                    ->color('warning')
                                    ->placeholder('None specified'),
                                
                                TextEntry::make('dietary_tags')
                                    ->label('Dietary Tags')
                                    ->badge()
                                    ->color('info')
                                    ->placeholder('None specified'),
                            ]),
                        
                        TextEntry::make('calories')
                            ->suffix(' calories')
                            ->placeholder('Not specified'),
                    ]),
                
                Section::make('Status & Availability')
                    ->schema([
                        Grid::make(4)
                            ->schema([
                                IconEntry::make('is_active')
                                    ->label('Active Status')
                                    ->boolean()
                                    ->trueIcon('heroicon-o-check-circle')
                                    ->falseIcon('heroicon-o-x-circle')
                                    ->trueColor('success')
                                    ->falseColor('danger'),
                                
                                IconEntry::make('is_featured')
                                    ->label('Featured Item')
                                    ->boolean()
                                    ->trueIcon('heroicon-o-star')
                                    ->falseIcon('heroicon-o-star')
                                    ->trueColor('warning')
                                    ->falseColor('gray'),
                                
                                IconEntry::make('is_available')
                                    ->label('Available Today')
                                    ->boolean()
                                    ->trueIcon('heroicon-o-check-circle')
                                    ->falseIcon('heroicon-o-x-circle')
                                    ->trueColor('success')
                                    ->falseColor('danger'),
                                
                                TextEntry::make('display_order')
                                    ->label('Display Order')
                                    ->placeholder('0'),
                            ]),
                    ]),
                
                Section::make('Timestamps')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('created_at')
                                    ->label('Created')
                                    ->dateTime(),
                                
                                TextEntry::make('updated_at')
                                    ->label('Last Updated')
                                    ->dateTime(),
                            ]),
                    ])
                    ->collapsible()
                    ->collapsed(),
            ]);
    }
}