<?php

namespace App\Filament\Resources\Menu\Tables;

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
use App\Models\Category;

class MenusTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Image')
                    ->disk('minio')
                    ->size(60)
                    ->circular(),
                
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                
                TextColumn::make('category.name')
                    ->label('Category')
                    ->sortable()
                    ->searchable(),
                
                TextColumn::make('price')
                    ->money('USD')
                    ->sortable(),
                
                TextColumn::make('preparation_time')
                    ->label('Prep Time')
                    ->suffix(' min')
                    ->sortable(),
                
                BadgeColumn::make('is_active')
                    ->label('Status')
                    ->formatStateUsing(fn (bool $state): string => $state ? 'Active' : 'Inactive')
                    ->color(fn (bool $state): string => $state ? 'success' : 'danger'),
                
                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->trueIcon('heroicon-o-star')
                    ->falseIcon('heroicon-o-star')
                    ->trueColor('warning')
                    ->falseColor('gray'),
                
                IconColumn::make('is_available')
                    ->label('Available')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),
                
                TextColumn::make('calories')
                    ->suffix(' cal')
                    ->placeholder('N/A')
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('display_order')
                    ->label('Order')
                    ->sortable()
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
                SelectFilter::make('category_id')
                    ->label('Category')
                    ->options(Category::pluck('name', 'id'))
                    ->searchable(),
                
                SelectFilter::make('is_active')
                    ->label('Status')
                    ->options([
                        1 => 'Active',
                        0 => 'Inactive',
                    ]),
                
                SelectFilter::make('is_featured')
                    ->label('Featured')
                    ->options([
                        1 => 'Featured',
                        0 => 'Not Featured',
                    ]),
                
                SelectFilter::make('is_available')
                    ->label('Availability')
                    ->options([
                        1 => 'Available',
                        0 => 'Unavailable',
                    ]),
                
                Filter::make('price_range')
                    ->form([
                        \Filament\Forms\Components\TextInput::make('price_from')
                            ->label('Price From')
                            ->numeric()
                            ->prefix('$'),
                        \Filament\Forms\Components\TextInput::make('price_to')
                            ->label('Price To')
                            ->numeric()
                            ->prefix('$'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['price_from'],
                                fn (Builder $query, $price): Builder => $query->where('price', '>=', $price),
                            )
                            ->when(
                                $data['price_to'],
                                fn (Builder $query, $price): Builder => $query->where('price', '<=', $price),
                            );
                    }),
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('display_order', 'asc')
            ->striped();
    }
}