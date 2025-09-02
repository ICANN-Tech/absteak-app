<?php

namespace App\Traits\Newsletter;

use Illuminate\Support\Str;
use Carbon\Carbon;

trait AttributeTrait
{
    /**
     * Get the newsletter title in title case
     */
    public function getTitleAttribute($value): string
    {
        return Str::title($value);
    }

    /**
     * Set the newsletter title
     */
    public function setTitleAttribute($value): void
    {
        $this->attributes['title'] = Str::title($value);
    }

    /**
     * Get the newsletter content excerpt
     */
    public function getExcerptAttribute(): string
    {
        return Str::limit(strip_tags($this->content), 150);
    }

    /**
     * Get the newsletter slug
     */
    public function getSlugAttribute(): string
    {
        return Str::slug($this->title);
    }

    /**
     * Get the newsletter status
     */
    public function getStatusAttribute(): string
    {
        if ($this->is_published) {
            return 'published';
        }
        
        if ($this->published_at && $this->published_at->isFuture()) {
            return 'scheduled';
        }
        
        return 'draft';
    }

    /**
     * Get formatted published date
     */
    public function getFormattedPublishedAtAttribute(): ?string
    {
        return $this->published_at?->format('M d, Y H:i');
    }

    /**
     * Set email attribute to lowercase
     */
    public function setEmailAttribute($value): void
    {
        $this->attributes['email'] = strtolower($value);
    }

    /**
     * Get subscriber status
     */
    public function getSubscriberStatusAttribute(): string
    {
        if ($this->email_verified_at) {
            return $this->is_active ? 'active' : 'inactive';
        }
        
        return 'pending';
    }

    /**
     * Get log action in title case
     */
    public function getActionAttribute($value): string
    {
        return Str::title($value);
    }

    /**
     * Set log action to lowercase
     */
    public function setActionAttribute($value): void
    {
        $this->attributes['action'] = strtolower($value);
    }

    /**
     * Get formatted log timestamp
     */
    public function getFormattedCreatedAtAttribute(): string
    {
        return $this->created_at->format('M d, Y H:i:s');
    }
}