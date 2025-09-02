<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Ticket extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'ticket_number',
        'subject',
        'description',
        'priority',
        'status',
        'category',
        'customer_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'assigned_cs_id',
        'assigned_at',
        'first_response_at',
        'resolved_at',
        'closed_at',
        'chat_session_data',
        'metadata',
        'internal_notes',
        'satisfaction_rating',
        'satisfaction_feedback',
    ];

    protected $casts = [
        'id' => 'string',
        'customer_id' => 'string',
        'assigned_cs_id' => 'string',
        'assigned_at' => 'datetime',
        'first_response_at' => 'datetime',
        'resolved_at' => 'datetime',
        'closed_at' => 'datetime',
        'chat_session_data' => 'array',
        'metadata' => 'array',
        'satisfaction_rating' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
            
            if (empty($model->ticket_number)) {
                $model->ticket_number = static::generateTicketNumber();
            }
        });
    }

    /**
     * Get the customer that owns the ticket.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Get the customer service representative assigned to this ticket.
     */
    public function assignedCs(): BelongsTo
    {
        return $this->belongsTo(CustomerService::class, 'assigned_cs_id');
    }

    /**
     * Generate a unique ticket number.
     */
    public static function generateTicketNumber(): string
    {
        $prefix = 'TKT';
        $timestamp = now()->format('Ymd');
        $random = strtoupper(Str::random(4));
        
        do {
            $ticketNumber = $prefix . '-' . $timestamp . '-' . $random;
            $random = strtoupper(Str::random(4));
        } while (static::where('ticket_number', $ticketNumber)->exists());
        
        return $ticketNumber;
    }

    /**
     * Assign the ticket to a customer service representative.
     */
    public function assignTo(CustomerService $cs): void
    {
        $this->update([
            'assigned_cs_id' => $cs->id,
            'assigned_at' => now(),
            'status' => 'in_progress',
        ]);
        
        $cs->updateTicketCount();
    }

    /**
     * Mark the ticket as resolved.
     */
    public function markAsResolved(): void
    {
        $this->update([
            'status' => 'resolved',
            'resolved_at' => now(),
        ]);
        
        if ($this->assignedCs) {
            $this->assignedCs->updateTicketCount();
        }
    }

    /**
     * Close the ticket.
     */
    public function close(): void
    {
        $this->update([
            'status' => 'closed',
            'closed_at' => now(),
        ]);
        
        if ($this->assignedCs) {
            $this->assignedCs->updateTicketCount();
        }
    }

    /**
     * Record first response time.
     */
    public function recordFirstResponse(): void
    {
        if (!$this->first_response_at) {
            $this->update([
                'first_response_at' => now(),
            ]);
        }
    }

    /**
     * Set customer satisfaction rating.
     */
    public function setSatisfactionRating(int $rating, ?string $feedback = null): void
    {
        $this->update([
            'satisfaction_rating' => $rating,
            'satisfaction_feedback' => $feedback,
        ]);
    }

    /**
     * Scope to get open tickets.
     */
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    /**
     * Scope to get tickets by priority.
     */
    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope to get tickets by category.
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to get unassigned tickets.
     */
    public function scopeUnassigned($query)
    {
        return $query->whereNull('assigned_cs_id');
    }

    /**
     * Get the priority color for UI display.
     */
    public function getPriorityColorAttribute(): string
    {
        return match($this->priority) {
            'low' => 'green',
            'medium' => 'yellow',
            'high' => 'orange',
            'urgent' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get the status color for UI display.
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'open' => 'blue',
            'in_progress' => 'yellow',
            'pending_customer' => 'orange',
            'resolved' => 'green',
            'closed' => 'gray',
            default => 'gray',
        };
    }

    /**
     * Check if the ticket is active (not resolved or closed).
     */
    public function isActive(): bool
    {
        return in_array($this->status, ['open', 'in_progress', 'pending_customer']);
    }

    /**
     * Get response time in minutes (if first response exists).
     */
    public function getResponseTimeAttribute(): ?int
    {
        if (!$this->first_response_at) {
            return null;
        }
        
        return $this->created_at->diffInMinutes($this->first_response_at);
    }

    /**
     * Get resolution time in minutes (if resolved).
     */
    public function getResolutionTimeAttribute(): ?int
    {
        if (!$this->resolved_at) {
            return null;
        }
        
        return $this->created_at->diffInMinutes($this->resolved_at);
    }
}