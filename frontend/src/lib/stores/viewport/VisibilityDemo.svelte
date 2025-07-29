<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { 
    ViewportVisibilityManager,
    createTimeBasedVisibility,
    createAreaBasedVisibility,
    createTriggerBasedVisibility,
    viewportVisibilityStore
  } from '$lib/stores/viewport/visibility.js';

  // Simple managers for demonstration
  let timeBasedManager: ViewportVisibilityManager;
  let areaBasedManager: ViewportVisibilityManager;
  let triggerManager: ViewportVisibilityManager;

  // Reactive variables for visibility states
  let timeBasedVisible = false;
  let areaBasedVisible = false;
  let triggerVisible = false;

  // Component references
  let areaBasedElement: HTMLElement;

  onMount(() => {
    // Initialize time-based visibility
    timeBasedManager = createTimeBasedVisibility('time-based-demo', {
      hideDelay: 1500,
      showDelay: 1000
    });

    // Initialize area-based visibility
    areaBasedManager = createAreaBasedVisibility('area-based-demo', { x: 200, y: 200 }, {
      proximityRadius: 150,
      hideDelay: 1000
    });

    // Initialize trigger-based visibility
    triggerManager = createTriggerBasedVisibility('trigger-demo');

    // Subscribe to visibility changes
    timeBasedManager.visible.subscribe(value => timeBasedVisible = value);
    areaBasedManager.visible.subscribe(value => areaBasedVisible = value);
    triggerManager.visible.subscribe(value => triggerVisible = value);

    // Update area-based position when element is available
    setTimeout(() => {
      if (areaBasedElement) {
        areaBasedManager.updatePositionFromElement(areaBasedElement);
      }
    }, 100);
  });

  onDestroy(() => {
    // Clean up all managers
    timeBasedManager?.destroy();
    areaBasedManager?.destroy();
    triggerManager?.destroy();
  });

  // Control functions
  function toggleTimeMode() {
    if (timeBasedManager) {
      let isTimeMode = false;
      timeBasedManager.modes.isTimeMode.subscribe(value => isTimeMode = value)();
      
      if (isTimeMode) {
        timeBasedManager.stopTimeCycle();
      } else {
        timeBasedManager.startTimeCycle();
      }
    }
  }

  function toggleAreaMode() {
    if (areaBasedManager) {
      let isAreaMode = false;
      areaBasedManager.modes.isAreaMode.subscribe(value => isAreaMode = value)();
      
      if (isAreaMode) {
        areaBasedManager.disableAreaMode();
      } else {
        areaBasedManager.enableAreaMode();
      }
    }
  }

  function applyQuickPreset() {
    timeBasedManager?.applyPreset('quickCycle');
  }

  function applySlowPreset() {
    timeBasedManager?.applyPreset('slowCycle');
  }
</script>

<div class="viewport-visibility-demo p-6 space-y-8">
  <h1 class="text-3xl font-bold mb-6">Viewport Visibility State Management Demo</h1>

  <!-- Global Controls -->
  <div class="bg-gray-100 p-4 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Global Controls</h2>
    <div class="flex gap-4">
      <button 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        on:click={viewportVisibilityStore.showAll}
      >
        Show All
      </button>
      <button 
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        on:click={viewportVisibilityStore.hideAll}
      >
        Hide All
      </button>
      <button 
        class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        on:click={viewportVisibilityStore.toggleAll}
      >
        Toggle All
      </button>
    </div>
    
    <div class="mt-4 text-sm">
      <p>Mouse Position: {$viewportVisibilityStore.mousePosition.x}, {$viewportVisibilityStore.mousePosition.y}</p>
      <p>Mouse Tracking: {$viewportVisibilityStore.isMouseTracking ? 'Active' : 'Inactive'}</p>
      <p>Active Components: {Array.from($viewportVisibilityStore.activeComponents).join(', ')}</p>
    </div>
  </div>

  <!-- Time-based Example -->
  <div class="bg-blue-50 p-4 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Time-based Visibility</h2>
    <div class="flex gap-4 mb-4">
      <button 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        on:click={toggleTimeMode}
      >
        Toggle Time Cycle
      </button>
      <button 
        class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        on:click={applyQuickPreset}
      >
        Quick Preset
      </button>
      <button 
        class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        on:click={applySlowPreset}
      >
        Slow Preset
      </button>
    </div>
    
    {#if timeBasedVisible}
      <div class="bg-blue-200 p-4 rounded border-2 border-blue-400">
        <p class="font-semibold">Time-based Component</p>
        <p>This component automatically shows and hides based on time intervals.</p>
        <p>Currently visible due to time-based cycling.</p>
      </div>
    {/if}
  </div>

  <!-- Area-based Example -->
  <div class="bg-yellow-50 p-4 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Area-based Visibility</h2>
    <div class="flex gap-4 mb-4">
      <button 
        class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        on:click={toggleAreaMode}
      >
        Toggle Area Mode
      </button>
      <button 
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        on:click={() => areaBasedManager?.updatePositionFromElement(areaBasedElement)}
      >
        Update Position
      </button>
    </div>
    
    <p class="text-sm mb-4">Move your mouse near this area to show the component:</p>
    
    <div 
      class="relative bg-yellow-100 border-2 border-yellow-400 rounded p-8 h-32"
      bind:this={areaBasedElement}
    >
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-yellow-700">Hover Area (150px radius)</span>
      </div>
      
      {#if areaBasedVisible}
        <div class="absolute top-2 right-2 bg-yellow-300 p-2 rounded border border-yellow-500">
          <p class="text-sm font-semibold">Area Component Visible!</p>
          <p class="text-xs">Mouse is within proximity area</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Trigger-based Example -->
  <div class="bg-purple-50 p-4 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Trigger-based Visibility</h2>
    <div class="flex gap-4 mb-4">
      <button 
        class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        on:click={() => triggerManager?.show()}
      >
        Show
      </button>
      <button 
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        on:click={() => triggerManager?.hide()}
      >
        Hide
      </button>
      <button 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        on:click={() => triggerManager?.toggle()}
      >
        Toggle
      </button>
    </div>
    
    {#if triggerVisible}
      <div class="bg-purple-200 p-4 rounded border-2 border-purple-400">
        <p class="font-semibold">Trigger-based Component</p>
        <p>This component only shows/hides when manually triggered.</p>
        <p>Currently visible due to manual trigger.</p>
      </div>
    {/if}
  </div>

  <!-- Usage Examples -->
  <div class="bg-green-50 p-4 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Usage Examples</h2>
    <div class="space-y-4 text-sm">
      <div>
        <h3 class="font-semibold">Time-based:</h3>
        <code class="bg-gray-100 p-2 rounded block">
          const manager = createTimeBasedVisibility('my-component', &#123; hideDelay: 2000, showDelay: 1000 &#125;);
        </code>
      </div>
      
      <div>
        <h3 class="font-semibold">Area-based:</h3>
        <code class="bg-gray-100 p-2 rounded block">
          const manager = createAreaBasedVisibility('my-component', &#123; x: 100, y: 100 &#125;, &#123; proximityRadius: 150 &#125;);
        </code>
      </div>
      
      <div>
        <h3 class="font-semibold">Trigger-based:</h3>
        <code class="bg-gray-100 p-2 rounded block">
          const manager = createTriggerBasedVisibility('my-component');
        </code>
      </div>
      
      <div>
        <h3 class="font-semibold">Using the hook:</h3>
        <code class="bg-gray-100 p-2 rounded block">
          const visibility = useViewportVisibility('my-component', &#123; triggerMode: true &#125;);
        </code>
      </div>
    </div>
  </div>
</div>

<style>
  .viewport-visibility-demo {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>