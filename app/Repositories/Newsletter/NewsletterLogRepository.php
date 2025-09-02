<?php

namespace App\Repositories\Newsletter;

use App\Models\NewsletterLog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;

class NewsletterLogRepository implements NewsletterLogRepositoryInterface
{
    /**
     * Get all logs with pagination
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterLog::with(['newsletter', 'subscriber'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get log by ID
     */
    public function findById(int $id): ?NewsletterLog
    {
        return NewsletterLog::with(['newsletter', 'subscriber'])->find($id);
    }

    /**
     * Create a new log
     */
    public function create(array $data): NewsletterLog
    {
        return NewsletterLog::create($data);
    }

    /**
     * Update log
     */
    public function update(int $id, array $data): NewsletterLog
    {
        $log = NewsletterLog::findOrFail($id);
        $log->update($data);
        return $log->fresh();
    }

    /**
     * Delete log
     */
    public function delete(int $id): bool
    {
        $log = NewsletterLog::findOrFail($id);
        return $log->delete();
    }

    /**
     * Get logs by action
     */
    public function getByAction(string $action, int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterLog::byAction($action)
            ->with(['newsletter', 'subscriber'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get logs for newsletter
     */
    public function getForNewsletter(int $newsletterId, int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterLog::forNewsletter($newsletterId)
            ->with(['newsletter', 'subscriber'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get logs for subscriber
     */
    public function getForSubscriber(int $subscriberId, int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterLog::forSubscriber($subscriberId)
            ->with(['newsletter', 'subscriber'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Log newsletter action
     */
    public function logAction(int $newsletterId, int $subscriberId, string $action, array $details = []): NewsletterLog
    {
        return $this->create([
            'newsletter_id' => $newsletterId,
            'newsletter_subscriber_id' => $subscriberId,
            'action' => $action,
            'details' => $details,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'metadata' => [
                'timestamp' => now()->toISOString(),
                'session_id' => session()->getId(),
            ],
        ]);
    }

    /**
     * Get log statistics
     */
    public function getStatistics(): array
    {
        $actions = NewsletterLog::selectRaw('action, COUNT(*) as count')
            ->groupBy('action')
            ->pluck('count', 'action')
            ->toArray();

        return [
            'total' => NewsletterLog::count(),
            'actions' => $actions,
            'today' => NewsletterLog::whereDate('created_at', today())->count(),
            'this_week' => NewsletterLog::whereBetween('created_at', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
            'this_month' => NewsletterLog::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'last_month' => NewsletterLog::whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->count(),
        ];
    }

    /**
     * Get logs by date range
     */
    public function getByDateRange(string $startDate, string $endDate, int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterLog::whereBetween('created_at', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay()
            ])
            ->with(['newsletter', 'subscriber'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get recent logs
     */
    public function getRecent(int $days = 7, int $perPage = 15): LengthAwarePaginator
    {
        return NewsletterLog::where('created_at', '>=', now()->subDays($days))
            ->with(['newsletter', 'subscriber'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }
}