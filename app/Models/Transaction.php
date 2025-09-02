<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Traits\Transaction\SelfReferenceTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use App\Services\Xendit;
use Illuminate\Support\Facades\Log;

class Transaction extends Model
{
    use HasUuids, HasFactory;
    use SelfReferenceTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'transaction_id',
        'type',
        'status',
        'amount',
        'currency',
        'payment_method',
        'payment_reference',
        'customer_name',
        'customer_email',
        'customer_phone',
        'transaction_details',
        'payment_details',
        'paid_at',
        'expires_at',
        'notes',
        'payment_url',
        'xendit_invoice_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'transaction_details' => 'array',
        'payment_details' => 'array',
        'paid_at' => 'datetime',
        'expires_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'payment_details',
    ];

    /**
     * Transaction status constants
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_PAID = 'paid';
    public const STATUS_UNPAID = 'unpaid';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_REFUNDED = 'refunded';

    /**
     * Transaction type constants
     */
    public const TYPE_RESERVATION = 'reservation';
    public const TYPE_ORDER = 'order';
    public const TYPE_PAYMENT = 'payment';

    /**
     * Boot the model and register observers
     */
    protected static function boot(): void
    {
        parent::boot();
        
        // Generate unique transaction ID on creation
        static::creating(function (Transaction $transaction) {
            if (empty($transaction->transaction_id)) {
                $transaction->transaction_id = 'TXN-' . strtoupper(Str::random(12));
            }
        });
        
        // Create Xendit payment link after transaction is created
        static::created(function (Transaction $transaction) {
            $transaction->createPaymentLink();
        });
    }

    /**
     * Scope for filtering by status
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $status
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for filtering by type
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for expired transactions
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now())
                    ->whereIn('status', [self::STATUS_PENDING]);
    }

    /**
     * Check if transaction is paid
     *
     * @return bool
     */
    public function isPaid(): bool
    {
        return $this->status === self::STATUS_PAID;
    }

    /**
     * Check if transaction is pending
     *
     * @return bool
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if transaction is unpaid
     *
     * @return bool
     */
    public function isUnpaid(): bool
    {
        return $this->status === self::STATUS_UNPAID;
    }

    /**
     * Check if transaction is expired
     *
     * @return bool
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast() && $this->isPending();
    }

    /**
     * Mark transaction as paid
     *
     * @param string|null $paymentReference
     * @param array|null $paymentDetails
     * @return bool
     */
    public function markAsPaid(?string $paymentReference = null, ?array $paymentDetails = null): bool
    {
        return $this->update([
            'status' => self::STATUS_PAID,
            'paid_at' => now(),
            'payment_reference' => $paymentReference ?? $this->payment_reference,
            'payment_details' => $paymentDetails ?? $this->payment_details,
        ]);
    }

    /**
     * Mark transaction as unpaid
     *
     * @param string|null $reason
     * @return bool
     */
    public function markAsUnpaid(?string $reason = null): bool
    {
        $notes = $reason ? ($this->notes ? $this->notes . '\n' . $reason : $reason) : $this->notes;
        
        return $this->update([
            'status' => self::STATUS_UNPAID,
            'notes' => $notes,
        ]);
    }

    /**
     * Get formatted amount with currency
     *
     * @return string
     */
    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->amount, 2) . ' ' . $this->currency;
    }

    /**
     * Get customer full details
     *
     * @return array
     */
    public function getCustomerDetailsAttribute(): array
    {
        return [
            'name' => $this->customer_name,
            'email' => $this->customer_email,
            'phone' => $this->customer_phone,
        ];
    }
    
    /**
     * Create Xendit payment link for this transaction
     *
     * @return bool
     */
    public function createPaymentLink(): bool
    {
        // Skip if payment link already exists or transaction is already paid
        if ($this->payment_url || $this->isPaid()) {
            return false;
        }
        
        try {
            $xendit = new Xendit();
            
            // Prepare payment link data
            $paymentData = [
                'external_id' => $this->transaction_id,
                'amount' => (int) ($this->amount * 100), // Convert to cents
                'description' => $this->getPaymentDescription(),
                'customer_email' => $this->customer_email,
                'customer_name' => $this->customer_name,
                'invoice_duration' => 86400, // 24 hours
                'success_redirect_url' => config('app.url') . '/payment/success?transaction=' . $this->transaction_id,
                'failure_redirect_url' => config('app.url') . '/payment/failed?transaction=' . $this->transaction_id,
            ];
            
            // Add items if transaction details exist
            if ($this->transaction_details && isset($this->transaction_details['items'])) {
                $paymentData['items'] = $this->transaction_details['items'];
            }
            
            $result = $xendit->createPaymentLink($paymentData);
            
            if ($result['success']) {
                // Update transaction with payment link details
                $this->update([
                    'payment_url' => $result['data']['payment_url'],
                    'xendit_invoice_id' => $result['data']['invoice_id'],
                    'expires_at' => $result['data']['expiry_date'] ? \Carbon\Carbon::parse($result['data']['expiry_date']) : now()->addDay(),
                ]);
                
                Log::info('Payment link created for transaction', [
                    'transaction_id' => $this->transaction_id,
                    'payment_url' => $result['data']['payment_url'],
                    'xendit_invoice_id' => $result['data']['invoice_id']
                ]);
                
                return true;
            }
            
        } catch (\Exception $e) {
            Log::error('Failed to create payment link for transaction', [
                'transaction_id' => $this->transaction_id,
                'error' => $e->getMessage()
            ]);
        }
        
        return false;
    }
    
    /**
     * Get payment description based on transaction type
     *
     * @return string
     */
    private function getPaymentDescription(): string
    {
        switch ($this->type) {
            case self::TYPE_RESERVATION:
                return 'ABSteak Restaurant Reservation - ' . $this->transaction_id;
            case self::TYPE_ORDER:
                return 'ABSteak Restaurant Order - ' . $this->transaction_id;
            default:
                return 'ABSteak Payment - ' . $this->transaction_id;
        }
    }
    
    /**
     * Get payment link URL for emails
     *
     * @return string|null
     */
    public function getPaymentLinkUrl(): ?string
    {
        return $this->payment_url;
    }
    
    /**
     * Check if payment link is available
     *
     * @return bool
     */
    public function hasPaymentLink(): bool
    {
        return !empty($this->payment_url);
    }
}