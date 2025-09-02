# AB Steak Chatbot Module

A modular, clean, and reusable chatbot integration for the AB Steak application, built with Svelte and TypeScript.

## Overview

This module provides a complete chatbot solution with the following components:

- **Service Layer**: Core business logic and message management
- **Utility Layer**: Reusable helper functions for chat operations
- **UI Components**: Modular Svelte components for chat interface
- **Configuration**: Centralized constants and settings
- **Type Safety**: Comprehensive TypeScript type definitions

## Architecture

```
resources/js/Modules/Guest/Chatbot/
├── Index.svelte                # Main chatbot component
├── Services/
│   └── Chatbot.service.ts      # Core chatbot service
├── Utils/
│   └── Chat.util.ts            # Utility functions
├── Parts/
│   ├── Button.svelte           # Chat toggle button
│   ├── Dialog.svelte           # Chat dialog container
│   ├── Header.svelte           # Chat header
│   ├── Input.svelte            # Message input
│   └── BadgeMenu.svelte        # Menu badges
├── Const/
│   └── Chatbot.const.ts        # Configuration constants
└── README.md                   # This documentation
```

## Installation & Setup

### Prerequisites
- Svelte/SvelteKit application
- TypeScript support
- Tailwind CSS for styling

### Basic Integration

1. Import the chatbot component in your Svelte page:

```svelte
<script>
  import Chatbot from './Modules/Guest/Chatbot/Index.svelte';
</script>

<Chatbot />
```

2. Customize the chatbot with props:

```svelte
<Chatbot 
  position="bottom-right"
  initialMessage="Welcome to AB Steak! How can I help you?"
  customMenuItems={['Menu', 'Reservations', 'Contact']}
  showMenuButtons={true}
  disabled={false}
/>

## Quick Start

### Basic Usage

```typescript
import { chatbotService } from './Services/Chatbot.service';
import { chatUtils } from './Utils/Chat.util';

// Start a new chat session
const session = chatbotService.startNewSession();

// Send a message
const response = await chatbotService.sendMessage('Tell me about your menu');
console.log(response.content); // Bot's response

// Get current session
const currentSession = chatbotService.getCurrentSession();
```

### Using Utility Functions

```typescript
import { ChatUtils, chatUtils } from './Utils/Chat.util';

// Message validation and sanitization
const isValid = ChatUtils.validateMessage(userInput);
const cleanMessage = ChatUtils.sanitizeMessage(userInput);

// Message type conversion
const messageType = ChatUtils.convertToMessageType(chatMessage);
const chatMessage = ChatUtils.convertToChatMessage(messageType);

// Event handling
chatUtils.events.handleEnterKey(event, sendMessage);
chatUtils.events.handleEscape(event, closeChat);

// DOM utilities
chatUtils.dom.scrollToBottom('.chat-container');
chatUtils.dom.focusInput('#message-input');
```

## API Reference

### ChatbotService Class

#### Core Methods

```typescript
// Session management
startNewSession(): ChatSession
endCurrentSession(): void
getCurrentSession(): ChatSession | null

// Message handling
sendMessage(message: string): Promise<BotResponse>
clearHistory(): void
getMenuPrompt(menuItem: string): string

// Connection
testConnection(): Promise<boolean>
```

### ChatUtils Class

#### Message Operations

```typescript
// Type conversion
static convertToMessageType(chatMessage: ChatMessage): MessageType
static convertToChatMessage(messageType: MessageType): ChatMessage

// Validation and formatting
static validateMessage(message: string): boolean
static sanitizeMessage(message: string): string
static generateMessageId(prefix?: string): string
static formatTimestamp(timestamp: Date): string

// Message filtering
static isBot(message: MessageType): boolean
static isUser(message: MessageType): boolean
static getRecentMessages(messages: MessageType[], count: number): MessageType[]
static getMessagesBySender(messages: MessageType[], sender: 'user' | 'bot'): MessageType[]
```

### ChatEventUtils Class

```typescript
// Event handling
static handleEscape(event: KeyboardEvent, callback: () => void): void
static handleEnterKey(event: KeyboardEvent, callback: () => void): void
static handleClickOutside(event: MouseEvent, targetSelectors: string[], callback: () => void): void
```

### ChatDOMUtils Class

```typescript
// DOM manipulation
static scrollToBottom(containerSelector: string): void
static focusInput(inputSelector: string): void
static clearInput(inputSelector: string): void
```

### ChatErrorUtils Class

```typescript
// Error handling
static createErrorMessage(error: string): MessageType
static handleError(error: unknown): string
static logError(context: string, error: unknown): void
```

## Type Definitions

### Core Types

```typescript
// Service layer types
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sessionId?: string;
}

interface ChatSession {
  id: string;
  startTime: Date;
  messages: ChatMessage[];
}

interface BotResponse {
  id: string;
  content: string;
  timestamp: Date;
}

interface FlowiseError {
  message: string;
  status?: number;
  details?: any;
  code?: string;
}

// UI layer types
interface MessageType {
  from: 'user' | 'bot';
  message: string;
  timestamp: Date;
  id?: string;
}

// Configuration types
type ChatbotPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
```

## Error Handling

The module includes comprehensive error handling:

```typescript
try {
  const response = await chatbotService.sendMessage('Hello');
  // Handle success
} catch (error) {
  // Use utility for consistent error handling
  const errorMessage = chatUtils.errors.handleError(error);
  console.error('Chat error:', errorMessage);
  
  // Log with context
  chatUtils.errors.logError('sendMessage', error);
  
  // Create error message for UI
  const errorMsg = chatUtils.errors.createErrorMessage(errorMessage);
}
```

## Best Practices

### 1. Session Management
```typescript
// Always start a new session for new conversations
const session = chatbotService.startNewSession();

// End sessions when done
chatbotService.endCurrentSession();
```

### 2. Message Validation
```typescript
// Always validate and sanitize user input
if (!ChatUtils.validateMessage(userInput)) {
  return; // Don't send empty messages
}

const cleanMessage = ChatUtils.sanitizeMessage(userInput);
const response = await chatbotService.sendMessage(cleanMessage);
```

### 3. Error Handling
```typescript
// Use utility functions for consistent error handling
try {
  const response = await chatbotService.sendMessage(message);
} catch (error) {
  chatUtils.errors.logError('sendMessage', error);
  const errorMessage = chatUtils.errors.handleError(error);
  // Display error to user
}
```

### 4. Event Handling
```typescript
// Use utility functions for consistent event handling
document.addEventListener('keydown', (e) => 
  chatUtils.events.handleEscape(e, closeChat)
);

// Handle enter key for message sending
function handleKeyDown(e: KeyboardEvent) {
  chatUtils.events.handleEnterKey(e, sendMessage);
}
```

### 5. Component Props
```typescript
// Use proper TypeScript types for component props
interface ChatbotProps {
  open?: boolean;
  position?: ChatbotPosition;
  showMenuButtons?: boolean;
  customMenuItems?: string[];
  initialMessage?: string;
  placeholder?: string;
  disabled?: boolean;
}
```

## Usage Examples

### Basic Chatbot Integration

```svelte
<script lang="ts">
  import Chatbot from './Modules/Guest/Chatbot/Index.svelte';
</script>

<!-- Simple integration -->
<Chatbot />

<!-- With custom configuration -->
<Chatbot 
  position="bottom-left"
  initialMessage="Welcome! How can I assist you today?"
  customMenuItems={['Menu', 'Reservations', 'Delivery', 'Contact']}
  placeholder="Ask me anything..."
/>
```

### Programmatic Usage

```typescript
import { chatbotService } from './Services/Chatbot.service';
import { ChatUtils, chatUtils } from './Utils/Chat.util';

// Start a conversation
const session = chatbotService.startNewSession();

// Send a message with validation
const userMessage = "Tell me about your steaks";
if (ChatUtils.validateMessage(userMessage)) {
  const cleanMessage = ChatUtils.sanitizeMessage(userMessage);
  const response = await chatbotService.sendMessage(cleanMessage);
  console.log('Bot response:', response.content);
}

// Handle events
function setupEventListeners() {
  document.addEventListener('keydown', (e) => {
    chatUtils.events.handleEscape(e, () => {
      console.log('Chat closed via escape key');
    });
  });
}

// Clean up
chatbotService.endCurrentSession();
```

### Custom Menu Integration

```typescript
// Get menu prompt for specific action
const menuPrompt = chatbotService.getMenuPrompt('Menu');
console.log(menuPrompt); // "Tell me about your menu and dishes"

// Send menu-specific message
const response = await chatbotService.sendMessage(menuPrompt);
```

## Configuration

The chatbot uses centralized configuration in `Const/Chatbot.const.ts`:

```typescript
export const CHATBOT_CONFIG = {
  // Default settings
  DEFAULT_POSITION: 'bottom-right',
  DEFAULT_INITIAL_MESSAGE: 'Hi! How can I help you?',
  DEFAULT_PLACEHOLDER: 'Type your message...',
  DEFAULT_MENU_ITEMS: ['CS', 'Menu', 'Dine In', 'Dine Out'],
  
  // Menu prompts
  MENU_PROMPTS: {
    CS: 'I need customer service assistance',
    Menu: 'Tell me about your menu and dishes',
    'Dine In': 'I want to dine in and make a reservation',
    'Dine Out': 'I want to order takeaway or delivery'
  },
  
  // Error messages
  ERROR_MESSAGES: {
    CONNECTION_FAILED: 'Unable to connect to chatbot service.',
    INITIALIZATION_FAILED: 'Failed to initialize chatbot.',
    SEND_MESSAGE_FAILED: 'Failed to send message.'
  }
};
```

## Security Considerations

1. **Input Validation**: Always validate and sanitize user input using `ChatUtils.validateMessage()` and `ChatUtils.sanitizeMessage()`
2. **Error Handling**: Use `ChatErrorUtils.handleError()` to avoid exposing internal error details
3. **Session Management**: Properly manage chat sessions and clean up when done
4. **XSS Prevention**: The utility functions help prevent XSS by sanitizing message content

## Troubleshooting

### Common Issues

1. **Import Errors**
   ```
   Error: Cannot find module './Utils/Chat.util'
   ```
   Solution: Ensure all files are in the correct directory structure and imports use relative paths.

2. **TypeScript Errors**
   ```
   Error: Property 'validateMessage' does not exist
   ```
   Solution: Import `ChatUtils` class directly: `import { ChatUtils } from './Utils/Chat.util'`

3. **Session Not Found**
   ```
   Error: No active session. Please start a new session first.
   ```
   Solution: Always call `chatbotService.startNewSession()` before sending messages.

### Debug Mode

```typescript
// Test connection
const isConnected = await chatbotService.testConnection();
console.log('Connection status:', isConnected);

// Check current session
const session = chatbotService.getCurrentSession();
console.log('Current session:', session);

// Enable error logging
chatUtils.errors.logError('debug', 'Testing error logging');
```

### Performance Tips

1. **Message Validation**: Always validate messages before sending to avoid unnecessary API calls
2. **Session Management**: End sessions when not needed to free up memory
3. **Event Listeners**: Remove event listeners in component cleanup to prevent memory leaks
4. **Error Handling**: Use utility functions for consistent and efficient error handling

## File Structure Summary

```
Chatbot/
├── Index.svelte              # Main component (optimized)
├── Services/
│   └── Chatbot.service.ts     # Core service (refactored)
├── Utils/
│   └── Chat.util.ts           # Utility functions (new)
├── Parts/                     # UI components
├── Const/
│   └── Chatbot.const.ts       # Configuration
└── README.md                  # This documentation
```

## Contributing

When contributing to this module:

1. **Code Style**: Follow the established patterns and use TypeScript strictly
2. **Modularity**: Keep functions small and focused, use utility classes appropriately
3. **Error Handling**: Always use `ChatErrorUtils` for consistent error handling
4. **Testing**: Test all new functionality, especially utility functions
5. **Documentation**: Update this README when adding new features
6. **Type Safety**: Maintain comprehensive TypeScript types for all interfaces

## License

This chatbot module is part of the AB Steak application and follows the same licensing terms.