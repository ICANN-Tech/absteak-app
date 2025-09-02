<?php

namespace App\Filament\Resources\Newsletter;

use App\Filament\Resources\Newsletter\Pages\CreateNewsletter;
use App\Filament\Resources\Newsletter\Pages\EditNewsletter;
use App\Filament\Resources\Newsletter\Pages\ListNewsletters;
use App\Filament\Resources\Newsletter\Pages\ViewNewsletter;
use App\Filament\Resources\Newsletter\NewsletterResource\RelationManagers\NewsletterLogsRelationManager;
use App\Filament\Resources\Newsletter\Schemas\NewsletterForm;
use App\Filament\Resources\Newsletter\Schemas\NewsletterInfolist;
use App\Filament\Resources\Newsletter\Tables\NewslettersTable;
use App\Models\Newsletter;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class NewsletterResource extends Resource
{
    protected static ?string $model = Newsletter::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-newspaper';

    protected static string|UnitEnum|null $navigationGroup = 'Newsletter Management';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return NewsletterForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return NewsletterInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NewslettersTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            NewsletterLogsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListNewsletters::route('/'),
            'create' => CreateNewsletter::route('/create'),
            'view' => ViewNewsletter::route('/{record}'),
            'edit' => EditNewsletter::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['title', 'content'];
    }
}