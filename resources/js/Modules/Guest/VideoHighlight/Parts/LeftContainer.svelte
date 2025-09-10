<script context="module" lang="ts">
	import { page } from '@inertiajs/svelte';
	import { CONTAINER_SECTION } from '@Const/Guest/UI/Container';
	import { ThumbnailMedia, VideoOverlay } from '@Components/Guest/Molecules/Media';
</script>

<script lang="ts">
	$: highlight = $page.props.highlight;
	$: thumbnailUrl = highlight?.preview?.thumbnail || 'https://picsum.photos/800/600?random=100';
	const thumbnailAlt: string = 'video highlight';
	$: videoUrl = highlight?.preview?.video || 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
	let showOverlay: boolean = false;
    
	$: containerClass = `${CONTAINER_SECTION.videoHighlight.content.left}`;
</script>

<div class={containerClass}>
	<ThumbnailMedia
		src={thumbnailUrl}
		alt={thumbnailAlt}
		onClick={() => (showOverlay = true)}
		containerClass="h-full w-full"
	/>
</div>

<!-- Video Overlay Component -->
<VideoOverlay
	bind:show={showOverlay}
	{videoUrl}
	autoplay={true}
	onclose={() => (showOverlay = false)}
/>
