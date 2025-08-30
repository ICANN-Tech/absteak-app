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
        $this->seedReservation();
        $this->seedChatbot();
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
