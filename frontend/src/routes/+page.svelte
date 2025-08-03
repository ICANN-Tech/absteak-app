<script lang="ts">
  import { viewportStore, viewportState } from '$lib/stores/viewport/viewport';
  import { useViewportSystem, useSectionMonitor } from '$lib/utils';
  import { onMount, onDestroy } from 'svelte';
  
  // Import sections and initialization function
  import { sections } from '$lib/const/control/section';
  import { initializeApp } from '$lib/utils/viewport/initialization';
  import { sectionsInitialized, isLoading, error, logInitializationState } from '$lib/stores/viewport/instantiate';
  import { highlightStore } from '$lib/stores/viewport/highlight';
  
  // Helper function to get current section index
  $: currentSectionIndex = sections.findIndex(section => section.id === $viewportState.section.currentSection);


  // Setup integrated viewport system dengan scroll handling
  const viewport = useViewportSystem({
    sections: sections.map(s => ({ id: s.id, name: s.name, component: s.component, path: '' })),
    scrollDelay: 800,
    enableScrollListener: true,
    scrollConfig: {
      enabled: true,
      delay: 800,
      smoothBehavior: true,
      preventNativeScroll: true
    },
    onSectionChange: (index) => {
      console.log('Section changed to:', index);
      
      // Handle highlight component based on section
      const section = sections[index];
      if (section) {
        if (section.id === 'footer') {
          // For footer, let the footer section monitor handle hiding
          // Don't sync highlight to avoid conflicts
        } else {
          // For non-footer sections, sync highlight
          highlightStore.syncWithSectionChange(section.id);
        }
      }
    },
    onScrollAttempt: (direction) => {
      console.log('Scroll attempt:', direction);
    },
    onNavigate: (fromIndex, toIndex) => {
      console.log(`Navigating from section ${fromIndex} to ${toIndex}`);
    }
  });

  const { start, stop: stopSectionMonitor, videoHighlight } = useSectionMonitor();
  
  onMount(async () => {
    try {
      // Use unified initialization - handles component visibility and sections in correct order
      await initializeApp();
      
      // Small delay to ensure initialization settings are properly applied
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Start section monitor (which also starts video highlight monitor internally)
      start();
      
      // Log initialization state in development
      if (import.meta.env.DEV) {
        logInitializationState();
      }
      
      console.log('Viewport system initialized with integrated scrolling');
    } catch (err) {
      console.error('Failed to initialize application:', err);
    }
  });

  onDestroy(() => {
    // Cleanup
    stopSectionMonitor();
    viewport.stopScrollListener();
  });
</script>

<main class="bg-primary-700/5 min-h-screen">
  {#if $sectionsInitialized}
    {#each sections as section, index}
      <div 
        id={section.id} 
        class="section-container {index === currentSectionIndex ? 'active' : ''}"
        style="opacity: {index === currentSectionIndex ? '1' : '0'};"
      >
        {#if section.component}
          <svelte:component this={section.component} />
        {/if}
      </div>
    {/each}

    <!-- Debug Controls (hanya untuk development) -->
    {#if import.meta.env.DEV}
      <div class="debug-controls">
        <div class="debug-info">
          <span>Section: {currentSectionIndex + 1}/{sections.length}</span>
          <span>Scroll: {viewport.scrolling.isEnabled() ? 'ON' : 'OFF'}</span>
          <span>Transitioning: {$viewportState.section.isNavigating ? 'YES' : 'NO'}</span>
        </div>
        <div class="debug-buttons">
          <button on:click={() => viewport.scrolling.toggle()}>
            {viewport.scrolling.isEnabled() ? 'Disable' : 'Enable'} Scroll
          </button>
          <button on:click={() => viewport.previousSection()}>← Prev</button>
          <button on:click={() => viewport.nextSection()}>Next →</button>
        </div>
      </div>
    {/if}
  {:else}
    <div class="loading-container">
      {#if $error}
        <div class="error-state">
          <div class="error-icon">❌</div>
          <h3>Initialization Error</h3>
          <p>{$error}</p>
          <button on:click={() => window.location.reload()} class="retry-button">
            Retry
          </button>
        </div>
      {:else if $isLoading}
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading sections...</p>
          {#if import.meta.env.DEV}
            <div class="loading-details">
              <small>Sections: {$sectionsInitialized ? '✅' : '⏳'}</small>
            </div>
          {/if}
        </div>
      {:else}
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Initializing...</p>
        </div>
      {/if}
    </div>
  {/if}
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
  
  .loading-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.1);
    z-index: 999;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading-container p {
    color: #666;
    font-size: 16px;
    margin: 0;
  }

  /* Loading State */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .loading-details {
    margin-top: 12px;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    font-family: monospace;
  }

  .loading-details small {
    color: #888;
    font-size: 12px;
  }

  /* Error State */
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 400px;
    padding: 24px;
  }

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .error-state h3 {
    color: #e74c3c;
    margin: 0 0 12px 0;
    font-size: 20px;
    font-weight: 600;
  }

  .error-state p {
    color: #666;
    margin: 0 0 20px 0;
    line-height: 1.5;
  }

  .retry-button {
    background: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s;
  }

  .retry-button:hover {
    background: #2980b9;
  }

  .retry-button:active {
    background: #1f5f8b;
  }

  /* Debug Controls */
  .debug-controls {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px;
    border-radius: 8px;
    z-index: 9999;
    font-family: monospace;
    font-size: 12px;
    min-width: 200px;
  }

  .debug-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;
  }

  .debug-info span {
    padding: 2px 0;
  }

  .debug-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .debug-buttons button {
    background: #3498db;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 10px;
    transition: background 0.2s;
  }

  .debug-buttons button:hover {
    background: #2980b9;
  }

  .debug-buttons button:active {
    background: #1f5f8b;
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
