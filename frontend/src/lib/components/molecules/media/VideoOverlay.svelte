<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { createMediaManager, type MediaManagerConfig } from '$lib/utils/mediaManager';

	// Props
	export let show = false;
	export let videoUrl: string;
	export let captionUrl: string = '';
	export let captionLanguage: string = 'en';
	export let captionLabel: string = 'English captions';
	export let showEscHint = true;
	
	// Media Manager Config Props
	export let autoPlay = true;
	export let autoPlayDelay = 300;
	export let closeOnVideoEnd = true;
	export let closeOnBackdropClick = true;
	export let closeOnEscape = true;
	export let preload: 'none' | 'metadata' | 'auto' = 'metadata';
	
	// Styling props
	export let backdropClass = 'fixed inset-0 z-50 flex items-center justify-center bg-primary-700/10 backdrop-blur-sm';
	export let closeButtonClass = 'focus:ring-opacity-50 absolute top-4 right-4 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-all duration-300 hover:bg-rose-600/80 focus:ring-2 focus:ring-white focus:outline-none';
	export let videoContainerClass = 'relative mx-4 flex h-full max-h-[85vh] w-full max-w-5xl items-center';
	export let videoClass = 'h-fit w-full rounded-2xl object-contain shadow-2xl';
	export let escHintClass = 'absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 text-sm text-white backdrop-blur-sm';
	
	// Animation props
	export let fadeInDuration = 300;
	export let scaleInDuration = 400;
	export let scaleInStart = 0.8;
	export let closeButtonScaleDuration = 200;
	export let closeButtonScaleDelay = 100;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		open: void;
		close: void;
		videoEnded: void;
		videoPlay: void;
		videoPause: void;
		videoError: Event;
	}>();

	// Create media manager instance
	const mediaManager = createMediaManager({
		autoPlay,
		autoPlayDelay,
		closeOnVideoEnd,
		closeOnBackdropClick,
		closeOnEscape,
		preload
	});

	let videoElement: HTMLVideoElement | undefined;

	// Reactive statements
	$: if (show) {
		handleOpen();
	} else {
		handleClose();
	}

	$: if (videoElement) {
		mediaManager.setVideoElement(videoElement);
	}

	function handleOpen() {
		mediaManager.openVideo(videoUrl, {
			captionUrl,
			captionLanguage,
			captionLabel
		});
		dispatch('open');
	}

	function handleClose() {
		mediaManager.closeVideo();
		dispatch('close');
	}

	function closeOverlay() {
		show = false;
	}

	function handleVideoEnded() {
		dispatch('videoEnded');
		mediaManager.handleVideoEnded();
		if (closeOnVideoEnd) {
			closeOverlay();
		}
	}

	function handleVideoPlay() {
		dispatch('videoPlay');
	}

	function handleVideoPause() {
		dispatch('videoPause');
	}

	function handleVideoError(event: Event) {
		dispatch('videoError', event);
	}

	function handleBackdropClick(event: KeyboardEvent | MouseEvent) {
		if (closeOnBackdropClick) {
			mediaManager.handleBackdropClick(event);
			if (event.target === event.currentTarget) {
				closeOverlay();
			}
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (closeOnEscape && event.key === 'Escape' && show) {
			mediaManager.handleKeydown(event);
			closeOverlay();
		}
	}

	// Cleanup on destroy
	onDestroy(() => {
		mediaManager.destroy();
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<div
		class={backdropClass}
		tabindex="0"
		role="button"
		aria-label="Close overlay"
		on:click={handleBackdropClick}
		on:keydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') handleBackdropClick(e);
		}}
		transition:fade={{ duration: fadeInDuration }}
	>
		<!-- Close button -->
		<button
			class={closeButtonClass}
			on:click={closeOverlay}
			aria-label="Close video"
			transition:scale={{ duration: closeButtonScaleDuration, delay: closeButtonScaleDelay }}
		>
			<CloseOutline />
		</button>

		<!-- ESC Hint -->
		{#if showEscHint}
			<div 
				class={escHintClass}
				in:fade={{ duration: fadeInDuration, delay: 200 }}
			>
				<kbd class="rounded bg-white/20 px-1.5 py-0.5 text-xs font-mono">ESC</kbd>
				<span>to close</span>
			</div>
		{/if}

		<!-- Video container -->
		<div
			class={videoContainerClass}
			transition:scale={{ duration: scaleInDuration, start: scaleInStart }}
		>
			<video
				bind:this={videoElement}
				class={videoClass}
				controls
				{preload}
				on:ended={handleVideoEnded}
				on:play={handleVideoPlay}
				on:pause={handleVideoPause}
				on:error={handleVideoError}
			>
				<source src={videoUrl} type="video/mp4" />
				{#if captionUrl}
					<track
						kind="captions"
						src={captionUrl}
						srclang={captionLanguage}
						label={captionLabel}
						default
					/>
				{/if}
				<p>
					Your browser doesn't support HTML5 video. Here is a <a
						href={videoUrl}
						class="text-blue-400 underline">link to the video</a
					> instead.
				</p>
			</video>
		</div>

		<!-- Slot for additional content -->
		<slot />
	</div>
{/if}