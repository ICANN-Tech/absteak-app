<script lang="ts">
	import { layout } from '$lib/const';
	import AnimateOnScroll from '$lib/components/AnimateOnScroll.svelte';
	import { flip } from 'svelte/animate';
	import { ThumbnailMedia, VideoOverlay } from '$lib/components/molecules';

	// Props untuk kustomisasi konten
	export let title: string = 'Voluptatem dignissimos provident quasi corporis voluptates sit assumenda.';
	export let subtitle: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
	export let description: string = 'Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident';
	export let items: string[] = [
		'Ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		'Duis aute irure dolor in reprehenderit in voluptate velit.',
		'Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate trideta storacalaperda mastiro dolore eu fugiat nulla pariatur.'
	];

	// Props untuk media
	export let thumbnailUrl: string = '/assets/thumbnail.png';
	export let videoUrl: string = 'https://absteakjkt.com/wp-content/uploads/2024/01/Profile-Chef-Akira-Back-prev-3.mp4';
	export let captionUrl: string = '/captions/video-caption.vtt';
	export let captionLanguage: string = 'en';
	export let captionLabel: string = 'English captions';
	export let thumbnailAlt: string = 'Video thumbnail';

	// Props untuk layout dan styling
	export let backgroundColor: string = '#fdf6ee';
	export let layout_direction: 'normal' | 'reverse' = 'normal';
	export let containerClass: string = '';
	export let contentClass: string = '';
	export let mediaClass: string = '';

	// Props untuk animasi
	export let animationType: 'fly' | 'fade' | 'scale' | 'slide' = 'fly';
	export let animationY: number = 40;
	export let animationDuration: number = 700;

	// Props untuk ThumbnailMedia
	export let pingDelay1: number = 0.5;
	export let pingDelay2: number = 1.5;
	export let pingOpacity: number = 0.8;

	// Props untuk VideoOverlay
	export let showEscHint: boolean = true;
	export let autoPlay: boolean = true;
	export let closeOnVideoEnd: boolean = true;

	// State
	let showOverlay = false;

	// Computed classes
	$: flexDirection = layout_direction === 'reverse' ? 'md:flex-row-reverse' : 'md:flex-row';
	$: sectionClasses = `flex h-screen w-full flex-col items-center gap-10 rounded-xl ${flexDirection} ${layout.margin.section} ${containerClass}`;
	$: sectionStyle = `background-color: ${backgroundColor};`;

	function openVideoOverlay() {
		showOverlay = true;
	}

	function handleVideoOverlayClose() {
		showOverlay = false;
	}
</script>

<AnimateOnScroll animation={animationType} y={animationY} duration={animationDuration}>
	<section class={sectionClasses} style={sectionStyle}>
		<!-- Media Container -->
		<div class="h-full w-full md:w-1/2 {mediaClass}">
			<ThumbnailMedia 
				src={thumbnailUrl}
				alt={thumbnailAlt}
				onClick={openVideoOverlay}
				containerClass="h-full"
				{pingDelay1}
				{pingDelay2}
				{pingOpacity}
			/>
		</div>

		<!-- Content Container -->
		<div class="w-full md:w-1/2 {contentClass}">
			<!-- Title -->
			<h2 class="font-cursive text-primary mb-2 text-2xl md:text-3xl">
				{title}
			</h2>

			<!-- Subtitle -->
			{#if subtitle}
				<p class="mb-4 text-gray-700 italic">
					{subtitle}
				</p>
			{/if}

			<!-- Items List -->
			{#if items && items.length > 0}
				<ul class="mb-4 space-y-2">
					{#each items as item, i (item)}
						<li class="flex items-start gap-2" animate:flip>
							<span class="text-primary mt-1">
								<svg
									class="h-5 w-5"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									viewBox="0 0 24 24"
								>
									<polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
							{item}
						</li>
					{/each}
				</ul>
			{/if}

			<!-- Description -->
			{#if description}
				<p class="text-gray-700">
					{description}
				</p>
			{/if}

			<!-- Slot untuk konten tambahan -->
			<slot name="additional-content" />
		</div>

		<!-- Slot untuk konten custom di luar layout standar -->
		<slot />
	</section>
</AnimateOnScroll>

<!-- Video Overlay Component -->
<VideoOverlay 
	bind:show={showOverlay}
	{videoUrl}
	{captionUrl}
	{captionLanguage}
	{captionLabel}
	{showEscHint}
	{autoPlay}
	{closeOnVideoEnd}
	on:close={handleVideoOverlayClose}
/>

<style>
	.font-cursive {
		font-family: 'Pacifico', cursive;
	}
</style>