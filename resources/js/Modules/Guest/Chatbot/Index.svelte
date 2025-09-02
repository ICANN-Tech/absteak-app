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
	export let customMenuItems: string[] = [...CHATBOT_CONFIG.DEFAULT_MENU_ITEMS];
	export let initialMessage = CHATBOT_CONFIG.DEFAULT_INITIAL_MESSAGE;
	export let placeholder = CHATBOT_CONFIG.DEFAULT_PLACEHOLDER;
	export let disabled = false;

	// State variables
	let input = '';
	let messages: MessageType[] = [];
	let activeMenu = 'CS';
	let loading = false;
	let error: string | null = null;

	// Initialize chat with welcome message
	onMount(() => {
		// Async initialization
		(async () => {
			try {
				await chatbotService.startNewSession();
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
		
		activeMenu = menu;
		const menuPrompt = chatbotService.getMenuPrompt(menu);
		await sendMessage(menuPrompt, false);
	}

	// Send message and get response from bot service
	async function send(): Promise<void> {
		if (!ChatUtils.validateMessage(input) || loading || disabled) return;
		await sendMessage(ChatUtils.sanitizeMessage(input), true);
	}

	// Core message sending logic
	async function sendMessage(messageText: string, clearInput: boolean = true): Promise<void> {
		if (!ChatUtils.validateMessage(messageText) || loading) return;

		loading = true;
		error = null;

		try {
			// Add user message to UI
			const userMessage: MessageType = {
				from: 'user',
				message: messageText,
				timestamp: new Date(),
				id: ChatUtils.generateMessageId('user')
			};
			messages = [...messages, userMessage];

			if (clearInput) {
				input = '';
			}

			// Send to bot service and get response
			const botResponse = await chatbotService.sendMessage(messageText);

			// Add bot response to UI
			const botMessage: MessageType = {
				from: 'bot',
				message: botResponse.content,
				timestamp: botResponse.timestamp,
				id: botResponse.id
			};
			messages = [...messages, botMessage];

		} catch (err) {
			chatUtils.errors.logError('sendMessage', err);
			error = chatUtils.errors.handleError(err);
			messages = [...messages, chatUtils.errors.createErrorMessage(error)];
		} finally {
			loading = false;
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