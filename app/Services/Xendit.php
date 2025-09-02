<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use InvalidArgumentException;

/**
 * Xendit Payment Gateway Service
 * 
 * A comprehensive, reusable service for integrating with Xendit payment gateway.
 * Supports multiple payment channels including QRIS, Virtual Account, Credit Card,
 * E-Wallet, and more with dynamic channel activation checking.
 * 
 * @package App\Services
 * @author ABSteak Development Team
 * @version 1.0.0
 * 
 * @example
 * // Basic usage for QRIS payment
 * $xendit = new Xendit();
 * $result = $xendit->createQrisPayment([
 *     'external_id' => 'order-123',
 *     'amount' => 50000,
 *     'qr_code_type' => 'DYNAMIC'
 * ]);
 * 
 * @example
 * // Virtual Account payment
 * $result = $xendit->createVirtualAccount([
 *     'external_id' => 'va-order-456',
 *     'bank_code' => 'BCA',
 *     'name' => 'John Doe',
 *     'expected_amount' => 100000
 * ]);
 * 
 * @example
 * // Check payment status
 * $status = $xendit->getPaymentStatus('payment-id-789', 'QRIS');
 */
class Xendit
{
    /**
     * Xendit API base URL
     */
    private const BASE_URL = 'https://api.xendit.co';
    
    /**
     * Supported payment channels
     */
    public const CHANNELS = [
        'QRIS' => 'qr_codes',
        'VIRTUAL_ACCOUNT' => 'virtual_accounts',
        'CREDIT_CARD' => 'credit_card_charges',
        'E_WALLET' => 'ewallets',
        'RETAIL_OUTLET' => 'retail_outlets',
        'CARDLESS_CREDIT' => 'cardless_credit',
        'DIRECT_DEBIT' => 'direct_debits'
    ];
    
    /**
     * Virtual Account bank codes
     */
    public const VA_BANKS = [
        'BCA', 'BNI', 'BRI', 'MANDIRI', 'PERMATA', 'SAHABAT_SAMPOERNA'
    ];
    
    /**
     * E-Wallet types
     */
    public const E_WALLETS = [
        'OVO', 'DANA', 'LINKAJA', 'SHOPEEPAY', 'ASTRAPAY'
    ];
    
    /**
     * Payment status constants
     */
    public const STATUS_PENDING = 'PENDING';
    public const STATUS_PAID = 'PAID';
    public const STATUS_EXPIRED = 'EXPIRED';
    public const STATUS_FAILED = 'FAILED';
    
    private string $apiKey;
    private ?string $publicKey;
    private string $callbackToken;
    private bool $isProduction;
    private array $activeChannels;
    
    /**
     * Initialize Xendit service
     * 
     * @param string|null $apiKey Xendit secret API key (defaults to config)
     * @param string|null $publicKey Xendit public API key for tokenization (defaults to config)
     * @param string|null $callbackToken Callback verification token
     * @param bool $isProduction Whether to use production environment
     * 
     * @throws InvalidArgumentException If API key is not provided
     */
    public function __construct(
        ?string $apiKey = null,
        ?string $publicKey = null,
        ?string $callbackToken = null,
        bool $isProduction = false
    ) {
        $this->apiKey = $apiKey ?? config('xendit.api_key');
        $this->publicKey = $publicKey ?? config('xendit.public_key');
        $this->callbackToken = $callbackToken ?? config('xendit.callback_token');
        $this->isProduction = $isProduction ?? config('xendit.is_production', false);
        
        if (empty($this->apiKey)) {
            throw new InvalidArgumentException('Xendit API key is required');
        }
        
        $this->loadActiveChannels();
    }
    
    /**
     * Create QRIS payment
     * 
     * @param array $data Payment data
     * @return array Payment response
     * 
     * @throws Exception If channel is not active or API call fails
     * 
     * @example
     * $result = $xendit->createQrisPayment([
     *     'external_id' => 'order-123',
     *     'amount' => 50000,
     *     'qr_code_type' => 'DYNAMIC',
     *     'callback_url' => 'https://yoursite.com/webhook/xendit'
     * ]);
     */
    public function createQrisPayment(array $data): array
    {
        $this->validateChannelActive('QRIS');
        $this->validateRequired($data, ['external_id', 'amount']);
        
        $payload = array_merge([
            'qr_code_type' => 'DYNAMIC',
            'callback_url' => config('app.url') . '/webhook/xendit/qris'
        ], $data);
        
        try {
            $response = $this->makeRequest('POST', '/qr_codes', $payload);
            
            Log::info('QRIS payment created', [
                'external_id' => $data['external_id'],
                'amount' => $data['amount'],
                'qr_id' => $response['id'] ?? null
            ]);
            
            return $this->formatResponse(true, 'QRIS payment created successfully', $response);
            
        } catch (Exception $e) {
            Log::error('QRIS payment creation failed', [
                'external_id' => $data['external_id'],
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to create QRIS payment: ' . $e->getMessage());
        }
    }
    
    /**
     * Create Virtual Account payment
     * 
     * @param array $data Payment data
     * @return array Payment response
     * 
     * @throws Exception If channel is not active or API call fails
     * 
     * @example
     * $result = $xendit->createVirtualAccount([
     *     'external_id' => 'va-order-456',
     *     'bank_code' => 'BCA',
     *     'name' => 'John Doe',
     *     'expected_amount' => 100000,
     *     'expiration_date' => '2024-12-31T23:59:59.000Z'
     * ]);
     */
    public function createVirtualAccount(array $data): array
    {
        $this->validateChannelActive('VIRTUAL_ACCOUNT');
        $this->validateRequired($data, ['external_id', 'bank_code', 'name']);
        
        if (!in_array($data['bank_code'], self::VA_BANKS)) {
            throw new InvalidArgumentException('Invalid bank code. Supported: ' . implode(', ', self::VA_BANKS));
        }
        
        $payload = array_merge([
            'is_closed' => true,
            'expiration_date' => now()->addDays(1)->toISOString()
        ], $data);
        
        try {
            $response = $this->makeRequest('POST', '/virtual_accounts', $payload);
            
            Log::info('Virtual Account created', [
                'external_id' => $data['external_id'],
                'bank_code' => $data['bank_code'],
                'account_number' => $response['account_number'] ?? null
            ]);
            
            return $this->formatResponse(true, 'Virtual Account created successfully', $response);
            
        } catch (Exception $e) {
            Log::error('Virtual Account creation failed', [
                'external_id' => $data['external_id'],
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to create Virtual Account: ' . $e->getMessage());
        }
    }
    
    /**
     * Create E-Wallet payment
     * 
     * @param array $data Payment data
     * @return array Payment response
     * 
     * @throws Exception If channel is not active or API call fails
     * 
     * @example
     * $result = $xendit->createEWalletPayment([
     *     'external_id' => 'ew-order-789',
     *     'amount' => 75000,
     *     'phone' => '08123456789',
     *     'ewallet_type' => 'OVO',
     *     'callback_url' => 'https://yoursite.com/webhook/xendit/ewallet'
     * ]);
     */
    public function createEWalletPayment(array $data): array
    {
        $this->validateChannelActive('E_WALLET');
        $this->validateRequired($data, ['external_id', 'amount', 'phone', 'ewallet_type']);
        
        if (!in_array($data['ewallet_type'], self::E_WALLETS)) {
            throw new InvalidArgumentException('Invalid e-wallet type. Supported: ' . implode(', ', self::E_WALLETS));
        }
        
        $payload = array_merge([
            'callback_url' => config('app.url') . '/webhook/xendit/ewallet'
        ], $data);
        
        try {
            $response = $this->makeRequest('POST', '/ewallets', $payload);
            
            Log::info('E-Wallet payment created', [
                'external_id' => $data['external_id'],
                'ewallet_type' => $data['ewallet_type'],
                'amount' => $data['amount']
            ]);
            
            return $this->formatResponse(true, 'E-Wallet payment created successfully', $response);
            
        } catch (Exception $e) {
            Log::error('E-Wallet payment creation failed', [
                'external_id' => $data['external_id'],
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to create E-Wallet payment: ' . $e->getMessage());
        }
    }
    
    /**
     * Get payment status
     * 
     * @param string $paymentId Payment ID from Xendit
     * @param string $channel Payment channel type
     * @return array Payment status response
     * 
     * @throws Exception If API call fails
     * 
     * @example
     * $status = $xendit->getPaymentStatus('qr_12345', 'QRIS');
     * $status = $xendit->getPaymentStatus('va_67890', 'VIRTUAL_ACCOUNT');
     */
    public function getPaymentStatus(string $paymentId, string $channel): array
    {
        if (!isset(self::CHANNELS[$channel])) {
            throw new InvalidArgumentException('Invalid payment channel: ' . $channel);
        }
        
        $endpoint = '/' . self::CHANNELS[$channel] . '/' . $paymentId;
        
        try {
            $response = $this->makeRequest('GET', $endpoint);
            
            return $this->formatResponse(true, 'Payment status retrieved successfully', $response);
            
        } catch (Exception $e) {
            Log::error('Failed to get payment status', [
                'payment_id' => $paymentId,
                'channel' => $channel,
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to get payment status: ' . $e->getMessage());
        }
    }
    
    /**
     * Verify webhook callback
     * 
     * @param string $rawBody Raw request body
     * @param string $signature X-CALLBACK-TOKEN header
     * @return bool Whether the callback is valid
     * 
     * @example
     * $isValid = $xendit->verifyCallback(
     *     file_get_contents('php://input'),
     *     $_SERVER['HTTP_X_CALLBACK_TOKEN'] ?? ''
     * );
     */
    public function verifyCallback(string $rawBody, string $signature): bool
    {
        if (empty($this->callbackToken)) {
            Log::warning('Callback token not configured');
            return false;
        }
        
        $expectedSignature = hash_hmac('sha256', $rawBody, $this->callbackToken);
        
        return hash_equals($expectedSignature, $signature);
    }
    
    /**
     * Check if payment channel is active
     * 
     * @param string $channel Channel name
     * @return bool Whether the channel is active
     * 
     * @example
     * if ($xendit->isChannelActive('QRIS')) {
     *     // Proceed with QRIS payment
     * }
     */
    public function isChannelActive(string $channel): bool
    {
        return in_array($channel, $this->activeChannels);
    }
    
    /**
     * Get all active payment channels
     * 
     * @return array List of active channels
     */
    public function getActiveChannels(): array
    {
        return $this->activeChannels;
    }
    
    /**
     * Refresh active channels from cache or API
     * 
     * @return void
     */
    public function refreshActiveChannels(): void
    {
        Cache::forget('xendit_active_channels');
        $this->loadActiveChannels();
    }
    
    /**
     * Load active channels from cache or API
     * 
     * @return void
     */
    private function loadActiveChannels(): void
    {
        $this->activeChannels = Cache::remember('xendit_active_channels', 3600, function () {
            try {
                // In production, you would call Xendit API to get active channels
                // For now, we'll simulate based on environment
                if ($this->isProduction) {
                    return ['QRIS', 'VIRTUAL_ACCOUNT', 'E_WALLET', 'CREDIT_CARD'];
                } else {
                    return ['QRIS', 'VIRTUAL_ACCOUNT', 'E_WALLET'];
                }
            } catch (Exception $e) {
                Log::error('Failed to load active channels', ['error' => $e->getMessage()]);
                return ['QRIS', 'VIRTUAL_ACCOUNT']; // Fallback channels
            }
        });
    }
    
    /**
     * Validate that a channel is active
     * 
     * @param string $channel Channel name
     * @throws Exception If channel is not active
     */
    private function validateChannelActive(string $channel): void
    {
        if (!$this->isChannelActive($channel)) {
            throw new Exception("Payment channel '{$channel}' is not currently active. Active channels: " . implode(', ', $this->activeChannels));
        }
    }
    
    /**
     * Validate required fields in data array
     * 
     * @param array $data Data to validate
     * @param array $required Required field names
     * @throws InvalidArgumentException If required fields are missing
     */
    private function validateRequired(array $data, array $required): void
    {
        $missing = array_diff($required, array_keys($data));
        
        if (!empty($missing)) {
            throw new InvalidArgumentException('Missing required fields: ' . implode(', ', $missing));
        }
        
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Field '{$field}' cannot be empty");
            }
        }
    }
    
    /**
     * Make HTTP request to Xendit API
     * 
     * @param string $method HTTP method
     * @param string $endpoint API endpoint
     * @param array $data Request data
     * @return array Response data
     * 
     * @throws Exception If request fails
     */
    private function makeRequest(string $method, string $endpoint, array $data = []): array
    {
        $url = self::BASE_URL . $endpoint;
        
        $response = Http::withBasicAuth($this->apiKey, '')
            ->withHeaders([
                'Content-Type' => 'application/json',
                'User-Agent' => 'ABSteak-Xendit-Service/1.0'
            ])
            ->timeout(30)
            ->{strtolower($method)}($url, $data);
        
        if (!$response->successful()) {
            $error = $response->json('message') ?? 'Unknown error';
            throw new Exception("Xendit API error: {$error} (HTTP {$response->status()})");
        }
        
        return $response->json();
    }
    
    /**
     * Create payment session for card tokenization
     * 
     * @param array $data Session data
     * @return array Session response
     * 
     * @throws Exception If API call fails
     * 
     * @example
     * $session = $xendit->createPaymentSession([
     *     'reference_id' => 'session-' . time(),
     *     'session_type' => 'SAVE',
     *     'amount' => 0,
     *     'currency' => 'IDR',
     *     'country' => 'ID',
     *     'customer' => [
     *         'reference_id' => 'customer-123',
     *         'type' => 'INDIVIDUAL',
     *         'email' => 'customer@example.com',
     *         'mobile_number' => '+6281234567890',
     *         'individual_detail' => [
     *             'given_names' => 'John',
     *             'surname' => 'Doe'
     *         ]
     *     ]
     * ]);
     */
    public function createPaymentSession(array $data): array
    {
        $this->validateChannelActive('CREDIT_CARD');
        $this->validateRequired($data, ['reference_id', 'session_type', 'amount', 'currency', 'country']);
        
        $payload = array_merge([
            'mode' => 'CARDS_SESSION_JS',
            'cards_session_js' => [
                'success_return_url' => config('xendit.channels.credit_card.session_js.success_return_url'),
                'failure_return_url' => config('xendit.channels.credit_card.session_js.failure_return_url'),
            ]
        ], $data);
        
        try {
            $response = $this->makeRequest('POST', '/sessions', $payload);
            
            Log::info('Payment session created', [
                'reference_id' => $data['reference_id'],
                'session_id' => $response['payment_session_id'] ?? null
            ]);
            
            return $this->formatResponse(true, 'Payment session created successfully', $response);
            
        } catch (Exception $e) {
            Log::error('Payment session creation failed', [
                'reference_id' => $data['reference_id'],
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to create payment session: ' . $e->getMessage());
        }
    }
    
    /**
     * Create payment method for card tokenization
     * 
     * @param array $data Payment method data
     * @return array Payment method response
     * 
     * @throws Exception If API call fails
     * 
     * @example
     * $paymentMethod = $xendit->createPaymentMethod([
     *     'type' => 'CARD',
     *     'card' => [
     *         'currency' => 'IDR',
     *         'channel_properties' => [
     *             'success_return_url' => 'https://yoursite.com/success',
     *             'failure_return_url' => 'https://yoursite.com/failure',
     *         ],
     *         'card_information' => [
     *             'card_number' => '4000000000001091',
     *             'expiry_month' => '12',
     *             'expiry_year' => '2030',
     *             'cvv' => '123',
     *             'cardholder_name' => 'John Doe',
     *             'cardholder_email' => 'john@example.com',
     *             'cardholder_phone_number' => '+6281234567890'
     *         ],
     *         'reusability' => 'MULTIPLE_USE'
     *     ]
     * ]);
     */
    public function createPaymentMethod(array $data): array
    {
        $this->validateChannelActive('CREDIT_CARD');
        $this->validateRequired($data, ['type']);
        
        if ($data['type'] === 'CARD') {
            $this->validateRequired($data['card'], ['currency', 'card_information']);
            $this->validateRequired($data['card']['card_information'], [
                'card_number', 'expiry_month', 'expiry_year', 'cvv', 'cardholder_name'
            ]);
        }
        
        try {
            $response = $this->makeRequest('POST', '/payment_methods', $data);
            
            Log::info('Payment method created', [
                'type' => $data['type'],
                'payment_method_id' => $response['id'] ?? null
            ]);
            
            return $this->formatResponse(true, 'Payment method created successfully', $response);
            
        } catch (Exception $e) {
            Log::error('Payment method creation failed', [
                'type' => $data['type'],
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to create payment method: ' . $e->getMessage());
        }
    }
    
    /**
     * Get payment method details
     * 
     * @param string $paymentMethodId Payment method ID
     * @return array Payment method details
     * 
     * @throws Exception If API call fails
     */
    public function getPaymentMethod(string $paymentMethodId): array
    {
        try {
            $response = $this->makeRequest('GET', "/payment_methods/{$paymentMethodId}");
            
            return $this->formatResponse(true, 'Payment method retrieved successfully', $response);
            
        } catch (Exception $e) {
            Log::error('Failed to get payment method', [
                'payment_method_id' => $paymentMethodId,
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to get payment method: ' . $e->getMessage());
        }
    }
    
    /**
     * Create payment request with saved payment method
     * 
     * @param array $data Payment request data
     * @return array Payment request response
     * 
     * @throws Exception If API call fails
     * 
     * @example
     * $payment = $xendit->createPaymentRequest([
     *     'reference_id' => 'payment-' . time(),
     *     'amount' => 100000,
     *     'currency' => 'IDR',
     *     'country' => 'ID',
     *     'payment_method_id' => 'pm-12345',
     *     'description' => 'Order payment'
     * ]);
     */
    public function createPaymentRequest(array $data): array
    {
        $this->validateRequired($data, ['reference_id', 'amount', 'currency', 'country']);
        
        $payload = array_merge([
            'capture_method' => config('xendit.channels.credit_card.capture_method', 'AUTOMATIC'),
        ], $data);
        
        try {
            $response = $this->makeRequest('POST', '/payment_requests', $payload);
            
            Log::info('Payment request created', [
                'reference_id' => $data['reference_id'],
                'amount' => $data['amount'],
                'payment_request_id' => $response['payment_request_id'] ?? null
            ]);
            
            return $this->formatResponse(true, 'Payment request created successfully', $response);
            
        } catch (Exception $e) {
            Log::error('Payment request creation failed', [
                'reference_id' => $data['reference_id'],
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to create payment request: ' . $e->getMessage());
        }
    }
    
    /**
     * Get public key for frontend tokenization
     * 
     * @return string|null Public key
     */
    public function getPublicKey(): ?string
    {
        return $this->publicKey;
    }
    
    /**
     * Create single payment link
     * 
     * @param array $data Payment link data
     * @return array Payment link response with URL
     * 
     * @throws Exception If API call fails
     * 
     * @example
     * $result = $xendit->createPaymentLink([
     *     'external_id' => 'payment-link-123',
     *     'amount' => 100000,
     *     'description' => 'Order Payment',
     *     'items' => [
     *         [
     *             'name' => 'Air Conditioner',
     *             'quantity' => 1,
     *             'price' => 100000,
     *             'category' => 'Electronic',
     *             'url' => 'https://yourcompany.com/example_item'
     *         ]
     *     ]
     * ]);
     */
    public function createPaymentLink(array $data): array
    {
        $this->validateRequired($data, ['external_id', 'amount']);
        
        $payload = array_merge([
            'description' => 'Payment for order ' . $data['external_id'],
            'invoice_duration' => 86400, // 24 hours
            'success_redirect_url' => config('app.url') . '/payment/success',
            'failure_redirect_url' => config('app.url') . '/payment/failed',
        ], $data);
        
        try {
            $response = $this->makeRequest('POST', '/v2/invoices', $payload);
            
            Log::info('Payment link created', [
                'external_id' => $data['external_id'],
                'amount' => $data['amount'],
                'invoice_id' => $response['id'] ?? null,
                'invoice_url' => $response['invoice_url'] ?? null
            ]);
            
            return $this->formatResponse(true, 'Payment link created successfully', [
                'payment_url' => $response['invoice_url'] ?? null,
                'invoice_id' => $response['id'] ?? null,
                'external_id' => $response['external_id'] ?? null,
                'amount' => $response['amount'] ?? null,
                'status' => $response['status'] ?? null,
                'expiry_date' => $response['expiry_date'] ?? null
            ]);
            
        } catch (Exception $e) {
            Log::error('Payment link creation failed', [
                'external_id' => $data['external_id'],
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to create payment link: ' . $e->getMessage());
        }
    }
    
    /**
     * Create multiple payment links in batch
     * 
     * @param array $paymentLinks Array of payment link data
     * @return array Batch payment links response with URLs
     * 
     * @throws Exception If any API call fails
     * 
     * @example
     * $result = $xendit->createBatchPaymentLinks([
     *     [
     *         'external_id' => 'batch-payment-1',
     *         'amount' => 50000,
     *         'description' => 'Invoice #001',
     *         'customer_email' => 'customer1@example.com'
     *     ],
     *     [
     *         'external_id' => 'batch-payment-2',
     *         'amount' => 75000,
     *         'description' => 'Invoice #002',
     *         'customer_email' => 'customer2@example.com'
     *     ]
     * ]);
     */
    public function createBatchPaymentLinks(array $paymentLinks): array
    {
        if (empty($paymentLinks)) {
            throw new InvalidArgumentException('Payment links array cannot be empty');
        }
        
        $results = [];
        $errors = [];
        
        foreach ($paymentLinks as $index => $linkData) {
            try {
                $result = $this->createPaymentLink($linkData);
                $results[] = $result['data'];
            } catch (Exception $e) {
                $errors[] = [
                    'index' => $index,
                    'external_id' => $linkData['external_id'] ?? 'unknown',
                    'error' => $e->getMessage()
                ];
                
                Log::error('Batch payment link creation failed for item', [
                    'index' => $index,
                    'external_id' => $linkData['external_id'] ?? 'unknown',
                    'error' => $e->getMessage()
                ]);
            }
        }
        
        $success = empty($errors);
        $message = $success 
            ? 'All payment links created successfully'
            : sprintf('%d of %d payment links created successfully', count($results), count($paymentLinks));
        
        return $this->formatResponse($success, $message, [
            'created_links' => $results,
            'errors' => $errors,
            'total_requested' => count($paymentLinks),
            'total_created' => count($results),
            'total_failed' => count($errors)
        ]);
    }
    
    /**
     * Get payment link details
     * 
     * @param string $invoiceId Invoice ID from Xendit
     * @return array Payment link details
     * 
     * @throws Exception If API call fails
     * 
     * @example
     * $details = $xendit->getPaymentLink('invoice_12345');
     */
    public function getPaymentLink(string $invoiceId): array
    {
        try {
            $response = $this->makeRequest('GET', "/v2/invoices/{$invoiceId}");
            
            return $this->formatResponse(true, 'Payment link details retrieved successfully', [
                'payment_url' => $response['invoice_url'] ?? null,
                'invoice_id' => $response['id'] ?? null,
                'external_id' => $response['external_id'] ?? null,
                'amount' => $response['amount'] ?? null,
                'status' => $response['status'] ?? null,
                'expiry_date' => $response['expiry_date'] ?? null,
                'paid_amount' => $response['paid_amount'] ?? null,
                'payment_method' => $response['payment_method'] ?? null,
                'payment_channel' => $response['payment_channel'] ?? null,
                'payment_destination' => $response['payment_destination'] ?? null
            ]);
            
        } catch (Exception $e) {
            Log::error('Failed to get payment link details', [
                'invoice_id' => $invoiceId,
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to get payment link details: ' . $e->getMessage());
        }
    }
    
    /**
     * Expire payment link
     * 
     * @param string $invoiceId Invoice ID from Xendit
     * @return array Expiration response
     * 
     * @throws Exception If API call fails
     * 
     * @example
     * $result = $xendit->expirePaymentLink('invoice_12345');
     */
    public function expirePaymentLink(string $invoiceId): array
    {
        try {
            $response = $this->makeRequest('POST', "/invoices/{$invoiceId}/expire!");
            
            Log::info('Payment link expired', [
                'invoice_id' => $invoiceId,
                'status' => $response['status'] ?? null
            ]);
            
            return $this->formatResponse(true, 'Payment link expired successfully', $response);
            
        } catch (Exception $e) {
            Log::error('Failed to expire payment link', [
                'invoice_id' => $invoiceId,
                'error' => $e->getMessage()
            ]);
            
            throw new Exception('Failed to expire payment link: ' . $e->getMessage());
        }
    }
    
    /**
     * Format consistent response structure
     * 
     * @param bool $success Whether the operation was successful
     * @param string $message Response message
     * @param array $data Response data
     * @return array Formatted response
     */
    private function formatResponse(bool $success, string $message, array $data = []): array
    {
        return [
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'timestamp' => now()->toISOString()
        ];
    }
}

/**
 * Usage Examples:
 * 
 * 1. Basic QRIS Payment:
 * ```php
 * $xendit = new Xendit();
 * 
 * try {
 *     $result = $xendit->createQrisPayment([
 *         'external_id' => 'order-' . time(),
 *         'amount' => 50000,
 *         'qr_code_type' => 'DYNAMIC'
 *     ]);
 *     
 *     if ($result['success']) {
 *         $qrCodeUrl = $result['data']['qr_string'];
 *         // Display QR code to user
 *     }
 * } catch (Exception $e) {
 *     // Handle error
 *     Log::error('Payment failed: ' . $e->getMessage());
 * }
 * ```
 * 
 * 2. Virtual Account with BCA:
 * ```php
 * $result = $xendit->createVirtualAccount([
 *     'external_id' => 'va-order-' . time(),
 *     'bank_code' => 'BCA',
 *     'name' => 'Customer Name',
 *     'expected_amount' => 100000,
 *     'expiration_date' => now()->addDays(1)->toISOString()
 * ]);
 * 
 * if ($result['success']) {
 *     $accountNumber = $result['data']['account_number'];
 *     // Show account number to user
 * }
 * ```
 * 
 * 3. OVO E-Wallet Payment:
 * ```php
 * $result = $xendit->createEWalletPayment([
 *     'external_id' => 'ovo-order-' . time(),
 *     'amount' => 75000,
 *     'phone' => '08123456789',
 *     'ewallet_type' => 'OVO'
 * ]);
 * 
 * if ($result['success']) {
 *     $redirectUrl = $result['data']['actions']['desktop_web_checkout_url'];
 *     // Redirect user to payment page
 * }
 * ```
 * 
 * 4. Check Payment Status:
 * ```php
 * $status = $xendit->getPaymentStatus('qr_12345', 'QRIS');
 * 
 * if ($status['success']) {
 *     $paymentStatus = $status['data']['status'];
 *     if ($paymentStatus === Xendit::STATUS_PAID) {
 *         // Payment completed
 *     }
 * }
 * ```
 * 
 * 5. Webhook Verification:
 * ```php
 * $rawBody = file_get_contents('php://input');
 * $signature = $_SERVER['HTTP_X_CALLBACK_TOKEN'] ?? '';
 * 
 * if ($xendit->verifyCallback($rawBody, $signature)) {
 *     $webhook = json_decode($rawBody, true);
 *     // Process webhook data
 * } else {
 *     // Invalid webhook
 *     http_response_code(400);
 * }
 * ```
 * 
 * 6. Channel Availability Check:
 * ```php
 * if ($xendit->isChannelActive('QRIS')) {
 *     // Show QRIS payment option
 * } else {
 *     // Hide QRIS option or show alternative
 * }
 * 
 * $activeChannels = $xendit->getActiveChannels();
 * // Display only active payment methods
 * ```
 */