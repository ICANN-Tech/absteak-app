<?php

namespace App\Repositories\CustomerSupport;

use App\Models\Ticket;
use App\Events\NewTicketCreated;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * Repository for handling Customer Support broadcast operations.
 * Manages real-time events and notifications for the CS dashboard.
 */
class CustomerSupportBroadcastRepository
{
    /**
     * Broadcast new ticket event to CS dashboard.
     *
     * @param Ticket $ticket
     * @return void
     */
    public function broadcastNewTicket(Ticket $ticket): void
    {
        try {
            // Format ticket data for broadcasting
            $ticketData = $this->formatTicketForBroadcast($ticket);

            // Broadcast new ticket event
            broadcast(new NewTicketCreated($ticketData));

            Log::info('New ticket broadcasted to CS dashboard', [
                'ticket_id' => $ticket->id,
                'ticket_number' => $ticket->ticket_number
            ]);
        } catch (Exception $e) {
            Log::error('Failed to broadcast new ticket', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticket->id ?? 'unknown'
            ]);
        }
    }

    /**
     * Broadcast ticket assignment event.
     *
     * @param Ticket $ticket
     * @return void
     */
    public function broadcastTicketAssignment(Ticket $ticket): void
    {
        try {
            $ticketData = $this->formatTicketForBroadcast($ticket);
            
            // You can create a specific event for ticket assignment
            // For now, using the same event structure
            broadcast(new NewTicketCreated($ticketData));

            Log::info('Ticket assignment broadcasted', [
                'ticket_id' => $ticket->id,
                'assigned_to' => $ticket->assignedCs?->name
            ]);
        } catch (Exception $e) {
            Log::error('Failed to broadcast ticket assignment', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticket->id
            ]);
        }
    }

    /**
     * Broadcast ticket status update event.
     *
     * @param Ticket $ticket
     * @param string $oldStatus
     * @return void
     */
    public function broadcastTicketStatusUpdate(Ticket $ticket, string $oldStatus): void
    {
        try {
            $ticketData = $this->formatTicketForBroadcast($ticket);
            $ticketData['old_status'] = $oldStatus;
            
            broadcast(new NewTicketCreated($ticketData));

            Log::info('Ticket status update broadcasted', [
                'ticket_id' => $ticket->id,
                'old_status' => $oldStatus,
                'new_status' => $ticket->status
            ]);
        } catch (Exception $e) {
            Log::error('Failed to broadcast ticket status update', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticket->id
            ]);
        }
    }

    /**
     * Broadcast agent status change event.
     *
     * @param string $agentId
     * @param string $status
     * @param array $additionalData
     * @return void
     */
    public function broadcastAgentStatusChange(string $agentId, string $status, array $additionalData = []): void
    {
        try {
            $eventData = array_merge([
                'agent_id' => $agentId,
                'status' => $status,
                'timestamp' => now()->toISOString()
            ], $additionalData);

            // You would create a specific event for agent status changes
            // For now, using a generic broadcast
            broadcast(new NewTicketCreated($eventData));

            Log::info('Agent status change broadcasted', [
                'agent_id' => $agentId,
                'status' => $status
            ]);
        } catch (Exception $e) {
            Log::error('Failed to broadcast agent status change', [
                'error' => $e->getMessage(),
                'agent_id' => $agentId,
                'status' => $status
            ]);
        }
    }

    /**
     * Broadcast new message event.
     *
     * @param string $ticketId
     * @param array $messageData
     * @return void
     */
    public function broadcastNewMessage(string $ticketId, array $messageData): void
    {
        try {
            $eventData = [
                'ticket_id' => $ticketId,
                'message' => $messageData,
                'timestamp' => now()->toISOString()
            ];

            // Broadcast to CS dashboard and specific ticket channel
            broadcast(new NewTicketCreated($eventData));

            Log::info('New message broadcasted', [
                'ticket_id' => $ticketId,
                'sender' => $messageData['sender'] ?? 'unknown'
            ]);
        } catch (Exception $e) {
            Log::error('Failed to broadcast new message', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId
            ]);
        }
    }

    /**
     * Format ticket data for broadcasting.
     *
     * @param Ticket $ticket
     * @return array
     */
    protected function formatTicketForBroadcast(Ticket $ticket): array
    {
        return [
            'id' => $ticket->id,
            'ticket_number' => $ticket->ticket_number,
            'session_id' => $ticket->chat_session_data['session_id'] ?? null,
            'customer_name' => $ticket->customer_name,
            'customer_email' => $ticket->customer_email,
            'subject' => $ticket->subject,
            'status' => $ticket->status,
            'priority' => $ticket->priority,
            'category' => $ticket->category,
            'created_at' => $ticket->created_at->toISOString(),
            'last_message' => $ticket->description,
            'last_message_time' => $ticket->created_at->diffForHumans(),
            'assigned_agent' => $ticket->assignedCs ? [
                'id' => $ticket->assignedCs->id,
                'name' => $ticket->assignedCs->name,
                'department' => $ticket->assignedCs->department
            ] : null
        ];
    }

    /**
     * Broadcast dashboard statistics update.
     *
     * @param array $stats
     * @return void
     */
    public function broadcastDashboardStats(array $stats): void
    {
        try {
            $eventData = [
                'type' => 'dashboard_stats_update',
                'stats' => $stats,
                'timestamp' => now()->toISOString()
            ];

            broadcast(new NewTicketCreated($eventData));

            Log::info('Dashboard statistics broadcasted');
        } catch (Exception $e) {
            Log::error('Failed to broadcast dashboard statistics', [
                'error' => $e->getMessage()
            ]);
        }
    }
}