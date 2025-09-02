<?php

namespace App\Filament\Resources\Newsletter;

use App\Filament\Resources\Newsletter\Pages\EditNewsletterSubscriber;
use App\Filament\Resources\Newsletter\Pages\ListNewsletterSubscribers;
use App\Filament\Resources\Newsletter\Pages\ViewNewsletterSubscriber;
use App\Filament\Resources\Newsletter\Schemas\NewsletterSubscriberForm;
use App\Filament\Resources\Newsletter\Schemas\NewsletterSubscriberInfolist;
use App\Filament\Resources\Newsletter\Tables\NewsletterSubscribersTable;
use App\Models\NewsletterSubscriber;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class NewsletterSubscriberResource extends Resource
{
    protected static ?string $model = NewsletterSubscriber::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static string|UnitEnum|null $navigationGroup = 'Newsletter Management';

    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'email';

    public static function form(Schema $schema): Schema
    {
        return NewsletterSubscriberForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return NewsletterSubscriberInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NewsletterSubscribersTable::configure($table);
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
            'index' => ListNewsletterSubscribers::route('/'),
            'view' => ViewNewsletterSubscriber::route('/{record}'),
            'edit' => EditNewsletterSubscriber::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_active', true)->count();
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['email', 'first_name', 'last_name'];
    }
}