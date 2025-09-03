<?php

namespace App\Repositories\CustomerSupport;

use App\Models\CustomerService;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Collection;

/**
 * Interface for Customer Support Service operations.
 * Defines the contract for all customer support related functionality.
 */
interface CustomerSupportServiceInterface
{
    /**
     * Find an available customer service agent.
     *
     * @param array $customerData Optional customer data for agent matching
     * @return CustomerService|null
     */
    public function findAvailableAgent(array $customerData = []): ?CustomerService;

    /**
     * Get all available customer service agents.
     *
     * @return Collection
     */
    public function getAvailableAgents(): Collection;

    /**
     * Create a new support ticket.
     *
     * @param array $ticketData
     * @return Ticket
     */
    public function createTicket(array $ticketData): Ticket;

    /**
     * Assign a ticket to a customer service agent.
     *
     * @param string $ticketId
     * @param string $csAgentId
     * @return bool
     */
    public function assignTicket(string $ticketId, string $csAgentId): bool;

    /**
     * Get ticket by ID.
     *
     * @param string $ticketId
     * @return Ticket|null
     */
    public function getTicket(string $ticketId): ?Ticket;

    /**
     * Get tickets assigned to a CS agent.
     *
     * @param string $csAgentId
     * @param array $filters
     * @return Collection
     */
    public function getAgentTickets(string $csAgentId, array $filters = []): Collection;

    /**
     * Get open/unassigned tickets.
     *
     * @return Collection
     */
    public function getOpenTickets(): Collection;

    /**
     * Get active tickets for CS dashboard.
     *
     * @return Collection
     */
    public function getActiveTickets(): Collection;

    /**
     * Update ticket status.
     *
     * @param string $ticketId
     * @param string $status
     * @return bool
     */
    public function updateTicketStatus(string $ticketId, string $status): bool;

    /**
     * Get customer service agent by ID.
     *
     * @param string $csAgentId
     * @return CustomerService|null
     */
    public function getAgent(string $csAgentId): ?CustomerService;

    /**
     * Update agent status.
     *
     * @param string $csAgentId
     * @param string $status
     * @return bool
     */
    public function updateAgentStatus(string $csAgentId, string $status): bool;

    /**
     * Get ticket statistics for an agent.
     *
     * @param string $csAgentId
     * @return array
     */
    public function getAgentStats(string $csAgentId): array;

    /**
     * Send a message in the context of a ticket.
     *
     * @param string $ticketId
     * @param string $message
     * @param array $context
     * @return array
     */
    public function sendMessage(string $ticketId, string $message, array $context = []): array;

    /**
     * Add a message to a ticket's history.
     *
     * @param string $ticketId
     * @param array $messageData
     * @return bool
     */
    public function addMessageToTicket(string $ticketId, array $messageData): bool;

    /**
     * Broadcast new ticket event to CS dashboard.
     *
     * @param Ticket $ticket
     * @return void
     */
    public function broadcastNewTicket(Ticket $ticket): void;
}