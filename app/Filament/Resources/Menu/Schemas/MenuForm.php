<?php

namespace App\Filament\Resources\Menu\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use App\Models\Category;
use Illuminate\Support\Str;

class MenuForm
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
                        
                        RichEditor::make('ingredients')
                            ->label('Ingredients & Details')
                            ->columnSpanFull()
                            ->toolbarButtons([
                                'bold',
                                'bulletList',
                                'italic',
                                'link',
                                'orderedList',
                                'redo',
                                'strike',
                                'underline',
                                'undo',
                            ]),
                    ]),
                
                Section::make('Category & Pricing')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Select::make('category_id')
                                    ->label('Category')
                                    ->options(Category::pluck('name', 'id'))
                                    ->searchable()
                                    ->required(),
                                
                                TextInput::make('price')
                                    ->numeric()
                                    ->prefix('$')
                                    ->step(0.01)
                                    ->minValue(0)
                                    ->required(),
                                
                                TextInput::make('preparation_time')
                                    ->label('Prep Time (minutes)')
                                    ->numeric()
                                    ->minValue(1)
                                    ->suffix('min'),
                            ]),
                    ]),
                
                Section::make('Images')
                    ->schema([
                        FileUpload::make('image')
                            ->label('Menu Item Image')
                            ->image()
                            ->imageEditor()
                            ->disk('minio')
                            ->directory('menu-items')
                            ->visibility('public')
                            ->maxSize(5120) // 5MB
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->columnSpanFull(),
                    ]),
                
                Section::make('Additional Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TagsInput::make('allergens')
                                    ->separator(',')
                                    ->placeholder('Add allergens (e.g., nuts, dairy, gluten)')
                                    ->helperText('Press Enter or comma to add each allergen'),
                                
                                TagsInput::make('dietary_tags')
                                    ->label('Dietary Tags')
                                    ->separator(',')
                                    ->placeholder('Add dietary tags (e.g., vegan, keto, gluten-free)')
                                    ->helperText('Press Enter or comma to add each tag'),
                            ]),
                        
                        TextInput::make('calories')
                            ->numeric()
                            ->minValue(0)
                            ->suffix('cal')
                            ->helperText('Optional calorie information'),
                    ]),
                
                Section::make('Status & Availability')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Toggle::make('is_active')
                                    ->label('Active')
                                    ->default(true)
                                    ->helperText('Whether this menu item is currently available'),
                                
                                Toggle::make('is_featured')
                                    ->label('Featured Item')
                                    ->default(false)
                                    ->helperText('Display this item prominently'),
                                
                                Toggle::make('is_available')
                                    ->label('Available Today')
                                    ->default(true)
                                    ->helperText('Whether this item is available today'),
                            ]),
                        
                        TextInput::make('display_order')
                            ->label('Display Order')
                            ->numeric()
                            ->default(0)
                            ->helperText('Lower numbers appear first'),
                    ]),
            ]);
    }
}