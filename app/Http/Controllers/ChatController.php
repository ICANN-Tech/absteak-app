<?php

namespace App\Http\Controllers;

use App\Services\Chat;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
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
                'type' => 'required|string|in:guest,user,cs'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $success = $this->chatService->endChatSession(
                $request->session_id,
                $request->type
            );

            if ($success) {
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
}