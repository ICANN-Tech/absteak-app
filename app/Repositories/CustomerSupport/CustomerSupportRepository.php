<?php

namespace App\Repositories\CustomerSupport;

use App\Models\CustomerService;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Exception;

class CustomerSupportRepository implements CustomerSupportServiceInterface
{
    protected CustomerSupportBroadcastRepository $broadcastRepository;
    protected CustomerSupportMessageRepository $messageRepository;

    public function __construct(
        CustomerSupportBroadcastRepository $broadcastRepository,
        CustomerSupportMessageRepository $messageRepository
    ) {
        $this->broadcastRepository = $broadcastRepository;
        $this->messageRepository = $messageRepository;
    }
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
            $this->broadcastRepository->broadcastNewTicket($ticket);

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
     * Send a message in the context of a ticket.
     */
    public function sendMessage(string $ticketId, string $message, array $context = []): array
    {
        return $this->messageRepository->sendMessage($ticketId, $message, $context);
    }

    /**
     * Add a message to a ticket's history.
     */
    public function addMessageToTicket(string $ticketId, array $messageData): bool
    {
        return $this->messageRepository->addMessageToTicket($ticketId, $messageData);
    }

    /**
     * Broadcast new ticket event to CS dashboard.
     */
    public function broadcastNewTicket(Ticket $ticket): void
    {
        $this->broadcastRepository->broadcastNewTicket($ticket);
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
     *
     * @param string $ticketId
     * @param string $status
     * @param string|null $agentId
     * @return bool
     */
    public function updateTicketStatus(string $ticketId, string $status, ?string $agentId = null): bool
    {
        try {
            $ticket = Ticket::findOrFail($ticketId);
            
            $updateData = [
                'status' => $status,
                'updated_at' => now(),
            ];
            
            // If resolving or closing, record the timestamp
            if ($status === 'resolved') {
                $updateData['resolved_at'] = now();
            } elseif ($status === 'closed') {
                $updateData['closed_at'] = now();
            }
            
            $ticket->update($updateData);
            
            // Broadcast status update
            $this->broadcastRepository->broadcastTicketStatusUpdate($ticket, $status, $agentId);
            
            Log::info('Ticket status updated', [
                'ticket_id' => $ticketId,
                'status' => $status,
                'agent_id' => $agentId
            ]);
            
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
     *
     * @param string $csAgentId
     * @param string $status
     * @return bool
     */
    public function updateAgentStatus(string $csAgentId, string $status): bool
    {
        try {
            $agent = CustomerService::findOrFail($csAgentId);
            
            $agent->update([
                'status' => $status,
                'last_activity_at' => now(),
            ]);
            
            // Broadcast agent status update
            $this->broadcastRepository->broadcastAgentStatusChange($csAgentId, $status, ['agent_name' => $agent->name]);
            
            Log::info('Agent status updated', [
                'agent_id' => $csAgentId,
                'status' => $status
            ]);
            
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