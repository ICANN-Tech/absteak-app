<?php

namespace Database\Seeders;

use App\Models\DineOutSource;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class DineOutSourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Log::info('Starting DineOutSource seeding with embedding generation');

        // Sample data for delivery platforms like Gojek, Grab, etc.
        $sampleData = [
            [
                'name' => 'Gojek Food Delivery',
                'code' => 'GOJEK_FOOD',
                'url' => 'https://www.gojek.com/food',
                'metadata' => [
                    'description' => 'Indonesian multi-service platform with food delivery',
                    'category' => 'Food Delivery',
                    'region' => 'Southeast Asia',
                    'features' => ['Food Delivery', 'Restaurant Partners', 'Real-time Tracking'],
                    'rating' => 4.3
                ]
            ],
            [
                'name' => 'Grab Food Platform',
                'code' => 'GRAB_FOOD',
                'url' => 'https://www.grab.com/sg/food/',
                'metadata' => [
                    'description' => 'Southeast Asian super app with comprehensive food delivery',
                    'category' => 'Food Delivery',
                    'region' => 'Southeast Asia',
                    'features' => ['Food Delivery', 'Restaurant Discovery', 'Promotions'],
                    'rating' => 4.4
                ]
            ],
            [
                'name' => 'Foodpanda Delivery',
                'code' => 'FOODPANDA',
                'url' => 'https://www.foodpanda.com',
                'metadata' => [
                    'description' => 'Global food delivery platform operating in Asia and Europe',
                    'category' => 'Food Delivery',
                    'region' => 'Asia, Europe',
                    'features' => ['Food Delivery', 'Grocery Delivery', 'Restaurant Partners'],
                    'rating' => 4.1
                ]
            ]
        ];
        
        foreach ($sampleData as $data) {
            try {
                // Create the record - this will trigger the observer
                $dineOutSource = DineOutSource::updateOrCreate(
                    ['code' => $data['code']],
                    $data
                );
                
                Log::info('DineOutSource created successfully', [
                    'id' => $dineOutSource->id,
                    'name' => $dineOutSource->name,
                    'has_embedding' => !empty($dineOutSource->embedding)
                ]);
                
            } catch (\Exception $e) {
        dd($e->getMessage());
                Log::error('Failed to create DineOutSource', [
                    'name' => $data['name'],
                    'error' => $e->getMessage()
                ]);
            }
        }

        Log::info('DineOutSource seeding completed');
    }
}
