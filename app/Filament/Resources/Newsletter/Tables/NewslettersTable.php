<?php

namespace App\Filament\Resources\Newsletter\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms\Components\DatePicker;

class NewslettersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                
                ImageColumn::make('featured_image')
                    ->label('Image')
                    ->circular()
                    ->defaultImageUrl('/images/newsletter-placeholder.png')
                    ->size(40),
                
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                
                TextColumn::make('slug')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                BadgeColumn::make('status')
                    ->colors([
                        'secondary' => 'draft',
                        'warning' => 'scheduled',
                        'success' => 'published',
                    ])
                    ->sortable(),
                
                TextColumn::make('user.name')
                    ->label('Author')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('published_at')
                    ->label('Published')
                    ->dateTime()
                    ->sortable()
                    ->placeholder('Not published'),
                
                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->toggleable(),
                
                TextColumn::make('excerpt')
                    ->limit(100)
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'scheduled' => 'Scheduled',
                        'published' => 'Published',
                    ]),
                
                SelectFilter::make('user_id')
                    ->label('Author')
                    ->relationship('user', 'name')
                    ->searchable(),
                
                Filter::make('is_featured')
                    ->query(fn (Builder $query): Builder => $query->where('is_featured', true))
                    ->label('Featured Only'),
                
                Filter::make('published')
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('published_at'))
                    ->label('Published Only'),
                
                Filter::make('created_at')
                    ->form([
                        DatePicker::make('created_from'),
                        DatePicker::make('created_until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    })
                    ->label('Created Date Range'),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}