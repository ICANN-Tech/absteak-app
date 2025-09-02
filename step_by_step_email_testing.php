<?php

/**
 * Step-by-Step Email Testing Guide for Transaction System
 * 
 * This script provides a comprehensive testing approach to verify
 * that transaction emails are properly sent to Mailpit.
 */

echo "\n=== TRANSACTION EMAIL TESTING GUIDE ===\n";
echo "Follow these steps to test and debug email delivery:\n\n";

// Step 1: Environment Check
echo "STEP 1: VERIFY ENVIRONMENT CONFIGURATION\n";
echo "----------------------------------------\n";
echo "Current Environment Variables:\n";
echo "QUEUE_CONNECTION: " . env('QUEUE_CONNECTION', 'not set') . "\n";
echo "MAIL_MAILER: " . env('MAIL_MAILER', 'not set') . "\n";
echo "MAIL_HOST: " . env('MAIL_HOST', 'not set') . "\n";
echo "MAIL_PORT: " . env('MAIL_PORT', 'not set') . "\n";
echo "BEANSTALKD_QUEUE_HOST: " . env('BEANSTALKD_QUEUE_HOST', 'not set') . "\n";
echo "\n";

echo "✅ Expected Values:\n";
echo "   QUEUE_CONNECTION=beanstalkd\n";
echo "   MAIL_MAILER=smtp\n";
echo "   MAIL_HOST=mailpit\n";
echo "   MAIL_PORT=1025\n";
echo "   BEANSTALKD_QUEUE_HOST=beanstalkd\n\n";

// Step 2: Docker Services Check
echo "STEP 2: VERIFY DOCKER SERVICES\n";
echo "------------------------------\n";
echo "Run these commands in your terminal:\n";
echo "\n";
echo "# Check if containers are running\n";
echo "docker ps | grep -E '(beanstalkd|mailpit)'\n";
echo "\n";
echo "# Check container logs\n";
echo "docker logs beanstalkd\n";
echo "docker logs mailpit\n";
echo "\n";
echo "✅ Expected: Both containers should be running and accessible\n\n";

// Step 3: Queue Worker Check
echo "STEP 3: START QUEUE WORKER\n";
echo "---------------------------\n";
echo "The queue worker processes jobs from Beanstalkd.\n";
echo "\n";
echo "Run this command in a separate terminal:\n";
echo "docker exec -it absteak-app php artisan queue:work beanstalkd --verbose\n";
echo "\n";
echo "Or if you prefer to run it in the background:\n";
echo "docker exec -d absteak-app php artisan queue:work beanstalkd\n";
echo "\n";
echo "✅ Expected: Worker should start and show 'Processing jobs...'\n\n";

// Step 4: Laravel Tinker Testing
echo "STEP 4: TEST WITH LARAVEL TINKER\n";
echo "--------------------------------\n";
echo "Open Laravel Tinker and run these commands step by step:\n";
echo "\n";
echo "# Enter Tinker\n";
echo "docker exec -it absteak-app php artisan tinker\n";
echo "\n";
echo "# Test 1: Create and save a transaction (triggers observer)\n";
echo "\$transaction = \\App\\Models\\Transaction::factory()->create([\n";
echo "    'customer_email' => 'test@example.com',\n";
echo "    'status' => 'pending'\n";
echo "]);\n";
echo "\n";
echo "# Test 2: Update transaction status (triggers observer)\n";
echo "\$transaction->update(['status' => 'paid']);\n";
echo "\n";
echo "# Test 3: Check if jobs were queued\n";
echo "\\Illuminate\\Support\\Facades\\Queue::size('default');\n";
echo "\n";
echo "# Test 4: Manually dispatch email (bypass observer)\n";
echo "\\Illuminate\\Support\\Facades\\Mail::to('test@example.com')\n";
echo "    ->queue(new \\App\\Mail\\Transaction\\InvoiceMail(\$transaction));\n";
echo "\n";
echo "✅ Expected: Each command should execute without errors\n\n";

// Step 5: Monitor Queue Jobs
echo "STEP 5: MONITOR QUEUE PROCESSING\n";
echo "--------------------------------\n";
echo "Watch the queue worker terminal for job processing:\n";
echo "\n";
echo "✅ Expected output in queue worker:\n";
echo "   [timestamp] Processing: App\\Mail\\Transaction\\InvoiceMail\n";
echo "   [timestamp] Processed:  App\\Mail\\Transaction\\InvoiceMail\n";
echo "\n";
echo "If jobs are not processing, check:\n";
echo "• Queue worker is running\n";
echo "• Beanstalkd container is accessible\n";
echo "• No errors in worker output\n\n";

// Step 6: Check Mailpit
echo "STEP 6: CHECK MAILPIT INTERFACE\n";
echo "-------------------------------\n";
echo "Open Mailpit web interface:\n";
echo "URL: http://localhost:8025\n";
echo "\n";
echo "✅ Expected: You should see emails in the inbox\n";
echo "\n";
echo "If no emails appear:\n";
echo "• Check Mailpit logs: docker logs mailpit\n";
echo "• Verify MAIL_HOST=mailpit in .env.docker\n";
echo "• Ensure port 8025 is accessible\n\n";

// Step 7: Debugging Commands
echo "STEP 7: DEBUGGING COMMANDS\n";
echo "--------------------------\n";
echo "If emails still don't appear, run these debug commands:\n";
echo "\n";
echo "# Check queue configuration\n";
echo "docker exec -it absteak-app php artisan config:show queue\n";
echo "\n";
echo "# Check mail configuration\n";
echo "docker exec -it absteak-app php artisan config:show mail\n";
echo "\n";
echo "# List failed jobs\n";
echo "docker exec -it absteak-app php artisan queue:failed\n";
echo "\n";
echo "# Clear config cache (if needed)\n";
echo "docker exec -it absteak-app php artisan config:clear\n";
echo "\n";
echo "# Test Beanstalkd connection\n";
echo "docker exec -it absteak-app php artisan tinker\n";
echo ">>> \\Illuminate\\Support\\Facades\\Queue::connection('beanstalkd')->size('default')\n";
echo "\n";

// Step 8: Common Issues
echo "STEP 8: COMMON ISSUES & SOLUTIONS\n";
echo "----------------------------------\n";
echo "\n";
echo "❌ Issue: Jobs queued but not processed\n";
echo "   Solution: Start queue worker (Step 3)\n";
echo "\n";
echo "❌ Issue: Queue worker shows connection errors\n";
echo "   Solution: Check Beanstalkd container and BEANSTALKD_QUEUE_HOST\n";
echo "\n";
echo "❌ Issue: Emails processed but not in Mailpit\n";
echo "   Solution: Verify MAIL_HOST=mailpit and MAIL_PORT=1025\n";
echo "\n";
echo "❌ Issue: Observer not triggering\n";
echo "   Solution: Ensure Transaction model uses SelfReferenceTrait\n";
echo "\n";
echo "❌ Issue: Factory make() vs create()\n";
echo "   Solution: Use create() to save to database and trigger observers\n";
echo "\n";

echo "=== QUICK TEST SEQUENCE ===\n";
echo "\n";
echo "1. Restart containers: docker-compose restart\n";
echo "2. Start queue worker: docker exec -d absteak-app php artisan queue:work beanstalkd\n";
echo "3. Open Tinker: docker exec -it absteak-app php artisan tinker\n";
echo "4. Create transaction: \\App\\Models\\Transaction::factory()->create(['customer_email' => 'test@example.com'])\n";
echo "5. Check Mailpit: http://localhost:8025\n";
echo "\n";
echo "If this sequence works, your system is properly configured!\n";
echo "\n";

?>