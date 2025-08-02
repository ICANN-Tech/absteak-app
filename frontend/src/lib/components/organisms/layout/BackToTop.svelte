<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { ChevronUpOutline } from 'flowbite-svelte-icons';
	import { createStateVisibility } from '$lib/stores/viewport/visibility';
	import { ComponentId } from '$lib/enums';
	import { SectionId } from '$lib/enums';
	import { useViewportNavigator } from '$lib/utils/viewport';
	import { CONTAINER_PRESETS } from '$lib/const';

	// Create visibility state for this component
	const visibility = createStateVisibility(ComponentId.BackToTop as string, {
		hideDelay: 1500,
		initialVisible: false
	});

	// Destructure the visibility state
	const { finalVisible } = visibility;

	// Navigation utilities
	const navigator = useViewportNavigator();

	// Handle click to jump to hero section
	function handleBackToTop() {
		navigator.jumpToSectionById(SectionId.Hero);
	}

	// Cleanup on component destroy
	onDestroy(() => {
		visibility.destroy();
	});
</script>

{#if $finalVisible}
	<nav
		class="w-1/8 hover:scale-130 fixed bottom-0 left-1/2 z-20 -translate-x-1/2 transition-all duration-300"
		transition:fly={{ y: 100, duration: 600 }}
	>
		<div
			class={`flex items-center justify-center overflow-hidden rounded-t-2xl border border-white/20 shadow-lg backdrop-blur-lg border border-b-0 border-yellow-600 hover:bg-yellow-600 group-hover:text-white`}
		>
			<button
				on:click={handleBackToTop}
				class="w-full h-12 flex items-center text-center justify-center text-lg text-white transition-all duration-300 hover:bg-white/20"
				title="Back to Top"
				aria-label="Scroll back to top"
			>
			<ChevronUpOutline class="h-6 w-6" />
			</button>
		</div>
	</nav>
{/if}