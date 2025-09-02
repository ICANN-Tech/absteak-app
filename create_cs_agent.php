<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\CustomerService;

// Create a user first
$user = User::create([
    'name' => 'CS Agent User',
    'email' => 'cs@absteak.com',
    'password' => bcrypt('password123'),
    'email_verified_at' => now()
]);
echo "User created with ID: {$user->id}\n";

// Create customer service agent
$csAgent = CustomerService::create([
    'user_id' => $user->id,
    'name' => 'Test CS Agent',
    'email' => $user->email,
    'status' => 'available',
    'department' => 'general'
]);
echo "Customer service agent created successfully with ID: {$csAgent->id}\n";