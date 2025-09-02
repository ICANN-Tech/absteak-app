<?php

namespace App\Filament\Resources\Transactions\TransactionResource\Api\Handlers;

use App\Filament\Resources\Transactions\TransactionResource;
use Rupadana\ApiService\Http\Handlers;
use Spatie\QueryBuilder\QueryBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Filament\Resources\Transactions\TransactionResource\Api\Transformers\TransactionTransformer;
use App\Repositories\Transaction\TransactionRepositoryInterface;

class DetailHandler extends Handlers
{
    public static string | null $uri = '/{id}';
    public static string | null $resource = TransactionResource::class;

    protected TransactionRepositoryInterface $transactionRepository;

    public function __construct(TransactionRepositoryInterface $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    /**
     * Show Transaction
     *
     * @param Request $request
     * @return TransactionTransformer|\Illuminate\Http\JsonResponse
     */
    public function handler(Request $request)
    {
        try {
            $id = $request->route('id');
            
            // Use repository to find transaction with caching
            $transaction = $this->transactionRepository->findById($id);
            
            if (!$transaction) {
                return static::sendNotFoundResponse();
            }
            
            return new TransactionTransformer($transaction);
            
        } catch (\Exception $e) {
            Log::error('Transaction detail retrieval failed', [
                'id' => $request->route('id'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve transaction details: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
}
