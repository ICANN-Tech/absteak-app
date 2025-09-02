<?php

namespace Database\Seeders;

use App\Models\CustomerService;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CustomerServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create CS users and their profiles
        $csRepresentatives = [
            [
                'name' => 'Alice Johnson',
                'email' => 'alice.johnson@absteak.com',
                'phone' => '+1-555-0101',
                'department' => 'General Support',
                'skills' => ['General Inquiries', 'Order Support', 'Account Management'],
                'max_concurrent_tickets' => 5,
                'bio' => 'Experienced customer service representative with 3+ years in hospitality industry.',
            ],
            [
                'name' => 'Bob Smith',
                'email' => 'bob.smith@absteak.com',
                'phone' => '+1-555-0102',
                'department' => 'Technical Support',
                'skills' => ['Technical Issues', 'App Support', 'Payment Problems'],
                'max_concurrent_tickets' => 3,
                'bio' => 'Technical support specialist with expertise in mobile applications and payment systems.',
            ],
            [
                'name' => 'Carol Davis',
                'email' => 'carol.davis@absteak.com',
                'phone' => '+1-555-0103',
                'department' => 'Reservations',
                'skills' => ['Reservations', 'Table Management', 'Special Events'],
                'max_concurrent_tickets' => 4,
                'bio' => 'Reservation specialist with excellent organizational skills and attention to detail.',
            ],
            [
                'name' => 'David Wilson',
                'email' => 'david.wilson@absteak.com',
                'phone' => '+1-555-0104',
                'department' => 'Billing Support',
                'skills' => ['Billing Inquiries', 'Refunds', 'Payment Processing'],
                'max_concurrent_tickets' => 4,
                'bio' => 'Billing support expert with strong analytical skills and customer-focused approach.',
            ],
            [
                'name' => 'Emma Brown',
                'email' => 'emma.brown@absteak.com',
                'phone' => '+1-555-0105',
                'department' => 'VIP Support',
                'skills' => ['VIP Customers', 'Premium Services', 'Concierge'],
                'max_concurrent_tickets' => 2,
                'bio' => 'VIP support specialist dedicated to providing exceptional service to premium customers.',
            ],
        ];

        foreach ($csRepresentatives as $csData) {
            // Create user account for CS representative
            $user = User::create([
                'id' => (string) Str::uuid(),
                'name' => $csData['name'],
                'email' => $csData['email'],
                'email_verified_at' => now(),
                'password' => Hash::make('password123'), // Default password for testing
            ]);

            // Create customer service profile
            CustomerService::create([
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'name' => $csData['name'],
                'email' => $csData['email'],
                'phone' => $csData['phone'],
                'department' => $csData['department'],
                'status' => 'available', // Start as available
                'is_active' => true,
                'max_concurrent_tickets' => $csData['max_concurrent_tickets'],
                'current_ticket_count' => 0,
                'skills' => $csData['skills'],
                'working_hours' => [
                    'monday' => ['start' => '09:00', 'end' => '17:00'],
                    'tuesday' => ['start' => '09:00', 'end' => '17:00'],
                    'wednesday' => ['start' => '09:00', 'end' => '17:00'],
                    'thursday' => ['start' => '09:00', 'end' => '17:00'],
                    'friday' => ['start' => '09:00', 'end' => '17:00'],
                    'saturday' => ['start' => '10:00', 'end' => '16:00'],
                    'sunday' => ['start' => '10:00', 'end' => '16:00'],
                ],
                'last_activity_at' => now(),
                'bio' => $csData['bio'],
                'avatar' => null, // Can be set later
            ]);
        }

        $this->command->info('Created ' . count($csRepresentatives) . ' customer service representatives.');
        $this->command->info('Default password for all CS accounts: password123');
        $this->command->info('CS Representatives created:');
        
        foreach ($csRepresentatives as $cs) {
            $this->command->info('- ' . $cs['name'] . ' (' . $cs['email'] . ') - ' . $cs['department']);
        }
    }
}