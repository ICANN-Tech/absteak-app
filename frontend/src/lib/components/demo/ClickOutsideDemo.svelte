<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createTriggerBasedVisibility } from '$lib/stores/viewport/visibility.js';

	// Create visibility manager
	const visibility = createTriggerBasedVisibility('hover-freeze-demo', {
		initialVisible: false
	});

	let isVisible = false;
	let demoElement: HTMLElement;

	onMount(() => {
		const unsubscribe = visibility.visible.subscribe((value) => {
			isVisible = value;
		});

		return unsubscribe;
	});

	onDestroy(() => {
		visibility.destroy();
	});

	function toggleDemo() {
		visibility.toggle();
	}
</script>

<div class="p-8 space-y-4">
	<h2 class="text-2xl font-bold">Hover Freeze Demo</h2>
	<p class="text-gray-600">
		Click the button to show the panel. The panel will stay visible while your mouse is over it, and automatically hide when you move your mouse away.
	</p>
	
	<button 
		on:click={toggleDemo}
		class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
	>
		Toggle Panel
	</button>

	{#if isVisible}
		<div 
			bind:this={demoElement}
			class="mt-4 p-6 bg-white border-2 border-blue-300 rounded-lg shadow-lg max-w-md"
		>
			<h3 class="text-lg font-semibold mb-2">Demo Panel</h3>
			<p class="text-gray-700 mb-4">
				This panel will stay visible while your mouse is over it and hide when you move away!
			</p>
			<button 
				on:click={() => visibility.hide()}
				class="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
			>
				Close
			</button>
		</div>
	{/if}
</div>