<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Chatwoot Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Chatwoot chat system integration
    | Replaces the old ejabberd XMPP server setup
    |
    */

    'chatwoot_url' => env('CHATWOOT_URL', 'http://localhost:3002'),
    'chatwoot_api_token' => env('CHATWOOT_API_ACCESS_TOKEN', ''),
    'chatwoot_account_id' => env('CHATWOOT_ACCOUNT_ID', '1'),
    'chatwoot_inbox_id' => env('CHATWOOT_INBOX_ID', '1'),
    'chatwoot_webhook_secret' => env('CHATWOOT_WEBHOOK_SECRET', ''),

    /*
    |--------------------------------------------------------------------------
    | Chat Settings
    |--------------------------------------------------------------------------
    |
    | General chat application settings
    |
    */

    'guest_prefix' => env('CHAT_GUEST_PREFIX', 'guest_'),
    'customer_service_group' => env('CHAT_CS_GROUP', 'customer_service'),
    'default_room' => env('CHAT_DEFAULT_ROOM', 'support'),
    
    /*
    |--------------------------------------------------------------------------
    | Widget Configuration
    |--------------------------------------------------------------------------
    |
    | Chatwoot widget settings for frontend
    |
    */

    'widget_url' => env('CHATWOOT_WIDGET_URL', 'http://localhost:3002/packs/js/sdk.js'),
    'widget_position' => env('CHATWOOT_WIDGET_POSITION', 'right'),

    /*
    |--------------------------------------------------------------------------
    | Chat Features
    |--------------------------------------------------------------------------
    |
    | Enable/disable specific chat features
    |
    */

    'allow_guest_chat' => env('CHAT_ALLOW_GUEST', true),
    'auto_assign_cs' => env('CHAT_AUTO_ASSIGN_CS', true),
    'max_concurrent_chats' => env('CHAT_MAX_CONCURRENT', 5),
    'chat_timeout' => env('CHAT_TIMEOUT', 1800), // 30 minutes
];