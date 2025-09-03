<?php

namespace App\Jobs\Transaction;

use App\Mail\Transaction\DeclinedMail;
use App\Mail\Transaction\InvoiceMail;
use App\Mail\Transaction\ReceiptMail;
use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Exception;

/**
 * SendEmailJob
 * 
 * Handles sending transaction-related emails based on transaction status.
 * This job dispatches the appropriate email type:
 * - InvoiceMail: When transaction is created (status: pending)
 * - ReceiptMail: When payment is confirmed (status: paid)
 * - DeclinedMail: When payment fails or is declined (status: unpaid/declined)
 * 
 * Features:
 * - Automatic email type selection based on transaction status
 * - Comprehensive error handling and logging
 * - Queue-based processing for performance
 * - Retry mechanism for failed email deliveries
 * - Direct SMTP configuration for reliable delivery
 * 
 * @package App\Jobs
 * @author ABSteak Development Team
 * @version 1.0.0
 */
class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The transaction ID
     * 
     * @var string
     */
    public string $transactionId;

    /**
     * The type of email to send
     * 
     * @var string
     */
    public string $emailType;

    /**
     * The number of times the job may be attempted.
     * 
     * @var int
     */
    public int $tries = 3;

    /**
     * The maximum number of seconds the job can run.
     * 
     * @var int
     */
    public int $timeout = 60;

    /**
     * Create a new job instance.
     * 
     * @param Transaction $transaction The transaction to send email for
     * @param string|null $emailType Optional email type override (invoice, receipt, declined)
     */
    public function __construct(Transaction $transaction, ?string $emailType = null)
    {
        $this->transactionId = $transaction->id;
        $this->emailType = $emailType ?? $this->determineEmailType($transaction);
        
        // Set queue configuration
        $this->onQueue('default');
        
        Log::info('SendTransactionEmailJob created', [
            'transaction_id' => $transaction->id,
            'email_type' => $this->emailType,
            'transaction_status' => $transaction->status
        ]);
    }

    /**
     * Execute the job.
     * 
     * @return void
     * @throws Exception
     */
    public function handle(): void
    {
        try {
            // Fetch the transaction from database
            $transaction = Transaction::findOrFail($this->transactionId);
            
            Log::info('Processing transaction email job', [
                'transaction_id' => $transaction->id,
                'email_type' => $this->emailType,
                'recipient' => $transaction->customer_email
            ]);

            // Configure mail settings for reliable delivery
            $this->configureMailSettings();

            // Send the appropriate email based on type
            $this->sendEmail($transaction);

            Log::info('Transaction email sent successfully', [
                'transaction_id' => $transaction->id,
                'email_type' => $this->emailType,
                'recipient' => $transaction->customer_email
            ]);

        } catch (Exception $e) {
            Log::error('Failed to send transaction email', [
                'transaction_id' => $this->transactionId,
                'email_type' => $this->emailType,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Re-throw the exception to trigger job retry
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     * 
     * @param Exception $exception
     * @return void
     */
    public function failed(Exception $exception): void
    {
        Log::error('SendTransactionEmailJob failed permanently', [
            'transaction_id' => $this->transactionId,
            'email_type' => $this->emailType,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts()
        ]);
    }

    /**
     * Determine the email type based on transaction status
     * 
     * @param Transaction $transaction
     * @return string
     */
    private function determineEmailType(Transaction $transaction): string
    {
        return match ($transaction->status) {
            'pending', 'created' => 'invoice',
            'paid', 'completed' => 'receipt',
            'unpaid', 'declined', 'failed' => 'declined',
            default => 'invoice'
        };
    }

    /**
     * Configure mail settings for reliable delivery
     * 
     * @return void
     */
    private function configureMailSettings(): void
    {
        // Use the working Mailpit SMTP configuration
        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp' => [
                'transport' => 'smtp',
                'host' => 'mailpit',
                'port' => 1025,
                'encryption' => null,
                'username' => null,
                'password' => null,
                'timeout' => null,
                'local_domain' => env('MAIL_EHLO_DOMAIN'),
            ],
            'mail.from' => [
                'address' => 'noreply@absteak.com',
                'name' => 'ABSteak Restaurant'
            ]
        ]);
    }

    /**
     * Send the appropriate email based on email type
     * 
     * @param Transaction $transaction
     * @return void
     * @throws Exception
     */
    private function sendEmail(Transaction $transaction): void
    {
        $recipient = $transaction->customer_email;
        
        if (empty($recipient)) {
            throw new Exception('Customer email is required for transaction email');
        }

        switch ($this->emailType) {
            case 'invoice':
                Mail::to($recipient)->send(new InvoiceMail($transaction->id));
                break;
                
            case 'receipt':
                Mail::to($recipient)->send(new ReceiptMail($transaction));
                break;
                
            case 'declined':
                Mail::to($recipient)->send(new DeclinedMail($transaction));
                break;
                
            default:
                throw new Exception("Unknown email type: {$this->emailType}");
        }
    }

    /**
     * Get the tags that should be assigned to the job.
     * 
     * @return array
     */
    public function tags(): array
    {
        return [
            'transaction:' . $this->transactionId,
            'email:' . $this->emailType,
            'queue:email'
        ];
    }
}