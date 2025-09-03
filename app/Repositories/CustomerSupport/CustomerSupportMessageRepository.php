<?php

namespace App\Repositories\CustomerSupport;

use App\Models\Ticket;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Exception;

/**
 * Repository for handling Customer Support message operations.
 * Manages message sending, storing, and retrieval functionality.
 */
class CustomerSupportMessageRepository
{
    protected CustomerSupportBroadcastRepository $broadcastRepository;

    public function __construct(CustomerSupportBroadcastRepository $broadcastRepository)
    {
        $this->broadcastRepository = $broadcastRepository;
    }

    /**
     * Send a message in the context of a ticket.
     *
     * @param string $ticketId
     * @param string $message
     * @param array $context
     * @return array
     */
    public function sendMessage(string $ticketId, string $message, array $context = []): array
    {
        try {
            $ticket = Ticket::findOrFail($ticketId);
            
            // Prepare message data
            $messageData = [
                'id' => (string) Str::uuid(),
                'sender' => $context['sender'] ?? 'system',
                'sender_id' => $context['sender_id'] ?? null,
                'sender_name' => $context['sender_name'] ?? 'System',
                'message' => $message,
                'timestamp' => now(),
                'session_id' => $context['session_id'] ?? null,
                'message_type' => $context['message_type'] ?? 'text',
                'metadata' => $context['metadata'] ?? null,
            ];

            // Add message to ticket history
            $this->addMessageToTicket($ticketId, $messageData);
            
            // Record first response if this is from CS agent
            if (isset($context['sender']) && $context['sender'] === 'cs_agent') {
                $ticket->recordFirstResponse();
            }

            // Broadcast the new message
            $this->broadcastRepository->broadcastNewMessage($ticketId, $messageData);

            Log::info('Message sent successfully', [
                'ticket_id' => $ticketId,
                'sender' => $messageData['sender'],
                'message_id' => $messageData['id']
            ]);

            return [
                'success' => true,
                'message' => 'Message sent successfully',
                'ticket_id' => $ticketId,
                'message_id' => $messageData['id'],
                'timestamp' => $messageData['timestamp']->toISOString(),
            ];
        } catch (Exception $e) {
            Log::error('Failed to send message', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
                'message' => $message,
            ]);
            
            return [
                'success' => false,
                'error' => 'Failed to send message',
                'ticket_id' => $ticketId,
            ];
        }
    }

    /**
     * Add a message to a ticket's history.
     *
     * @param string $ticketId
     * @param array $messageData
     * @return bool
     */
    public function addMessageToTicket(string $ticketId, array $messageData): bool
    {
        try {
            $ticket = Ticket::findOrFail($ticketId);
            
            // Get existing chat session data
            $chatData = $ticket->chat_session_data ?? [];
            
            // Add new message to the history
            if (!isset($chatData['messages'])) {
                $chatData['messages'] = [];
            }
            
            $chatData['messages'][] = [
                'id' => $messageData['id'] ?? (string) Str::uuid(),
                'sender' => $messageData['sender'],
                'sender_id' => $messageData['sender_id'] ?? null,
                'sender_name' => $messageData['sender_name'] ?? null,
                'message' => $messageData['message'],
                'timestamp' => $messageData['timestamp']->toISOString(),
                'session_id' => $messageData['session_id'] ?? null,
                'message_type' => $messageData['message_type'] ?? 'text',
                'metadata' => $messageData['metadata'] ?? null,
            ];
            
            // Update last activity timestamp
            $chatData['last_activity'] = now()->toISOString();
            $chatData['message_count'] = count($chatData['messages']);
            
            // Update ticket
            $ticket->update([
                'chat_session_data' => $chatData,
                'updated_at' => now(),
            ]);

            Log::info('Message added to ticket history', [
                'ticket_id' => $ticketId,
                'message_id' => $messageData['id'] ?? 'unknown',
                'total_messages' => $chatData['message_count']
            ]);

            return true;
        } catch (Exception $e) {
            Log::error('Failed to add message to ticket', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
                'message_data' => $messageData,
            ]);
            return false;
        }
    }

    /**
     * Get messages for a specific ticket.
     *
     * @param string $ticketId
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function getTicketMessages(string $ticketId, int $limit = 50, int $offset = 0): array
    {
        try {
            $ticket = Ticket::findOrFail($ticketId);
            $chatData = $ticket->chat_session_data ?? [];
            $messages = $chatData['messages'] ?? [];

            // Apply pagination
            $totalMessages = count($messages);
            $paginatedMessages = array_slice($messages, $offset, $limit);

            return [
                'success' => true,
                'messages' => $paginatedMessages,
                'pagination' => [
                    'total' => $totalMessages,
                    'limit' => $limit,
                    'offset' => $offset,
                    'has_more' => ($offset + $limit) < $totalMessages
                ]
            ];
        } catch (Exception $e) {
            Log::error('Failed to get ticket messages', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
            ]);

            return [
                'success' => false,
                'error' => 'Failed to retrieve messages',
                'messages' => [],
                'pagination' => [
                    'total' => 0,
                    'limit' => $limit,
                    'offset' => $offset,
                    'has_more' => false
                ]
            ];
        }
    }

    /**
     * Get the latest message for a ticket.
     *
     * @param string $ticketId
     * @return array|null
     */
    public function getLatestMessage(string $ticketId): ?array
    {
        try {
            $ticket = Ticket::findOrFail($ticketId);
            $chatData = $ticket->chat_session_data ?? [];
            $messages = $chatData['messages'] ?? [];

            if (empty($messages)) {
                return null;
            }

            return end($messages);
        } catch (Exception $e) {
            Log::error('Failed to get latest message', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
            ]);
            return null;
        }
    }

    /**
     * Mark messages as read for a specific user.
     *
     * @param string $ticketId
     * @param string $userId
     * @param string $userType
     * @return bool
     */
    public function markMessagesAsRead(string $ticketId, string $userId, string $userType = 'cs_agent'): bool
    {
        try {
            $ticket = Ticket::findOrFail($ticketId);
            $chatData = $ticket->chat_session_data ?? [];

            // Update read status
            if (!isset($chatData['read_status'])) {
                $chatData['read_status'] = [];
            }

            $chatData['read_status'][$userType . '_' . $userId] = [
                'last_read_at' => now()->toISOString(),
                'user_id' => $userId,
                'user_type' => $userType
            ];

            $ticket->update([
                'chat_session_data' => $chatData
            ]);

            Log::info('Messages marked as read', [
                'ticket_id' => $ticketId,
                'user_id' => $userId,
                'user_type' => $userType
            ]);

            return true;
        } catch (Exception $e) {
            Log::error('Failed to mark messages as read', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
                'user_id' => $userId,
            ]);
            return false;
        }
    }

    /**
     * Get message statistics for a ticket.
     *
     * @param string $ticketId
     * @return array
     */
    public function getMessageStats(string $ticketId): array
    {
        try {
            $ticket = Ticket::findOrFail($ticketId);
            $chatData = $ticket->chat_session_data ?? [];
            $messages = $chatData['messages'] ?? [];

            $stats = [
                'total_messages' => count($messages),
                'customer_messages' => 0,
                'agent_messages' => 0,
                'system_messages' => 0,
                'first_message_at' => null,
                'last_message_at' => null,
                'average_response_time' => null,
            ];

            if (!empty($messages)) {
                $stats['first_message_at'] = $messages[0]['timestamp'] ?? null;
                $stats['last_message_at'] = end($messages)['timestamp'] ?? null;

                foreach ($messages as $message) {
                    switch ($message['sender']) {
                        case 'customer':
                            $stats['customer_messages']++;
                            break;
                        case 'cs_agent':
                            $stats['agent_messages']++;
                            break;
                        default:
                            $stats['system_messages']++;
                    }
                }
            }

            return $stats;
        } catch (Exception $e) {
            Log::error('Failed to get message statistics', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
            ]);
            return [];
        }
    }
}