<?php

namespace App\Traits\Newsletter;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Newsletter;
use App\Models\NewsletterLog;
use App\Models\NewsletterSubscriber;
use App\Models\User;

trait RelationTrait
{
    /**
     * Newsletter has many logs
     */
    public function logs(): HasMany
    {
        return $this->hasMany(NewsletterLog::class);
    }

    /**
     * Newsletter belongs to many subscribers
     */
    public function subscribers(): BelongsToMany
    {
        return $this->belongsToMany(NewsletterSubscriber::class, 'newsletter_subscriber_pivot')
                    ->withPivot(['sent_at', 'opened_at', 'clicked_at'])
                    ->withTimestamps();
    }

    /**
     * Newsletter belongs to a user (author)
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * NewsletterLog belongs to a newsletter
     */
    public function newsletter(): BelongsTo
    {
        return $this->belongsTo(Newsletter::class);
    }

    /**
     * NewsletterLog belongs to a subscriber
     */
    public function subscriber(): BelongsTo
    {
        return $this->belongsTo(NewsletterSubscriber::class);
    }

    /**
     * NewsletterSubscriber belongs to many newsletters
     */
    public function newsletters(): BelongsToMany
    {
        return $this->belongsToMany(Newsletter::class, 'newsletter_subscriber_pivot')
                    ->withPivot(['sent_at', 'opened_at', 'clicked_at'])
                    ->withTimestamps();
    }

    /**
     * NewsletterSubscriber has many logs
     */
    public function newsletterLogs(): HasMany
    {
        return $this->hasMany(NewsletterLog::class);
    }
}
