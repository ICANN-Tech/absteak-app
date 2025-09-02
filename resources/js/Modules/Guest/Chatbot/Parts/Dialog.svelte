<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { CHATBOT_CONFIG, CSS_CLASSES } from '../Const/Chatbot.const';
	import ChatHeader from './Header.svelte';
	import MenuButtons from './BadgeMenu.svelte';
	import ChatInput from './Input.svelte';

	// Define MessageType locally
	interface MessageType {
		id?: string;
		from: 'user' | 'bot';
		message: string;
		timestamp?: Date;
	}

	// Props
	export let dialogPositionClasses: string;
	export let messages: MessageType[] = [];
	export let showMenuButtons = true;
	export let customMenuItems: string[] = [...CHATBOT_CONFIG.DEFAULT_MENU_ITEMS];
	export let activeMenu = 'CS';
	export let loading = false;
	export let disabled = false;
	export let error: string | null = null;
	export let input = '';
	export let placeholder = CHATBOT_CONFIG.DEFAULT_PLACEHOLDER;

	// Event handlers
	export let onClearChat: () => void;
	export let onCloseChat: () => void;
	export let onSelectMenu: (menu: string) => void;
	export let onSend: () => void;
	export let onKeyDown: (e: KeyboardEvent) => void;
	export let onMessageClick: (e: CustomEvent) => void;
	export let onAvatarClick: (e: CustomEvent) => void;

	// Reactive classes
	$: dialogClasses = `${CSS_CLASSES.CHAT_DIALOG} ${CHATBOT_CONFIG.UI.CHAT_WIDTH} ${CHATBOT_CONFIG.UI.CHAT_HEIGHT} ${dialogPositionClasses}`;
</script>

<div
	class={dialogClasses}
	in:fly={{ 
		y: CHATBOT_CONFIG.ANIMATION.FLY_OFFSET, 
		duration: CHATBOT_CONFIG.ANIMATION.FLY_DURATION, 
		easing: cubicOut, 
		delay: CHATBOT_CONFIG.ANIMATION.FLY_DELAY 
	}}
	out:fly={{ 
		y: CHATBOT_CONFIG.ANIMATION.FLY_OFFSET, 
		duration: CHATBOT_CONFIG.ANIMATION.FLY_OUT_DURATION, 
		easing: cubicOut 
	}}
>
	<!-- Header -->
	<ChatHeader 
		{error} 
		{loading} 
		{onClearChat} 
		{onCloseChat} 
	/>

	<!-- Menu Buttons -->
	{#if showMenuButtons}
		<MenuButtons 
			{customMenuItems} 
			{activeMenu} 
			{loading} 
			{disabled} 
			{onSelectMenu} 
		/>
	{/if}

	<!-- Messages -->
	<div class="flex-1 px-4 py-3 space-y-3 overflow-y-auto bg-gradient-to-b from-primary-50 to-white">
		{#each messages as message, index}
			<div class="flex {message.from === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2">
				{#if message.from === 'bot'}
					<!-- Bot Avatar -->
					<div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
						<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
				{/if}
				
				<!-- Message Content -->
				<div 
					class="{message.from === 'user' 
						? 'px-4 py-3 rounded-2xl rounded-tr-md mb-1 max-w-[85%] text-sm bg-white text-gray-800 shadow-lg border border-primary-200 backdrop-blur-sm' 
						: `px-4 py-3 rounded-2xl rounded-tl-md mb-1 text-sm bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg border border-primary-400 ${error && index === messages.length - 1 ? 'bg-red-500 border-red-400' : ''}`}"
					on:click={() => onMessageClick && onMessageClick(new CustomEvent('messageClick', { detail: message }))}
					role="button"
					tabindex="0"
				>
					{message.message}
				</div>
			</div>
		{/each}
	</div>

	<!-- Input -->
	<ChatInput 
		bind:input 
		{placeholder} 
		{loading} 
		{disabled} 
		{onSend} 
		{onKeyDown} 
	/>
</div>

<style>
	/* Custom scrollbar for messages container */
	:global(div::-webkit-scrollbar) {
		width: 6px;
	}

	:global(div::-webkit-scrollbar-track) {
		background: #fef3c7;
		border-radius: 10px;
	}

	:global(div::-webkit-scrollbar-thumb) {
		background: linear-gradient(to bottom, #f59e0b, #d97706);
		border-radius: 10px;
	}

	:global(div::-webkit-scrollbar-thumb:hover) {
		background: linear-gradient(to bottom, #d97706, #b45309);
	}

	/* Ensure smooth animations */
	:global(.svelte-fly-move) {
		transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
	}

	/* Message bubble animations */
	:global(.message-bubble) {
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
	:global(.backdrop-blur-sm) {
		backdrop-filter: blur(4px);
	}
</style>