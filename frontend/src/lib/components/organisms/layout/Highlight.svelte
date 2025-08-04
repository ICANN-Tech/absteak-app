<script context="module" lang="ts">
	import { CONTAINER_PRESETS } from '$lib/const';
	import { createAreaBasedStateVisibility } from '$lib/stores/viewport/visibility';
	import { ComponentId } from '$lib/enums';

	const visibility = createAreaBasedStateVisibility(ComponentId.Highlight, {
		targetArea: 'right',
		proximityRadius: 150,
		areaOffset: 100,
		initialVisible: false,
		hideDelay: 2000,
		showComponent: false
	});

	export const { isVisible, showComponent } = visibility;
	export const updateVisibilityPosition = visibility.updatePosition;
	export const destroyVisibilityManager = visibility.destroy;
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { 
		currentHighlightIndex, 
		highlightsData, 
		initializeHighlights
	} from '$lib/stores/viewport/highlight';
	import { Indicator } from '$lib/components/atoms';
	import { createHighlightLockMonitor, type HighlightLockMonitor } from '$lib/utils/monitor/component/highlight';

	// Create highlight lock monitor
	let highlightMonitor: HighlightLockMonitor;

	onMount(async () => {
		// await initializeHighlights();
		// Initialize the highlight lock monitor
		highlightMonitor = createHighlightLockMonitor();
	});
	
	onDestroy(() => {
		// Cleanup the monitor
		if (highlightMonitor) {
			highlightMonitor.destroy();
		}
		destroyVisibilityManager();
	});
</script>

{#if $showComponent && $isVisible && $highlightsData.length > 0}
	<div
		role="navigation"
		aria-label="Section highlights navigation"
		class={`${CONTAINER_PRESETS.panel.blur} fixed right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col space-y-2 rounded-l-2xl border-white/20 p-3 py-2 shadow-lg`}
		transition:fly={{ x: 100, duration: 300 }}
		on:mouseenter={() => highlightMonitor?.handleMouseEnter()}
		on:mouseleave={() => highlightMonitor?.handleMouseLeave()}
	>
		{#each $highlightsData as highlight, index}
			{@const isActive = $currentHighlightIndex === index}

			<button on:click={() => highlightMonitor?.handleHighlightClick(index)}>
				<Indicator
					currentSectionIndex={index}
					title={highlight.name}
					isActive={isActive}
					colorScheme={'white'}
				/>
			</button>
		{/each}
	</div>
{/if}