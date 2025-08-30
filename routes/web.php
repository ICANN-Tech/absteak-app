<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Guest'));

Route::get('check-reservation-date/{date}', [Controllers\TestController::class, 'check']);

// Chatbot routes
Route::get('/chatbot', [Controllers\ChatbotController::class, 'index'])->name('chatbot.index');
Route::post('/chatbot/send', [Controllers\ChatbotController::class, 'sendMessage'])->name('chatbot.send');
Route::get('/chatbot/status', [Controllers\ChatbotController::class, 'getStatus'])->name('chatbot.status');