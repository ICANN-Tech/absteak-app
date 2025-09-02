<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Service Chat Dashboard - ABSteak</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        .chat-container {
            height: calc(100vh - 120px);
        }
        .ticket-list {
            height: calc(100vh - 200px);
            overflow-y: auto;
        }
        .message-bubble {
            max-width: 80%;
            word-wrap: break-word;
        }
        .typing-indicator {
            display: none;
        }
        .typing-indicator.show {
            display: flex;
        }
        .dot {
            height: 6px;
            width: 6px;
            border-radius: 50%;
            background-color: #9CA3AF;
            animation: typing 1.4s infinite ease-in-out;
            margin: 0 1px;
        }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
        .status-online { background-color: #10B981; }
        .status-busy { background-color: #F59E0B; }
        .status-offline { background-color: #EF4444; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <div class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                <span class="text-white font-bold text-lg">AB</span>
                            </div>
                            <div>
                                <h1 class="text-xl font-bold text-gray-900">ABSteak Customer Service</h1>
                                <p class="text-sm text-gray-500">Agent Dashboard</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                            <span class="text-sm text-gray-600">Status:</span>
                            <div class="flex items-center space-x-2">
                                <div id="agent-status-indicator" class="w-3 h-3 rounded-full status-online"></div>
                                <select id="agent-status" class="text-sm border border-gray-300 rounded px-2 py-1">
                                    <option value="available">Available</option>
                                    <option value="busy">Busy</option>
                                    <option value="offline">Offline</option>
                                </select>
                            </div>
                        </div>
                        <div class="text-sm text-gray-600">
                            <span id="agent-name">Agent Name</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex">
            <!-- Sidebar - Ticket List -->
            <div class="w-1/3 bg-white border-r border-gray-200">
                <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-semibold text-gray-900">Active Tickets</h2>
                        <span id="ticket-count" class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">0</span>
                    </div>
                    <div class="mt-2">
                        <button id="refresh-tickets" class="text-sm text-blue-600 hover:text-blue-800">
                            Refresh
                        </button>
                    </div>
                </div>
                <div class="ticket-list p-4 space-y-3">
                    <!-- Tickets will be loaded here -->
                    <div id="no-tickets" class="text-center text-gray-500 py-8">
                        <div class="text-4xl mb-2">💬</div>
                        <p>No active tickets</p>
                        <p class="text-sm">New tickets will appear here</p>
                    </div>
                </div>
            </div>

            <!-- Chat Area -->
            <div class="flex-1 flex flex-col">
                <!-- Chat Header -->
                <div id="chat-header" class="bg-white border-b border-gray-200 p-4 hidden">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <span id="customer-avatar" class="text-white font-semibold">?</span>
                            </div>
                            <div>
                                <h3 id="customer-name" class="font-semibold text-gray-900">Customer Name</h3>
                                <p id="customer-info" class="text-sm text-gray-500">Ticket #12345 • Started 5 min ago</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button id="resolve-ticket" class="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded">
                                Resolve
                            </button>
                            <button id="escalate-ticket" class="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-3 py-1 rounded">
                                Escalate
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Chat Messages -->
                <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
                    <!-- Welcome message when no chat selected -->
                    <div id="welcome-message" class="flex items-center justify-center h-full">
                        <div class="text-center text-gray-500">
                            <div class="text-6xl mb-4">💬</div>
                            <h3 class="text-xl font-semibold mb-2">Welcome to Customer Service Dashboard</h3>
                            <p>Select a ticket from the sidebar to start chatting with customers</p>
                        </div>
                    </div>
                </div>

                <!-- Typing Indicator -->
                <div id="typing-indicator" class="typing-indicator px-4 pb-2">
                    <div class="flex items-center space-x-2">
                        <div class="flex space-x-1">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <span class="text-sm text-gray-500">Customer is typing...</span>
                    </div>
                </div>

                <!-- Chat Input -->
                <div id="chat-input" class="bg-white border-t border-gray-200 p-4 hidden">
                    <div class="flex space-x-3">
                        <input type="text" id="message-input" placeholder="Type your message..." 
                               class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
                        <button id="send-message" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200" disabled>
                            Send
                        </button>
                    </div>
                    <div class="mt-2 flex justify-between items-center text-xs text-gray-500">
                        <div class="flex space-x-4">
                            <button id="quick-reply-1" class="text-blue-600 hover:text-blue-800">Thank you for contacting us</button>
                            <button id="quick-reply-2" class="text-blue-600 hover:text-blue-800">I'll help you with that</button>
                            <button id="quick-reply-3" class="text-blue-600 hover:text-blue-800">Is there anything else?</button>
                        </div>
                        <span id="session-info"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        class CSChatDashboard {
            constructor() {
                this.currentTicketId = null;
                this.currentSessionId = null;
                this.agentId = null;
                this.tickets = [];
                this.pollingInterval = null;
                this.init();
            }

            init() {
                this.bindEvents();
                this.loadAgentInfo();
                this.loadTickets();
                this.initializeWebSocket();
            }

            initializeWebSocket() {
                this.websocket = null;
                this.isConnected = false;
                this.reconnectAttempts = 0;
                this.maxReconnectAttempts = 5;
                this.reconnectDelay = 1000;
                this.chatwootUrl = 'ws://localhost:3002/cable';
                this.agentPubsubToken = null;
                
                this.setupAgentWebSocket();
            }
            
            async setupAgentWebSocket() {
                try {
                    // Get agent pubsub token from Chatwoot
                    const response = await this.apiCall('/api/chatwoot/agent/token', 'GET');
                    if (response.success) {
                        this.agentPubsubToken = response.pubsub_token;
                        this.connectWebSocket();
                    }
                } catch (error) {
                    console.error('Failed to get agent token:', error);
                    // Fallback to polling if WebSocket fails
                    this.startPolling();
                }
            }
            
            connectWebSocket() {
                if (this.isConnected || !this.agentPubsubToken) {
                    return;
                }
                
                try {
                    this.websocket = new WebSocket(`${this.chatwootUrl}?pubsub_token=${this.agentPubsubToken}`);
                    
                    this.websocket.onopen = () => {
                        console.log('Agent WebSocket connected to Chatwoot');
                        this.isConnected = true;
                        this.reconnectAttempts = 0;
                        
                        // Subscribe to agent channels
                        this.subscribeToChannels();
                        
                        // Update connection status
                        this.updateConnectionStatus(true);
                    };
                    
                    this.websocket.onmessage = (event) => {
                        try {
                            const data = JSON.parse(event.data);
                            this.handleWebSocketMessage(data);
                        } catch (error) {
                            console.error('Failed to parse WebSocket message:', error);
                        }
                    };
                    
                    this.websocket.onclose = () => {
                        console.log('Agent WebSocket disconnected');
                        this.isConnected = false;
                        this.updateConnectionStatus(false);
                        this.attemptReconnect();
                    };
                    
                    this.websocket.onerror = (error) => {
                        console.error('Agent WebSocket error:', error);
                        this.isConnected = false;
                        this.updateConnectionStatus(false);
                    };
                    
                } catch (error) {
                    console.error('Failed to create agent WebSocket connection:', error);
                    // Fallback to polling
                    this.startPolling();
                }
            }
            
            subscribeToChannels() {
                if (!this.websocket) return;
                
                // Subscribe to agent notifications channel
                const agentSubscribe = {
                    command: 'subscribe',
                    identifier: JSON.stringify({
                        channel: 'AgentNotificationChannel',
                        account_id: 1
                    })
                };
                
                this.websocket.send(JSON.stringify(agentSubscribe));
                
                // Subscribe to conversation updates
                const conversationSubscribe = {
                    command: 'subscribe',
                    identifier: JSON.stringify({
                        channel: 'ConversationChannel',
                        account_id: 1
                    })
                };
                
                this.websocket.send(JSON.stringify(conversationSubscribe));
            }
            
            handleWebSocketMessage(data) {
                if (data.type === 'ping') {
                    return;
                }
                
                if (data.message) {
                    const message = data.message;
                    
                    switch (message.event) {
                        case 'conversation.created':
                            this.handleNewConversation(message.data);
                            break;
                        case 'message.created':
                            this.handleNewMessage(message.data);
                            break;
                        case 'conversation.status_changed':
                            this.handleConversationStatusChange(message.data);
                            break;
                        case 'assignee.changed':
                            this.handleAssigneeChange(message.data);
                            break;
                        default:
                            console.log('Unhandled WebSocket event:', message.event);
                    }
                }
            }
            
            handleNewConversation(conversationData) {
                console.log('New conversation created:', conversationData);
                this.loadTickets(); // Refresh ticket list
                this.showNotification('New conversation started', 'info');
            }
            
            handleNewMessage(messageData) {
                console.log('New message received:', messageData);
                
                // If this message is for the currently open conversation
                if (this.currentSessionId && messageData.conversation_id == this.currentSessionId) {
                    this.displayMessage(
                        messageData.message_type === 'incoming' ? 'customer' : 'agent',
                        messageData.content,
                        new Date(messageData.created_at)
                    );
                }
                
                // Update ticket list to show new message indicator
                this.loadTickets();
            }
            
            handleConversationStatusChange(statusData) {
                console.log('Conversation status changed:', statusData);
                this.loadTickets(); // Refresh to show status changes
            }
            
            handleAssigneeChange(assigneeData) {
                console.log('Assignee changed:', assigneeData);
                this.loadTickets(); // Refresh to show assignment changes
            }
            
            updateConnectionStatus(connected) {
                const statusElement = document.querySelector('.connection-status');
                if (statusElement) {
                    statusElement.textContent = connected ? 'Connected' : 'Disconnected';
                    statusElement.className = `connection-status ${connected ? 'text-green-600' : 'text-red-600'}`;
                }
            }
            
            attemptReconnect() {
                if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    console.log('Max reconnection attempts reached, falling back to polling');
                    this.startPolling();
                    return;
                }
                
                this.reconnectAttempts++;
                const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
                
                console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
                
                setTimeout(() => {
                    this.connectWebSocket();
                }, delay);
            }
            
            startPolling() {
                // Fallback polling method
                this.pollingInterval = setInterval(() => {
                    this.loadTickets();
                    if (this.currentSessionId) {
                        this.loadChatHistory(this.currentSessionId);
                    }
                }, 10000); // Longer interval when using as fallback
            }
            
            stopPolling() {
                if (this.pollingInterval) {
                    clearInterval(this.pollingInterval);
                    this.pollingInterval = null;
                }
            }
            
            disconnectWebSocket() {
                if (this.websocket) {
                    this.websocket.close();
                    this.websocket = null;
                }
                this.isConnected = false;
            }

            showNotification(message, type = 'info') {
                // Create notification element
                const notification = document.createElement('div');
                notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
                    type === 'info' ? 'bg-blue-500 text-white' : 
                    type === 'success' ? 'bg-green-500 text-white' : 
                    type === 'warning' ? 'bg-yellow-500 text-white' : 
                    'bg-red-500 text-white'
                }`;
                notification.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <span>${message}</span>
                        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                            ×
                        </button>
                    </div>
                `;
                
                document.body.appendChild(notification);
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 5000);
            }

            bindEvents() {
                // Agent status change
                document.getElementById('agent-status').addEventListener('change', (e) => {
                    this.updateAgentStatus(e.target.value);
                });

                // Refresh tickets
                document.getElementById('refresh-tickets').addEventListener('click', () => {
                    this.loadTickets();
                });

                // Send message
                document.getElementById('send-message').addEventListener('click', () => {
                    this.sendMessage();
                });

                // Enter key to send message
                document.getElementById('message-input').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage();
                    }
                });

                // Quick replies
                document.getElementById('quick-reply-1').addEventListener('click', () => {
                    this.sendQuickReply('Thank you for contacting ABSteak customer service. How can I assist you today?');
                });
                document.getElementById('quick-reply-2').addEventListener('click', () => {
                    this.sendQuickReply('I\'ll be happy to help you with that. Let me look into this for you.');
                });
                document.getElementById('quick-reply-3').addEventListener('click', () => {
                    this.sendQuickReply('Is there anything else I can help you with today?');
                });

                // Resolve ticket
                document.getElementById('resolve-ticket').addEventListener('click', () => {
                    this.resolveTicket();
                });

                // Escalate ticket
                document.getElementById('escalate-ticket').addEventListener('click', () => {
                    this.escalateTicket();
                });
            }

            async loadAgentInfo() {
                try {
                    // In a real implementation, this would fetch agent info from API
                    document.getElementById('agent-name').textContent = 'CS Agent';
                    this.agentId = 'agent_' + Math.random().toString(36).substr(2, 9);
                } catch (error) {
                    console.error('Failed to load agent info:', error);
                }
            }

            async loadTickets() {
                try {
                    const response = await this.apiCall('/api/chatwoot/conversations?status=open', 'GET');
                    
                    if (response.success) {
                        this.tickets = response.conversations || [];
                        this.renderTickets();
                        console.log('Loaded real tickets:', this.tickets.length);
                    } else {
                        console.error('API returned error:', response.message);
                        this.tickets = [];
                        this.renderTickets();
                    }
                } catch (error) {
                    console.error('Failed to load tickets:', error);
                    // Fallback to old API if Chatwoot fails
                    try {
                        const fallbackResponse = await this.apiCall('/api/chat/active-tickets', 'GET');
                        if (fallbackResponse.success) {
                            this.tickets = fallbackResponse.data || [];
                            this.renderTickets();
                        } else {
                            this.tickets = [];
                            this.renderTickets();
                        }
                    } catch (fallbackError) {
                        console.error('Fallback API also failed:', fallbackError);
                        this.tickets = [];
                        this.renderTickets();
                    }
                }
            }



            renderTickets() {
                const ticketList = document.querySelector('.ticket-list');
                const noTickets = document.getElementById('no-tickets');
                const ticketCount = document.getElementById('ticket-count');

                if (this.tickets.length === 0) {
                    noTickets.style.display = 'block';
                    ticketCount.textContent = '0';
                    return;
                }

                noTickets.style.display = 'none';
                ticketCount.textContent = this.tickets.length;

                const ticketsHtml = this.tickets.map(ticket => {
                    const timeAgo = this.getTimeAgo(new Date(ticket.created_at));
                    const isActive = ticket.id === this.currentTicketId;
                    
                    return `
                        <div class="ticket-item p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${
                            isActive ? 'bg-blue-50 border-blue-300' : ''
                        }" data-ticket-id="${ticket.id}" data-session-id="${ticket.session_id}">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center space-x-2">
                                        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span class="text-white text-sm font-semibold">${ticket.customer_name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900 text-sm">${ticket.customer_name}</h4>
                                            <p class="text-xs text-gray-500">${ticket.subject}</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-600 mt-2 line-clamp-2">${ticket.last_message}</p>
                                    <p class="text-xs text-gray-400 mt-1">${timeAgo}</p>
                                </div>
                                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                        </div>
                    `;
                }).join('');

                ticketList.innerHTML = ticketsHtml;

                // Add click handlers
                document.querySelectorAll('.ticket-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const ticketId = item.dataset.ticketId;
                        const sessionId = item.dataset.sessionId;
                        this.selectTicket(ticketId, sessionId);
                    });
                });
            }

            selectTicket(ticketId, sessionId) {
                this.currentTicketId = ticketId;
                this.currentSessionId = sessionId;
                
                const ticket = this.tickets.find(t => t.id === ticketId);
                if (!ticket) return;

                // Update UI
                this.showChatInterface(ticket);
                this.loadChatHistory(sessionId);
                // Real-time updates handled by polling
                this.renderTickets(); // Re-render to show active state
            }

            showChatInterface(ticket) {
                // Show chat elements
                document.getElementById('welcome-message').style.display = 'none';
                document.getElementById('chat-header').classList.remove('hidden');
                document.getElementById('chat-input').classList.remove('hidden');

                // Update customer info
                document.getElementById('customer-avatar').textContent = ticket.customer_name.charAt(0);
                document.getElementById('customer-name').textContent = ticket.customer_name;
                document.getElementById('customer-info').textContent = `Ticket #${ticket.id} • ${this.getTimeAgo(new Date(ticket.created_at))}`;
                document.getElementById('session-info').textContent = `Session: ${ticket.session_id.substring(0, 8)}...`;

                // Enable input
                document.getElementById('message-input').disabled = false;
                document.getElementById('send-message').disabled = false;
            }

            async loadChatHistory(conversationId) {
                const messagesContainer = document.getElementById('chat-messages');
                
                try {
                    const response = await this.apiCall(`/api/chatwoot/conversations/${conversationId}/messages`, 'GET');
                    
                    if (response.success && response.messages) {
                        messagesContainer.innerHTML = '';
                        response.messages.forEach(message => {
                            this.displayMessage(
                                message.message_type === 'incoming' ? 'customer' : 'agent',
                                message.content,
                                new Date(message.created_at)
                            );
                        });
                        console.log('Loaded chat history:', response.messages.length, 'messages');
                    } else {
                        console.log('No chat history available for this conversation');
                        messagesContainer.innerHTML = '<div class="text-center text-gray-500 py-4">No messages yet</div>';
                    }
                } catch (error) {
                    console.error('Failed to load chat history:', error);
                    // Fallback to old API
                    try {
                        const fallbackResponse = await this.apiCall(`/api/chat/ticket-messages/${this.currentTicketId}`, 'GET');
                        if (fallbackResponse.success && fallbackResponse.data) {
                            messagesContainer.innerHTML = '';
                            fallbackResponse.data.forEach(msg => {
                                this.displayMessage(msg.sender, msg.message, new Date(msg.timestamp));
                            });
                            console.log('Loaded chat history via fallback:', fallbackResponse.data.length, 'messages');
                        } else {
                            messagesContainer.innerHTML = '<div class="text-center text-gray-500 py-4">No messages yet</div>';
                        }
                    } catch (fallbackError) {
                        console.error('Fallback chat history API also failed:', fallbackError);
                        messagesContainer.innerHTML = '<div class="text-center text-red-500 py-4">Failed to load chat history</div>';
                    }
                }
            }

            async sendMessage() {
                const input = document.getElementById('message-input');
                const message = input.value.trim();
                
                if (!message || !this.currentSessionId) return;

                // Display message immediately
                this.displayMessage('agent', message);
                input.value = '';

                try {
                    const response = await this.apiCall('/api/chatwoot/message', 'POST', {
                        conversation_id: this.currentSessionId,
                        content: message,
                        message_type: 'outgoing'
                    });

                    if (!response.success) {
                        // Fallback to old API
                        try {
                            const fallbackResponse = await this.apiCall('/api/chat/send-cs-reply', 'POST', {
                                ticket_id: this.currentTicketId,
                                session_id: this.currentSessionId,
                                message: message
                            });
                            
                            if (!fallbackResponse.success) {
                                this.displayMessage('system', 'Failed to send message. Please try again.');
                            }
                        } catch (fallbackError) {
                            console.error('Fallback send message API also failed:', fallbackError);
                            this.displayMessage('system', 'Error sending message.');
                        }
                    }
                } catch (error) {
                    console.error('Failed to send message:', error);
                    // Fallback to old API
                    try {
                        const fallbackResponse = await this.apiCall('/api/chat/send-cs-reply', 'POST', {
                            ticket_id: this.currentTicketId,
                            session_id: this.currentSessionId,
                            message: message
                        });
                        
                        if (!fallbackResponse.success) {
                            this.displayMessage('system', 'Failed to send message. Please try again.');
                        }
                    } catch (fallbackError) {
                        console.error('Fallback send message API also failed:', fallbackError);
                        this.displayMessage('system', 'Error sending message.');
                    }
                }
            }

            sendQuickReply(message) {
                document.getElementById('message-input').value = message;
                this.sendMessage();
            }

            displayMessage(sender, message, timestamp = new Date()) {
                const messagesContainer = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                
                const isAgent = sender === 'agent';
                const isSystem = sender === 'system';
                
                messageDiv.className = `flex ${isAgent ? 'justify-end' : 'justify-start'}`;
                
                if (isSystem) {
                    messageDiv.innerHTML = `
                        <div class="text-center w-full">
                            <span class="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">${message}</span>
                        </div>
                    `;
                } else {
                    messageDiv.innerHTML = `
                        <div class="message-bubble ${isAgent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'} rounded-lg px-4 py-2">
                            <p class="text-sm">${message}</p>
                            <p class="text-xs ${isAgent ? 'text-blue-100' : 'text-gray-500'} mt-1">
                                ${timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                        </div>
                    `;
                }
                
                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            async resolveTicket() {
                if (!this.currentTicketId) return;
                
                if (confirm('Are you sure you want to resolve this ticket?')) {
                    try {
                    const response = await this.apiCall(`/api/chat/resolve-ticket`, 'POST', {
                        ticket_id: this.currentTicketId
                    });
                    
                    if (response.success) {
                        this.displayMessage('system', 'Ticket has been resolved.');
                        this.loadTickets();
                        // Clear current chat
                        this.currentTicketId = null;
                        this.currentSessionId = null;
                        document.getElementById('welcome-message').style.display = 'flex';
                        document.getElementById('chat-header').classList.add('hidden');
                        document.getElementById('chat-input').classList.add('hidden');
                    }
                } catch (error) {
                    console.error('Failed to resolve ticket:', error);
                }
                }
            }

            async escalateTicket() {
                if (!this.currentTicketId) return;
                
                const reason = prompt('Please provide a reason for escalation:');
                if (!reason) return;
                
                try {
                    const response = await this.apiCall(`/api/chat/escalate-ticket`, 'POST', {
                        ticket_id: this.currentTicketId,
                        reason: reason
                    });
                    
                    if (response.success) {
                        this.displayMessage('system', 'Ticket has been escalated to supervisor.');
                    }
                } catch (error) {
                    console.error('Failed to escalate ticket:', error);
                }
            }

            updateAgentStatus(status) {
                const indicator = document.getElementById('agent-status-indicator');
                indicator.className = `w-3 h-3 rounded-full status-${status}`;
                
                // Update status via API
                this.apiCall('/api/chat/update-agent-status', 'POST', { status: status });
            }

            // Polling methods removed - WebSocket handles real-time messaging
            // Tickets are refreshed manually via refresh button

            async apiCall(url, method = 'GET', data = null) {
                const options = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                };

                if (data) {
                    options.body = JSON.stringify(data);
                }

                const response = await fetch(url, options);
                return await response.json();
            }

            getTimeAgo(date) {
                const now = new Date();
                const diffInSeconds = Math.floor((now - date) / 1000);
                
                if (diffInSeconds < 60) return 'Just now';
                if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
                if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
                return `${Math.floor(diffInSeconds / 86400)}d ago`;
            }
        }

        // Initialize the dashboard
        document.addEventListener('DOMContentLoaded', () => {
            new CSChatDashboard();
        });
    </script>
</body>
</html>