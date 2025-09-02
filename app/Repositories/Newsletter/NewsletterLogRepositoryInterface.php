<?php

namespace App\Repositories\Newsletter;

use App\Models\NewsletterLog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface NewsletterLogRepositoryInterface
{
    /**
     * Get all logs with pagination
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get log by ID
     */
    public function findById(int $id): ?NewsletterLog;

    /**
     * Create a new log
     */
    public function create(array $data): NewsletterLog;

    /**
     * Update log
     */
    public function update(int $id, array $data): NewsletterLog;

    /**
     * Delete log
     */
    public function delete(int $id): bool;

    /**
     * Get logs by action
     */
    public function getByAction(string $action, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get logs for newsletter
     */
    public function getForNewsletter(int $newsletterId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get logs for subscriber
     */
    public function getForSubscriber(int $subscriberId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Log newsletter action
     */
    public function logAction(int $newsletterId, int $subscriberId, string $action, array $details = []): NewsletterLog;

    /**
     * Get log statistics
     */
    public function getStatistics(): array;

    /**
     * Get logs by date range
     */
    public function getByDateRange(string $startDate, string $endDate, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get recent logs
     */
    public function getRecent(int $days = 7, int $perPage = 15): LengthAwarePaginator;
}