<?php

namespace App\Mail\Transaction;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * DeclinedMail Class
 * 
 * Handles sending payment declined/unpaid notification emails to customers.
 * This mailable is triggered when a transaction status changes to 'unpaid' or 'declined'.
 * 
 * Features:
 * - Professional declined payment notification
 * - Payment retry instructions and options
 * - Alternative payment method suggestions
 * - Customer support contact information
 * - Automatic queuing for performance
 * - Comprehensive error handling and logging
 * 
 * @package App\Mail\Transaction
 * @author Your Name
 * @version 1.0.0
 */
class DeclinedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The transaction instance for which the declined notification is being sent
     * 
     * @var Transaction
     */
    public Transaction $transaction;

    /**
     * Declined notification specific data for email content
     * 
     * @var array
     */
    public array $declinedData;

    /**
     * Create a new message instance.
     * 
     * Initializes the declined notification email with transaction data and prepares
     * declined-specific information for the email template.
     * 
     * @param Transaction $transaction The declined/unpaid transaction
     * @param array $additionalData Optional additional declined notification data
     */
    public function __construct(Transaction $transaction, array $additionalData = [])
    {
        $this->transaction = $transaction;
        $this->declinedData = $this->prepareDeclinedData($additionalData);
        
        // Set queue configuration for declined notification emails
        $this->onQueue('default');
        $this->delay(now()->addMinutes(2)); // Small delay to allow for potential retry processing
    }

    /**
     * Get the message envelope.
     * 
     * Configures the email envelope with appropriate subject, sender,
     * and reply-to information for declined payment notifications.
     * 
     * @return Envelope
     */
    public function envelope(): Envelope
    {
        $subjectPrefix = $this->transaction->status === 'declined' ? 'Payment Declined' : 'Payment Required';
        
        return new Envelope(
            subject: "{$subjectPrefix} - Transaction #{$this->transaction->transaction_id}",
            from: config('mail.from.address', 'noreply@absteak.com'),
            replyTo: [
                config('mail.support.address', 'support@absteak.com')
            ],
            tags: ['declined', 'transaction', 'payment-failed', 'retry-required'],
            metadata: [
                'transaction_id' => $this->transaction->transaction_id,
                'customer_email' => $this->transaction->customer_email,
                'amount' => $this->transaction->amount,
                'status' => $this->transaction->status,
                'type' => 'declined'
            ]
        );
    }

    /**
     * Get the message content definition.
     * 
     * Defines the email content including HTML and text views,
     * and passes all necessary data to the email templates.
     * 
     * @return Content
     */
    public function content(): Content
    {
        return new Content(
            html: 'emails.transaction.declined',
            text: 'emails.transaction.declined-text',
            with: [
                'transaction' => $this->transaction,
                'declinedData' => $this->declinedData,
                'customerName' => $this->transaction->customer_name,
                'transactionId' => $this->transaction->transaction_id,
                'amount' => $this->formatAmount(),
                'paymentMethod' => $this->getPaymentMethodDisplay(),
                'declineReason' => $this->getDeclineReason(),
                'retryUrl' => $this->generateRetryUrl(),
                'alternativePaymentMethods' => $this->getAlternativePaymentMethods(),
                'supportEmail' => config('mail.support.address', 'support@absteak.com'),
                'supportPhone' => config('company.support_phone', ''),
                'companyName' => config('app.name', 'ABSteak'),
                'helpCenterUrl' => config('company.help_center_url', '#'),
                'companyAddress' => config('company.address', 'ABSteak Restaurant\n123 Main Street\nCity, State 12345'),
                'paymentHelpUrl' => $this->generatePaymentHelpUrl(),
                'expirationDate' => $this->calculateExpirationDate(),
                'urgencyLevel' => $this->determineUrgencyLevel()
            ]
        );
    }

    /**
     * Prepare declined notification specific data for the email
     * 
     * Processes and formats declined notification data including decline reasons,
     * retry options, and alternative payment suggestions.
     * 
     * @param array $additionalData Additional data to include in notification
     * @return array Formatted declined notification data
     */
    private function prepareDeclinedData(array $additionalData = []): array
    {
        $baseDeclinedData = [
            'decline_reason' => $this->getDeclineReason(),
            'decline_code' => $this->getDeclineCode(),
            'retry_attempts' => $this->getRetryAttempts(),
            'max_retry_attempts' => config('payment.max_retry_attempts', 3),
            'can_retry' => $this->canRetryPayment(),
            'alternative_methods' => $this->getAlternativePaymentMethods(),
            'expiration_date' => $this->calculateExpirationDate(),
            'urgency_level' => $this->determineUrgencyLevel(),
            'support_available' => true,
            'auto_retry_enabled' => config('payment.auto_retry_enabled', false)
        ];

        return array_merge($baseDeclinedData, $additionalData);
    }

    /**
     * Get human-readable decline reason
     * 
     * @return string Formatted decline reason
     */
    private function getDeclineReason(): string
    {
        $paymentDetails = $this->transaction->payment_details ?? [];
        $declineCode = $paymentDetails['decline_code'] ?? 'unknown';
        
        $reasons = [
            'insufficient_funds' => 'Insufficient funds in your account',
            'card_declined' => 'Your card was declined by the bank',
            'expired_card' => 'Your card has expired',
            'invalid_card' => 'Invalid card information provided',
            'security_violation' => 'Transaction flagged for security review',
            'limit_exceeded' => 'Transaction exceeds your card limit',
            'processing_error' => 'Payment processing error occurred',
            'network_error' => 'Network connectivity issue during payment',
            'timeout' => 'Payment request timed out',
            'unknown' => 'Payment could not be processed'
        ];

        return $reasons[$declineCode] ?? $reasons['unknown'];
    }

    /**
     * Get decline code from payment details
     * 
     * @return string Decline code
     */
    private function getDeclineCode(): string
    {
        $paymentDetails = $this->transaction->payment_details ?? [];
        return $paymentDetails['decline_code'] ?? 'unknown';
    }

    /**
     * Get number of retry attempts made
     * 
     * @return int Number of retry attempts
     */
    private function getRetryAttempts(): int
    {
        $paymentDetails = $this->transaction->payment_details ?? [];
        return $paymentDetails['retry_attempts'] ?? 0;
    }

    /**
     * Check if payment can be retried
     * 
     * @return bool Whether payment retry is allowed
     */
    private function canRetryPayment(): bool
    {
        $maxAttempts = config('payment.max_retry_attempts', 3);
        $currentAttempts = $this->getRetryAttempts();
        $retryableStatuses = ['unpaid', 'declined'];
        
        return in_array($this->transaction->status, $retryableStatuses) && 
               $currentAttempts < $maxAttempts &&
               $this->transaction->created_at->gte(now()->subDays(7)); // 7-day retry window
    }

    /**
     * Get alternative payment methods
     * 
     * @return array List of alternative payment methods
     */
    private function getAlternativePaymentMethods(): array
    {
        $currentMethod = $this->transaction->payment_method;
        $allMethods = [
            'credit_card' => 'Credit Card',
            'debit_card' => 'Debit Card',
            'paypal' => 'PayPal',
            'bank_transfer' => 'Bank Transfer',
            'apple_pay' => 'Apple Pay',
            'google_pay' => 'Google Pay'
        ];

        // Remove the current failed method from alternatives
        unset($allMethods[$currentMethod]);
        
        return array_slice($allMethods, 0, 3, true); // Return top 3 alternatives
    }

    /**
     * Format the transaction amount for display
     * 
     * @return string Formatted amount with currency symbol
     */
    private function formatAmount(): string
    {
        $currency = $this->transaction->currency ?? 'USD';
        $symbol = $this->getCurrencySymbol($currency);
        
        return $symbol . number_format($this->transaction->amount, 2);
    }

    /**
     * Get display name for payment method
     * 
     * @return string Human-readable payment method
     */
    private function getPaymentMethodDisplay(): string
    {
        $methods = [
            'credit_card' => 'Credit Card',
            'debit_card' => 'Debit Card',
            'paypal' => 'PayPal',
            'bank_transfer' => 'Bank Transfer',
            'apple_pay' => 'Apple Pay',
            'google_pay' => 'Google Pay'
        ];

        return $methods[$this->transaction->payment_method] ?? ucfirst(str_replace('_', ' ', $this->transaction->payment_method));
    }

    /**
     * Get currency symbol for the transaction currency
     * 
     * @param string $currency Currency code
     * @return string Currency symbol
     */
    private function getCurrencySymbol(string $currency): string
    {
        $symbols = [
            'USD' => '$',
            'EUR' => '€',
            'GBP' => '£',
            'JPY' => '¥',
            'CAD' => 'C$',
            'AUD' => 'A$'
        ];

        return $symbols[$currency] ?? $currency . ' ';
    }

    /**
     * Generate URL for retrying payment
     * 
     * @return string Retry payment URL
     */
    private function generateRetryUrl(): string
    {
        // Use Xendit payment link if available, otherwise fallback to local retry page
        return $this->transaction->getPaymentLinkUrl() ?? url('/payment/retry/' . $this->transaction->transaction_id);
    }

    /**
     * Generate URL for payment help and support
     * 
     * @return string Payment help URL
     */
    private function generatePaymentHelpUrl(): string
    {
        return url('/help/payment');
    }

    /**
     * Calculate expiration date for retry attempts
     * 
     * @return string Formatted expiration date
     */
    private function calculateExpirationDate(): string
    {
        $expirationDays = config('payment.retry_expiration_days', 7);
        $expirationDate = $this->transaction->created_at->addDays($expirationDays);
        
        return $expirationDate->format('F j, Y');
    }

    /**
     * Determine urgency level based on transaction details
     * 
     * @return string Urgency level (low, medium, high)
     */
    private function determineUrgencyLevel(): string
    {
        $amount = $this->transaction->amount;
        $retryAttempts = $this->getRetryAttempts();
        $daysSinceCreated = $this->transaction->created_at->diffInDays(now());
        
        if ($amount > 1000 || $retryAttempts >= 2 || $daysSinceCreated >= 5) {
            return 'high';
        } elseif ($amount > 100 || $retryAttempts >= 1 || $daysSinceCreated >= 2) {
            return 'medium';
        }
        
        return 'low';
    }

    /**
     * Handle a job failure.
     * 
     * Logs detailed error information when declined notification email sending fails,
     * including transaction details and error context for debugging.
     * 
     * @param \Throwable $exception The exception that caused the failure
     * @return void
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Failed to send declined payment notification email', [
            'transaction_id' => $this->transaction->transaction_id,
            'customer_email' => $this->transaction->customer_email,
            'amount' => $this->transaction->amount,
            'status' => $this->transaction->status,
            'payment_method' => $this->transaction->payment_method,
            'decline_reason' => $this->getDeclineReason(),
            'retry_attempts' => $this->getRetryAttempts(),
            'error_message' => $exception->getMessage(),
            'error_trace' => $exception->getTraceAsString(),
            'declined_data' => $this->declinedData,
            'timestamp' => now()->toISOString()
        ]);

        // Optionally, you could trigger an alert or notification to administrators
        // about the failed declined notification email delivery
        // This is especially important for high-value transactions
    }
}