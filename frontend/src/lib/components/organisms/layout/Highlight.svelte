<script context="module" lang="ts">
	import { CONTAINER_PRESETS } from '$lib/const';
	import { createAreaBasedStateVisibility } from '$lib/stores/viewport/visibility';
	import { ComponentId } from '$lib/enums';
	import { Indicator } from '$lib/components/atoms';

	const visibility = createAreaBasedStateVisibility(ComponentId.Highlight, {
		targetArea: 'right',
		proximityRadius: 150,
		areaOffset: 100,
		initialVisible: false,
		hideDelay: 2000,
		showComponent: false
	});

	export const { isDisplay: isVisible, showComponent } = visibility;
	export const updateVisibilityPosition = visibility.updatePosition;
	export const destroyVisibilityManager = visibility.destroy;
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { 
		currentHighlightIndex, 
		highlightsData,
	} from '$lib/stores/viewport/highlight';
	import { createHighlightLockMonitor, type HighlightLockMonitor } from '$lib/utils/monitor/component/highlight';

	let highlightMonitor: HighlightLockMonitor;

	onMount(async () => {
		highlightMonitor = createHighlightLockMonitor();
	});
	
	onDestroy(() => {
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
		class={`${CONTAINER_PRESETS.panel.blur} fixed right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col space-y-2 rounded-l-2xl border-white/20 p-3 py-2 shadow-lg py-4`}
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