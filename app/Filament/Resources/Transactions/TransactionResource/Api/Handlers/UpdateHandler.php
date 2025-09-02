<?php
namespace App\Filament\Resources\Transactions\TransactionResource\Api\Handlers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Rupadana\ApiService\Http\Handlers;
use App\Filament\Resources\Transactions\TransactionResource;
use App\Filament\Resources\Transactions\TransactionResource\Api\Requests\UpdateTransactionRequest;
use App\Repositories\Transaction\TransactionRepositoryInterface;

class UpdateHandler extends Handlers {
    public static string | null $uri = '/{id}';
    public static string | null $resource = TransactionResource::class;

    protected TransactionRepositoryInterface $transactionRepository;

    public function __construct(TransactionRepositoryInterface $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    public static function getMethod()
    {
        return Handlers::PUT;
    }

    public static function getModel() {
        return static::$resource::getModel();
    }

    /**
     * Update Transaction
     *
     * @param UpdateTransactionRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handler(UpdateTransactionRequest $request)
    {
        try {
            DB::beginTransaction();
            
            $id = $request->route('id');
            $data = $request->validated();
            
            // Check if transaction exists
            $existingTransaction = $this->transactionRepository->findById($id);
            if (!$existingTransaction) {
                return static::sendNotFoundResponse();
            }
            
            // Update transaction using repository
            $updatedTransaction = $this->transactionRepository->update($id, $data);
            
            if (!$updatedTransaction) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update transaction',
                    'data' => null
                ], 500);
            }
            
            DB::commit();
            
            // Send webhook notification for successful update
            $this->sendWebhookNotification($updatedTransaction, 'transaction.updated', true);
            
            return static::sendSuccessResponse($updatedTransaction, "Transaction updated successfully");
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Transaction update failed', [
                'id' => $request->route('id'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Send webhook notification for failed update
            $this->sendWebhookNotification(null, 'transaction.update_failed', false, $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Transaction update failed: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }
    
    /**
     * Send webhook notification
     *
     * @param mixed $transaction
     * @param string $event
     * @param bool $success
     * @param string|null $errorMessage
     * @return void
     */
    private function sendWebhookNotification($transaction, string $event, bool $success, ?string $errorMessage = null): void
    {
        try {
            $webhookUrl = config('app.webhook_url');
            if (!$webhookUrl) {
                return;
            }
            
            $payload = [
                'event' => $event,
                'success' => $success,
                'timestamp' => now()->toISOString(),
                'data' => $transaction,
            ];
            
            if (!$success && $errorMessage) {
                $payload['error'] = $errorMessage;
            }
            
            $webhookSecret = config('app.webhook_secret', 'default-secret');
            $signature = hash_hmac('sha256', json_encode($payload), $webhookSecret);
            
            // In a real implementation, you would send this via HTTP client
            Log::info('Webhook notification sent', [
                'url' => $webhookUrl,
                'event' => $event,
                'signature' => $signature,
                'payload' => $payload
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to send webhook notification', [
                'error' => $e->getMessage(),
                'event' => $event
            ]);
        }
    }
}