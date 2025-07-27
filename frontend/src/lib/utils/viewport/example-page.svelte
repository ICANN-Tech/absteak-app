// Contoh implementasi di +page.svelte menggunakan viewport utilities

<script lang="ts">
  import { useCompleteViewportSystem } from '$lib/utils/viewport';
  import Indicator from '$lib/components/atoms/indicator/Index.svelte';

  // Definisi sections
  const sections = [
    { id: 'hero', path: '$lib/components/Hero.svelte' },
    { id: 'about-video', path: '$lib/components/organisms/section/video-highlight/Index.svelte' },
    { id: 'experience', path: '$lib/components/organisms/section/experience/Index.svelte' },
    { id: 'chef', path: '$lib/components/organisms/section/chef/Index.svelte' },
    { id: 'menu', path: '$lib/components/organisms/section/menu/Index.svelte' },
    { id: 'booking', path: '$lib/components/organisms/section/booking/Index.svelte' },
    { id: 'cs', path: '$lib/components/CustomPartiesSlider.svelte' },
    { id: 'footer', path: '$lib/components/Footer.svelte' }
  ];

  // Setup complete viewport system dengan satu function call
  const viewport = useCompleteViewportSystem({
    sections,
    scrollDelay: 800,
    indicatorHideDelay: 3000,
    mouseAreaPercentage: 0.8,
    onSectionChange: (index) => {
      console.log('Section changed to:', index);
    },
    onScrollAttempt: (direction) => {
      console.log('Scroll attempt:', direction);
    }
  });

  // Destructure untuk kemudahan akses
  const {
    currentSectionIndex,
    isTransitioning,
    indicatorVisible,
    loadedComponents,
    getComponent,
    jumpToSection,
    toggleScroll,
    isScrollEnabled
  } = viewport;
</script>

<!-- Global styles sama seperti sebelumnya -->
<style>
  :global(html, body) {
    overflow: hidden;
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
  }
  
  .section-container.active {
    z-index: 2;
  }
  
  :global(*) {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  :global(*::-webkit-scrollbar) {
    display: none;
  }
</style>

<main class="bg-primary-700/5 min-h-screen">
  {#each sections as section, index}
    <div 
      id="section-{index}" 
      class="section-container {index === $currentSectionIndex ? 'active' : ''}"
      style="opacity: {index === $currentSectionIndex ? '1' : '0'};"
    >
      {#if getComponent(index)}
        <svelte:component this={getComponent(index)} />
      {:else if index === $currentSectionIndex}
        <!-- Loading placeholder -->
        <div class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      {/if}
    </div>
  {/each}
  
  <!-- Indicator component -->
  <Indicator 
    {sections}
    currentSectionIndex={$currentSectionIndex}
    visible={$indicatorVisible}
    onSectionClick={jumpToSection}
  />

  <!-- Optional: Debug controls -->
  <!-- 
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <button on:click={toggleScroll} class="px-4 py-2 bg-blue-500 text-white rounded">
      Scroll: {isScrollEnabled() ? 'ON' : 'OFF'}
    </button>
  </div>
  -->
</main>