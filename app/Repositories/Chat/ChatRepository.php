<?php

namespace App\Repositories\Chat;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class ChatRepository
{
    private string $chatwootUrl;
    private string $apiToken;
    private string $accountId;
    private string $inboxId;

    public function __construct()
    {
        $this->chatwootUrl = config('chat.chatwoot_url', 'http://localhost:3002');
        $this->apiToken = config('chat.chatwoot_api_token', '');
        $this->accountId = config('chat.chatwoot_account_id', '1');
        $this->inboxId = config('chat.chatwoot_inbox_id', '1');
    }

    /**
     * Create a new conversation in Chatwoot
     */
    public function createConversation(array $contactData = []): array
    {
        try {
            $response = Http::withHeaders([
                'api_access_token' => $this->apiToken,
                'Content-Type' => 'application/json'
            ])->post("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}/conversations", [
                'inbox_id' => $this->inboxId,
                'contact' => $contactData
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            throw new Exception('Failed to create conversation: ' . $response->body());
        } catch (Exception $e) {
            Log::error('Chatwoot conversation creation failed', [
                'error' => $e->getMessage(),
                'contact_data' => $contactData
            ]);
            throw $e;
        }
    }

    /**
     * Send a message to a conversation
     */
    public function sendMessage(int $conversationId, string $message, string $messageType = 'outgoing'): array
    {
        try {
            $response = Http::withHeaders([
                'api_access_token' => $this->apiToken,
                'Content-Type' => 'application/json'
            ])->post("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}/conversations/{$conversationId}/messages", [
                'content' => $message,
                'message_type' => $messageType
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            throw new Exception('Failed to send message: ' . $response->body());
        } catch (Exception $e) {
            Log::error('Chatwoot message sending failed', [
                'error' => $e->getMessage(),
                'conversation_id' => $conversationId,
                'message' => $message
            ]);
            throw $e;
        }
    }

    /**
     * Get conversation messages
     */
    public function getConversationMessages(int $conversationId): array
    {
        try {
            $response = Http::withHeaders([
                'api_access_token' => $this->apiToken
            ])->get("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}/conversations/{$conversationId}/messages");

            if ($response->successful()) {
                return $response->json();
            }

            throw new Exception('Failed to get messages: ' . $response->body());
        } catch (Exception $e) {
            Log::error('Chatwoot get messages failed', [
                'error' => $e->getMessage(),
                'conversation_id' => $conversationId
            ]);
            throw $e;
        }
    }

    /**
     * Create or get contact
     */
    public function createContact(array $contactData): array
    {
        try {
            $response = Http::withHeaders([
                'api_access_token' => $this->apiToken,
                'Content-Type' => 'application/json'
            ])->post("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}/contacts", $contactData);

            if ($response->successful()) {
                return $response->json();
            }

            throw new Exception('Failed to create contact: ' . $response->body());
        } catch (Exception $e) {
            Log::error('Chatwoot contact creation failed', [
                'error' => $e->getMessage(),
                'contact_data' => $contactData
            ]);
            throw $e;
        }
    }

    /**
     * Get available agents
     */
    public function getAvailableAgents(): array
    {
        try {
            $response = Http::withHeaders([
                'api_access_token' => $this->apiToken
            ])->get("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}/agents");

            if ($response->successful()) {
                return $response->json();
            }

            throw new Exception('Failed to get agents: ' . $response->body());
        } catch (Exception $e) {
            Log::error('Chatwoot get agents failed', [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get widget configuration URL
     */
    public function getWidgetUrl(): string
    {
        return config('chat.widget_url', $this->chatwootUrl . '/packs/js/sdk.js');
    }

    /**
     * Get Chatwoot base URL
     */
    public function getChatwootUrl(): string
    {
        return $this->chatwootUrl;
    }

    /**
     * Test connection to Chatwoot
     */
    public function testConnection(): bool
    {
        try {
            $response = Http::withHeaders([
                'api_access_token' => $this->apiToken
            ])->get("{$this->chatwootUrl}/api/v1/accounts/{$this->accountId}");

            return $response->successful();
        } catch (Exception $e) {
            Log::error('Chatwoot connection test failed', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}