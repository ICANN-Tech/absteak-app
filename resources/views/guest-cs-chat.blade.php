<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Service Chat</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .chat-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .chat-header {
            background: #007bff;
            color: white;
            padding: 15px;
            text-align: center;
        }
        .chat-messages {
            height: 400px;
            overflow-y: auto;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        .message {
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 10px;
            max-width: 80%;
        }
        .message.user {
            background: #007bff;
            color: white;
            margin-left: auto;
        }
        .message.agent {
            background: #f1f1f1;
            color: #333;
        }
        .chat-input {
            display: flex;
            padding: 15px;
        }
        .chat-input input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-right: 10px;
        }
        .chat-input button {
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .chat-input button:hover {
            background: #0056b3;
        }
        .loading {
            text-align: center;
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            <h3>Customer Service Chat</h3>
        </div>
        <div class="chat-messages" id="chatMessages">
            <div class="message agent">
                <strong>Agent:</strong> Halo! Selamat datang di layanan customer service kami. Ada yang bisa saya bantu?
            </div>
        </div>
        <div class="chat-input">
            <input type="text" id="messageInput" placeholder="Ketik pesan Anda..." onkeypress="handleKeyPress(event)">
            <button onclick="sendMessage()">Kirim</button>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
    <script>
        class ChatwootWebSocket {
            constructor() {
                this.websocket = null;
                this.isConnected = false;
                this.reconnectAttempts = 0;
                this.maxReconnectAttempts = 5;
                this.reconnectDelay = 1000;
                this.chatwootUrl = 'ws://localhost:3002/cable';
                this.pubsubToken = null;
                this.contactId = null;
                this.conversationId = null;
                
                this.init();
            }
            
            async init() {
                try {
                    // Get or create contact and conversation
                    await this.setupChatwootContact();
                    this.connect();
                } catch (error) {
                    console.error('Failed to initialize chat:', error);
                }
            }
            
            async setupChatwootContact() {
                try {
                    // Create or get existing contact
                    const contactResponse = await fetch('/api/chatwoot/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': '{{ csrf_token() }}'
                        },
                        body: JSON.stringify({
                            name: 'Guest User',
                            email: `guest_${Date.now()}@absteak.com`
                        })
                    });
                    
                    const contactData = await contactResponse.json();
                    this.contactId = contactData.contact_id;
                    this.pubsubToken = contactData.pubsub_token;
                    
                    // Create conversation
                    const conversationResponse = await fetch('/api/chatwoot/conversation', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': '{{ csrf_token() }}'
                        },
                        body: JSON.stringify({
                            contact_id: this.contactId
                        })
                    });
                    
                    const conversationData = await conversationResponse.json();
                    this.conversationId = conversationData.conversation_id;
                    
                } catch (error) {
                    console.error('Failed to setup Chatwoot contact:', error);
                    throw error;
                }
            }
            
            connect() {
                if (this.isConnected || !this.pubsubToken) {
                    return;
                }
                
                try {
                    this.websocket = new WebSocket(`${this.chatwootUrl}?pubsub_token=${this.pubsubToken}`);
                    
                    this.websocket.onopen = () => {
                        console.log('WebSocket connected to Chatwoot');
                        this.isConnected = true;
                        this.reconnectAttempts = 0;
                        
                        // Subscribe to conversation channel
                        this.subscribe();
                        
                        // Update UI
                        this.updateConnectionStatus(true);
                    };
                    
                    this.websocket.onmessage = (event) => {
                        try {
                            const data = JSON.parse(event.data);
                            this.handleMessage(data);
                        } catch (error) {
                            console.error('Failed to parse WebSocket message:', error);
                        }
                    };
                    
                    this.websocket.onclose = () => {
                        console.log('WebSocket disconnected');
                        this.isConnected = false;
                        this.updateConnectionStatus(false);
                        this.attemptReconnect();
                    };
                    
                    this.websocket.onerror = (error) => {
                        console.error('WebSocket error:', error);
                        this.isConnected = false;
                        this.updateConnectionStatus(false);
                        this.showNotification('Connection error occurred', 'error');
                    };
                    
                } catch (error) {
                    console.error('Failed to create WebSocket connection:', error);
                }
            }
            
            subscribe() {
                if (!this.websocket || !this.conversationId) {
                    return;
                }
                
                const subscribeMessage = {
                    command: 'subscribe',
                    identifier: JSON.stringify({
                        channel: 'RoomChannel',
                        conversation_id: this.conversationId
                    })
                };
                
                this.websocket.send(JSON.stringify(subscribeMessage));
            }
            
            handleMessage(data) {
                if (data.type === 'ping') {
                    return;
                }
                
                if (data.message) {
                    const message = data.message;
                    
                    switch (message.event) {
                        case 'message.created':
                            this.displayMessage(message.data);
                            break;
                        case 'conversation.status_changed':
                            this.updateConversationStatus(message.data);
                            break;
                        case 'presence.update':
                            this.updateAgentPresence(message.data);
                            break;
                        default:
                            console.log('Unhandled message event:', message.event);
                    }
                }
            }
            
            displayMessage(messageData) {
                const chatMessages = document.getElementById('chatMessages');
                const isFromAgent = messageData.message_type === 'outgoing';
                
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${isFromAgent ? 'agent' : 'user'}`;
                messageDiv.innerHTML = `
                    <strong>${isFromAgent ? 'Agent' : 'Anda'}:</strong> ${messageData.content}
                `;
                
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            async sendMessage(content) {
                if (!this.conversationId) {
                    console.error('No conversation ID available');
                    return;
                }
                
                try {
                    const response = await fetch('/api/chatwoot/message', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': '{{ csrf_token() }}'
                        },
                        body: JSON.stringify({
                            conversation_id: this.conversationId,
                            content: content,
                            message_type: 'incoming'
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to send message');
                    }
                    
                    // Message will be displayed via WebSocket
                    
                } catch (error) {
                    console.error('Failed to send message:', error);
                    alert('Failed to send message. Please try again.');
                }
            }
            
            updateConnectionStatus(connected) {
                const statusElement = document.getElementById('connectionStatus');
                const statusText = document.getElementById('connectionStatusText');
                
                if (statusElement && statusText) {
                    if (connected) {
                        statusElement.className = 'w-3 h-3 bg-green-500 rounded-full';
                        statusText.textContent = 'Connected';
                        statusText.className = 'text-sm text-green-600';
                    } else {
                        statusElement.className = 'w-3 h-3 bg-red-500 rounded-full animate-pulse';
                        statusText.textContent = 'Disconnected';
                        statusText.className = 'text-sm text-red-600';
                    }
                }
                
                console.log('Connection status:', connected ? 'Connected' : 'Disconnected');
            }
            
            updateConversationStatus(statusData) {
                console.log('Conversation status updated:', statusData);
                
                const statusElement = document.getElementById('conversationStatus');
                if (statusElement && statusData.status) {
                    statusElement.textContent = statusData.status.charAt(0).toUpperCase() + statusData.status.slice(1);
                    statusElement.className = `px-2 py-1 text-xs rounded-full ${
                        statusData.status === 'open' ? 'bg-green-100 text-green-800' :
                        statusData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`;
                }
            }
            
            updateAgentPresence(presenceData) {
                console.log('Agent presence updated:', presenceData);
                
                const agentStatusElement = document.getElementById('agentStatus');
                const agentStatusText = document.getElementById('agentStatusText');
                
                if (agentStatusElement && agentStatusText && presenceData.availability_status) {
                    const isOnline = presenceData.availability_status === 'online';
                    agentStatusElement.className = `w-2 h-2 rounded-full ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`;
                    agentStatusText.textContent = isOnline ? 'Agent Online' : 'Agent Offline';
                    agentStatusText.className = `text-sm ${
                        isOnline ? 'text-green-600' : 'text-gray-500'
                    }`;
                }
            }
            
            attemptReconnect() {
                if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    console.log('Max reconnection attempts reached');
                    return;
                }
                
                this.reconnectAttempts++;
                const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
                
                console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
                
                setTimeout(() => {
                    this.connect();
                }, delay);
            }
            
            disconnect() {
                if (this.websocket) {
                    this.websocket.close();
                    this.websocket = null;
                }
                this.isConnected = false;
            }
        }
        
        // Initialize WebSocket connection
        let chatWebSocket;
        
        // Send message function
        function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Add user message to chat immediately
            addMessageToChat('user', message);
            input.value = '';
            
            // Send via WebSocket
            if (chatWebSocket) {
                chatWebSocket.sendMessage(message);
            }
        }
        
        // Add message to chat UI
        function addMessageToChat(sender, message) {
            const messagesContainer = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}`;
            
            if (sender === 'user') {
                messageDiv.innerHTML = `<strong>Anda:</strong> ${message}`;
            } else {
                messageDiv.innerHTML = `<strong>Agent:</strong> ${message}`;
            }
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        // Handle Enter key press
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
        
        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', function() {
            chatWebSocket = new ChatwootWebSocket();
            
            // Cleanup on page unload
            window.addEventListener('beforeunload', function() {
                if (chatWebSocket) {
                    chatWebSocket.disconnect();
                }
            });
        });
    </script>
</body>
</html>