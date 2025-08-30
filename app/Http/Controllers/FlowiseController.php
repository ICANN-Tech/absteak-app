<?php

namespace App\Http\Controllers;

use App\Repositories\Flowise\FlowiseRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;
use RuntimeException;

/**
 * Flowise Controller
 * 
 * Handles HTTP requests for Flowise chat functionality.
 * Demonstrates proper usage of the FlowiseRepository through dependency injection.
 * 
 * @package App\Http\Controllers
 * @author ABSteak Development Team
 * @version 1.0.0
 */
class FlowiseController extends Controller
{
    /**
     * Flowise repository instance
     */
    private FlowiseRepositoryInterface $flowiseRepository;

    /**
     * Create a new controller instance
     *
     * @param FlowiseRepositoryInterface $flowiseRepository
     */
    public function __construct(FlowiseRepositoryInterface $flowiseRepository)
    {
        $this->flowiseRepository = $flowiseRepository;
    }

    /**
     * Create a new chat
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createChat(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'messages' => 'required|array|min:1',
                'messages.*.role' => 'required|string|in:user,assistant,system',
                'messages.*.content' => 'required|string|max:10000',
                'metadata' => 'sometimes|array',
                'metadata.user_id' => 'sometimes|integer|min:1',
                'metadata.session_id' => 'sometimes|string|max:255'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $chatData = $validator->validated();
            $chatId = $this->flowiseRepository->saveChat($chatData);

            return response()->json([
                'success' => true,
                'message' => 'Chat created successfully',
                'data' => [
                    'chat_id' => $chatId
                ]
            ], 201);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid chat data: ' . $e->getMessage()
            ], 400);
        } catch (RuntimeException $e) {
            Log::error('Failed to create chat', [
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create chat'
            ], 500);
        }
    }

    /**
     * Retrieve a chat by ID
     *
     * @param string $chatId
     * @return JsonResponse
     */
    public function getChat(string $chatId): JsonResponse
    {
        try {
            $chat = $this->flowiseRepository->getChat($chatId);

            if ($chat === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chat not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Chat retrieved successfully',
                'data' => $chat
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid chat ID: ' . $e->getMessage()
            ], 400);
        } catch (RuntimeException $e) {
            Log::error('Failed to retrieve chat', [
                'chat_id' => $chatId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve chat'
            ], 500);
        }
    }

    /**
     * Add a message to an existing chat
     *
     * @param Request $request
     * @param string $chatId
     * @return JsonResponse
     */
    public function addMessage(Request $request, string $chatId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'role' => 'required|string|in:user,assistant,system',
                'content' => 'required|string|max:10000'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $message = $validator->validated();
            $success = $this->flowiseRepository->addMessage($chatId, $message);

            if (!$success) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to add message'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Message added successfully'
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid data: ' . $e->getMessage()
            ], 400);
        } catch (RuntimeException $e) {
            Log::error('Failed to add message', [
                'chat_id' => $chatId,
                'error' => $e->getMessage(),
                'message_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to add message'
            ], 500);
        }
    }

    /**
     * Get chats for a specific user
     *
     * @param Request $request
     * @param int $userId
     * @return JsonResponse
     */
    public function getUserChats(Request $request, int $userId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'limit' => 'sometimes|integer|min:1|max:100',
                'offset' => 'sometimes|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $limit = $request->input('limit', 20);
            $offset = $request->input('offset', 0);

            $chats = $this->flowiseRepository->getUserChats($userId, $limit, $offset);

            return response()->json([
                'success' => true,
                'message' => 'User chats retrieved successfully',
                'data' => [
                    'chats' => $chats,
                    'pagination' => [
                        'limit' => $limit,
                        'offset' => $offset,
                        'count' => count($chats)
                    ]
                ]
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid parameters: ' . $e->getMessage()
            ], 400);
        } catch (RuntimeException $e) {
            Log::error('Failed to retrieve user chats', [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user chats'
            ], 500);
        }
    }

    /**
     * Delete a chat
     *
     * @param string $chatId
     * @return JsonResponse
     */
    public function deleteChat(string $chatId): JsonResponse
    {
        try {
            $deleted = $this->flowiseRepository->deleteChat($chatId);

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chat not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Chat deleted successfully'
            ]);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid chat ID: ' . $e->getMessage()
            ], 400);
        } catch (RuntimeException $e) {
            Log::error('Failed to delete chat', [
                'chat_id' => $chatId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete chat'
            ], 500);
        }
    }

    /**
     * Get chat statistics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getStats(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'sometimes|integer|min:1'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = $request->input('user_id');
            $stats = $this->flowiseRepository->getStats($userId);

            return response()->json([
                'success' => true,
                'message' => 'Statistics retrieved successfully',
                'data' => $stats
            ]);
        } catch (RuntimeException $e) {
            Log::error('Failed to retrieve stats', [
                'user_id' => $request->input('user_id'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics'
            ], 500);
        }
    }
}