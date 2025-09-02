<?php

namespace App\Traits\Newsletter;

use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

trait ScopeTrait
{
    /**
     * Scope to get only published newsletters
     */
    public function scopeIsPublished(Builder $query): Builder
    {
        return $query->where('is_published', true)
                    ->where('published_at', '<=', now());
    }

    /**
     * Scope to get only draft newsletters
     */
    public function scopeIsDraft(Builder $query): Builder
    {
        return $query->where('is_published', false)
                    ->orWhereNull('published_at');
    }

    /**
     * Scope to get scheduled newsletters
     */
    public function scopeIsScheduled(Builder $query): Builder
    {
        return $query->where('is_published', false)
                    ->where('published_at', '>', now());
    }

    /**
     * Scope to get newsletters ready to publish
     */
    public function scopeReadyToPublish(Builder $query): Builder
    {
        return $query->where('is_published', false)
                    ->where('published_at', '<=', now())
                    ->whereNotNull('published_at');
    }

    /**
     * Scope to get active subscribers
     */
    public function scopeIsActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
                    ->whereNotNull('email_verified_at');
    }

    /**
     * Scope to get inactive subscribers
     */
    public function scopeIsInactive(Builder $query): Builder
    {
        return $query->where('is_active', false);
    }

    /**
     * Scope to get verified subscribers
     */
    public function scopeIsVerified(Builder $query): Builder
    {
        return $query->whereNotNull('email_verified_at');
    }

    /**
     * Scope to get unverified subscribers
     */
    public function scopeIsUnverified(Builder $query): Builder
    {
        return $query->whereNull('email_verified_at');
    }

    /**
     * Scope to search newsletters by title or content
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%");
        });
    }

    /**
     * Scope to filter by date range
     */
    public function scopeDateRange(Builder $query, $startDate, $endDate): Builder
    {
        return $query->whereBetween('created_at', [
            Carbon::parse($startDate)->startOfDay(),
            Carbon::parse($endDate)->endOfDay()
        ]);
    }

    /**
     * Scope to get newsletters by author
     */
    public function scopeByAuthor(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to get recent newsletters
     */
    public function scopeRecent(Builder $query, int $days = 30): Builder
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope to get logs by action
     */
    public function scopeByAction(Builder $query, string $action): Builder
    {
        return $query->where('action', $action);
    }

    /**
     * Scope to get logs for a specific newsletter
     */
    public function scopeForNewsletter(Builder $query, int $newsletterId): Builder
    {
        return $query->where('newsletter_id', $newsletterId);
    }

    /**
     * Scope to get logs for a specific subscriber
     */
    public function scopeForSubscriber(Builder $query, int $subscriberId): Builder
    {
        return $query->where('newsletter_subscriber_id', $subscriberId);
    }
}