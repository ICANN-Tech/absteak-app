<script lang="ts">
	import { useViewportNavigator } from '$lib/utils/viewport/navigator';
	
	export let items: { id: string; name: string }[] = [];
	
	const navigator = useViewportNavigator();
	
	function handleNavigation(sectionId: string) {
		navigator.jumpToSectionById(sectionId);
	}
</script>

<ul class="hidden gap-6 font-medium text-white md:flex">
	{#each items as item}
		<li>
			<button 
				type="button"
				class="hover:text-primary-light transition cursor-pointer"
				on:click={() => handleNavigation(item.id)}
			>
				{item.name}
			</button>
		</li>
	{/each}
</ul>
