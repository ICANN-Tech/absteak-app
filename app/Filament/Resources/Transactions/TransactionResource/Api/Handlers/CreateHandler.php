<?php
namespace App\Filament\Resources\Transactions\TransactionResource\Api\Handlers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Rupadana\ApiService\Http\Handlers;
use App\Filament\Resources\Transactions\TransactionResource;
use App\Filament\Resources\Transactions\TransactionResource\Api\Requests\CreateTransactionRequest;
use App\Repositories\Transaction\TransactionRepositoryInterface;

class CreateHandler extends Handlers {
    public static string | null $uri = '/';
    public static string | null $resource = TransactionResource::class;

    protected TransactionRepositoryInterface $transactionRepository;

    public function __construct(TransactionRepositoryInterface $transactionRepository)
    {
        $this->transactionRepository = $transactionRepository;
    }

    public static function getMethod()
    {
        return Handlers::POST;
    }

    public static function getModel() {
        return static::$resource::getModel();
    }

    /**
     * Create Transaction with Repository Integration and Webhook Support
     *
     * @param CreateTransactionRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handler(CreateTransactionRequest $request)
    {
        try {
            DB::beginTransaction();

            // Create transaction using repository
            $transactionData = $request->validated();
            $transaction = $this->transactionRepository->create($transactionData);

            DB::commit();

            // Send success webhook notification
            $this->sendWebhookNotification($transaction, 'success');

            Log::info('Transaction created successfully', [
                'transaction_id' => $transaction->transaction_id,
                'amount' => $transaction->amount,
                'customer_email' => $transaction->customer_email
            ]);

            return static::sendSuccessResponse($transaction, "Transaction created successfully");

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Transaction creation failed', [
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            // Send failure webhook notification
            $this->sendWebhookNotification($request->all(), 'failure', $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Transaction creation failed: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    /**
     * Send webhook notification for transaction events
     *
     * @param mixed $data Transaction data or request data
     * @param string $status success or failure
     * @param string|null $errorMessage Error message for failure notifications
     * @return void
     */
    private function sendWebhookNotification($data, string $status, ?string $errorMessage = null): void
    {
        try {
            $webhookUrl = config('app.webhook_url');
            
            if (!$webhookUrl) {
                Log::warning('Webhook URL not configured');
                return;
            }

            $payload = [
                'event' => 'transaction.' . $status,
                'timestamp' => now()->toISOString(),
                'data' => $data,
            ];

            if ($status === 'failure' && $errorMessage) {
                $payload['error'] = $errorMessage;
            }

            Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'X-Webhook-Source' => 'ABSteak-Transaction-API',
                    'X-Webhook-Signature' => hash_hmac('sha256', json_encode($payload), config('app.webhook_secret', 'default-secret'))
                ])
                ->post($webhookUrl, $payload);

            Log::info('Webhook notification sent', [
                'event' => $payload['event'],
                'webhook_url' => $webhookUrl
            ]);

        } catch (\Exception $e) {
            Log::error('Webhook notification failed', [
                'error' => $e->getMessage(),
                'status' => $status
            ]);
        }
    }
}