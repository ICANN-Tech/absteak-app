<?php

namespace App\Repositories\Chat;

interface ChatServiceInterface
{
    /**
     * Initialize a new chat session for a guest user.
     */
    public function initializeGuestChat(array $guestData = []): array;

    /**
     * Initialize a new chat session for an authenticated user.
     */
    public function initializeUserChat(string $userId, array $userData = []): array;

    /**
     * Send a message to the chatbot.
     */
    public function sendMessageToBot(string $sessionId, string $message, array $context = []): array;

    /**
     * Handle transfer to customer service.
     */
    public function transferToCustomerService(string $sessionId, array $customerData = [], string $reason = ''): array;

    /**
     * Send a message to customer service.
     */
    public function sendMessageToCs(string $sessionId, string $ticketId, string $message, array $context = []): array;

    /**
     * Get available customer service agents.
     */
    public function getAvailableAgents(): array;

    /**
     * Create a chat session.
     */
    public function createChatSession(array $sessionData): array;

    /**
     * Transfer chat to customer service mode.
     */
    public function transferToCsMode(string $sessionId, array $transferData): array;
}