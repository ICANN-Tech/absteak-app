# Xendit Payment Gateway Service Documentation

## Overview

The Xendit Payment Gateway Service is a comprehensive, reusable service for integrating with Xendit payment gateway. It supports multiple payment channels including QRIS, Virtual Account, Credit Card, E-Wallet, and more with dynamic channel activation checking.

**Version:** 1.0.0  
**Author:** ABSteak Development Team  
**Service Location:** `app/Services/Xendit.php`

## Features

### Multi-Channel Payment Support
- **QRIS Payments** - Dynamic QR code generation for instant payments
- **Virtual Account** - Bank transfer payments with major Indonesian banks
- **E-Wallet** - Integration with popular digital wallets
- **Credit Card** - Secure card payment processing
- **Retail Outlet** - Over-the-counter payment options
- **Cardless Credit** - Alternative credit payment methods
- **Direct Debit** - Bank account direct debit payments

### Dynamic Channel Management
- Real-time channel availability checking
- Environment-based channel configuration
- Cached channel status for performance optimization
- Clear error messages for inactive channels

### Security & Compliance
- Webhook signature verification
- Secure API key handling
- Request timeout configuration
- Input validation and sanitization

## Installation & Configuration

### 1. Environment Configuration

Add the following to your `.env` file:

```env
XENDIT_API_KEY=your_xendit_api_key_here
XENDIT_CALLBACK_TOKEN=your_callback_token_here
XENDIT_IS_PRODUCTION=false
```

### 2. Service Configuration

The service automatically loads configuration from `config/xendit.php`. Ensure your configuration includes:

```php
return [
    'api_key' => env('XENDIT_API_KEY'),
    'callback_token' => env('XENDIT_CALLBACK_TOKEN'),
    'is_production' => env('XENDIT_IS_PRODUCTION', false),
    'webhook_url' => env('APP_URL') . '/webhook/xendit',
    'timeout' => 30,
];
```

## Supported Payment Channels

### QRIS (Quick Response Code Indonesian Standard)

**Supported Banks:** All Indonesian banks supporting QRIS  
**Payment Flow:** Generate QR code → Customer scans → Payment completed

```php
$xendit = new Xendit();
$result = $xendit->createQrisPayment([
    'external_id' => 'order-' . time(),
    'amount' => 50000,
    'qr_code_type' => 'DYNAMIC'
]);
```

### Virtual Account

**Supported Banks:**
- BCA (Bank Central Asia)
- BNI (Bank Negara Indonesia)
- BRI (Bank Rakyat Indonesia)
- MANDIRI (Bank Mandiri)
- PERMATA (Bank Permata)
- SAHABAT_SAMPOERNA (Bank Sahabat Sampoerna)

```php
$result = $xendit->createVirtualAccount([
    'external_id' => 'va-order-' . time(),
    'bank_code' => 'BCA',
    'name' => 'Customer Name',
    'expected_amount' => 100000,
    'expiration_date' => now()->addDays(1)->toISOString()
]);
```

### E-Wallet

**Supported Wallets:**
- OVO
- DANA
- LINKAJA
- SHOPEEPAY
- ASTRAPAY

```php
$result = $xendit->createEWalletPayment([
    'external_id' => 'ovo-order-' . time(),
    'amount' => 75000,
    'phone' => '08123456789',
    'ewallet_type' => 'OVO'
]);
```

## API Reference

### Class: `App\Services\Xendit`

#### Constructor

```php
public function __construct(
    ?string $apiKey = null,
    ?string $callbackToken = null,
    bool $isProduction = false
)
```

**Parameters:**
- `$apiKey` - Xendit API key (defaults to config)
- `$callbackToken` - Callback verification token
- `$isProduction` - Whether to use production environment

**Throws:** `InvalidArgumentException` if API key is not provided

#### Payment Methods

##### `createQrisPayment(array $data): array`

Creates a QRIS payment request.

**Required Parameters:**
- `external_id` (string) - Unique payment identifier
- `amount` (int) - Payment amount in IDR

**Optional Parameters:**
- `qr_code_type` (string) - 'DYNAMIC' or 'STATIC' (default: 'DYNAMIC')
- `callback_url` (string) - Webhook URL for payment notifications

**Returns:** Formatted response with QR code data

##### `createVirtualAccount(array $data): array`

Creates a Virtual Account payment request.

**Required Parameters:**
- `external_id` (string) - Unique payment identifier
- `bank_code` (string) - Bank code (see supported banks)
- `name` (string) - Account holder name

**Optional Parameters:**
- `expected_amount` (int) - Expected payment amount
- `expiration_date` (string) - ISO 8601 expiration date
- `is_closed` (bool) - Whether account accepts only expected amount

**Returns:** Formatted response with account number

##### `createEWalletPayment(array $data): array`

Creates an E-Wallet payment request.

**Required Parameters:**
- `external_id` (string) - Unique payment identifier
- `amount` (int) - Payment amount in IDR
- `phone` (string) - Customer phone number
- `ewallet_type` (string) - E-wallet type (see supported wallets)

**Optional Parameters:**
- `callback_url` (string) - Webhook URL for payment notifications

**Returns:** Formatted response with payment URL

#### Status & Verification Methods

##### `getPaymentStatus(string $paymentId, string $channel): array`

Retrieves payment status from Xendit.

**Parameters:**
- `$paymentId` - Payment ID from Xendit
- `$channel` - Payment channel type

**Returns:** Payment status information

##### `verifyCallback(string $rawBody, string $signature): bool`

Verifies webhook callback authenticity.

**Parameters:**
- `$rawBody` - Raw request body
- `$signature` - X-CALLBACK-TOKEN header value

**Returns:** Boolean indicating callback validity

#### Channel Management Methods

##### `isChannelActive(string $channel): bool`

Checks if a payment channel is currently active.

##### `getActiveChannels(): array`

Returns list of all active payment channels.

##### `refreshActiveChannels(): void`

Refreshes active channels cache.

## Payment Status Constants

```php
Xendit::STATUS_PENDING  // 'PENDING'
Xendit::STATUS_PAID     // 'PAID'
Xendit::STATUS_EXPIRED  // 'EXPIRED'
Xendit::STATUS_FAILED   // 'FAILED'
```

## Response Format

All service methods return a consistent response format:

```php
[
    'success' => true|false,
    'message' => 'Descriptive message',
    'data' => [...], // API response data
    'timestamp' => '2024-01-15T10:30:00.000Z'
]
```

## Error Handling

### Exception Types

- `InvalidArgumentException` - Invalid input parameters
- `Exception` - API errors, network issues, or service failures

### Common Error Scenarios

1. **Missing Required Fields**
   ```php
   // Throws: InvalidArgumentException
   $xendit->createQrisPayment(['external_id' => 'test']); // Missing 'amount'
   ```

2. **Invalid Bank Code**
   ```php
   // Throws: InvalidArgumentException
   $xendit->createVirtualAccount([
       'external_id' => 'test',
       'bank_code' => 'INVALID_BANK', // Not in supported list
       'name' => 'Test'
   ]);
   ```

3. **Channel Not Active**
   ```php
   // Throws: Exception
   // When QRIS is not available in current environment
   $xendit->createQrisPayment([...]);
   ```

4. **API Errors**
   ```php
   // Throws: Exception with Xendit API error message
   // When API key is invalid or request fails
   ```

## Webhook Integration

### Setting Up Webhooks

1. Configure webhook URL in Xendit dashboard
2. Set callback token in environment variables
3. Create webhook endpoint in your application

### Webhook Verification Example

```php
// In your webhook controller
public function handleXenditWebhook(Request $request)
{
    $rawBody = $request->getContent();
    $signature = $request->header('X-CALLBACK-TOKEN');
    
    $xendit = new Xendit();
    
    if (!$xendit->verifyCallback($rawBody, $signature)) {
        return response('Invalid signature', 400);
    }
    
    $webhook = json_decode($rawBody, true);
    
    // Process webhook data
    switch ($webhook['event']) {
        case 'payment.paid':
            // Handle successful payment
            break;
        case 'payment.expired':
            // Handle expired payment
            break;
    }
    
    return response('OK', 200);
}
```

## Testing

### Unit Tests

Comprehensive unit tests are available at `tests/Unit/Services/XenditTest.php`.

Run tests with:
```bash
php artisan test tests/Unit/Services/XenditTest.php
```

### Test Coverage

- ✅ Payment creation for all channels
- ✅ Input validation and error handling
- ✅ Channel activation checking
- ✅ Webhook verification
- ✅ API failure scenarios
- ✅ Response formatting consistency

## Performance Optimization

### Caching

- Active channels are cached for 1 hour
- Cache key: `xendit_active_channels`
- Automatic cache refresh on service initialization

### HTTP Configuration

- Request timeout: 30 seconds
- User-Agent: `ABSteak-Xendit-Service/1.0`
- Content-Type: `application/json`

## Security Best Practices

1. **API Key Security**
   - Store API keys in environment variables
   - Never commit API keys to version control
   - Use different keys for development and production

2. **Webhook Security**
   - Always verify webhook signatures
   - Use HTTPS for webhook endpoints
   - Implement rate limiting on webhook endpoints

3. **Input Validation**
   - All inputs are validated before API calls
   - Sanitization prevents injection attacks
   - Type checking ensures data integrity

## Troubleshooting

### Common Issues

1. **"API key is required" Error**
   - Check `.env` file for `XENDIT_API_KEY`
   - Verify configuration in `config/xendit.php`

2. **"Channel not active" Error**
   - Check if channel is enabled in Xendit dashboard
   - Verify environment configuration
   - Try refreshing active channels cache

3. **Webhook Verification Fails**
   - Ensure callback token is correctly configured
   - Check webhook URL in Xendit dashboard
   - Verify request headers are properly forwarded

### Debug Mode

Enable detailed logging by setting log level to `debug` in `config/logging.php`:

```php
'level' => 'debug',
```

## Migration Guide

### From Direct API Calls

**Before:**
```php
$response = Http::withBasicAuth($apiKey, '')
    ->post('https://api.xendit.co/qr_codes', $data);
```

**After:**
```php
$xendit = new Xendit();
$result = $xendit->createQrisPayment($data);
```

### Benefits of Migration

- ✅ Consistent error handling
- ✅ Input validation
- ✅ Response formatting
- ✅ Channel availability checking
- ✅ Comprehensive logging
- ✅ Unit test coverage

## Support

For issues related to:
- **Service Implementation:** Contact ABSteak Development Team
- **Xendit API:** Refer to [Xendit Documentation](https://developers.xendit.co/)
- **Payment Issues:** Check Xendit Dashboard or contact Xendit Support

## Changelog

### Version 1.0.0 (Current)
- Initial release with multi-channel support
- QRIS, Virtual Account, and E-Wallet implementations
- Dynamic channel activation checking
- Comprehensive error handling and logging
- Unit test coverage
- Webhook verification
- Performance optimization with caching

---

*Last Updated: January 2024*  
*Documentation Version: 1.0.0*