<script lang="ts">
	export let src: string;
	export let poster: string = '';
	export let autoplay = false;
	export let controls = true;
	export let muted = false;
	export let loop = false;
	export let preload: 'none' | 'metadata' | 'auto' = 'metadata';
	export let width: string | number = '100%';
	export let height: string | number = 'auto';
	export let className = '';
	export let captionUrl = '';
	export let captionLanguage = 'en';
	export let captionLabel = 'English captions';

	// Event handlers
	export let onplay: (() => void) | undefined = undefined;
	export let onpause: (() => void) | undefined = undefined;
	export let onended: (() => void) | undefined = undefined;
	export let onerror: ((event: Event) => void) | undefined = undefined;
	export let onloadstart: (() => void) | undefined = undefined;
	export let onloadeddata: (() => void) | undefined = undefined;

	let videoElement: HTMLVideoElement;

	function handlePlay() {
		onplay?.();
	}

	function handlePause() {
		onpause?.();
	}

	function handleEnded() {
		onended?.();
	}

	function handleError(event: Event) {
		onerror?.(event);
	}

	function handleLoadStart() {
		onloadstart?.();
	}

	function handleLoadedData() {
		onloadeddata?.();
	}

	// Public methods
	export function play() {
		return videoElement?.play();
	}

	export function pause() {
		videoElement?.pause();
	}

	export function getCurrentTime() {
		return videoElement?.currentTime || 0;
	}

	export function setCurrentTime(time: number) {
		if (videoElement) {
			videoElement.currentTime = time;
		}
	}

	export function getDuration() {
		return videoElement?.duration || 0;
	}
</script>

<video
	bind:this={videoElement}
	{src}
	{poster}
	{autoplay}
	{controls}
	{muted}
	{loop}
	{preload}
	{width}
	{height}
	class={className}
	on:play={handlePlay}
	on:pause={handlePause}
	on:ended={handleEnded}
	on:error={handleError}
	on:loadstart={handleLoadStart}
	on:loadeddata={handleLoadedData}
>
	{#if captionUrl}
		<track
			kind="captions"
			src={captionUrl}
			srclang={captionLanguage}
			label={captionLabel}
			default
		/>
	{/if}
	<slot>
		Your browser does not support the video tag.
	</slot>
</video>