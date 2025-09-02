<?php

$url = 'http://localhost:8000/api/chat/initialize';
$data = [
    'user_type' => 'guest',
    'guest_data' => [
        'name' => 'Test User',
        'email' => 'test@example.com'
    ]
];

$options = [
    'http' => [
        'header' => "Content-type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Response: " . $result . "\n";
echo "HTTP Response Headers: " . print_r($http_response_header, true) . "\n";