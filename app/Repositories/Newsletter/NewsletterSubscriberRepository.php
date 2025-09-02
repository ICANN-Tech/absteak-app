<?php

namespace App\Repositories\Newsletter;

use App\Models\NewsletterSubscriber;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class NewsletterSubscriberRepository implements NewsletterSubscriberRepositoryInterface
{
    /**
     * Get all subscribers with pagination
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterSubscriber::with(['newsletters', 'newsletterLogs'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get subscriber by ID
     */
    public function findById(int $id): ?NewsletterSubscriber
    {
        return NewsletterSubscriber::with(['newsletters', 'newsletterLogs'])->find($id);
    }

    /**
     * Get subscriber by email
     */
    public function findByEmail(string $email): ?NewsletterSubscriber
    {
        return NewsletterSubscriber::where('email', $email)->first();
    }

    /**
     * Create a new subscriber
     */
    public function create(array $data): NewsletterSubscriber
    {
        $data['verification_token'] = Str::random(64);
        $data['unsubscribe_token'] = Str::random(64);
        
        return NewsletterSubscriber::create($data);
    }

    /**
     * Update subscriber
     */
    public function update(int $id, array $data): NewsletterSubscriber
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);
        $subscriber->update($data);
        return $subscriber->fresh();
    }

    /**
     * Delete subscriber
     */
    public function delete(int $id): bool
    {
        $subscriber = NewsletterSubscriber::findOrFail($id);
        return $subscriber->delete();
    }

    /**
     * Get active subscribers
     */
    public function getActive(int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterSubscriber::isActive()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get inactive subscribers
     */
    public function getInactive(int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterSubscriber::isInactive()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get verified subscribers
     */
    public function getVerified(int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterSubscriber::isVerified()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get unverified subscribers
     */
    public function getUnverified(int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterSubscriber::isUnverified()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Subscribe user
     */
    public function subscribe(array $data): NewsletterSubscriber
    {
        // Check if subscriber already exists
        $existingSubscriber = $this->findByEmail($data['email']);
        
        if ($existingSubscriber) {
            // Reactivate if inactive
            if (!$existingSubscriber->is_active) {
                $existingSubscriber->update([
                    'is_active' => true,
                    'verification_token' => Str::random(64),
                ]);
            }
            return $existingSubscriber;
        }
        
        return $this->create(array_merge($data, [
            'is_active' => true,
            'source' => $data['source'] ?? 'website',
        ]));
    }

    /**
     * Unsubscribe user
     */
    public function unsubscribe(string $token): bool
    {
        $subscriber = NewsletterSubscriber::where('unsubscribe_token', $token)->first();
        
        if (!$subscriber) {
            return false;
        }
        
        $subscriber->update(['is_active' => false]);
        return true;
    }

    /**
     * Verify email
     */
    public function verifyEmail(string $token): bool
    {
        $subscriber = NewsletterSubscriber::where('verification_token', $token)->first();
        
        if (!$subscriber) {
            return false;
        }
        
        $subscriber->update([
            'email_verified_at' => now(),
            'verification_token' => null,
        ]);
        
        return true;
    }

    /**
     * Get subscriber statistics
     */
    public function getStatistics(): array
    {
        return [
            'total' => NewsletterSubscriber::count(),
            'active' => NewsletterSubscriber::isActive()->count(),
            'inactive' => NewsletterSubscriber::isInactive()->count(),
            'verified' => NewsletterSubscriber::isVerified()->count(),
            'unverified' => NewsletterSubscriber::isUnverified()->count(),
            'this_month' => NewsletterSubscriber::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'last_month' => NewsletterSubscriber::whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->count(),
        ];
    }

    /**
     * Search subscribers
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterSubscriber::where(function ($q) use ($query) {
            $q->where('email', 'like', "%{$query}%")
              ->orWhere('first_name', 'like', "%{$query}%")
              ->orWhere('last_name', 'like', "%{$query}%");
        })
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);
    }
}