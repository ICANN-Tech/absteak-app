<script lang="ts">
	import { scale, slide, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { PlaySolid, PauseSolid, VolumeUpSolid, VolumeDownSolid, VolumeMuteSolid, ArrowUpRightFromSquareSolid } from 'flowbite-svelte-icons';

	// Core video props
	export let src: string;
	export let poster: string = '';

	// Video behavior props
	export let autoPlay: boolean = false;
	export let muted: boolean = false;
	export let loop: boolean = false;
	export let preload: 'none' | 'metadata' | 'auto' = 'metadata';

	// Styling props
	export let videoClass: string = 'w-full h-auto';
	export let containerClass: string = 'relative';
	export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
	export let aspectRatio: '16:9' | '4:3' | '1:1' | '21:9' | 'auto' = 'auto';
	export let rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' = 'md';
	export let shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';

	// Event callback props
	export let onplay: (() => void) | undefined = undefined;
	export let onpause: (() => void) | undefined = undefined;
	export let onended: (() => void) | undefined = undefined;
	export let onerror: ((event: Event) => void) | undefined = undefined;

	let videoElement: HTMLVideoElement | undefined;
	let isPlaying: boolean = false;
	let volume: number = 1;
	let showControls: boolean = false;
	let controlsTimeout: number;
	let mouseleaveTimeout: number;
	let isDragging: boolean = false;
	let isSeeking: boolean = false;
	let currentTime: number = 0;
	let duration: number = 0;
	let isLoading: boolean = true;
	let canPlay: boolean = false;

	// Size classes mapping
	const sizeClasses = {
		xs: 'max-w-xs',
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'w-full'
	};
	const aspectRatioClasses = {
		'16:9': 'aspect-video',
		'4:3': 'aspect-[4/3]',
		'1:1': 'aspect-square',
		'21:9': 'aspect-[21/9]',
		auto: ''
	};
	const roundedClasses = {
		none: '',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		'2xl': 'rounded-2xl',
		full: 'rounded-full'
	};
	const shadowClasses = {
		none: '',
		sm: 'shadow-sm',
		md: 'shadow-md',
		lg: 'shadow-lg',
		xl: 'shadow-xl',
		'2xl': 'shadow-2xl'
	};

	$: computedVideoClass = [
		videoClass,
		sizeClasses[size],
		aspectRatioClasses[aspectRatio],
		roundedClasses[rounded],
		shadowClasses[shadow],
		'object-cover'
	]
		.filter(Boolean)
		.join(' ');

	// Handle global mouseup to reset dragging state
	onMount(() => {
		const handleGlobalMouseUp = () => {
			if (isDragging) {
				isDragging = false;
				showVideoControls();
			}
		};

		document.addEventListener('mouseup', handleGlobalMouseUp);
		
		return () => {
			document.removeEventListener('mouseup', handleGlobalMouseUp);
		};
	});

	// Public methods for external control
	export function play() {
		if (videoElement) {
			videoElement.play();
			isPlaying = true;
		}
	}

	export function pause() {
		if (videoElement) {
			videoElement.pause();
			isPlaying = false;
		}
	}

	export function togglePlay() {
		if (videoElement) {
			if (videoElement.paused) {
				videoElement.play();
				isPlaying = true;
			} else {
				videoElement.pause();
				isPlaying = false;
			}
		}
	}

	export function setVolume(newVolume: number) {
		if (videoElement) {
			volume = Math.max(0, Math.min(1, newVolume));
			videoElement.volume = volume;
			if (volume === 0) {
				videoElement.muted = true;
			} else {
				videoElement.muted = false;
			}
		}
	}

	export function toggleMute() {
		if (videoElement) {
			if (videoElement.muted) {
				videoElement.muted = false;
				videoElement.volume = volume > 0 ? volume : 0.5;
			} else {
				videoElement.muted = true;
			}
		}
	}

	export function getVideoElement(): HTMLVideoElement | undefined {
		return videoElement;
	}

	// Control visibility functions
	function showVideoControls() {
		showControls = true;
		clearTimeout(controlsTimeout);
		clearTimeout(mouseleaveTimeout); // Clear any pending mouseleave timeout
		controlsTimeout = setTimeout(() => {
			showControls = false;
		}, 3000);
	}

	function hideVideoControls() {
		clearTimeout(controlsTimeout);
		showControls = false;
	}

	function hideVideoControlsDelayed() {
		if (isDragging) return; // Don't hide if dragging
		clearTimeout(mouseleaveTimeout);
		mouseleaveTimeout = setTimeout(() => {
			if (!isDragging) { // Double check before hiding
				hideVideoControls();
			}
		}, 500); // 500ms delay before hiding
	}

	// Event handlers
	function handlePlay() {
		isPlaying = true;
		onplay?.();
	}

	function handlePause() {
		isPlaying = false;
		onpause?.();
	}

	function handleEnded() {
		isPlaying = false;
		onended?.();
	}

	function handleError(event: Event) {
		onerror?.(event);
	}

	function handleVolumeChange() {
		if (videoElement) {
			volume = videoElement.volume;
		}
	}

	function handleLoadedMetadata() {
		if (videoElement) {
			volume = videoElement.volume;
			isPlaying = !videoElement.paused;
			duration = videoElement.duration;
		}
	}

	function handleLoadStart() {
		isLoading = true;
		canPlay = false;
	}

	function handleCanPlay() {
		canPlay = true;
		isLoading = false;
	}

	function handleCanPlayThrough() {
		canPlay = true;
		isLoading = false;
	}

	function handleWaiting() {
		if (!isSeeking) { // Don't show loading if user is seeking
			isLoading = true;
		}
	}

	function handlePlaying() {
		isLoading = false;
	}

	function handleTimeUpdate() {
		if (videoElement) {
			currentTime = videoElement.currentTime;
		}
	}

	function handleSeek(event: Event) {
		const target = event.target as HTMLInputElement;
		const seekTime = parseFloat(target.value);
		if (videoElement) {
			isSeeking = true; // Mark as seeking
			videoElement.currentTime = seekTime;
			currentTime = seekTime;
			
			// Clear seeking state after a short delay
			setTimeout(() => {
				isSeeking = false;
			}, 300);
		}
	}

	// Progress calculation
	$: progress = duration > 0 ? (currentTime / duration) * 100 : 0;

	// Volume control functions
	function increaseVolume() {
		setVolume(volume + 0.1);
	}

	function decreaseVolume() {
		setVolume(volume - 0.1);
	}

	function getVolumeIcon() {
		if (videoElement?.muted || volume === 0) {
			return VolumeDownSolid; // Use VolumeDownSolid for muted/off state
		} else if (volume < 0.5) {
			return VolumeMuteSolid;
		} else {
			return VolumeUpSolid;
		}
	}
</script>

<div
	class={containerClass}
	transition:scale={{ duration: 400, start: 0.8 }}
	tabindex="-1"
	role="application"
	on:mouseenter={showVideoControls}
	on:mouseleave={hideVideoControlsDelayed}
	on:mousemove={showVideoControls}
>
	<!-- Video Element -->
	<video
		bind:this={videoElement}
		class={computedVideoClass}
		{src}
		{poster}
		{muted}
		{loop}
		{preload}
		autoplay={autoPlay}
		on:play={handlePlay}
		on:pause={handlePause}
		on:ended={handleEnded}
		on:error={handleError}
		on:volumechange={handleVolumeChange}
		on:loadedmetadata={handleLoadedMetadata}
		on:timeupdate={handleTimeUpdate}
		on:loadstart={handleLoadStart}
		on:canplay={handleCanPlay}
		on:canplaythrough={handleCanPlayThrough}
		on:waiting={handleWaiting}
		on:playing={handlePlaying}
		on:click={togglePlay}
	>
		<track kind="captions" />
	</video>

	<!-- Loading Screen -->
	{#if isLoading || !canPlay}
		<div 
			class="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
			transition:fade={{ duration: 200 }}
		>
			<div class="flex flex-col items-center gap-3">
				<!-- Loading Spinner -->
				<div class="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
				<!-- Loading Text -->
				<span class="text-white/80 text-sm font-medium">Loading video...</span>
			</div>
		</div>
	{/if}

	<!-- Custom Controls -->
	{#if showControls && canPlay && (!isLoading || isDragging || isSeeking)}
		<div
			class="absolute bottom-4 left-1/2 flex w-4/5 -translate-x-1/2 transform items-center justify-between gap-4 rounded-lg bg-black/50 p-3 backdrop-blur-sm transition-opacity duration-300"
			transition:slide={{ duration: 300, axis: 'y' }}
			on:mouseenter={showVideoControls}
			on:mouseleave={hideVideoControlsDelayed}
		>
			<!-- Left: Play/Pause Button -->
			<div class="flex items-center">
				<button
					class="rounded-md border-0 bg-white/20 p-2 transition-colors hover:bg-white/30"
					on:click={togglePlay}
				>
					{#if isPlaying}
						<PauseSolid class="h-5 w-5 text-white" />
					{:else}
						<PlaySolid class="h-5 w-5 text-white" />
					{/if}
				</button>
			</div>

			<!-- Center: Progress Track -->
			<div class="flex flex-1 items-center gap-2">
				<span class="min-w-[40px] text-xs text-white/80">
					{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60)
						.toString()
						.padStart(2, '0')}
				</span>
				<div class="relative flex-1">
					<input
						type="range"
						min="0"
						max={duration || 0}
						step="0.1"
						value={currentTime}
						on:input={handleSeek}
						on:mousedown={() => {
							isDragging = true;
							showVideoControls();
							clearTimeout(mouseleaveTimeout);
						}}
						on:mouseup={() => {
							isDragging = false;
							showVideoControls();
						}}
						class="progress-slider w-full cursor-pointer appearance-none items-center rounded-lg bg-white/30"
					/>
				</div>
				<span class="min-w-[40px] text-xs text-white/80">
					{Math.floor(duration / 60)}:{Math.floor(duration % 60)
						.toString()
						.padStart(2, '0')}
				</span>
			</div>

			<!-- Right: Volume Controls -->
			<div class="flex items-center gap-2">

				<!-- Fullscreen Toggle -->
				<button
					class="rounded-md border-0 bg-white/20 p-1.5 transition-colors hover:bg-white/30"
					on:click={() => {
						if (videoElement) {
							if (!document.fullscreenElement) {
								videoElement.requestFullscreen();
							} else {
								document.exitFullscreen();
							}
						}
					}}
				>
				<ArrowUpRightFromSquareSolid class="h-4 w-4 text-white" />
				</button>

				<!-- Mute/Unmute Toggle -->
				<button
					class="rounded-md border-0 bg-white/20 p-1.5 transition-colors hover:bg-white/30"
					on:click={toggleMute}
				>
					<svelte:component this={getVolumeIcon()} class="h-4 w-4 text-white" />
				</button>

				<!-- Volume Slider -->
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					bind:value={volume}
					on:input={() => setVolume(volume)}
					on:mousedown={() => {
						isDragging = true;
						showVideoControls();
						clearTimeout(mouseleaveTimeout);
					}}
					on:mouseup={() => {
						isDragging = false;
						showVideoControls();
					}}
					class="volume-slider h-1 w-20 cursor-pointer appearance-none rounded-lg bg-white/30"
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	.progress-slider::-webkit-slider-thumb,
	.volume-slider::-webkit-slider-thumb {
		appearance: none;
		height: 12px;
		width: 12px;
		border-radius: 50%;
		background: white;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.progress-slider::-moz-range-thumb,
	.volume-slider::-moz-range-thumb {
		height: 12px;
		width: 12px;
		border-radius: 50%;
		background: white;
		cursor: pointer;
		border: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.progress-slider::-webkit-slider-track,
	.volume-slider::-webkit-slider-track {
		background: transparent;
	}

	.progress-slider::-moz-range-track,
	.volume-slider::-moz-range-track {
		background: transparent;
		border: none;
	}
</style>
