<?php

namespace App\Filament\Resources\Newsletter\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms\Components\DatePicker;

class NewsletterLogsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                
                TextColumn::make('newsletter.title')
                    ->label('Newsletter')
                    ->searchable()
                    ->sortable()
                    ->placeholder('No newsletter'),
                
                TextColumn::make('newsletter_subscriber.email')
                    ->label('Subscriber')
                    ->searchable()
                    ->sortable()
                    ->placeholder('No subscriber'),
                
                TextColumn::make('action')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'sent' => 'primary',
                        'opened' => 'success',
                        'clicked' => 'info',
                        'bounced' => 'warning',
                        'complained' => 'danger',
                        'unsubscribed' => 'gray',
                        'subscribed' => 'success',
                        'verified' => 'success',
                        'failed' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                
                TextColumn::make('details')
                    ->limit(50)
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        
                        if (strlen($state) <= $column->getCharacterLimit()) {
                            return null;
                        }
                        
                        return $state;
                    }),
                
                TextColumn::make('ip_address')
                    ->label('IP Address')
                    ->searchable(),
                
                TextColumn::make('formatted_created_at')
                    ->label('Logged At')
                    ->sortable(),
                
                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('action')
                    ->options([
                        'sent' => 'Sent',
                        'opened' => 'Opened',
                        'clicked' => 'Clicked',
                        'bounced' => 'Bounced',
                        'complained' => 'Complained',
                        'unsubscribed' => 'Unsubscribed',
                        'subscribed' => 'Subscribed',
                        'verified' => 'Verified',
                        'failed' => 'Failed',
                    ]),
                
                Filter::make('created_at')
                    ->form([
                        DatePicker::make('created_from')
                            ->label('Logged From'),
                        DatePicker::make('created_until')
                            ->label('Logged Until'),
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
            ->defaultSort('created_at', 'desc');
    }
}