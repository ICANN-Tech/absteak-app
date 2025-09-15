<?php

namespace App\Http\Controllers;

use App\Services\Chat;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Exception;

class ChatController extends Controller
{
    private Chat $chatService;

    public function __construct(Chat $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * Initialize chat for guest users
     */
    public function initializeGuestChat(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'guest_name' => 'nullable|string|max:50'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $chatData = $this->chatService->initializeGuestChat($request->guest_name);

            return response()->json([
                'success' => true,
                'message' => 'Guest chat initialized successfully',
                'data' => $chatData
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize guest chat: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Initialize chat for authenticated users
     */
    public function initializeUserChat(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            $chatData = $this->chatService->initializeUserChat($user);

            return response()->json([
                'success' => true,
                'message' => 'User chat initialized successfully',
                'data' => $chatData
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize user chat: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Initialize chat for customer service staff
     */
    public function initializeCustomerServiceChat(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            // Check if user has customer service role (adjust based on your role system)
            // This is a placeholder - implement according to your authorization logic
            if (!$this->isCustomerService($user)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Customer service access required'
                ], 403);
            }

            $chatData = $this->chatService->initializeCustomerServiceChat($user);

            return response()->json([
                'success' => true,
                'message' => 'Customer service chat initialized successfully',
                'data' => $chatData
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize customer service chat: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send a message
     */
    public function sendMessage(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'from' => 'required|string',
                'to' => 'required|string',
                'message' => 'required|string|max:1000'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $success = $this->chatService->sendMessage(
                $request->from,
                $request->to,
                $request->message
            );

            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Message sent successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send message'
                ], 500);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * End chat session
     */
    public function endChatSession(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'session_id' => 'required|string',
                'type' => 'required|string|in:guest,user,cs',
                'customer_id' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $sessionId = $request->session_id;
            $type = $request->type;
            $customerId = $request->customer_id;

            // Get session data before ending to notify CS if needed
            $cacheKey = "chat_{$type}_{$sessionId}";
            $session = Cache::get($cacheKey);

            $success = $this->chatService->endChatSession($sessionId, $type);

            if ($success) {
                // If customer ends chat and has assigned CS, notify CS about customer disconnect
                if ($type === 'guest' && $session && isset($session['assigned_cs'])) {
                    try {
                        // Broadcast customer disconnect event to CS interface
                        $this->broadcastToSoketi('chat.general', 'user-left', [
                            'user_id' => $customerId ?: $sessionId,
                            'username' => $session['guest_data']['name'] ?? 'Guest User',
                            'user_type' => 'customer',
                            'session_id' => $sessionId,
                            'timestamp' => now()->toISOString(),
                            'reason' => 'customer_ended_chat'
                        ]);

                        Log::info('Customer disconnect notification sent to CS', [
                            'session_id' => $sessionId,
                            'customer_id' => $customerId,
                            'assigned_cs' => $session['assigned_cs']['id'] ?? null
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Failed to notify CS about customer disconnect', [
                            'error' => $e->getMessage(),
                            'session_id' => $sessionId
                        ]);
                    }
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Chat session ended successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to end chat session'
                ], 500);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to end chat session: ' . $e->getMessage()
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
        Log::info('📡 [WEBSOCKET DEBUG] Starting Soketi broadcast', [
            'channel' => $channel,
            'event' => $event,
            'data' => $data,
            'timestamp' => now()->toISOString()
        ]);
        
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
            
            Log::info('🔐 [WEBSOCKET DEBUG] Preparing authentication', [
                'app_id' => $appId,
                'timestamp' => $timestamp,
                'body_size' => strlen($body)
            ]);
            
            // Create auth signature for Pusher protocol
            $stringToSign = "POST\n/apps/{$appId}/events\nauth_key={$appKey}&auth_timestamp={$timestamp}&auth_version=1.0&body_md5=" . md5($body);
            $authSignature = hash_hmac('sha256', $stringToSign, $appSecret);
            
            $client = new \GuzzleHttp\Client();
            
            Log::info('📤 [WEBSOCKET DEBUG] Sending request to Soketi', [
                'url' => "http://soketi:6001/apps/{$appId}/events",
                'body_data' => $bodyData
            ]);
            
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
                'body' => $body,
                'timeout' => 5
            ]);
            
            Log::info('✅ [WEBSOCKET DEBUG] Soketi broadcast successful', [
                'channel' => $channel,
                'event' => $event,
                'status' => $response->getStatusCode(),
                'response_body' => $response->getBody()->getContents()
            ]);
            
        } catch (\Exception $e) {
            Log::error('❌ [WEBSOCKET DEBUG] Soketi broadcast failed', [
                'channel' => $channel,
                'event' => $event,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Get available customer service staff
     */
    public function getAvailableCustomerService(): JsonResponse
    {
        try {
            $availableCs = $this->chatService->getAvailableCustomerService();

            return response()->json([
                'success' => true,
                'data' => $availableCs
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get available customer service: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get chat statistics
     */
    public function getChatStatistics(): JsonResponse
    {
        try {
            $stats = $this->chatService->getChatStatistics();

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get chat statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign customer service to guest
     */
    public function assignCustomerService(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'guest_id' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $assignedCs = $this->chatService->assignCustomerService($request->guest_id);

            if ($assignedCs) {
                return response()->json([
                    'success' => true,
                    'message' => 'Customer service assigned successfully',
                    'data' => $assignedCs
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No customer service available'
                ], 404);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign customer service: ' . $e->getMessage()
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
                'status' => 'required|string|in:online,offline,busy'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            $result = $this->chatService->updateAgentStatus($request->status);
            
            return response()->json([
                'success' => true,
                'message' => 'Agent status updated successfully',
                'data' => $result
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update agent status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test connection to chat service
     */
    public function testConnection(): JsonResponse
    {
        try {
            // Simple health check - no need to call service method
             $result = ['status' => 'healthy', 'service' => 'chatwoot'];
            
            return response()->json([
                'success' => true,
                'message' => 'Connection successful',
                'data' => $result,
                'timestamp' => now()
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Connection test failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if user is customer service staff
     * Implement this method according to your role/permission system
     */
    private function isCustomerService($user): bool
    {
        // Example implementation - adjust based on your role system
        // You might check user roles, permissions, or specific fields
        
        // Option 1: Check if user has a specific role
        // return $user->hasRole('customer_service');
        
        // Option 2: Check user type or department
        // return $user->department === 'customer_service';
        
        // Option 3: Check permissions
        // return $user->can('handle_customer_chat');
        
        // For now, return true for demonstration
        // Replace this with your actual authorization logic
        return true;
    }

    /**
     * Trigger end chat for bidirectional synchronization
     */
    public function triggerEndChat(Request $request)
    {
        Log::info('🔚 [BACKEND DEBUG] triggerEndChat called', [
            'request_data' => $request->all(),
            'timestamp' => now()->toISOString()
        ]);
        
        $request->validate([
            'customer_id' => 'required|string',
            'session_id' => 'required|string',
            'trigger_source' => 'required|string|in:cs,customer',
            'agent_name' => 'nullable|string'
        ]);

        $customerId = $request->input('customer_id');
        $sessionId = $request->input('session_id');
        $triggerSource = $request->input('trigger_source');
        $agentName = $request->input('agent_name');
        
        Log::info('📝 [BACKEND DEBUG] Validated request data', [
            'customer_id' => $customerId,
            'session_id' => $sessionId,
            'trigger_source' => $triggerSource,
            'agent_name' => $agentName
        ]);

        try {
            // Get session data from cache
            $sessionData = Cache::get("chat_session_{$sessionId}");
            
            Log::info('💾 [BACKEND DEBUG] Session data retrieved', [
                'session_exists' => !is_null($sessionData),
                'session_data' => $sessionData ? array_keys($sessionData) : null
            ]);
            
            if ($sessionData) {
                if ($triggerSource === 'cs') {
                    Log::info('👨‍💼 [BACKEND DEBUG] Processing CS triggered end chat');
                    
                    $broadcastData = [
                        'message' => 'Chat session ended by Customer Service agent',
                        'trigger_source' => 'cs',
                        'agent_name' => $agentName,
                        'timestamp' => now()->toISOString()
                    ];
                    
                    Log::info('📤 [BACKEND DEBUG] Broadcasting to customer channel', [
                        'channel' => "private-chat.{$customerId}",
                        'event' => 'force-end-chat',
                        'data' => $broadcastData
                    ]);
                    
                    // CS triggered end - send trigger to customer
                    $this->broadcastToSoketi(
                        "private-chat.{$customerId}",
                        'force-end-chat',
                        $broadcastData
                    );
                    
                    Log::info("✅ [BACKEND DEBUG] CS triggered end chat for customer: {$customerId}");
                } else {
                    Log::info('👤 [BACKEND DEBUG] Processing customer triggered end chat');
                    
                    // Customer triggered end - send trigger to CS
                    $csAgentId = $sessionData['cs_agent_id'] ?? null;
                    
                    Log::info('🔍 [BACKEND DEBUG] Checking for CS agent in session', [
                        'cs_agent_id' => $csAgentId,
                        'session_data_keys' => array_keys($sessionData)
                    ]);
                    
                    if ($csAgentId) {
                        // Use the same private channel format as CS: chat.private.{customerId}.{agentId}
                        $privateChannelName = "chat.private.{$customerId}.{$csAgentId}";
                        
                        $broadcastData = [
                            'session_id' => $sessionId,
                            'customer_id' => $customerId,
                            'message' => 'Chat session ended by customer',
                            'trigger_source' => 'customer',
                            'timestamp' => now()->toISOString()
                        ];
                        
                        Log::info('📤 [BACKEND DEBUG] Broadcasting to CS private channel', [
                            'channel' => $privateChannelName,
                            'event' => 'force-end-chat',
                            'data' => $broadcastData,
                            'soketi_config' => [
                                'host' => config('broadcasting.connections.pusher.options.host'),
                                'port' => config('broadcasting.connections.pusher.options.port')
                            ]
                        ]);
                        
                        try {
                            $broadcastResult = $this->broadcastToSoketi(
                                $privateChannelName,
                                'force-end-chat',
                                $broadcastData
                            );
                            
                            Log::info('✅ [BACKEND DEBUG] Broadcast result:', [
                                'success' => true,
                                'channel' => $privateChannelName,
                                'cs_agent_id' => $csAgentId
                            ]);
                        } catch (\Exception $e) {
                            Log::error('❌ [BACKEND DEBUG] Broadcast failed:', [
                                'error' => $e->getMessage(),
                                'channel' => $privateChannelName,
                                'cs_agent_id' => $csAgentId
                            ]);
                        }
                        
                        Log::info("✅ [BACKEND DEBUG] Customer triggered end chat for CS agent: {$csAgentId}");
                    } else {
                        Log::warning('⚠️ [BACKEND DEBUG] No CS agent found in session data', [
                            'session_data' => $sessionData
                        ]);
                    }
                }
                
                Log::info('🔚 [BACKEND DEBUG] Ending chat session via service');
                // End the session using existing service
                $this->chatService->endChatSession($sessionId);
                Log::info('✅ [BACKEND DEBUG] Chat session ended successfully');
            } else {
                Log::warning('⚠️ [BACKEND DEBUG] No session data found for session_id: ' . $sessionId);
            }

            Log::info('✅ [BACKEND DEBUG] triggerEndChat completed successfully');
            return response()->json([
                'success' => true,
                'message' => 'Chat end trigger sent successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('❌ [BACKEND DEBUG] Failed to trigger end chat: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to trigger end chat'
            ], 500);
        }
    }

    /**
     * Trigger end chat from customer side (simplified version for guest users)
     */
    public function triggerCustomerEndChat(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'session_id' => 'required|string',
                'trigger_source' => 'required|string|in:customer'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $sessionId = $request->session_id;
            $triggerSource = $request->trigger_source;
            
            Log::info('🔚 [triggerCustomerEndChat] Customer initiated end chat', [
                'session_id' => $sessionId,
                'trigger_source' => $triggerSource,
                'request_data' => $request->all(),
                'timestamp' => now()->toISOString()
            ]);

            // Get session data from cache
            $cacheKey = "chat_session_{$sessionId}";
            $sessionData = Cache::get($cacheKey);
            
            Log::info('🔍 [triggerCustomerEndChat] Session data lookup', [
                'cache_key' => $cacheKey,
                'session_found' => !is_null($sessionData),
                'session_data' => $sessionData
            ]);
            
            if ($sessionData) {
                // Customer triggered end - send trigger to CS if there's an active CS agent
                $csAgentId = $sessionData['cs_agent_id'] ?? null;
                
                Log::info('🔍 [triggerCustomerEndChat] Checking for CS agent', [
                    'cs_agent_id' => $csAgentId,
                    'has_cs_agent' => !is_null($csAgentId)
                ]);
                
                if ($csAgentId) {
                    // Use the same channel format as CS: chat.private.{customerId}.{agentId}
                    $privateChannelName = "chat.private.{$sessionId}.{$csAgentId}";
                    
                    $broadcastData = [
                        'customer_id' => $sessionData['customer_id'] ?? $sessionId,
                        'message' => 'Chat session ended by customer',
                        'trigger_source' => 'customer',
                        'timestamp' => now()->toISOString()
                    ];
                    
                    Log::info('📤 [triggerCustomerEndChat] Broadcasting to CS private channel', [
                        'channel' => $privateChannelName,
                        'event' => 'force-end-chat',
                        'data' => $broadcastData
                    ]);
                    
                    try {
                        $this->broadcastToSoketi(
                            $privateChannelName,
                            'force-end-chat',
                            $broadcastData
                        );
                        
                        Log::info("✅ [triggerCustomerEndChat] Successfully broadcasted to CS agent on channel: {$privateChannelName}");
                    } catch (\Exception $broadcastError) {
                        Log::error('❌ [triggerCustomerEndChat] Failed to broadcast to CS agent', [
                            'channel' => $privateChannelName,
                            'error' => $broadcastError->getMessage(),
                            'trace' => $broadcastError->getTraceAsString()
                        ]);
                    }
                } else {
                    Log::info('ℹ️ [triggerCustomerEndChat] No CS agent found, skipping broadcast');
                }
                
                // End the session using existing service
                $this->chatService->endChatSession($sessionId);
                Log::info('✅ [triggerCustomerEndChat] Chat session ended successfully');
            } else {
                Log::warning('⚠️ [triggerCustomerEndChat] No session data found for session_id: ' . $sessionId);
            }

            return response()->json([
                'success' => true,
                'message' => 'Chat ended successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('❌ [triggerCustomerEndChat] Failed to end chat: ' . $e->getMessage(), [
                'exception' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to end chat'
            ], 500);
        }
    }
}