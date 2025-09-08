<script lang="ts">
	import Modal from '../../../Global/Atoms/Modal.svelte';

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

	// Animation props
	export let animationDuration = 300;

	// Event callback props
	export let onopen: (() => void) | undefined = undefined;
	export let onclose: (() => void) | undefined = undefined;
	export let onvideoended: (() => void) | undefined = undefined;
	export let onvideoplay: (() => void) | undefined = undefined;
	export let onvideoPause: (() => void) | undefined = undefined;
	export let onvideoerror: ((event: Event) => void) | undefined = undefined;

	let videoElement: HTMLVideoElement;

	// Handle modal close
	function handleModalClose() {
		// Stop video immediately
		if (videoElement) {
			videoElement.pause();
		}
		show = false;
		onclose?.();
	}

	// Handle modal open
	function handleModalOpen() {
		onopen?.();
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

<Modal 
	bind:show
	size="video"
	closeOnBackdropClick={closeOnBackdropClick}
	closeOnEscape={closeOnEscape}
	animationDuration={animationDuration}
	showHeader={false}
	showCloseButton={true}
	closeButtonPosition="outside"
	onopen={handleModalOpen}
	onclose={handleModalClose}
	preventScroll={true}
	trapFocus={false}
>
	<!-- Video container -->
	<div class="video-container relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
		<!-- Video element -->
		<video
			bind:this={videoElement}
			src={videoUrl}
			class="video-element w-full h-full object-contain"
			controls
			{autoplay}
			{preload}
			controlsList="nodownload"
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
</Modal>

<style>
	.video-overlay-backdrop {
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	.video-overlay-content {
		max-height: 90vh;
		max-width: 90vw;
	}

	.video-container {
		box-shadow: 
			0 25px 50px -12px rgba(0, 0, 0, 0.5),
			0 0 0 1px rgba(255, 255, 255, 0.1);
	}

	.video-element {
		border-radius: inherit;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.video-overlay-content {
			max-width: 95vw;
			max-height: 85vh;
		}
	}

	@media (max-width: 480px) {
		.video-overlay-backdrop {
			padding: 1rem;
		}
		
		.video-overlay-content {
			max-width: 100%;
			max-height: 80vh;
		}
	}

	/* Focus styles for accessibility */
	.video-overlay-backdrop:focus {
		outline: 2px solid rgba(59, 130, 246, 0.5);
		outline-offset: -2px;
	}

	/* Custom video controls styling */
	.video-element::-webkit-media-controls-panel {
		background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
	}

	.video-element::-webkit-media-controls-play-button,
	.video-element::-webkit-media-controls-volume-slider,
	.video-element::-webkit-media-controls-timeline {
		filter: brightness(1.2);
	}
</style>
