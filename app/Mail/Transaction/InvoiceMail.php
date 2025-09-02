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
 * Invoice Mail Class
 * 
 * Sends invoice email notifications when a new transaction is created.
 * This email contains:
 * - Transaction details and amount
 * - Payment instructions
 * - Customer information
 * - Professional invoice layout
 * 
 * Design principles:
 * - Clean, professional appearance
 * - Clear payment instructions
 * - Mobile-responsive design
 * - Consistent branding
 */
class InvoiceMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     * 
     * @param Transaction $transaction The transaction for which to send the invoice
     */
    public function __construct(
        public string $transactionId
    ) {
        // Set queue configuration for reliable email delivery
        $this->onQueue('default');
        $this->delay(now()->addSeconds(5)); // Small delay to ensure transaction is committed
    }

    /**
     * Get the message envelope.
     * 
     * Configures email headers, subject, and sender information.
     * Uses transaction details to create a personalized subject line.
     */
    public function envelope(): Envelope
    {
        $transaction = Transaction::findOrFail($this->transactionId);
        
        return new Envelope(
            subject: "Invoice #{$transaction->transaction_id} - ABSteak Restaurant",
            from: config('mail.from.address', 'noreply@absteak.com'),
            replyTo: config('mail.support.address', 'support@absteak.com'),
            tags: ['transaction', 'invoice', $transaction->type],
            metadata: [
                'transaction_id' => $transaction->transaction_id,
                'transaction_type' => $transaction->type,
                'customer_email' => $transaction->customer_email,
            ],
        );
    }

    /**
     * Get the message content definition.
     * 
     * Defines the email template and data to be passed to the view.
     * Provides comprehensive transaction information for the invoice.
     */
    public function content(): Content
    {
        $transaction = Transaction::findOrFail($this->transactionId);
        
        return new Content(
            html: 'emails.transaction.invoice',
            text: 'emails.transaction.invoice-text',
            with: [
                'transaction' => $transaction,
                'customerName' => $transaction->customer_name,
                'transactionId' => $transaction->transaction_id,
                'transactionType' => ucfirst($transaction->type),
                'amount' => $transaction->formatted_amount,
                'dueDate' => $transaction->expires_at?->format('M d, Y H:i') ?? 'No expiration',
                'paymentInstructions' => $this->getPaymentInstructions($transaction),
                'supportEmail' => config('mail.support.address', 'support@absteak.com'),
                'supportPhone' => config('app.support_phone', '+62-21-1234-5678'),
                'companyName' => config('app.name', 'ABSteak Restaurant'),
                'companyAddress' => config('app.company_address', 'Jakarta, Indonesia'),
                'invoiceDate' => $transaction->created_at->format('M d, Y H:i'),
                'transactionDetails' => $transaction->transaction_details,
                'invoiceData' => $this->getInvoiceData($transaction),
                'paymentUrl' => $this->getPaymentUrl($transaction),
                'helpCenterUrl' => url('/help'),
            'viewOnlineUrl' => $this->getViewOnlineUrl($transaction),
            'downloadInvoiceUrl' => $this->getDownloadInvoiceUrl($transaction),
            'companyAddress' => config('company.address', 'ABSteak Restaurant\n123 Main Street\nCity, State 12345'),
            ],
        );
    }

    /**
     * Get invoice data for email template
     * 
     * @param Transaction $transaction
     * @return array
     */
    private function getInvoiceData(Transaction $transaction): array
    {
        return [
            'description' => $transaction->notes ?? 'Restaurant transaction',
            'payment_methods' => [
                'credit_card' => 'Credit Card',
                'bank_transfer' => 'Bank Transfer',
                'cash' => 'Cash Payment'
            ],
            'terms' => 'Payment is due within 24 hours of invoice date.',
            'notes' => 'Thank you for choosing ABSteak Restaurant. We look forward to serving you!',
            'support_phone' => config('app.support_phone', '+62-21-1234-5678')
        ];
    }

    /**
     * Get the payment URL for the transaction.
     * 
     * @param Transaction $transaction
     * @return string
     */
    private function getPaymentUrl(Transaction $transaction): string
    {
        // Use Xendit payment link if available, otherwise fallback to local payment page
        return $transaction->getPaymentLinkUrl() ?? url('/payment/' . $transaction->transaction_id);
    }

    /**
     * Get the view online URL for the transaction.
     * 
     * @param Transaction $transaction
     * @return string
     */
    private function getViewOnlineUrl(Transaction $transaction): string
    {
        return url('/transaction/' . $transaction->transaction_id);
    }

    /**
     * Get the download invoice URL for the transaction.
     * 
     * @param Transaction $transaction
     * @return string
     */
    private function getDownloadInvoiceUrl(Transaction $transaction): string
    {
        return url('/invoice/' . $transaction->transaction_id . '/download');
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [
            // Future: Add PDF invoice attachment
            // Attachment::fromPath(storage_path("invoices/{$this->transaction->transaction_id}.pdf"))
            //     ->as("Invoice-{$this->transaction->transaction_id}.pdf")
            //     ->withMime('application/pdf'),
        ];
    }

    /**
     * Get payment instructions based on transaction type and amount
     * 
     * Provides clear, actionable payment instructions tailored to:
     * - Transaction amount
     * - Payment methods available
     * - Transaction type (reservation, order, etc.)
     * 
     * @param Transaction $transaction
     * @return array Payment instruction details
     */
    private function getPaymentInstructions(Transaction $transaction): array
    {
        $instructions = [
            'methods' => [],
            'deadline' => $transaction->expires_at?->format('M d, Y H:i'),
            'reference' => $transaction->transaction_id,
        ];

        // Bank transfer instructions
        $instructions['methods'][] = [
            'type' => 'bank_transfer',
            'title' => 'Bank Transfer',
            'details' => [
                'Bank Name: BCA',
                'Account Number: 1234567890',
                'Account Name: ABSteak Restaurant',
                'Reference: ' . $transaction->transaction_id,
            ],
            'note' => 'Please include the transaction ID in the transfer description.',
        ];

        // Digital payment instructions
        if ($transaction->amount >= 50000) { // Minimum for digital payments
            $instructions['methods'][] = [
                'type' => 'digital_payment',
                'title' => 'Digital Payment',
                'details' => [
                    'Available: GoPay, OVO, DANA, ShopeePay',
                    'Scan QR code or use payment link',
                    'Instant confirmation',
                ],
                'note' => 'Payment link will be sent via SMS/WhatsApp.',
            ];
        }

        // Cash payment for reservations
        if ($transaction->type === Transaction::TYPE_RESERVATION) {
            $instructions['methods'][] = [
                'type' => 'cash_payment',
                'title' => 'Pay at Restaurant',
                'details' => [
                    'Pay when you arrive at the restaurant',
                    'Show this invoice to the staff',
                    'Cash or card accepted',
                ],
                'note' => 'Please arrive 15 minutes before your reservation time.',
            ];
        }

        return $instructions;
    }

    /**
     * Determine if the email should be sent immediately or queued
     * 
     * @return bool
     */
    public function shouldQueue(): bool
    {
        // Queue emails in production for better performance
        return app()->environment('production');
    }

    /**
     * Handle email sending failure
     * 
     * @param \Throwable $exception
     * @return void
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Failed to send invoice email', [
            'transaction_id' => $this->transactionId,
            'error' => $exception->getMessage(),
        ]);

        // Future: Implement retry logic or alternative notification methods
        // - Send SMS notification
        // - Create admin notification
        // - Queue for manual review
    }
}