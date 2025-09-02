<script lang="ts">
	import { scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import {Button} from '@GuestComponents/Atoms';
	import { CHATBOT_CONFIG, CSS_CLASSES } from '../Const/Chatbot.const';

	// Props
	export let disabled = false;
	export let onclick: () => void;

	// Reactive classes
	$: buttonClasses = `${CSS_CLASSES.CHAT_BUTTON} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
</script>

<div
	class="chat-button-container"
	in:scale={{ 
		duration: CHATBOT_CONFIG.ANIMATION.SCALE_DURATION, 
		delay: CHATBOT_CONFIG.ANIMATION.SCALE_DELAY, 
		easing: cubicOut 
	}}
	out:scale={{ 
		duration: CHATBOT_CONFIG.ANIMATION.SCALE_OUT_DURATION, 
		easing: cubicOut 
	}}
>
	<Button
		variant="primary"
		circle
		size="lg"
		className={buttonClasses}
		{onclick}
		{disabled}
		aria-label="Open chat"
	>
		<!-- Chat Icon -->
			<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
			</svg>
	</Button>
</div>

<style>
	/* Scale animation for chat button */
	.chat-button-container {
		display: inline-block;
	}

	/* Ensure smooth animations */
	:global(.svelte-scale) {
		transform-origin: center;
	}
</style>