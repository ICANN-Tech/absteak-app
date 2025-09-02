<script lang="ts">
	export let show = false;
	export let closeOnBackdropClick = true;
	export let closeOnEscape = true;
	export let size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
	export let onclose: (() => void) | undefined = undefined;

	function closeModal() {
		show = false;
		onclose?.();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdropClick && event.target === event.currentTarget) {
			closeModal();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (closeOnEscape && event.key === 'Escape') {
			closeModal();
		}
	}

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-full'
	};
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="relative w-full {sizeClasses[size]} mx-4">
			<div class="bg-white rounded-lg shadow-xl overflow-hidden">
				<slot />
			</div>
		</div>
	</div>
{/if}