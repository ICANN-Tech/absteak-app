<?php

namespace App\Filament\Resources\Configuration;

use App\Filament\Resources\Configuration\Pages\ManageSettings;
use App\Models\Configuration;
use BackedEnum;
use Filament\Resources\Resource;

class ConfigurationResource extends Resource
{
    protected static ?string $model = Configuration::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-cog-6-tooth';
    
    protected static ?string $navigationLabel = 'Settings';
    
    protected static ?string $modelLabel = 'Configuration';
    
    protected static ?string $pluralModelLabel = 'Configurations';
    
    protected static ?int $navigationSort = 99;

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageSettings::route('/'),
        ];
    }
    
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }
}