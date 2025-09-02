<?php

namespace App\Repositories\Newsletter;

use App\Models\Newsletter;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface NewsletterRepositoryInterface
{
    /**
     * Get all newsletters with pagination
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get newsletter by ID
     */
    public function findById(string $id): ?Newsletter;

    /**
     * Create a new newsletter
     */
    public function create(array $data): Newsletter;

    /**
     * Update newsletter
     */
    public function update(string $id, array $data): Newsletter;

    /**
     * Delete newsletter
     */
    public function delete(string $id): bool;

    /**
     * Get published newsletters
     */
    public function getPublished(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get draft newsletters
     */
    public function getDrafts(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get scheduled newsletters
     */
    public function getScheduled(int $perPage = 15): LengthAwarePaginator;

    /**
     * Get newsletters ready to publish
     */
    public function getReadyToPublish(): Collection;

    /**
     * Publish newsletter
     */
    public function publish(string $id): Newsletter;

    /**
     * Unpublish newsletter
     */
    public function unpublish(string $id): Newsletter;

    /**
     * Search newsletters
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get newsletters by author
     */
    public function getByAuthor(int $userId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get recent newsletters
     */
    public function getRecent(int $days = 30, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get newsletters by date range
     */
    public function getByDateRange(string $startDate, string $endDate, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get newsletter statistics
     */
    public function getStatistics(): array;
}