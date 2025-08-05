<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { viewportState } from '$lib/stores/viewport/viewport';
  import { sections } from '$lib/const/control/section';
  
  export let animation: 'fade' | 'fly' | 'slide' = 'fade';
  export let duration = 600;
  export let y = 50; // untuk fly
  
  let visible = false;
  let el: HTMLDivElement;
  let navigationDirection: 'down' | 'up' = 'down';
  let lastSectionIndex = 0;

  onMount(() => {
    // For viewport system, we need to detect when this component becomes visible
    // and determine direction based on section navigation
    
    const unsubscribe = viewportState.subscribe((state) => {
      if (state.section.currentSection) {
        // Calculate current section index from sections array
        const currentIndex = sections.findIndex(
          (section) => section.id === state.section.currentSection
        );
        
        if (currentIndex !== -1) {
          // Determine navigation direction based on section index change
          if (currentIndex > lastSectionIndex) {
            navigationDirection = 'down'; // Moving to next section
          } else if (currentIndex < lastSectionIndex) {
            navigationDirection = 'up'; // Moving to previous section
          }
          
          lastSectionIndex = currentIndex;
          
          // Debug logging for slide animation
          if (animation === 'slide') {
            console.log('AnimateOnScroll - Navigation Direction:', navigationDirection, 'Section Index:', currentIndex);
          }
        }
      }
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (el) observer.observe(el);
    
    return () => {
      observer.disconnect();
      unsubscribe();
    };
  });

  // Dynamic animation parameters based on navigation direction
  $: slideY = animation === 'slide' ? (navigationDirection === 'down' ? -80 : 80) : y;
  
  // Use appropriate y value based on animation type
  $: effectiveY = animation === 'slide' ? slideY : y;
</script>

<div bind:this={el}>
  {#if visible}
    {#if animation === 'fade'}
      <div transition:fade={{ duration }}>
        <slot />
      </div>
    {:else if animation === 'fly'}
      <div transition:fly={{ y: effectiveY, duration }}>
        <slot />
      </div>
    {:else if animation === 'slide'}
      <div transition:fly={{ y: effectiveY, duration }}>
        <slot />
      </div>
    {/if}
  {/if}
</div>