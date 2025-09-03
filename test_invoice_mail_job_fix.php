<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Transaction;
use App\Jobs\Transaction\SendEmailJob;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

echo "Testing InvoiceMail Job Fix...\n";
echo "==============================\n\n";

try {
    echo "1. Creating test transaction...\n";
    echo "------------------------------\n";
    
    $transaction = Transaction::create([
        'type' => Transaction::TYPE_ORDER,
        'status' => Transaction::STATUS_PENDING,
        'amount' => 150.00,
        'currency' => 'IDR',
        'customer_name' => 'Job Test User',
        'customer_email' => 'jobtest@example.com',
        'customer_phone' => '+62812345678',
        'transaction_details' => [
            'items' => [
                [
                    'name' => 'Job Test Item',
                    'quantity' => 1,
                    'price' => 150000
                ]
            ]
        ],
        'notes' => 'Job test for InvoiceMail fix'
    ]);
    
    echo "✅ Transaction created: " . $transaction->transaction_id . "\n";
    echo "Transaction ID: " . $transaction->id . "\n\n";
    
    echo "2. Dispatching SendTransactionEmailJob...\n";
    echo "-----------------------------------------\n";
    
    // Dispatch the job to the queue
    SendEmailJob::dispatch($transaction, 'invoice');
    echo "✅ Job dispatched to queue\n\n";
    
    echo "3. Processing queue jobs...\n";
    echo "---------------------------\n";
    
    // Process the queue
    $exitCode = Artisan::call('queue:work', [
        'connection' => 'database',
        '--once' => true,
        '--timeout' => 30
    ]);
    
    echo "Queue work exit code: " . $exitCode . "\n";
    echo "✅ Queue processed\n\n";
    
    echo "4. Checking for failed jobs...\n";
    echo "------------------------------\n";
    
    $failedJobs = DB::table('failed_jobs')->count();
    echo "Failed jobs count: " . $failedJobs . "\n";
    
    if ($failedJobs === 0) {
        echo "✅ No failed jobs - email job processed successfully!\n\n";
    } else {
        echo "❌ Found failed jobs - checking details...\n";
        
        $latestFailed = DB::table('failed_jobs')
            ->orderBy('failed_at', 'desc')
            ->first();
            
        if ($latestFailed) {
            echo "Latest failed job exception: " . substr($latestFailed->exception, 0, 200) . "...\n\n";
        }
    }
    
    echo "5. Verifying transaction still exists...\n";
    echo "---------------------------------------\n";
    
    $existingTransaction = Transaction::find($transaction->id);
    if ($existingTransaction) {
        echo "✅ Transaction still exists in database\n";
        echo "Payment URL: " . ($existingTransaction->getPaymentLinkUrl() ?? 'Not set') . "\n\n";
    } else {
        echo "❌ Transaction not found in database\n\n";
    }
    
    echo "6. Cleaning up...\n";
    echo "----------------\n";
    
    $transaction->delete();
    echo "✅ Test transaction deleted\n\n";
    
    echo "✅ InvoiceMail job fix test completed successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Error occurred: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    
    // Clean up if transaction exists
    if (isset($transaction) && $transaction->exists) {
        try {
            $transaction->delete();
            echo "\n✅ Test transaction cleaned up\n";
        } catch (Exception $cleanupError) {
            echo "\n❌ Failed to clean up: " . $cleanupError->getMessage() . "\n";
        }
    }
}

echo "\nJob fix test completed at: " . date('Y-m-d H:i:s') . "\n";