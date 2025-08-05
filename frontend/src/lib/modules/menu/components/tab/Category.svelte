<script context="module" lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';
</script>

<script lang="ts">
	import { categoryInterface } from '../../services/interface.service';
	import { activeCategory, menuCategories } from '../../stores/interface';

    const { selectCategory } = categoryInterface;
</script>

<div class={`${CONTAINER_SECTION.menu.category.base}`}>
	{#each $menuCategories as category, index}
		<button
			class={`${CONTAINER_SECTION.menu.category.tab} transition-all duration-300 ${
				$activeCategory === index
					? 'scale-105 bg-amber-400 text-gray-900 shadow-lg shadow-amber-400/50'
					: 'border border-gray-600/50 bg-gray-900/80 text-white hover:scale-105 hover:border-amber-400/50 hover:bg-gray-800/90'
			}`}
			on:click={() => selectCategory(index)}
		>
			{category.category}
		</button>
	{/each}
</div>
