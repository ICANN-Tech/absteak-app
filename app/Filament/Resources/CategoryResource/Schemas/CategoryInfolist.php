<?php

namespace App\Filament\Resources\CategoryResource\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CategoryInfolist
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
                                    ->label('Category Name')
                                    ->weight('bold'),
                                TextEntry::make('slug')
                                    ->label('URL Slug')
                                    ->copyable(),
                            ]),
                        TextEntry::make('description')
                            ->label('Description')
                            ->html()
                            ->columnSpanFull(),
                    ]),

                Section::make('Image')
                    ->schema([
                        ImageEntry::make('image')
                            ->label('Category Image')
                            ->disk('minio')
                            ->height(200)
                            ->width(300),
                    ])
                    ->collapsible(),

                Section::make('Settings')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                IconEntry::make('is_active')
                                    ->label('Active Status')
                                    ->boolean()
                                    ->trueIcon('heroicon-o-check-circle')
                                    ->falseIcon('heroicon-o-x-circle')
                                    ->trueColor('success')
                                    ->falseColor('danger'),
                                TextEntry::make('display_order')
                                    ->label('Display Order')
                                    ->numeric(),
                            ]),
                    ]),

                Section::make('Statistics')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('menus_count')
                                    ->label('Total Menu Items')
                                    ->numeric()
                                    ->suffix(' items'),
                                TextEntry::make('active_menus_count')
                                    ->label('Active Menu Items')
                                    ->numeric()
                                    ->suffix(' items'),
                            ]),
                    ])
                    ->collapsible(),

                Section::make('Timestamps')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextEntry::make('created_at')
                                    ->label('Created At')
                                    ->dateTime(),
                                TextEntry::make('updated_at')
                                    ->label('Updated At')
                                    ->dateTime(),
                            ]),
                    ])
                    ->collapsible()
                    ->collapsed(),
            ]);
    }
}