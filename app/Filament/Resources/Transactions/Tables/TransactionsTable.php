<?php

namespace App\Filament\Resources\Transactions\Tables;

use App\Repositories\Transaction\TransactionRepositoryInterface;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ExportAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Response;

class TransactionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('transaction_id')
                    ->label('Transaction ID')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                
                BadgeColumn::make('type')
                    ->label('Type')
                    ->colors([
                        'primary' => 'reservation',
                        'success' => 'order',
                        'warning' => 'refund',
                    ])
                    ->sortable(),
                
                BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'completed',
                        'danger' => 'failed',
                        'secondary' => 'cancelled',
                        'info' => 'processing',
                    ])
                    ->sortable(),
                
                TextColumn::make('amount')
                    ->label('Amount')
                    ->money('IDR')
                    ->sortable(),
                
                TextColumn::make('customer_name')
                    ->label('Customer Name')
                    ->searchable()
                    ->sortable()
                    ->limit(30),
                
                TextColumn::make('customer_email')
                    ->label('Customer Email')
                    ->searchable()
                    ->sortable()
                    ->limit(30)
                    ->copyable(),
                
                TextColumn::make('customer_phone')
                    ->label('Phone')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                
                TextColumn::make('expires_at')
                    ->label('Expires At')
                    ->dateTime()
                    ->sortable()
                    ->color(fn ($record) => $record->expires_at && $record->expires_at->isPast() ? 'danger' : null),
                
                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'cancelled' => 'Cancelled',
                        'processing' => 'Processing',
                    ])
                    ->multiple(),
                
                SelectFilter::make('type')
                    ->label('Type')
                    ->options([
                        'reservation' => 'Reservation',
                        'order' => 'Order',
                        'refund' => 'Refund',
                    ])
                    ->multiple(),
                
                Filter::make('amount_range')
                    ->form([
                        TextInput::make('amount_from')
                            ->label('Amount From')
                            ->numeric()
                            ->placeholder('0'),
                        TextInput::make('amount_to')
                            ->label('Amount To')
                            ->numeric()
                            ->placeholder('1000000'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['amount_from'],
                                fn (Builder $query, $amount): Builder => $query->where('amount', '>=', $amount),
                            )
                            ->when(
                                $data['amount_to'],
                                fn (Builder $query, $amount): Builder => $query->where('amount', '<=', $amount),
                            );
                    }),
                
                Filter::make('date_range')
                    ->form([
                        DatePicker::make('created_from')
                            ->label('Created From'),
                        DatePicker::make('created_until')
                            ->label('Created Until'),
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
                
                Filter::make('expired')
                    ->label('Expired Transactions')
                    ->query(fn (Builder $query): Builder => $query->where('expires_at', '<', now())
                        ->where('status', '!=', 'completed')),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                ExportAction::make('export_csv')
                    ->label('Export CSV')
                    ->action(function () {
                        $repository = app(TransactionRepositoryInterface::class);
                        $csvContent = $repository->exportToCsv();
                        
                        return Response::make($csvContent, 200, [
                            'Content-Type' => 'text/csv',
                            'Content-Disposition' => 'attachment; filename="transactions_' . date('Y-m-d_H-i-s') . '.csv"',
                        ]);
                    }),
                
                ExportAction::make('export_excel')
                    ->label('Export Excel')
                    ->action(function () {
                        $repository = app(TransactionRepositoryInterface::class);
                        $filePath = $repository->exportToExcel();
                        
                        return Response::download($filePath, basename($filePath), [
                            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        ])->deleteFileAfterSend();
                    }),
                
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->striped()
            ->paginated([10, 25, 50, 100]);
    }
}
