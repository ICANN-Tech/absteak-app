<script lang="ts">
	import { derived } from 'svelte/store';
	import { modalStore } from '$lib/stores/modal';
	import { Modal } from '$lib/components/atoms';
	import Video from '$lib/components/atoms/media/Video.svelte';
	
	// Props
	export let show = false;
	export let videoUrl: string;
	export let captionUrl: string = '';
	export let captionLanguage: string = 'en';
	export let captionLabel: string = 'English captions';

	// Video behavior props
	export let autoPlay = true;
	export let closeOnBackdropClick = true;
	export let closeOnEscape = true;
	export let preload: 'none' | 'metadata' | 'auto' = 'metadata';

	// Animation props
	export let animationDuration = 300;

	// Event callback props (Svelte 5 approach)
	export let onopen: (() => void) | undefined = undefined;
	export let onclose: (() => void) | undefined = undefined;
	export let onvideoended: (() => void) | undefined = undefined;
	export let onvideoplay: (() => void) | undefined = undefined;
	export let onvideoPause: (() => void) | undefined = undefined;
	export let onvideoerror: ((event: Event) => void) | undefined = undefined;

	// Modal ID for centralized state management
	const modalId = 'video-overlay-modal';

	let videoComponent: any;

	// Create derived store to watch modal state
	const modalState = derived(modalStore, ($store) => $store[modalId] || { isOpen: false });
	const isModalOpen = derived(modalState, ($state) => $state.isOpen);

	// Watch for modal state changes to dispatch events
	let previousModalState = false;
	$: {
		if ($isModalOpen !== previousModalState) {
			if ($isModalOpen) {
				onopen?.();
			} else {
				// Stop video when modal closes
				if (videoComponent) {
					videoComponent.pause();
				}
				onclose?.();
			}
			previousModalState = $isModalOpen;
		}
	}

	// Reactive statement to handle show/hide using centralized modal store
	$: if (show) {
		modalStore.open(modalId, {
			title: 'Video Player',
			content: '',
			type: 'video',
			data: {
				videoUrl,
				captionUrl,
				captionLanguage,
				captionLabel
			}
		});
	}

	function closeOverlay() {
		// Stop video immediately
		if (videoComponent) {
			videoComponent.pause();
		}
		// Close modal immediately
		modalStore.close(modalId);
	}

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
	id={modalId}
	onClose={closeOverlay}
	closeOnBackdrop={closeOnBackdropClick}
	closeOnEscape={closeOnEscape}
	preventScroll={true}
	trapFocus={false}
	{animationDuration}
	modalClass="video-overlay-modal"
	backdropClass="video-overlay-backdrop"
	contentClass="w-[80vw]"
	showHeader={false}
	showCloseButton={false}
	showFooter={false}
>
	<Video
		bind:this={videoComponent}
		src={videoUrl}
		{autoPlay}
		{preload}
		muted={false}
		loop={false}
		containerClass=""
		size="full"
		aspectRatio="16:9"
		rounded="md"
		shadow="xl"
		onplay={handleVideoPlay}
		onpause={handleVideoPause}
		onended={handleVideoEnded}
		onerror={handleVideoError}
	/>
</Modal>



<style>
	:global(.video-overlay-modal) {
		padding: 0 !important;
		border: none !important;
		background: transparent !important;
		max-width: 100vw !important;
		max-height: 100vh !important;
		width: 100% !important;
		height: 100% !important;
		overflow: hidden !important;
		outline: none !important;
		box-shadow: none !important;
	}

	:global(.video-overlay-backdrop) {
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		width: 100% !important;
		height: 100% !important;
		padding: 0 !important;
		background: rgba(0, 0, 0, 0.3) !important;
		backdrop-filter: none !important;
		border: none !important;
		outline: none !important;
	}

	:global(.video-overlay-content) {
		background: transparent !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		max-width: none !important;
		width: 100% !important;
		max-height: 100vh !important;
		height: 100% !important;
		overflow: hidden !important;
		display: flex !important;
		flex-direction: column !important;
		align-items: center !important;
		justify-content: center !important;
		padding: 0 !important;
		margin: 0 !important;
		position: relative !important;
		border: none !important;
		outline: none !important;
	}

	:global(.video-full) {
		width: 90vw !important;
		height: 50.625vw !important; /* 16:9 aspect ratio (90vw * 9/16) */
		max-width: 90vw !important;
		max-height: 90vh !important;
		min-width: 80vw !important;
		min-height: 45vw !important; /* 16:9 aspect ratio (80vw * 9/16) */
		object-fit: cover !important;
		border-radius: 8px !important;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
		background: #000 !important;
		border: none !important;
		outline: none !important;
		aspect-ratio: 16/9 !important;
	}


</style>
