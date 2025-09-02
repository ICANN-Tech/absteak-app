<?php

namespace App\Repositories\Newsletter;

use App\Models\NewsletterSubscriber;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface NewsletterSubscriberRepositoryInterface
{
    /**
     * Get all subscribers with pagination
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get subscriber by ID
     */
    public function findById(int $id): ?NewsletterSubscriber;

    /**
     * Get subscriber by email
     */
    public function findByEmail(string $email): ?NewsletterSubscriber;

    /**
     * Create a new subscriber
     */
    public function create(array $data): NewsletterSubscriber;

    /**
     * Update subscriber
     */
    public function update(int $id, array $data): NewsletterSubscriber;

    /**
     * Delete subscriber
     */
    public function delete(int $id): bool;

    /**
     * Get active subscribers
     */
    public function getActive(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get inactive subscribers
     */
    public function getInactive(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get verified subscribers
     */
    public function getVerified(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get unverified subscribers
     */
    public function getUnverified(int $perPage = 15): LengthAwarePaginator;

    /**
     * Subscribe user
     */
    public function subscribe(array $data): NewsletterSubscriber;

    /**
     * Unsubscribe user
     */
    public function unsubscribe(string $token): bool;

    /**
     * Verify email
     */
    public function verifyEmail(string $token): bool;

    /**
     * Get subscriber statistics
     */
    public function getStatistics(): array;

    /**
     * Search subscribers
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator;
}