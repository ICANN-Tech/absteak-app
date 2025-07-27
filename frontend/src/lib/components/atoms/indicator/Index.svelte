<script lang="ts">
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { Tooltip } from "flowbite-svelte";
  import { onMount, onDestroy } from 'svelte';
  import { createIndicatorAutoHide } from '$lib/utils/autoPositionHide';

  export let sections: Array<{ id: string; path: string }> = [];
  export let currentSectionIndex: number = 0;
  export let visible: boolean = true;
  export let onSectionClick: (index: number) => void = () => {};
  export let useAutoHide: boolean = false;
  export let autoHideConfig: Parameters<typeof createIndicatorAutoHide>[0] = {};

  // Auto-hide functionality
  let autoHide: ReturnType<typeof createIndicatorAutoHide> | null = null;
  let autoVisible = true;

  // Determine final visibility
  $: finalVisible = useAutoHide ? autoVisible : visible;

  const dotColorClass = (index: number) => {
    if ([0, 2, 5, 6].includes(currentSectionIndex)) {
      return index === currentSectionIndex
        ? 'bg-white'
        : 'bg-white/30';
    }

    return index === currentSectionIndex
      ? 'bg-primary-950'
      : 'bg-primary-950/30';
  };

  function handleSectionClick(index: number) {
    onSectionClick(index);
    // Show indicator when user interacts
    if (autoHide) {
      autoHide.startHideTimer();
    }
  }

  onMount(() => {
    if (useAutoHide) {
      autoHide = createIndicatorAutoHide(autoHideConfig);
      // Subscribe to auto-hide visibility
      const unsubscribe = autoHide.visible.subscribe(value => {
        autoVisible = value;
      });
      
      return unsubscribe;
    }
  });

  onDestroy(() => {
    if (autoHide) {
      autoHide.destroy();
    }
  });
</script>

<!-- Section indicator dots dengan animasi Svelte -->
{#if finalVisible}
  <div 
    class="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-2"
    in:fly={{ x: 20, duration: 400, easing: quintOut }}
    out:fly={{ x: 20, duration: 300, easing: quintOut }}
  >
    {#each sections as section, index}
      <button 
        class="w-2 h-2 rounded-full transition-all duration-300 hover:scale-250 hover:bg-primary-400 {dotColorClass(index)}"
        title={section.id}
        aria-label={`Go to section ${index + 1}`}
        on:click={() => handleSectionClick(index)}
      ></button>
      <Tooltip placement="left" class="py-2 px-4 bg-black/80 backdrop-blur-xl rounded-lg">
        {section.id}
      </Tooltip>
    {/each}
  </div>
{/if}