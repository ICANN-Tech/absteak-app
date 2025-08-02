<script context="module" lang="ts">
	import { createAreaBasedStateVisibility } from '$lib/stores/viewport/visibility';
	import { ComponentId } from '$lib/enums';

	const visibility = createAreaBasedStateVisibility(ComponentId.Navigation, {
		targetArea: 'top',
		proximityRadius: 150,
		areaOffset: 100,
		initialVisible: false,
		hideDelay: 2000,
		showComponent: false
	});

	export const { isVisible, showComponent } = visibility; // Renamed for clarity to avoid confusion with local let variables
	export const updateVisibilityPosition = visibility.updatePosition; // Exporting the method
	export const destroyVisibilityManager = visibility.destroy; // Exporting the method for onDestroy
</script>

<script lang="ts">
	import { fly } from 'svelte/transition';
	import { navItems } from '$lib/const/navigation';
	import { onDestroy } from 'svelte';
	import { LogoIcon, Navigation } from '$lib/components/atoms';

	onDestroy(() => destroyVisibilityManager());
</script>

{#if $showComponent && $isVisible}
	<header
		class="fixed left-0 top-0 z-20 w-full"
		transition:fly={{ y: -100, duration: 600 }}
	>
	<nav
	class="bg-primary-950/80 text-white mx-auto flex max-w-4xl items-center justify-between rounded-b-3xl border-b border-white/20 px-4 py-4 shadow-lg backdrop-blur-lg"
	>
	{$showComponent ? 't' : 'f'}
			<LogoIcon />
			<Navigation items={navItems} />
		</nav>
	</header>
{:else if $showComponent}
	<header
		class="fixed left-0 top-0 z-20 w-full"
		transition:fly={{ y: -100, duration: 600 }}
	>
		<nav
			class="bg-primary-950/80 mx-auto flex w-fit items-center justify-between rounded-b-3xl border-b border-white/20 px-4 py-4 shadow-lg backdrop-blur-lg"
		>
			<LogoIcon size="sm" />
		</nav>
	</header>
{/if}
