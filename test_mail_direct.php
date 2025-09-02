<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Mail;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing direct mail sending to Mailpit...\n";

try {
    // Send a simple test email
    Mail::raw('This is a direct test email to verify Mailpit connection.', function ($message) {
        $message->to('test@example.com')
                ->subject('Direct Mail Test');
    });
    
    echo "✅ Email sent successfully!\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}

echo "Test completed.\n";