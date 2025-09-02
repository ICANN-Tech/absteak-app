<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Transaction;
use App\Mail\Transaction\InvoiceMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

echo "Testing InvoiceMail Debug...\n";
echo "===========================\n\n";

try {
    echo "1. Creating test transaction...\n";
    echo "------------------------------\n";
    
    $transaction = Transaction::create([
        'type' => Transaction::TYPE_ORDER,
        'status' => Transaction::STATUS_PENDING,
        'amount' => 100.00,
        'currency' => 'IDR',
        'customer_name' => 'Debug Test',
        'customer_email' => 'debug@example.com',
        'customer_phone' => '+62812345678',
        'transaction_details' => [
            'items' => [
                [
                    'name' => 'Debug Item',
                    'quantity' => 1,
                    'price' => 100000
                ]
            ]
        ],
        'notes' => 'Debug test for InvoiceMail'
    ]);
    
    echo "✅ Transaction created: " . $transaction->transaction_id . "\n\n";
    
    echo "2. Testing InvoiceMail creation...\n";
    echo "---------------------------------\n";
    
    // Try to create the InvoiceMail instance
    $invoiceMail = new InvoiceMail($transaction);
    echo "✅ InvoiceMail instance created successfully\n\n";
    
    echo "3. Testing mail envelope...\n";
    echo "---------------------------\n";
    
    // Test the envelope method
    $envelope = $invoiceMail->envelope();
    echo "✅ Mail envelope created successfully\n";
    echo "Subject: " . $envelope->subject . "\n\n";
    
    echo "4. Testing mail content...\n";
    echo "--------------------------\n";
    
    // Test the content method
    $content = $invoiceMail->content();
    echo "✅ Mail content created successfully\n";
    echo "HTML View: " . $content->html . "\n";
    echo "Text View: " . $content->text . "\n";
    
    $viewData = $content->with;
    echo "Available view data keys: " . implode(', ', array_keys($viewData)) . "\n";
    
    if (isset($viewData['transaction'])) {
        echo "Transaction data: Available\n";
    }
    
    if (isset($viewData['paymentUrl'])) {
        echo "Payment URL: " . $viewData['paymentUrl'] . "\n";
    }
    
    if (isset($viewData['companyAddress'])) {
        echo "Company Address: Available\n";
    }
    
    echo "\n5. Testing actual mail sending...\n";
    echo "---------------------------------\n";
    
    // Use Mail::fake to capture the mail without actually sending
    Mail::fake();
    
    // Send the mail
    Mail::to($transaction->customer_email)->send($invoiceMail);
    
    echo "✅ Mail sent successfully (faked)\n\n";
    
    echo "6. Testing email template existence...\n";
    echo "-------------------------------------\n";
    
    $htmlTemplate = 'emails.transaction.invoice';
    $textTemplate = 'emails.transaction.invoice-text';
    
    if (view()->exists($htmlTemplate)) {
        echo "✅ HTML template exists: " . $htmlTemplate . "\n";
    } else {
        echo "❌ HTML template missing: " . $htmlTemplate . "\n";
    }
    
    if (view()->exists($textTemplate)) {
        echo "✅ Text template exists: " . $textTemplate . "\n";
    } else {
        echo "❌ Text template missing: " . $textTemplate . "\n";
    }
    
    echo "\n7. Cleaning up...\n";
    echo "----------------\n";
    
    $transaction->delete();
    echo "✅ Test transaction deleted\n\n";
    
    echo "✅ InvoiceMail debug test completed successfully!\n";
    
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

echo "\nDebug test completed at: " . date('Y-m-d H:i:s') . "\n";