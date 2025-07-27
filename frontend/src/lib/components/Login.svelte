<script lang="ts">
	import { ArrowRightToBracketOutline } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	import {createVisibilityHandler, getVisibilityStore} from '$lib/stores/index'
	import { autoHide } from '$lib/utils';
	import { writable } from 'svelte/store';

	const isVisible = getVisibilityStore('login');
</script>

{#if $isVisible}
	<header
		use:autoHide={{
			onChange: createVisibilityHandler('login'),
			delay: 2000
		}}
		class="fixed top-0 right-4 z-20"
		transition:fly={{ y: -100, duration: 600 }}
	>
		<nav
			class="mx-auto flex max-w-lg items-center justify-between rounded-b-3xl border-b border-white/20 bg-primary-950/80 px-4 py-4 shadow-lg backdrop-blur-lg"
		>
			<a href="#reservation" class="p-2 px-4">
				<ArrowRightToBracketOutline color="white" />
			</a>
		</nav>
	</header>
{/if}
