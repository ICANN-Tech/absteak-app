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
  isCSSession?: boolean;
  csAgentName?: string;
  privateChannelName?: string;
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
  private pusher: any = null;
  private privateChannel: any = null;
  private csConnectionState: 'idle' | 'connecting' | 'waiting' | 'connected' | 'disconnected' = 'idle';
  private csStateChangeCallback: ((state: string, agentName?: string) => void) | null = null;
  private messageCallback: ((message: ChatMessage) => void) | null = null;

  /**
   * Start a new chat session
   */
  async startNewSession(): Promise<ChatSession> {
    console.log('🚀 [startNewSession] Starting new chat session');
    try {
      // Initialize Pusher connection first (like sample-chat.blade.php)
      if (!this.pusher) {
        await this.initializePusher();
      }

      // Initialize session with correct parameters
      const response = await fetch('/api/chat/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken()
        },
        body: JSON.stringify({
          user_type: 'guest',
          guest_data: {
            name: 'Guest User',
            email: null,
            phone: null
          }
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
      // Fallback to local session with Pusher initialization
      if (!this.pusher) {
        try {
          await this.initializePusher();
        } catch (pusherError) {
          console.error('Failed to initialize Pusher in fallback:', pusherError);
        }
      }
      
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
    console.log('🛑 [endCurrentSession] Ending current session');
    if (this.currentSession?.isCSSession && this.privateChannel) {
      this.disconnectFromCS();
    }
    this.currentSession = null;
  }

  /**
   * Test connection to the chatbot service
   */
  async testConnection(): Promise<boolean> {
    console.log('🔍 [testConnection] Testing connection to chatbot service');
    try {
      // Test API connection
      const response = await fetch('/api/chat/test-connection', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken()
        }
      });
      
      const apiConnected = response.ok;
      
      // Also check Pusher connection status (like sample-chat.blade.php)
      const pusherConnected = this.pusher && this.pusher.connection.state === 'connected';
      
      this.isConnected = apiConnected && pusherConnected;
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
    console.log('💬 [sendMessage] Sending message:', message);
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

      // Handle CS session differently
      if (this.currentSession.isCSSession && this.currentSession.privateChannelName) {
        const response = await this.sendToCS(message);
        // Don't add empty response to messages - CS will respond via WebSocket
        return response;
      } else {
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
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Clear chat history for current session
   */
  clearHistory(): void {
    console.log('🗑️ [clearHistory] Clearing chat history');
    if (this.currentSession) {
      this.currentSession.messages = [];
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): ChatSession | null {
    console.log('📋 [getCurrentSession] Getting current session:', this.currentSession?.id);
    return this.currentSession;
  }

  /**
   * Get CS connection state
   */
  getCSConnectionState(): string {
    console.log('🔗 [getCSConnectionState] Current CS state:', this.csConnectionState);
    return this.csConnectionState;
  }

  /**
   * Set callback for CS state changes
   */
  setCSStateChangeCallback(callback: (state: string, agentName?: string) => void): void {
    console.log('📞 [setCSStateChangeCallback] Setting CS state change callback');
    this.csStateChangeCallback = callback;
  }

  /**
   * Set callback for new messages
   */
  setMessageCallback(callback: (message: ChatMessage) => void): void {
    console.log('📨 [setMessageCallback] Setting message callback');
    this.messageCallback = callback;
  }

  /**
   * Connect to Customer Service
   */
  async connectToCS(): Promise<void> {
    console.log('🎧 [connectToCS] Connecting to Customer Service');
    if (!this.currentSession) {
      throw new Error('No active session. Please start a new session first.');
    }

    try {
      console.log('🔄 Starting CS connection...');
      this.updateCSState('connecting');
      
      // Pusher should already be initialized in startNewSession()
      if (!this.pusher) {
        throw new Error('Pusher not initialized. Please start a new session first.');
      }
      
      // Wait for Pusher connection if not connected yet
      if (this.pusher.connection.state !== 'connected') {
        console.log('Waiting for Pusher connection...');
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Pusher connection timeout'));
          }, 5000);
          
          this.pusher.connection.bind('connected', () => {
            clearTimeout(timeout);
            resolve(true);
          });
          
          this.pusher.connection.bind('error', (error: any) => {
            clearTimeout(timeout);
            reject(error);
          });
        });
      }

      // Subscribe to main customer service channel to receive private chat invites (like sample-chat.blade.php)
      // Use 'chat.general' to match the room used by agent in inviteToPrivateChat
      const mainChannel = this.pusher.subscribe('chat.general');
      mainChannel.bind('private-chat-invite', (data: any) => {
        this.handlePrivateChatInvite(data);
      });

      // Join chat room via API (matching sample-chat.blade.php format)
      const response = await fetch('/api/chat/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken()
        },
        body: JSON.stringify({
          username: `customer_${this.currentSession.id}`,
          room: 'general', // Use 'general' to match the channel subscription
          user_type: 'customer',
          joined_at: new Date().toISOString(),
          user_id: this.currentSession.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📡 CS API Response:', data);
      
      if (data.success) {
        // Update to waiting state - CS join room successful, waiting for agent to send private-chat-invite
        this.updateCSState('waiting');
      } else {
        throw new Error(data.message || 'Failed to connect to customer service');
      }
    } catch (error) {
      this.updateCSState('idle');
      console.error('Failed to connect to CS:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Customer Service
   */
  async disconnectFromCS(): Promise<void> {
    console.log('🔌 [disconnectFromCS] Disconnecting from Customer Service');
    if (!this.currentSession?.isCSSession) {
      return;
    }

    try {
      // Send disconnect notification
      if (this.currentSession.privateChannelName) {
        await fetch('/api/chat/private/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': this.getCsrfToken()
          },
          body: JSON.stringify({
            channel: this.currentSession.privateChannelName,
            message: 'Customer has disconnected from chat',
            user_type: 'system'
          })
        });
      }

      // Unsubscribe from private channel
      if (this.privateChannel) {
        this.pusher?.unsubscribe(this.privateChannel.name);
        this.privateChannel = null;
      }

      // Reset session state
      this.currentSession.isCSSession = false;
      this.currentSession.csAgentName = undefined;
      this.currentSession.privateChannelName = undefined;
      
      this.updateCSState('disconnected');
      
      // Add system message
      const systemMessage: ChatMessage = {
        id: `system_${Date.now()}`,
        content: 'You have been disconnected from customer service.',
        timestamp: new Date(),
        sender: 'bot'
      };
      this.currentSession.messages.push(systemMessage);
      
    } catch (error) {
      console.error('Failed to disconnect from CS:', error);
    }
  }

  /**
   * Process menu selection and return appropriate prompt
   */
  getMenuPrompt(menuItem: string): string {
    console.log('📋 [getMenuPrompt] Getting menu prompt for:', menuItem);
    return CHATBOT_CONFIG.MENU_PROMPTS[menuItem as keyof typeof CHATBOT_CONFIG.MENU_PROMPTS] 
      || `Help me with ${menuItem}`;
  }

  /**
   * Send message to Customer Service via chat API (following sample-chat.blade.php pattern)
   */
  private async sendToCS(message: string): Promise<BotResponse> {
    console.log('🎧 [sendToCS] Sending message to CS:', message);
    if (!this.currentSession?.privateChannelName) {
      throw new Error('No private channel available for CS communication');
    }

    // Use same message format as sample-chat.blade.php
    const messageData = {
      username: `customer_${this.currentSession.id}`,
      message: message,
      timestamp: new Date().toISOString(),
      user_type: 'customer',
      channel: this.currentSession.privateChannelName,
      customer_id: this.currentSession.id
    };

    const response = await fetch('/api/chat/private/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': this.getCsrfToken()
      },
      body: JSON.stringify(messageData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Don't return a placeholder response - let CS respond via WebSocket (like sample-chat.blade.php)
    // Return empty response to avoid showing 'Message sent...' text
    return {
      id: `cs_${Date.now()}`,
      content: '', // Empty content to avoid showing placeholder message
      timestamp: new Date()
    };
  }

  /**
   * Send message to Chatwoot via Laravel API
   */
  private async sendToChatwoot(message: string): Promise<BotResponse> {
    console.log('🤖 [sendToChatwoot] Sending message to Chatwoot:', message);
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
    console.log('🔐 [getCsrfToken] Getting CSRF token');
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) return metaToken;
    
    // Fallback to window object if available
    return (window as any).chatConfig?.csrfToken || '';
  }

  /**
   * Generate contextual response based on user input
   */
  private generateContextualResponse(userMessage: string): string {
    console.log('🧠 [generateContextualResponse] Generating response for:', userMessage);
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
    console.log('❌ [handleError] Handling error:', error);
    if (error && typeof error === 'object' && 'message' in error) {
      return error as FlowiseError;
    }
    
    return {
      message: CHATBOT_CONFIG.ERROR_MESSAGES.SEND_MESSAGE_FAILED,
      code: 'UNKNOWN_ERROR'
    } as FlowiseError;
  }

  /**
   * Handle private chat invite from agent (following sample-chat.blade.php pattern)
   */
  private handlePrivateChatInvite(data: any): void {
    console.log('📨 [handlePrivateChatInvite] Handling private chat invite:', data);
    console.log('🔍 [handlePrivateChatInvite] Current session ID:', this.currentSession?.id);
    console.log('🔍 [handlePrivateChatInvite] Data customer_id:', data.customer_id);
    console.log('🔍 [handlePrivateChatInvite] Expected format:', `customer_${this.currentSession?.id}`);
    
    if (!this.currentSession) {
      console.log('❌ [handlePrivateChatInvite] No current session, ignoring invite');
      return;
    }
    
    // Check multiple possible formats for customer_id matching
    const sessionId = this.currentSession.id;
    const possibleMatches = [
      data.customer_id === `customer_${sessionId}`,
      data.customer_id === sessionId,
      data.customer_id === `${sessionId}`,
      data.user_id === sessionId,
      data.user_id === `customer_${sessionId}`
    ];
    
    console.log('🔍 [handlePrivateChatInvite] Possible matches:', possibleMatches);
    
    if (!possibleMatches.some(match => match)) {
      console.log('❌ [handlePrivateChatInvite] Customer ID mismatch, ignoring invite');
      return;
    }
    
    console.log('✅ [handlePrivateChatInvite] Customer ID matched, processing invite');

    console.log('📨 Private chat invite received for current session:', data);
    
    // Display invitation message
    const inviteMessage: ChatMessage = {
      id: `system_${Date.now()}`,
      content: 'CS BERGABUNG',
      timestamp: new Date(),
      sender: 'bot',
      sessionId: this.currentSession.id
    };
    this.currentSession.messages.push(inviteMessage);
    
    // Notify UI about new message
    if (this.messageCallback) {
      this.messageCallback(inviteMessage);
    }
    
    // Subscribe to the private channel (following sample-chat.blade.php pattern)
    this.privateChannel = this.pusher.subscribe(data.channel_name);
    
    // Bind private chat events (like sample-chat.blade.php)
    this.privateChannel.bind('message', (messageData: any) => {
      console.log('📨 Received message event:', messageData);
      console.log('🔍 Current session:', this.currentSession?.id);
      console.log('🔍 Message user_type:', messageData.user_type);
      if (this.currentSession && messageData.user_type === 'agent') {
        console.log('✅ Processing agent message');
        const message: ChatMessage = {
          id: messageData.message_id || `agent_${Date.now()}`,
          content: messageData.message,
          timestamp: new Date(messageData.timestamp || Date.now()),
          sender: 'bot',
          sessionId: this.currentSession.id
        };
        this.currentSession.messages.push(message);
        
        // Notify UI about new message
        if (this.messageCallback) {
          console.log('📢 Calling messageCallback with:', message);
          this.messageCallback(message);
        } else {
          console.log('❌ No messageCallback set');
        }
      } else {
        console.log('❌ Message not processed - session:', !!this.currentSession, 'user_type:', messageData.user_type);
      }
    });
    
    this.privateChannel.bind('agent-joined', (agentData: any) => {
      console.log('👨‍💼 Agent joined event:', agentData);
      if (this.currentSession) {
        this.currentSession.csAgentName = agentData.agent_name;
        this.updateCSState('connected', agentData.agent_name);
      }
    });
    
    this.privateChannel.bind('agent-left', (agentData: any) => {
      console.log('👋 Agent left event:', agentData);
      if (this.currentSession) {
        const systemMessage: ChatMessage = {
          id: `system_${Date.now()}`,
          content: 'CS KELUAR',
          timestamp: new Date(),
          sender: 'bot',
          sessionId: this.currentSession.id
        };
        this.currentSession.messages.push(systemMessage);
        
        // Notify UI about new message
        if (this.messageCallback) {
          this.messageCallback(systemMessage);
        }
        
        this.updateCSState('disconnected');
      }
    });
    
    // Update session info
    this.currentSession.isCSSession = true;
    this.currentSession.csAgentName = data.agent_name;
    this.currentSession.privateChannelName = data.channel_name;
    
    // Update state to connected since agent has initiated the chat
    this.updateCSState('connected', data.agent_name);
  }

  /**
   * Update CS connection state and notify callback
   */
  private updateCSState(newState: 'idle' | 'connecting' | 'waiting' | 'connected' | 'disconnected', agentName?: string): void {
    console.log('🔄 [updateCSState] Updating CS state from', this.csConnectionState, 'to', newState, agentName ? `(Agent: ${agentName})` : '');
    console.log(`🔄 CS State Change: ${this.csConnectionState} → ${newState}`, agentName ? `(Agent: ${agentName})` : '');
    this.csConnectionState = newState;
    if (this.csStateChangeCallback) {
      this.csStateChangeCallback(newState, agentName);
    }
  }

  /**
   * Initialize Pusher for real-time communication (following sample-chat.blade.php pattern)
   */
  private async initializePusher(): Promise<void> {
    console.log('🔌 [initializePusher] Initializing Pusher connection');
    return new Promise((resolve, reject) => {
      try {
        // Load Pusher script if not already loaded
        if (typeof window !== 'undefined' && !(window as any).Pusher) {
          const script = document.createElement('script');
          script.src = 'https://js.pusher.com/8.2.0/pusher.min.js';
          script.onload = () => {
            this.createPusherInstance();
            // Wait for connection like sample-chat.blade.php
            this.pusher.connection.bind('connected', () => {
              resolve();
            });
            this.pusher.connection.bind('error', (error: any) => {
              reject(new Error('WebSocket connection failed'));
            });
          };
          script.onerror = () => reject(new Error('Failed to load Pusher script'));
          document.head.appendChild(script);
        } else {
          this.createPusherInstance();
          // Wait for connection like sample-chat.blade.php
          this.pusher.connection.bind('connected', () => {
            resolve();
          });
          this.pusher.connection.bind('error', (error: any) => {
            reject(new Error('WebSocket connection failed'));
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Create Pusher instance (following sample-chat.blade.php implementation)
   */
  private createPusherInstance(): void {
    const PusherClass = (window as any).Pusher;
    // Use exact same configuration as sample-chat.blade.php
    this.pusher = new PusherClass('app-key', {
      wsHost: 'localhost',
      wsPort: 6001,
      wssPort: 6001,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
      cluster: 'mt1',
      authEndpoint: '/broadcasting/auth'
    });

    // Add connection event handlers (exactly like sample-chat.blade.php)
    this.pusher.connection.bind('connected', () => {
      console.log('Soketi connected successfully');
      this.isConnected = true;
    });

    this.pusher.connection.bind('disconnected', () => {
      console.log('Soketi disconnected');
      this.isConnected = false;
    });

    this.pusher.connection.bind('error', (error: any) => {
      console.error('Soketi connection error:', error);
      this.isConnected = false;
    });
  }

  /**
   * Subscribe to private channel for CS communication (integrated into connectToCS following sample-chat.blade.php)
   * This method is now handled directly in connectToCS method
   */

}

// Export singleton instance
export const chatbotService = new ChatbotService();
export default chatbotService;