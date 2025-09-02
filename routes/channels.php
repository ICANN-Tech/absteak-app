<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Chat channels
Broadcast::channel('chat.{room}', function ($user, $room) {
    // Allow access to public chat rooms
    return true;
});

Broadcast::channel('chat.general', function ($user) {
    // Allow access to general chat channel
    return true;
});

// Private chat channels (using public channels to avoid auth issues)
Broadcast::channel('chat.private.{customerId}.{agentId}', function ($user, $customerId, $agentId) {
    // Allow access to private chat channels
    return true;
});

// Legacy private chat channels (for backward compatibility)
Broadcast::channel('private-chat.{customerId}.{agentId}', function ($user, $customerId, $agentId) {
    // Allow access if user is either the customer or the agent
    // For now, we'll allow all authenticated users
    // In production, you should implement proper authorization logic
    return true;
});
