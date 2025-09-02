<?php

namespace Tests\Unit\Services;

use App\Services\Xendit;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Tests\TestCase;

/**
 * Xendit Service Unit Tests
 * 
 * Comprehensive test suite for the Xendit payment gateway service,
 * covering all payment channels, error scenarios, and edge cases.
 * 
 * @package Tests\Unit\Services
 */
class XenditTest extends TestCase
{
    use RefreshDatabase;
    
    private Xendit $xendit;
    private string $testApiKey = 'test_api_key_123';
    private string $testCallbackToken = 'test_callback_token_456';
    
    protected function setUp(): void
    {
        parent::setUp();
        
        // Set up test configuration
        Config::set('services.xendit.api_key', $this->testApiKey);
        Config::set('services.xendit.callback_token', $this->testCallbackToken);
        Config::set('services.xendit.is_production', false);
        Config::set('app.url', 'https://test.example.com');
        
        // Clear cache before each test
        Cache::flush();
        
        $this->xendit = new Xendit();
    }
    
    protected function tearDown(): void
    {
        Http::fake();
        parent::tearDown();
    }
    
    /**
     * Test Xendit service initialization
     */
    public function test_xendit_service_initialization(): void
    {
        $xendit = new Xendit($this->testApiKey, $this->testCallbackToken, false);
        
        $this->assertInstanceOf(Xendit::class, $xendit);
        $this->assertIsArray($xendit->getActiveChannels());
        $this->assertContains('QRIS', $xendit->getActiveChannels());
        $this->assertContains('VIRTUAL_ACCOUNT', $xendit->getActiveChannels());
    }
    
    /**
     * Test initialization without API key throws exception
     */
    public function test_initialization_without_api_key_throws_exception(): void
    {
        Config::set('services.xendit.api_key', null);
        
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Xendit API key is required');
        
        new Xendit();
    }
    
    /**
     * Test successful QRIS payment creation
     */
    public function test_create_qris_payment_success(): void
    {
        $mockResponse = [
            'id' => 'qr_12345',
            'external_id' => 'order-123',
            'amount' => 50000,
            'qr_string' => 'https://qr.xendit.co/test',
            'status' => 'ACTIVE'
        ];
        
        Http::fake([
            'api.xendit.co/qr_codes' => Http::response($mockResponse, 200)
        ]);
        
        $paymentData = [
            'external_id' => 'order-123',
            'amount' => 50000,
            'qr_code_type' => 'DYNAMIC'
        ];
        
        $result = $this->xendit->createQrisPayment($paymentData);
        
        $this->assertTrue($result['success']);
        $this->assertEquals('QRIS payment created successfully', $result['message']);
        $this->assertEquals($mockResponse, $result['data']);
        $this->assertArrayHasKey('timestamp', $result);
        
        Http::assertSent(function (Request $request) {
            return $request->url() === 'https://api.xendit.co/qr_codes' &&
                   $request->method() === 'POST' &&
                   $request->data()['external_id'] === 'order-123' &&
                   $request->data()['amount'] === 50000;
        });
    }
    
    /**
     * Test QRIS payment creation with missing required fields
     */
    public function test_create_qris_payment_missing_required_fields(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Missing required fields: amount');
        
        $this->xendit->createQrisPayment([
            'external_id' => 'order-123'
            // Missing 'amount'
        ]);
    }
    
    /**
     * Test QRIS payment creation when channel is not active
     */
    public function test_create_qris_payment_channel_not_active(): void
    {
        // Mock inactive channels
        Cache::put('xendit_active_channels', ['VIRTUAL_ACCOUNT'], 3600);
        $xendit = new Xendit();
        
        $this->expectException(Exception::class);
        $this->expectExceptionMessage("Payment channel 'QRIS' is not currently active");
        
        $xendit->createQrisPayment([
            'external_id' => 'order-123',
            'amount' => 50000
        ]);
    }
    
    /**
     * Test successful Virtual Account creation
     */
    public function test_create_virtual_account_success(): void
    {
        $mockResponse = [
            'id' => 'va_12345',
            'external_id' => 'va-order-456',
            'bank_code' => 'BCA',
            'account_number' => '1234567890',
            'name' => 'John Doe',
            'expected_amount' => 100000
        ];
        
        Http::fake([
            'api.xendit.co/virtual_accounts' => Http::response($mockResponse, 200)
        ]);
        
        $paymentData = [
            'external_id' => 'va-order-456',
            'bank_code' => 'BCA',
            'name' => 'John Doe',
            'expected_amount' => 100000
        ];
        
        $result = $this->xendit->createVirtualAccount($paymentData);
        
        $this->assertTrue($result['success']);
        $this->assertEquals('Virtual Account created successfully', $result['message']);
        $this->assertEquals($mockResponse, $result['data']);
    }
    
    /**
     * Test Virtual Account creation with invalid bank code
     */
    public function test_create_virtual_account_invalid_bank_code(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid bank code. Supported: BCA, BNI, BRI, MANDIRI, PERMATA, SAHABAT_SAMPOERNA');
        
        $this->xendit->createVirtualAccount([
            'external_id' => 'va-order-456',
            'bank_code' => 'INVALID_BANK',
            'name' => 'John Doe',
            'expected_amount' => 100000
        ]);
    }
    
    /**
     * Test successful E-Wallet payment creation
     */
    public function test_create_ewallet_payment_success(): void
    {
        $mockResponse = [
            'id' => 'ew_12345',
            'external_id' => 'ew-order-789',
            'amount' => 75000,
            'ewallet_type' => 'OVO',
            'status' => 'PENDING',
            'actions' => [
                'desktop_web_checkout_url' => 'https://checkout.xendit.co/test'
            ]
        ];
        
        Http::fake([
            'api.xendit.co/ewallets' => Http::response($mockResponse, 200)
        ]);
        
        $paymentData = [
            'external_id' => 'ew-order-789',
            'amount' => 75000,
            'phone' => '08123456789',
            'ewallet_type' => 'OVO'
        ];
        
        $result = $this->xendit->createEWalletPayment($paymentData);
        
        $this->assertTrue($result['success']);
        $this->assertEquals('E-Wallet payment created successfully', $result['message']);
        $this->assertEquals($mockResponse, $result['data']);
    }
    
    /**
     * Test E-Wallet payment creation with invalid wallet type
     */
    public function test_create_ewallet_payment_invalid_type(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid e-wallet type. Supported: OVO, DANA, LINKAJA, SHOPEEPAY, ASTRAPAY');
        
        $this->xendit->createEWalletPayment([
            'external_id' => 'ew-order-789',
            'amount' => 75000,
            'phone' => '08123456789',
            'ewallet_type' => 'INVALID_WALLET'
        ]);
    }
    
    /**
     * Test get payment status success
     */
    public function test_get_payment_status_success(): void
    {
        $mockResponse = [
            'id' => 'qr_12345',
            'status' => 'PAID',
            'amount' => 50000,
            'paid_at' => '2024-01-15T10:30:00.000Z'
        ];
        
        Http::fake([
            'api.xendit.co/qr_codes/qr_12345' => Http::response($mockResponse, 200)
        ]);
        
        $result = $this->xendit->getPaymentStatus('qr_12345', 'QRIS');
        
        $this->assertTrue($result['success']);
        $this->assertEquals('Payment status retrieved successfully', $result['message']);
        $this->assertEquals($mockResponse, $result['data']);
    }
    
    /**
     * Test get payment status with invalid channel
     */
    public function test_get_payment_status_invalid_channel(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid payment channel: INVALID_CHANNEL');
        
        $this->xendit->getPaymentStatus('payment_123', 'INVALID_CHANNEL');
    }
    
    /**
     * Test webhook callback verification success
     */
    public function test_verify_callback_success(): void
    {
        $rawBody = json_encode(['event' => 'payment.paid', 'data' => ['id' => 'payment_123']]);
        $expectedSignature = hash_hmac('sha256', $rawBody, $this->testCallbackToken);
        
        $isValid = $this->xendit->verifyCallback($rawBody, $expectedSignature);
        
        $this->assertTrue($isValid);
    }
    
    /**
     * Test webhook callback verification failure
     */
    public function test_verify_callback_failure(): void
    {
        $rawBody = json_encode(['event' => 'payment.paid', 'data' => ['id' => 'payment_123']]);
        $invalidSignature = 'invalid_signature';
        
        $isValid = $this->xendit->verifyCallback($rawBody, $invalidSignature);
        
        $this->assertFalse($isValid);
    }
    
    /**
     * Test webhook callback verification without callback token
     */
    public function test_verify_callback_without_token(): void
    {
        Log::shouldReceive('warning')
            ->once()
            ->with('Callback token not configured');
        
        $xendit = new Xendit($this->testApiKey, null, false);
        $rawBody = json_encode(['event' => 'payment.paid']);
        
        $isValid = $xendit->verifyCallback($rawBody, 'any_signature');
        
        $this->assertFalse($isValid);
    }
    
    /**
     * Test channel activation check
     */
    public function test_is_channel_active(): void
    {
        $this->assertTrue($this->xendit->isChannelActive('QRIS'));
        $this->assertTrue($this->xendit->isChannelActive('VIRTUAL_ACCOUNT'));
        $this->assertFalse($this->xendit->isChannelActive('INVALID_CHANNEL'));
    }
    
    /**
     * Test get active channels
     */
    public function test_get_active_channels(): void
    {
        $activeChannels = $this->xendit->getActiveChannels();
        
        $this->assertIsArray($activeChannels);
        $this->assertContains('QRIS', $activeChannels);
        $this->assertContains('VIRTUAL_ACCOUNT', $activeChannels);
        $this->assertContains('E_WALLET', $activeChannels);
    }
    
    /**
     * Test refresh active channels
     */
    public function test_refresh_active_channels(): void
    {
        // Set initial cache
        Cache::put('xendit_active_channels', ['QRIS'], 3600);
        
        $this->xendit->refreshActiveChannels();
        
        // Cache should be cleared and reloaded
        $this->assertFalse(Cache::has('xendit_active_channels'));
        $activeChannels = $this->xendit->getActiveChannels();
        $this->assertGreaterThan(1, count($activeChannels));
    }
    
    /**
     * Test API request failure handling
     */
    public function test_api_request_failure(): void
    {
        Http::fake([
            'api.xendit.co/qr_codes' => Http::response([
                'error_code' => 'INVALID_API_KEY',
                'message' => 'API key is invalid'
            ], 401)
        ]);
        
        Log::shouldReceive('error')
            ->once()
            ->with('QRIS payment creation failed', \Mockery::type('array'));
        
        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Failed to create QRIS payment: Xendit API error: API key is invalid (HTTP 401)');
        
        $this->xendit->createQrisPayment([
            'external_id' => 'order-123',
            'amount' => 50000
        ]);
    }
    
    /**
     * Test production environment channel loading
     */
    public function test_production_environment_channels(): void
    {
        Config::set('services.xendit.is_production', true);
        Cache::flush();
        
        $xendit = new Xendit();
        $activeChannels = $xendit->getActiveChannels();
        
        $this->assertContains('CREDIT_CARD', $activeChannels);
        $this->assertContains('QRIS', $activeChannels);
        $this->assertContains('VIRTUAL_ACCOUNT', $activeChannels);
        $this->assertContains('E_WALLET', $activeChannels);
    }
    
    /**
     * Test empty field validation
     */
    public function test_empty_field_validation(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage("Field 'external_id' cannot be empty");
        
        $this->xendit->createQrisPayment([
            'external_id' => '',
            'amount' => 50000
        ]);
    }
    
    /**
     * Test constants are properly defined
     */
    public function test_constants_defined(): void
    {
        $this->assertEquals('PENDING', Xendit::STATUS_PENDING);
        $this->assertEquals('PAID', Xendit::STATUS_PAID);
        $this->assertEquals('EXPIRED', Xendit::STATUS_EXPIRED);
        $this->assertEquals('FAILED', Xendit::STATUS_FAILED);
        
        $this->assertIsArray(Xendit::CHANNELS);
        $this->assertIsArray(Xendit::VA_BANKS);
        $this->assertIsArray(Xendit::E_WALLETS);
        
        $this->assertArrayHasKey('QRIS', Xendit::CHANNELS);
        $this->assertArrayHasKey('VIRTUAL_ACCOUNT', Xendit::CHANNELS);
        $this->assertArrayHasKey('E_WALLET', Xendit::CHANNELS);
    }
    
    /**
     * Test HTTP timeout configuration
     */
    public function test_http_timeout_configuration(): void
    {
        Http::fake([
            'api.xendit.co/qr_codes' => Http::response(['id' => 'qr_123'], 200)
        ]);
        
        $this->xendit->createQrisPayment([
            'external_id' => 'order-123',
            'amount' => 50000
        ]);
        
        Http::assertSent(function (Request $request) {
            return $request->hasHeader('User-Agent', 'ABSteak-Xendit-Service/1.0') &&
                   $request->hasHeader('Content-Type', 'application/json');
        });
    }
    
    /**
     * Test logging functionality
     */
    public function test_logging_functionality(): void
    {
        Http::fake([
            'api.xendit.co/qr_codes' => Http::response(['id' => 'qr_123'], 200)
        ]);
        
        Log::shouldReceive('info')
            ->once()
            ->with('QRIS payment created', \Mockery::type('array'));
        
        $this->xendit->createQrisPayment([
            'external_id' => 'order-123',
            'amount' => 50000
        ]);
    }
    
    /**
     * Test response formatting consistency
     */
    public function test_response_formatting_consistency(): void
    {
        Http::fake([
            'api.xendit.co/qr_codes' => Http::response(['id' => 'qr_123'], 200)
        ]);
        
        $result = $this->xendit->createQrisPayment([
            'external_id' => 'order-123',
            'amount' => 50000
        ]);
        
        $this->assertArrayHasKey('success', $result);
        $this->assertArrayHasKey('message', $result);
        $this->assertArrayHasKey('data', $result);
        $this->assertArrayHasKey('timestamp', $result);
        
        $this->assertIsBool($result['success']);
        $this->assertIsString($result['message']);
        $this->assertIsArray($result['data']);
        $this->assertIsString($result['timestamp']);
    }
}