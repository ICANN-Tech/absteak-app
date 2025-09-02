<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Configuration;

class ConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedFromJsonFile();
        $this->seedReservation();
        $this->seedChatbot();
    }

    private function seedFromJsonFile(): void
    {
        $jsonPath = storage_path('app/public/data/configuration-seeder.json');
        
        if (!file_exists($jsonPath)) {
            $this->command->warn('Configuration seeder JSON file not found at: ' . $jsonPath);
            return;
        }
        
        $configurations = json_decode(file_get_contents($jsonPath), true);
        
        if (!$configurations) {
            $this->command->warn('Invalid JSON in configuration seeder file');
            return;
        }
        
        foreach ($configurations as $config) {
            $type = match($config['type']) {
                'string' => \App\Enums\Configuration\Type::String,
                'integer' => \App\Enums\Configuration\Type::Integer,
                'float' => \App\Enums\Configuration\Type::Float,
                'boolean' => \App\Enums\Configuration\Type::Boolean,
                'array' => \App\Enums\Configuration\Type::Array,
                'object' => \App\Enums\Configuration\Type::Object,
                default => \App\Enums\Configuration\Type::String,
            };
            
            $value = $config['value'];
            
            // JSON encode arrays and objects for storage
            if (in_array($type, [\App\Enums\Configuration\Type::Array, \App\Enums\Configuration\Type::Object]) && (is_array($value) || is_object($value))) {
                $value = json_encode($value);
            }
            
            Configuration::updateOrCreate(
                ['key' => $config['key']],
                [
                    'group' => $config['group'],
                    'value' => $value,
                    'type' => $type,
                ]
            );
        }
        
        $this->command->info('Configurations seeded from JSON file successfully.');
    }

    private function seedReservation(): void
    {
        $reservations = [
            [
                'key' => 'max_day_reservation_date',
                'type' => \App\Enums\Configuration\Type::Integer,
                'value' => 14,
            ],
        ];

        foreach ($reservations as $reservation) {
            Configuration::updateOrCreate([
                'key' => $reservation['key'],
            ],
            [
                'type' => $reservation['type'],
                'value' => $reservation['value'],
                'group' => 'reservation',
            ]);
        }
    }

    private function seedChatbot(): void
    {
        $chatbots = [
            [
                'key' => 'assistant_chatid',
                'type' => \App\Enums\Configuration\Type::String,
                'value' => '7c403eaf-552f-439c-9bad-699549030edb',
            ],
            [
                'key' => 'reservation_chatid',
                'type' => \App\Enums\Configuration\Type::String,
                'value' => 'c1b39e43-0ac5-4ac2-8c23-986dec8a1b16',
            ],
            [
                'key' => 'asking_chatid',
                'type' => \App\Enums\Configuration\Type::String,
                'value' => '48de0e39-a6a9-4629-8909-900d0b004bed',
            ],
        ];

        foreach ($chatbots as $chatbot) {
            Configuration::updateOrCreate([
                'key' => $chatbot['key'],
            ],
            [
                'type' => $chatbot['type'],
                'value' => $chatbot['value'],
                'group' => 'chatbot',
            ]);
        }
    }
}
