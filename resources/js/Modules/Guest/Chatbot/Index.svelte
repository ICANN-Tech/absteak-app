<script lang="ts">
	import { onMount } from 'svelte';
	import { CHATBOT_CONFIG, POSITION_CLASSES, DIALOG_POSITION_CLASSES, type ChatbotPosition } from './Const/Chatbot.const';
	import { chatbotService } from './Services/Chatbot.service';
	import { chatUtils, ChatUtils, type MessageType } from './Utils/Chat.util';
	import ChatButton from './Parts/Button.svelte';
	import ChatDialog from './Parts/Dialog.svelte';

	// Component props
	export let open = false;
	export let position: ChatbotPosition = CHATBOT_CONFIG.DEFAULT_POSITION;
	export let showMenuButtons = true;
	export let customMenuItems: ("CS" | "Menu" | "Dine In" | "Dine Out")[] = [...CHATBOT_CONFIG.DEFAULT_MENU_ITEMS];
	export let initialMessage = CHATBOT_CONFIG.DEFAULT_INITIAL_MESSAGE;
	export let placeholder = CHATBOT_CONFIG.DEFAULT_PLACEHOLDER;
	export let disabled = false;

	// State variables
	let input = '';
	let messages: MessageType[] = [];
	let activeMenu = 'CS';
	let loading = false;
	let error: string | null = null;
	let csConnectionState = 'idle'; // 'idle', 'connecting', 'waiting', 'connected', 'disconnected'
	let csAgentName = '';

	// Initialize chat with welcome message
	onMount(() => {
		// Async initialization
		(async () => {
			try {
				await chatbotService.startNewSession();
				
				// Set up CS state change callback
		chatbotService.setCSStateChangeCallback((state: string, agentName?: string) => {
			console.log('🎯 UI State Update:', state, agentName);
			console.log('🔍 Loading state before CS update:', loading);
			csConnectionState = state;
			console.log('🔍 CS Connection State updated to:', csConnectionState);
					
					if (agentName) {
						csAgentName = agentName;
						
						// Add system message when agent joins
						if (state === 'connected') {
							const joinMessage: MessageType = {
								from: 'bot',
								message: 'CS BERGABUNG',
								timestamp: new Date(),
								id: `system_join_${Date.now()}`,
								isFromCS: true
							};
							messages = [...messages, joinMessage];
						}
					} else if (state === 'disconnected' && csAgentName) {
						// Add system message when agent leaves
						const leaveMessage: MessageType = {
							from: 'bot',
							message: 'CS KELUAR',
							timestamp: new Date(),
							id: `system_leave_${Date.now()}`,
							isFromCS: true
						};
						messages = [...messages, leaveMessage];
						csAgentName = '';
					}
					
					// Add connection status messages
					if (state === 'connecting') {
						const connectingMessage: MessageType = {
							from: 'bot',
							message: 'Connecting to customer service...',
							timestamp: new Date(),
							id: `system_connecting_${Date.now()}`
						};
						messages = [...messages, connectingMessage];
					} else if (state === 'waiting') {
						const waitingMessage: MessageType = {
							from: 'bot',
							message: 'Waiting for customer service agent to join...',
							timestamp: new Date(),
							id: `system_waiting_${Date.now()}`
						};
						messages = [...messages, waitingMessage];
					}
				});
				
				// Set up message callback for real-time CS messages
				chatbotService.setMessageCallback((chatMessage) => {
					const messageType: MessageType = {
						from: chatMessage.sender,
						message: chatMessage.content,
						timestamp: chatMessage.timestamp,
						id: chatMessage.id,
						isFromCS: true // Mark as CS message for different styling
					};
					messages = [...messages, messageType];
				});
				
				messages = [{ from: 'bot', message: initialMessage, timestamp: new Date() }];
				
				const isConnected = await chatbotService.testConnection();
				if (!isConnected) {
					error = CHATBOT_CONFIG.ERROR_MESSAGES.CONNECTION_FAILED;
				}
			} catch (err) {
				chatUtils.errors.logError('initialization', err);
				error = CHATBOT_CONFIG.ERROR_MESSAGES.INITIALIZATION_FAILED;
			}
		})();

		// Add event listeners
		document.addEventListener('keydown', (e) => chatUtils.events.handleEscape(e, closeChat));
		document.addEventListener('click', (e) => 
			chatUtils.events.handleClickOutside(e, ['.chat-dialog', '.chat-button-container'], closeChat)
		);

		// Cleanup function
		return () => {
			document.removeEventListener('keydown', (e) => chatUtils.events.handleEscape(e, closeChat));
			document.removeEventListener('click', (e) => 
				chatUtils.events.handleClickOutside(e, ['.chat-dialog', '.chat-button-container'], closeChat)
			);
			chatbotService.endCurrentSession();
		};
	});

	// Toggle chat visibility
	function toggleChat(): void {
		if (disabled) return;
		open = !open;
	}

	// Close chat
	function closeChat(): void {
		if (open) {
			open = false;
		}
	}

	// Handle menu button selection
	async function selectMenu(menu: string): Promise<void> {
		if (loading || disabled) return;
		
		if (menu === 'CS') {
			if (csConnectionState === 'idle' || csConnectionState === 'disconnected') {
				// Start connecting to CS
				activeMenu = menu;
				messages = [];
				
				try {
					// Connect to CS through chatbot service - status will be updated via callback
					await chatbotService.connectToCS();
					
				} catch (err) {
					chatUtils.errors.logError('CS connection', err);
					
					const errorMessage: MessageType = {
						from: 'bot',
						message: 'Failed to connect to customer service. Please try again.',
						timestamp: new Date(),
						id: `error_${Date.now()}`
					};
					messages = [...messages, errorMessage];
				}
			} else if (csConnectionState === 'connected') {
				// Disconnect from CS
				try {
					await chatbotService.disconnectFromCS();
					
					// Switch back to regular chatbot
					activeMenu = 'General';
					messages = [{ from: 'bot', message: initialMessage, timestamp: new Date() }];
				} catch (err) {
					chatUtils.errors.logError('CS disconnection', err);
				}
			}
		} else {
			// Regular menu selection
			activeMenu = menu;
			const menuPrompt = chatbotService.getMenuPrompt(menu);
			await sendMessage(menuPrompt, false);
		}
	}

	// Send message and get response from bot service
	async function send(): Promise<void> {
		if (!ChatUtils.validateMessage(input) || loading || disabled) return;
		await sendMessage(ChatUtils.sanitizeMessage(input), true);
	}

	// Core message sending logic
	async function sendMessage(messageText: string, clearInput: boolean = true): Promise<void> {
		if (!ChatUtils.validateMessage(messageText) || loading) return;

		console.log('📤 SendMessage called - CS State:', csConnectionState, 'Loading:', loading);
		error = null;

		try {
			// Add user message to UI
			const userMessage: MessageType = {
				from: 'user',
				message: messageText,
				timestamp: new Date(),
				id: ChatUtils.generateMessageId('user'),
				isFromCS: csConnectionState === 'connected' // Mark as CS message if in CS mode
			};
			messages = [...messages, userMessage];

			if (clearInput) {
				input = '';
			}

			// Handle CS vs Chatbot messaging differently
			if (csConnectionState === 'connected') {
				console.log('🎯 Sending to CS - Loading should NOT be set');
				// Send to CS directly without showing typing indicator
				// CS will respond via WebSocket, no bot response needed
				const messageData = {
					username: `customer_${chatbotService.getCurrentSession()?.id}`,
					message: messageText,
					timestamp: new Date().toISOString(),
					user_type: 'customer',
					channel: chatbotService.getCurrentSession()?.privateChannelName,
					customer_id: chatbotService.getCurrentSession()?.id
				};

				console.log('📤 Sending message to CS:', messageData);

				const response = await fetch('/api/chat/private/send', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
					},
					body: JSON.stringify(messageData)
				});

				console.log('📡 CS API Response status:', response.status);
				const responseData = await response.json();
				console.log('📡 CS API Response data:', responseData);

				if (!response.ok) {
					throw new Error(`Failed to send message to CS: ${response.status}`);
				}
			} else if (csConnectionState === 'idle') {
				console.log('🤖 Sending to Chatbot - Setting loading = true');
				// Only show loading indicator when sending to chatbot
				loading = true;
				console.log('🔍 Loading set to:', loading);
				
				// Send to chatbot and get response
				const botResponse = await chatbotService.sendMessage(messageText);
				
				// Add bot response to UI
				const botMessage: MessageType = {
					from: 'bot',
					message: botResponse.content,
					timestamp: botResponse.timestamp,
					id: botResponse.id
				};
				messages = [...messages, botMessage];
			} else {
				console.log('🚫 CS State is waiting/connecting - message queued, no chatbot call');
				// Don't send to chatbot when CS is connecting or waiting
			}

		} catch (err) {
			chatUtils.errors.logError('sendMessage', err);
			error = chatUtils.errors.handleError(err);
			messages = [...messages, chatUtils.errors.createErrorMessage(error)];
		} finally {
			console.log('🔄 Finally block - CS State:', csConnectionState, 'Current loading:', loading);
			// Only reset loading if we're not in CS mode (since loading is only set for chatbot)
			if (csConnectionState !== 'connected') {
				loading = false;
				console.log('🔍 Loading reset to false for chatbot mode');
			} else {
				console.log('🎯 Loading NOT reset because in CS mode');
			}
		}
	}

	// Handle keyboard events
	function handleKey(e: KeyboardEvent): void {
		chatUtils.events.handleEnterKey(e, send);
	}

	// Clear chat history
	function clearChat(): void {
		chatbotService.clearHistory();
		messages = [{ from: 'bot', message: initialMessage, timestamp: new Date() }];
		error = null;
	}

	// Get position classes
	$: positionClasses = POSITION_CLASSES[position];
	$: dialogPositionClasses = DIALOG_POSITION_CLASSES[position];

	// Event handlers for child components
	function handleMessageClick(e: CustomEvent) {
		console.log('Message clicked:', e.detail);
	}

	function handleAvatarClick(e: CustomEvent) {
		console.log('Avatar clicked:', e.detail);
	}
</script>

<!-- Floating Action Button -->
<div class="fixed {positionClasses} z-50">
	<!-- Chat Button -->
	{#if !open}
		<ChatButton {disabled} onclick={toggleChat} />
	{/if}

	<!-- Chat Dialog -->
	{#if open}
		<ChatDialog 
			{dialogPositionClasses}
			{messages}
			{showMenuButtons}
			{customMenuItems}
			{activeMenu}
			{csConnectionState}
			{csAgentName}
			{loading}
			{disabled}
			{error}
			bind:input
			{placeholder}
			onClearChat={clearChat}
			onCloseChat={closeChat}
			onSelectMenu={selectMenu}
			onSend={send}
			onKeyDown={handleKey}
			onMessageClick={handleMessageClick}
			onAvatarClick={handleAvatarClick}
		/>
	{/if}
</div>

<style>
	/* Custom scrollbar for messages container */
	div::-webkit-scrollbar {
		width: 6px;
	}

	div::-webkit-scrollbar-track {
		background: #fef3c7;
		border-radius: 10px;
	}

	div::-webkit-scrollbar-thumb {
		background: linear-gradient(to bottom, #f59e0b, #d97706);
		border-radius: 10px;
	}

	div::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(to bottom, #d97706, #b45309);
	}

	/* Enhanced smooth transitions */
	.transition-transform {
		transition-property: transform;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 200ms;
	}

	.transition-colors {
		transition-property: color, background-color, border-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 200ms;
	}

	.transition-all {
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Scale animation for chat button */
	.chat-button-container {
		display: inline-block;
	}

	/* Ensure smooth animations */
	:global(.svelte-scale) {
		transform-origin: center;
	}

	:global(.svelte-fly-move) {
		transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
	}

	/* Menu button hover effects */
	button:hover:not(:disabled) {
		transform: translateY(-1px);
	}

	/* Message bubble animations */
	.message-bubble {
		animation: messageSlide 0.3s ease-out;
	}

	@keyframes messageSlide {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Backdrop blur support */
	.backdrop-blur-sm {
		backdrop-filter: blur(4px);
	}

	/* Enhanced focus states */
	input:focus {
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	/* Loading animation */
	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>