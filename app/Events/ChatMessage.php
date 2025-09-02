<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $sessionId;
    public $ticketId;
    public $sender;
    public $timestamp;

    /**
     * Create a new event instance.
     */
    public function __construct($message, $sessionId, $ticketId = null, $sender = 'guest')
    {
        $this->message = $message;
        $this->sessionId = $sessionId;
        $this->ticketId = $ticketId;
        $this->sender = $sender;
        $this->timestamp = now();
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [
            new Channel('chat.session.' . $this->sessionId),
        ];

        // If there's a ticket ID, also broadcast to CS agents
        if ($this->ticketId) {
            $channels[] = new Channel('chat.ticket.' . $this->ticketId);
            $channels[] = new Channel('chat.cs.dashboard');
        }

        return $channels;
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
            'session_id' => $this->sessionId,
            'ticket_id' => $this->ticketId,
            'sender' => $this->sender,
            'timestamp' => $this->timestamp->toISOString(),
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}
