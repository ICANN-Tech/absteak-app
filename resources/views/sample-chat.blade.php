<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABSteak Real-time Chat</title>
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
    </style>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto max-w-4xl h-screen flex flex-col">
        <!-- Header -->
        <div class="bg-white shadow-sm border-b px-6 py-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">ABSteak Chat</h1>
                    <p class="text-sm text-gray-600">Real-time messaging with Soketi</p>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center space-x-2">
                        <div id="connection-status" class="w-3 h-3 rounded-full bg-red-500"></div>
                        <span id="connection-text" class="text-sm text-gray-600">Disconnected</span>
                    </div>
                    <div class="text-sm text-gray-600">
                        Online: <span id="online-count" class="font-semibold">0</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Info -->
        <div class="bg-white border-b px-6 py-3">
            <div class="flex items-center space-x-4">
                <div class="flex-1">
                    <label for="username" class="block text-sm font-medium text-gray-700">Your Name:</label>
                    <input type="text" id="username" placeholder="Enter your name" 
                           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <div class="flex-1">
                    <label for="room" class="block text-sm font-medium text-gray-700">Room:</label>
                    <input type="text" id="room" value="general" 
                           class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                </div>
                <button id="join-btn" class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Join Chat
                </button>
            </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 bg-white overflow-hidden flex flex-col">
            <div id="messages-container" class="flex-1 overflow-y-auto p-6 space-y-4">
                <div class="text-center text-gray-500 text-sm">
                    Welcome to ABSteak Chat! Enter your name and join the conversation.
                </div>
            </div>
            
            <!-- Typing Indicator -->
            <div id="typing-indicator" class="px-6 py-2 text-sm text-gray-500 typing-indicator" style="display: none;">
                Someone is typing...
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
        class SoketiChat {
            constructor() {
                this.pusher = null;
                this.channel = null;
                this.privateChannel = null;
                this.username = '';
                this.room = '';
                this.isConnected = false;
                this.typingTimer = null;
                this.isTyping = false;
                this.userData = null;
                this.isInPrivateChat = false;
                this.currentAgent = null;
                
                this.initializeElements();
                this.bindEvents();
            }

            initializeElements() {
                this.elements = {
                    username: document.getElementById('username'),
                    room: document.getElementById('room'),
                    joinBtn: document.getElementById('join-btn'),
                    messageInput: document.getElementById('message-input'),
                    sendBtn: document.getElementById('send-btn'),
                    messagesContainer: document.getElementById('messages-container'),
                    connectionStatus: document.getElementById('connection-status'),
                    connectionText: document.getElementById('connection-text'),
                    onlineCount: document.getElementById('online-count'),
                    typingIndicator: document.getElementById('typing-indicator'),
                    errorModal: document.getElementById('error-modal'),
                    errorMessage: document.getElementById('error-message'),
                    closeError: document.getElementById('close-error')
                };
            }

            bindEvents() {
                this.elements.joinBtn.addEventListener('click', () => this.joinChat());
                this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
                this.elements.messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage();
                    } else {
                        this.handleTyping();
                    }
                });
                this.elements.closeError.addEventListener('click', () => this.hideError());
                
                // Auto-focus username input
                this.elements.username.focus();
            }

            async joinChat() {
                const username = this.elements.username.value.trim();
                const room = this.elements.room.value.trim();

                if (!username) {
                    this.showError('Please enter your name');
                    return;
                }

                if (!room) {
                    this.showError('Please enter a room name');
                    return;
                }

                this.username = username;
                this.room = room;

                try {
                    await this.initializeSoketi();
                    this.updateUI(true);
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
                            console.log('Soketi connected successfully');
                            this.isConnected = true;
                            this.updateConnectionStatus(true);
                            // Set initial online count
                            this.updateOnlineCount(1);
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

                        // Subscribe to room channel
                        this.channel = this.pusher.subscribe(`chat.${this.room}`);

                        // Bind to message events
                        this.channel.bind('message', (data) => {
                            this.displayMessage(data);
                        });

                        this.channel.bind('user-joined', (data) => {
                            this.displaySystemMessage(`${data.username} joined the chat`);
                            this.updateOnlineCount(data.online_count || this.getEstimatedOnlineCount());
                        });

                        this.channel.bind('user-left', (data) => {
                            this.displaySystemMessage(`${data.username} left the chat`);
                            this.updateOnlineCount(data.online_count || this.getEstimatedOnlineCount());
                        });

                        this.channel.bind('pusher:subscription_succeeded', (data) => {
                            console.log('Successfully subscribed to channel');
                            // Update online count based on subscription data
                            if (data && data.count) {
                                this.updateOnlineCount(data.count);
                            } else {
                                this.updateOnlineCount(1); // At least current user
                            }
                        });

                        this.channel.bind('typing', (data) => {
                            if (data.username !== this.username) {
                                this.showTypingIndicator(data.username);
                            }
                        });

                        this.channel.bind('stop-typing', (data) => {
                            if (data.username !== this.username) {
                                this.hideTypingIndicator();
                            }
                        });

                        // Handle private chat invitations
                        this.channel.bind('private-chat-invite', (data) => {
                            this.handlePrivateChatInvite(data);
                        });

                        // Send join notification after connection is established
                        setTimeout(() => {
                            if (this.isConnected) {
                                this.sendJoinNotification();
                            }
                        }, 1000);

                    } catch (error) {
                        reject(error);
                    }
                });
            }

            sendMessage() {
                const message = this.elements.messageInput.value.trim();
                if (!message || !this.isConnected) return;

                // Clear input immediately
                this.elements.messageInput.value = '';
                this.stopTyping();

                if (this.isInPrivateChat && this.privateChannel) {
                    // Send private message
                    const messageData = {
                        username: this.username,
                        message: message,
                        timestamp: new Date().toISOString(),
                        user_type: 'customer',
                        channel: this.privateChannel.name,
                        customer_id: this.userData.user_id
                    };

                    fetch('/api/chat/private/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify(messageData)
                    }).catch(error => {
                        console.error('Failed to send private message:', error);
                        this.showError('Failed to send message. Please try again.');
                    });
                } else {
                    // Send public message
                    const messageData = {
                        username: this.username,
                        message: message,
                        timestamp: new Date().toISOString(),
                        room: this.room
                    };

                    fetch('/api/chat/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify(messageData)
                    }).catch(error => {
                        console.error('Failed to send message:', error);
                        // Display message locally if API fails
                        this.displayMessage(messageData);
                        this.showError('Failed to send message. Please try again.');
                    });
                }
            }

            handlePrivateChatInvite(data) {
                // Display invitation message
                this.displaySystemMessage(`${data.agent_name} has started a private chat with you`);
                
                // Subscribe to private channel
                this.privateChannel = this.pusher.subscribe(data.channel_name);
                
                // Bind private chat events
                this.privateChannel.bind('message', (messageData) => {
                    this.displayMessage(messageData);
                });
                
                this.privateChannel.bind('typing', (typingData) => {
                    if (typingData.user_type === 'agent') {
                        this.showTypingIndicator(typingData.agent_name || 'Agent');
                    }
                });
                
                this.privateChannel.bind('stop-typing', (typingData) => {
                    if (typingData.user_type === 'agent') {
                        this.hideTypingIndicator();
                    }
                });
                
                // Update state
                this.isInPrivateChat = true;
                this.currentAgent = data.agent_name;
                
                // Update UI to show private chat mode
                this.updateUIForPrivateChat(true);
            }

            updateUIForPrivateChat(isPrivate) {
                const chatHeader = document.querySelector('.bg-white.shadow-sm');
                if (isPrivate && this.currentAgent) {
                    chatHeader.style.backgroundColor = '#fef3c7'; // Light yellow background
                    const titleElement = chatHeader.querySelector('h1');
                    if (titleElement) {
                        titleElement.textContent = `Private Chat with ${this.currentAgent}`;
                    }
                } else {
                    chatHeader.style.backgroundColor = '';
                    const titleElement = chatHeader.querySelector('h1');
                    if (titleElement) {
                        titleElement.textContent = 'ABSteak Chat';
                    }
                }
            }

            sendJoinNotification() {
                const userData = {
                    username: this.username,
                    room: this.room,
                    user_type: 'customer',
                    joined_at: new Date().toISOString(),
                    user_id: this.generateUserId()
                };

                fetch('/api/chat/join', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify(userData)
                }).catch(error => {
                    console.error('Failed to send join notification:', error);
                });

                // Store user data for later use
                this.userData = userData;
            }

            handleTyping() {
                if (!this.isTyping) {
                    this.isTyping = true;
                    fetch('/api/chat/typing', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({
                            username: this.username,
                            room: this.room,
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
                if (this.isTyping) {
                    this.isTyping = false;
                    fetch('/api/chat/typing', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({
                            username: this.username,
                            room: this.room,
                            typing: false
                        })
                    }).catch(error => console.error('Failed to stop typing indicator:', error));
                }
            }

            displayMessage(data) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message-bubble';
                
                const isOwnMessage = data.username === this.username;
                const timestamp = new Date(data.timestamp).toLocaleTimeString();

                messageDiv.innerHTML = `
                    <div class="flex ${isOwnMessage ? 'justify-end' : 'justify-start'}">
                        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwnMessage 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-800'
                        }">
                            ${!isOwnMessage ? `<div class="text-xs font-semibold mb-1">${data.username}</div>` : ''}
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

            showTypingIndicator(username) {
                this.elements.typingIndicator.textContent = `${username} is typing...`;
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

            updateOnlineCount(count) {
                this.elements.onlineCount.textContent = count || 0;
            }

            updateUI(joined) {
                if (joined) {
                    this.elements.username.disabled = true;
                    this.elements.room.disabled = true;
                    this.elements.joinBtn.disabled = true;
                    this.elements.messageInput.disabled = false;
                    this.elements.sendBtn.disabled = false;
                    this.elements.messageInput.focus();
                } else {
                    this.elements.username.disabled = false;
                    this.elements.room.disabled = false;
                    this.elements.joinBtn.disabled = false;
                    this.elements.messageInput.disabled = true;
                    this.elements.sendBtn.disabled = true;
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

            getEstimatedOnlineCount() {
                // Fallback method to estimate online users
                // In a real implementation, this could track local connections
                return Math.max(1, parseInt(this.elements.onlineCount.textContent) || 1);
            }

            generateUserId() {
                // Generate a simple user ID based on username and timestamp
                return btoa(this.username + '_' + Date.now()).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
            }

            sendLeaveNotification() {
                if (this.userData) {
                    fetch('/api/chat/leave', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({
                            username: this.username,
                            room: this.room,
                            user_type: 'customer',
                            user_id: this.userData.user_id
                        })
                    }).catch(error => {
                        console.error('Failed to send leave notification:', error);
                    });
                }
            }
        }

        // Initialize chat when page loads
        document.addEventListener('DOMContentLoaded', () => {
            const chat = new SoketiChat();
            
            // Send leave notification when user closes the page
            window.addEventListener('beforeunload', () => {
                chat.sendLeaveNotification();
            });
        });
    </script>
</body>
</html>