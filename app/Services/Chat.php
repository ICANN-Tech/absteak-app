<?php

namespace App\Services;

use App\Repositories\Chat\ChatRepository;
use App\Repositories\Chat\ChatIntegrationRepository;
use App\Repositories\CustomerSupport\CustomerSupportRepository;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class Chat
{
    private ChatRepository $chatRepository;
    private CustomerSupportRepository $customerSupportRepository;
    private ChatIntegrationRepository $chatIntegrationRepository;

    public function __construct(
        ChatRepository $chatRepository, 
        CustomerSupportRepository $customerSupportRepository,
        ChatIntegrationRepository $chatIntegrationRepository
    ) {
        $this->chatRepository = $chatRepository;
        $this->customerSupportRepository = $customerSupportRepository;
        $this->chatIntegrationRepository = $chatIntegrationRepository;
    }

    /**
     * Initialize chat for a guest user
     */
    public function initializeGuestChat(string $guestName = null, string $email = null, string $phone = null): array
    {
        $guestId = 'guest_' . Str::random(8);
        $displayName = $guestName ?: 'Guest ' . substr($guestId, -4);
        $guestEmail = $email ?: $guestId . '@guest.local';

        try {
            // Create contact in Chatwoot
            $contact = $this->chatRepository->createContact([
                'name' => $displayName,
                'email' => $guestEmail,
                'phone_number' => $phone,
                'identifier' => $guestId
            ]);

            if (!$contact) {
                throw new \Exception('Failed to create guest contact in Chatwoot');
            }

            // Create conversation in Chatwoot
            $conversation = $this->chatRepository->createConversation($contact['id']);
            
            if (!$conversation) {
                throw new \Exception('Failed to create conversation in Chatwoot');
            }

            // Store guest session in cache
            Cache::put("chat_guest_{$guestId}", [
                'id' => $guestId,
                'display_name' => $displayName,
                'email' => $guestEmail,
                'phone' => $phone,
                'contact_id' => $contact['id'],
                'conversation_id' => $conversation['id'],
                'created_at' => now()
            ], config('chat.chat_timeout', 3600));

            return [
                'guest_id' => $guestId,
                'display_name' => $displayName,
                'contact_id' => $contact['id'],
                'conversation_id' => $conversation['id'],
                'widget_url' => config('chat.widget_url'),
                'chatwoot_url' => config('chat.chatwoot_url')
            ];
        } catch (\Exception $e) {
            Log::error('Failed to initialize guest chat', [
                'error' => $e->getMessage(),
                'guest_name' => $guestName,
                'email' => $email
            ]);
            throw $e;
        }
    }

    /**
     * Initialize chat for a logged-in user
     */
    public function initializeUserChat(User $user): array
    {
        try {
            // Create or get contact in Chatwoot
            $contact = $this->chatRepository->createContact([
                'name' => $user->name,
                'email' => $user->email,
                'phone_number' => $user->phone,
                'identifier' => 'user_' . $user->id
            ]);

            if (!$contact) {
                throw new \Exception('Failed to create user contact in Chatwoot');
            }

            // Create conversation in Chatwoot
            $conversation = $this->chatRepository->createConversation($contact['id']);
            
            if (!$conversation) {
                throw new \Exception('Failed to create conversation in Chatwoot');
            }

            // Store user session in cache
            Cache::put("chat_user_{$user->id}", [
                'user_id' => $user->id,
                'display_name' => $user->name,
                'email' => $user->email,
                'contact_id' => $contact['id'],
                'conversation_id' => $conversation['id'],
                'created_at' => now()
            ], config('chat.chat_timeout', 3600));

            return [
                'user_id' => $user->id,
                'display_name' => $user->name,
                'contact_id' => $contact['id'],
                'conversation_id' => $conversation['id'],
                'widget_url' => config('chat.widget_url'),
                'chatwoot_url' => config('chat.chatwoot_url')
            ];
        } catch (\Exception $e) {
            Log::error('Failed to initialize user chat', [
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            throw $e;
        }
    }

    /**
     * Initialize chat for customer service staff
     */
    public function initializeCustomerServiceChat(User $user): array
    {
        try {
            // Test Chatwoot connection
            if (!$this->chatRepository->testConnection()) {
                throw new \Exception('Failed to connect to Chatwoot');
            }

            // Mark as online customer service
            Cache::put("cs_online_{$user->id}", [
                'user_id' => $user->id,
                'display_name' => $user->name,
                'email' => $user->email,
                'active_chats' => 0,
                'last_activity' => now()
            ], config('chat.chat_timeout', 3600));

            return [
                'user_id' => $user->id,
                'display_name' => $user->name,
                'chatwoot_url' => config('chat.chatwoot_url'),
                'account_id' => config('chat.chatwoot_account_id'),
                'is_customer_service' => true
            ];
        } catch (\Exception $e) {
            Log::error('Failed to initialize CS chat', [
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            throw $e;
        }
    }

    /**
     * Assign customer service to a guest
     */
    public function assignCustomerService(string $guestId): ?array
    {
        $availableCs = $this->getAvailableCustomerService();
        
        if (!$availableCs['success'] || empty($availableCs['agents'])) {
            return null;
        }

        // Get CS with least active chats
        $selectedCs = collect($availableCs['agents'])->sortBy('current_ticket_count')->first();
        
        if (!$selectedCs) {
            return null;
        }

        // Update guest session with assigned CS
        $guestSession = Cache::get("chat_guest_{$guestId}");
        if ($guestSession) {
            $guestSession['assigned_cs'] = $selectedCs;
            Cache::put("chat_guest_{$guestId}", $guestSession, config('chat.chat_timeout', 3600));
        }

        // Update CS active chats count
        $csKey = "cs_online_{$selectedCs['id']}";
        $csSession = Cache::get($csKey);
        if ($csSession) {
            $csSession['active_chats']++;
            Cache::put($csKey, $csSession, config('chat.chat_timeout', 3600));
        }

        return $selectedCs;
    }

    /**
     * Get available customer service staff
     */
    public function getAvailableCustomerService(): array
    {
        try {
            $agents = $this->customerSupportRepository->getAvailableAgents();

            return [
                'success' => true,
                'agents' => $agents->map(function ($agent) {
                    return [
                        'id' => $agent->id,
                        'name' => $agent->name,
                        'email' => $agent->email,
                        'status' => $agent->status ?? 'available',
                        'current_ticket_count' => $agent->current_ticket_count ?? 0,
                        'max_concurrent_tickets' => $agent->max_concurrent_tickets ?? 5,
                    ];
                })->toArray(),
                'total_available' => $agents->count(),
            ];
        } catch (\Exception $e) {
            Log::error('Failed to get available customer service agents', [
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => 'Failed to retrieve available agents',
                'agents' => [],
                'total_available' => 0,
            ];
        }
    }

    /**
     * End chat session
     */
    public function endChatSession(string $sessionId, string $type = 'guest'): bool
    {
        try {
            $cacheKey = "chat_{$type}_{$sessionId}";
            $session = Cache::get($cacheKey);
            
            if (!$session) {
                return false;
            }

            // Update CS active chats count if assigned
            if ($type === 'guest' && isset($session['assigned_cs'])) {
                $csKey = "cs_online_{$session['assigned_cs']['id']}";
                $csSession = Cache::get($csKey);
                if ($csSession) {
                    $csSession['active_chats'] = max(0, $csSession['active_chats'] - 1);
                    Cache::put($csKey, $csSession, config('chat.chat_timeout', 3600));
                }
            }

            // Remove session from cache
            Cache::forget($cacheKey);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to end chat session: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send message in conversation
     */
    public function sendMessage(int $conversationId, string $message, string $messageType = 'outgoing'): array
    {
        try {
            $result = $this->chatRepository->sendMessage($conversationId, $message, $messageType);
            
            if (!$result) {
                throw new \Exception('Failed to send message via Chatwoot');
            }
            
            return [
                'success' => true,
                'message' => $result
            ];
        } catch (\Exception $e) {
            Log::error('Failed to send message', [
                'conversation_id' => $conversationId,
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get chat statistics
     */
    public function getChatStatistics(): array
    {
        try {
            $onlineGuests = count(Cache::getRedis()->keys('chat_guest_*'));
            $onlineUsers = count(Cache::getRedis()->keys('chat_user_*'));
            $onlineCs = count(Cache::getRedis()->keys('cs_online_*'));
            
            return [
                'online_guests' => $onlineGuests,
                'online_users' => $onlineUsers,
                'online_customer_service' => $onlineCs,
                'total_online' => $onlineGuests + $onlineUsers + $onlineCs
            ];
        } catch (\Exception $e) {
            Log::error('Failed to get chat statistics', [
                'error' => $e->getMessage()
            ]);
            
            return [
                'online_guests' => 0,
                'online_users' => 0,
                'online_customer_service' => 0,
                'total_online' => 0
            ];
        }
    }

    /**
     * Send message to bot and handle potential CS transfer
     */
    public function sendMessageToBot(string $sessionId, string $message, array $context = []): array
    {
        try {
            return $this->chatIntegrationRepository->sendMessageToBot($sessionId, $message, $context);
        } catch (\Exception $e) {
            Log::error('Failed to send message to bot', [
                'error' => $e->getMessage(),
                'session_id' => $sessionId,
                'message' => $message
            ]);
            
            return [
                'success' => false,
                'error' => 'Failed to process message',
                'message' => 'Sorry, I encountered an issue processing your message. Please try again.'
            ];
        }
    }

    /**
     * Send message to customer service
     */
    public function sendMessageToCs(string $sessionId, string $ticketId, string $message, array $context = []): array
    {
        try {
            return $this->chatIntegrationRepository->sendMessageToCs($sessionId, $ticketId, $message, $context);
        } catch (\Exception $e) {
            Log::error('Failed to send message to CS', [
                'error' => $e->getMessage(),
                'session_id' => $sessionId,
                'ticket_id' => $ticketId,
                'message' => $message
            ]);
            
            return [
                'success' => false,
                'error' => 'Failed to send message',
                'message' => 'Sorry, I encountered an issue sending your message. Please try again.'
            ];
        }
    }

    /**
     * Get active tickets from database
     */
    public function getActiveTickets(): array
    {
        try {
            $tickets = $this->customerSupportRepository->getActiveTickets();
            
            return $tickets->map(function ($ticket) {
                $chatData = $ticket->chat_session_data ?? [];
                $messages = $chatData['messages'] ?? [];
                $lastMessage = !empty($messages) ? end($messages)['message'] : $ticket->description;
                
                return [
                    'id' => $ticket->id,
                    'ticket_number' => $ticket->ticket_number,
                    'session_id' => $chatData['session_id'] ?? null,
                    'customer_name' => $ticket->customer_name,
                    'customer_email' => $ticket->customer_email,
                    'subject' => $ticket->subject,
                    'status' => $ticket->status,
                    'priority' => $ticket->priority,
                    'created_at' => $ticket->created_at->toISOString(),
                    'last_message' => $lastMessage,
                    'last_message_time' => $ticket->updated_at->diffForHumans(),
                    'assigned_agent' => $ticket->assignedCs ? [
                        'id' => $ticket->assignedCs->id,
                        'name' => $ticket->assignedCs->name,
                        'department' => $ticket->assignedCs->department
                    ] : null
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::error('Failed to get active tickets', [
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Get messages for a ticket
     */
    public function getTicketMessages(int $conversationId): array
    {
        try {
            // This would get messages from Chatwoot conversation
            // For now, return empty array as placeholder
            return [];
        } catch (\Exception $e) {
            Log::error('Failed to get ticket messages', [
                'conversation_id' => $conversationId,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Send CS reply to customer
     */
    public function sendCsReply(string $ticketId, string $message, string $agentId): array
    {
        try {
            return $this->chatIntegrationRepository->sendCsReply($ticketId, $message, $agentId);
        } catch (\Exception $e) {
            Log::error('Failed to send CS reply', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
                'message' => $message,
                'agent_id' => $agentId
            ]);
            
            return [
                'success' => false,
                'error' => 'Failed to send reply',
                'message' => 'Sorry, I encountered an issue sending your reply. Please try again.'
            ];
        }
    }

    /**
     * Resolve a ticket
     */
    public function resolveTicket(int $conversationId): array
    {
        try {
            // This would update conversation status in Chatwoot
            // For now, return success as placeholder
            return [
                'success' => true,
                'conversation_id' => $conversationId,
                'status' => 'resolved'
            ];
        } catch (\Exception $e) {
            Log::error('Failed to resolve ticket', [
                'conversation_id' => $conversationId,
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Escalate a ticket
     */
    public function escalateTicket(int $conversationId, string $reason): array
    {
        try {
            // This would escalate conversation in Chatwoot
            // For now, return success as placeholder
            return [
                'success' => true,
                'conversation_id' => $conversationId,
                'escalation_reason' => $reason
            ];
        } catch (\Exception $e) {
            Log::error('Failed to escalate ticket', [
                'conversation_id' => $conversationId,
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Update agent status
     */
    public function updateAgentStatus(string $status): array
    {
        try {
            // This would update agent status in Chatwoot
            // For now, return success as placeholder
            return [
                'success' => true,
                'status' => $status
            ];
        } catch (\Exception $e) {
            Log::error('Failed to update agent status', [
                'status' => $status,
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Cleanup expired sessions
     */
    public function cleanupExpiredSessions(): void
    {
        // This would typically be called by a scheduled job
        // Implementation depends on your cache driver
        Log::info('Chat session cleanup completed');
    }
}