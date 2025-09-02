import { CHATBOT_CONFIG } from '../Const/Chatbot.const';

// Type definitions
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sessionId?: string;
}

export interface FlowiseError {
  message: string;
  status?: number;
  details?: any;
  code?: string;
}

export interface ChatSession {
  id: string;
  startTime: Date;
  messages: ChatMessage[];
  conversationId?: string;
  contactId?: string;
}

export interface BotResponse {
  id: string;
  content: string;
  timestamp: Date;
}

export interface ChatInitResponse {
  success: boolean;
  data: {
    session_id: string;
    conversation_id: string;
    contact_id: string;
  };
  message?: string;
}

class ChatbotService {
  private currentSession: ChatSession | null = null;
  private isConnected = false;

  /**
   * Start a new chat session
   */
  async startNewSession(): Promise<ChatSession> {
    try {
      // Initialize session with Chatwoot
      const response = await fetch('/api/chat/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken()
        },
        body: JSON.stringify({
          type: 'guest'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to initialize session');
      }

      const session: ChatSession = {
        id: data.data.session_id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: new Date(),
        messages: []
      };
      
      this.currentSession = session;
      return session;
    } catch (error) {
      console.error('Failed to start new session:', error);
      // Fallback to local session
      const session: ChatSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: new Date(),
        messages: []
      };
      
      this.currentSession = session;
      return session;
    }
  }

  /**
   * End the current session
   */
  endCurrentSession(): void {
    this.currentSession = null;
  }

  /**
   * Test connection to the chatbot service
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/chat/test-connection', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken()
        }
      });
      
      this.isConnected = response.ok;
      return this.isConnected;
    } catch (error) {
      console.error('Connection test failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Send a message to the chatbot and get response
   */
  async sendMessage(message: string): Promise<BotResponse> {
    if (!this.currentSession) {
      throw new Error('No active session. Please start a new session first.');
    }

    try {
      // Add user message to session
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        content: message,
        timestamp: new Date(),
        sender: 'user'
      };
      
      this.currentSession.messages.push(userMessage);

      // Send to Chatwoot API via Laravel backend
      const response = await this.sendToChatwoot(message);
      
      // Add bot response to session
      const botMessage: ChatMessage = {
        id: response.id,
        content: response.content,
        timestamp: response.timestamp,
        sender: 'bot'
      };
      
      this.currentSession.messages.push(botMessage);
      
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Clear chat history for current session
   */
  clearHistory(): void {
    if (this.currentSession) {
      this.currentSession.messages = [];
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): ChatSession | null {
    return this.currentSession;
  }

  /**
   * Process menu selection and return appropriate prompt
   */
  getMenuPrompt(menuItem: string): string {
    return CHATBOT_CONFIG.MENU_PROMPTS[menuItem as keyof typeof CHATBOT_CONFIG.MENU_PROMPTS] 
      || `Help me with ${menuItem}`;
  }

  /**
   * Send message to Chatwoot via Laravel API
   */
  private async sendToChatwoot(message: string): Promise<BotResponse> {
    const response = await fetch('/api/chat/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': this.getCsrfToken()
      },
      body: JSON.stringify({
        message: message,
        session_id: this.currentSession?.id,
        type: 'guest'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to send message');
    }

    return {
      id: data.data.message_id || `bot_${Date.now()}`,
      content: data.data.response || 'Thank you for your message. Our team will respond shortly.',
      timestamp: new Date(data.data.timestamp || Date.now())
    };
  }

  /**
   * Get CSRF token from meta tag or window object
   */
  private getCsrfToken(): string {
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) return metaToken;
    
    // Fallback to window object if available
    return (window as any).chatConfig?.csrfToken || '';
  }

  /**
   * Generate contextual response based on user input
   */
  private generateContextualResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.indexOf('menu') !== -1 || message.indexOf('food') !== -1 || message.indexOf('dish') !== -1) {
      return "I'd be happy to help you with our menu! We offer premium steaks, fresh seafood, and seasonal specialties. Would you like me to recommend some popular dishes or do you have specific dietary preferences?";
    }
    
    if (message.indexOf('reservation') !== -1 || message.indexOf('book') !== -1 || message.indexOf('dine in') !== -1) {
      return "I can help you make a reservation! What date and time would you prefer? Also, how many guests will be joining you?";
    }
    
    if (message.indexOf('takeaway') !== -1 || message.indexOf('delivery') !== -1 || message.indexOf('dine out') !== -1) {
      return "Great! We offer both takeaway and delivery services. Our delivery area covers most of the city. What would you like to order today?";
    }
    
    if (message.indexOf('customer service') !== -1 || message.indexOf('help') !== -1 || message.indexOf('support') !== -1) {
      return "I'm here to help! Whether you need assistance with reservations, menu information, or have any questions about our services, feel free to ask. What can I help you with today?";
    }
    
    return "Thank you for your message! I'm here to help with reservations, menu information, takeaway orders, and any questions about AB Steak. How can I assist you today?";
  }

  /**
   * Handle and format errors
   */
  private handleError(error: unknown): FlowiseError {
    if (error && typeof error === 'object' && 'message' in error) {
      return error as FlowiseError;
    }
    
    return {
      message: CHATBOT_CONFIG.ERROR_MESSAGES.SEND_MESSAGE_FAILED,
      code: 'UNKNOWN_ERROR'
    } as FlowiseError;
  }
}

// Export singleton instance
export const chatbotService = new ChatbotService();
export default chatbotService;