<?php

namespace App\Filament\Resources\CategoryResource\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('name')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $context, $state, callable $set) => $context === 'create' ? $set('slug', Str::slug($state)) : null),
                                
                                TextInput::make('slug')
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(ignoreRecord: true)
                                    ->rules(['alpha_dash']),
                            ]),
                        
                        Textarea::make('description')
                            ->maxLength(1000)
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),
                
                Section::make('Image')
                    ->schema([
                        FileUpload::make('image')
                            ->label('Category Image')
                            ->image()
                            ->imageEditor()
                            ->disk('minio')
                            ->directory('categories')
                            ->visibility('public')
                            ->maxSize(5120) // 5MB
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->columnSpanFull(),
                    ]),
                
                Section::make('Settings')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Toggle::make('is_active')
                                    ->label('Active')
                                    ->default(true)
                                    ->helperText('Whether this category is currently active'),
                                
                                TextInput::make('display_order')
                                    ->label('Display Order')
                                    ->numeric()
                                    ->default(0)
                                    ->helperText('Lower numbers appear first'),
                            ]),
                    ]),
            ]);
    }
}