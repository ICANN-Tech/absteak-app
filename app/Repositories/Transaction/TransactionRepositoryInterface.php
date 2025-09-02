<?php

namespace App\Repositories\Transaction;

use App\Models\Transaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;

/**
 * Transaction Repository Interface
 * 
 * Defines the contract for transaction data access operations including
 * CRUD operations, caching, and data export functionality.
 * 
 * @package App\Repositories\Transaction
 * @author ABSteak Development Team
 * @version 1.0.0
 */
interface TransactionRepositoryInterface
{
    /**
     * Get all transactions with optional filtering and pagination
     *
     * @param array $filters Optional filters (status, type, date_range, etc.)
     * @param int|null $perPage Number of items per page (null for all)
     * @param array $with Relationships to eager load
     * @return LengthAwarePaginator|Collection
     */
    public function getAll(array $filters = [], ?int $perPage = null, array $with = []): LengthAwarePaginator|Collection;

    /**
     * Find transaction by ID
     *
     * @param string $id Transaction ID
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Transaction|null
     */
    public function findById(string $id, array $with = [], bool $useCache = true): ?Transaction;

    /**
     * Find transaction by transaction_id field
     *
     * @param string $transactionId Transaction identifier
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Transaction|null
     */
    public function findByTransactionId(string $transactionId, array $with = [], bool $useCache = true): ?Transaction;

    /**
     * Create a new transaction
     *
     * @param array $data Transaction data
     * @return Transaction
     * @throws \Exception
     */
    public function create(array $data): Transaction;

    /**
     * Update an existing transaction
     *
     * @param string $id Transaction ID
     * @param array $data Updated data
     * @return Transaction
     * @throws \Exception
     */
    public function update(string $id, array $data): Transaction;

    /**
     * Delete a transaction
     *
     * @param string $id Transaction ID
     * @return bool
     * @throws \Exception
     */
    public function delete(string $id): bool;

    /**
     * Get transactions by status
     *
     * @param string $status Transaction status
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Collection
     */
    public function getByStatus(string $status, array $with = [], bool $useCache = true): Collection;

    /**
     * Get transactions by type
     *
     * @param string $type Transaction type
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Collection
     */
    public function getByType(string $type, array $with = [], bool $useCache = true): Collection;

    /**
     * Get transactions by customer email
     *
     * @param string $email Customer email
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Collection
     */
    public function getByCustomerEmail(string $email, array $with = [], bool $useCache = true): Collection;

    /**
     * Get transactions within date range
     *
     * @param \Carbon\Carbon|string $startDate Start date
     * @param \Carbon\Carbon|string $endDate End date
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Collection
     */
    public function getByDateRange($startDate, $endDate, array $with = [], bool $useCache = true): Collection;

    /**
     * Get expired transactions
     *
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Collection
     */
    public function getExpired(array $with = [], bool $useCache = true): Collection;

    /**
     * Export transactions to CSV format
     *
     * @param array $filters Optional filters
     * @param array $columns Columns to include in export
     * @return string CSV content
     */
    public function exportToCsv(array $filters = [], array $columns = []): string;

    /**
     * Export transactions to Excel format
     *
     * @param array $filters Optional filters
     * @param array $columns Columns to include in export
     * @return string File path to generated Excel file
     */
    public function exportToExcel(array $filters = [], array $columns = []): string;

    /**
     * Get transaction statistics
     *
     * @param array $filters Optional filters
     * @param bool $useCache Whether to use cache
     * @return array Statistics data
     */
    public function getStatistics(array $filters = [], bool $useCache = true): array;

    /**
     * Clear cache for specific transaction or all transactions
     *
     * @param string|null $id Transaction ID (null to clear all)
     * @return bool
     */
    public function clearCache(?string $id = null): bool;

    /**
     * Bulk update transactions
     *
     * @param array $ids Transaction IDs
     * @param array $data Data to update
     * @return int Number of updated records
     * @throws \Exception
     */
    public function bulkUpdate(array $ids, array $data): int;

    /**
     * Bulk delete transactions
     *
     * @param array $ids Transaction IDs
     * @return int Number of deleted records
     * @throws \Exception
     */
    public function bulkDelete(array $ids): int;

    /**
     * Search transactions by query
     *
     * @param string $query Search query
     * @param array $fields Fields to search in
     * @param array $with Relationships to eager load
     * @param bool $useCache Whether to use cache
     * @return Collection
     */
    public function search(string $query, array $fields = [], array $with = [], bool $useCache = true): Collection;
}