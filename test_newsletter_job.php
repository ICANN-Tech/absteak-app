<?php

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Foundation\Application;
use App\Jobs\SendNewsletterJob;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing SendNewsletterJob with string parameter...\n";

try {
    // Set queue connection to sync in config
    config(['queue.default' => 'sync']);
    
    // Test dispatching with string parameter
    SendNewsletterJob::dispatch('test@example.com');
    echo "✅ Job executed synchronously!\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}

echo "Test completed.\n";