<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Mongo;
use Exception;

class TestMongoConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mongo:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test MongoDB connection';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $mongo = app(Mongo::class);
            
            if ($mongo->ping()) {
                $this->info('✅ MongoDB connection: SUCCESS');
                
                // Test basic operations
                $testData = ['test' => 'data', 'timestamp' => now()];
                $result = $mongo->insert('test_collection', $testData);
                
                if ($result) {
                    $this->info('✅ MongoDB insert test: SUCCESS');
                    
                    // Clean up test data
                    $mongo->deleteById('test_collection', $result->getInsertedId());
                    $this->info('✅ MongoDB delete test: SUCCESS');
                } else {
                    $this->error('❌ MongoDB insert test: FAILED');
                }
            } else {
                $this->error('❌ MongoDB connection: FAILED');
            }
        } catch (Exception $e) {
            $this->error('❌ MongoDB connection error: ' . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}
