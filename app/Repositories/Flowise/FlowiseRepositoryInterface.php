<?php

namespace App\Repositories\Flowise;

/**
 * Flowise Repository Interface
 * 
 * Defines the contract for Flowise chat data repository implementations.
 * This interface ensures consistent behavior across different storage implementations
 * and follows the Repository pattern for clean architecture.
 * 
 * @package App\Repositories\Flowise
 * @author ABSteak Development Team
 * @version 1.0.0
 */
interface FlowiseRepositoryInterface
{
    /**
     * Save a new chat or update existing one
     *
     * @param array $chatData Chat data including messages and metadata
     * @param string|null $chatId Existing chat ID for updates, null for new chat
     * @return string Chat ID
     * @throws \InvalidArgumentException If chat data is invalid
     * @throws \RuntimeException If save operation fails
     */
    public function saveChat(array $chatData, ?string $chatId = null): string;

    /**
     * Retrieve a chat by ID
     *
     * @param string $chatId Chat ID
     * @param bool $useCache Whether to use Redis cache
     * @return array|null Chat data or null if not found
     * @throws \InvalidArgumentException If chat ID is invalid
     * @throws \RuntimeException If retrieval fails
     */
    public function getChat(string $chatId, bool $useCache = true): ?array;

    /**
     * Add a message to an existing chat
     *
     * @param string $chatId Chat ID
     * @param array $message Message data
     * @return bool True on success
     * @throws \InvalidArgumentException If chat ID or message is invalid
     * @throws \RuntimeException If operation fails
     */
    public function addMessage(string $chatId, array $message): bool;

    /**
     * Get all chats for a specific user
     *
     * @param int $userId User ID
     * @param int $limit Maximum number of chats to return
     * @param int $offset Offset for pagination
     * @return array Array of chat documents
     * @throws \InvalidArgumentException If user ID is invalid
     * @throws \RuntimeException If retrieval fails
     */
    public function getUserChats(int $userId, int $limit = 50, int $offset = 0): array;

    /**
     * Delete a chat by ID
     *
     * @param string $chatId Chat ID
     * @return bool True if deleted, false if not found
     * @throws \InvalidArgumentException If chat ID is invalid
     * @throws \RuntimeException If deletion fails
     */
    public function deleteChat(string $chatId): bool;

    /**
     * Get chat statistics
     *
     * @param int|null $userId Optional user ID to filter stats
     * @return array Statistics data
     * @throws \RuntimeException If stats retrieval fails
     */
    public function getStats(?int $userId = null): array;

    /**
     * Send message to Flowise chatbot
     *
     * @param string $message Message to send
     * @param string $chatbotType Type of chatbot (assistant, reservation, etc.)
     * @param string|null $chatflowId Specific chatflow ID to use
     * @return string Response from chatbot
     * @throws \InvalidArgumentException If message or chatbot type is invalid
     * @throws \RuntimeException If sending fails
     */
    public function sendMessage(string $message, string $chatbotType = 'assistant', ?string $chatflowId = null): string;

    /**
     * Test connection to Flowise service
     *
     * @return array Connection test results
     * @throws \RuntimeException If connection test fails
     */
    public function testConnection(): array;

    /**
     * Get available chat IDs from Flowise
     *
     * @return array Available chat IDs
     * @throws \RuntimeException If retrieval fails
     */
    public function getAvailableChatIds(): array;
}