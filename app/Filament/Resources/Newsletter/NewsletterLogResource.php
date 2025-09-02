<?php

namespace App\Filament\Resources\Newsletter;

use App\Filament\Resources\Newsletter\Pages\EditNewsletterLog;
use App\Filament\Resources\Newsletter\Pages\ListNewsletterLogs;
use App\Filament\Resources\Newsletter\Pages\ViewNewsletterLog;
use App\Filament\Resources\Newsletter\Schemas\NewsletterLogForm;
use App\Filament\Resources\Newsletter\Schemas\NewsletterLogInfolist;
use App\Filament\Resources\Newsletter\Tables\NewsletterLogsTable;
use App\Models\NewsletterLog;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;
class NewsletterLogResource extends Resource
{
    protected static ?string $model = NewsletterLog::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentList;

    protected static string|UnitEnum|null $navigationGroup = 'Newsletter Management';

    protected static ?int $navigationSort = 3;

    protected static ?string $recordTitleAttribute = 'action';

    public static function form(Schema $schema): Schema
    {
        return NewsletterLogForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return NewsletterLogInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NewsletterLogsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListNewsletterLogs::route('/'),
            'view' => ViewNewsletterLog::route('/{record}'),
            'edit' => EditNewsletterLog::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['action', 'details'];
    }
}