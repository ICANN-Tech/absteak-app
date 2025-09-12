<script lang="ts">
	import { CHATBOT_CONFIG, CSS_CLASSES } from '../Const/Chatbot.const';

	// Props
	export let input = '';
	export let placeholder = CHATBOT_CONFIG.DEFAULT_PLACEHOLDER;
	export let loading = false;
	export let disabled = false;
	export let onSend: () => void;
	export let onKeyDown: (e: KeyboardEvent) => void;

	// Reactive classes
	$: inputClasses = `${CSS_CLASSES.INPUT_BASE} ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
	$: actualPlaceholder = loading ? 'Bot is typing...' : placeholder;
	
	// Debug reactive statements
	$: {
		console.log('🔍 Input.svelte - Loading:', loading, 'Placeholder:', actualPlaceholder);
	}
</script>

<div class="border-primary-100 flex items-center gap-3 rounded-b-2xl border-t bg-white px-4 py-4 shadow-inner">
	<input
		type="text"
		class={inputClasses}
		placeholder={actualPlaceholder}
		bind:value={input}
		on:keydown={onKeyDown}
		disabled={loading || disabled}
		aria-label="Type your message"
	/>
	
	<button
		type="button"
		class="bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg rounded-full w-12 h-12 flex items-center justify-center {loading ? 'animate-pulse' : ''}"
		on:click={onSend}
		disabled={!input.trim() || loading || disabled}
		aria-label="Send message"
	>
		{#if loading}
			<svg class="h-5 w-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
		{:else}
			<svg
				class="h-5 w-5 text-white"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
			</svg>
		{/if}
	</button>
</div>

<style>
	/* Enhanced smooth transitions */
	.transition-all {
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
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