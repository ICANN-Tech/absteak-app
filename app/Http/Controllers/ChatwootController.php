<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatwootController extends Controller
{
    private $chatwootUrl;
    private $chatwootToken;
    private $accountId;

    public function __construct()
    {
        $this->chatwootUrl = env('CHATWOOT_URL', 'http://localhost:3002');
        $this->chatwootToken = env('CHATWOOT_API_TOKEN');
        $this->accountId = env('CHATWOOT_ACCOUNT_ID', 1);
    }

    /**
     * Create or get a Chatwoot contact
     */
    public function createOrGetContact(Request $request)
    {
        try {
            $guestId = $request->input('guest_id');
            $name = $request->input('name', 'Guest User');
            $email = $request->input('email', $guestId . '@guest.local');

            // First, try to find existing contact
            $searchResponse = Http::withHeaders([
                'api_access_token' => $this->chatwootToken,
            ])->get("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}/contacts/search", [
                'q' => $email
            ]);

            if ($searchResponse->successful()) {
                $contacts = $searchResponse->json()['payload'];
                if (!empty($contacts)) {
                    return response()->json([
                        'success' => true,
                        'contact' => $contacts[0]
                    ]);
                }
            }

            // Create new contact if not found
            $response = Http::withHeaders([
                'api_access_token' => $this->chatwootToken,
            ])->post("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}/contacts", [
                'name' => $name,
                'email' => $email,
                'identifier' => $guestId,
                'custom_attributes' => [
                    'guest_id' => $guestId
                ]
            ]);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'contact' => $response->json()['payload']
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => 'Failed to create contact'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Chatwoot create contact error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Create a new conversation
     */
    public function createConversation(Request $request)
    {
        try {
            $contactId = $request->input('contact_id');
            $inboxId = $request->input('inbox_id', 1); // Default inbox

            $response = Http::withHeaders([
                'api_access_token' => $this->chatwootToken,
            ])->post("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}/conversations", [
                'contact_id' => $contactId,
                'inbox_id' => $inboxId
            ]);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'conversation' => $response->json()
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => 'Failed to create conversation'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Chatwoot create conversation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Send a message to a conversation
     */
    public function sendMessage(Request $request)
    {
        try {
            $conversationId = $request->input('conversation_id');
            $content = $request->input('content');
            $messageType = $request->input('message_type', 'incoming'); // incoming or outgoing

            $response = Http::withHeaders([
                'api_access_token' => $this->chatwootToken,
            ])->post("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}/conversations/{$conversationId}/messages", [
                'content' => $content,
                'message_type' => $messageType
            ]);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'message' => $response->json()
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => 'Failed to send message'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Chatwoot send message error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get conversations for CS dashboard
     */
    public function getConversations(Request $request)
    {
        try {
            $status = $request->input('status', 'open');
            $page = $request->input('page', 1);

            $response = Http::withHeaders([
                'api_access_token' => $this->chatwootToken,
            ])->get("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}/conversations", [
                'status' => $status,
                'page' => $page
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'success' => true,
                    'conversations' => $data['data']['payload'] ?? [],
                    'meta' => $data['data']['meta'] ?? []
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch conversations'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Chatwoot get conversations error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get messages for a specific conversation
     */
    public function getMessages(Request $request, $conversationId)
    {
        try {
            $response = Http::withHeaders([
                'api_access_token' => $this->chatwootToken,
            ])->get("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}/conversations/{$conversationId}/messages");

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'messages' => $response->json()['payload'] ?? []
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch messages'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Chatwoot get messages error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get agent PubSub token for WebSocket connection
     */
    public function getAgentToken(Request $request)
    {
        try {
            // For now, we'll use a simple approach to get agent info
            // In a real implementation, you'd get the current authenticated agent
            $agentId = $request->input('agent_id', 1);

            $response = Http::withHeaders([
                'api_access_token' => $this->chatwootToken,
            ])->get("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}/agents/{$agentId}");

            if ($response->successful()) {
                $agent = $response->json()['payload'];
                return response()->json([
                    'success' => true,
                    'agent' => $agent,
                    'pubsub_token' => $agent['pubsub_token'] ?? null
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch agent token'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Chatwoot get agent token error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Internal server error'
            ], 500);
        }
    }
}