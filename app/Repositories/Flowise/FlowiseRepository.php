<?php

namespace App\Repositories\Flowise;

use App\Services\Mongo;
use App\Services\Redis;
use App\Services\Vault;
use Exception;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use RuntimeException;

/**
 * Flowise Repository
 * 
 * Repository pattern implementation for managing Flowise chat data.
 * Provides a clean abstraction layer for chat operations using MongoDB for persistence,
 * Redis for caching, and Vault for configuration management.
 * 
 * Usage Examples:
 * 
 * // Basic chat operations
 * $repository = new FlowiseRepository();
 * 
 * // Save a new chat
 * $chatData = [
 *     'messages' => [
 *         ['role' => 'user', 'content' => 'Hello'],
 *         ['role' => 'assistant', 'content' => 'Hi there!']
 *     ],
 *     'metadata' => ['user_id' => 123, 'session_id' => 'abc123']
 * ];
 * $chatId = $repository->saveChat($chatData);
 * 
 * // Retrieve a chat
 * $chat = $repository->getChat($chatId);
 * 
 * // Update chat with new messages
 * $repository->addMessage($chatId, ['role' => 'user', 'content' => 'How are you?']);
 * 
 * // Get chat history for a user
 * $userChats = $repository->getUserChats(123);
 * 
 * @package App\Repositories
 * @author ABSteak Development Team
 * @version 1.0.0
 */
class FlowiseRepository implements FlowiseRepositoryInterface
{
    /**
     * MongoDB service instance
     */
    private Mongo $mongo;

    /**
     * Redis service instance
     */
    private Redis $redis;

    /**
     * Vault service instance
     */
    private Vault $vault;

    /**
     * Collection name for chats
     */
    private string $chatCollection;

    /**
     * Redis key prefix for chat caching
     */
    private string $cachePrefix;

    /**
     * Cache TTL in seconds
     */
    private int $cacheTtl;

    /**
     * Maximum messages per chat
     */
    private int $maxMessages;

    /**
     * Create a new Flowise repository instance
     *
     * @param Mongo|null $mongo MongoDB service instance
     * @param Redis|null $redis Redis service instance
     * @param Vault|null $vault Vault service instance
     * @throws RuntimeException If services cannot be initialized
     */
    public function __construct(?Mongo $mongo = null, ?Redis $redis = null, ?Vault $vault = null)
    {
        $this->mongo = $mongo ?? new Mongo();
        $this->redis = $redis ?? new Redis();
        $this->vault = $vault ?? new Vault();
        
        $this->initializeConfiguration();
        $this->ensureIndexes();
    }

    /**
     * Save a new chat or update existing one
     *
     * @param array $chatData Chat data including messages and metadata
     * @param string|null $chatId Existing chat ID for updates, null for new chat
     * @return string Chat ID
     * @throws InvalidArgumentException If chat data is invalid
     * @throws RuntimeException If save operation fails
     */
    public function saveChat(array $chatData, ?string $chatId = null): string
    {
        $this->validateChatData($chatData);

        try {
            $document = $this->prepareChatDocument($chatData);
            
            if ($chatId) {
                // Update existing chat using custom _id
                $document['_id'] = $chatId;
                $result = $this->mongo->updateMany($this->chatCollection, ['_id' => $chatId], [
                    '$set' => $document
                ]);
                
                if ($result->getModifiedCount() === 0) {
                    // Chat doesn't exist, create it with the specified ID
                    $result = $this->mongo->insert($this->chatCollection, $document);
                    Log::info('Flowise: New chat created with specified ID', [
                        'chat_id' => $chatId,
                        'message_count' => count($chatData['messages'] ?? [])
                    ]);
                } else {
                    Log::info('Flowise: Chat updated successfully', [
                        'chat_id' => $chatId,
                        'message_count' => count($chatData['messages'] ?? [])
                    ]);
                }
                
                $this->invalidateCache($chatId);
                return $chatId;
            } else {
                // Create new chat with auto-generated ObjectId
                $result = $this->mongo->insert($this->chatCollection, $document);
                $newChatId = (string) $result->getInsertedId();
                
                Log::info('Flowise: New chat created', [
                    'chat_id' => $newChatId,
                    'message_count' => count($chatData['messages'] ?? [])
                ]);
                
                return $newChatId;
            }
        } catch (Exception $e) {
            Log::error('Flowise: Failed to save chat', [
                'chat_id' => $chatId,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to save chat: {$e->getMessage()}",
                0,
                $e
            );
        }
    }

    /**
     * Retrieve a chat by ID
     *
     * @param string $chatId Chat ID
     * @param bool $useCache Whether to use Redis cache
     * @return array|null Chat data or null if not found
     * @throws InvalidArgumentException If chat ID is invalid
     * @throws RuntimeException If retrieval fails
     */
    public function getChat(string $chatId, bool $useCache = true): ?array
    {
        $this->validateChatId($chatId);

        try {
            // Try cache first if enabled
            if ($useCache) {
                $cacheKey = $this->getCacheKey($chatId);
                $cachedChat = $this->redis->get($cacheKey);
                
                if ($cachedChat !== null) {
                    Log::debug('Flowise: Chat retrieved from cache', ['chat_id' => $chatId]);
                    return $cachedChat;
                }
            }

            // Retrieve from MongoDB
            $chat = $this->mongo->findById($this->chatCollection, $chatId);
            
            if ($chat === null) {
                return null;
            }

            // Cache the result if caching is enabled
            if ($useCache) {
                $cacheKey = $this->getCacheKey($chatId);
                $this->redis->set($cacheKey, $chat, $this->cacheTtl);
            }

            Log::debug('Flowise: Chat retrieved from database', ['chat_id' => $chatId]);
            return $chat;
        } catch (Exception $e) {
            Log::error('Flowise: Failed to retrieve chat', [
                'chat_id' => $chatId,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to retrieve chat {$chatId}: {$e->getMessage()}",
                0,
                $e
            );
        }
    }

    /**
     * Add a message to an existing chat
     *
     * @param string $chatId Chat ID
     * @param array $message Message data
     * @return bool True on success
     * @throws InvalidArgumentException If chat ID or message is invalid
     * @throws RuntimeException If operation fails
     */
    public function addMessage(string $chatId, array $message): bool
    {
        $this->validateChatId($chatId);
        $this->validateMessage($message);

        try {
            // Check if chat exists and get current message count
            $chat = $this->getChat($chatId, false);
            if ($chat === null) {
                throw new RuntimeException("Chat {$chatId} not found");
            }

            $currentMessages = $chat['messages'] ?? [];
            if (count($currentMessages) >= $this->maxMessages) {
                throw new RuntimeException("Chat {$chatId} has reached maximum message limit");
            }

            // Add timestamp to message
            // Add timestamp to message
            $message['timestamp'] = time();

            // Update chat with new message
            $result = $this->mongo->updateById($this->chatCollection, $chatId, [
                '$push' => ['messages' => $message],
                '$set' => ['last_message_at' => time()]
            ]);

            if ($result->getModifiedCount() === 0) {
                throw new RuntimeException("Failed to add message to chat {$chatId}");
            }

            // Invalidate cache
            $this->invalidateCache($chatId);

            Log::info('Flowise: Message added to chat', [
                'chat_id' => $chatId,
                'message_role' => $message['role'] ?? 'unknown'
            ]);

            return true;
        } catch (Exception $e) {
            Log::error('Flowise: Failed to add message', [
                'chat_id' => $chatId,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to add message to chat {$chatId}: {$e->getMessage()}",
                0,
                $e
            );
        }
    }

    /**
     * Get all chats for a specific user
     *
     * @param int $userId User ID
     * @param int $limit Maximum number of chats to return
     * @param int $offset Offset for pagination
     * @return array Array of chat documents
     * @throws InvalidArgumentException If user ID is invalid
     * @throws RuntimeException If retrieval fails
     */
    public function getUserChats(int $userId, int $limit = 50, int $offset = 0): array
    {
        if ($userId <= 0) {
            throw new InvalidArgumentException('User ID must be a positive integer');
        }

        if ($limit <= 0 || $limit > 100) {
            throw new InvalidArgumentException('Limit must be between 1 and 100');
        }

        try {
            $filter = ['metadata.user_id' => $userId];
            $options = [
                'sort' => ['last_message_at' => -1, 'created_at' => -1],
                'limit' => $limit,
                'skip' => $offset,
                'projection' => [
                    'messages' => ['$slice' => -1], // Only last message for preview
                    'metadata' => 1,
                    'created_at' => 1,
                    'updated_at' => 1,
                    'last_message_at' => 1
                ]
            ];

            $chats = $this->mongo->find($this->chatCollection, $filter, $options);

            Log::debug('Flowise: Retrieved user chats', [
                'user_id' => $userId,
                'count' => count($chats),
                'limit' => $limit,
                'offset' => $offset
            ]);

            return $chats;
        } catch (Exception $e) {
            Log::error('Flowise: Failed to retrieve user chats', [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to retrieve chats for user {$userId}: {$e->getMessage()}",
                0,
                $e
            );
        }
    }

    /**
     * Delete a chat by ID
     *
     * @param string $chatId Chat ID
     * @return bool True if deleted, false if not found
     * @throws InvalidArgumentException If chat ID is invalid
     * @throws RuntimeException If deletion fails
     */
    public function deleteChat(string $chatId): bool
    {
        $this->validateChatId($chatId);

        try {
            $result = $this->mongo->deleteById($this->chatCollection, $chatId);
            $deleted = $result->getDeletedCount() > 0;

            if ($deleted) {
                $this->invalidateCache($chatId);
                Log::info('Flowise: Chat deleted', ['chat_id' => $chatId]);
            }

            return $deleted;
        } catch (Exception $e) {
            Log::error('Flowise: Failed to delete chat', [
                'chat_id' => $chatId,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to delete chat {$chatId}: {$e->getMessage()}",
                0,
                $e
            );
        }
    }

    /**
     * Get chat statistics
     *
     * @param int|null $userId Optional user ID to filter stats
     * @return array Statistics data
     * @throws RuntimeException If stats retrieval fails
     */
    public function getStats(?int $userId = null): array
    {
        try {
            $pipeline = [];
            
            if ($userId) {
                $pipeline[] = ['$match' => ['metadata.user_id' => $userId]];
            }
            
            $pipeline[] = [
                '$group' => [
                    '_id' => null,
                    'total_chats' => ['$sum' => 1],
                    'total_messages' => ['$sum' => ['$size' => '$messages']],
                    'avg_messages_per_chat' => ['$avg' => ['$size' => '$messages']],
                    'latest_chat' => ['$max' => '$created_at']
                ]
            ];

            // Get basic stats using simple queries
            $filter = $userId ? ['metadata.user_id' => $userId] : [];
            $totalChats = $this->mongo->count($this->chatCollection, $filter);
            
            // Get latest chat
            $latestChats = $this->mongo->find($this->chatCollection, $filter, [
                'sort' => ['created_at' => -1],
                'limit' => 1,
                'projection' => ['created_at' => 1]
            ]);
            
            $latestChat = !empty($latestChats) ? $latestChats[0]['created_at'] : null;
            
            return [
                'total_chats' => $totalChats,
                'total_messages' => 0, // Would require aggregation to calculate accurately
                'avg_messages_per_chat' => 0, // Would require aggregation to calculate accurately
                'latest_chat' => $latestChat
            ];
        } catch (Exception $e) {
            Log::error('Flowise: Failed to retrieve stats', [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            
            throw new RuntimeException(
                "Failed to retrieve chat statistics: {$e->getMessage()}",
                0,
                $e
            );
        }
    }

    /**
     * Initialize configuration from Vault
     */
    private function initializeConfiguration(): void
    {
        $this->chatCollection = $this->vault->getSecret('flowise.chat_collection', 'flowise_chats');
        $this->cachePrefix = $this->vault->getSecret('flowise.cache_prefix', 'flowise:chat:');
        $this->cacheTtl = $this->vault->getSecret('flowise.cache_ttl', 3600); // 1 hour
        $this->maxMessages = $this->vault->getSecret('flowise.max_messages', 1000);
    }

    /**
     * Ensure required database indexes exist
     */
    private function ensureIndexes(): void
    {
        try {
            // Index for user chats lookup
            $this->mongo->createIndex($this->chatCollection, ['metadata.user_id' => 1]);
            
            // Index for sorting by last message time
            $this->mongo->createIndex($this->chatCollection, ['last_message_at' => -1]);
            
            // Compound index for user chats with sorting
            $this->mongo->createIndex($this->chatCollection, [
                'metadata.user_id' => 1,
                'last_message_at' => -1
            ]);
        } catch (Exception $e) {
            Log::warning('Flowise: Failed to create indexes', [
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Validate chat data structure
     */
    private function validateChatData(array $chatData): void
    {
        if (!isset($chatData['messages']) || !is_array($chatData['messages'])) {
            throw new InvalidArgumentException('Chat data must contain a messages array');
        }

        if (count($chatData['messages']) > $this->maxMessages) {
            throw new InvalidArgumentException("Too many messages (max: {$this->maxMessages})");
        }

        foreach ($chatData['messages'] as $index => $message) {
            if (!is_array($message)) {
                throw new InvalidArgumentException("Message at index {$index} must be an array");
            }
            $this->validateMessage($message);
        }
    }

    /**
     * Validate individual message structure
     */
    private function validateMessage(array $message): void
    {
        if (!isset($message['role']) || !is_string($message['role'])) {
            throw new InvalidArgumentException('Message must have a role field');
        }

        if (!isset($message['content']) || !is_string($message['content'])) {
            throw new InvalidArgumentException('Message must have a content field');
        }

        $allowedRoles = ['user', 'assistant', 'system'];
        if (!in_array($message['role'], $allowedRoles)) {
            throw new InvalidArgumentException('Message role must be one of: ' . implode(', ', $allowedRoles));
        }
    }

    /**
     * Validate chat ID format
     */
    private function validateChatId(string $chatId): void
    {
        if (empty($chatId)) {
            throw new InvalidArgumentException('Chat ID cannot be empty');
        }

        // Validate UUID format (used by Laravel Str::uuid()) or ObjectId format
        $uuidPattern = '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i';
        $objectIdPattern = '/^[a-f\d]{24}$/i';
        
        if (!preg_match($uuidPattern, $chatId) && !preg_match($objectIdPattern, $chatId)) {
            throw new InvalidArgumentException('Invalid chat ID format');
        }
    }

    /**
     * Prepare chat document for storage
     */
    private function prepareChatDocument(array $chatData): array
    {
        $document = [
            'messages' => $chatData['messages'],
            'metadata' => $chatData['metadata'] ?? [],
            'last_message_at' => time()
        ];

        // Add timestamps to messages if not present
        foreach ($document['messages'] as &$message) {
            if (!isset($message['timestamp'])) {
                $message['timestamp'] = time();
            }
        }

        return $document;
    }

    /**
     * Get Redis cache key for chat
     */
    private function getCacheKey(string $chatId): string
    {
        return $this->cachePrefix . $chatId;
    }

    /**
     * Invalidate chat cache
     */
    private function invalidateCache(string $chatId): void
    {
        $cacheKey = $this->getCacheKey($chatId);
        $this->redis->delete($cacheKey);
    }

    /**
     * Send message to Flowise chatbot
     *
     * @param string $message Message to send
     * @param string $chatbotType Type of chatbot (assistant, reservation, etc.)
     * @param string|null $chatflowId Specific chatflow ID to use
     * @return string Response from chatbot
     * @throws InvalidArgumentException If message or chatbot type is invalid
     * @throws RuntimeException If sending fails
     */
    public function sendMessage(string $message, string $chatbotType = 'assistant', ?string $chatflowId = null): string
    {
        if (empty($message)) {
            throw new InvalidArgumentException('Message cannot be empty');
        }

        if (empty($chatbotType)) {
            throw new InvalidArgumentException('Chatbot type cannot be empty');
        }

        try {
            // Get Flowise service instance
            $flowiseService = app(\App\Services\Flowise::class);

            // Send message based on chatbot type or specific chatflow ID
            if ($chatflowId) {
                $response = $flowiseService->chatWithConfigKey($message, $chatflowId);
            } elseif ($chatbotType === 'reservation') {
                $response = $flowiseService->chatWithReservation($message);
            } else {
                $response = $flowiseService->chatWithAssistant($message);
            }

            Log::info('Message sent to Flowise', [
                'message_length' => strlen($message),
                'chatbot_type' => $chatbotType,
                'chatflow_id' => $chatflowId,
                'response_length' => strlen($response)
            ]);

            return $response;
        } catch (Exception $e) {
            Log::error('Failed to send message to Flowise', [
                'message' => $message,
                'chatbot_type' => $chatbotType,
                'chatflow_id' => $chatflowId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new RuntimeException('Failed to send message to chatbot: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Test connection to Flowise service
     *
     * @return array Connection test results
     * @throws RuntimeException If connection test fails
     */
    public function testConnection(): array
    {
        try {
            $flowiseService = app(\App\Services\Flowise::class);
            return $flowiseService->testConnection();
        } catch (Exception $e) {
            Log::error('Flowise connection test failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new RuntimeException('Connection test failed: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Get available chat IDs from Flowise
     *
     * @return array Available chat IDs
     * @throws RuntimeException If retrieval fails
     */
    public function getAvailableChatIds(): array
    {
        try {
            $flowiseService = app(\App\Services\Flowise::class);
            return $flowiseService->getAvailableChatIds();
        } catch (Exception $e) {
            Log::error('Failed to get available chat IDs', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new RuntimeException('Failed to get available chat IDs: ' . $e->getMessage(), 0, $e);
        }
    }
}