<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Chatwoot API Routes
|--------------------------------------------------------------------------
|
| Here are the API routes for Chatwoot integration
|
*/

// Create or get contact
Route::post('/chatwoot/contact', function (Request $request) {
    try {
        $chatwootUrl = config('services.chatwoot.url', 'http://localhost:3002');
        $chatwootToken = config('services.chatwoot.access_token');
        $inboxId = config('services.chatwoot.inbox_id', 1);
        
        if (!$chatwootToken) {
            return response()->json(['error' => 'Chatwoot access token not configured'], 500);
        }
        
        $contactData = [
            'name' => $request->input('name', 'Guest User'),
            'email' => $request->input('email'),
            'phone_number' => $request->input('phone'),
            'inbox_id' => $inboxId
        ];
        
        // Create contact in Chatwoot
        $response = Http::withHeaders([
            'api_access_token' => $chatwootToken,
            'Content-Type' => 'application/json'
        ])->post("{$chatwootUrl}/api/v1/accounts/1/contacts", $contactData);
        
        if ($response->successful()) {
            $contact = $response->json();
            
            // Generate pubsub token for WebSocket
            $pubsubResponse = Http::withHeaders([
                'api_access_token' => $chatwootToken,
                'Content-Type' => 'application/json'
            ])->get("{$chatwootUrl}/api/v1/accounts/1/contacts/{$contact['payload']['contact']['id']}/contact_inboxes");
            
            $pubsubToken = null;
            if ($pubsubResponse->successful()) {
                $contactInboxes = $pubsubResponse->json();
                if (!empty($contactInboxes['payload'])) {
                    $pubsubToken = $contactInboxes['payload'][0]['pubsub_token'] ?? null;
                }
            }
            
            return response()->json([
                'success' => true,
                'contact_id' => $contact['payload']['contact']['id'],
                'pubsub_token' => $pubsubToken,
                'contact' => $contact['payload']['contact']
            ]);
        } else {
            Log::error('Failed to create Chatwoot contact', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);
            
            return response()->json([
                'error' => 'Failed to create contact',
                'details' => $response->json()
            ], $response->status());
        }
        
    } catch (\Exception $e) {
        Log::error('Chatwoot contact creation error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'error' => 'Internal server error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Create conversation
Route::post('/chatwoot/conversation', function (Request $request) {
    try {
        $chatwootUrl = config('services.chatwoot.url', 'http://localhost:3002');
        $chatwootToken = config('services.chatwoot.access_token');
        $inboxId = config('services.chatwoot.inbox_id', 1);
        
        if (!$chatwootToken) {
            return response()->json(['error' => 'Chatwoot access token not configured'], 500);
        }
        
        $contactId = $request->input('contact_id');
        
        if (!$contactId) {
            return response()->json(['error' => 'Contact ID is required'], 400);
        }
        
        $conversationData = [
            'source_id' => "guest_chat_" . time(),
            'inbox_id' => $inboxId,
            'contact_id' => $contactId,
            'status' => 'open'
        ];
        
        // Create conversation in Chatwoot
        $response = Http::withHeaders([
            'api_access_token' => $chatwootToken,
            'Content-Type' => 'application/json'
        ])->post("{$chatwootUrl}/api/v1/accounts/1/conversations", $conversationData);
        
        if ($response->successful()) {
            $conversation = $response->json();
            
            return response()->json([
                'success' => true,
                'conversation_id' => $conversation['id'],
                'conversation' => $conversation
            ]);
        } else {
            Log::error('Failed to create Chatwoot conversation', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);
            
            return response()->json([
                'error' => 'Failed to create conversation',
                'details' => $response->json()
            ], $response->status());
        }
        
    } catch (\Exception $e) {
        Log::error('Chatwoot conversation creation error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'error' => 'Internal server error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Send message
Route::post('/chatwoot/message', function (Request $request) {
    try {
        $chatwootUrl = config('services.chatwoot.url', 'http://localhost:3002');
        $chatwootToken = config('services.chatwoot.access_token');
        
        if (!$chatwootToken) {
            return response()->json(['error' => 'Chatwoot access token not configured'], 500);
        }
        
        $conversationId = $request->input('conversation_id');
        $content = $request->input('content');
        $messageType = $request->input('message_type', 'incoming');
        
        if (!$conversationId || !$content) {
            return response()->json(['error' => 'Conversation ID and content are required'], 400);
        }
        
        $messageData = [
            'content' => $content,
            'message_type' => $messageType,
            'private' => false
        ];
        
        // Send message to Chatwoot
        $response = Http::withHeaders([
            'api_access_token' => $chatwootToken,
            'Content-Type' => 'application/json'
        ])->post("{$chatwootUrl}/api/v1/accounts/1/conversations/{$conversationId}/messages", $messageData);
        
        if ($response->successful()) {
            $message = $response->json();
            
            return response()->json([
                'success' => true,
                'message_id' => $message['id'],
                'message' => $message
            ]);
        } else {
            Log::error('Failed to send Chatwoot message', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);
            
            return response()->json([
                'error' => 'Failed to send message',
                'details' => $response->json()
            ], $response->status());
        }
        
    } catch (\Exception $e) {
        Log::error('Chatwoot message sending error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'error' => 'Internal server error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Get conversations for CS dashboard
Route::get('/chatwoot/conversations', function (Request $request) {
    try {
        $chatwootUrl = config('services.chatwoot.url', 'http://localhost:3002');
        $chatwootToken = config('services.chatwoot.access_token');
        
        if (!$chatwootToken) {
            return response()->json(['error' => 'Chatwoot access token not configured'], 500);
        }
        
        $status = $request->input('status', 'open');
        $inboxId = $request->input('inbox_id');
        
        $queryParams = ['status' => $status];
        if ($inboxId) {
            $queryParams['inbox_id'] = $inboxId;
        }
        
        // Get conversations from Chatwoot
        $response = Http::withHeaders([
            'api_access_token' => $chatwootToken
        ])->get("{$chatwootUrl}/api/v1/accounts/1/conversations", $queryParams);
        
        if ($response->successful()) {
            $conversations = $response->json();
            
            return response()->json([
                'success' => true,
                'conversations' => $conversations['data']['payload'] ?? [],
                'meta' => $conversations['data']['meta'] ?? []
            ]);
        } else {
            Log::error('Failed to fetch Chatwoot conversations', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);
            
            return response()->json([
                'error' => 'Failed to fetch conversations',
                'details' => $response->json()
            ], $response->status());
        }
        
    } catch (\Exception $e) {
        Log::error('Chatwoot conversations fetch error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'error' => 'Internal server error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Get agent pubsub token for WebSocket connection
Route::get('/chatwoot/agent/token', function (Request $request) {
    try {
        $chatwootUrl = config('services.chatwoot.url', 'http://localhost:3002');
        $chatwootToken = config('services.chatwoot.access_token');
        
        if (!$chatwootToken) {
            return response()->json(['error' => 'Chatwoot access token not configured'], 500);
        }
        
        // Get agent info and pubsub token
        $response = Http::withHeaders([
            'api_access_token' => $chatwootToken
        ])->get("{$chatwootUrl}/api/v1/accounts/1/agents/me");
        
        if ($response->successful()) {
            $agent = $response->json();
            
            // Generate or get pubsub token for agent
            $pubsubResponse = Http::withHeaders([
                'api_access_token' => $chatwootToken
            ])->get("{$chatwootUrl}/api/v1/accounts/1/agents/{$agent['id']}/pubsub_token");
            
            $pubsubToken = null;
            if ($pubsubResponse->successful()) {
                $tokenData = $pubsubResponse->json();
                $pubsubToken = $tokenData['pubsub_token'] ?? null;
            }
            
            return response()->json([
                'success' => true,
                'agent_id' => $agent['id'],
                'pubsub_token' => $pubsubToken,
                'agent' => $agent
            ]);
        } else {
            Log::error('Failed to get agent info from Chatwoot', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);
            
            return response()->json([
                'error' => 'Failed to get agent info',
                'details' => $response->json()
            ], $response->status());
        }
        
    } catch (\Exception $e) {
        Log::error('Chatwoot agent token error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'error' => 'Internal server error',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Get messages for a conversation
Route::get('/chatwoot/conversations/{conversationId}/messages', function (Request $request, $conversationId) {
    try {
        $chatwootUrl = config('services.chatwoot.url', 'http://localhost:3002');
        $chatwootToken = config('services.chatwoot.access_token');
        
        if (!$chatwootToken) {
            return response()->json(['error' => 'Chatwoot access token not configured'], 500);
        }
        
        // Get messages from Chatwoot
        $response = Http::withHeaders([
            'api_access_token' => $chatwootToken
        ])->get("{$chatwootUrl}/api/v1/accounts/1/conversations/{$conversationId}/messages");
        
        if ($response->successful()) {
            $messages = $response->json();
            
            return response()->json([
                'success' => true,
                'messages' => $messages['payload'] ?? []
            ]);
        } else {
            Log::error('Failed to fetch Chatwoot messages', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);
            
            return response()->json([
                'error' => 'Failed to fetch messages',
                'details' => $response->json()
            ], $response->status());
        }
        
    } catch (\Exception $e) {
        Log::error('Chatwoot messages fetch error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'error' => 'Internal server error',
            'message' => $e->getMessage()
        ], 500);
    }
});