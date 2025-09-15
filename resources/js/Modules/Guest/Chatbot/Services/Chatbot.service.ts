import { CHATBOT_CONFIG } from '../Const/Chatbot.const';
import { ChatUtils } from '../Utils/Chat.util';

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
  isReadOnly?: boolean;
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
  private closeChatCallback: (() => void) | null = null;

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
        id: data.data.session_id || ChatUtils.generateMessageId('session'),
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
        id: ChatUtils.generateMessageId('session'),
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

    // Check if session is read-only (disconnected CS session)
    if (this.currentSession.isReadOnly) {
      throw new Error('This chat session is read-only. Please start a new conversation.');
    }

    // Check if trying to send to disconnected CS session
    if (this.currentSession.isCSSession && this.csConnectionState === 'disconnected') {
      throw new Error('Customer service is disconnected. Please reconnect to continue chatting.');
    }

    // Check if customer wants to close chat
    const lowerMessage = message.toLowerCase().trim();
    console.log('🔍 [sendMessage] Checking message for end chat keywords:', {
      originalMessage: message,
      lowerMessage: lowerMessage,
      isEndChatKeyword: lowerMessage === 'tutup chat' || lowerMessage === 'close chat' || lowerMessage === 'end chat',
      currentSessionExists: !!this.currentSession,
      isCSSession: this.currentSession?.isCSSession,
      csConnectionState: this.csConnectionState,
      csAgentName: this.currentSession?.csAgentName,
      privateChannelName: this.currentSession?.privateChannelName
    });
    
    if (lowerMessage === 'tutup chat' || lowerMessage === 'close chat' || lowerMessage === 'end chat') {
      console.log('🔚 [sendMessage] Customer requested to close chat with keyword:', lowerMessage);
      console.log('📊 [sendMessage] Current session state before triggering end chat:', {
        sessionId: this.currentSession?.id,
        isCSSession: this.currentSession?.isCSSession,
        csConnectionState: this.csConnectionState,
        csAgentName: this.currentSession?.csAgentName,
        privateChannelName: this.currentSession?.privateChannelName,
        hasPrivateChannel: !!this.privateChannel
      });
      console.log('🔄 [sendMessage] Triggering customer end chat...');
      await this.triggerCustomerEndChat();
      
      console.log('✅ [sendMessage] Customer end chat triggered, returning confirmation');
      // Return a confirmation response
      return {
        id: ChatUtils.generateMessageId('system'),
        content: 'Chat telah ditutup. Terima kasih!',
        timestamp: new Date()
      };
    }

    try {
      // Add user message to session
      const userMessage: ChatMessage = {
        id: ChatUtils.generateMessageId('user'),
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
   * Set close chat callback for when agent leaves
   */
  setCloseChatCallback(callback: () => void): void {
    console.log('🚪 [setCloseChatCallback] Setting close chat callback');
    this.closeChatCallback = callback;
  }

  /**
   * Connect to Customer Service
   */
  async connectToCS(): Promise<void> {
    console.log('🎧 [connectToCS] Connecting to Customer Service');
    
    // Always create new session for CS connection to ensure new channel ID
    console.log('🆕 [connectToCS] Creating new session for CS connection (new channel ID)');
    await this.startNewSession();

    if (!this.currentSession) {
      throw new Error('Failed to create session for CS connection.');
    }
    
    // Mark this as a CS session
    this.currentSession.isCSSession = true;

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

      // Mark session as read-only and reset CS-specific state
      this.currentSession.isReadOnly = true;
      this.currentSession.isCSSession = false;
      this.currentSession.csAgentName = undefined;
      this.currentSession.privateChannelName = undefined;
      
      this.updateCSState('disconnected');
      
      console.log('📖 [disconnectFromCS] Session marked as read-only - no new messages allowed');
      
      // Add system message
      const systemMessage: ChatMessage = {
        id: ChatUtils.generateMessageId('system'),
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
      id: ChatUtils.generateMessageId('cs'),
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
      id: data.data.message_id || ChatUtils.generateMessageId('bot'),
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
    
    // Unsubscribe from existing private channel if any to prevent duplicate listeners
    if (this.privateChannel) {
      console.log('🔄 Unsubscribing from existing private channel to prevent duplicates');
      this.privateChannel.unbind_all();
      this.pusher.unsubscribe(this.privateChannel.name);
    }
    
    // Subscribe to the private channel (following sample-chat.blade.php pattern)
    this.privateChannel = this.pusher.subscribe(data.channel_name);
    
    // Bind private chat events (like sample-chat.blade.php)
    
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
          id: ChatUtils.generateMessageId('system'),
          content: 'Customer Service mengakhiri obrolan. Silakan pilih menu di bawah ini untuk melanjutkan.',
          timestamp: new Date(),
          sender: 'bot',
          sessionId: this.currentSession.id
        };
        this.currentSession.messages.push(systemMessage);
        
        // Notify UI about new message
        if (this.messageCallback) {
          this.messageCallback(systemMessage);
        }
        
        // Disconnect from CS and return to bot
        this.handleAgentLeft();
      }
    });

    // Handle force end chat trigger from CS
    this.privateChannel.bind('force-end-chat', (triggerData: any) => {
      console.log('🔚 [CUSTOMER DEBUG] Force end chat trigger received from CS:', triggerData);
      console.log('🔍 [CUSTOMER DEBUG] Current session data:', {
        sessionId: this.currentSession?.id,
        customerId: this.currentSession?.contactId,
        isConnected: this.isConnected,
        csConnectionState: this.csConnectionState
      });
      
      if (this.currentSession && triggerData.trigger_source === 'cs') {
        console.log('🔄 [CUSTOMER DEBUG] CS triggered force end - auto ending chat');
        console.log('📝 [CUSTOMER DEBUG] Trigger data details:', {
          source: triggerData.trigger_source,
          message: triggerData.message,
          sessionId: triggerData.session_id,
          customerId: triggerData.customer_id
        });
        
        // Add system message
        const systemMessage: ChatMessage = {
          id: ChatUtils.generateMessageId('system'),
          content: 'Customer Service mengakhiri obrolan. Anda dapat melanjutkan dengan menu utama atau memulai chat baru.',
          timestamp: new Date(),
          sender: 'bot',
          sessionId: this.currentSession.id
        };
        this.currentSession.messages.push(systemMessage);
        
        // Notify UI about new message
        if (this.messageCallback) {
          this.messageCallback(systemMessage);
        }
        
        console.log('⏰ [CUSTOMER DEBUG] Starting auto-end countdown (1 second)');
        // Auto end the chat session
        setTimeout(() => {
          console.log('🏁 [CUSTOMER DEBUG] Executing auto-end chat');
          this.handleAgentLeft();
          // Trigger UI to show end chat or return to main menu
          if (typeof window !== 'undefined' && (window as any).chatApp) {
            (window as any).chatApp.showStartForm();
          }
        }, 1000); // Small delay to show the message first
      } else {
        console.log('❌ [CUSTOMER DEBUG] Trigger source mismatch or no session, ignoring:', {
          hasSession: !!this.currentSession,
          triggerSource: triggerData.trigger_source
        });
      }
    });

    // Handle system events (including agent-left from endCurrentChat)
    this.privateChannel.bind('message', (messageData: any) => {
      console.log('📨 Received message event:', messageData);
      console.log('🔍 Current session:', this.currentSession?.id);
      console.log('🔍 Message user_type:', messageData.user_type);
      
      if (this.currentSession) {
        if (messageData.user_type === 'agent') {
          console.log('✅ Processing agent message');
          
          // Check if message is "end chat" - just display message, don't auto-close
          if (messageData.message === 'end chat') {
            console.log('🏁 [CUSTOMER DEBUG] Received "end chat" message from agent');
            
            // Add the end chat message to chat history
            const endMessage: ChatMessage = {
              id: messageData.message_id || ChatUtils.generateMessageId('agent'),
              content: 'Agent has ended the chat session. You can continue chatting or close the dialog using the "Tutup Chat" button.',
              timestamp: new Date(messageData.timestamp || Date.now()),
              sender: 'bot',
              sessionId: this.currentSession.id
            };
            this.currentSession.messages.push(endMessage);
            
            // Notify UI about the end message
            if (this.messageCallback) {
              this.messageCallback(endMessage);
            }
            
            // Reset CS connection state but keep dialog open
            this.updateCSState('disconnected');
            
            return; // Don't process as regular message
          }
          
          const message: ChatMessage = {
            id: messageData.message_id || ChatUtils.generateMessageId('agent'),
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
        } else if (messageData.user_type === 'event') {
          // Handle event messages (like agent-left from endCurrentChat)
          try {
            const eventData = JSON.parse(messageData.message);
            if (eventData.event === 'agent-left') {
              console.log('👋 Agent left via event message:', eventData);
              this.handleAgentLeft();
            }
          } catch (e) {
            console.log('Failed to parse event message:', e);
          }
        } else if (messageData.user_type === 'system') {
          // Handle system messages
          const message: ChatMessage = {
            id: messageData.message_id || ChatUtils.generateMessageId('system'),
            content: messageData.message,
            timestamp: new Date(messageData.timestamp || Date.now()),
            sender: 'bot',
            sessionId: this.currentSession.id
          };
          this.currentSession.messages.push(message);
          
          // Notify UI about new message
          if (this.messageCallback) {
            this.messageCallback(message);
          }
        } else {
          console.log('❌ Message not processed - session:', !!this.currentSession, 'user_type:', messageData.user_type);
        }
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
   * Trigger end chat from customer side
   */
  private async triggerCustomerEndChat(): Promise<void> {
    console.log('🔚 [triggerCustomerEndChat] Customer initiated end chat');
    console.log('📊 [triggerCustomerEndChat] Session details:', {
      sessionId: this.currentSession?.id,
      isCSSession: this.currentSession?.isCSSession,
      csConnectionState: this.csConnectionState,
      privateChannelName: this.currentSession?.privateChannelName,
      csAgentName: this.currentSession?.csAgentName
    });
    
    if (!this.currentSession) {
      console.log('❌ [triggerCustomerEndChat] No current session');
      return;
    }

    try {
      // If it's a CS session, notify the backend to trigger end chat
      if (this.currentSession.isCSSession) {
        const payload = {
          session_id: this.currentSession.id,
          trigger_source: 'customer'
        };
        
        console.log('📤 [triggerCustomerEndChat] Notifying backend about customer end chat');
        console.log('🔗 [triggerCustomerEndChat] Request payload:', payload);
        console.log('🌐 [triggerCustomerEndChat] Making request to /api/chat/trigger-customer-end-chat');
        
        const response = await fetch('/api/chat/trigger-customer-end-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': this.getCsrfToken(),
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        console.log('📡 [triggerCustomerEndChat] Response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          url: response.url,
          type: response.type
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ [triggerCustomerEndChat] Failed to notify backend:', {
            status: response.status,
            statusText: response.statusText,
            errorText: errorText
          });
        } else {
          const responseData = await response.json();
          console.log('✅ [triggerCustomerEndChat] Backend notified successfully:', responseData);
          console.log('📋 [triggerCustomerEndChat] Response data details:', {
            success: responseData.success,
            message: responseData.message,
            data: responseData.data
          });
        }
      } else {
        console.log('ℹ️ [triggerCustomerEndChat] Not a CS session, skipping backend notification');
      }
      
      console.log('🔄 [triggerCustomerEndChat] Calling handleAgentLeft()...');
      // End the session locally
      this.handleAgentLeft();
      
    } catch (error) {
      console.error('❌ [triggerCustomerEndChat] Error:', error);
      console.error('❌ [triggerCustomerEndChat] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace available'
      });
      // Still end the session locally even if backend notification fails
      this.handleAgentLeft();
    }
  }

  /**
   * Handle agent left event - disconnect from CS and return to bot
   */
  private handleAgentLeft(): void {
    console.log('🔌 [handleAgentLeft] Processing agent left event');
    
    if (!this.currentSession?.isCSSession) {
      console.log('❌ [handleAgentLeft] Not in CS session, ignoring');
      return;
    }

    // Unsubscribe from private channel
    if (this.privateChannel) {
      this.pusher?.unsubscribe(this.privateChannel.name);
      this.privateChannel = null;
    }

    // Reset CS-specific state
    this.currentSession.isCSSession = false;
    this.currentSession.csAgentName = undefined;
    this.currentSession.privateChannelName = undefined;
    this.currentSession.isReadOnly = false;
    
    console.log('🔄 [handleAgentLeft] Agent has left - returning to main menu');
    
    // Add system message to inform user that agent has left
    const systemMessage: ChatMessage = {
      id: ChatUtils.generateMessageId('system'),
      content: 'Customer Service mengakhiri obrolan. Silakan pilih menu di bawah ini untuk melanjutkan.',
      sender: 'bot',
      timestamp: new Date(),
      sessionId: this.currentSession.id
    };
    
    this.currentSession.messages.push(systemMessage);
    
    // Add main menu options back
    const menuMessage: ChatMessage = {
      id: ChatUtils.generateMessageId('menu'),
      content: 'Silakan pilih salah satu opsi:\n\n1. Customer Service\n2. Menu\n3. Dine In\n4. Dine Out',
      sender: 'bot',
      timestamp: new Date(),
      sessionId: this.currentSession.id
    };
    
    this.currentSession.messages.push(menuMessage);
    
    // Notify UI about the new messages
    if (this.messageCallback) {
      this.messageCallback(systemMessage);
      this.messageCallback(menuMessage);
    }
    
    // Update state to idle (ready for new interactions)
    this.updateCSState('idle');
    
    // Call close chat callback if set
    if (this.closeChatCallback) {
      this.closeChatCallback();
    }
    
    console.log('✅ [handleAgentLeft] Successfully returned to main menu');
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