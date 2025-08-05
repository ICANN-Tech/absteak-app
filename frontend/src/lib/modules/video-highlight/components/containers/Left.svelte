<script context="module" lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';

	let pingDelay1: number = 0.5;
	let pingDelay2: number = 1.5;
	let pingOpacity: number = 0.8;
</script>

<script lang="ts">
	import { ThumbnailMedia, VideoOverlay } from '$lib/components/molecules';
	
	const thumbnailUrl: string = 'assets/thumbnail.webp';
	const thumbnailAlt: string = 'video highlight';
	const videoUrl: string =
		'assets/videos/highlight.webm';
	let showOverlay: boolean = false;
    
	$: containerClass = `${CONTAINER_SECTION.videoHighlight.content.left}`;
</script>

<div class={containerClass}>
	<ThumbnailMedia
		src={thumbnailUrl}
		alt={thumbnailAlt}
		onClick={() => (showOverlay = true)}
		containerClass="h-full w-full"
		{pingDelay1}
		{pingDelay2}
		{pingOpacity}
	/>
</div>

<!-- Video Overlay Component -->
<VideoOverlay
	bind:show={showOverlay}
	{videoUrl}
	autoPlay={true}
	onclose={() => (showOverlay = false)}
/>
