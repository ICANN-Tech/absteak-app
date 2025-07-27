<script lang="ts">
	import { autoHide, createVisibilityHandler } from '$lib/utils/autoHide';
	import { writable } from 'svelte/store';

	const isVisible = writable(true);
</script>

{#if $isVisible}
	<div
		class="fixed top-4 left-4 px-6 py-3 bg-black text-white rounded-lg shadow-lg transition-opacity duration-300"
		use:autoHide={{
			onChange: createVisibilityHandler(isVisible),
			threshold: 200, // default: 3000
			delay: 1500     // default: 2000ms
		}}
	>
		AutoHide Header
	</div>
{/if}

<main class="h-[3000px] bg-gray-100 p-12">
	<p>Scroll or move your mouse to see the auto-hide effect in action.</p>
</main>
