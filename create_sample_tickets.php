<?php

require_once 'vendor/autoload.php';

use App\Models\Ticket;
use App\Models\CustomerService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    // Get some CS agents
    $csAgents = CustomerService::take(3)->get();
    
    if ($csAgents->isEmpty()) {
        echo "No customer service agents found. Please run CustomerServiceSeeder first.\n";
        exit(1);
    }
    
    // Sample tickets data
    $sampleTickets = [
        [
            'subject' => 'Order Issue #12345',
            'description' => 'Customer needs help with their recent order. The order seems to be delayed.',
            'customer_name' => 'John Doe',
            'customer_email' => 'john.doe@example.com',
            'customer_phone' => '+1-555-0123',
            'priority' => 'medium',
            'category' => 'order_support',
            'status' => 'open',
            'chat_session_data' => [
                'session_id' => 'session_' . Str::random(8),
                'messages' => [
                    [
                        'id' => Str::uuid(),
                        'sender' => 'customer',
                        'message' => 'Hi, I need help with my order #12345',
                        'timestamp' => now()->subMinutes(10)->toISOString(),
                        'session_id' => 'session_' . Str::random(8)
                    ],
                    [
                        'id' => Str::uuid(),
                        'sender' => 'bot',
                        'message' => 'I understand you need help with your order. Let me connect you with our customer service team.',
                        'timestamp' => now()->subMinutes(9)->toISOString(),
                        'session_id' => 'session_' . Str::random(8)
                    ]
                ]
            ]
        ],
        [
            'subject' => 'Reservation Cancellation',
            'description' => 'Customer wants to cancel their reservation for tonight.',
            'customer_name' => 'Jane Smith',
            'customer_email' => 'jane.smith@example.com',
            'customer_phone' => '+1-555-0124',
            'priority' => 'high',
            'category' => 'reservations',
            'status' => 'in_progress',
            'chat_session_data' => [
                'session_id' => 'session_' . Str::random(8),
                'messages' => [
                    [
                        'id' => Str::uuid(),
                        'sender' => 'customer',
                        'message' => 'I need to cancel my reservation for tonight',
                        'timestamp' => now()->subMinutes(15)->toISOString(),
                        'session_id' => 'session_' . Str::random(8)
                    ]
                ]
            ]
        ],
        [
            'subject' => 'Billing Question',
            'description' => 'Customer has questions about charges on their bill.',
            'customer_name' => 'Mike Johnson',
            'customer_email' => 'mike.johnson@example.com',
            'customer_phone' => '+1-555-0125',
            'priority' => 'low',
            'category' => 'billing',
            'status' => 'open',
            'chat_session_data' => [
                'session_id' => 'session_' . Str::random(8),
                'messages' => [
                    [
                        'id' => Str::uuid(),
                        'sender' => 'customer',
                        'message' => 'I have some questions about my bill',
                        'timestamp' => now()->subMinutes(5)->toISOString(),
                        'session_id' => 'session_' . Str::random(8)
                    ]
                ]
            ]
        ],
        [
            'subject' => 'Technical Support',
            'description' => 'Customer experiencing issues with the mobile app.',
            'customer_name' => 'Sarah Wilson',
            'customer_email' => 'sarah.wilson@example.com',
            'customer_phone' => '+1-555-0126',
            'priority' => 'medium',
            'category' => 'technical',
            'status' => 'pending_customer',
            'chat_session_data' => [
                'session_id' => 'session_' . Str::random(8),
                'messages' => [
                    [
                        'id' => Str::uuid(),
                        'sender' => 'customer',
                        'message' => 'The app keeps crashing when I try to make a reservation',
                        'timestamp' => now()->subMinutes(20)->toISOString(),
                        'session_id' => 'session_' . Str::random(8)
                    ],
                    [
                        'id' => Str::uuid(),
                        'sender' => 'agent',
                        'message' => 'I\'m sorry to hear about the app issues. Can you tell me what device you\'re using?',
                        'timestamp' => now()->subMinutes(18)->toISOString(),
                        'session_id' => 'session_' . Str::random(8)
                    ]
                ]
            ]
        ]
    ];
    
    echo "Creating sample tickets...\n";
    
    foreach ($sampleTickets as $index => $ticketData) {
        // Assign to different CS agents
        $assignedCs = $csAgents[$index % $csAgents->count()];
        
        $ticket = Ticket::create([
            'id' => (string) Str::uuid(),
            'ticket_number' => 'TKT-' . strtoupper(Str::random(6)),
            'subject' => $ticketData['subject'],
            'description' => $ticketData['description'],
            'customer_name' => $ticketData['customer_name'],
            'customer_email' => $ticketData['customer_email'],
            'customer_phone' => $ticketData['customer_phone'],
            'priority' => $ticketData['priority'],
            'category' => $ticketData['category'],
            'status' => $ticketData['status'],
            'assigned_cs_id' => $ticketData['status'] !== 'open' ? $assignedCs->id : null,
            'assigned_at' => $ticketData['status'] !== 'open' ? now()->subMinutes(rand(5, 30)) : null,
            'chat_session_data' => $ticketData['chat_session_data'],
            'created_at' => now()->subMinutes(rand(5, 60)),
            'updated_at' => now()->subMinutes(rand(1, 10))
        ]);
        
        echo "Created ticket: {$ticket->ticket_number} - {$ticket->subject}\n";
    }
    
    echo "\nSuccessfully created " . count($sampleTickets) . " sample tickets!\n";
    echo "You can now test the CS dashboard at http://localhost:8000/cs-dashboard\n";
    
} catch (Exception $e) {
    echo "Error creating sample tickets: " . $e->getMessage() . "\n";
    exit(1);
}