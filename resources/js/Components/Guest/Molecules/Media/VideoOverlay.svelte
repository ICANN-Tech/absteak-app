<script lang="ts">
	// Props
	export let show = false;
	export let videoUrl: string;
	export let captionUrl: string = '';
	export let captionLanguage: string = 'en';
	export let captionLabel: string = 'English captions';

	// Video behavior props
	export let autoplay = true;
	export let closeOnBackdropClick = true;
	export let closeOnEscape = true;
	export let preload: 'none' | 'metadata' | 'auto' = 'metadata';

	// Event callback props (Svelte 5 approach)
	export let onclose: (() => void) | undefined = undefined;
	export let onvideoended: (() => void) | undefined = undefined;
	export let onvideoplay: (() => void) | undefined = undefined;
	export let onvideoPause: (() => void) | undefined = undefined;
	export let onvideoerror: ((event: Event) => void) | undefined = undefined;

	let videoElement: HTMLVideoElement;

	// Handle modal close
	function closeModal() {
		show = false;
		if (videoElement) {
			videoElement.pause();
		}
		onclose?.();
	}

	// Handle backdrop click
	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdropClick && event.target === event.currentTarget) {
			closeModal();
		}
	}

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (closeOnEscape && event.key === 'Escape') {
			closeModal();
		}
	}

	// Video event handlers
	function handleVideoPlay() {
		onvideoplay?.();
	}

	function handleVideoPause() {
		onvideoPause?.();
	}

	function handleVideoEnded() {
		onvideoended?.();
	}

	function handleVideoError(event: Event) {
		onvideoerror?.(event);
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<div 
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-label="Video overlay"
		tabindex="-1"
	>
		<div class="relative w-[90vw] max-w-4xl aspect-video">
			<!-- Close button -->
			<button
				class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
				on:click={closeModal}
				aria-label="Close video"
			>
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Video element -->
			<video
				bind:this={videoElement}
				src={videoUrl}
				class="w-full h-full object-cover rounded-lg shadow-2xl"
				controls
				{autoplay}
				{preload}
				on:play={handleVideoPlay}
				on:pause={handleVideoPause}
				on:ended={handleVideoEnded}
				on:error={handleVideoError}
			>
				{#if captionUrl}
					<track
						kind="captions"
						src={captionUrl}
						srclang={captionLanguage}
						label={captionLabel}
						default
					/>
				{:else}
					<track kind="captions" srclang="en" label="No captions available" />
				{/if}
				Your browser does not support the video tag.
			</video>
		</div>
	</div>
{/if}
