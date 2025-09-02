<?php

namespace App\Repositories\Chat;

use App\Models\Ticket;
use App\Models\CustomerService;
use App\Repositories\Flowise\FlowiseRepository;
use App\Repositories\CustomerSupport\CustomerSupportRepository;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ChatIntegrationRepository implements ChatServiceInterface
{
    protected FlowiseRepository $flowiseRepository;
    protected CustomerSupportRepository $customerSupportRepository;
    protected ChatRepository $chatRepository;

    public function __construct(
        FlowiseRepository $flowiseRepository,
        CustomerSupportRepository $customerSupportRepository,
        ChatRepository $chatRepository
    ) {
        $this->flowiseRepository = $flowiseRepository;
        $this->customerSupportRepository = $customerSupportRepository;
        $this->chatRepository = $chatRepository;
    }

    /**
     * Initialize a new chat session for a guest user.
     */
    public function initializeGuestChat(array $guestData = []): array
    {
        try {
            $sessionId = (string) Str::uuid();
            
            // Initialize Flowise chat session (fallback if method doesn't exist)
            $flowiseSession = [];
            // Note: createChatSession method would be called here if available in FlowiseRepository

            return [
                'success' => true,
                'session_id' => $sessionId,
                'chat_type' => 'bot',
                'flowise_session' => $flowiseSession,
                'message' => 'Chat session initialized successfully. How can I help you today?',
            ];
        } catch (\Exception $e) {
            Log::error('Failed to initialize guest chat', [
                'error' => $e->getMessage(),
                'guest_data' => $guestData,
            ]);

            return [
                'success' => false,
                'error' => 'Failed to initialize chat session',
                'message' => 'Sorry, we encountered an issue starting your chat. Please try again.',
            ];
        }
    }

    /**
     * Initialize a new chat session for an authenticated user.
     */
    public function initializeUserChat(string $userId, array $userData = []): array
    {
        try {
            $sessionId = (string) Str::uuid();
            
            // Initialize Flowise chat session (fallback if method doesn't exist)
            $flowiseSession = [];
            // Note: createChatSession method would be called here if available in FlowiseRepository

            return [
                'success' => true,
                'session_id' => $sessionId,
                'chat_type' => 'bot',
                'flowise_session' => $flowiseSession,
                'message' => 'Welcome back! How can I assist you today?',
            ];
        } catch (\Exception $e) {
            Log::error('Failed to initialize user chat', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
                'user_data' => $userData,
            ]);

            return [
                'success' => false,
                'error' => 'Failed to initialize chat session',
                'message' => 'Sorry, we encountered an issue starting your chat. Please try again.',
            ];
        }
    }

    /**
     * Send a message to the chatbot.
     */
    public function sendMessageToBot(string $sessionId, string $message, array $context = []): array
    {
        try {
            // Send message to Flowise (fallback if method doesn't exist)
            $response = '';
            if (method_exists($this->flowiseRepository, 'sendMessage')) {
                $response = $this->flowiseRepository->sendMessage($message, 'assistant', null);
            }

            // Check if the response indicates a need for customer service
            if ($this->shouldTransferToCustomerService(['response' => $response], $message)) {
                return $this->handleCustomerServiceTransfer($sessionId, $message, $context);
            }

            return [
                'success' => true,
                'response' => $response,
                'chat_type' => 'bot',
                'session_id' => $sessionId,
                'message' => $response,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to send message to bot', [
                'error' => $e->getMessage(),
                'session_id' => $sessionId,
                'message' => $message,
            ]);

            return [
                'success' => false,
                'error' => 'Failed to process message',
                'message' => 'Sorry, I encountered an issue processing your message. Please try again.',
            ];
        }
    }

    /**
     * Handle transfer to customer service.
     */
    public function transferToCustomerService(string $sessionId, array $customerData = [], string $reason = ''): array
    {
        try {
            // Find available customer service representative
            $availableCs = $this->customerSupportRepository->findAvailableAgent($customerData);

            if (!$availableCs) {
                return $this->handleNoAvailableAgents($sessionId, $customerData, $reason);
            }

            // Create a support ticket
            $ticket = $this->customerSupportRepository->createTicket([
                'subject' => 'Chat Transfer - ' . ($reason ?: 'Customer Service Request'),
                'description' => 'Customer transferred from chatbot to customer service.',
                'priority' => 'medium',
                'category' => 'chat_transfer',
                'customer_name' => $customerData['name'] ?? 'Guest User',
                'customer_email' => $customerData['email'] ?? null,
                'customer_phone' => $customerData['phone'] ?? null,
                'customer_id' => $customerData['user_id'] ?? null,
                'chat_session_data' => [
                    'session_id' => $sessionId,
                    'transfer_reason' => $reason,
                    'transfer_time' => now()->toISOString(),
                ],
                'metadata' => [
                    'source' => 'chat_transfer',
                    'original_session_id' => $sessionId,
                ],
            ]);

            // Assign ticket to the available CS agent
            $this->customerSupportRepository->assignTicket($ticket->id, $availableCs->id);

            // Update chat session to CS mode (if method exists)
            // Note: transferToCsMode method would be called here if available in FlowiseRepository

            return [
                'success' => true,
                'chat_type' => 'customer_service',
                'ticket_id' => $ticket->id,
                'cs_agent' => [
                    'id' => $availableCs->id,
                    'name' => $availableCs->name,
                    'department' => $availableCs->department,
                    'avatar_url' => $availableCs->avatar_url,
                ],
                'message' => "You've been connected to {$availableCs->name} from our {$availableCs->department} team. How can I help you today?",
                'session_id' => $sessionId,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to transfer to customer service', [
                'error' => $e->getMessage(),
                'session_id' => $sessionId,
                'customer_data' => $customerData,
            ]);

            return [
                'success' => false,
                'error' => 'Failed to connect to customer service',
                'message' => 'Sorry, we encountered an issue connecting you to customer service. Please try again later.',
            ];
        }
    }

    /**
     * Send a message to customer service.
     */
    public function sendMessageToCs(string $sessionId, string $ticketId, string $message, array $context = []): array
    {
        try {
            // Send message through customer support repository
            $response = $this->customerSupportRepository->sendMessage($ticketId, $message, $context);

            // Update ticket with customer message
            $this->customerSupportRepository->addMessageToTicket($ticketId, [
                'sender' => 'customer',
                'message' => $message,
                'timestamp' => now(),
                'session_id' => $sessionId,
            ]);

            return [
                'success' => true,
                'response' => $response,
                'chat_type' => 'customer_service',
                'ticket_id' => $ticketId,
                'session_id' => $sessionId,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to send message to CS', [
                'error' => $e->getMessage(),
                'session_id' => $sessionId,
                'ticket_id' => $ticketId,
                'message' => $message,
            ]);

            return [
                'success' => false,
                'error' => 'Failed to send message',
                'message' => 'Sorry, I encountered an issue sending your message. Please try again.',
            ];
        }
    }

    /**
     * Get available customer service agents.
     */
    public function getAvailableAgents(): array
    {
        try {
            $agents = $this->customerSupportRepository->getAvailableAgents();

            return [
                'success' => true,
                'agents' => $agents->map(function ($agent) {
                    return [
                        'id' => $agent->id,
                        'name' => $agent->name,
                        'department' => $agent->department,
                        'status' => $agent->status,
                        'available_slots' => $agent->max_concurrent_tickets - $agent->current_ticket_count,
                        'skills' => $agent->skills,
                    ];
                })->toArray(),
                'total_available' => $agents->count(),
            ];
        } catch (\Exception $e) {
            Log::error('Failed to get available agents', [
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
     * Check if the bot response indicates a need for customer service transfer.
     */
    protected function shouldTransferToCustomerService(array $botResponse, string $userMessage): bool
    {
        // Keywords that might indicate need for human support
        $transferKeywords = [
            'speak to human', 'talk to person', 'customer service', 'human agent',
            'representative', 'manager', 'supervisor', 'help me', 'complaint',
            'not satisfied', 'escalate', 'urgent', 'emergency'
        ];

        $message = strtolower($userMessage);
        
        foreach ($transferKeywords as $keyword) {
            if (str_contains($message, $keyword)) {
                return true;
            }
        }

        // Check if bot response suggests transfer
        if (isset($botResponse['suggest_transfer']) && $botResponse['suggest_transfer']) {
            return true;
        }

        return false;
    }

    /**
     * Handle customer service transfer.
     */
    protected function handleCustomerServiceTransfer(string $sessionId, string $message, array $context): array
    {
        // Extract customer data from context
        $customerData = [
            'name' => $context['customer_name'] ?? 'Guest User',
            'email' => $context['customer_email'] ?? null,
            'phone' => $context['customer_phone'] ?? null,
            'user_id' => $context['user_id'] ?? null,
        ];

        return $this->transferToCustomerService($sessionId, $customerData, 'User requested human assistance');
    }

    /**
     * Handle case when no agents are available.
     */
    protected function handleNoAvailableAgents(string $sessionId, array $customerData, string $reason): array
    {
        // Create a ticket for later follow-up
        $ticket = $this->customerSupportRepository->createTicket([
            'subject' => 'Pending CS Request - ' . ($reason ?: 'Customer Service Request'),
            'description' => 'Customer requested support but no agents were available.',
            'priority' => 'medium',
            'category' => 'pending_cs',
            'customer_name' => $customerData['name'] ?? 'Guest User',
            'customer_email' => $customerData['email'] ?? null,
            'customer_phone' => $customerData['phone'] ?? null,
            'customer_id' => $customerData['user_id'] ?? null,
            'status' => 'open',
            'chat_session_data' => [
                'session_id' => $sessionId,
                'request_reason' => $reason,
                'request_time' => now()->toISOString(),
            ],
        ]);

        return [
            'success' => true,
            'chat_type' => 'bot',
            'ticket_id' => $ticket->id,
            'message' => "I understand you'd like to speak with a customer service representative. Unfortunately, all our agents are currently busy. I've created a support ticket for you (#{$ticket->ticket_number}), and someone will get back to you as soon as possible. In the meantime, I'm here to help with any questions you might have.",
            'session_id' => $sessionId,
        ];
    }

    /**
     * Create a chat session.
     */
    public function createChatSession(array $sessionData): array
    {
        // Simple session creation - can be enhanced with actual storage
        return [
            'session_id' => $sessionData['session_id'] ?? (string) Str::uuid(),
            'session_data' => $sessionData,
            'created_at' => now()->toISOString(),
            'status' => 'active'
        ];
    }

    /**
     * Transfer chat to customer service mode.
     */
    public function transferToCsMode(string $sessionId, array $transferData): array
    {
        // Simple transfer implementation - can be enhanced with actual CS integration
        return [
            'success' => true,
            'session_id' => $sessionId,
            'transfer_data' => $transferData,
            'transferred_at' => now()->toISOString()
        ];
    }

    /**
     * Get active tickets for CS dashboard.
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
     * Get messages for a specific ticket.
     */
    public function getTicketMessages(string $ticketId): array
    {
        try {
            $ticket = $this->customerSupportRepository->getTicket($ticketId);
            
            if (!$ticket) {
                return [];
            }
            
            $chatData = $ticket->chat_session_data ?? [];
            $messages = $chatData['messages'] ?? [];
            
            return array_map(function ($message) {
                return [
                    'id' => $message['id'],
                    'sender' => $message['sender'],
                    'message' => $message['message'],
                    'timestamp' => $message['timestamp'],
                    'session_id' => $message['session_id'] ?? null,
                ];
            }, $messages);
        } catch (\Exception $e) {
            Log::error('Failed to get ticket messages', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
            ]);
            return [];
        }
    }

    /**
     * Send reply from CS agent to customer.
     */
    public function sendCsReply(string $ticketId, string $message, string $agentId): array
    {
        try {
            $messageData = [
                'id' => uniqid(),
                'sender' => 'agent',
                'message' => $message,
                'timestamp' => now()->toISOString(),
                'agent_id' => $agentId,
                'session_id' => $ticketId
            ];

            $result = $this->customerSupportRepository->addMessageToTicket($ticketId, $messageData);

            if ($result) {
                Log::info('CS reply sent successfully', [
                    'ticket_id' => $ticketId,
                    'agent_id' => $agentId,
                    'message_id' => $messageData['id']
                ]);

                return [
                    'success' => true,
                    'message_id' => $messageData['id'],
                    'timestamp' => $messageData['timestamp']
                ];
            }

            return [
                'success' => false,
                'error' => 'Failed to save message'
            ];

        } catch (\Exception $e) {
            Log::error('Failed to send CS reply', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
                'agent_id' => $agentId
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Resolve a ticket.
     */
    public function resolveTicket(string $ticketId): array
    {
        return [
            'success' => true,
            'ticket_id' => $ticketId,
            'resolved_at' => now()->toISOString(),
            'note' => 'Ticket resolved (demo mode)'
        ];
    }

    /**
     * Escalate a ticket.
     */
    public function escalateTicket(string $ticketId, string $reason): array
    {
        return [
            'success' => true,
            'ticket_id' => $ticketId,
            'escalated_at' => now()->toISOString(),
            'reason' => $reason,
            'note' => 'Ticket escalated (demo mode)'
        ];
    }

    /**
     * Update agent status.
     */
    public function updateAgentStatus(string $status): array
    {
        return [
            'success' => true,
            'status' => $status,
            'updated_at' => now()->toISOString(),
            'note' => 'Status updated (demo mode)'
        ];
    }

    /**
     * Test connection to chat services.
     */
    public function testConnection(): array
    {
        try {
            // Test Chatwoot connection
            $chatwootStatus = $this->chatRepository->testConnection();
            
            // Test Flowise connection
            $flowiseStatus = $this->flowiseRepository->testConnection();
            
            return [
                'chatwoot' => [
                    'status' => $chatwootStatus ? 'connected' : 'disconnected',
                    'service' => 'Chatwoot API'
                ],
                'flowise' => [
                    'status' => $flowiseStatus ? 'connected' : 'disconnected',
                    'service' => 'Flowise API'
                ],
                'overall_status' => ($chatwootStatus && $flowiseStatus) ? 'healthy' : 'degraded'
            ];
        } catch (\Exception $e) {
            Log::error('Connection test failed', [
                'error' => $e->getMessage()
            ]);
            
            return [
                'chatwoot' => ['status' => 'error', 'service' => 'Chatwoot API'],
                'flowise' => ['status' => 'error', 'service' => 'Flowise API'],
                'overall_status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }
}