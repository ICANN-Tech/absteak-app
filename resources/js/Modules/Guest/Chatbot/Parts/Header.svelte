<script lang="ts">
	import { CHATBOT_CONFIG, CSS_CLASSES } from '../Const/Chatbot.const';

	// Props
	export let error: string | null = null;
	export let loading = false;
	export let onClearChat: () => void;
	export let onCloseChat: () => void;

	// Reactive status
	$: status = error 
		? CHATBOT_CONFIG.STATUS.DISCONNECTED 
		: loading 
			? CHATBOT_CONFIG.STATUS.TYPING 
			: CHATBOT_CONFIG.STATUS.ONLINE;

	$: statusColor = error 
		? 'bg-red-400' 
		: loading 
			? 'bg-yellow-400' 
			: 'bg-green-400';
</script>

<!-- Header with Restaurant Background -->
<div class={CSS_CLASSES.HEADER_GRADIENT}>
	<!-- Background Image Overlay -->
	<div
		class="absolute inset-0 bg-cover bg-center opacity-30"
		style="background-image: url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop')"
	></div>

	<!-- Header Content -->
	<div class="relative z-10 flex h-full items-start justify-between px-4 py-3">
		<!-- Status Indicator -->
		<div class="flex items-center gap-2">
			<div class="w-3 h-3 rounded-full {statusColor} animate-pulse"></div>
			<span class="text-white text-sm font-medium">
				{status}
			</span>
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-2">
			<!-- Clear Chat Button -->
			<button
				class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
				on:click={onClearChat}
				aria-label="Clear chat"
				title="Clear chat history"
			>
				<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
			</button>

			<!-- Close Button -->
			<button
				class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
				on:click={onCloseChat}
				aria-label="Close chat"
			>
				<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	</div>
</div>

<style>
	/* Enhanced smooth transitions */
	.transition-colors {
		transition-property: color, background-color, border-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 200ms;
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
</style>