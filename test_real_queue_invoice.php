<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Transaction;
use App\Jobs\Transaction\SendEmailJob;
use Illuminate\Support\Facades\Mail;

echo "=== Testing Real Queue Processing for InvoiceMail ===\n\n";

try {
    // Step 1: Create a test transaction
    echo "Step 1: Creating test transaction...\n";
    $transaction = Transaction::create([
        'transaction_id' => 'QUEUE-TEST-' . uniqid(),
        'type' => 'reservation',
        'amount' => 200000,
        'customer_name' => 'Queue Test Customer',
        'customer_email' => 'queuetest@example.com',
        'customer_phone' => '+62812345678',
        'status' => 'pending',
        'notes' => 'Test transaction for real queue processing',
        'expires_at' => now()->addHours(24),
        'transaction_details' => json_encode([
            'items' => [
                ['name' => 'Premium Wagyu', 'price' => 200000, 'quantity' => 1]
            ]
        ])
    ]);
    echo "✓ Transaction created: {$transaction->transaction_id}\n\n";

    // Step 2: Fake mail to prevent actual sending
    echo "Step 2: Setting up mail fake...\n";
    Mail::fake();
    echo "✓ Mail fake enabled\n\n";

    // Step 3: Dispatch the job
    echo "Step 3: Dispatching SendTransactionEmailJob...\n";
    SendEmailJob::dispatch($transaction, 'invoice');
    echo "✓ Job dispatched successfully\n\n";

    // Step 4: Process the queue
    echo "Step 4: Processing queue...\n";
    $exitCode = \Illuminate\Support\Facades\Artisan::call('queue:work', [
        'connection' => 'database',
        '--once' => true,
        '--timeout' => 30
    ]);
    
    if ($exitCode === 0) {
        echo "✓ Queue processed successfully\n\n";
    } else {
        echo "❌ Queue processing failed with exit code: {$exitCode}\n\n";
    }

    // Step 5: Check for failed jobs
    echo "Step 5: Checking for failed jobs...\n";
    $failedJobs = \Illuminate\Support\Facades\DB::table('failed_jobs')->count();
    if ($failedJobs === 0) {
        echo "✓ No failed jobs found\n\n";
    } else {
        echo "❌ Found {$failedJobs} failed jobs\n\n";
    }

    // Step 6: Verify mail was sent
    echo "Step 6: Verifying mail was sent...\n";
    Mail::assertSent(\App\Mail\Transaction\InvoiceMail::class, function ($mail) use ($transaction) {
        return $mail->transactionId === $transaction->id;
    });
    echo "✓ InvoiceMail was sent correctly\n\n";

    // Step 7: Cleanup
    echo "Step 7: Cleaning up...\n";
    $transaction->delete();
    echo "✓ Test transaction deleted\n\n";

    echo "=== Real Queue Test Passed! InvoiceMail Working in Queue ===\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    
    // Show failed jobs if any
    try {
        $failedJobs = \Illuminate\Support\Facades\DB::table('failed_jobs')
            ->orderBy('failed_at', 'desc')
            ->limit(1)
            ->get();
        
        if ($failedJobs->count() > 0) {
            $failedJob = $failedJobs->first();
            echo "\nLast failed job:\n";
            echo "Queue: {$failedJob->queue}\n";
            echo "Exception: {$failedJob->exception}\n";
        }
    } catch (Exception $dbError) {
        echo "\nCould not check failed jobs: " . $dbError->getMessage() . "\n";
    }
    
    // Cleanup on error
    if (isset($transaction)) {
        try {
            $transaction->delete();
            echo "\n✓ Cleanup: Test transaction deleted\n";
        } catch (Exception $cleanupError) {
            echo "\n❌ Cleanup failed: " . $cleanupError->getMessage() . "\n";
        }
    }
    
    exit(1);
}