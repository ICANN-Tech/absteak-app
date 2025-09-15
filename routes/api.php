<?php

use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\ChatController as RegularChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Include chat integration routes
require __DIR__.'/api_chat.php';

// Include Chatwoot API routes
require __DIR__.'/api_chatwoot.php';

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Legacy Guest Chat Routes (no authentication required)
Route::prefix('chat/guest')->group(function () {
    Route::post('/initialize', [ChatController::class, 'initialize']);
    Route::post('/assign-cs', [ChatController::class, 'assignCustomerService']);
});

// Public Customer Service Routes (no authentication required)
Route::prefix('chat')->group(function () {
    // Public endpoints
    Route::get('/cs/available', [ChatController::class, 'getAvailableCustomerService']);
    
    Route::post('/initialize', [ChatController::class, 'initialize']);
    Route::post('/send-message', [ChatController::class, 'sendMessage']);
    Route::get('/test-connection', [ChatController::class, 'testConnection']);
    
    // Customer initiated end chat
    Route::post('/trigger-end-chat', [ChatController::class, 'triggerCustomerEndChat']);
    
    // Soketi integration
    Route::post('/send', [ChatController::class, 'sendSoketiMessage']);
    Route::post('/join', [ChatController::class, 'joinSoketiRoom']);
    Route::post('/typing', [ChatController::class, 'handleSoketiTyping']);
    
    // Customer Service operations
    Route::get('/active-tickets', [ChatController::class, 'getActiveTickets']);
    Route::get('/ticket-messages/{ticketId}', [ChatController::class, 'getTicketMessages']);
    Route::post('/send-cs-reply', [ChatController::class, 'sendCsReply']);
    Route::post('/resolve-ticket', [ChatController::class, 'resolveTicket']);
    Route::post('/escalate-ticket', [ChatController::class, 'escalateTicket']);
    Route::post('/update-agent-status', [ChatController::class, 'updateAgentStatus']);
});

// RocketChat Proxy Routes (to avoid CORS issues)
Route::prefix('rocketchat')->group(function () {
    Route::post('/login', function (Request $request) {
        $client = new \GuzzleHttp\Client();
        try {
            $response = $client->post('http://localhost:3003/api/v1/login', [
                'json' => $request->all(),
                'headers' => [
                    'Content-Type' => 'application/json',
                ]
            ]);
            return response($response->getBody(), $response->getStatusCode())
                ->header('Content-Type', 'application/json');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
    
    Route::any('{path}', function (Request $request, $path) {
        $client = new \GuzzleHttp\Client();
        try {
            $response = $client->request($request->method(), 'http://localhost:3003/api/v1/' . $path, [
                'json' => $request->all(),
                'headers' => array_merge([
                    'Content-Type' => 'application/json',
                ], $request->headers->all())
            ]);
            return response($response->getBody(), $response->getStatusCode())
                ->header('Content-Type', 'application/json');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    })->where('path', '.*');
});

// Authenticated User Chat Routes
Route::middleware('auth:sanctum')->prefix('chat')->group(function () {
    // User chat initialization
    Route::post('/user/initialize', [ChatController::class, 'initialize']);
    
    // Customer Service chat initialization
    Route::post('/cs/initialize', [RegularChatController::class, 'initializeCustomerServiceChat']);
    
    // Customer Service management - authenticated only
    Route::get('/statistics', [ChatController::class, 'getChatStatistics']);
    
    // Common chat operations
    Route::post('/end-session', [ChatController::class, 'endChatSession']);
    Route::post('/trigger-end', [RegularChatController::class, 'triggerEndChat']);
});


Route::get('/sample', function () {
    // Ambil semua data dine out sources
    $dineOutSources = \App\Models\DineOutSource::all();

    // Kembalikan dalam format JSON
    return response()->json($dineOutSources);
});