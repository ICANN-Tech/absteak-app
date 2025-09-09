<script lang="ts">
	import type { NavigationItem } from '../../../Const/Guest/UI/Navigation';

	export let items: NavigationItem[] = [];
	export let className: string = '';
</script>

<nav class="flex items-center space-x-6 {className}">
	{#each items as item}
		<a 
			href={item.href} 
			class="text-white hover:text-white/80 transition-colors duration-200 font-medium"
			class:external={item.external}
		>
			{item.name}
		</a>
	{/each}
</nav>

<style>
	.external {
		/* Add external link styling if needed */
	}
</style>