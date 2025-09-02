<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ChatController;

/*
|--------------------------------------------------------------------------
| Chat API Routes
|--------------------------------------------------------------------------
|
| Here are the API routes for the chat integration system that connects
| Flowise chatbot with customer service functionality.
|
*/

// Chat Integration Routes
Route::prefix('chat')->group(function () {
    
    // Initialize chat session
    Route::post('/initialize', [ChatController::class, 'initialize'])
        ->name('chat.initialize');
    
    // Send message to chatbot
    Route::post('/message', [ChatController::class, 'sendMessage'])
        ->name('chat.message');
    
    // Alternative route for send-message (backward compatibility)
    Route::post('/send-message', [ChatController::class, 'sendMessage'])
        ->name('chat.send-message');
    
    // Send message via Soketi
    Route::post('/send', [ChatController::class, 'sendMessage'])
        ->name('chat.send');
    
    // Join Soketi room
    Route::post('/join', [ChatController::class, 'joinSoketiRoom'])
        ->name('chat.join');
    
    // Test connection
    Route::get('/test-connection', [ChatController::class, 'testConnection'])
        ->name('chat.test-connection');
    
    // Get session status
    Route::get('/session/{session_id}/status', [ChatController::class, 'getSessionStatus'])
        ->name('chat.session.status');
    
    // Get active tickets for CS dashboard
    Route::get('/active-tickets', [ChatController::class, 'getActiveTickets'])
        ->name('chat.active-tickets');
    
    // Customer Service Routes
    Route::prefix('cs')->group(function () {
        
        // Get available customer service agents
        Route::get('/available', [ChatController::class, 'getAvailableAgents'])
            ->name('chat.cs.available');
        
        // Transfer chat to customer service
        Route::post('/transfer', [ChatController::class, 'transferToCs'])
            ->name('chat.cs.transfer');
        
        // Send message to customer service
        Route::post('/message', [ChatController::class, 'sendMessageToCs'])
            ->name('chat.cs.message');
        
        // Send message from CS agent to customer
        Route::post('/tickets/{ticket_id}/reply', [ChatController::class, 'sendCsReply'])
            ->name('chat.cs.tickets.reply');
        
        // Get CS tickets
        Route::get('/tickets', [ChatController::class, 'getTickets'])
            ->name('chat.cs.tickets');
        
        // Get ticket messages
        Route::get('/tickets/{ticket_id}/messages', [ChatController::class, 'getTicketMessages'])
            ->name('chat.cs.tickets.messages');
        
        // Resolve ticket
        Route::post('/tickets/{ticket_id}/resolve', [ChatController::class, 'resolveTicket'])
            ->name('chat.cs.tickets.resolve');
        
        // Escalate ticket
        Route::post('/tickets/{ticket_id}/escalate', [ChatController::class, 'escalateTicket'])
            ->name('chat.cs.tickets.escalate');
        
        // Update agent status
        Route::post('/status', [ChatController::class, 'updateAgentStatus'])
            ->name('chat.cs.status');
    });
    
    // Private Chat Routes for Customer Service
    Route::prefix('private')->group(function () {
        
        // Send private message
        Route::post('/send', [ChatController::class, 'sendPrivateMessage'])
            ->name('chat.private.send');
        
        // Send typing indicator for private chat
        Route::post('/typing', [ChatController::class, 'sendPrivateTyping'])
            ->name('chat.private.typing');
        
        // Invite customer to private chat
        Route::post('/invite', [ChatController::class, 'inviteToPrivateChat'])
            ->name('chat.private.invite');
    });
});

// Health check route for chat system
Route::get('/chat/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'Chat Integration API',
        'timestamp' => now()->toISOString(),
        'version' => '1.0.0'
    ]);
})->name('chat.health');