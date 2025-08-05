<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { createCarousel } from '$lib/utils/carousel';

	export let carouselId: string | null = null;
	export let images: { url: string }[];
	export let interval: number = 6000;

	// Carousel instance dengan ID
	const carousel = createCarousel(images, interval, carouselId);
	const carouselStore = carousel.getStore();

	// Reactive state dari store
	$: current = $carouselStore.current;
	$: overlayDark = $carouselStore.overlayDark;

	// Lifecycle
	onMount(() => {
		carousel.start();
	});

	onDestroy(() => {
		carousel.stop();
	});
</script>

<section
	class="relative flex h-screen min-h-screen w-full flex-col items-center justify-center overflow-hidden text-center"
>
	{#each images as img, i (i)}
		{#if i === current}
			<img
				src={img.url}
				alt="Hero"
				class="absolute inset-0 z-0 h-full w-full object-cover"
				transition:fade={{ duration: 1000 }}
			/>
			<div
				class="absolute inset-0 z-10 bg-black backdrop-blur-sm transition-colors duration-500"
				style="opacity: {overlayDark ? 0.8 : 0.4};"
				transition:fade={{ duration: 1000 }}
				on:introstart={carousel.handleTransitionStart}
				on:outroend={carousel.handleTransitionEnd}
			></div>
		{/if}
	{/each}

	<slot />
</section>
