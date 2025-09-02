<?php

namespace App\Repositories\Transaction;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection as SupportCollection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use League\Csv\Writer;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Exception;

/**
 * Transaction Repository Implementation
 * 
 * Provides comprehensive transaction data access operations with caching,
 * error handling, and export functionality.
 * 
 * @package App\Repositories\Transaction
 * @author ABSteak Development Team
 * @version 1.0.0
 */
class TransactionRepository implements TransactionRepositoryInterface
{
    /**
     * Cache key prefix for transactions
     */
    private const CACHE_PREFIX = 'transactions';

    /**
     * Default cache TTL in seconds (1 hour)
     */
    private const CACHE_TTL = 3600;

    /**
     * Default columns for export
     */
    private const DEFAULT_EXPORT_COLUMNS = [
        'transaction_id',
        'type',
        'status',
        'amount',
        'customer_name',
        'customer_email',
        'customer_phone',
        'notes',
        'expires_at',
        'created_at',
        'updated_at'
    ];

    /**
     * Get all transactions with optional filtering and pagination
     *
     * @param array $filters Optional filters (status, type, date_range, etc.)
     * @param int|null $perPage Number of items per page (null for all)
     * @param array $with Relationships to eager load
     * @return LengthAwarePaginator|Collection
     */
    public function getAll(array $filters = [], ?int $perPage = null, array $with = []): LengthAwarePaginator|Collection
    {
        try {
            $cacheKey = $this->generateCacheKey('all', $filters, $perPage, $with);
            
            return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($filters, $perPage, $with) {
                $query = Transaction::query();
                
                if (!empty($with)) {
                    $query->with($with);
                }
                
                $this->applyFilters($query, $filters);
                
                if ($perPage) {
                    return $query->paginate($perPage);
                }
                
                return $query->get();
            });
        } catch (Exception $e) {
            Log::error('Error fetching transactions', [
                'filters' => $filters,
                'perPage' => $perPage,
                'with' => $with,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Find transaction by ID
     *
     * @param string $id Transaction ID
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Transaction|null
     */
    public function findById(string $id, array $with = [], bool $useCache = true): ?Transaction
    {
        try {
            if (!$useCache) {
                $query = Transaction::query();
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->find($id);
            }
            
            $cacheKey = $this->generateCacheKey('find_by_id', ['id' => $id, 'with' => $with]);
            
            return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($id, $with) {
                $query = Transaction::query();
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->find($id);
            });
        } catch (Exception $e) {
            Log::error('Error finding transaction by ID', [
                'id' => $id,
                'with' => $with,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Find transaction by transaction_id field
     *
     * @param string $transactionId Transaction identifier
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Transaction|null
     */
    public function findByTransactionId(string $transactionId, array $with = [], bool $useCache = true): ?Transaction
    {
        try {
            if (!$useCache) {
                $query = Transaction::query();
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->where('transaction_id', $transactionId)->first();
            }
            
            $cacheKey = $this->generateCacheKey('find_by_transaction_id', ['transaction_id' => $transactionId, 'with' => $with]);
            
            return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($transactionId, $with) {
                $query = Transaction::query();
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->where('transaction_id', $transactionId)->first();
            });
        } catch (Exception $e) {
            Log::error('Error finding transaction by transaction_id', [
                'transaction_id' => $transactionId,
                'with' => $with,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Create a new transaction
     *
     * @param array $data Transaction data
     * @return Transaction
     * @throws Exception
     */
    public function create(array $data): Transaction
    {
        try {
            DB::beginTransaction();
            
            $transaction = Transaction::create($data);
            
            // Clear relevant caches
            $this->clearCache();
            
            DB::commit();
            
            Log::info('Transaction created successfully', [
                'transaction_id' => $transaction->transaction_id,
                'id' => $transaction->id
            ]);
            
            return $transaction;
        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Error creating transaction', [
                'data' => $data,
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to create transaction: ' . $e->getMessage());
        }
    }

    /**
     * Update an existing transaction
     *
     * @param string $id Transaction ID
     * @param array $data Updated data
     * @return Transaction
     * @throws Exception
     */
    public function update(string $id, array $data): Transaction
    {
        try {
            DB::beginTransaction();
            
            $transaction = Transaction::findOrFail($id);
            $transaction->update($data);
            
            // Clear relevant caches
            $this->clearCache($id);
            $this->clearCache();
            
            DB::commit();
            
            Log::info('Transaction updated successfully', [
                'transaction_id' => $transaction->transaction_id,
                'id' => $transaction->id,
                'updated_fields' => array_keys($data)
            ]);
            
            return $transaction->fresh();
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            
            Log::warning('Transaction not found for update', ['id' => $id]);
            throw new Exception('Transaction not found');
        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Error updating transaction', [
                'id' => $id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to update transaction: ' . $e->getMessage());
        }
    }

    /**
     * Delete a transaction
     *
     * @param string $id Transaction ID
     * @return bool
     * @throws Exception
     */
    public function delete(string $id): bool
    {
        try {
            DB::beginTransaction();
            
            $transaction = Transaction::findOrFail($id);
            $transactionId = $transaction->transaction_id;
            
            $deleted = $transaction->delete();
            
            // Clear relevant caches
            $this->clearCache($id);
            $this->clearCache();
            
            DB::commit();
            
            Log::info('Transaction deleted successfully', [
                'transaction_id' => $transactionId,
                'id' => $id
            ]);
            
            return $deleted;
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            
            Log::warning('Transaction not found for deletion', ['id' => $id]);
            throw new Exception('Transaction not found');
        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Error deleting transaction', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to delete transaction: ' . $e->getMessage());
        }
    }

    /**
     * Get transactions by status
     *
     * @param string $status Transaction status
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Collection
     */
    public function getByStatus(string $status, array $with = [], bool $useCache = true): Collection
    {
        try {
            if (!$useCache) {
                $query = Transaction::where('status', $status);
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->get();
            }
            
            $cacheKey = $this->generateCacheKey('by_status', ['status' => $status, 'with' => $with]);
            
            return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($status, $with) {
                $query = Transaction::where('status', $status);
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->get();
            });
        } catch (Exception $e) {
            Log::error('Error fetching transactions by status', [
                'status' => $status,
                'with' => $with,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get transactions by type
     *
     * @param string $type Transaction type
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Collection
     */
    public function getByType(string $type, array $with = [], bool $useCache = true): Collection
    {
        try {
            if (!$useCache) {
                $query = Transaction::where('type', $type);
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->get();
            }
            
            $cacheKey = $this->generateCacheKey('by_type', ['type' => $type, 'with' => $with]);
            
            return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($type, $with) {
                $query = Transaction::where('type', $type);
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->get();
            });
        } catch (Exception $e) {
            Log::error('Error fetching transactions by type', [
                'type' => $type,
                'with' => $with,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get transactions by customer email
     *
     * @param string $email Customer email
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Collection
     */
    public function getByCustomerEmail(string $email, array $with = [], bool $useCache = true): Collection
    {
        try {
            if (!$useCache) {
                $query = Transaction::where('customer_email', $email);
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->get();
            }
            
            $cacheKey = $this->generateCacheKey('by_customer_email', ['email' => $email, 'with' => $with]);
            
            return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($email, $with) {
                $query = Transaction::where('customer_email', $email);
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->get();
            });
        } catch (Exception $e) {
            Log::error('Error fetching transactions by customer email', [
                'email' => $email,
                'with' => $with,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get transactions within date range
     *
     * @param Carbon|string $startDate Start date
     * @param Carbon|string $endDate End date
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Collection
     */
    public function getByDateRange($startDate, $endDate, array $with = [], bool $useCache = true): Collection
    {
        try {
            $startDate = $startDate instanceof Carbon ? $startDate : Carbon::parse($startDate);
            $endDate = $endDate instanceof Carbon ? $endDate : Carbon::parse($endDate);
            
            if (!$useCache) {
                $query = Transaction::whereBetween('created_at', [$startDate, $endDate]);
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->get();
            }
            
            $cacheKey = $this->generateCacheKey('by_date_range', [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'with' => $with
            ]);
            
            return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($startDate, $endDate, $with) {
                $query = Transaction::whereBetween('created_at', [$startDate, $endDate]);
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->get();
            });
        } catch (Exception $e) {
            Log::error('Error fetching transactions by date range', [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'with' => $with,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get expired transactions
     *
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Collection
     */
    public function getExpired(array $with = [], bool $useCache = true): Collection
    {
        try {
            if (!$useCache) {
                $query = Transaction::where('expires_at', '<', now())
                    ->where('status', '!=', 'completed');
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->get();
            }
            
            $cacheKey = $this->generateCacheKey('expired', ['with' => $with]);
            
            return Cache::remember($cacheKey, 300, function () use ($with) { // 5 minutes cache for expired
                $query = Transaction::where('expires_at', '<', now())
                    ->where('status', '!=', 'completed');
                if (!empty($with)) {
                    $query->with($with);
                }
                return $query->get();
            });
        } catch (Exception $e) {
            Log::error('Error fetching expired transactions', [
                'with' => $with,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Export transactions to CSV format
     *
     * @param array $filters Optional filters
     * @param array $columns Columns to include in export
     * @return string CSV content
     */
    public function exportToCsv(array $filters = [], array $columns = []): string
    {
        try {
            $columns = empty($columns) ? self::DEFAULT_EXPORT_COLUMNS : $columns;
            $transactions = $this->getAll($filters, null, []);
            
            $csv = Writer::createFromString('');
            
            // Add header
            $csv->insertOne($columns);
            
            // Add data rows
            foreach ($transactions as $transaction) {
                $row = [];
                foreach ($columns as $column) {
                    $value = $transaction->{$column};
                    
                    // Format specific columns
                    if (in_array($column, ['created_at', 'updated_at', 'expires_at']) && $value) {
                        $value = Carbon::parse($value)->format('Y-m-d H:i:s');
                    } elseif ($column === 'amount') {
                        $value = number_format($value, 2);
                    } elseif ($column === 'transaction_details' && is_array($value)) {
                        $value = json_encode($value);
                    }
                    
                    $row[] = $value;
                }
                $csv->insertOne($row);
            }
            
            Log::info('CSV export completed', [
                'filters' => $filters,
                'columns' => $columns,
                'record_count' => $transactions->count()
            ]);
            
            return $csv->toString();
        } catch (Exception $e) {
            Log::error('Error exporting transactions to CSV', [
                'filters' => $filters,
                'columns' => $columns,
                'error' => $e->getMessage()
            ]);
            throw new Exception('Failed to export to CSV: ' . $e->getMessage());
        }
    }

    /**
     * Export transactions to Excel format
     *
     * @param array $filters Optional filters
     * @param array $columns Columns to include in export
     * @return string File path to generated Excel file
     */
    public function exportToExcel(array $filters = [], array $columns = []): string
    {
        try {
            $columns = empty($columns) ? self::DEFAULT_EXPORT_COLUMNS : $columns;
            $transactions = $this->getAll($filters, null, []);
            
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            
            // Set headers
            $columnIndex = 1;
            foreach ($columns as $column) {
                $sheet->setCellValueByColumnAndRow($columnIndex, 1, ucwords(str_replace('_', ' ', $column)));
                $columnIndex++;
            }
            
            // Add data
            $rowIndex = 2;
            foreach ($transactions as $transaction) {
                $columnIndex = 1;
                foreach ($columns as $column) {
                    $value = $transaction->{$column};
                    
                    // Format specific columns
                    if (in_array($column, ['created_at', 'updated_at', 'expires_at']) && $value) {
                        $value = Carbon::parse($value)->format('Y-m-d H:i:s');
                    } elseif ($column === 'transaction_details' && is_array($value)) {
                        $value = json_encode($value);
                    }
                    
                    $sheet->setCellValueByColumnAndRow($columnIndex, $rowIndex, $value);
                    $columnIndex++;
                }
                $rowIndex++;
            }
            
            // Generate filename and save
            $filename = 'transactions_export_' . date('Y-m-d_H-i-s') . '.xlsx';
            $filepath = storage_path('app/exports/' . $filename);
            
            // Ensure directory exists
            if (!file_exists(dirname($filepath))) {
                mkdir(dirname($filepath), 0755, true);
            }
            
            $writer = new Xlsx($spreadsheet);
            $writer->save($filepath);
            
            Log::info('Excel export completed', [
                'filters' => $filters,
                'columns' => $columns,
                'record_count' => $transactions->count(),
                'filepath' => $filepath
            ]);
            
            return $filepath;
        } catch (Exception $e) {
            Log::error('Error exporting transactions to Excel', [
                'filters' => $filters,
                'columns' => $columns,
                'error' => $e->getMessage()
            ]);
            throw new Exception('Failed to export to Excel: ' . $e->getMessage());
        }
    }

    /**
     * Get transaction statistics
     *
     * @param array $filters Optional filters
     * @param bool $useCache Whether to use cache
     * @return array Statistics data
     */
    public function getStatistics(array $filters = [], bool $useCache = true): array
    {
        try {
            if (!$useCache) {
                return $this->calculateStatistics($filters);
            }
            
            $cacheKey = $this->generateCacheKey('statistics', $filters);
            
            return Cache::remember($cacheKey, 1800, function () use ($filters) { // 30 minutes cache
                return $this->calculateStatistics($filters);
            });
        } catch (Exception $e) {
            Log::error('Error fetching transaction statistics', [
                'filters' => $filters,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Clear cache for specific transaction or all transactions
     *
     * @param string|null $id Transaction ID (null to clear all)
     * @return bool
     */
    public function clearCache(?string $id = null): bool
    {
        try {
            if ($id) {
                // Clear specific transaction caches
                $patterns = [
                    self::CACHE_PREFIX . ':find_by_id:*' . $id . '*',
                    self::CACHE_PREFIX . ':*'
                ];
            } else {
                // Clear all transaction caches
                $patterns = [self::CACHE_PREFIX . ':*'];
            }
            
            foreach ($patterns as $pattern) {
                $keys = Cache::getRedis()->keys($pattern);
                if (!empty($keys)) {
                    Cache::getRedis()->del($keys);
                }
            }
            
            Log::info('Cache cleared', ['id' => $id, 'patterns' => $patterns]);
            
            return true;
        } catch (Exception $e) {
            Log::error('Error clearing cache', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Bulk update transactions
     *
     * @param array $ids Transaction IDs
     * @param array $data Data to update
     * @return int Number of updated records
     * @throws Exception
     */
    public function bulkUpdate(array $ids, array $data): int
    {
        try {
            DB::beginTransaction();
            
            $updated = Transaction::whereIn('id', $ids)->update($data);
            
            // Clear relevant caches
            $this->clearCache();
            
            DB::commit();
            
            Log::info('Bulk update completed', [
                'ids' => $ids,
                'data' => $data,
                'updated_count' => $updated
            ]);
            
            return $updated;
        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Error in bulk update', [
                'ids' => $ids,
                'data' => $data,
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to bulk update transactions: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete transactions
     *
     * @param array $ids Transaction IDs
     * @return int Number of deleted records
     * @throws Exception
     */
    public function bulkDelete(array $ids): int
    {
        try {
            DB::beginTransaction();
            
            $deleted = Transaction::whereIn('id', $ids)->delete();
            
            // Clear relevant caches
            $this->clearCache();
            
            DB::commit();
            
            Log::info('Bulk delete completed', [
                'ids' => $ids,
                'deleted_count' => $deleted
            ]);
            
            return $deleted;
        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Error in bulk delete', [
                'ids' => $ids,
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to bulk delete transactions: ' . $e->getMessage());
        }
    }

    /**
     * Search transactions by query
     *
     * @param string $query Search query
     * @param array $fields Fields to search in
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Collection
     */
    public function search(string $query, array $fields = [], array $with = [], bool $useCache = true): Collection
    {
        try {
            $fields = empty($fields) ? ['transaction_id', 'customer_name', 'customer_email', 'notes'] : $fields;
            
            if (!$useCache) {
                return $this->performSearch($query, $fields, $with);
            }
            
            $cacheKey = $this->generateCacheKey('search', [
                'query' => $query,
                'fields' => $fields,
                'with' => $with
            ]);
            
            return Cache::remember($cacheKey, 600, function () use ($query, $fields, $with) { // 10 minutes cache
                return $this->performSearch($query, $fields, $with);
            });
        } catch (Exception $e) {
            Log::error('Error searching transactions', [
                'query' => $query,
                'fields' => $fields,
                'with' => $with,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Apply filters to query
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $filters
     * @return void
     */
    private function applyFilters($query, array $filters): void
    {
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }
        
        if (isset($filters['customer_email'])) {
            $query->where('customer_email', $filters['customer_email']);
        }
        
        if (isset($filters['date_from'])) {
            $query->where('created_at', '>=', Carbon::parse($filters['date_from']));
        }
        
        if (isset($filters['date_to'])) {
            $query->where('created_at', '<=', Carbon::parse($filters['date_to']));
        }
        
        if (isset($filters['amount_min'])) {
            $query->where('amount', '>=', $filters['amount_min']);
        }
        
        if (isset($filters['amount_max'])) {
            $query->where('amount', '<=', $filters['amount_max']);
        }
        
        if (isset($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('transaction_id', 'like', $searchTerm)
                  ->orWhere('customer_name', 'like', $searchTerm)
                  ->orWhere('customer_email', 'like', $searchTerm)
                  ->orWhere('notes', 'like', $searchTerm);
            });
        }
    }

    /**
     * Generate cache key
     *
     * @param string $operation
     * @param array $params
     * @return string
     */
    private function generateCacheKey(string $operation, array $params = []): string
    {
        $key = self::CACHE_PREFIX . ':' . $operation;
        
        if (!empty($params)) {
            $key .= ':' . md5(serialize($params));
        }
        
        return $key;
    }

    /**
     * Calculate statistics
     *
     * @param array $filters
     * @return array
     */
    private function calculateStatistics(array $filters): array
    {
        $query = Transaction::query();
        $this->applyFilters($query, $filters);
        
        $baseQuery = clone $query;
        
        return [
            'total_count' => $baseQuery->count(),
            'total_amount' => $baseQuery->sum('amount'),
            'average_amount' => $baseQuery->avg('amount'),
            'status_breakdown' => $baseQuery->groupBy('status')
                ->selectRaw('status, count(*) as count, sum(amount) as total_amount')
                ->get()
                ->keyBy('status')
                ->toArray(),
            'type_breakdown' => $baseQuery->groupBy('type')
                ->selectRaw('type, count(*) as count, sum(amount) as total_amount')
                ->get()
                ->keyBy('type')
                ->toArray(),
            'monthly_stats' => $baseQuery->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, count(*) as count, sum(amount) as total_amount')
                ->groupBy('month')
                ->orderBy('month')
                ->get()
                ->keyBy('month')
                ->toArray()
        ];
    }

    /**
     * Perform search operation
     *
     * @param string $query
     * @param array $fields
     * @param array $with
     * @return Collection
     */
    private function performSearch(string $query, array $fields, array $with): Collection
    {
        $searchQuery = Transaction::query();
        
        if (!empty($with)) {
            $searchQuery->with($with);
        }
        
        $searchTerm = '%' . $query . '%';
        
        $searchQuery->where(function ($q) use ($fields, $searchTerm) {
            foreach ($fields as $field) {
                $q->orWhere($field, 'like', $searchTerm);
            }
        });
        
        return $searchQuery->get();
    }
}