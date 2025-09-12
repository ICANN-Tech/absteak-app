<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Chat\ChatIntegrationRepository;
use App\Repositories\Chat\ChatRepository;
use App\Repositories\Flowise\FlowiseRepository;
use App\Repositories\CustomerSupport\CustomerSupportRepository;
use App\Events\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    protected ChatIntegrationRepository $chatService;

    public function __construct(
        FlowiseRepository $flowiseRepository,
        CustomerSupportRepository $customerSupportRepository,
        ChatRepository $chatRepository
    ) {
        $this->chatService = new ChatIntegrationRepository(
            $flowiseRepository,
            $customerSupportRepository,
            $chatRepository
        );
    }

    /**
     * Initialize a new chat session
     */
    public function initialize(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_type' => 'required|in:guest,authenticated',
                'user_id' => 'required_if:user_type,authenticated|string',
                'guest_data' => 'required_if:user_type,guest|array',
                'guest_data.name' => 'required_if:user_type,guest|string|max:255',
                'guest_data.email' => 'nullable|email|max:255',
                'guest_data.phone' => 'nullable|string|max:20',
                'user_data' => 'array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userType = $request->input('user_type');
            
            if ($userType === 'guest') {
                $session = $this->chatService->initializeGuestChat(
                    $request->input('guest_data', [])
                );
            } else {
                $session = $this->chatService->initializeUserChat(
                    $request->input('user_id'),
                    $request->input('user_data', [])
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Chat session initialized successfully',
                'data' => $session
            ]);

        } catch (\Exception $e) {
            Log::error('Chat initialization failed', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize chat session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send a message to the chatbot
     */
    public function sendMessage(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'session_id' => 'required|string',
                'message' => 'required|string|max:1000',
                'context' => 'array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $response = $this->chatService->sendMessageToBot(
                $request->input('session_id'),
                $request->input('message'),
                $request->input('context', [])
            );

            // Broadcast the message via WebSocket
            broadcast(new ChatMessage(
                $request->input('message'),
                $request->input('session_id'),
                null, // ticketId - null for guest messages
                'guest'
            ));

            // If there's a bot response, broadcast it too
            if (isset($response['message']) && !empty($response['message'])) {
                broadcast(new ChatMessage(
                    $response['message'],
                    $request->input('session_id'),
                    null,
                    'bot'
                ));
            }

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $response
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send message', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Transfer chat to customer service
     */
    public function transferToCs(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'session_id' => 'required|string',
                'customer_data' => 'array',
                'customer_data.name' => 'required|string|max:255',
                'customer_data.email' => 'nullable|email|max:255',
                'customer_data.phone' => 'nullable|string|max:20',
                'customer_data.user_id' => 'nullable|string',
                'reason' => 'nullable|string|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $transfer = $this->chatService->transferToCustomerService(
                $request->input('session_id'),
                $request->input('customer_data', []),
                $request->input('reason', '')
            );

            return response()->json([
                'success' => true,
                'message' => 'Successfully transferred to customer service',
                'data' => $transfer
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to transfer to customer service', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to transfer to customer service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send message to customer service
     */
    public function sendMessageToCs(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'session_id' => 'required|string',
                'ticket_id' => 'required|string',
                'message' => 'required|string|max:1000',
                'context' => 'array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $response = $this->chatService->sendMessageToCs(
                $request->input('session_id'),
                $request->input('ticket_id'),
                $request->input('message'),
                $request->input('context', [])
            );

            // Broadcast the customer message via WebSocket
            if ($response['success']) {
                broadcast(new ChatMessage(
                    $request->input('message'),
                    $request->input('session_id'),
                    $request->input('ticket_id'),
                    'customer'
                ));
            }

            return response()->json([
                'success' => true,
                'message' => 'Message sent to customer service',
                'data' => $response
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send message to CS', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send message to customer service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available customer service agents
     */
    public function getAvailableAgents(): JsonResponse
    {
        try {
            $agents = $this->chatService->getAvailableAgents();

            return response()->json([
                'success' => true,
                'message' => 'Available agents retrieved successfully',
                'data' => $agents
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get available agents', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve available agents',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get chat session status
     */
    public function getSessionStatus(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'session_id' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // This would need to be implemented in the chat service
            // For now, return a basic response
            return response()->json([
                'success' => true,
                'message' => 'Session status retrieved',
                'data' => [
                    'session_id' => $request->input('session_id'),
                    'status' => 'active',
                    'type' => 'chatbot' // or 'customer_service'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get session status', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get session status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get CS tickets for dashboard
     */
    public function getTickets(Request $request): JsonResponse
    {
        try {
            // Get tickets from database
            $tickets = $this->chatService->getActiveTickets();
            
            return response()->json([
                'success' => true,
                'message' => 'Tickets retrieved successfully',
                'data' => $tickets
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get tickets', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve tickets',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get messages for a specific ticket
     */
    public function getTicketMessages(Request $request, $ticket_id): JsonResponse
    {
        try {
            $messages = $this->chatService->getTicketMessages($ticket_id);
            
            return response()->json([
                'success' => true,
                'message' => 'Ticket messages retrieved successfully',
                'data' => $messages
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get ticket messages', [
                'ticket_id' => $ticket_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve ticket messages',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send reply from CS agent to customer
     */
    public function sendCsReply(Request $request, $ticket_id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'message' => 'required|string|max:1000',
                'agent_id' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $response = $this->chatService->sendCsReply(
                $ticket_id,
                $request->input('message'),
                $request->input('agent_id')
            );

            // Broadcast the CS agent message via WebSocket
            if ($response['success']) {
                // Get ticket to find session_id from chat_session_data
                $ticket = app(\App\Repositories\CustomerSupport\CustomerSupportRepository::class)->getTicket($ticket_id);
                $sessionId = $ticket->chat_session_data['session_id'] ?? null;
                
                if ($sessionId) {
                    broadcast(new ChatMessage(
                        $request->input('message'),
                        $sessionId,
                        $ticket_id,
                        'agent'
                    ));
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Reply sent successfully',
                'data' => $response
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send CS reply', [
                'ticket_id' => $ticket_id,
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send reply',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Resolve a ticket
     */
    public function resolveTicket(Request $request, $ticket_id): JsonResponse
    {
        try {
            $result = $this->chatService->resolveTicket($ticket_id);
            
            return response()->json([
                'success' => true,
                'message' => 'Ticket resolved successfully',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to resolve ticket', [
                'ticket_id' => $ticket_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to resolve ticket',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Escalate a ticket
     */
    public function escalateTicket(Request $request, $ticket_id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'reason' => 'required|string|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $result = $this->chatService->escalateTicket($ticket_id, $request->input('reason'));
            
            return response()->json([
                'success' => true,
                'message' => 'Ticket escalated successfully',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to escalate ticket', [
                'ticket_id' => $ticket_id,
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to escalate ticket',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update agent status
     */
    public function updateAgentStatus(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:available,busy,offline'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update agent status in the system
            $result = $this->chatService->updateAgentStatus($request->input('status'));
            
            return response()->json([
                'success' => true,
                'message' => 'Agent status updated successfully',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update agent status', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update agent status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get active tickets for CS dashboard
     */
    public function getActiveTickets(Request $request): JsonResponse
    {
        try {
            $tickets = $this->chatService->getActiveTickets();
            
            return response()->json([
                'success' => true,
                'message' => 'Active tickets retrieved successfully',
                'data' => $tickets
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get active tickets', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve active tickets',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test connection to chat services
     */
    public function testConnection(): JsonResponse
    {
        try {
            // Test Chatwoot connection through chat service
            $result = $this->chatService->testConnection();
            
            return response()->json([
                'success' => true,
                'message' => 'Connection test successful',
                'data' => $result,
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            Log::error('Connection test failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Connection test failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send message via Soketi
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function sendSoketiMessage(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|max:50',
                'message' => 'required|string|max:1000',
                'room' => 'required|string|max:50',
                'timestamp' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $messageData = [
                'username' => $request->input('username'),
                'message' => $request->input('message'),
                'timestamp' => $request->input('timestamp'),
                'room' => $request->input('room')
            ];

            // Broadcast message to Soketi
            $this->broadcastToSoketi('chat.' . $request->input('room'), 'message', $messageData);

            Log::info('Soketi message sent', [
                'username' => $request->input('username'),
                'room' => $request->input('room'),
                'message_length' => strlen($request->input('message'))
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $messageData
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send Soketi message', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle user joining Soketi room
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function joinSoketiRoom(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|max:50',
                'room' => 'required|string|max:50',
                'user_type' => 'string|max:20',
                'joined_at' => 'string',
                'user_id' => 'string|max:100'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $username = $request->input('username');
            $room = $request->input('room');
            $userType = $request->input('user_type', 'customer');
            $joinedAt = $request->input('joined_at', now()->toISOString());
            $userId = $request->input('user_id', uniqid('user_'));

            // Store user in room (you might want to use Redis or database for this)
            $onlineCount = $this->addUserToRoom($username, $room);

            // Prepare user data for broadcast
            $userData = [
                'username' => $username,
                'room' => $room,
                'user_type' => $userType,
                'joined_at' => $joinedAt,
                'user_id' => $userId,
                'online_count' => $onlineCount,
                'timestamp' => now()->toISOString()
            ];

            // Broadcast to the specific room channel
            $this->broadcastToSoketi('chat.' . $room, 'user-joined', $userData);
            
            // Also broadcast to general channel for CS interface to monitor all customers
            if ($userType === 'customer') {
                $this->broadcastToSoketi('chat.general', 'user-joined', $userData);
            }

            Log::info('User joined Soketi room', [
                'username' => $username,
                'room' => $room,
                'user_type' => $userType,
                'user_id' => $userId,
                'online_count' => $onlineCount
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Joined room successfully',
                'data' => $userData
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to join Soketi room', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to join room',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle typing indicators for Soketi
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function handleSoketiTyping(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|max:50',
                'room' => 'required|string|max:50',
                'typing' => 'required|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $username = $request->input('username');
            $room = $request->input('room');
            $isTyping = $request->input('typing');

            $eventName = $isTyping ? 'typing' : 'stop-typing';
            
            // Broadcast typing indicator
            $this->broadcastToSoketi('chat.' . $room, $eventName, [
                'username' => $username,
                'timestamp' => now()->toISOString()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Typing indicator sent successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to handle Soketi typing', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to handle typing indicator',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Broadcast event to Soketi
     *
     * @param string $channel
     * @param string $event
     * @param array $data
     * @return void
     */
    private function broadcastToSoketi(string $channel, string $event, array $data): void
    {
        try {
            $appId = 'app-id';
            $appKey = 'app-key';
            $appSecret = 'app-secret';
            $timestamp = time();
            
            $bodyData = [
                'name' => $event,
                'channel' => $channel,
                'data' => json_encode($data)
            ];
            
            $body = json_encode($bodyData);
            
            // Create auth signature for Pusher protocol
            $stringToSign = "POST\n/apps/{$appId}/events\nauth_key={$appKey}&auth_timestamp={$timestamp}&auth_version=1.0&body_md5=" . md5($body);
            $authSignature = hash_hmac('sha256', $stringToSign, $appSecret);
            
            $client = new \GuzzleHttp\Client();
            
            $response = $client->post("http://soketi:6001/apps/{$appId}/events", [
                'headers' => [
                    'Content-Type' => 'application/json'
                ],
                'query' => [
                    'auth_key' => $appKey,
                    'auth_timestamp' => $timestamp,
                    'auth_version' => '1.0',
                    'auth_signature' => $authSignature,
                    'body_md5' => md5($body)
                ],
                'body' => $body
            ]);

            Log::debug('Soketi broadcast sent', [
                'channel' => $channel,
                'event' => $event,
                'status' => $response->getStatusCode(),
                'response' => $response->getBody()->getContents()
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to broadcast to Soketi', [
                'channel' => $channel,
                'event' => $event,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Add user to room and return online count
     *
     * @param string $username
     * @param string $room
     * @return int
     */
    private function addUserToRoom(string $username, string $room): int
    {
        // Simple implementation using cache
        // In production, you might want to use Redis with expiration
        $cacheKey = "chat_room_{$room}_users";
        $users = cache()->get($cacheKey, []);
        
        if (!in_array($username, $users)) {
            $users[] = $username;
            cache()->put($cacheKey, $users, now()->addHours(24));
        }
        
        return count($users);
    }

    /**
     * Send private message between customer service and customer
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function sendPrivateMessage(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'message' => 'required|string|max:1000',
                'channel' => 'required|string',
                'user_type' => 'required|string|in:agent,customer',
                'username' => 'required|string',
                'customer_id' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $messageData = [
                'message' => $request->input('message'),
                'username' => $request->input('username'),
                'user_type' => $request->input('user_type'),
                'timestamp' => now()->toISOString(),
                'customer_id' => $request->input('customer_id')
            ];

            // Broadcast to private channel
            $this->broadcastToSoketi(
                $request->input('channel'),
                'message',
                $messageData
            );

            Log::info('Private message sent', [
                'channel' => $request->input('channel'),
                'user_type' => $request->input('user_type'),
                'username' => $request->input('username')
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Private message sent successfully',
                'data' => $messageData
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send private message', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send private message: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send typing indicator for private chat
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function sendPrivateTyping(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'channel' => 'required|string',
                'user_type' => 'required|string|in:agent,customer',
                'username' => 'required|string',
                'typing' => 'required|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $typingData = [
                'username' => $request->input('username'),
                'user_type' => $request->input('user_type'),
                'typing' => $request->input('typing')
            ];

            $event = $request->input('typing') ? 'typing' : 'stop-typing';

            // Broadcast typing indicator to private channel
            $this->broadcastToSoketi(
                $request->input('channel'),
                $event,
                $typingData
            );

            return response()->json([
                'success' => true,
                'message' => 'Typing indicator sent successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send typing indicator', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send typing indicator: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Invite customer to private chat
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function inviteToPrivateChat(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'customer_id' => 'required|string',
                'customer_username' => 'required|string',
                'agent_name' => 'required|string',
                'channel_name' => 'required|string',
                'room' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $inviteData = [
                'customer_id' => $request->input('customer_id'),
                'customer_username' => $request->input('customer_username'),
                'agent_name' => $request->input('agent_name'),
                'channel_name' => $request->input('channel_name'),
                'room' => $request->input('room', 'general'),
                'timestamp' => now()->toISOString()
            ];

            // Broadcast invite to customer's specific room channel
            $customerRoom = $request->input('room', 'general');
            $this->broadcastToSoketi(
                "chat.{$customerRoom}", // Broadcast to customer's room
                'private-chat-invite',
                $inviteData
            );
            
            // Also broadcast agent-joined event to the private channel
            $this->broadcastToSoketi(
                $request->input('channel_name'), // Broadcast to private channel
                'agent-joined',
                [
                    'agent_name' => $request->input('agent_name'),
                    'timestamp' => now()->toISOString()
                ]
            );

            Log::info('Private chat invite sent', [
                'customer_id' => $request->input('customer_id'),
                'customer_username' => $request->input('customer_username'),
                'agent_name' => $request->input('agent_name'),
                'channel_name' => $request->input('channel_name'),
                'room' => $customerRoom
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Private chat invite sent successfully',
                'data' => $inviteData
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send private chat invite', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send private chat invite: ' . $e->getMessage()
            ], 500);
        }
    }
}