<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Transaction;
use App\Mail\Transaction\InvoiceMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

echo "=== Testing InvoiceMail with Transaction ID Fix ===\n\n";

try {
    // Step 1: Create a test transaction
    echo "Step 1: Creating test transaction...\n";
    $transaction = Transaction::create([
        'transaction_id' => 'TEST-' . uniqid(),
        'type' => 'reservation',
        'amount' => 150000,
        'customer_name' => 'Test Customer',
        'customer_email' => 'test@example.com',
        'customer_phone' => '+62812345678',
        'status' => 'pending',
        'notes' => 'Test transaction for InvoiceMail ID fix',
        'expires_at' => now()->addHours(24),
        'transaction_details' => json_encode([
            'items' => [
                ['name' => 'Wagyu Steak', 'price' => 150000, 'quantity' => 1]
            ]
        ])
    ]);
    echo "✓ Transaction created: {$transaction->transaction_id}\n\n";

    // Step 2: Test InvoiceMail instantiation with transaction ID
    echo "Step 2: Testing InvoiceMail with transaction ID...\n";
    $invoiceMail = new InvoiceMail($transaction->id);
    echo "✓ InvoiceMail created successfully with transaction ID\n\n";

    // Step 3: Test envelope generation
    echo "Step 3: Testing envelope generation...\n";
    $envelope = $invoiceMail->envelope();
    echo "✓ Envelope generated successfully\n";
    echo "  Subject: {$envelope->subject}\n";
    echo "  From: {$envelope->from->address}\n\n";

    // Step 4: Test content generation
    echo "Step 4: Testing content generation...\n";
    $content = $invoiceMail->content();
    echo "✓ Content generated successfully\n";
    echo "  HTML Template: {$content->html}\n";
    echo "  Text Template: {$content->text}\n\n";

    // Step 5: Test mail sending with fake
    echo "Step 5: Testing mail sending...\n";
    Mail::fake();
    Mail::to($transaction->customer_email)->send($invoiceMail);
    echo "✓ Mail sent successfully (faked)\n\n";

    // Step 6: Test queue simulation
    echo "Step 6: Testing queue simulation...\n";
    // Simulate what happens when the mail is queued and processed later
    $serialized = serialize($invoiceMail);
    $unserialized = unserialize($serialized);
    
    // Test that the unserialized mail can still access the transaction
    $testEnvelope = $unserialized->envelope();
    echo "✓ Mail serialization/unserialization works\n";
    echo "  Unserialized subject: {$testEnvelope->subject}\n\n";

    // Step 7: Cleanup
    echo "Step 7: Cleaning up...\n";
    $transaction->delete();
    echo "✓ Test transaction deleted\n\n";

    echo "=== All Tests Passed! InvoiceMail ID Fix Working ===\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    
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