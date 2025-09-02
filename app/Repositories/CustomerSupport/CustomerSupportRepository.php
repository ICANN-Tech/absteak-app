<?php

namespace App\Repositories\CustomerSupport;

use App\Models\CustomerService;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Broadcast;
use App\Events\NewTicketCreated;
use Exception;

class CustomerSupportRepository
{
    /**
     * Find an available customer service agent.
     */
    public function findAvailableAgent(array $customerData = []): ?CustomerService
    {
        try {
            // Get available agents with capacity
            $availableAgents = CustomerService::available()
                ->orderBy('current_ticket_count', 'asc')
                ->orderBy('last_activity_at', 'desc')
                ->get();

            if ($availableAgents->isEmpty()) {
                return null;
            }

            // Simple round-robin assignment for now
            // Could be enhanced with skill-based routing
            return $availableAgents->first();
        } catch (Exception $e) {
            Log::error('Failed to find available agent', [
                'error' => $e->getMessage(),
                'customer_data' => $customerData,
            ]);
            return null;
        }
    }

    /**
     * Get all available customer service agents.
     */
    public function getAvailableAgents(): Collection
    {
        return CustomerService::available()
            ->orderBy('department')
            ->orderBy('name')
            ->get();
    }

    /**
     * Create a new support ticket.
     */
    public function createTicket(array $ticketData): Ticket
    {
        try {
            $ticket = Ticket::create([
                'id' => (string) Str::uuid(),
                'subject' => $ticketData['subject'],
                'description' => $ticketData['description'],
                'priority' => $ticketData['priority'] ?? 'medium',
                'status' => $ticketData['status'] ?? 'open',
                'category' => $ticketData['category'] ?? 'general',
                'customer_id' => $ticketData['customer_id'] ?? null,
                'customer_name' => $ticketData['customer_name'],
                'customer_email' => $ticketData['customer_email'],
                'customer_phone' => $ticketData['customer_phone'] ?? null,
                'chat_session_data' => $ticketData['chat_session_data'] ?? null,
                'metadata' => $ticketData['metadata'] ?? null,
            ]);

            Log::info('Support ticket created', [
                'ticket_id' => $ticket->id,
                'ticket_number' => $ticket->ticket_number,
                'customer_name' => $ticket->customer_name,
            ]);

            // Broadcast new ticket event to CS dashboard
            $this->broadcastNewTicket($ticket);

            return $ticket;
        } catch (Exception $e) {
            Log::error('Failed to create support ticket', [
                'error' => $e->getMessage(),
                'ticket_data' => $ticketData,
            ]);
            throw $e;
        }
    }

    /**
     * Assign a ticket to a customer service agent.
     */
    public function assignTicket(string $ticketId, string $csAgentId): bool
    {
        try {
            $ticket = Ticket::findOrFail($ticketId);
            $csAgent = CustomerService::findOrFail($csAgentId);

            $ticket->assignTo($csAgent);

            Log::info('Ticket assigned to CS agent', [
                'ticket_id' => $ticketId,
                'ticket_number' => $ticket->ticket_number,
                'cs_agent_id' => $csAgentId,
                'cs_agent_name' => $csAgent->name,
            ]);

            return true;
        } catch (Exception $e) {
            Log::error('Failed to assign ticket', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
                'cs_agent_id' => $csAgentId,
            ]);
            return false;
        }
    }

    /**
     * Broadcast new ticket event to CS dashboard.
     */
    private function broadcastNewTicket(Ticket $ticket): void
    {
        try {
            // Format ticket data for broadcasting
            $ticketData = [
                'id' => $ticket->id,
                'ticket_number' => $ticket->ticket_number,
                'session_id' => $ticket->chat_session_data['session_id'] ?? null,
                'customer_name' => $ticket->customer_name,
                'customer_email' => $ticket->customer_email,
                'subject' => $ticket->subject,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'created_at' => $ticket->created_at->toISOString(),
                'last_message' => $ticket->description,
                'last_message_time' => $ticket->created_at->diffForHumans(),
                'assigned_agent' => $ticket->assignedCs ? [
                    'id' => $ticket->assignedCs->id,
                    'name' => $ticket->assignedCs->name,
                    'department' => $ticket->assignedCs->department
                ] : null
            ];

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
     * Send a message in the context of a ticket.
     */
    public function sendMessage(string $ticketId, string $message, array $context = []): array
    {
        try {
            $ticket = Ticket::findOrFail($ticketId);
            
            // Record first response if this is from CS agent
            if (isset($context['sender']) && $context['sender'] === 'cs_agent') {
                $ticket->recordFirstResponse();
            }

            // For now, return a simple acknowledgment
            // This could be enhanced to integrate with real-time messaging
            return [
                'success' => true,
                'message' => 'Message sent successfully',
                'ticket_id' => $ticketId,
                'timestamp' => now()->toISOString(),
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
                'id' => (string) Str::uuid(),
                'sender' => $messageData['sender'],
                'message' => $messageData['message'],
                'timestamp' => $messageData['timestamp']->toISOString(),
                'session_id' => $messageData['session_id'] ?? null,
            ];
            
            // Update ticket
            $ticket->update([
                'chat_session_data' => $chatData,
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
     * Get ticket by ID.
     */
    public function getTicket(string $ticketId): ?Ticket
    {
        try {
            return Ticket::with(['customer', 'assignedCs'])->find($ticketId);
        } catch (Exception $e) {
            Log::error('Failed to get ticket', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
            ]);
            return null;
        }
    }

    /**
     * Get tickets assigned to a CS agent.
     */
    public function getAgentTickets(string $csAgentId, array $filters = []): Collection
    {
        try {
            $query = Ticket::where('assigned_cs_id', $csAgentId)
                ->with(['customer', 'assignedCs'])
                ->orderBy('created_at', 'desc');

            // Apply filters
            if (isset($filters['status'])) {
                $query->where('status', $filters['status']);
            }

            if (isset($filters['priority'])) {
                $query->where('priority', $filters['priority']);
            }

            if (isset($filters['category'])) {
                $query->where('category', $filters['category']);
            }

            return $query->get();
        } catch (Exception $e) {
            Log::error('Failed to get agent tickets', [
                'error' => $e->getMessage(),
                'cs_agent_id' => $csAgentId,
                'filters' => $filters,
            ]);
            return new Collection();
        }
    }

    /**
     * Get open/unassigned tickets.
     */
    public function getOpenTickets(): Collection
    {
        try {
            return Ticket::unassigned()
                ->open()
                ->with(['customer'])
                ->orderBy('priority', 'desc')
                ->orderBy('created_at', 'asc')
                ->get();
        } catch (Exception $e) {
            Log::error('Failed to get open tickets', [
                'error' => $e->getMessage(),
            ]);
            return new Collection();
        }
    }

    /**
     * Update ticket status.
     */
    public function updateTicketStatus(string $ticketId, string $status): bool
    {
        try {
            $ticket = Ticket::findOrFail($ticketId);
            
            if ($status === 'resolved') {
                $ticket->markAsResolved();
            } elseif ($status === 'closed') {
                $ticket->close();
            } else {
                $ticket->update(['status' => $status]);
            }

            return true;
        } catch (Exception $e) {
            Log::error('Failed to update ticket status', [
                'error' => $e->getMessage(),
                'ticket_id' => $ticketId,
                'status' => $status,
            ]);
            return false;
        }
    }

    /**
     * Get customer service agent by ID.
     */
    public function getAgent(string $csAgentId): ?CustomerService
    {
        try {
            return CustomerService::with(['user', 'tickets'])->find($csAgentId);
        } catch (Exception $e) {
            Log::error('Failed to get CS agent', [
                'error' => $e->getMessage(),
                'cs_agent_id' => $csAgentId,
            ]);
            return null;
        }
    }

    /**
     * Update agent status.
     */
    public function updateAgentStatus(string $csAgentId, string $status): bool
    {
        try {
            $agent = CustomerService::findOrFail($csAgentId);
            
            switch ($status) {
                case 'available':
                    $agent->setOnline();
                    break;
                case 'busy':
                    $agent->setBusy();
                    break;
                case 'offline':
                    $agent->setOffline();
                    break;
                default:
                    $agent->update(['status' => $status]);
            }

            return true;
        } catch (Exception $e) {
            Log::error('Failed to update agent status', [
                'error' => $e->getMessage(),
                'cs_agent_id' => $csAgentId,
                'status' => $status,
            ]);
            return false;
        }
    }

    /**
     * Get ticket statistics for an agent.
     */
    public function getAgentStats(string $csAgentId): array
    {
        try {
            $agent = CustomerService::findOrFail($csAgentId);
            
            $stats = [
                'total_tickets' => $agent->tickets()->count(),
                'active_tickets' => $agent->activeTickets()->count(),
                'resolved_tickets' => $agent->tickets()->where('status', 'resolved')->count(),
                'closed_tickets' => $agent->tickets()->where('status', 'closed')->count(),
                'average_response_time' => $this->calculateAverageResponseTime($csAgentId),
                'average_resolution_time' => $this->calculateAverageResolutionTime($csAgentId),
            ];

            return $stats;
        } catch (Exception $e) {
            Log::error('Failed to get agent stats', [
                'error' => $e->getMessage(),
                'cs_agent_id' => $csAgentId,
            ]);
            return [];
        }
    }

    /**
     * Get active tickets for CS dashboard.
     */
    public function getActiveTickets(): Collection
    {
        try {
            return Ticket::with(['assignedCs'])
                ->whereIn('status', ['open', 'in_progress', 'pending'])
                ->orderBy('created_at', 'desc')
                ->get();
        } catch (Exception $e) {
            Log::error('Failed to get active tickets', [
                'error' => $e->getMessage(),
            ]);
            return new \Illuminate\Database\Eloquent\Collection();
        }
    }

    /**
     * Calculate average response time for an agent.
     */
    protected function calculateAverageResponseTime(string $csAgentId): ?float
    {
        try {
            $tickets = Ticket::where('assigned_cs_id', $csAgentId)
                ->whereNotNull('first_response_at')
                ->get();

            if ($tickets->isEmpty()) {
                return null;
            }

            $totalMinutes = $tickets->sum(function ($ticket) {
                return $ticket->response_time;
            });

            return $totalMinutes / $tickets->count();
        } catch (Exception $e) {
            Log::error('Failed to calculate average response time', [
                'error' => $e->getMessage(),
                'cs_agent_id' => $csAgentId,
            ]);
            return null;
        }
    }

    /**
     * Calculate average resolution time for an agent.
     */
    protected function calculateAverageResolutionTime(string $csAgentId): ?float
    {
        try {
            $tickets = Ticket::where('assigned_cs_id', $csAgentId)
                ->whereNotNull('resolved_at')
                ->get();

            if ($tickets->isEmpty()) {
                return null;
            }

            $totalMinutes = $tickets->sum(function ($ticket) {
                return $ticket->resolution_time;
            });

            return $totalMinutes / $tickets->count();
        } catch (Exception $e) {
            Log::error('Failed to calculate average resolution time', [
                'error' => $e->getMessage(),
                'cs_agent_id' => $csAgentId,
            ]);
            return null;
        }
    }
}