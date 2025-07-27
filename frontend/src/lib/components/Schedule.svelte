<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { ChevronUpOutline } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';

	let isBottomVisible = true;
	let navRef: HTMLElement;

	function toggleSchedule() {
		isBottomVisible = !isBottomVisible;
	}

	function handleClickOutside(event: MouseEvent) {
		if (navRef && !navRef.contains(event.target as Node)) {
			isBottomVisible = false;
		}
	}

	onMount(() => {
		if (browser) {
			document.addEventListener('click', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div>
	<nav 
		bind:this={navRef}
		class="fixed bottom-0 left-1/2 -translate-x-1/2 z-20 mx-auto flex max-w-5xl flex-col gap-2 rounded-t-3xl border-t border-white/20 bg-primary-950/80 px-4 py-4 text-white shadow-lg backdrop-blur-lg"
	>
		{#if !isBottomVisible}
			<!-- Toggle Button -->
			<button
				on:click={toggleSchedule}
				class="flex items-center justify-center gap-2 w-full text-sm font-medium text-white hover:text-yellow-400 transition"
			>
				<h2
					class="font-cursive text-primary mb-2 text-2xl md:text-3xl px-2"
					transition:fly={{ y: 100, duration: 200 }}
				>
					<ChevronUpOutline />
				</h2>
			</button>
		{:else}
			<!-- Schedule -->
			<div
				class="flex flex-wrap items-center justify-center gap-20 p-4"
				transition:fly={{ y: 100, duration: 400 }}
			>
				<div class="flex flex-col gap-2 font-cursive text-center">
					<h1 class="text-primary mb-2 text-2xl md:text-2xl">Weekdays</h1>
					<h6>09.00 – 17.00</h6>
				</div>
				<div class="flex flex-col gap-2 font-cursive text-center">
					<h1 class="text-primary mb-2 text-2xl md:text-2xl">Saturday</h1>
					<h6>10.00 – 16.00</h6>
				</div>
				<div class="flex flex-col gap-2 font-cursive text-center">
					<h1 class="text-primary mb-2 text-2xl md:text-2xl">Sunday</h1>
					<h6>Closed</h6>
				</div>
			</div>
		{/if}
	</nav>
</div>

<style>
	.font-cursive {
		font-family: 'Pacifico', cursive;
	}
</style>
