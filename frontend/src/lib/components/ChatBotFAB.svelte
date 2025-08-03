<script context="module" lang="ts">
	// Easing function for smoother animations
	export function cubicOut(t: number): number {
		const f = t - 1.0;
		return f * f * f + 1.0;
	}
</script>

<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { Button } from '$lib/components/atoms';
	import { Chat, type MessageType } from '$lib/components/organisms';
	import { MessageDotsSolid, UserCircleOutline } from 'flowbite-svelte-icons';

	let open = false;
	let input = '';
	let messages: MessageType[] = [{ from: 'bot', text: 'Hi! How can I help you?' }];
	let activeMenu = 'CS'; // Track active menu button

	// Toggle chat visibility
	function toggleChat(): void {
		open = !open;
	}

	// Close chat
	function closeChat(): void {
		open = false;
	}

	// Handle escape key to close chat
	function handleEscape(e: KeyboardEvent): void {
		if (e.key === 'Escape' && open) {
			closeChat();
		}
	}

	// Handle click outside to close chat
	function handleClickOutside(e: MouseEvent): void {
		const target = e.target as HTMLElement;
		const chatDialog = document.querySelector('.chat-dialog');
		const chatButton = document.querySelector('.chat-button-container');

		if (open && chatDialog && !chatDialog.contains(target) && !chatButton?.contains(target)) {
			closeChat();
		}
	}

	// Handle menu button selection
	function selectMenu(menu: string): void {
		activeMenu = menu;
		let menuResponse = '';

		switch (menu) {
			case 'CS':
				menuResponse =
					'Customer Service: How can I assist you today? Feel free to ask about our services, reservations, or any concerns.';
				break;
			case 'Menu':
				menuResponse =
					'Our Menu: We offer a variety of delicious dishes including appetizers, main courses, desserts, and beverages. What would you like to know about our menu?';
				break;
			case 'Dine In':
				menuResponse =
					'Dine In: Experience our cozy atmosphere! We offer table service with our full menu. Would you like to make a reservation?';
				break;
			case 'Dine Out':
				menuResponse =
					'Dine Out: Take our delicious food with you! We offer takeaway and delivery services. What would you like to order?';
				break;
		}

		messages = [...messages, { from: 'bot', text: menuResponse }];
	}

	// Send message and get response
	async function send(): Promise<void> {
		if (input.trim()) {
			// Add user message
			messages = [...messages, { from: 'user', text: input.trim() }];
			const userInput = input;
			input = '';

			// Simulate bot typing with delay
			setTimeout(() => {
				// Add bot response
				let response = getBotResponse(userInput);
				messages = [...messages, { from: 'bot', text: response }];
			}, 700);
		}
	}

	// Handle keyboard events
	function handleKey(e: KeyboardEvent): void {
		if (e.key === 'Enter') send();
	}

	// Simple response generator based on user input
	function getBotResponse(text: string): string {
		text = text.toLowerCase();

		if (text.includes('hello') || text.includes('hi')) {
			return 'Hello there! How can I help you today?';
		} else if (text.includes('menu') || text.includes('food')) {
			return 'Our menu features a variety of delicious dishes. Would you like to see our specials?';
		} else if (text.includes('reservation') || text.includes('book') || text.includes('table')) {
			return 'You can make a reservation by calling us at (123) 456-7890 or through our website.';
		} else if (text.includes('hour') || text.includes('open')) {
			return 'We are open Monday-Friday 11am-10pm, and weekends 10am-11pm.';
		} else if (text.includes('location') || text.includes('address') || text.includes('where')) {
			return 'We are located at 123 Delicious Street, Foodville.';
		} else if (text.includes('thank')) {
			return "You're welcome! Is there anything else I can help you with?";
		} else {
			return "I'm here to help with menu information, reservations, hours, and locations. How can I assist you?";
		}
	}

	// Ensure scroll to bottom when chat opens - handled by Chat component
	$: if (open) {
		// Chat component handles auto-scrolling
	}

	// Set up event listeners for escape key and click outside
	onMount(() => {
		// Add event listeners
		document.addEventListener('keydown', handleEscape);
		document.addEventListener('click', handleClickOutside);

		// Cleanup function
		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<!-- Floating Action Button -->
<div class="fixed bottom-6 right-6 z-50">
	<!-- Chat Button -->
	{#if !open}
		<div
			class="chat-button-container"
			in:scale={{ duration: 300, delay: 300, easing: cubicOut }}
			out:scale={{ duration: 200, easing: cubicOut }}
		>
			<Button
				variant="primary"
				circle
				size="lg"
				className="shadow-lg hover:scale-110 transition-transform duration-200"
				onclick={toggleChat}
				aria-label="Open chat"
			>
				<MessageDotsSolid />
			</Button>
		</div>
	{/if}

	<!-- Chat Dialog -->
	{#if open}
		<div
			class="chat-dialog w-92 border-primary-200 fixed bottom-4 right-4 z-50 flex h-[35rem] max-w-[95vw] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl"
			in:fly={{ y: 40, duration: 400, easing: cubicOut, delay: 150 }}
			out:fly={{ y: 40, duration: 300, easing: cubicOut }}
		>
			<!-- Header with Restaurant Background -->
			<div
				class="from-primary-600 to-primary-500 relative h-32 overflow-hidden rounded-t-2xl bg-gradient-to-r"
			>
				<!-- Background Image Overlay -->
				<div
					class="absolute inset-0 bg-cover bg-center opacity-30"
					style="background-image: url('/assets/chat_bot_bg.png')"
				></div>

				<!-- Header Content -->
				<div class="relative z-10 flex h-full items-start justify-end px-4 py-3">
					<a href="#" class="transform transition duration-300 hover:scale-110">
						<img
							src="https://ui-avatars.com/api/?name=Samule&background=663618&color=f0e9e9&rounded=true"
							class="h-12 w-12"
							alt=""
							srcset=""
						/>
					</a>
				</div>
			</div>

			<!-- Menu Buttons -->
			<div class="bg-primary-50 border-primary-100 border-b px-4 py-3">
				<div class="grid grid-cols-4 gap-2">
					{#each ['CS', 'Menu', 'Dine In', 'Dine Out'] as menuItem}
						<button
							class="transform rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 hover:scale-105"
							class:bg-primary-500={activeMenu === menuItem}
							class:text-white={activeMenu === menuItem}
							class:bg-white={activeMenu !== menuItem}
							class:text-primary-600={activeMenu !== menuItem}
							class:shadow-md={activeMenu === menuItem}
							class:border={activeMenu !== menuItem}
							class:border-primary-200={activeMenu !== menuItem}
							onclick={() => selectMenu(menuItem)}
						>
							{menuItem}
						</button>
					{/each}
				</div>
			</div>

			<!-- Messages -->
			<Chat
				{messages}
				containerClass="flex-1 px-4 py-3 space-y-3 overflow-y-auto bg-gradient-to-b from-primary-50 to-white"
				botAvatarConfig={{
					type: 'icon',
					icon: 'lightning',
					backgroundColor: 'bg-gradient-to-br from-primary-500 to-primary-600',
					iconColor: 'text-white'
				}}
				userMessageClass="px-4 py-3 rounded-2xl rounded-tr-md mb-1 max-w-[85%] text-sm bg-white text-gray-800 shadow-lg border border-primary-200 backdrop-blur-sm"
				botMessageClass="px-4 py-3 rounded-2xl rounded-tl-md mb-1 text-sm bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg border border-primary-400"
				animationDelay={50}
				animationDuration={300}
				on:messageClick={(e) => console.log('Message clicked:', e.detail)}
				on:avatarClick={(e) => console.log('Avatar clicked:', e.detail)}
			/>

			<!-- Input -->
			<div
				class="border-primary-100 flex items-center gap-3 rounded-b-2xl border-t bg-white px-4 py-4 shadow-inner"
			>
				<input
					type="text"
					class="border-primary-300 focus:ring-primary-400 bg-primary-50 placeholder-primary-400 flex-1 rounded-full border px-4 py-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2"
					placeholder="Type your message..."
					bind:value={input}
					onkeydown={handleKey}
				/>
				<Button
					variant="primary"
					circle
					size="md"
					className="bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
					onclick={send}
					disabled={!input.trim()}
					aria-label="Send"
				>
					<svg
						class="h-5 w-5 text-white"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
					</svg>
				</Button>
			</div>
		</div>
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
	button:hover {
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

	/* Gradient text effect for header */
	.gradient-text {
		background: linear-gradient(45deg, #ffffff, #f3f4f6);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
</style>
