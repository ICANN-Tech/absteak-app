<script lang="ts">
	import { fly } from 'svelte/transition';
	import { navItems } from '$lib/const/navigation';
	import { onDestroy } from 'svelte';

	import { LogoIcon } from '$lib/components/atoms';
	import MenuNavigation from '$lib/components/atoms/navigation/Index.svelte';
	import { createAreaBasedStateVisibility } from '$lib/stores/viewport/visibility';

	// Create area-based visibility for navigation header
	const visibility = createAreaBasedStateVisibility('navigation', {
		targetArea: 'top',
		proximityRadius: 150,
		areaOffset: 100,
		initialVisible: false,
		hideDelay: 2000,
		showComponent: true,
	});

	const { isVisible, showComponent, updatePosition } = visibility;

	let headerElement: HTMLElement;

	// Update position whenever headerElement changes
	$: if (headerElement) {
		updatePosition(headerElement);
	}

	onDestroy(() => {
		visibility.destroy();
	});
</script>

<!-- Only show header if showComponent is not false -->
{#if $showComponent !== false && $isVisible}
	<header
		bind:this={headerElement}
		class="fixed left-0 top-0 z-20 w-full"
		transition:fly={{ y: -100, duration: 600 }}
	>
		<nav
			class="bg-primary-950/80 mx-auto flex max-w-4xl items-center justify-between rounded-b-3xl border-b border-white/20 px-4 py-4 shadow-lg backdrop-blur-lg"
		>
			<LogoIcon />
			<MenuNavigation items={navItems} />
		</nav>
	</header>
{:else if $showComponent}
	<header
		bind:this={headerElement}
		class="fixed left-0 top-0 z-20 w-full"
		transition:fly={{ y: -100, duration: 600 }}
	>
		<nav
			class="bg-primary-950/80 mx-auto flex w-fit items-center justify-between rounded-b-3xl border-b border-white/20 px-4 py-4 shadow-lg backdrop-blur-lg"
		>
			<LogoIcon />
		</nav>
	</header>
{/if}
