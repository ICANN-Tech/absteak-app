<?php

namespace App\Filament\Resources\Newsletter\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms\Components\DatePicker;

class NewsletterSubscribersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                
                TextColumn::make('email')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                
                TextColumn::make('first_name')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('last_name')
                    ->searchable()
                    ->sortable(),
                
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
                
                BadgeColumn::make('subscriber_status')
                    ->label('Status')
                    ->colors([
                        'success' => 'Active & Verified',
                        'warning' => 'Active & Unverified',
                        'secondary' => 'Inactive & Verified',
                        'danger' => 'Inactive & Unverified',
                    ]),
                
                TextColumn::make('email_verified_at')
                    ->label('Verified')
                    ->dateTime()
                    ->sortable()
                    ->placeholder('Not verified'),
                
                TextColumn::make('source')
                    ->label('Source')
                    ->searchable()
                    ->toggleable(),
                
                TextColumn::make('ip_address')
                    ->label('IP')
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('created_at')
                    ->label('Subscribed')
                    ->dateTime()
                    ->sortable(),
                
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('is_active')
                    ->label('Subscription Status')
                    ->options([
                        '1' => 'Active',
                        '0' => 'Inactive',
                    ]),
                
                Filter::make('verified')
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('email_verified_at'))
                    ->label('Verified Only'),
                
                Filter::make('unverified')
                    ->query(fn (Builder $query): Builder => $query->whereNull('email_verified_at'))
                    ->label('Unverified Only'),
                
                SelectFilter::make('source')
                    ->label('Subscription Source')
                    ->options([
                        'website' => 'Website',
                        'api' => 'API',
                        'import' => 'Import',
                        'admin' => 'Admin',
                    ]),
                
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
                    ->label('Subscription Date Range'),
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