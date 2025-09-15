<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABSteak Customer Service Chat</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
    <style>
        .message-bubble {
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .typing-indicator {
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        .customer-item {
            transition: all 0.2s ease;
        }
        .customer-item:hover {
            background-color: #f3f4f6;
            transform: translateX(4px);
        }
        .active-chat {
            background-color: #dbeafe;
            border-left: 4px solid #3b82f6;
        }
    </style>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="flex h-screen">
        <!-- Customer List Sidebar -->
        <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
            <!-- Sidebar Header -->
            <div class="bg-blue-600 text-white p-4">
                <h2 class="text-lg font-semibold">Customer Service</h2>
                <p class="text-blue-100 text-sm">Active Customers</p>
            </div>

            <!-- CS Agent Info -->
            <div class="p-4 border-b border-gray-200">
                <div class="flex items-center space-x-3">
                    <div class="flex-1">
                        <label for="agent-name" class="block text-sm font-medium text-gray-700">Agent Name:</label>
                        <input type="text" id="agent-name" placeholder="Enter your name" 
                               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                    <button id="connect-btn" class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Connect
                    </button>
                </div>
                <div class="mt-2 flex items-center space-x-2">
                    <div id="cs-connection-status" class="w-3 h-3 rounded-full bg-red-500"></div>
                    <span id="cs-connection-text" class="text-sm text-gray-600">Disconnected</span>
                </div>
            </div>

            <!-- Customer List -->
            <div class="flex-1 overflow-y-auto">
                <div class="p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-sm font-medium text-gray-700">Online Customers</h3>
                        <span id="customer-count" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">0</span>
                    </div>
                    <div id="customer-list" class="space-y-2">
                        <div class="text-center text-gray-500 text-sm py-8">
                            No customers online
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 flex flex-col">
            <!-- Chat Header -->
            <div class="bg-white shadow-sm border-b px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 id="chat-title" class="text-xl font-bold text-gray-800">Select a Customer</h1>
                        <p id="chat-subtitle" class="text-sm text-gray-600">Choose a customer from the list to start chatting</p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button id="end-chat-btn" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hidden">
                            End Chat
                        </button>
                    </div>
                </div>
            </div>

            <!-- Messages Area -->
            <div class="flex-1 bg-white overflow-hidden flex flex-col">
                <div id="messages-container" class="flex-1 overflow-y-auto p-6 space-y-4">
                    <div class="text-center text-gray-500 text-sm">
                        Welcome to ABSteak Customer Service! Connect as an agent and select a customer to start chatting.
                    </div>
                </div>
                
                <!-- Typing Indicator -->
                <div id="typing-indicator" class="px-6 py-2 text-sm text-gray-500 typing-indicator" style="display: none;">
                    Customer is typing...
                </div>
            </div>

            <!-- Message Input -->
            <div class="bg-white border-t px-6 py-4">
                <div class="flex space-x-4">
                    <input type="text" id="message-input" placeholder="Type your message..." 
                           class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           disabled>
                    <button id="send-btn" 
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled>
                        Send
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Error Modal -->
    <div id="error-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-medium text-gray-900">Connection Error</h3>
                    <p id="error-message" class="mt-1 text-sm text-gray-600"></p>
                </div>
            </div>
            <div class="mt-4 flex justify-end">
                <button id="close-error" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                    Close
                </button>
            </div>
        </div>
    </div>

    <script>
        class CustomerServiceChat {
            constructor() {
                this.pusher = null;
                this.presenceChannel = null;
                this.currentChatChannel = null;
                this.agentName = '';
                this.isConnected = false;
                this.activeCustomers = new Map();
                this.currentCustomer = null;
                this.typingTimer = null;
                this.isTyping = false;
                
                this.initializeElements();
                this.bindEvents();
            }

            initializeElements() {
                this.elements = {
                    agentName: document.getElementById('agent-name'),
                    connectBtn: document.getElementById('connect-btn'),
                    messageInput: document.getElementById('message-input'),
                    sendBtn: document.getElementById('send-btn'),
                    messagesContainer: document.getElementById('messages-container'),
                    connectionStatus: document.getElementById('cs-connection-status'),
                    connectionText: document.getElementById('cs-connection-text'),
                    customerList: document.getElementById('customer-list'),
                    customerCount: document.getElementById('customer-count'),
                    chatTitle: document.getElementById('chat-title'),
                    chatSubtitle: document.getElementById('chat-subtitle'),
                    endChatBtn: document.getElementById('end-chat-btn'),
                    typingIndicator: document.getElementById('typing-indicator'),
                    errorModal: document.getElementById('error-modal'),
                    errorMessage: document.getElementById('error-message'),
                    closeError: document.getElementById('close-error')
                };
            }

            bindEvents() {
                this.elements.connectBtn.addEventListener('click', () => this.connectAsAgent());
                this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
                this.elements.endChatBtn.addEventListener('click', () => this.endCurrentChat());
                this.elements.messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage();
                    } else {
                        this.handleTyping();
                    }
                });
                this.elements.closeError.addEventListener('click', () => this.hideError());
                
                // Auto-focus agent name input
                this.elements.agentName.focus();
            }

            async connectAsAgent() {
                const agentName = this.elements.agentName.value.trim();

                if (!agentName) {
                    this.showError('Please enter your agent name');
                    return;
                }

                this.agentName = agentName;

                try {
                    await this.initializeSoketi();
                    this.updateConnectionStatus(true);
                    this.elements.agentName.disabled = true;
                    this.elements.connectBtn.disabled = true;
                } catch (error) {
                    this.showError('Failed to connect to chat server: ' + error.message);
                }
            }

            async initializeSoketi() {
                return new Promise((resolve, reject) => {
                    try {
                        // Initialize Pusher with Soketi configuration
                        this.pusher = new Pusher('app-key', {
                            wsHost: 'localhost',
                            wsPort: 6001,
                            wssPort: 6001,
                            forceTLS: false,
                            enabledTransports: ['ws', 'wss'],
                            disableStats: true,
                            cluster: 'mt1',
                            authEndpoint: '/broadcasting/auth'
                        });

                        // Connection event handlers
                        this.pusher.connection.bind('connected', () => {
                            console.log('CS Soketi connected successfully');
                            this.isConnected = true;
                            resolve();
                        });

                        this.pusher.connection.bind('disconnected', () => {
                            this.isConnected = false;
                            this.updateConnectionStatus(false);
                        });

                        this.pusher.connection.bind('error', (error) => {
                            this.isConnected = false;
                            this.updateConnectionStatus(false);
                            reject(new Error('WebSocket connection failed'));
                        });

                        // Subscribe to general chat to monitor customer activity
                        const generalChannel = this.pusher.subscribe('chat.general');
                        generalChannel.bind('user-joined', (data) => {
                            if (data.user_type === 'customer') {
                                this.addCustomerToList(data);
                            }
                        });

                        generalChannel.bind('user-left', (data) => {
                            if (data.user_type === 'customer') {
                                this.removeCustomerFromList(data.user_id);
                            }
                        });

                        // Handle force end chat trigger from customer
                        generalChannel.bind('force-end-chat', (triggerData) => {
                            console.log('🔚 [CS DEBUG] Force end chat trigger received from customer:', triggerData);
                            console.log('🔍 [CS DEBUG] Current CS state:', {
                                currentCustomer: this.currentCustomer,
                                isConnected: this.isConnected,
                                activeCustomers: this.activeCustomers.length
                            });
                            
                            if (triggerData.trigger_source === 'customer' && 
                                this.currentCustomer && 
                                this.currentCustomer.user_id === triggerData.customer_id) {
                                
                                console.log('🔄 [CS DEBUG] Customer triggered force end - auto ending chat');
                                console.log('📝 [CS DEBUG] Trigger data details:', {
                                    source: triggerData.trigger_source,
                                    message: triggerData.message,
                                    sessionId: triggerData.session_id,
                                    customerId: triggerData.customer_id,
                                    currentCustomerId: this.currentCustomer.user_id
                                });
                                
                                // Display system message
                                this.displaySystemMessage(triggerData.message || 'Customer has ended the chat session');
                                
                                console.log('⏰ [CS DEBUG] Starting auto-end countdown (1 second)');
                                // Auto end the chat session after a short delay
                                setTimeout(() => {
                                    console.log('🏁 [CS DEBUG] Executing auto-end chat');
                                    this.endCurrentChat();
                                }, 1000);
                            } else {
                                console.log('❌ [CS DEBUG] Trigger condition not met:', {
                                    triggerSource: triggerData.trigger_source,
                                    hasCurrentCustomer: !!this.currentCustomer,
                                    customerIdMatch: this.currentCustomer?.user_id === triggerData.customer_id,
                                    expectedCustomerId: triggerData.customer_id,
                                    actualCustomerId: this.currentCustomer?.user_id
                                });
                            }
                        });

                    } catch (error) {
                        reject(error);
                    }
                });
            }

            addCustomerToList(customerData) {
                if (!customerData.username || !customerData.user_id) return;
                
                this.activeCustomers.set(customerData.user_id, customerData);
                this.updateCustomerList();
            }

            removeCustomerFromList(userId) {
                this.activeCustomers.delete(userId);
                this.updateCustomerList();
                
                // If current chat customer left, end the chat completely
                if (this.currentCustomer && this.currentCustomer.user_id === userId) {
                    // Display system message before ending chat
                    this.displaySystemMessage(`${this.currentCustomer.username} has left the chat. Chat session ended.`);
                    
                    // End the chat completely - this will also remove customer from active list
                    setTimeout(() => {
                        this.endCurrentChat();
                    }, 1000); // Small delay to show the message
                }
            }

            updateCustomerList() {
                const customerListElement = this.elements.customerList;
                const customerCount = this.activeCustomers.size;
                
                this.elements.customerCount.textContent = customerCount;
                
                if (customerCount === 0) {
                    customerListElement.innerHTML = `
                        <div class="text-center text-gray-500 text-sm py-8">
                            No customers online
                        </div>
                    `;
                    return;
                }
                
                customerListElement.innerHTML = '';
                
                this.activeCustomers.forEach((customer, userId) => {
                    const customerElement = document.createElement('div');
                    customerElement.className = `customer-item p-3 rounded-lg border cursor-pointer ${
                        this.currentCustomer && this.currentCustomer.user_id === userId ? 'active-chat' : 'border-gray-200'
                    }`;
                    
                    customerElement.innerHTML = `
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="font-medium text-gray-900">${this.escapeHtml(customer.username)}</div>
                                <div class="text-xs text-gray-500">Room: ${this.escapeHtml(customer.room || 'general')}</div>
                                <div class="text-xs text-gray-400">Joined: ${new Date(customer.joined_at).toLocaleTimeString()}</div>
                            </div>
                            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                    `;
                    
                    customerElement.addEventListener('click', () => this.startChatWithCustomer(customer));
                    customerListElement.appendChild(customerElement);
                });
            }

            async startChatWithCustomer(customer) {
                if (this.currentCustomer && this.currentCustomer.user_id === customer.user_id) {
                    return; // Already chatting with this customer
                }
                
                // End current chat if any
                if (this.currentChatChannel) {
                    this.pusher.unsubscribe(this.currentChatChannel.name);
                }
                
                this.currentCustomer = customer;
                
                // Create private channel name (using public channel to avoid auth issues)
                const channelName = `chat.private.${customer.user_id}.${this.generateAgentId()}`;
                
                // Subscribe to private chat channel
                this.currentChatChannel = this.pusher.subscribe(channelName);
                
                this.currentChatChannel.bind('message', (data) => {
                    this.displayMessage(data);
                });
                
                this.currentChatChannel.bind('typing', (data) => {
                    if (data.user_type === 'customer') {
                        this.showTypingIndicator();
                    }
                });
                
                this.currentChatChannel.bind('stop-typing', (data) => {
                    if (data.user_type === 'customer') {
                        this.hideTypingIndicator();
                    }
                });
                
                // Listen for force-end-chat from customer on private channel
                this.currentChatChannel.bind('force-end-chat', (triggerData) => {
                    console.log('🔚 [CS DEBUG] Force end chat trigger received on private channel:', triggerData);
                    console.log('📊 [CS DEBUG] Current CS state:', {
                        currentCustomer: this.currentCustomer?.user_id,
                        channelName: this.currentChatChannel?.name,
                        agentName: this.agentName,
                        triggerSource: triggerData.trigger_source,
                        triggerCustomerId: triggerData.customer_id
                    });
                    
                    if (triggerData.trigger_source === 'customer') {
                        console.log('🔄 [CS DEBUG] Customer triggered force end on private channel - auto ending chat');
                        console.log('✅ [CS DEBUG] Trigger source matches customer, proceeding with end chat');
                        
                        // Display system message
                        this.displaySystemMessage(triggerData.message || 'Customer has ended the chat session');
                        
                        console.log('⏰ [CS DEBUG] Starting auto-end countdown (1 second)');
                        setTimeout(() => {
                            console.log('🏁 [CS DEBUG] Executing auto-end chat from private channel');
                            this.endCurrentChat();
                        }, 1000);
                    } else {
                        console.log('❌ [CS DEBUG] Trigger source mismatch, ignoring:', {
                            expected: 'customer',
                            received: triggerData.trigger_source
                        });
                    }
                });
                
                // Update UI
                this.elements.chatTitle.textContent = `Chat with ${customer.username}`;
                this.elements.chatSubtitle.textContent = `Private conversation - Room: ${customer.room || 'general'}`;
                this.elements.messageInput.disabled = false;
                this.elements.sendBtn.disabled = false;
                this.elements.messageInput.placeholder = 'Type your message...'; // Reset placeholder
                this.elements.endChatBtn.classList.remove('hidden');
                this.elements.messageInput.focus();
                
                // Clear messages
                this.elements.messagesContainer.innerHTML = '';
                this.displaySystemMessage(`Started private chat with ${customer.username}`);
                
                // Update customer list to show active chat
                this.updateCustomerList();
                
                // Notify customer about private chat initiation
                this.notifyCustomerOfPrivateChat(customer, channelName);
            }

            notifyCustomerOfPrivateChat(customer, channelName) {
                fetch('/api/chat/private/invite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify({
                        customer_id: customer.user_id,
                        customer_username: customer.username,
                        agent_name: this.agentName,
                        channel_name: channelName,
                        room: customer.room
                    })
                }).catch(error => {
                    console.error('Failed to notify customer of private chat:', error);
                });
            }

            endCurrentChat() {
                console.log('🔚 [CS DEBUG] Starting endCurrentChat process');
                console.log('📝 [CS DEBUG] Current state:', {
                    hasChannel: !!this.currentChatChannel,
                    hasCustomer: !!this.currentCustomer,
                    channelName: this.currentChatChannel?.name,
                    customerId: this.currentCustomer?.user_id,
                    agentName: this.agentName
                });
                
                if (this.currentChatChannel && this.currentCustomer) {
                    // Store references before cleanup to prevent race conditions
                    const customerRef = this.currentCustomer;
                    const channelRef = this.currentChatChannel;
                    const agentRef = this.agentName;
                    
                    console.log('💾 [CS DEBUG] Stored references:', {
                        customerId: customerRef.user_id,
                        channelName: channelRef.name,
                        agentName: agentRef
                    });
                    
                    console.log('📤 [CS DEBUG] Sending agent-left notification...');
                    // Send agent-left notification to customer before disconnecting
                    fetch('/api/chat/private/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({
                            channel: channelRef.name,
                            message: 'Agent has ended the chat session',
                            user_type: 'agent',
                            username: 'System',
                            customer_id: customerRef.user_id
                        })
                    }).then(response => {
                        console.log('✅ [CS DEBUG] Agent-left notification sent:', response.status);
                    }).catch(error => {
                        console.error('❌ [CS DEBUG] Failed to send end chat notification:', error);
                    });

                    console.log('📤 [CS DEBUG] Sending end chat message...');
                    // Send simple "end chat" message to trigger customer side cleanup
                    fetch('/api/chat/private/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({
                            channel: channelRef.name,
                            message: 'end chat',
                            user_type: 'agent',
                            username: 'System',
                            customer_id: customerRef.user_id
                        })
                    }).then(response => {
                        console.log('✅ [CS DEBUG] End chat message sent:', response.status);
                        console.log('⏰ [CS DEBUG] Waiting 500ms before unsubscribing...');
                        // Wait a moment for the event to be processed before unsubscribing
                        setTimeout(() => {
                            console.log('🔌 [CS DEBUG] Unsubscribing from channel and cleaning up');
                            this.pusher.unsubscribe(channelRef.name);
                            this.currentChatChannel = null;
                        }, 500);
                    }).catch(error => {
                        console.error('❌ [CS DEBUG] Failed to send agent-left event or trigger:', error);
                        console.log('🔌 [CS DEBUG] Still unsubscribing due to error...');
                        // Still unsubscribe even if notification fails
                        this.pusher.unsubscribe(channelRef.name);
                        this.currentChatChannel = null;
                    });
                } else {
                    console.log('⚠️ [CS DEBUG] No current channel or customer found');
                    if (this.currentChatChannel) {
                        console.log('🔌 [CS DEBUG] Unsubscribing from channel without customer');
                        this.pusher.unsubscribe(this.currentChatChannel.name);
                        this.currentChatChannel = null;
                    }
                }
                
                console.log('🧹 [CS DEBUG] Cleaning up customer state...');
                // Remove customer from active list to prevent reconnection
                if (this.currentCustomer) {
                    console.log('🗑️ [CS DEBUG] Removing customer from active list:', this.currentCustomer.user_id);
                    this.activeCustomers.delete(this.currentCustomer.user_id);
                }
                // Also remove using stored reference if available
                if (typeof customerRef !== 'undefined' && customerRef) {
                    console.log('🗑️ [CS DEBUG] Also removing customer using stored reference:', customerRef.user_id);
                    this.activeCustomers.delete(customerRef.user_id);
                }
                
                this.currentCustomer = null;
                
                console.log('🎨 [CS DEBUG] Updating UI to default state...');
                // Update UI
                this.elements.chatTitle.textContent = 'Select a Customer';
                this.elements.chatSubtitle.textContent = 'Choose a customer from the list to start chatting';
                this.elements.messageInput.disabled = true;
                this.elements.sendBtn.disabled = true;
                this.elements.endChatBtn.classList.add('hidden');
                
                // Clear messages
                this.elements.messagesContainer.innerHTML = `
                    <div class="text-center text-gray-500 text-sm">
                        Select a customer from the list to start chatting.
                    </div>
                `;
                
                console.log('📋 [CS DEBUG] Updating customer list...');
                // Update customer list
                this.updateCustomerList();
                console.log('✅ [CS DEBUG] endCurrentChat process completed');
            }

            sendMessage() {
                const message = this.elements.messageInput.value.trim();
                if (!message || !this.currentCustomer || !this.currentChatChannel) return;
                
                // Check if customer is still active
                if (!this.activeCustomers.has(this.currentCustomer.user_id)) {
                    this.showError('Cannot send message: Customer has left the chat');
                    return;
                }

                const messageData = {
                    username: this.agentName,
                    message: message,
                    timestamp: new Date().toISOString(),
                    user_type: 'agent',
                    channel: this.currentChatChannel.name,
                    customer_id: this.currentCustomer.user_id
                };

                // Clear input immediately
                this.elements.messageInput.value = '';
                this.stopTyping();

                // Send message via HTTP API
                fetch('/api/chat/private/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify(messageData)
                }).catch(error => {
                    console.error('Failed to send message:', error);
                    this.displayMessage(messageData);
                    this.showError('Failed to send message. Please try again.');
                });
            }

            handleTyping() {
                if (!this.isTyping && this.currentCustomer) {
                    this.isTyping = true;
                    fetch('/api/chat/private/typing', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({
                            username: this.agentName,
                            channel: this.currentChatChannel.name,
                            user_type: 'agent',
                            typing: true
                        })
                    }).catch(error => console.error('Failed to send typing indicator:', error));
                }

                clearTimeout(this.typingTimer);
                this.typingTimer = setTimeout(() => {
                    this.stopTyping();
                }, 2000);
            }

            stopTyping() {
                if (this.isTyping && this.currentCustomer) {
                    this.isTyping = false;
                    fetch('/api/chat/private/typing', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({
                            username: this.agentName,
                            channel: this.currentChatChannel.name,
                            user_type: 'agent',
                            typing: false
                        })
                    }).catch(error => console.error('Failed to stop typing indicator:', error));
                }
            }

            displayMessage(data) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message-bubble';
                
                const isOwnMessage = data.user_type === 'agent' && data.username === this.agentName;
                const timestamp = new Date(data.timestamp).toLocaleTimeString();
                const senderLabel = data.user_type === 'agent' ? 'Agent' : 'Customer';

                messageDiv.innerHTML = `
                    <div class="flex ${isOwnMessage ? 'justify-end' : 'justify-start'}">
                        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwnMessage 
                                ? 'bg-blue-600 text-white' 
                                : data.user_type === 'agent'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                        }">
                            ${!isOwnMessage ? `<div class="text-xs font-semibold mb-1">${senderLabel}: ${this.escapeHtml(data.username)}</div>` : ''}
                            <div class="text-sm">${this.escapeHtml(data.message)}</div>
                            <div class="text-xs mt-1 opacity-75">${timestamp}</div>
                        </div>
                    </div>
                `;

                this.elements.messagesContainer.appendChild(messageDiv);
                this.scrollToBottom();
            }

            displaySystemMessage(message) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'text-center text-gray-500 text-sm message-bubble';
                messageDiv.textContent = message;
                
                this.elements.messagesContainer.appendChild(messageDiv);
                this.scrollToBottom();
            }

            showTypingIndicator() {
                this.elements.typingIndicator.style.display = 'block';
            }

            hideTypingIndicator() {
                this.elements.typingIndicator.style.display = 'none';
            }

            updateConnectionStatus(connected) {
                if (connected) {
                    this.elements.connectionStatus.className = 'w-3 h-3 rounded-full bg-green-500';
                    this.elements.connectionText.textContent = 'Connected';
                } else {
                    this.elements.connectionStatus.className = 'w-3 h-3 rounded-full bg-red-500';
                    this.elements.connectionText.textContent = 'Disconnected';
                }
            }

            showError(message) {
                this.elements.errorMessage.textContent = message;
                this.elements.errorModal.classList.remove('hidden');
                this.elements.errorModal.classList.add('flex');
            }

            hideError() {
                this.elements.errorModal.classList.add('hidden');
                this.elements.errorModal.classList.remove('flex');
            }

            scrollToBottom() {
                this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
            }

            escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            generateAgentId() {
                // Generate consistent agent ID based on agent name only (no timestamp)
                return btoa(this.agentName + '_agent').replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
            }
        }

        // Initialize customer service chat when page loads
        document.addEventListener('DOMContentLoaded', () => {
            new CustomerServiceChat();
        });
    </script>
</body>
</html>