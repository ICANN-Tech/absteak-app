<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Transaction;
use App\Jobs\Transaction\SendEmailJob;

echo "=== Testing Live Queue Processing ===\n\n";

try {
    // Create a test transaction
    echo "Creating test transaction...\n";
    $transaction = Transaction::create([
        'transaction_id' => 'LIVE-TEST-' . uniqid(),
        'type' => 'reservation',
        'amount' => 175000,
        'customer_name' => 'Live Test Customer',
        'customer_email' => 'livetest@example.com',
        'customer_phone' => '+62812345678',
        'status' => 'pending',
        'notes' => 'Live queue test transaction',
        'expires_at' => now()->addHours(24),
        'transaction_details' => json_encode([
            'items' => [
                ['name' => 'Ribeye Steak', 'price' => 175000, 'quantity' => 1]
            ]
        ])
    ]);
    echo "✓ Transaction created: {$transaction->transaction_id}\n\n";

    // Dispatch the job
    echo "Dispatching SendTransactionEmailJob for invoice...\n";
    SendEmailJob::dispatch($transaction, 'invoice');
    echo "✓ Job dispatched successfully\n\n";

    echo "Job has been queued. Check the queue worker terminal to see if it processes successfully.\n";
    echo "Transaction ID: {$transaction->transaction_id}\n";
    echo "Customer Email: {$transaction->customer_email}\n\n";

    echo "To clean up this test transaction later, run:\n";
    echo "docker exec -it absteak-app-app-1 php -r \"require 'vendor/autoload.php'; \$app = require 'bootstrap/app.php'; \$app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap(); App\\Models\\Transaction::where('transaction_id', '{$transaction->transaction_id}')->delete();\"\n\n";

    echo "=== Live Test Dispatched Successfully ===\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    exit(1);
}