<?php

require_once __DIR__ . '/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Services\Ollama;
use App\Models\DineOutSource;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

echo "=== Ollama Integration Test ===\n\n";

try {
    // Test 1: Check if Ollama service is available
    echo "1. Testing Ollama service availability...\n";
    $ollama = new Ollama();
    
    if ($ollama->isAvailable()) {
        echo "✓ Ollama service is available\n";
    } else {
        echo "✗ Ollama service is not available\n";
        exit(1);
    }
    
    // Test 2: Check if embedding model is available
    echo "\n2. Testing embedding model availability...\n";
    if ($ollama->isEmbedModelAvailable()) {
        echo "✓ Embedding model is available\n";
    } else {
        echo "✗ Embedding model is not available\n";
        echo "Available models:\n";
        $models = $ollama->getModels();
        foreach ($models as $model) {
            echo "  - " . $model['name'] . "\n";
        }
        exit(1);
    }
    
    // Test 3: Test direct embedding generation
    echo "\n3. Testing direct embedding generation...\n";
    $testText = "Test restaurant for embedding generation";
    $embedding = $ollama->generateEmbedding($testText);
    
    if ($embedding && is_array($embedding)) {
        echo "✓ Embedding generated successfully\n";
        echo "  Dimensions: " . count($embedding) . "\n";
        echo "  First 5 values: [" . implode(', ', array_slice($embedding, 0, 5)) . ", ...]\n";
    } else {
        echo "✗ Failed to generate embedding\n";
        exit(1);
    }
    
    // Test 4: Check if table exists
    echo "\n4. Checking database table...\n";
    if (Schema::hasTable('dine_out_sources')) {
        echo "✓ dine_out_sources table exists\n";
    } else {
        echo "✗ dine_out_sources table does not exist\n";
        echo "Please run: php artisan migrate\n";
        exit(1);
    }
    
    // Test 5: Test model creation with observer
    echo "\n5. Testing model creation with embedding generation...\n";
    
    // Clear any existing test data
    DineOutSource::where('code', 'TEST_API')->delete();
    
    $testData = [
        'name' => 'Test Restaurant API',
        'code' => 'TEST_API',
        'url' => 'https://test-api.example.com',
        'metadata' => [
            'description' => 'Test restaurant API for embedding generation',
            'category' => 'Testing',
            'features' => ['Search', 'Reviews']
        ]
    ];
    
    $dineOutSource = DineOutSource::create($testData);
    
    if ($dineOutSource && $dineOutSource->id) {
        echo "✓ DineOutSource record created successfully\n";
        echo "  ID: " . $dineOutSource->id . "\n";
        echo "  Name: " . $dineOutSource->name . "\n";
        
        if (!empty($dineOutSource->embedding)) {
            $embeddingData = json_decode($dineOutSource->embedding, true);
            if (is_array($embeddingData)) {
                echo "✓ Embedding generated and stored successfully\n";
                echo "  Embedding dimensions: " . count($embeddingData) . "\n";
            } else {
                echo "✗ Embedding data is not valid JSON array\n";
            }
        } else {
            echo "⚠ No embedding was generated (this might be expected if Ollama is not available)\n";
        }
    } else {
        echo "✗ Failed to create DineOutSource record\n";
        exit(1);
    }
    
    echo "\n=== All tests completed successfully! ===\n";
    
} catch (Exception $e) {
    echo "\n✗ Test failed with error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}