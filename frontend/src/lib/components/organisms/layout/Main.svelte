<script lang="ts">
	import { fly } from 'svelte/transition';
	import { autoHide } from '$lib/utils';
	import { createVisibilityHandler, getVisibilityStore } from '$lib/stores';
	import { navItems } from '$lib/const/navigation';

	import { LogoIcon } from '$lib/components/atoms';
	import { MenuNavigation } from '$lib/components/molecules/navigation';

	const isVisible = getVisibilityStore('header');
	const visibilityHandler = createVisibilityHandler('header');
</script>

<div
	use:autoHide={{
		onChange: visibilityHandler,
		delay: 2000
	}}
>
	{#if $isVisible}
		<header class="fixed left-0 top-0 z-20 w-full" transition:fly={{ y: -100, duration: 600 }}>
			<nav
				class="bg-primary-950/80 mx-auto flex max-w-4xl items-center justify-between rounded-b-3xl border-b border-white/20 px-4 py-4 shadow-lg backdrop-blur-lg"
			>
				<LogoIcon />
				<MenuNavigation items={navItems} />
			</nav>
		</header>
	{/if}
	
	<button
		on:click={() => visibilityHandler}
		class="fixed right-4 top-4 z-20 cursor-pointer p-2 text-white"
	>
		{$isVisible}
	</button>
</div>
