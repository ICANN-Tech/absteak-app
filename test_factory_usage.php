<?php

require_once __DIR__ . '/vendor/autoload.php';

// This script demonstrates how to use the TransactionFactory to generate dummy data
// Note: In a real Laravel application, you would use this within tinker or tests

echo "🏭 Transaction Factory Usage Examples\n";
echo "=====================================\n\n";

// Example 1: Basic factory usage
echo "📝 Example 1: Basic Transaction Creation\n";
echo "---------------------------------------\n";
echo "// Create a random transaction\n";
echo "\$transaction = Transaction::factory()->create();\n\n";

// Example 2: Specific states
echo "📝 Example 2: Creating Transactions with Specific States\n";
echo "--------------------------------------------------------\n";
echo "// Create a paid transaction\n";
echo "\$paidTransaction = Transaction::factory()->paid()->create();\n\n";
echo "// Create an unpaid/declined transaction\n";
echo "\$unpaidTransaction = Transaction::factory()->unpaid()->create();\n\n";
echo "// Create a pending transaction\n";
echo "\$pendingTransaction = Transaction::factory()->pending()->create();\n\n";

// Example 3: Specific types
echo "📝 Example 3: Creating Different Transaction Types\n";
echo "--------------------------------------------------\n";
echo "// Create a purchase transaction\n";
echo "\$purchase = Transaction::factory()->purchase()->paid()->create();\n\n";
echo "// Create a refund transaction\n";
echo "\$refund = Transaction::factory()->refund()->create();\n\n";

// Example 4: High value transactions
echo "📝 Example 4: High Value Transactions\n";
echo "-------------------------------------\n";
echo "// Create a high-value transaction\n";
echo "\$highValue = Transaction::factory()->highValue()->paid()->create();\n\n";

// Example 5: Bulk creation
echo "📝 Example 5: Bulk Transaction Creation\n";
echo "---------------------------------------\n";
echo "// Create 10 random transactions\n";
echo "\$transactions = Transaction::factory()->count(10)->create();\n\n";
echo "// Create 5 paid and 5 unpaid transactions\n";
echo "\$paidTransactions = Transaction::factory()->paid()->count(5)->create();\n";
echo "\$unpaidTransactions = Transaction::factory()->unpaid()->count(5)->create();\n\n";

// Example 6: Custom attributes
echo "📝 Example 6: Custom Attributes\n";
echo "-------------------------------\n";
echo "// Create transaction with custom data\n";
echo "\$customTransaction = Transaction::factory()->create([\n";
echo "    'customer_name' => 'John Doe',\n";
echo "    'customer_email' => 'john.doe@example.com',\n";
echo "    'amount' => 299.99,\n";
echo "    'currency' => 'USD'\n";
echo "]);\n\n";

// Example 7: Testing email notifications
echo "📝 Example 7: Testing Email Notifications\n";
echo "-----------------------------------------\n";
echo "// Create transaction (triggers InvoiceMail)\n";
echo "\$newTransaction = Transaction::factory()->pending()->create();\n\n";
echo "// Update to paid (triggers ReceiptMail)\n";
echo "\$newTransaction->update(['status' => 'paid']);\n\n";
echo "// Update to unpaid (triggers DeclinedMail)\n";
echo "\$newTransaction->update(['status' => 'unpaid']);\n\n";

// Laravel Tinker examples
echo "🔧 Laravel Tinker Examples\n";
echo "==========================\n\n";
echo "Run these commands in Laravel Tinker (php artisan tinker):\n\n";
echo "// Quick test - create and update transaction\n";
echo "\$t = Transaction::factory()->create();\n";
echo "\$t->update(['status' => 'paid']); // Triggers ReceiptMail\n\n";
echo "// Create specific scenario\n";
echo "Transaction::factory()->unpaid()->create([\n";
echo "    'customer_email' => 'test@example.com'\n";
echo "]); // Triggers DeclinedMail\n\n";
echo "// Bulk test\n";
echo "Transaction::factory()->count(5)->create()->each(function(\$t) {\n";
echo "    \$t->update(['status' => 'paid']);\n";
echo "}); // Creates 5 transactions and triggers 10 emails total\n\n";

// Database seeder example
echo "🌱 Database Seeder Example\n";
echo "==========================\n\n";
echo "Add this to your DatabaseSeeder.php:\n\n";
echo "public function run()\n";
echo "{\n";
echo "    // Create sample transactions\n";
echo "    Transaction::factory()->paid()->count(20)->create();\n";
echo "    Transaction::factory()->unpaid()->count(5)->create();\n";
echo "    Transaction::factory()->pending()->count(10)->create();\n";
echo "    Transaction::factory()->cancelled()->count(3)->create();\n";
echo "}\n\n";

echo "✅ Factory is ready to use!\n";
echo "\nNext steps:\n";
echo "1. Run: php artisan migrate\n";
echo "2. Use: php artisan tinker\n";
echo "3. Test: Transaction::factory()->create()\n";
echo "4. Watch: Check your email queue for notifications!\n";