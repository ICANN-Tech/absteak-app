<?php

namespace App\Services;

use App\Models\Configuration;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class Flowise
{
    private string $baseUrl;
    private int $timeout;
    private array $defaultHeaders;
    private ?string $currentChatId = null;

    public function __construct()
    {
        $this->baseUrl = config('api-service.flowise.base_url', 'http://localhost:3000');
        $this->timeout = config('api-service.flowise.timeout', 90); // Increased from 30 to 60 seconds
        $this->defaultHeaders = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ];
    }

    /**
     * Send a chat message to Flowise using a specific chat ID
     *
     * @param string $question The question/message to send
     * @param string $chatId The chat flow ID to use
     * @param array $additionalData Additional data to send with the request
     * @return string The direct answer from Flowise
     * @throws Exception
     */
    public function chat(string $question, string $chatId, array $additionalData = []): string
    {
        // Set current chat ID for logging
        $this->setCurrentChatId($chatId);
        
        $url = $this->buildChatUrl($chatId);
        
        $payload = array_merge([
            'question' => $question,
        ], $additionalData);

        try {
            // Log request details for debugging
            Log::info('Flowise: Sending request', [
                'chat_id' => $chatId,
                'question_length' => strlen($question),
                'url' => $url,
                'timeout' => $this->timeout,
                'timestamp' => now()->toISOString()
            ]);
            
            $startTime = microtime(true);
            
            $response = Http::withHeaders($this->defaultHeaders)
                ->timeout($this->timeout)
                ->retry(2, 1000) // Retry 2 times with 1 second delay
                ->post($url, $payload);
            
            $responseTime = round((microtime(true) - $startTime) * 1000, 2); // in milliseconds
            
            Log::info('Flowise: Request completed', [
                'chat_id' => $chatId,
                'response_time_ms' => $responseTime,
                'status_code' => $response->status(),
                'response_size' => strlen($response->body())
            ]);

            if ($response->failed()) {
                throw new Exception(
                    "Flowise API request failed with status {$response->status()}: {$response->body()}"
                );
            }

            $responseData = $response->json();
            
            // Log the complete response
            Log::info('Flowise chat response', [
                'chat_id' => $chatId,
                'question' => $question,
                'full_response' => $responseData,
                'url' => $url,
            ]);
            
            // Extract and return only the answer field
            $answer = $this->extractAnswer($responseData);
            
            Log::info('Flowise chat answer extracted', [
                'chat_id' => $chatId,
                'question' => $question,
                'answer' => $answer,
            ]);

            return $answer;
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('Flowise: Connection timeout or network error', [
                'chat_id' => $chatId,
                'question' => $question,
                'error' => $e->getMessage(),
                'url' => $url,
                'timeout' => $this->timeout
            ]);
            
            // Return a fallback response for timeout errors
            return 'Maaf, sistem sedang mengalami keterlambatan. Silakan coba lagi dalam beberapa saat atau hubungi customer service kami untuk bantuan lebih lanjut.';
        } catch (Exception $e) {
            Log::error('Flowise chat request failed', [
                'chat_id' => $chatId,
                'question' => $question,
                'error' => $e->getMessage(),
                'url' => $url,
                'error_type' => get_class($e)
            ]);
            
            throw $e;
        }
    }

    /**
     * Send a chat message using a configuration key to get the chat ID
     *
     * @param string $question The question/message to send
     * @param string $configKey The configuration key for the chat ID
     * @param array $additionalData Additional data to send with the request
     * @return string The direct answer from Flowise
     * @throws Exception
     */
    public function chatWithConfigKey(string $question, string $configKey, array $additionalData = []): string
    {
        $chatId = $this->getChatIdFromConfig($configKey);
        
        // Enhanced logging for asking_chatid interactions
        if ($configKey === 'asking_chatid') {
            Log::info('ASKING_CHATID_REQUEST', [
                'config_key' => $configKey,
                'chat_id' => $chatId,
                'question' => $question,
                'additional_data' => $additionalData,
                'timestamp' => now(),
                'session_id' => session()->getId() ?? 'unknown'
            ]);
        }
        
        $response = $this->chat($question, $chatId, $additionalData);
        
        // Enhanced logging for asking_chatid responses
        if ($configKey === 'asking_chatid') {
            Log::info('ASKING_CHATID_RESPONSE', [
                'config_key' => $configKey,
                'chat_id' => $chatId,
                'question' => $question,
                'response' => $response,
                'response_length' => strlen($response),
                'timestamp' => now(),
                'session_id' => session()->getId() ?? 'unknown'
            ]);
        }
        
        return $response;
    }

    /**
     * Send a message to the assistant chatbot
     *
     * @param string $question The question/message to send
     * @param array $additionalData Additional data to send with the request
     * @return string The direct answer from Flowise
     * @throws Exception
     */
    public function chatWithAssistant(string $question, array $additionalData = []): string
    {
        return $this->chatWithConfigKey($question, 'assistant_chatid', $additionalData);
    }

    /**
     * Send a message to the reservation chatbot
     *
     * @param string $question The question/message to send
     * @param array $additionalData Additional data to send with the request
     * @return string The direct answer from Flowise
     * @throws Exception
     */
    public function chatWithReservation(string $question, array $additionalData = []): string
    {
        Log::info('RESERVATION_CHATID_REQUEST', [
            'question' => $question,
            'additional_data' => $additionalData,
            'timestamp' => now(),
            'session_id' => session()->getId() ?? 'unknown'
        ]);
        
        $response = $this->chatWithConfigKey($question, 'reservation_chatid', $additionalData);
        
        Log::info('RESERVATION_CHATID_RESPONSE', [
            'question' => $question,
            'response' => $response,
            'contains_reservation_form' => ($response === 'RESERVATION_FORM'),
            'timestamp' => now(),
            'session_id' => session()->getId() ?? 'unknown'
        ]);
        
        return $response;
    }

    /**
     * Get all available chat IDs from configuration
     *
     * @return array Array of chat configurations
     */
    public function getAvailableChatIds(): array
    {
        return Configuration::where('group', 'chatbot')
            ->get()
            ->map(function ($config) {
                return [
                    'key' => $config->key,
                    'chat_id' => $config->value,
                    'type' => $config->type->value,
                ];
            })
            ->toArray();
    }

    /**
     * Update a chat ID in the configuration
     *
     * @param string $configKey The configuration key
     * @param string $newChatId The new chat ID
     * @return bool Success status
     */
    public function updateChatId(string $configKey, string $newChatId): bool
    {
        try {
            $config = Configuration::where('key', $configKey)
                ->where('group', 'chatbot')
                ->first();

            if (!$config) {
                throw new Exception("Configuration key '{$configKey}' not found in chatbot group");
            }

            $config->update(['value' => $newChatId]);
            return true;
        } catch (Exception $e) {
            Log::error('Failed to update chat ID', [
                'config_key' => $configKey,
                'new_chat_id' => $newChatId,
                'error' => $e->getMessage(),
            ]);
            
            return false;
        }
    }

    /**
     * Add a new chat ID configuration
     *
     * @param string $configKey The configuration key
     * @param string $chatId The chat ID
     * @return bool Success status
     */
    public function addChatId(string $configKey, string $chatId): bool
    {
        try {
            Configuration::create([
                'key' => $configKey,
                'type' => \App\Enums\Configuration\Type::String,
                'value' => $chatId,
                'group' => 'chatbot',
            ]);
            
            return true;
        } catch (Exception $e) {
            Log::error('Failed to add chat ID', [
                'config_key' => $configKey,
                'chat_id' => $chatId,
                'error' => $e->getMessage(),
            ]);
            
            return false;
        }
    }

    /**
     * Test connection to Flowise service
     *
     * @return array Connection test results
     */
    public function testConnection(): array
    {
        try {
            $response = Http::withHeaders($this->defaultHeaders)
                ->timeout(5)
                ->get($this->baseUrl);

            return [
                'success' => $response->successful(),
                'status_code' => $response->status(),
                'response_time' => $response->transferStats?->getTransferTime() ?? null,
                'base_url' => $this->baseUrl,
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'base_url' => $this->baseUrl,
            ];
        }
    }

    /**
     * Build the chat URL for a specific chat ID
     *
     * @param string $chatId The chat flow ID
     * @return string The complete URL
     */
    private function buildChatUrl(string $chatId): string
    {
        return rtrim($this->baseUrl, '/') . '/api/v1/prediction/' . $chatId;
    }

    /**
     * Get chat ID from configuration
     *
     * @param string $configKey The configuration key
     * @return string The chat ID
     * @throws Exception
     */
    private function getChatIdFromConfig(string $configKey): string
    {
        $config = Configuration::where('key', $configKey)
            ->where('group', 'chatbot')
            ->first();

        if (!$config) {
            throw new Exception("Chat ID configuration not found for key: {$configKey}");
        }

        return $config->value;
    }

    /**
     * Get current chat ID
     *
     * @return string|null
     */
    private function getCurrentChatId(): ?string
    {
        return $this->currentChatId;
    }
    
    /**
     * Set current chat ID for logging purposes
     *
     * @param string $chatId
     * @return void
     */
    private function setCurrentChatId(string $chatId): void
    {
        $this->currentChatId = $chatId;
    }
    
    /**
     * Extract the answer from Flowise response data
     *
     * @param array $responseData The response data from Flowise
     * @return string The extracted answer
     */
    private function extractAnswer(array $responseData): string
    {
        $answer = null;
        
        // Try different possible answer fields in order of preference
        if (isset($responseData['answer'])) {
            // If answer is already an array (JSON object), extract the answer field
            if (is_array($responseData['answer']) && isset($responseData['answer']['answer'])) {
                $answer = $responseData['answer']['answer'];
            }
            // If answer is a string that looks like JSON, try to decode it
            elseif (is_string($responseData['answer'])) {
                $decodedAnswer = json_decode($responseData['answer'], true);
                if (json_last_error() === JSON_ERROR_NONE && isset($decodedAnswer['answer'])) {
                    $answer = $decodedAnswer['answer'];
                } else {
                    $answer = $responseData['answer'];
                }
            }
        }
        
        if (!$answer && isset($responseData['text']) && is_string($responseData['text'])) {
            // Try to decode text field as JSON first
            $decodedText = json_decode($responseData['text'], true);
            if (json_last_error() === JSON_ERROR_NONE && isset($decodedText['answer'])) {
                $answer = $decodedText['answer'];
            } else {
                $answer = $responseData['text'];
            }
        }
        
        if (!$answer && isset($responseData['response']) && is_string($responseData['response'])) {
            $answer = $responseData['response'];
        }
        
        if (!$answer && isset($responseData['message']) && is_string($responseData['message'])) {
            $answer = $responseData['message'];
        }
        
        // If no recognizable answer field is found, return a default message
        if (!$answer) {
            Log::warning('No recognizable answer field found in Flowise response', [
                'response_data' => $responseData,
            ]);
            
            return 'I apologize, but I was unable to process your request at this time. Please try again.';
        }
        
        // Special handling for RESERVATION_FORM response
        if ($answer === 'RESERVATION_FORM') {
            Log::info('RESERVATION_FORM_TRIGGER_DETECTED', [
                'trigger_source' => 'flowise_response',
                'response_data' => $responseData,
                'trigger_value' => $answer,
                'timestamp' => now(),
                'chat_id' => $this->currentChatId,
                'full_response_structure' => [
                    'has_answer_field' => isset($responseData['answer']),
                    'has_text_field' => isset($responseData['text']),
                    'has_response_field' => isset($responseData['response']),
                    'response_keys' => array_keys($responseData)
                ]
            ]);
            
            // Log reservation form trigger for analytics
            Log::info('RESERVATION_ANALYTICS', [
                'event_type' => 'reservation_form_triggered',
                'source' => 'assistant_chatid',
                'timestamp' => now(),
                'session_id' => session()->getId() ?? 'unknown'
            ]);
        }
        
        return $answer;
    }
}