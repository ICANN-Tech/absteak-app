<?php

namespace App\Filament\Resources\Newsletter\NewsletterResource\RelationManagers;

use App\Models\NewsletterLog;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Filters\SelectFilter;

class NewsletterLogsRelationManager extends RelationManager
{
    protected static string $relationship = 'logs';

    protected static ?string $title = 'Distribution Logs';

    protected static ?string $modelLabel = 'Log Entry';

    protected static ?string $pluralModelLabel = 'Log Entries';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('action')
            ->columns([
                TextColumn::make('newsletterSubscriber.email')
                    ->label('Subscriber Email')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('action')
                    ->label('Action')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'email_delivery' => 'primary',
                        'email_opened' => 'success',
                        'email_clicked' => 'info',
                        'email_bounced' => 'danger',
                        'email_unsubscribed' => 'warning',
                        default => 'gray',
                    })
                    ->sortable(),
                
                BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'success' => 'sent',
                        'danger' => 'failed',
                        'warning' => 'pending',
                        'gray' => 'unknown',
                    ])
                    ->sortable(),
                
                TextColumn::make('details')
                    ->label('Details')
                    ->limit(50)
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        return is_string($state) && strlen($state) > 50 ? $state : null;
                    }),
                
                TextColumn::make('ip_address')
                    ->label('IP Address')
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('created_at')
                    ->label('Logged At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),
            ])
            ->filters([
                SelectFilter::make('action')
                    ->options([
                        'email_delivery' => 'Email Delivery',
                        'email_opened' => 'Email Opened',
                        'email_clicked' => 'Email Clicked',
                        'email_bounced' => 'Email Bounced',
                        'email_unsubscribed' => 'Email Unsubscribed',
                    ]),
                
                SelectFilter::make('status')
                    ->options([
                        'sent' => 'Sent',
                        'failed' => 'Failed',
                        'pending' => 'Pending',
                    ]),
            ])
            ->headerActions([
                // No create action - logs are generated automatically
            ])
            ->actions([
                // View action removed due to compatibility issues
            ])
            ->bulkActions([
                // No bulk actions for logs
            ])
            ->defaultSort('created_at', 'desc')
            ->poll('30s'); // Auto-refresh every 30 seconds
    }
}