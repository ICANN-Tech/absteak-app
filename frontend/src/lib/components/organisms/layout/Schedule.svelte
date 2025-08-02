<script context="module" lang="ts">
	import { createAreaBasedStateVisibility } from '$lib/stores/viewport/visibility';
	import { ComponentId } from '$lib/enums';

	const visibility = createAreaBasedStateVisibility(ComponentId.Schedule, {
		proximityRadius: 150,
		areaOffset: 100,
		hideDelay: 2000
	});

	export const { isVisible, showComponent } = visibility;
	export const updateVisibilityPosition = visibility.updatePosition;
	export const destroyVisibilityManager = visibility.destroy;
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { ChevronUpOutline } from 'flowbite-svelte-icons';
    import { Operation } from '$lib/components/atoms';
	import { CONTAINER_PRESETS } from '$lib/const';

	onDestroy(() => destroyVisibilityManager());
</script>

{#if $showComponent && $isVisible}
	<nav
		class={`${CONTAINER_PRESETS.panel.blur} fixed bottom-0 left-1/2 z-20 mx-auto flex max-w-5xl -translate-x-1/2 flex-col gap-2 rounded-t-3xl rounded-b-none border-t border-white/20 px-4 py-4 text-white`}
		transition:fly={{ y: 100, duration: 600 }}
		on:mouseleave={() => setTimeout(() => visibility.hide(), 1500)}
	>
		<div class="flex flex-wrap items-center justify-center gap-20 p-4">
            <Operation title="Weekdays" subtitle="09.00 – 17.00" />
            <Operation title="Weekends" subtitle="10.00 – 16.00" />
            <Operation title="Sunday" subtitle="Closed" />
		</div>
	</nav>
{:else if $showComponent}
	<div
		class="fixed bottom-2 left-1/2 z-20 -translate-x-1/2"
		transition:fly={{ y: 100, duration: 600 }}
	>
		<div
			class="bg-primary-950/80 flex items-center justify-center overflow-hidden rounded-2xl border border-white/20 shadow-lg backdrop-blur-lg"
		>
			<button
				on:click={visibility.show}
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
