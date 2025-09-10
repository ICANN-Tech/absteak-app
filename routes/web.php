<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers;
use Inertia\Inertia;

// Broadcasting authentication routes
Broadcast::routes();

Route::get('/', [Controllers\Guest\IndexController::class, 'index']);

Route::get('check-reservation-date/{date}', [Controllers\TestController::class, 'check']);

// Chat interface route
Route::get('/chat', function () {
    return view('chat');
})->name('chat.interface');

// Customer service testing page
Route::get('/customer-service-test', function () {
    return view('customer-service-test');
})->name('customer-service.test');

// Guest-CS chat interface
Route::get('/guest-chat', function () {
    return view('guest-cs-chat');
})->name('guest.chat');

// Customer Service Chat Dashboard
Route::get('/cs-dashboard', function () {
    return view('cs-chat-dashboard');
})->name('cs.dashboard');

// Chatbot routes
Route::get('/chatbot', [Controllers\ChatbotController::class, 'index'])->name('chatbot.index');
Route::post('/chatbot/send', [Controllers\ChatbotController::class, 'sendMessage'])->name('chatbot.send');
Route::get('/chatbot/status', [Controllers\ChatbotController::class, 'getStatus'])->name('chatbot.status');

// Chatwoot integration route
Route::get('/chatwoot-chat', function () {
    return view('chatwoot-chat');
})->name('chatwoot.chat');

// Rocket.Chat sample interface
Route::get('/sample-chat', function () {
    return view('sample-chat');
})->name('sample.chat');

// Customer Service Chat Interface
Route::get('/simple-chat-cs', function () {
    return view('simple-chat-cs');
})->name('simple.chat.cs');

// Scroll Lock Test Route
Route::get('/scroll-lock-test', function () {
    return view('scroll-lock-test');
})->name('scroll.lock.test');

// Chat routes moved to routes/api.php