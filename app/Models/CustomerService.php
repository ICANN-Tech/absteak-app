<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class CustomerService extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'department',
        'status',
        'is_active',
        'max_concurrent_tickets',
        'current_ticket_count',
        'skills',
        'working_hours',
        'last_activity_at',
        'bio',
        'avatar',
    ];

    protected $casts = [
        'id' => 'string',
        'user_id' => 'string',
        'is_active' => 'boolean',
        'max_concurrent_tickets' => 'integer',
        'current_ticket_count' => 'integer',
        'skills' => 'array',
        'working_hours' => 'array',
        'last_activity_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the user that owns the customer service profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the tickets assigned to this customer service representative.
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'assigned_cs_id');
    }

    /**
     * Get active tickets assigned to this CS representative.
     */
    public function activeTickets(): HasMany
    {
        return $this->tickets()->whereIn('status', ['open', 'in_progress', 'pending_customer']);
    }

    /**
     * Check if the CS representative is available for new tickets.
     */
    public function isAvailableForTickets(): bool
    {
        return $this->is_active && 
               $this->status === 'available' && 
               $this->current_ticket_count < $this->max_concurrent_tickets;
    }

    /**
     * Update the current ticket count.
     */
    public function updateTicketCount(): void
    {
        $this->current_ticket_count = $this->activeTickets()->count();
        $this->save();
    }

    /**
     * Set the CS representative as online/available.
     */
    public function setOnline(): void
    {
        $this->update([
            'status' => 'available',
            'last_activity_at' => now(),
        ]);
    }

    /**
     * Set the CS representative as offline.
     */
    public function setOffline(): void
    {
        $this->update([
            'status' => 'offline',
            'last_activity_at' => now(),
        ]);
    }

    /**
     * Set the CS representative as busy.
     */
    public function setBusy(): void
    {
        $this->update([
            'status' => 'busy',
            'last_activity_at' => now(),
        ]);
    }

    /**
     * Scope to get available CS representatives.
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_active', true)
                    ->where('status', 'available')
                    ->whereRaw('current_ticket_count < max_concurrent_tickets');
    }

    /**
     * Scope to get CS representatives by department.
     */
    public function scopeByDepartment($query, string $department)
    {
        return $query->where('department', $department);
    }

    /**
     * Get the CS representative's full name or fallback to name.
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->name;
    }

    /**
     * Get the CS representative's avatar URL or default.
     */
    public function getAvatarUrlAttribute(): string
    {
        return $this->avatar ? asset('storage/' . $this->avatar) : asset('images/default-avatar.png');
    }
}