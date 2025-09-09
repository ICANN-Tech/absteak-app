<script lang="ts">
	import { fly } from 'svelte/transition';
	import { ChevronUpOutline } from 'flowbite-svelte-icons';
	import { jumpToSection } from '@Utils/Guest/Viewport/Section';
	import { SectionEnum } from '@Enums/Guest/Section';
	import {
		createVisibilityState,
		ComponentId,
	} from '@Stores/Guest/Viewport/Visibility';

	// Use global visibility store for consistent state management
	const { isVisible: shouldShow } = createVisibilityState(ComponentId.BackToTop);
	
	/**
	 * Handles smooth scrolling to hero section
	 * Uses viewport navigator for consistent behavior
	 */
	function handleScrollToTop(): void {
		jumpToSection(SectionEnum.Hero);
	}
</script>

{#if $shouldShow}
	<nav
		class="w-1/8 hover:scale-130 fixed bottom-0 left-1/2 z-20 -translate-x-1/2 transition-all duration-300"
		transition:fly={{ y: 100, duration: 600 }}
	>
		<div
			class={`flex items-center justify-center overflow-hidden rounded-t-2xl border border-white/20 shadow-lg backdrop-blur-lg border border-b-0 border-yellow-600 hover:bg-yellow-600 group-hover:text-white`}
		>
			<button
				on:click={handleScrollToTop}
				class="w-full h-12 flex items-center text-center justify-center text-lg text-white transition-all duration-300 hover:bg-white/20"
				title="Back to Top"
				aria-label="Scroll back to top"
			>
			<ChevronUpOutline class="h-6 w-6" />
			</button>
		</div>
	</nav>
{/if}