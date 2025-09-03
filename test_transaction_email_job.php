<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Set queue connection to sync for immediate processing
config(['queue.default' => 'sync']);

use App\Jobs\Transaction\SendEmailJob;
use App\Models\Transaction;
use Database\Factories\TransactionFactory;
use Illuminate\Support\Facades\Log;

try {
    echo "Testing SendTransactionEmailJob with sync queue...\n";
    
    // Create a test transaction using the factory and save it to database
    $transaction = Transaction::factory()->create([
        'customer_name' => 'John Doe',
        'customer_email' => 'john.doe@example.com',
        'amount' => 150.00,
        'currency' => 'USD',
        'status' => 'pending',
        'payment_method' => 'credit_card',
        'type' => 'purchase'
    ]);
    
    echo "Created test transaction: {$transaction->transaction_id}\n";
    echo "Customer: {$transaction->customer_name} ({$transaction->customer_email})\n";
    echo "Amount: {$transaction->currency} {$transaction->amount}\n";
    echo "Status: {$transaction->status}\n\n";
    
    // Test 1: Invoice email (pending status)
    echo "Test 1: Dispatching invoice email job...\n";
    $transaction->update(['status' => 'pending']);
    SendEmailJob::dispatch($transaction);
    echo "✓ Invoice email job processed successfully\n\n";
    
    // Test 2: Receipt email (paid status)
    echo "Test 2: Dispatching receipt email job...\n";
    $transaction->update(['status' => 'paid']);
    SendEmailJob::dispatch($transaction);
    echo "✓ Receipt email job processed successfully\n\n";
    
    // Test 3: Declined email (unpaid status)
    echo "Test 3: Dispatching declined email job...\n";
    $transaction->update(['status' => 'unpaid']);
    SendEmailJob::dispatch($transaction);
    echo "✓ Declined email job processed successfully\n\n";
    
    // Clean up - delete the test transaction
    $transaction->delete();
    echo "Test transaction cleaned up.\n\n";
    
    echo "All tests completed successfully!\n";
    echo "Check Mailpit (http://localhost:8025) for the sent emails.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}