<?php

namespace App\Filament\Resources\Newsletter\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\IconEntry;
use Filament\Schemas\Schema;

class NewsletterInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('title')
                    ->label('Title'),
                
                TextEntry::make('slug')
                    ->copyable(),
                
                TextEntry::make('excerpt')
                    ->columnSpanFull(),
                
                TextEntry::make('content')
                    ->html()
                    ->columnSpanFull(),
                
                TextEntry::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'draft' => 'gray',
                        'scheduled' => 'warning',
                        'published' => 'success',
                        default => 'gray',
                    }),
                
                TextEntry::make('published_at')
                    ->dateTime()
                    ->visible(fn ($record) => $record->published_at),
                
                TextEntry::make('user.name')
                    ->label('Author'),
                
                IconEntry::make('is_featured')
                    ->label('Featured')
                    ->boolean(),
                
                ImageEntry::make('featured_image')
                    ->label('Featured Image')
                    ->visible(fn ($record) => $record->featured_image),
                
                TextEntry::make('meta_title')
                    ->label('SEO Title'),
                
                TextEntry::make('meta_description')
                    ->label('SEO Description'),
                
                TextEntry::make('tags')
                    ->badge()
                    ->separator(','),
                
                TextEntry::make('created_at')
                    ->dateTime(),
                
                TextEntry::make('updated_at')
                    ->dateTime(),
            ]);
    }
}