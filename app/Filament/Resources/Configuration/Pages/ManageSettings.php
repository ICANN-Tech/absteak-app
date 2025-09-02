<?php

namespace App\Filament\Resources\Configuration\Pages;

use App\Filament\Resources\Configuration\ConfigurationResource;
use App\Models\Configuration;
use App\Enums\Configuration\Type;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Get;
use Filament\Resources\Pages\Page;
use Filament\Actions;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;

use Filament\Schemas\Schema;
use Illuminate\Support\Collection;

class ManageSettings extends Page implements HasForms
{
    use InteractsWithForms;
    protected static string $resource = ConfigurationResource::class;
    
    protected string $view = 'filament.resources.configuration-resource.pages.manage-settings';
    
    protected static ?string $title = 'Settings';
    
    protected static ?string $navigationLabel = 'Settings';
    
    public ?string $selectedGroup = null;
    
    public array $data = [];
    
    public function mount(): void
    {
        $this->selectedGroup = 'general';
        $this->loadGroupData();
    }
    
    public function loadGroupData(): void
    {
        $configurations = Configuration::where('group', $this->selectedGroup)->get();
        
        $this->data = $configurations->mapWithKeys(function ($config) {
            return [$config->key => $config->value];
        })->toArray();
        
        $this->form->fill($this->data);
    }
    
    public function selectGroup(string $group): void
    {
        $this->selectedGroup = $group;
        $this->loadGroupData();
    }
    
    public function getGroups(): Collection
    {
        return Configuration::select('group')
            ->distinct()
            ->orderBy('group')
            ->pluck('group')
            ->map(function ($group) {
                return [
                    'key' => $group,
                    'label' => ucfirst(str_replace('_', ' ', $group)),
                    'count' => Configuration::where('group', $group)->count(),
                ];
            });
    }
    
    public function form(Schema $schema): Schema
    {
        return $schema
            ->components($this->getFormSchema())
            ->statePath('data');
    }
    
    protected function getFormSchema(): array
    {
        $configurations = Configuration::where('group', $this->selectedGroup)->get();
        
        $schema = [];
        
        foreach ($configurations as $config) {
            $field = match ($config->type) {
                Type::String => TextInput::make($config->key)
                    ->label($config->key)
                    ->helperText("Type: String")
                    ->default($config->value),
                    
                Type::Integer => TextInput::make($config->key)
                    ->label($config->key)
                    ->numeric()
                    ->helperText("Type: Integer")
                    ->default($config->value),
                    
                Type::Float => TextInput::make($config->key)
                    ->label($config->key)
                    ->numeric()
                    ->step(0.01)
                    ->helperText("Type: Float")
                    ->default($config->value),
                    
                Type::Boolean => Toggle::make($config->key)
                    ->label($config->key)
                    ->helperText("Type: Boolean")
                    ->default((bool) $config->value),
                    
                Type::Array => TagsInput::make($config->key)
                    ->label($config->key)
                    ->helperText("Type: Array")
                    ->default($config->value ?: []),
                    
                Type::Object => KeyValue::make($config->key)
                    ->label($config->key)
                    ->helperText("Type: Object")
                    ->default($config->value ?: []),
            };
            
            $schema[] = $field;
        }
        
        return $schema;
    }
    
    public function save(): void
    {
        $data = $this->form->getState();
        
        foreach ($data as $key => $value) {
            $config = Configuration::where('key', $key)
                ->where('group', $this->selectedGroup)
                ->first();
                
            if ($config) {
                $config->update(['value' => $value]);
            }
        }
        
        Notification::make()
            ->title('Settings saved successfully!')
            ->success()
            ->send();
    }
    
    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('save')
                ->label('Save Settings')
                ->action('save')
                ->color('primary'),
        ];
    }
}