<script lang="ts">
	import { fly } from 'svelte/transition';
	import { autoHide } from '$lib/utils/index';
	import { createVisibilityHandler, getVisibilityStore } from '$lib/stores/index';
	import {LogoIcon} from '$lib/components/atoms';

	const isVisible = getVisibilityStore('header');
	const visibilityHandler = createVisibilityHandler('header');
	
	export let navItems = [
		{ name: 'Home', href: '#' },
		{ name: 'About', href: '#about' },
		{ name: 'Menu', href: '#menu' },
		{ name: 'Specials', href: '#' },
		{ name: 'Events', href: '#' },
		{ name: 'Chefs', href: '#' },
		{ name: 'Gallery', href: '#' },
		{ name: 'Contact', href: '#' }
	];
</script>

<div
	use:autoHide={{
		onChange: visibilityHandler,
		delay: 2000
	}}
>
<!-- Main navbar -->
{#if $isVisible}
	<header
		class="fixed top-0 left-0 z-20 w-full"
		transition:fly={{ y: -100, duration: 600 }}
	>
		<nav
			class="mx-auto flex max-w-4xl items-center justify-between rounded-b-3xl border-b border-white/20 bg-primary-950/80 px-4 py-4 shadow-lg backdrop-blur-lg"
		>
			<!-- Logo -->
			<LogoIcon />

			<!-- Nav links -->
			<ul class="hidden gap-6 font-medium text-white md:flex">
				{#each navItems as item}
					<li>
						<a href={item.href} class="hover:text-primary-light transition">{item.name}</a>
					</li>
				{/each}
			</ul>
		</nav>
	</header>
{/if}
</div>
