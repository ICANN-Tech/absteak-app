<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABSteak Customer Support Chat</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/strophe@1.6.2/dist/strophe.umd.min.js"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">ABSteak Customer Support</h1>
            
            <!-- Chat Interface -->
            <div id="chat-container" class="bg-white rounded-lg shadow-lg overflow-hidden" style="display: none;">
                <!-- Chat Header -->
                <div class="bg-blue-600 text-white p-4">
                    <div class="flex justify-between items-center">
                        <h2 class="text-lg font-semibold">Live Chat Support</h2>
                        <div class="flex items-center space-x-2">
                            <span id="connection-status" class="text-sm">Connecting...</span>
                            <div id="status-indicator" class="w-3 h-3 rounded-full bg-yellow-400"></div>
                        </div>
                    </div>
                    <p id="assigned-cs" class="text-sm mt-1 opacity-90">Waiting for customer service...</p>
                </div>

                <!-- Chat Messages -->
                <div id="chat-messages" class="h-96 overflow-y-auto p-4 space-y-4">
                    <div class="text-center text-gray-500 text-sm">
                        <p>Welcome to ABSteak customer support!</p>
                        <p>A customer service representative will be with you shortly.</p>
                    </div>
                </div>

                <!-- Chat Input -->
                <div class="border-t p-4">
                    <div class="flex space-x-2">
                        <input 
                            type="text" 
                            id="message-input" 
                            placeholder="Type your message..." 
                            class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled
                        >
                        <button 
                            id="send-button" 
                            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled
                        >
                            Send
                        </button>
                    </div>
                </div>

                <!-- End Chat Button -->
                <div class="border-t p-4 bg-gray-50">
                    <button 
                        id="end-chat-button" 
                        class="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        End Chat
                    </button>
                </div>
            </div>

            <!-- Start Chat Form -->
            <div id="start-chat-form" class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-semibold mb-4 text-gray-800">Start a Chat Session</h2>
                <p class="text-gray-600 mb-6">Get instant help from our customer service team. No registration required!</p>
                
                <div class="space-y-4">
                    <div>
                        <label for="guest-name" class="block text-sm font-medium text-gray-700 mb-2">Your Name (Optional)</label>
                        <input 
                            type="text" 
                            id="guest-name" 
                            placeholder="Enter your name" 
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                    </div>
                    
                    <button 
                        id="start-chat-button" 
                        class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    >
                        Start Chat
                    </button>
                </div>
            </div>

            <!-- Loading Indicator -->
            <div id="loading" class="text-center py-8" style="display: none;">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p class="mt-2 text-gray-600">Initializing chat...</p>
            </div>
        </div>
    </div>

    <script>
        class ChatClient {
            constructor() {
                this.connection = null;
                this.chatData = null;
                this.isConnected = false;
                this.setupEventListeners();
            }

            setupEventListeners() {
                document.getElementById('start-chat-button').addEventListener('click', () => this.startChat());
                document.getElementById('send-button').addEventListener('click', () => this.sendMessage());
                document.getElementById('end-chat-button').addEventListener('click', () => this.endChat());
                document.getElementById('message-input').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.sendMessage();
                });
            }

            async startChat() {
                const guestName = document.getElementById('guest-name').value.trim();
                
                this.showLoading();
                
                try {
                    const response = await fetch('/api/chat/guest/initialize', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({ guest_name: guestName })
                    });

                    const result = await response.json();
                    
                    if (result.success) {
                        this.chatData = result.data;
                        this.connectToXMPP();
                        this.showChatInterface();
                    } else {
                        alert('Failed to initialize chat: ' + result.message);
                        this.hideLoading();
                    }
                } catch (error) {
                    console.error('Error starting chat:', error);
                    alert('Failed to start chat. Please try again.');
                    this.hideLoading();
                }
            }

            connectToXMPP() {
                const jid = this.chatData.guest_id + '@' + this.chatData.domain;
                const password = this.chatData.password;
                
                this.connection = new Strophe.Connection(this.chatData.bosh_url);
                
                this.connection.connect(jid, password, (status) => {
                    if (status === Strophe.Status.CONNECTED) {
                        this.onConnected();
                    } else if (status === Strophe.Status.DISCONNECTED) {
                        this.onDisconnected();
                    } else if (status === Strophe.Status.ERROR) {
                        this.onError();
                    }
                });
            }

            onConnected() {
                console.log('Connected to XMPP server');
                this.isConnected = true;
                this.updateConnectionStatus('Connected', 'bg-green-400');
                
                // Enable chat input
                document.getElementById('message-input').disabled = false;
                document.getElementById('send-button').disabled = false;
                
                // Add message handler
                this.connection.addHandler((msg) => this.onMessage(msg), null, 'message', null, null, null);
                
                // Send presence
                this.connection.send($pres());
                
                // Update assigned CS info
                if (this.chatData.assigned_cs) {
                    document.getElementById('assigned-cs').textContent = 
                        `Connected with ${this.chatData.assigned_cs.display_name}`;
                }
            }

            onDisconnected() {
                console.log('Disconnected from XMPP server');
                this.isConnected = false;
                this.updateConnectionStatus('Disconnected', 'bg-red-400');
                
                // Disable chat input
                document.getElementById('message-input').disabled = true;
                document.getElementById('send-button').disabled = true;
            }

            onError() {
                console.error('XMPP connection error');
                this.updateConnectionStatus('Error', 'bg-red-400');
                alert('Connection error. Please refresh and try again.');
            }

            onMessage(msg) {
                const from = msg.getAttribute('from');
                const body = msg.getElementsByTagName('body')[0];
                
                if (body) {
                    const message = Strophe.getText(body);
                    const fromUser = from.split('@')[0];
                    this.displayMessage(message, fromUser, false);
                }
                
                return true;
            }

            sendMessage() {
                const input = document.getElementById('message-input');
                const message = input.value.trim();
                
                if (!message || !this.isConnected) return;
                
                if (this.chatData.assigned_cs) {
                    const to = this.chatData.assigned_cs.username + '@' + this.chatData.domain;
                    const msg = $msg({
                        to: to,
                        type: 'chat'
                    }).c('body').t(message);
                    
                    this.connection.send(msg);
                    this.displayMessage(message, 'You', true);
                    input.value = '';
                } else {
                    alert('No customer service assigned yet. Please wait.');
                }
            }

            displayMessage(message, from, isOwn) {
                const messagesContainer = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                
                messageDiv.className = `flex ${isOwn ? 'justify-end' : 'justify-start'}`;
                
                messageDiv.innerHTML = `
                    <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwn ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                    }">
                        <p class="text-sm font-semibold mb-1">${from}</p>
                        <p>${message}</p>
                        <p class="text-xs mt-1 opacity-70">${new Date().toLocaleTimeString()}</p>
                    </div>
                `;
                
                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            async endChat() {
                if (confirm('Are you sure you want to end this chat session?')) {
                    console.log('🔚 [CUSTOMER DEBUG] Starting endChat process');
                    console.log('📝 [CUSTOMER DEBUG] Chat data:', {
                        userId: this.chatData.user_id,
                        guestId: this.chatData.guest_id,
                        sessionId: this.chatData.guest_id
                    });
                    
                    try {
                        console.log('📤 [CUSTOMER DEBUG] Sending trigger to CS...');
                        // Send trigger to CS first
                        const triggerResponse = await fetch('/api/trigger-end', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                            },
                            body: JSON.stringify({
                                customer_id: this.chatData.user_id || this.chatData.guest_id,
                                session_id: this.chatData.guest_id,
                                trigger_source: 'customer'
                            })
                        });
                        
                        console.log('✅ [CUSTOMER DEBUG] Trigger sent successfully:', triggerResponse.status);
                        
                        console.log('📤 [CUSTOMER DEBUG] Ending session normally...');
                        // Then end the session normally
                        const endResponse = await fetch('/api/chat/end-session', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                            },
                            body: JSON.stringify({
                                session_id: this.chatData.guest_id,
                                type: 'guest',
                                customer_id: this.chatData.user_id || this.chatData.guest_id
                            })
                        });
                        
                        console.log('✅ [CUSTOMER DEBUG] Session ended successfully:', endResponse.status);
                        
                        if (this.connection) {
                            console.log('🔌 [CUSTOMER DEBUG] Disconnecting XMPP connection');
                            this.connection.disconnect();
                        }
                        
                        console.log('🏁 [CUSTOMER DEBUG] Showing start form');
                        this.showStartForm();
                    } catch (error) {
                        console.error('❌ [CUSTOMER DEBUG] Error ending chat:', error);
                    }
                }
            }

            updateConnectionStatus(status, colorClass) {
                document.getElementById('connection-status').textContent = status;
                const indicator = document.getElementById('status-indicator');
                indicator.className = `w-3 h-3 rounded-full ${colorClass}`;
            }

            showLoading() {
                document.getElementById('start-chat-form').style.display = 'none';
                document.getElementById('loading').style.display = 'block';
            }

            hideLoading() {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('start-chat-form').style.display = 'block';
            }

            showChatInterface() {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('start-chat-form').style.display = 'none';
                document.getElementById('chat-container').style.display = 'block';
            }

            showStartForm() {
                document.getElementById('chat-container').style.display = 'none';
                document.getElementById('start-chat-form').style.display = 'block';
                
                // Reset form
                document.getElementById('guest-name').value = '';
                document.getElementById('chat-messages').innerHTML = `
                    <div class="text-center text-gray-500 text-sm">
                        <p>Welcome to ABSteak customer support!</p>
                        <p>A customer service representative will be with you shortly.</p>
                    </div>
                `;
            }
        }

        // Initialize chat client when page loads
        document.addEventListener('DOMContentLoaded', () => {
            new ChatClient();
        });
    </script>
</body>
</html>