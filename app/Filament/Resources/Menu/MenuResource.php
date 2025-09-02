<?php

namespace App\Filament\Resources\Menu;

use App\Filament\Resources\Menu\Pages\CreateMenu;
use App\Filament\Resources\Menu\Pages\EditMenu;
use App\Filament\Resources\Menu\Pages\ListMenus;
use App\Filament\Resources\Menu\Pages\ViewMenu;
use App\Filament\Resources\Menu\Schemas\MenuForm;
use App\Filament\Resources\Menu\Schemas\MenuInfolist;
use App\Filament\Resources\Menu\Tables\MenusTable;
use App\Models\Menu;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class MenuResource extends Resource
{
    protected static ?string $model = Menu::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';
    
    protected static ?string $navigationLabel = 'Menus';
    
    protected static ?string $modelLabel = 'Menu';
    
    protected static ?string $pluralModelLabel = 'Menus';
    
    protected static ?int $navigationSort = 10;
    
    protected static string|UnitEnum|null $navigationGroup = 'Menu Management';

    public static function form(Schema $schema): Schema
    {
        return MenuForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MenusTable::configure($table);
    }

    public static function infolist(Schema $schema): Schema
    {
        return MenuInfolist::configure($schema);
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
            'index' => ListMenus::route('/'),
            'create' => CreateMenu::route('/create'),
            'view' => ViewMenu::route('/{record}'),
            'edit' => EditMenu::route('/{record}/edit'),
        ];
    }
    
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }
    
    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'description', 'category.name'];
    }
}