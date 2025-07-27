<script lang="ts">
  import { viewportStore } from '$lib/stores/viewport';
  import { useViewportSystem } from '$lib/utils/viewport';
  import { onMount } from 'svelte';
  
  // Import anchors langsung dari anchors.ts
  // import { anchors } from "$lib/const/anchors";
  import { sections } from '$lib/const/control/section';
  import Menu from '$lib/components/organisms/section/menu/Index.svelte';

  // Override the Menu component to avoid circular dependency
  // const sections = anchors.map(anchor => {
  //   if (anchor.id === 'menu') {
  //     return { ...anchor, component: Menu };
  //   }
  //   return anchor;
  // });

  // Setup viewport system untuk scroll handling
  const viewport = useViewportSystem({
    sections: sections.map(s => ({ id: s.id, path: '' })),
    scrollDelay: 800,
    onSectionChange: (index) => {
      console.log('Section changed to:', index);
    },
    onScrollAttempt: (direction) => {
      console.log('Scroll attempt:', direction);
    }
  });

  onMount(() => {
    // Initialize viewport system
    viewport;
  });
</script>

<main class="bg-primary-700/5 min-h-screen">
  {#each sections as section, index}
    <div 
      id="section-{index}" 
      class="section-container {index === $viewportStore.currentSectionIndex ? 'active' : ''}"
      style="opacity: {index === $viewportStore.currentSectionIndex ? '1' : '0'};"
    >
      <svelte:component this={section.component} />
    </div>
  {/each}
</main>

<!-- Hide scrollbar globally -->
<style>
  :global(html, body) {
    overflow-x: hidden;
    height: 100vh;
    margin: 0;
    padding: 0;
  }
  
  .section-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    transition: opacity 0.3s ease-in-out;
    z-index: 1;
    overflow-y: auto;
  }
  
  .section-container.active {
    z-index: 2;
  }
  
  /* Hide scrollbars but allow scrolling */
  :global(*) {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
  }
  
  :global(*::-webkit-scrollbar) {
    display: none; /* WebKit */
  }
</style>
