<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Xendit Payment Gateway Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for Xendit payment gateway integration.
    | All sensitive values should be stored in environment variables for security.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | API Configuration
    |--------------------------------------------------------------------------
    |
    | These settings control the basic API connection to Xendit services.
    | The API key is required for all operations and should be kept secure.
    |
    */

    'api_key' => env('XENDIT_API_KEY'),

    'public_key' => env('XENDIT_PUBLIC_KEY'),

    'callback_token' => env('XENDIT_CALLBACK_TOKEN'),

    'is_production' => env('XENDIT_IS_PRODUCTION', false),

    /*
    |--------------------------------------------------------------------------
    | API Endpoints
    |--------------------------------------------------------------------------
    |
    | Base URLs for Xendit API endpoints. These are automatically selected
    | based on the environment (production/sandbox).
    |
    */

    'base_url' => [
        'production' => 'https://api.xendit.co',
        'sandbox' => 'https://api.xendit.co', // Xendit uses same URL for both
    ],

    /*
    |--------------------------------------------------------------------------
    | Webhook Configuration
    |--------------------------------------------------------------------------
    |
    | Settings for handling webhook callbacks from Xendit.
    | The webhook URL should be publicly accessible and use HTTPS in production.
    |
    */

    'webhook' => [
        'url' => env('XENDIT_WEBHOOK_URL', env('APP_URL') . '/webhook/xendit'),
        'verify_signature' => env('XENDIT_VERIFY_SIGNATURE', true),
        'timeout' => env('XENDIT_WEBHOOK_TIMEOUT', 30), // seconds
    ],

    /*
    |--------------------------------------------------------------------------
    | HTTP Client Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for HTTP requests to Xendit API.
    | Adjust timeouts based on your application's requirements.
    |
    */

    'http' => [
        'timeout' => env('XENDIT_HTTP_TIMEOUT', 30), // seconds
        'connect_timeout' => env('XENDIT_CONNECT_TIMEOUT', 10), // seconds
        'retry_attempts' => env('XENDIT_RETRY_ATTEMPTS', 3),
        'retry_delay' => env('XENDIT_RETRY_DELAY', 1000), // milliseconds
        'user_agent' => env('XENDIT_USER_AGENT', 'ABSteak-Xendit-Service/1.0'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Payment Channels Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for different payment channels supported by Xendit.
    | You can enable/disable channels based on your business requirements.
    |
    */

    'channels' => [
        'qris' => [
            'enabled' => env('XENDIT_QRIS_ENABLED', true),
            'default_type' => env('XENDIT_QRIS_DEFAULT_TYPE', 'DYNAMIC'),
            'expiration_minutes' => env('XENDIT_QRIS_EXPIRATION', 60),
        ],

        'virtual_account' => [
            'enabled' => env('XENDIT_VA_ENABLED', true),
            'supported_banks' => [
                'BCA',
                'BNI',
                'BRI',
                'MANDIRI',
                'PERMATA',
                'SAHABAT_SAMPOERNA',
            ],
            'default_expiration_hours' => env('XENDIT_VA_EXPIRATION_HOURS', 24),
            'is_closed_default' => env('XENDIT_VA_IS_CLOSED_DEFAULT', true),
        ],

        'ewallet' => [
            'enabled' => env('XENDIT_EWALLET_ENABLED', true),
            'supported_types' => [
                'OVO',
                'DANA',
                'LINKAJA',
                'SHOPEEPAY',
                'ASTRAPAY',
            ],
            'default_expiration_minutes' => env('XENDIT_EWALLET_EXPIRATION', 60),
        ],

        'credit_card' => [
            'enabled' => env('XENDIT_CC_ENABLED', false),
            'capture_method' => env('XENDIT_CC_CAPTURE_METHOD', 'AUTOMATIC'),
            'currency' => env('XENDIT_CC_CURRENCY', 'IDR'),
            'tokenization' => [
                'enabled' => env('XENDIT_CC_TOKENIZATION_ENABLED', true),
                'save_card_default' => env('XENDIT_CC_SAVE_CARD_DEFAULT', false),
                'skip_three_ds' => env('XENDIT_CC_SKIP_3DS', false),
            ],
            'session_js' => [
                'success_return_url' => env('XENDIT_CC_SUCCESS_URL', env('APP_URL') . '/payment/success'),
                'failure_return_url' => env('XENDIT_CC_FAILURE_URL', env('APP_URL') . '/payment/failure'),
            ],
        ],

        'retail_outlet' => [
            'enabled' => env('XENDIT_RETAIL_ENABLED', false),
            'supported_outlets' => [
                'ALFAMART',
                'INDOMARET',
            ],
            'default_expiration_hours' => env('XENDIT_RETAIL_EXPIRATION_HOURS', 72),
        ],

        'cardless_credit' => [
            'enabled' => env('XENDIT_CARDLESS_ENABLED', false),
            'supported_types' => [
                'KREDIVO',
            ],
        ],

        'direct_debit' => [
            'enabled' => env('XENDIT_DIRECT_DEBIT_ENABLED', false),
            'supported_channels' => [
                'BRI',
                'MANDIRI',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Caching Configuration
    |--------------------------------------------------------------------------
    |
    | Settings for caching active channels and other frequently accessed data.
    | Caching improves performance by reducing API calls to Xendit.
    |
    */

    'cache' => [
        'enabled' => env('XENDIT_CACHE_ENABLED', true),
        'ttl' => env('XENDIT_CACHE_TTL', 3600), // 1 hour in seconds
        'prefix' => env('XENDIT_CACHE_PREFIX', 'xendit'),
        'store' => env('XENDIT_CACHE_STORE', 'default'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Logging Configuration
    |--------------------------------------------------------------------------
    |
    | Configure logging for Xendit service operations.
    | Useful for debugging and monitoring payment transactions.
    |
    */

    'logging' => [
        'enabled' => env('XENDIT_LOGGING_ENABLED', true),
        'channel' => env('XENDIT_LOG_CHANNEL', 'stack'),
        'level' => env('XENDIT_LOG_LEVEL', 'info'),
        'log_requests' => env('XENDIT_LOG_REQUESTS', false),
        'log_responses' => env('XENDIT_LOG_RESPONSES', false),
        'mask_sensitive_data' => env('XENDIT_MASK_SENSITIVE_DATA', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Configuration
    |--------------------------------------------------------------------------
    |
    | Security-related settings for Xendit integration.
    | These settings help protect against common security vulnerabilities.
    |
    */

    'security' => [
        'validate_ssl' => env('XENDIT_VALIDATE_SSL', true),
        'allowed_ips' => env('XENDIT_ALLOWED_IPS', null), // Comma-separated IPs
        'rate_limit' => [
            'enabled' => env('XENDIT_RATE_LIMIT_ENABLED', true),
            'max_attempts' => env('XENDIT_RATE_LIMIT_MAX_ATTEMPTS', 60),
            'decay_minutes' => env('XENDIT_RATE_LIMIT_DECAY_MINUTES', 1),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Development & Testing Configuration
    |--------------------------------------------------------------------------
    |
    | Settings specific to development and testing environments.
    | These should not be used in production.
    |
    */

    'development' => [
        'mock_responses' => env('XENDIT_MOCK_RESPONSES', false),
        'debug_mode' => env('XENDIT_DEBUG_MODE', false),
        'test_mode' => env('XENDIT_TEST_MODE', false),
        'fake_payments' => env('XENDIT_FAKE_PAYMENTS', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Business Configuration
    |--------------------------------------------------------------------------
    |
    | Business-specific settings for payment processing.
    | Customize these based on your business requirements.
    |
    */

    'business' => [
        'default_currency' => env('XENDIT_DEFAULT_CURRENCY', 'IDR'),
        'minimum_amount' => env('XENDIT_MINIMUM_AMOUNT', 1000), // IDR
        'maximum_amount' => env('XENDIT_MAXIMUM_AMOUNT', 50000000), // IDR
        'fee_calculation' => env('XENDIT_FEE_CALCULATION', 'exclude'), // include|exclude
        'auto_capture' => env('XENDIT_AUTO_CAPTURE', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Notification Configuration
    |--------------------------------------------------------------------------
    |
    | Settings for handling payment notifications and status updates.
    | Configure how your application responds to payment events.
    |
    */

    'notifications' => [
        'enabled' => env('XENDIT_NOTIFICATIONS_ENABLED', true),
        'channels' => [
            'email' => env('XENDIT_NOTIFY_EMAIL', true),
            'sms' => env('XENDIT_NOTIFY_SMS', false),
            'webhook' => env('XENDIT_NOTIFY_WEBHOOK', true),
        ],
        'events' => [
            'payment_paid' => env('XENDIT_NOTIFY_PAYMENT_PAID', true),
            'payment_expired' => env('XENDIT_NOTIFY_PAYMENT_EXPIRED', true),
            'payment_failed' => env('XENDIT_NOTIFY_PAYMENT_FAILED', true),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Feature Flags
    |--------------------------------------------------------------------------
    |
    | Feature flags for enabling/disabling specific functionality.
    | Useful for gradual rollouts and A/B testing.
    |
    */

    'features' => [
        'dynamic_channel_checking' => env('XENDIT_FEATURE_DYNAMIC_CHANNELS', true),
        'automatic_retry' => env('XENDIT_FEATURE_AUTO_RETRY', true),
        'webhook_verification' => env('XENDIT_FEATURE_WEBHOOK_VERIFY', true),
        'response_caching' => env('XENDIT_FEATURE_RESPONSE_CACHE', true),
        'metrics_collection' => env('XENDIT_FEATURE_METRICS', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring & Metrics
    |--------------------------------------------------------------------------
    |
    | Configuration for monitoring payment performance and collecting metrics.
    | Helps track payment success rates and identify issues.
    |
    */

    'monitoring' => [
        'enabled' => env('XENDIT_MONITORING_ENABLED', false),
        'metrics_endpoint' => env('XENDIT_METRICS_ENDPOINT'),
        'alert_thresholds' => [
            'error_rate' => env('XENDIT_ALERT_ERROR_RATE', 5), // percentage
            'response_time' => env('XENDIT_ALERT_RESPONSE_TIME', 5000), // milliseconds
        ],
    ],
];