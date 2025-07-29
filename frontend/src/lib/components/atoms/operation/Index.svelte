<script lang="ts">
	import { onDestroy } from 'svelte';
	import { ChevronUpOutline } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	import { createStateVisibility } from '$lib/stores/viewport/visibility.js';

	// Create state-based visibility with integrated state management
	const visibility = createStateVisibility('operation-hours', {
		initialVisible: false,
		hideDelay: 3000
	});
	const { isVisible, show, hide } = visibility;

	/**
	 * Cleanup on component destroy
	 */
	onDestroy(() => {
		visibility.destroy();
	});
</script>

{#if $isVisible}
	<nav
		class="bg-primary-950/80 fixed bottom-0 left-1/2 z-20 mx-auto flex max-w-5xl -translate-x-1/2 flex-col gap-2 rounded-t-3xl border-t border-white/20 px-4 py-4 text-white shadow-lg backdrop-blur-lg"
		transition:fly={{ y: 100, duration: 600 }}
		on:mouseleave={() =>
			setTimeout(() => hide(), 1500)}
	>
		<div class="flex flex-wrap items-center justify-center gap-20 p-4">
			<div class="font-cursive flex flex-col gap-2 text-center">
				<h1 class="text-primary mb-2 text-2xl md:text-2xl">Weekdays</h1>
				<h6>09.00 – 17.00</h6>
			</div>
			<div class="font-cursive flex flex-col gap-2 text-center">
				<h1 class="text-primary mb-2 text-2xl md:text-2xl">Saturday</h1>
				<h6>10.00 – 16.00</h6>
			</div>
			<div class="font-cursive flex flex-col gap-2 text-center">
				<h1 class="text-primary mb-2 text-2xl md:text-2xl">Sunday</h1>
				<h6>Closed</h6>
			</div>
		</div>
	</nav>
{:else}
	<div
		class="fixed bottom-2 left-1/2 z-20 -translate-x-1/2"
		transition:fly={{ y: 100, duration: 600 }}
	>
		<div
			class="bg-primary-950/80 flex items-center justify-center overflow-hidden rounded-2xl border border-white/20 shadow-lg backdrop-blur-lg"
		>
			<button
				on:click={show}
				class="flex h-14 w-14 items-center justify-center bg-white/10 transition-all duration-300 hover:bg-white/20"
				title="Operating Hours"
			>
				<div class="text-lg text-white">
					<ChevronUpOutline />
				</div>
			</button>
		</div>
	</div>
{/if}

<style>
	.font-cursive {
		font-family: 'Pacifico', cursive;
	}
</style>
