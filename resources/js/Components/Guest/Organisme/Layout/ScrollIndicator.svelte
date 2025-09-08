<script lang="ts">
  import { ComponentId, createVisibilityState } from '@Stores/Guest/Viewport/Index';
  import ScrollMouseIcon from '@Components/Global/Atoms/Icons/ScrollMouse.svelte';
  import { fade } from 'svelte/transition';

  const visibility = createVisibilityState(ComponentId.ScrollIndicator);
  const { isDisplay } = visibility;
</script>

{#if $isDisplay}
  <div 
    class="scroll-indicator"
    transition:fade={{ duration: 300 }}
  >
		<div class="flex items-center justify-center overflow-hidden">
			<div
				class="flex h-14 w-14 animate-pulse items-center justify-center text-lg text-white transition-all duration-300"
				aria-label="Scroll to next section"
			>
				<ScrollMouseIcon size="sm" color="warning" />
			</div>
		</div>
  </div>
{/if}

<style>
  .scroll-indicator {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    pointer-events: none;
  }
</style>
