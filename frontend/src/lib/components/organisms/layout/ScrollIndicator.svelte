<script lang="ts">
	import { ChevronUpOutline, ChevronDownOutline } from 'flowbite-svelte-icons';
	import { createStateVisibility } from '$lib/stores/viewport/visibility';
	import { ComponentId } from '$lib/enums';
	import { useViewportNavigator } from '$lib/utils/viewport';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { ScrollMouseIcon } from '$lib/components/atoms';

	// Props
	export let direction: 'up' | 'down' = 'down';
	export let targetSection: string | null = null;
	export let onClick: (() => void) | null = null;

	// Create visibility state for this component
	const visibility = createStateVisibility(ComponentId.ScrollIndicator.toString(), {
		hideDelay: 1500,
		initialVisible: false
	});

	// Destructure the visibility state
	const { finalVisible } = visibility;

	// Navigation utilities
	let navigator: ReturnType<typeof useViewportNavigator>;

	onMount(() => {
		navigator = useViewportNavigator();
	});

	function handleClick() {
		if (onClick) {
			onClick();
		} else if (targetSection) {
			navigator?.jumpToSectionById(targetSection);
		} else if (direction === 'down') {
			navigator?.nextSection();
		} else {
			navigator?.previousSection();
		}
	}
</script>

<!-- <div class="fixed bottom-2 left-1/2 z-20 -translate-x-1/2 flex items-center justify-center overflow-hidden rounded-2xl">

</div> -->
{#if $finalVisible}
	<nav
		class={`fixed bottom-2 left-1/2 z-20 -translate-x-1/2`}
		transition:fly={{ y: 100, duration: 600 }}
	>
		<div class="flex items-center justify-center overflow-hidden">
			<button
				on:click={handleClick}
				class="flex h-14 w-14 items-center justify-center text-lg text-white transition-all duration-300 hover:bg-white/20 {direction ===
				'down'
					? 'animate-bounce'
					: 'hover:scale-110'}"
				aria-label={direction === 'down' ? 'Scroll to next section' : 'Scroll to top'}
			>
				{#if direction === 'up'}
				<ScrollMouseIcon size="sm" color="warning" />
				{:else}
					<ChevronUpOutline class="h-6 w-6" />
				{/if}
			</button>
		</div>
	</nav>
{/if}
