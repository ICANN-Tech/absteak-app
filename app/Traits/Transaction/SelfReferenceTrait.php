<?php

namespace App\Traits\Transaction;

use App\Mail\Transaction\InvoiceMail;
use App\Mail\Transaction\ReceiptMail;
use App\Mail\Transaction\DeclinedMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * Transaction Self Reference Trait
 * 
 * Implements the Observer pattern for Transaction model events.
 * Automatically sends email notifications based on transaction state changes:
 * - On creation: Sends invoice email
 * - On payment: Sends receipt email  
 * - On unpaid status: Sends declined email
 * 
 * This trait provides:
 * - Clean separation of concerns between model logic and email notifications
 * - Reusable email notification system across different transaction types
 * - Comprehensive error handling and logging
 * - Self-documenting code structure with clear event handling
 */
trait SelfReferenceTrait
{
    /**
     * Boot the trait and register model event observers
     * 
     * This method is automatically called when the model is booted.
     * It registers observers for the following events:
     * - created: Triggered when a new transaction is created
     * - updated: Triggered when transaction status changes
     */
    protected static function bootSelfReferenceTrait(): void
    {
        // Observer registration for transaction creation
        // Sends invoice email when a new transaction is created
        static::created(function ($transaction) {
            static::handleTransactionCreated($transaction);
        });

        // Observer registration for transaction updates
        // Monitors status changes and triggers appropriate email notifications
        static::updated(function ($transaction) {
            static::handleTransactionUpdated($transaction);
        });
    }

    /**
     * Handle transaction creation event
     * 
     * Event handling logic:
     * - Validates transaction data
     * - Selects appropriate mail class (InvoiceMail)
     * - Sends email notification with error handling
     * 
     * @param \App\Models\Transaction $transaction The newly created transaction
     * @return void
     */
    protected static function handleTransactionCreated($transaction): void
    {
        try {
            // Validate required fields for email sending
            if (!static::validateTransactionForEmail($transaction)) {
                Log::warning('Transaction created but email not sent due to missing required fields', [
                    'transaction_id' => $transaction->transaction_id,
                    'customer_email' => $transaction->customer_email,
                ]);
                return;
            }
            
            // Mail class selection process: InvoiceMail for new transactions
            // This provides a clear invoice with transaction details and payment instructions
            static::sendTransactionEmail($transaction, InvoiceMail::class, 'invoice');
            
            Log::info('Invoice email sent for new transaction', [
                'transaction_id' => $transaction->transaction_id,
                'customer_email' => $transaction->customer_email,
                'type' => $transaction->type,
            ]);            
        } catch (Exception $e) {
            // Error handling mechanism: Log errors but don't break transaction flow
            static::handleEmailError($e, $transaction, 'creation');
        }
    }

    /**
     * Handle transaction update event
     * 
     * Event handling logic:
     * - Detects status changes using Laravel's isDirty() method
     * - Routes to appropriate email handler based on new status
     * - Implements status-specific email logic
     * 
     * @param \App\Models\Transaction $transaction The updated transaction
     * @return void
     */
    protected static function handleTransactionUpdated($transaction): void
    {
        try {
            // Check if status field was changed
            if (!$transaction->isDirty('status')) {
                return; // No status change, no email needed
            }

            // Validate transaction data before sending emails
            if (!static::validateTransactionForEmail($transaction)) {
                Log::warning('Transaction updated but email not sent due to missing required fields', [
                    'transaction_id' => $transaction->transaction_id,
                    'status' => $transaction->status,
                ]);
                return;
            }

            // Mail class selection process based on status
            switch ($transaction->status) {
                case 'paid':
                    // ReceiptMail: Confirms successful payment with transaction details
                    static::sendTransactionEmail($transaction, ReceiptMail::class, 'receipt');
                    Log::info('Receipt email sent for paid transaction', [
                        'transaction_id' => $transaction->transaction_id,
                        'customer_email' => $transaction->customer_email,
                    ]);
                    break;
                    
                case 'unpaid':
                    // DeclinedMail: Notifies about payment failure with retry instructions
                    static::sendTransactionEmail($transaction, DeclinedMail::class, 'declined');
                    Log::info('Declined email sent for unpaid transaction', [
                        'transaction_id' => $transaction->transaction_id,
                        'customer_email' => $transaction->customer_email,
                    ]);
                    break;
                    
                default:
                    // No email needed for other status changes (cancelled, refunded, etc.)
                    Log::debug('No email sent for status change', [
                        'transaction_id' => $transaction->transaction_id,
                        'status' => $transaction->status,
                    ]);
                    break;
            }
            
        } catch (Exception $e) {
            // Error handling mechanism: Log errors but don't break transaction flow
            static::handleEmailError($e, $transaction, 'update');
        }
    }

    /**
     * Send transaction email using specified mail class
     * 
     * Mail class selection process:
     * - Instantiates the appropriate mail class with transaction data
     * - Uses Laravel's Mail facade for reliable email delivery
     * - Supports both sync and queue-based email sending
     * 
     * @param \App\Models\Transaction $transaction Transaction instance
     * @param string $mailClass Fully qualified mail class name
     * @param string $emailType Type of email for logging purposes
     * @return void
     * @throws \Exception If mail class doesn't exist or email sending fails
     */
    protected static function sendTransactionEmail($transaction, string $mailClass, string $emailType): void
    {
        // Validate mail class exists
        if (!class_exists($mailClass)) {
            throw new Exception("Mail class {$mailClass} does not exist");
        }

        // Create mail instance with transaction data
        $mail = new $mailClass($transaction);
        
        // Send email to customer
        Mail::to($transaction->customer_email)->send($mail);

        Log::debug("Email sent successfully", [
            'type' => $emailType,
            'mail_class' => $mailClass,
            'transaction_id' => $transaction->transaction_id,
            'recipient' => $transaction->customer_email,
        ]);
    }

    /**
     * Validate transaction has required fields for email sending
     * 
     * @param \App\Models\Transaction $transaction Transaction to validate
     * @return bool True if transaction has all required fields
     */
    protected static function validateTransactionForEmail($transaction): bool
    {
        return !empty($transaction->customer_email) && 
               !empty($transaction->customer_name) && 
               !empty($transaction->transaction_id);
    }

    /**
     * Handle email sending errors
     * 
     * Error handling mechanisms:
     * - Logs detailed error information for debugging
     * - Preserves transaction flow (doesn't throw exceptions)
     * - Provides context for troubleshooting
     * - Supports monitoring and alerting systems
     * 
     * @param \Exception $exception The caught exception
     * @param \App\Models\Transaction $transaction Transaction that failed
     * @param string $context Context where error occurred (creation, update)
     * @return void
     */
    protected static function handleEmailError(Exception $exception, $transaction, string $context): void
    {
        Log::error('Failed to send transaction email', [
            'context' => $context,
            'transaction_id' => $transaction->transaction_id ?? 'unknown',
            'customer_email' => $transaction->customer_email ?? 'unknown',
            'status' => $transaction->status ?? 'unknown',
            'error_message' => $exception->getMessage(),
            'error_file' => $exception->getFile(),
            'error_line' => $exception->getLine(),
            'stack_trace' => $exception->getTraceAsString(),
        ]);
        
        // In production, you might want to:
        // - Send alerts to monitoring systems
        // - Queue email for retry
        // - Store failed email attempts in database
        // 
        // Example:
        // if (app()->environment('production')) {
        //     // Send alert to monitoring system
        //     // Queue email for retry with exponential backoff
        // }
    }

    /**
     * Manually trigger email notification for transaction
     * 
     * This method allows manual triggering of email notifications,
     * useful for:
     * - Resending failed emails
     * - Testing email functionality
     * - Administrative operations
     * 
     * @param string $emailType Type of email (invoice, receipt, declined)
     * @return bool True if email was sent successfully
     */
    public function sendTransactionNotification(string $emailType): bool
    {
        try {
            if (!static::validateTransactionForEmail($this)) {
                return false;
            }

            $mailClass = match ($emailType) {
                'invoice' => InvoiceMail::class,
                'receipt' => ReceiptMail::class,
                'declined' => DeclinedMail::class,
                default => throw new Exception("Unknown email type: {$emailType}")
            };

            static::sendTransactionEmail($this, $mailClass, $emailType);
            return true;
            
        } catch (Exception $e) {
            static::handleEmailError($e, $this, 'manual');
            return false;
        }
    }
}