<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Mail;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing direct mail with your working configuration...\n";

try {
    // Set the configuration that works for you
    config([
        'mail.default' => 'smtp',
        'mail.mailers.smtp.host' => 'mailpit',
        'mail.mailers.smtp.port' => 1025,
        'mail.mailers.smtp.encryption' => null,
        'mail.mailers.smtp.username' => null,
        'mail.mailers.smtp.password' => null,
        'mail.from.address' => 'test@example.com',
        'mail.from.name' => 'Laravel Test',
    ]);
    
    // Send email using your exact method
    Mail::html('<h1>Hello Mailpit</h1><p>Email dari Tinker langsung.</p>', function ($message) {
        $message->to('target@example.com')
                ->subject('Tes Kirim via Tinker');
    });
    
    echo "✅ Email sent successfully with direct configuration!\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}

echo "Test completed.\n";