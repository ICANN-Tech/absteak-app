<?php
namespace App\Filament\Resources\Transactions\TransactionResource\Api\Handlers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Rupadana\ApiService\Http\Handlers;
use App\Filament\Resources\Transactions\TransactionResource;
use App\Repositories\Transaction\TransactionRepositoryInterface;

class WebhookHandler extends Handlers {
    public static string | null $uri = '/webhook';
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
     * Handle webhook notifications
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handler(Request $request)
    {
        try {
            // Verify webhook signature
            if (!$this->verifyWebhookSignature($request)) {
                Log::warning('Invalid webhook signature', [
                    'headers' => $request->headers->all(),
                    'ip' => $request->ip()
                ]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid signature'
                ], 401);
            }

            $payload = $request->all();
            $event = $payload['event'] ?? null;

            Log::info('Webhook received', [
                'event' => $event,
                'payload' => $payload
            ]);

            switch ($event) {
                case 'transaction.success':
                    return $this->handleTransactionSuccess($payload);
                
                case 'transaction.failure':
                    return $this->handleTransactionFailure($payload);
                
                case 'payment.paid':
                    return $this->handlePaymentPaid($payload);
                
                case 'payment.expired':
                    return $this->handlePaymentExpired($payload);
                
                default:
                    Log::warning('Unknown webhook event', ['event' => $event]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Unknown event type'
                    ], 400);
            }

        } catch (\Exception $e) {
            Log::error('Webhook processing failed', [
                'error' => $e->getMessage(),
                'payload' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Webhook processing failed'
            ], 500);
        }
    }

    /**
     * Handle successful transaction webhook
     *
     * @param array $payload
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleTransactionSuccess(array $payload): \Illuminate\Http\JsonResponse
    {
        try {
            $transactionData = $payload['data'] ?? [];
            $transactionId = $transactionData['transaction_id'] ?? null;

            if (!$transactionId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction ID not provided'
                ], 400);
            }

            // Update transaction status to completed
            $transaction = $this->transactionRepository->findByTransactionId($transactionId);
            
            if ($transaction) {
                $this->transactionRepository->update($transaction->id, [
                    'status' => 'completed',
                    'paid_at' => now(),
                    'payment_details' => json_encode($payload)
                ]);

                Log::info('Transaction marked as successful', [
                    'transaction_id' => $transactionId
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Transaction success processed'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to process transaction success', [
                'error' => $e->getMessage(),
                'payload' => $payload
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process transaction success'
            ], 500);
        }
    }

    /**
     * Handle failed transaction webhook
     *
     * @param array $payload
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleTransactionFailure(array $payload): \Illuminate\Http\JsonResponse
    {
        try {
            $transactionData = $payload['data'] ?? [];
            $transactionId = $transactionData['transaction_id'] ?? null;
            $errorMessage = $payload['error'] ?? 'Unknown error';

            if (!$transactionId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction ID not provided'
                ], 400);
            }

            // Update transaction status to failed
            $transaction = $this->transactionRepository->findByTransactionId($transactionId);
            
            if ($transaction) {
                $this->transactionRepository->update($transaction->id, [
                    'status' => 'failed',
                    'notes' => $errorMessage,
                    'payment_details' => json_encode($payload)
                ]);

                Log::info('Transaction marked as failed', [
                    'transaction_id' => $transactionId,
                    'error' => $errorMessage
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Transaction failure processed'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to process transaction failure', [
                'error' => $e->getMessage(),
                'payload' => $payload
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process transaction failure'
            ], 500);
        }
    }

    /**
     * Handle payment paid webhook (from Xendit)
     *
     * @param array $payload
     * @return \Illuminate\Http\JsonResponse
     */
    private function handlePaymentPaid(array $payload): \Illuminate\Http\JsonResponse
    {
        try {
            $externalId = $payload['external_id'] ?? null;
            
            if (!$externalId) {
                return response()->json([
                    'success' => false,
                    'message' => 'External ID not provided'
                ], 400);
            }

            // Find transaction by external ID (transaction_id)
            $transaction = $this->transactionRepository->findByTransactionId($externalId);
            
            if ($transaction) {
                $this->transactionRepository->update($transaction->id, [
                    'status' => 'completed',
                    'paid_at' => now(),
                    'payment_details' => json_encode($payload),
                    'xendit_invoice_id' => $payload['id'] ?? null
                ]);

                Log::info('Payment marked as paid', [
                    'external_id' => $externalId,
                    'xendit_id' => $payload['id'] ?? null
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment processed'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to process payment paid', [
                'error' => $e->getMessage(),
                'payload' => $payload
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment'
            ], 500);
        }
    }

    /**
     * Handle payment expired webhook (from Xendit)
     *
     * @param array $payload
     * @return \Illuminate\Http\JsonResponse
     */
    private function handlePaymentExpired(array $payload): \Illuminate\Http\JsonResponse
    {
        try {
            $externalId = $payload['external_id'] ?? null;
            
            if (!$externalId) {
                return response()->json([
                    'success' => false,
                    'message' => 'External ID not provided'
                ], 400);
            }

            // Find transaction by external ID (transaction_id)
            $transaction = $this->transactionRepository->findByTransactionId($externalId);
            
            if ($transaction) {
                $this->transactionRepository->update($transaction->id, [
                    'status' => 'expired',
                    'payment_details' => json_encode($payload)
                ]);

                Log::info('Payment marked as expired', [
                    'external_id' => $externalId,
                    'xendit_id' => $payload['id'] ?? null
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment expiration processed'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to process payment expiration', [
                'error' => $e->getMessage(),
                'payload' => $payload
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment expiration'
            ], 500);
        }
    }

    /**
     * Verify webhook signature
     *
     * @param Request $request
     * @return bool
     */
    private function verifyWebhookSignature(Request $request): bool
    {
        $signature = $request->header('X-Webhook-Signature');
        $secret = config('app.webhook_secret', 'default-secret');
        
        if (!$signature) {
            return false;
        }

        $expectedSignature = hash_hmac('sha256', $request->getContent(), $secret);
        
        return hash_equals($expectedSignature, $signature);
    }
}