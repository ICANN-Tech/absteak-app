<?php

namespace App\Filament\Resources\Newsletter\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class NewsletterForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (string $context, $state, callable $set) => $context === 'create' ? $set('slug', Str::slug($state)) : null),
                
                TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true)
                    ->rules(['alpha_dash']),
                
                Textarea::make('excerpt')
                    ->maxLength(500)
                    ->rows(3)
                    ->columnSpanFull(),
                
                RichEditor::make('content')
                    ->required()
                    ->columnSpanFull()
                    ->toolbarButtons([
                        'attachFiles',
                        'blockquote',
                        'bold',
                        'bulletList',
                        'codeBlock',
                        'h2',
                        'h3',
                        'italic',
                        'link',
                        'orderedList',
                        'redo',
                        'strike',
                        'underline',
                        'undo',
                    ]),
                
                Select::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'scheduled' => 'Scheduled',
                        'published' => 'Published',
                    ])
                    ->default('draft')
                    ->required(),
                
                DateTimePicker::make('published_at')
                    ->label('Publish Date')
                    ->visible(fn (callable $get) => in_array($get('status'), ['scheduled', 'published'])),
                
                Select::make('user_id')
                    ->label('Author')
                    ->options(User::pluck('name', 'id'))
                    ->searchable()
                    ->default(Auth::id())
                    ->required(),
                
                FileUpload::make('featured_image')
                    ->label('Featured Image')
                    ->image()
                    ->imageEditor()
                    ->directory('newsletters/images')
                    ->visibility('public'),
                
                TextInput::make('meta_title')
                    ->label('SEO Title')
                    ->maxLength(60)
                    ->helperText('Recommended: 50-60 characters'),
                
                Textarea::make('meta_description')
                    ->label('SEO Description')
                    ->maxLength(160)
                    ->rows(3)
                    ->helperText('Recommended: 150-160 characters'),
                
                TagsInput::make('tags')
                    ->separator(',')
                    ->columnSpanFull(),
                
                Toggle::make('is_featured')
                    ->label('Featured Newsletter')
                    ->default(false),
            ]);
    }
}