<?php

namespace App\Repositories\Newsletter;

use App\Models\Newsletter;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;

class NewsletterRepository implements NewsletterRepositoryInterface
{
    /**
     * Get all newsletters with pagination
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return Newsletter::with(['author', 'logs'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get newsletter by ID
     */
    public function findById(string $id): ?Newsletter
    {
        return Newsletter::with(['author', 'logs', 'subscribers'])->find($id);
    }

    /**
     * Create a new newsletter
     */
    public function create(array $data): Newsletter
    {
        return Newsletter::create($data);
    }

    /**
     * Update newsletter
     */
    public function update(string $id, array $data): Newsletter
    {
        $newsletter = Newsletter::findOrFail($id);
        $newsletter->update($data);
        return $newsletter->fresh();
    }

    /**
     * Delete newsletter
     */
    public function delete(string $id): bool
    {
        $newsletter = Newsletter::findOrFail($id);
        return $newsletter->delete();
    }

    /**
     * Get published newsletters
     */
    public function getPublished(int $perPage = 15): LengthAwarePaginator
    {
        return Newsletter::isPublished()
            ->with(['author'])
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get draft newsletters
     */
    public function getDrafts(int $perPage = 15): LengthAwarePaginator
    {
        return Newsletter::isDraft()
            ->with(['author'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get scheduled newsletters
     */
    public function getScheduled(int $perPage = 15): LengthAwarePaginator
    {
        return Newsletter::isScheduled()
            ->with(['author'])
            ->orderBy('published_at', 'asc')
            ->paginate($perPage);
    }

    /**
     * Get newsletters ready to publish
     */
    public function getReadyToPublish(): Collection
    {
        return Newsletter::readyToPublish()
            ->with(['author', 'subscribers'])
            ->get();
    }

    /**
     * Publish newsletter
     */
    public function publish(string $id): Newsletter
    {
        $newsletter = Newsletter::findOrFail($id);
        $newsletter->update([
            'is_published' => true,
            'published_at' => now(),
        ]);
        return $newsletter->fresh();
    }

    /**
     * Unpublish newsletter
     */
    public function unpublish(string $id): Newsletter
    {
        $newsletter = Newsletter::findOrFail($id);
        $newsletter->update([
            'is_published' => false,
            'published_at' => null,
        ]);
        return $newsletter->fresh();
    }

    /**
     * Search newsletters
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        return Newsletter::search($query)
            ->with(['author'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get newsletters by author
     */
    public function getByAuthor(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Newsletter::byAuthor($userId)
            ->with(['author'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get recent newsletters
     */
    public function getRecent(int $days = 30, int $perPage = 15): LengthAwarePaginator
    {
        return Newsletter::recent($days)
            ->with(['author'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get newsletters by date range
     */
    public function getByDateRange(string $startDate, string $endDate, int $perPage = 15): LengthAwarePaginator
    {
        return Newsletter::dateRange($startDate, $endDate)
            ->with(['author'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get newsletter statistics
     */
    public function getStatistics(): array
    {
        return [
            'total' => Newsletter::count(),
            'published' => Newsletter::isPublished()->count(),
            'drafts' => Newsletter::isDraft()->count(),
            'scheduled' => Newsletter::isScheduled()->count(),
            'this_month' => Newsletter::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'last_month' => Newsletter::whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->count(),
        ];
    }
}