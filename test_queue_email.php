<?php

require_once __DIR__ . '/vendor/autoload.php';

// This script tests the queue and email configuration
echo "🔧 Testing Queue and Email Configuration\n";
echo "=====================================\n\n";

// Check environment variables
echo "📋 Current Configuration:\n";
echo "-------------------------\n";
echo "QUEUE_CONNECTION: " . (getenv('QUEUE_CONNECTION') ?: 'Not set') . "\n";
echo "MAIL_MAILER: " . (getenv('MAIL_MAILER') ?: 'Not set') . "\n";
echo "MAIL_HOST: " . (getenv('MAIL_HOST') ?: 'Not set') . "\n";
echo "MAIL_PORT: " . (getenv('MAIL_PORT') ?: 'Not set') . "\n";
echo "BEANSTALKD_QUEUE_HOST: " . (getenv('BEANSTALKD_QUEUE_HOST') ?: 'Not set') . "\n";
echo "BEANSTALKD_QUEUE: " . (getenv('BEANSTALKD_QUEUE') ?: 'Not set') . "\n\n";

// Laravel Tinker commands for testing
echo "🧪 Laravel Tinker Test Commands:\n";
echo "=================================\n\n";

echo "1. Test Queue Configuration:\n";
echo "   php artisan tinker\n";
echo "   >>> config('queue.default')\n";
echo "   >>> config('queue.connections.beanstalkd')\n\n";

echo "2. Test Mail Configuration:\n";
echo "   >>> config('mail.default')\n";
echo "   >>> config('mail.mailers.smtp')\n\n";

echo "3. Create and Test Transaction Email:\n";
echo "   >>> \$t = Transaction::factory()->create(['customer_email' => 'test@example.com'])\n";
echo "   >>> \$t->transaction_id\n";
echo "   >>> \$t->customer_email\n\n";

echo "4. Trigger Email Manually:\n";
echo "   >>> use App\\Mail\\Transaction\\InvoiceMail\n";
echo "   >>> Mail::to('test@example.com')->send(new InvoiceMail(\$t))\n\n";

echo "5. Check Queue Jobs:\n";
echo "   >>> DB::table('jobs')->count()\n";
echo "   >>> DB::table('jobs')->get()\n\n";

echo "6. Update Transaction Status (triggers emails):\n";
echo "   >>> \$t->update(['status' => 'paid'])  // Should trigger ReceiptMail\n";
echo "   >>> \$t->update(['status' => 'unpaid']) // Should trigger DeclinedMail\n\n";

// Debugging steps
echo "🐛 Debugging Steps:\n";
echo "==================\n\n";

echo "1. Check if Beanstalkd is running:\n";
echo "   docker-compose ps beanstalkd\n";
echo "   docker-compose logs beanstalkd\n\n";

echo "2. Check if Mailpit is running:\n";
echo "   docker-compose ps mailpit\n";
echo "   docker-compose logs mailpit\n";
echo "   Open: http://localhost:8025\n\n";

echo "3. Check queue worker:\n";
echo "   php artisan queue:work --verbose\n";
echo "   php artisan queue:work beanstalkd --verbose\n\n";

echo "4. Check Laravel logs:\n";
echo "   tail -f storage/logs/laravel.log\n\n";

echo "5. Clear cache and config:\n";
echo "   php artisan config:clear\n";
echo "   php artisan cache:clear\n";
echo "   php artisan queue:restart\n\n";

// Common issues and solutions
echo "⚠️  Common Issues & Solutions:\n";
echo "=============================\n\n";

echo "Issue 1: Emails not queued\n";
echo "- Check: QUEUE_CONNECTION=beanstalkd in .env\n";
echo "- Check: Mail classes implement ShouldQueue\n";
echo "- Check: onQueue('default') in constructors\n\n";

echo "Issue 2: Queue worker not processing\n";
echo "- Check: Beanstalkd container is running\n";
echo "- Check: BEANSTALKD_QUEUE_HOST=beanstalkd\n";
echo "- Run: php artisan queue:work beanstalkd\n\n";

echo "Issue 3: Emails not appearing in Mailpit\n";
echo "- Check: MAIL_MAILER=smtp\n";
echo "- Check: MAIL_HOST=mailpit\n";
echo "- Check: MAIL_PORT=1025\n";
echo "- Check: Mailpit web interface at http://localhost:8025\n\n";

echo "Issue 4: Observer not triggering\n";
echo "- Check: Transaction model uses SelfReferenceTrait\n";
echo "- Check: Model events are firing (created, updated)\n";
echo "- Check: Laravel logs for errors\n\n";

echo "✅ Configuration Updated!\n";
echo "\nNext steps:\n";
echo "1. Restart containers: docker-compose restart\n";
echo "2. Run queue worker: php artisan queue:work beanstalkd\n";
echo "3. Test with: Transaction::factory()->create()\n";
echo "4. Check Mailpit: http://localhost:8025\n";