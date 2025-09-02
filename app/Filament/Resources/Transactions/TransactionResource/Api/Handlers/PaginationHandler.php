<?php

namespace App\Filament\Resources\Transactions\TransactionResource\Api\Handlers;

use Rupadana\ApiService\Http\Handlers;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Filament\Resources\Transactions\TransactionResource;
use App\Filament\Resources\Transactions\TransactionResource\Api\Transformers\TransactionTransformer;

class PaginationHandler extends Handlers
{
    public static string | null $uri = '/';
    public static string | null $resource = TransactionResource::class;

    /**
     * List of Transaction
     *
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection|\Illuminate\Http\JsonResponse
     */
    public function handler(Request $request)
    {
        try {
            $query = static::getEloquentQuery();
            
            // Use QueryBuilder for filtering, sorting, and pagination
            $query = QueryBuilder::for($query)
                ->allowedFields([
                    'id',
                    'transaction_id',
                    'type',
                    'status',
                    'amount',
                    'currency',
                    'customer_name',
                    'customer_email',
                    'created_at',
                    'updated_at'
                ])
                ->allowedSorts([
                    'id',
                    'transaction_id',
                    'type',
                    'status',
                    'amount',
                    'customer_name',
                    'customer_email',
                    'created_at',
                    'updated_at'
                ])
                ->allowedFilters([
                    'status',
                    'type',
                    'customer_email',
                    'currency'
                ])
                ->paginate($request->query('per_page', 15))
                ->appends($request->query());
            
            return TransactionTransformer::collection($query);
            
        } catch (\Exception $e) {
            Log::error('Transaction pagination failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_params' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve transactions: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
}
