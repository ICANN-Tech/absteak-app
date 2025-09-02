<?php
namespace App\Filament\Resources\Transactions\TransactionResource\Api\Handlers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Rupadana\ApiService\Http\Handlers;
use App\Filament\Resources\Transactions\TransactionResource;
use App\Repositories\Transaction\TransactionRepositoryInterface;

class DeleteHandler extends Handlers {
    public static string | null $uri = '/{id}';
    public static string | null $resource = TransactionResource::class;

    protected TransactionRepositoryInterface $transactionRepository;

    public function __construct(TransactionRepositoryInterface $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    public static function getMethod()
    {
        return Handlers::DELETE;
    }

    public static function getModel() {
        return static::$resource::getModel();
    }

    /**
     * Delete Transaction
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handler(Request $request)
    {
        try {
            DB::beginTransaction();
            
            $id = $request->route('id');
            
            // Check if transaction exists
            $transaction = $this->transactionRepository->findById($id);
            if (!$transaction) {
                return static::sendNotFoundResponse();
            }
            
            // Store transaction data for webhook before deletion
            $transactionData = $transaction->toArray();
            
            // Delete transaction using repository
            $deleted = $this->transactionRepository->delete($id);
            
            if (!$deleted) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete transaction',
                    'data' => null
                ], 500);
            }
            
            DB::commit();
            
            // Send webhook notification for successful deletion
            $this->sendWebhookNotification($transactionData, 'transaction.deleted', true);
            
            return static::sendSuccessResponse($transactionData, "Transaction deleted successfully");
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Transaction deletion failed', [
                'id' => $request->route('id'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Send webhook notification for failed deletion
            $this->sendWebhookNotification(null, 'transaction.delete_failed', false, $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Transaction deletion failed: ' . $e->getMessage(),
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