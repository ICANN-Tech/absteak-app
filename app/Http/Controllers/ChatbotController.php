<?php

namespace App\Http\Controllers;

use App\Repositories\Flowise\FlowiseRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Exception;

class ChatbotController extends Controller
{
    private FlowiseRepositoryInterface $flowiseRepository;

    public function __construct(FlowiseRepositoryInterface $flowiseRepository)
    {
        $this->flowiseRepository = $flowiseRepository;
    }

    /**
     * Display the chatbot interface
     *
     * @return View
     */
    public function index(): View
    {
        return view('chatbot');
    }

    /**
     * Handle chatbot message submission
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function sendMessage(Request $request): JsonResponse
    {
        try {
            // Validate the request
            $request->validate([
                'message' => 'required|string|max:1000',
            ]);

            $message = $request->input('message');
            $chatflowId = $request->input('chatflow_id');
            $fieldType = $request->input('field_type');
            $context = $request->input('context');
            $reservationData = $request->input('reservation_data');
            
            // Get or create chat ID for this conversation
            $chatId = $request->input('chat_id') ?? $this->generateChatId();
            
            // Get chat data from MongoDB
            $chatData = $this->getChatData($chatId);
            $makeReservation = $chatData['make_reservation'] ?? false;
            $reservationStep = $chatData['reservation_step'] ?? 0;
            
            // Log the incoming message
            Log::info('Chatbot message received', [
                'message' => $message,
                'user_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'make_reservation' => $makeReservation,
                'reservation_step' => $reservationStep
            ]);

            // Handle date and time selection to activate reservation mode
            if ($request->input('date_selected') && $request->input('time_selected')) {
                $chatData['make_reservation'] = true;
                $chatData['reservation_step'] = 1;
                $chatData['selected_date'] = $request->input('date_selected');
                $chatData['selected_time'] = $request->input('time_selected');
                
                $this->saveChatData($chatId, $chatData);
                
                // Start asking_chatid flow for name
                $response = $this->handleReservationField('', 'FIELD__NAME', '', []);
                
                return response()->json([
                    'success' => true,
                    'response' => $response,
                    'chat_id' => $chatId,
                    'make_reservation' => true,
                    'reservation_step' => 1,
                    'current_field' => 'FIELD__NAME'
                ]);
            }

            // Handle reservation completion
            if ($message === 'COMPLETE_RESERVATION') {
                $this->logReservationCompletion($reservationData);
                $chatData['make_reservation'] = false;
                $chatData['reservation_step'] = 0;
                $this->saveChatData($chatId, $chatData);
                
                return response()->json([
                    'success' => true,
                    'response' => 'Thank you! Your reservation has been confirmed. We look forward to serving you!',
                    'chat_id' => $chatId
                ]);
            }
            
            // Handle asking_chatid flow for reservation fields when in reservation mode
            if ($makeReservation && $reservationStep > 0) {
                return $this->handleReservationStepSequence($request, $message, $reservationStep);
            }
            
            // Handle asking_chatid flow for reservation fields
            if ($chatflowId === 'asking_chatid' && $fieldType) {
                $response = $this->handleReservationField($message, $fieldType, $context, $reservationData);
                
                // Determine next field in sequence
                $nextField = $this->getNextReservationField($fieldType);
                
                return response()->json([
                    'success' => true,
                    'response' => $response,
                    'next_field' => $nextField,
                    'field_completed' => $fieldType
                ]);
            }
            
            // Handle reservation field collection sequence
            if ($request->input('reservation_field_input')) {
                return $this->handleReservationFieldSequence($request);
            }

            // Always start with assistant chatbot for initial requests
            $chatbotType = 'assistant';
            
            // Send message to assistant Flowise chatbot
            $response = $this->sendToFlowise($message, $chatbotType);
            
            // Check if response is RESERVATION_FORM trigger
            if ($response === 'RESERVATION_FORM') {
                Log::info('Reservation form triggered', [
                    'chatbot_type' => $chatbotType,
                    'message' => $message,
                ]);
                
                return response()->json([
                    'success' => true,
                    'response' => 'Please select your preferred reservation date:',
                    'chatbot_type' => $chatbotType,
                    'show_calendar' => true,
                ]);
            }
            
            // Log the response
            Log::info('Chatbot response sent', [
                'chatbot_type' => $chatbotType,
                'response_length' => strlen($response),
            ]);

            // Save conversation to MongoDB
            $this->addMessageToChat($chatId, [
                'role' => 'user',
                'content' => $message,
                'chatbot_type' => $chatbotType
            ]);
            
            $this->addMessageToChat($chatId, [
                'role' => 'assistant', 
                'content' => $response,
                'chatbot_type' => $chatbotType
            ]);

            return response()->json([
                'success' => true,
                'response' => $response,
                'chatbot_type' => $chatbotType,
                'chat_id' => $chatId,
            ]);

        } catch (Exception $e) {
            Log::error('Chatbot error', [
                'message' => $request->input('message', ''),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Sorry, I encountered an error processing your message. Please try again.',
            ], 500);
        }
    }
    
    /**
     * Handle reservation field processing
     *
     * @param string $message
     * @param string $fieldType
     * @param string|null $context
     * @param array|null $reservationData
     * @return string
     */
    private function handleReservationField($message, $fieldType, $context, $reservationData)
    {
        // Get the content reference based on field type
        $contentReferences = [
            'FIELD__NAME' => 'WHAT IS YOUR NAME?',
            'FIELD__NUMBER_OF_PEOPLE' => 'HOW MANY PEOPLE ARE THERE?',
            'FIELD__ADDITIONAL_INFORMATION' => 'HAVE SOME ANOTHER INFORMATION?'
        ];
        
        $contentReference = $contentReferences[$fieldType] ?? 'PLEASE PROVIDE INFORMATION';
        $sampleParagraph = $context ?? $message;
        
        // Format message according to specification
        $formattedMessage = "The content selection is {$fieldType} and translate \"{$contentReference}\" in language with paragraph like \"{$sampleParagraph}\"";
        
        try {
            Log::info('Sending formatted message to asking_chatid', [
                'field_type' => $fieldType,
                'content_reference' => $contentReference,
                'sample_paragraph' => $sampleParagraph,
                'formatted_message' => $formattedMessage
            ]);
            
            $response = $this->flowiseRepository->sendMessage($formattedMessage, 'assistant', 'asking_chatid');
            
            Log::info('Received response from asking_chatid', [
                'field_type' => $fieldType,
                'response' => $response
            ]);
            
            return $response;
        } catch (Exception $e) {
            Log::error('Reservation field error', [
                'field_type' => $fieldType,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return 'Thank you for providing that information.';
        }
    }
    
    /**
     * Handle reservation step sequence when in reservation mode
     *
     * @param Request $request
     * @param string $message
     * @param int $reservationStep
     * @return JsonResponse
     */
    private function handleReservationStepSequence(Request $request, string $message, int $reservationStep): JsonResponse
    {
        $chatId = $request->input('chat_id') ?? $this->generateChatId();
        $chatData = $this->getChatData($chatId);
        
        $fieldSequence = [
            1 => 'FIELD__NAME',
            2 => 'FIELD__NUMBER_OF_PEOPLE', 
            3 => 'FIELD__ADDITIONAL_INFORMATION',
            4 => null // Completion step
        ];
        
        $currentField = $fieldSequence[$reservationStep] ?? null;
        
        if (!$currentField) {
            // All steps completed, finalize reservation
            $reservationData = [
                'date' => $chatData['selected_date'] ?? null,
                'time' => $chatData['selected_time'] ?? null,
                'name' => $chatData['reservation_name'] ?? null,
                'number_of_people' => $chatData['reservation_people'] ?? null,
                'additional_info' => $chatData['reservation_info'] ?? null
            ];
            
            $this->logReservationCompletion($reservationData);
            $chatData['make_reservation'] = false;
            $chatData['reservation_step'] = 0;
            $this->saveChatData($chatId, $chatData);
            
            return response()->json([
                'success' => true,
                'response' => 'Thank you! Your reservation has been confirmed. We look forward to serving you!',
                'reservation_completed' => true,
                'chat_id' => $chatId
            ]);
        }
        
        // If this is step 1, we're asking for the name, so don't save anything yet
        if ($reservationStep === 1) {
            // Just ask for the name
            $response = $this->handleReservationField('', $currentField, '', []);
            
            return response()->json([
                'success' => true,
                'response' => $response,
                'reservation_step' => $reservationStep,
                'current_field' => $currentField,
                'chat_id' => $chatId
            ]);
        }
        
        // Save the previous field value to chat data (user's response)
        if ($reservationStep === 2) {
            $chatData['reservation_name'] = $message;
        } elseif ($reservationStep === 3) {
            $chatData['reservation_people'] = $message;
        } elseif ($reservationStep === 4) {
            $chatData['reservation_info'] = $message;
        }
        
        // Move to next step
        $nextStep = $reservationStep + 1;
        $nextField = $fieldSequence[$nextStep] ?? null;
        
        if ($nextField) {
            $chatData['reservation_step'] = $nextStep;
            $this->saveChatData($chatId, $chatData);
            $response = $this->handleReservationField('', $nextField, $message, []);
            
            return response()->json([
                'success' => true,
                'response' => $response,
                'reservation_step' => $nextStep,
                'current_field' => $nextField,
                'chat_id' => $chatId
            ]);
        } else {
            // This was the last field, complete reservation
            $reservationData = [
                'date' => $chatData['selected_date'] ?? null,
                'time' => $chatData['selected_time'] ?? null,
                'name' => $chatData['reservation_name'] ?? null,
                'number_of_people' => $chatData['reservation_people'] ?? null,
                'additional_info' => $chatData['reservation_info'] ?? null
            ];
            
            $this->logReservationCompletion($reservationData);
            $chatData['make_reservation'] = false;
            $chatData['reservation_step'] = 0;
            $this->saveChatData($chatId, $chatData);
            
            return response()->json([
                'success' => true,
                'response' => 'Thank you! Your reservation has been confirmed. We look forward to serving you!',
                'reservation_completed' => true,
                'chat_id' => $chatId
            ]);
        }
    }
    
    /**
     * Handle reservation field sequence
     *
     * @param Request $request
     * @return JsonResponse
     */
    private function handleReservationFieldSequence(Request $request): JsonResponse
    {
        $fieldType = $request->input('field_type');
        $fieldValue = $request->input('field_value');
        $reservationData = $request->input('reservation_data', []);
        
        // Store the field value
        $reservationData[$fieldType] = $fieldValue;
        
        Log::info('Reservation field collected', [
            'field_type' => $fieldType,
            'field_value' => $fieldValue,
            'current_data' => $reservationData
        ]);
        
        // Get next field in sequence
        $nextField = $this->getNextReservationField($fieldType);
        
        if ($nextField) {
            // Ask for next field using asking_chatid
            $response = $this->handleReservationField('', $nextField, $fieldValue, $reservationData);
            
            return response()->json([
                'success' => true,
                'response' => $response,
                'next_field' => $nextField,
                'reservation_data' => $reservationData
            ]);
        } else {
            // All fields collected, complete reservation
            $this->logReservationCompletion($reservationData);
            
            return response()->json([
                'success' => true,
                'response' => 'Thank you! Your reservation has been confirmed. We look forward to serving you!',
                'reservation_completed' => true,
                'final_data' => $reservationData
            ]);
        }
    }
    
    /**
     * Get next field in reservation sequence
     *
     * @param string $currentField
     * @return string|null
     */
    private function getNextReservationField(string $currentField): ?string
    {
        $fieldSequence = [
            'FIELD__NAME' => 'FIELD__NUMBER_OF_PEOPLE',
            'FIELD__NUMBER_OF_PEOPLE' => 'FIELD__ADDITIONAL_INFORMATION',
            'FIELD__ADDITIONAL_INFORMATION' => null
        ];
        
        return $fieldSequence[$currentField] ?? null;
    }
    
    /**
     * Log reservation completion
     *
     * @param array|null $reservationData
     * @return void
     */
    private function logReservationCompletion($reservationData)
    {
        Log::info('RESERVATION_FORM', [
            'reservation_completed' => true,
            'data' => $reservationData,
            'timestamp' => now(),
            'sequence_completed' => [
                'name' => $reservationData['FIELD__NAME'] ?? null,
                'number_of_people' => $reservationData['FIELD__NUMBER_OF_PEOPLE'] ?? null,
                'additional_information' => $reservationData['FIELD__ADDITIONAL_INFORMATION'] ?? null
            ]
        ]);
    }

    /**
     * Get chatbot status and available chat IDs
     *
     * @return JsonResponse
     */
    public function getStatus(): JsonResponse
    {
        try {
            $connectionTest = $this->flowiseRepository->testConnection();
            $availableChatIds = $this->flowiseRepository->getAvailableChatIds();

            return response()->json([
                'success' => true,
                'connection' => $connectionTest,
                'available_chat_ids' => $availableChatIds,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Determine which chatbot to use based on message content
     *
     * @param string $message
     * @return string
     */
    private function determineChatbotType(string $message): string
    {
        $message = strtolower($message);
        
        // Keywords that indicate reservation-related queries
        $reservationKeywords = [
            'reservation', 'reserve', 'book', 'booking', 'table', 'seat',
            'dinner', 'lunch', 'breakfast', 'party', 'group', 'date',
            'time', 'available', 'availability', 'cancel', 'modify',
            'change', 'reschedule', 'confirm', 'confirmation'
        ];
        
        // Check if message contains reservation-related keywords
        foreach ($reservationKeywords as $keyword) {
            if (strpos($message, $keyword) !== false) {
                return 'reservation';
            }
        }
        
        // Default to assistant chatbot for general queries
        return 'assistant';
    }

    /**
     * Send message to appropriate Flowise chatbot
     *
     * @param string $message
     * @param string $chatbotType
     * @param string|null $chatflowId
     * @return string
     * @throws Exception
     */
    private function sendToFlowise(string $message, string $chatbotType, string $chatflowId = null): string
    {
        try {
            if ($chatflowId) {
                $response = $this->flowiseRepository->sendMessage($message, 'assistant', $chatflowId);
            } elseif ($chatbotType === 'reservation') {
                $response = $this->flowiseRepository->sendMessage($message, 'reservation');
            } else {
                $response = $this->flowiseRepository->sendMessage($message, 'assistant');
            }

            // The Flowise service now returns the direct answer as a string
            return $response;
        } catch (Exception $e) {
            Log::error('Flowise service error', [
                'message' => $message,
                'chatbot_type' => $chatbotType,
                'chatflow_id' => $chatflowId,
                'error' => $e->getMessage(),
            ]);
            
            throw new Exception('Failed to get response from chatbot service: ' . $e->getMessage());
        }
    }
    
    /**
     * Generate a unique chat ID
     *
     * @return string
     */
    private function generateChatId(): string
    {
        return (string) Str::uuid();
    }
    
    /**
     * Get chat data from MongoDB
     *
     * @param string $chatId
     * @return array
     */
    private function getChatData(string $chatId): array
    {
        try {
            $chat = $this->flowiseRepository->getChat($chatId);
            return $chat['metadata'] ?? [];
        } catch (Exception $e) {
            Log::warning('Failed to get chat data', [
                'chat_id' => $chatId,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }
    
    /**
     * Save chat data to MongoDB
     *
     * @param string $chatId
     * @param array $chatData
     * @return void
     */
    private function saveChatData(string $chatId, array $chatData): void
    {
        try {
            $existingChat = $this->flowiseRepository->getChat($chatId);
            
            if ($existingChat) {
                // Update existing chat metadata
                $chatDocument = [
                    'messages' => $existingChat['messages'] ?? [],
                    'metadata' => array_merge($existingChat['metadata'] ?? [], $chatData)
                ];
                $this->flowiseRepository->saveChat($chatDocument, $chatId);
            } else {
                // Create new chat with metadata
                $chatDocument = [
                    'messages' => [],
                    'metadata' => $chatData
                ];
                $this->flowiseRepository->saveChat($chatDocument, $chatId);
            }
        } catch (Exception $e) {
            Log::error('Failed to save chat data', [
                'chat_id' => $chatId,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Add message to chat in MongoDB
     *
     * @param string $chatId
     * @param array $message
     * @return void
     */
    private function addMessageToChat(string $chatId, array $message): void
    {
        try {
            // Check if chat exists, create if not
            $existingChat = $this->flowiseRepository->getChat($chatId);
            
            if (!$existingChat) {
                // Create new chat with empty messages array
                $chatDocument = [
                    'messages' => [],
                    'metadata' => []
                ];
                $this->flowiseRepository->saveChat($chatDocument, $chatId);
                Log::info('Created new chat for message', ['chat_id' => $chatId]);
            }
            
            $this->flowiseRepository->addMessage($chatId, $message);
        } catch (Exception $e) {
            Log::error('Failed to add message to chat', [
                'chat_id' => $chatId,
                'message' => $message,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Handle API chatbot message submission with detailed response format
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function apiSendMessage(Request $request): JsonResponse
    {
        try {
            // Validate the request
            $request->validate([
                'message' => 'required|string|max:1000',
                'chat_id' => 'nullable|string'
            ]);

            $message = $request->input('message');
            $terminalChatId = $request->input('chat_id') ?? $this->generateChatId();
            
            // Get configuration for assistant and reservation chat IDs
            $assistantChatId = $this->getConfigValue('assistant_chatid');
            $reservationChatId = $this->getConfigValue('reservation_chatid');
            
            // Generate unique message and execution IDs
            $chatMessageId = Str::uuid()->toString();
            $executionId = Str::uuid()->toString();
            
            // Get or create chat data from MongoDB
            $chatData = $this->getChatData($terminalChatId);
            $makeReservation = $chatData['make_reservation'] ?? false;
            $reservationStep = $chatData['reservation_step'] ?? 0;
            
            // Log the incoming message
            Log::info('API Chatbot message received', [
                'message' => $message,
                'terminal_chat_id' => $terminalChatId,
                'assistant_chatid' => $assistantChatId,
                'reservation_chatid' => $reservationChatId,
                'user_ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'make_reservation' => $makeReservation,
                'reservation_step' => $reservationStep
            ]);

            // Determine which chatbot to use
            $chatbotType = $makeReservation ? 'reservation' : 'assistant';
            $flowiseChatId = $chatbotType === 'reservation' ? $reservationChatId : $assistantChatId;
            
            // Send message to appropriate Flowise chatbot
            $response = $this->sendToFlowise($message, $chatbotType);
            
            // Save conversation to MongoDB
            $this->addMessageToChat($terminalChatId, [
                'role' => 'user',
                'content' => $message,
                'chatbot_type' => $chatbotType,
                'timestamp' => now()->toISOString(),
                'message_id' => $chatMessageId,
                'execution_id' => $executionId
            ]);
            
            $this->addMessageToChat($terminalChatId, [
                'role' => 'assistant', 
                'content' => $response,
                'chatbot_type' => $chatbotType,
                'timestamp' => now()->toISOString(),
                'message_id' => Str::uuid()->toString(),
                'execution_id' => $executionId
            ]);

            // Get complete chat data from MongoDB for response
            $completeChat = $this->flowiseRepository->getChat($terminalChatId);
            
            // Format response similar to terminal output example
            $responseData = [
                'text' => $response,
                'question' => $message,
                'chatId' => $flowiseChatId, // This is the Flowise chat ID
                'chatMessageId' => $chatMessageId,
                'executionId' => $executionId,
                'terminal_chat_id' => $terminalChatId, // This is the terminal chat ID
                'assistant_chatid' => $assistantChatId,
                'reservation_chatid' => $reservationChatId,
                'chatbot_type' => $chatbotType,
                'make_reservation' => $makeReservation,
                'reservation_step' => $reservationStep,
                'timestamp' => now()->toISOString(),
                'chat_data' => $completeChat,
                'metadata' => [
                    'user_ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'response_length' => strlen($response),
                    'message_count' => count($completeChat['messages'] ?? [])
                ]
            ];

            Log::info('API Chatbot response sent', [
                'terminal_chat_id' => $terminalChatId,
                'chatbot_type' => $chatbotType,
                'flowise_chat_id' => $flowiseChatId,
                'response_length' => strlen($response),
                'execution_id' => $executionId
            ]);

            return response()->json([
                'success' => true,
                'data' => $responseData
            ]);

        } catch (Exception $e) {
            Log::error('API Chatbot error', [
                'message' => $request->input('message', ''),
                'chat_id' => $request->input('chat_id', ''),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Sorry, I encountered an error processing your message. Please try again.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get configuration value by key
     *
     * @param string $key
     * @return string|null
     */
    private function getConfigValue(string $key): ?string
    {
        try {
            $config = \App\Models\Configuration::where('key', $key)
                ->where('group', 'chatbot')
                ->first();
            
            return $config ? $config->value : null;
        } catch (Exception $e) {
            Log::error('Failed to get config value', [
                'key' => $key,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }
}
