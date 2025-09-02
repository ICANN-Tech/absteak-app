<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Service Chats - ABSteak</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body class="bg-gray-100 min-h-screen">
    <!-- Chat List View -->
    <div id="chatListView" class="container mx-auto px-4 py-8">
        <div class="max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800">Customer Service Chats</h1>
                <button id="refreshChats" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200">
                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Refresh
                </button>
            </div>
            
            <!-- Status Display -->
            <div id="status" class="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h3 class="font-semibold text-blue-800">Loading chats...</h3>
            </div>

            <!-- Chat List -->
            <div class="bg-white rounded-lg shadow-lg">
                <div class="p-6 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-800">Active CS Transfers</h2>
                    <p class="text-gray-600 text-sm mt-1">Click on any chat to view the conversation</p>
                </div>
                <div id="chatList" class="divide-y divide-gray-200">
                    <!-- Chat items will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Chat Interface View -->
    <div id="chatInterfaceView" class="hidden">
        <div class="bg-white shadow-sm border-b border-gray-200">
            <div class="container mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <button id="backToList" class="text-gray-600 hover:text-gray-800 transition duration-200">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        <div>
                            <h1 class="text-xl font-semibold text-gray-800" id="chatTitle">Customer Chat</h1>
                            <p class="text-sm text-gray-600" id="chatSubtitle">Loading...</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full" id="chatStatus">Active</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="container mx-auto px-4 py-6">
            <div class="max-w-4xl mx-auto">
                <!-- Chat Messages -->
                <div class="bg-white rounded-lg shadow-lg mb-6">
                    <div id="chatMessages" class="h-96 overflow-y-auto p-6 space-y-4">
                        <!-- Messages will be loaded here -->
                    </div>
                </div>
                
                <!-- Chat Input -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <div class="flex space-x-4">
                        <input type="text" id="messageInput" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type your message...">
                        <button id="sendMessage" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-200">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentChatId = null;
        let currentSessionId = null;
        let chatPollingInterval = null;

        // Utility functions
        function updateStatus(message, type = 'info') {
            const statusDiv = document.getElementById('status');
            const colors = {
                'info': 'bg-blue-50 border-blue-200 text-blue-800',
                'success': 'bg-green-50 border-green-200 text-green-800',
                'error': 'bg-red-50 border-red-200 text-red-800',
                'warning': 'bg-yellow-50 border-yellow-200 text-yellow-800'
            };
            statusDiv.className = `mb-6 p-4 rounded-lg border ${colors[type] || colors.info}`;
            statusDiv.innerHTML = `<h3 class="font-semibold">${message}</h3>`;
        }

        // API call functions
        async function makeApiCall(url, method = 'GET', data = null) {
            try {
                const options = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                };
                
                if (data) {
                    options.body = JSON.stringify(data);
                }

                const response = await fetch(url, options);
                const result = await response.json();
                return { success: response.ok, data: result, status: response.status };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        // Load chat list
        async function loadChatList() {
            updateStatus('Loading chats...', 'info');
            
            try {
                 const result = await makeApiCall('/api/chat/cs/tickets');
                 
                 if (!result.success) {
                     updateStatus('Failed to load chats', 'error');
                     return;
                 }
                 
                 const chats = result.data.data || [];

                const chatListDiv = document.getElementById('chatList');
                
                if (chats.length === 0) {
                    chatListDiv.innerHTML = '<div class="p-6 text-center text-gray-500">No active CS transfers found</div>';
                    updateStatus('No active chats found', 'info');
                    return;
                }

                let chatListHtml = '';
                chats.forEach(chat => {
                    const statusColor = chat.status === 'open' || chat.status === 'in_progress' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
                    chatListHtml += `
                        <div class="p-6 hover:bg-gray-50 cursor-pointer transition duration-200 chat-item" data-chat-id="${chat.id}" data-session-id="${chat.session_id}">
                            <div class="flex items-center justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0">
                                            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                ${chat.customer_name.charAt(0)}
                                            </div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center space-x-2">
                                                <h3 class="text-lg font-medium text-gray-900 truncate">${chat.customer_name}</h3>
                                                <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColor}">${chat.status}</span>
                                            </div>
                                            <p class="text-sm text-gray-600 truncate">${chat.customer_email || 'No email'}</p>
                                            <p class="text-sm text-gray-800 mt-1 truncate">${chat.last_message}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex-shrink-0 text-right">
                                    <p class="text-sm text-gray-500">${chat.last_message_time}</p>
                                    <svg class="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    `;
                });

                chatListDiv.innerHTML = chatListHtml;
                updateStatus(`Found ${chats.length} active CS transfers`, 'success');

                // Add click handlers to chat items
                document.querySelectorAll('.chat-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const chatId = item.dataset.chatId;
                        const sessionId = item.dataset.sessionId;
                        openChat(chatId, sessionId);
                    });
                });
            } catch (error) {
                updateStatus('Error loading chats: ' + error.message, 'error');
                console.error('Failed to load chats:', error);
            }
        }

        // Open individual chat
        function openChat(chatId, sessionId) {
            currentChatId = chatId;
            currentSessionId = sessionId;
            
            // Hide chat list view and show chat interface
            document.getElementById('chatListView').classList.add('hidden');
            document.getElementById('chatInterfaceView').classList.remove('hidden');
            
            // Update chat title and subtitle
            document.getElementById('chatTitle').textContent = `Chat ${chatId}`;
            document.getElementById('chatSubtitle').textContent = `Session: ${sessionId}`;
            
            // Load chat messages
            loadChatMessages(chatId, sessionId);
            
            // Start polling for new messages
            startMessagePolling();
        }

        // Load chat messages
        async function loadChatMessages(chatId, sessionId) {
            try {
                const result = await makeApiCall(`/api/chat/cs/tickets/${chatId}/messages`);
                
                if (!result.success) {
                    console.error('Failed to load messages:', result.error);
                    return;
                }
                
                const messages = result.data.data || [];
                displayMessages(messages);
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        }

        function displayMessages(messages) {
            const chatMessagesDiv = document.getElementById('chatMessages');
            let messagesHtml = '';

            messages.forEach(msg => {
                let messageClass = '';
                let senderLabel = '';
                
                if (msg.sender === 'customer') {
                    messageClass = 'bg-blue-500 text-white ml-auto';
                    senderLabel = 'Customer';
                } else if (msg.sender === 'bot') {
                    messageClass = 'bg-gray-200 text-gray-800';
                    senderLabel = 'Bot';
                } else if (msg.sender === 'system') {
                    messageClass = 'bg-yellow-100 text-yellow-800 mx-auto text-center';
                    senderLabel = 'System';
                } else {
                    messageClass = 'bg-green-500 text-white';
                    senderLabel = 'Agent';
                }

                const timestamp = new Date(msg.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                messagesHtml += `
                    <div class="flex ${msg.sender === 'customer' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}">
                        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${messageClass}">
                            <div class="text-xs opacity-75 mb-1">${senderLabel}</div>
                            <div>${msg.message}</div>
                            <div class="text-xs opacity-75 mt-1">${timestamp}</div>
                        </div>
                    </div>
                `;
            });

            chatMessagesDiv.innerHTML = messagesHtml;
            chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
        }

        // Send message
        async function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const message = messageInput.value.trim();
            
            if (!message || !currentChatId) return;
            
            try {
                 const result = await makeApiCall(`/api/chat/cs/tickets/${currentChatId}/reply`, 'POST', {
                     message: message,
                     agent_id: 'agent_001' // This should be dynamic based on logged in agent
                 });
                
                if (result.success) {
                    messageInput.value = '';
                    // Reload messages to show the sent message
                    await loadChatMessages(currentChatId, currentSessionId);
                } else {
                    console.error('Failed to send message:', result.error);
                    alert('Failed to send message. Please try again.');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert('Error sending message. Please try again.');
            }
        }

        // Start polling for new messages
        function startMessagePolling() {
            if (chatPollingInterval) {
                clearInterval(chatPollingInterval);
            }
            
            chatPollingInterval = setInterval(async () => {
                if (currentChatId && currentSessionId) {
                    await loadChatMessages(currentChatId, currentSessionId);
                }
            }, 3000);
        }

        // Stop polling
        function stopMessagePolling() {
            if (chatPollingInterval) {
                clearInterval(chatPollingInterval);
                chatPollingInterval = null;
            }
        }

        // Go back to chat list
        function goBackToList() {
            stopMessagePolling();
            currentChatId = null;
            currentSessionId = null;
            
            document.getElementById('chatInterfaceView').classList.add('hidden');
            document.getElementById('chatListView').classList.remove('hidden');
        }

        // Event handlers
        document.getElementById('refreshChats').addEventListener('click', loadChatList);
        document.getElementById('backToList').addEventListener('click', goBackToList);
        document.getElementById('sendMessage').addEventListener('click', sendMessage);
        
        // Handle Enter key in message input
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            loadChatList();
        });
    </script>
</body>
</html>