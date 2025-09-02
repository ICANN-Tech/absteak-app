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
 * ReceiptMail Class
 * 
 * Handles sending payment receipt emails to customers after successful payment.
 * This mailable is triggered when a transaction status changes to 'paid'.
 * 
 * Features:
 * - Professional receipt email with transaction details
 * - Payment confirmation and receipt number
 * - Customer transaction history reference
 * - Automatic queuing for performance
 * - Comprehensive error handling and logging
 * 
 * @package App\Mail\Transaction
 * @author Your Name
 * @version 1.0.0
 */
class ReceiptMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The transaction instance for which the receipt is being sent
     * 
     * @var Transaction
     */
    public Transaction $transaction;

    /**
     * Receipt-specific data for email content
     * 
     * @var array
     */
    public array $receiptData;

    /**
     * Create a new message instance.
     * 
     * Initializes the receipt email with transaction data and prepares
     * receipt-specific information for the email template.
     * 
     * @param Transaction $transaction The paid transaction
     * @param array $additionalData Optional additional receipt data
     */
    public function __construct(Transaction $transaction, array $additionalData = [])
    {
        $this->transaction = $transaction;
        $this->receiptData = $this->prepareReceiptData($additionalData);
        
        // Set queue configuration for receipt emails
        $this->onQueue('default');
        $this->delay(now()->addSeconds(5)); // Small delay to ensure transaction is fully processed
    }

    /**
     * Get the message envelope.
     * 
     * Configures the email envelope with appropriate subject, sender,
     * and reply-to information for receipt emails.
     * 
     * @return Envelope
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Payment Receipt - Transaction #{$this->transaction->transaction_id}",
            from: config('mail.from.address', 'noreply@absteak.com'),
            replyTo: [
                config('mail.support.address', 'support@absteak.com')
            ],
            tags: ['receipt', 'transaction', 'payment-confirmation'],
            metadata: [
                'transaction_id' => $this->transaction->transaction_id,
                'customer_email' => $this->transaction->customer_email,
                'amount' => $this->transaction->amount,
                'type' => 'receipt'
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
            html: 'emails.transaction.receipt',
            text: 'emails.transaction.receipt-text',
            with: [
                'transaction' => $this->transaction,
                'receiptData' => $this->receiptData,
                'customerName' => $this->transaction->customer_name,
                'transactionId' => $this->transaction->transaction_id,
                'amount' => $this->formatAmount(),
                'paymentMethod' => $this->getPaymentMethodDisplay(),
                'receiptNumber' => $this->generateReceiptNumber(),
                'paymentDate' => $this->transaction->updated_at->format('F j, Y \\a\\t g:i A'),
                'supportEmail' => config('mail.support.address', 'support@absteak.com'),
                'companyName' => config('app.name', 'ABSteak'),
                'companyAddress' => config('company.address', ''),
                'downloadReceiptUrl' => $this->generateDownloadUrl(),
                'viewOnlineUrl' => $this->generateViewOnlineUrl(),
                'helpCenterUrl' => url('/help'),
                'companyAddress' => config('company.address', 'ABSteak Restaurant\n123 Main Street\nCity, State 12345')
            ]
        );
    }

    /**
     * Prepare receipt-specific data for the email
     * 
     * Processes and formats receipt data including payment details,
     * receipt number generation, and additional receipt information.
     * 
     * @param array $additionalData Additional data to include in receipt
     * @return array Formatted receipt data
     */
    private function prepareReceiptData(array $additionalData = []): array
    {
        $baseReceiptData = [
            'receipt_number' => $this->generateReceiptNumber(),
            'payment_date' => $this->transaction->updated_at,
            'payment_method' => $this->getPaymentMethodDisplay(),
            'transaction_fee' => $this->calculateTransactionFee(),
            'net_amount' => $this->calculateNetAmount(),
            'payment_reference' => $this->getPaymentReference(),
            'receipt_generated_at' => now(),
            'is_refundable' => $this->isRefundable(),
            'refund_policy_url' => config('company.refund_policy_url', '#')
        ];

        return array_merge($baseReceiptData, $additionalData);
    }

    /**
     * Generate a unique receipt number
     * 
     * Creates a formatted receipt number based on transaction ID
     * and timestamp for easy reference and tracking.
     * 
     * @return string Formatted receipt number
     */
    private function generateReceiptNumber(): string
    {
        $date = $this->transaction->updated_at->format('Ymd');
        $transactionId = str_pad($this->transaction->id, 6, '0', STR_PAD_LEFT);
        
        return "RCP-{$date}-{$transactionId}";
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
            'cash' => 'Cash',
            'check' => 'Check'
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
     * Calculate transaction fee if applicable
     * 
     * @return float Transaction fee amount
     */
    private function calculateTransactionFee(): float
    {
        // This would typically come from payment processor or be calculated based on business rules
        $paymentDetails = $this->transaction->payment_details ?? [];
        
        return $paymentDetails['transaction_fee'] ?? 0.00;
    }

    /**
     * Calculate net amount after fees
     * 
     * @return float Net amount received
     */
    private function calculateNetAmount(): float
    {
        return $this->transaction->amount - $this->calculateTransactionFee();
    }

    /**
     * Get payment reference from payment details
     * 
     * @return string|null Payment reference number
     */
    private function getPaymentReference(): ?string
    {
        $paymentDetails = $this->transaction->payment_details ?? [];
        
        return $paymentDetails['reference_number'] ?? $paymentDetails['confirmation_code'] ?? null;
    }

    /**
     * Check if transaction is refundable
     * 
     * @return bool Whether the transaction can be refunded
     */
    private function isRefundable(): bool
    {
        // Business logic for refund eligibility
        $refundableTypes = ['purchase', 'service', 'subscription'];
        $refundWindow = now()->subDays(30); // 30-day refund window
        
        return in_array($this->transaction->type, $refundableTypes) && 
               $this->transaction->created_at->gte($refundWindow);
    }

    /**
     * Generate URL for downloading receipt PDF
     * 
     * @return string Download URL
     */
    private function generateDownloadUrl(): string
    {
        return url('/receipt/' . $this->transaction->transaction_id . '/download');
    }

    /**
     * Generate URL for viewing receipt online
     * 
     * @return string View online URL
     */
    private function generateViewOnlineUrl(): string
    {
        return url('/receipt/' . $this->transaction->transaction_id);
    }

    /**
     * Handle a job failure.
     * 
     * Logs detailed error information when receipt email sending fails,
     * including transaction details and error context for debugging.
     * 
     * @param \Throwable $exception The exception that caused the failure
     * @return void
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Failed to send receipt email', [
            'transaction_id' => $this->transaction->transaction_id,
            'customer_email' => $this->transaction->customer_email,
            'amount' => $this->transaction->amount,
            'payment_method' => $this->transaction->payment_method,
            'error_message' => $exception->getMessage(),
            'error_trace' => $exception->getTraceAsString(),
            'receipt_data' => $this->receiptData,
            'timestamp' => now()->toISOString()
        ]);

        // Optionally, you could trigger an alert or notification to administrators
        // about the failed receipt email delivery
    }
}