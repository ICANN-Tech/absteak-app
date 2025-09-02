import type { ChatMessage } from '../Services/Chatbot.service';

// Message type for UI components
export interface MessageType {
  from: 'user' | 'bot';
  message: string;
  timestamp: Date;
  id?: string;
}

// Utility functions for chat operations
export class ChatUtils {
  /**
   * Convert ChatMessage to MessageType for UI display
   */
  static convertToMessageType(chatMessage: ChatMessage): MessageType {
    return {
      from: chatMessage.sender,
      message: chatMessage.content,
      timestamp: chatMessage.timestamp,
      id: chatMessage.id
    };
  }

  /**
   * Convert MessageType to ChatMessage
   */
  static convertToChatMessage(messageType: MessageType): ChatMessage {
    return {
      id: messageType.id || `msg_${Date.now()}`,
      content: messageType.message,
      sender: messageType.from,
      timestamp: messageType.timestamp
    };
  }

  /**
   * Generate unique message ID
   */
  static generateMessageId(prefix: string = 'msg'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format timestamp for display
   */
  static formatTimestamp(timestamp: Date): string {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Check if message is from bot
   */
  static isBot(message: MessageType): boolean {
    return message.from === 'bot';
  }

  /**
   * Check if message is from user
   */
  static isUser(message: MessageType): boolean {
    return message.from === 'user';
  }

  /**
   * Get recent messages (last N messages)
   */
  static getRecentMessages(messages: MessageType[], count: number): MessageType[] {
    return messages.slice(-count);
  }

  /**
   * Filter messages by sender
   */
  static getMessagesBySender(messages: MessageType[], sender: 'user' | 'bot'): MessageType[] {
    return messages.filter(msg => msg.from === sender);
  }

  /**
   * Validate message content
   */
  static validateMessage(message: string): boolean {
    return message.trim().length > 0;
  }

  /**
   * Sanitize message content
   */
  static sanitizeMessage(message: string): string {
    return message.trim().replace(/\s+/g, ' ');
  }
}

// Event handling utilities
export class ChatEventUtils {
  /**
   * Handle escape key press
   */
  static handleEscape(event: KeyboardEvent, callback: () => void): void {
    if (event.key === 'Escape') {
      callback();
    }
  }

  /**
   * Handle enter key press for sending messages
   */
  static handleEnterKey(event: KeyboardEvent, callback: () => void): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      callback();
    }
  }

  /**
   * Handle click outside element
   */
  static handleClickOutside(
    event: MouseEvent, 
    targetSelectors: string[], 
    callback: () => void
  ): void {
    const target = event.target as HTMLElement;
    const isOutside = targetSelectors.every(selector => {
      const element = document.querySelector(selector);
      return element && !element.contains(target);
    });

    if (isOutside) {
      callback();
    }
  }
}

// DOM utilities
export class ChatDOMUtils {
  /**
   * Scroll to bottom of chat container
   */
  static scrollToBottom(containerSelector: string): void {
    const container = document.querySelector(containerSelector);
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  /**
   * Focus on input element
   */
  static focusInput(inputSelector: string): void {
    const input = document.querySelector(inputSelector) as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

  /**
   * Clear input value
   */
  static clearInput(inputSelector: string): void {
    const input = document.querySelector(inputSelector) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
}

// Error handling utilities
export class ChatErrorUtils {
  /**
   * Create error message
   */
  static createErrorMessage(error: string): MessageType {
    return {
      from: 'bot',
      message: error,
      timestamp: new Date(),
      id: ChatUtils.generateMessageId('error')
    };
  }

  /**
   * Handle and format error
   */
  static handleError(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as { message: string }).message;
    }
    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Log error with context
   */
  static logError(context: string, error: unknown): void {
    console.error(`[ChatBot ${context}]:`, error);
  }
}

// Export all utilities as a single object for convenience
export const chatUtils = {
  ...ChatUtils,
  events: ChatEventUtils,
  dom: ChatDOMUtils,
  errors: ChatErrorUtils
};

export default chatUtils;