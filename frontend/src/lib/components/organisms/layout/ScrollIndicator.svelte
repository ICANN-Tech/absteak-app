<script context="module" lang="ts">
	import { ComponentId } from '$lib/enums';
	import { createStateVisibility } from '$lib/stores/viewport/visibility';
	import { ScrollMouseIcon } from '$lib/components/atoms';

	const visibility = createStateVisibility(ComponentId.ScrollIndicator, {
		hideDelay: 1500,
		initialVisible: false
	});

	const { isDisplay } = visibility;
	const destroyVisibilityManager = visibility.destroy;
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';

	onDestroy(() => destroyVisibilityManager());
</script>

{#if $isDisplay}
	<nav
		class={`fixed bottom-2 left-1/2 z-20 -translate-x-1/2`}
		transition:fly={{ y: 100, duration: 600 }}
	>
		<div class="flex items-center justify-center overflow-hidden">
			<div
				class="flex h-14 w-14 animate-pulse items-center justify-center text-lg text-white transition-all duration-300"
				aria-label="Scroll to next section"
			>
				<ScrollMouseIcon size="sm" color="warning" />
			</div>
		</div>
	</nav>
{/if}
