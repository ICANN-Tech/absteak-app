<script lang="ts">
  import { 
    createTimeBasedPosition,
    createAreaBasedPosition,
    createTriggerBasedPosition,
    ViewportPositionPresets,
    getElementCenter,
    type ViewportPositionState
  } from '$lib/utils/viewport/visibility';
  import { onMount } from 'svelte';

  let timeControl: ViewportPositionState | null = null;
  let areaControl: ViewportPositionState | null = null;
  let triggerControl: ViewportPositionState | null = null;
  let targetElement: HTMLElement;

  // Reactive variables for visibility
  let timeVisible = false;
  let areaVisible = false;
  let triggerVisible = false;

  onMount(() => {
    // Time-based demo
    timeControl = createTimeBasedPosition({
      ...ViewportPositionPresets.standardCycle,
      initialVisible: false
    });

    // Subscribe to visibility changes
    timeControl.visible.subscribe(value => {
      timeVisible = value;
    });

    // Area-based demo (center of screen)
    areaControl = createAreaBasedPosition(
      { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      {
        ...ViewportPositionPresets.mediumProximity,
        hideDelay: 1000
      }
    );

    areaControl.visible.subscribe(value => {
      areaVisible = value;
    });

    // Trigger-based demo
    triggerControl = createTriggerBasedPosition();

    triggerControl.visible.subscribe(value => {
      triggerVisible = value;
    });

    return () => {
      timeControl?.destroy();
      areaControl?.destroy();
      triggerControl?.destroy();
    };
  });

  function updateAreaPosition() {
    if (targetElement && areaControl) {
      const pos = getElementCenter(targetElement);
      areaControl.updateComponentPosition(pos.x, pos.y);
    }
  }
</script>

<div class="demo-container">
  <h1>Viewport Position Utility Demo</h1>

  <!-- Time-based Demo -->
  <section class="demo-section">
    <h2>1. Time-Based Auto Show/Hide</h2>
    <p>Komponen akan muncul dan hilang otomatis setiap 2 detik</p>
    
    {#if timeVisible}
      <div class="demo-box time-demo">
        <h3>⏰ Time-based Component</h3>
        <p>Saya muncul dan hilang otomatis!</p>
      </div>
    {/if}

    <div class="controls">
      <button on:click={() => timeControl?.startTimeCycle()}>Start Cycle</button>
      <button on:click={() => timeControl?.stopTimeCycle()}>Stop Cycle</button>
      <button on:click={() => timeControl?.show()}>Force Show</button>
      <button on:click={() => timeControl?.hide()}>Force Hide</button>
    </div>
  </section>

  <!-- Area-based Demo -->
  <section class="demo-section">
    <h2>2. Area-Based Auto Show/Hide</h2>
    <p>Gerakkan cursor ke tengah layar untuk melihat komponen muncul</p>
    
    {#if areaVisible}
      <div class="demo-box area-demo">
        <h3>📍 Area-based Component</h3>
        <p>Saya muncul saat cursor dekat!</p>
        <p>Radius: 100px dari center</p>
      </div>
    {/if}

    <div bind:this={targetElement} class="target-area">
      <span>🎯 Target Area (Center)</span>
    </div>

    <div class="controls">
      <button on:click={() => areaControl?.enableAreaMode()}>Enable Area Mode</button>
      <button on:click={() => areaControl?.disableAreaMode()}>Disable Area Mode</button>
      <button on:click={updateAreaPosition}>Update to Element Position</button>
    </div>
  </section>

  <!-- Trigger-based Demo -->
  <section class="demo-section">
    <h2>3. Trigger-Based Show/Hide</h2>
    <p>Komponen hanya muncul/hilang saat di-trigger manual</p>
    
    {#if triggerVisible}
      <div class="demo-box trigger-demo">
        <h3>🎮 Trigger-based Component</h3>
        <p>Saya dikontrol manual!</p>
        <button on:click={() => triggerControl?.hide()}>Close Me</button>
      </div>
    {/if}

    <div class="controls">
      <button on:click={() => triggerControl?.show()}>Show</button>
      <button on:click={() => triggerControl?.hide()}>Hide</button>
      <button on:click={() => triggerControl?.toggle()}>Toggle</button>
    </div>
  </section>

  <!-- Status Display -->
  <section class="status-section">
    <h2>Status</h2>
    <div class="status-grid">
      <div class="status-item">
        <strong>Time Mode:</strong> 
        <span class="status-value">
          {timeVisible ? 'Visible' : 'Hidden'}
        </span>
      </div>
      
      <div class="status-item">
        <strong>Area Mode:</strong> 
        <span class="status-value">
          {areaVisible ? 'Visible' : 'Hidden'}
        </span>
      </div>
      
      <div class="status-item">
        <strong>Trigger Mode:</strong> 
        <span class="status-value">
          {triggerVisible ? 'Visible' : 'Hidden'}
        </span>
      </div>
    </div>
  </section>
</div>

<style>
  .demo-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    font-family: system-ui, sans-serif;
  }

  .demo-section {
    margin-bottom: 40px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fafafa;
  }

  .demo-box {
    position: fixed;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    min-width: 250px;
  }

  .time-demo {
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .area-demo {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
  }

  .trigger-demo {
    bottom: 100px;
    left: 20px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
  }

  .target-area {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border: 2px dashed #ccc;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.8);
    font-weight: bold;
    z-index: 999;
  }

  .controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 15px;
  }

  .controls button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .controls button:hover {
    background: #f0f0f0;
    border-color: #999;
  }

  .status-section {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    margin-top: 15px;
  }

  .status-item {
    padding: 10px;
    background: white;
    border-radius: 4px;
    border: 1px solid #e9ecef;
  }

  .status-value {
    color: #007bff;
    font-weight: bold;
  }

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }

  h2 {
    color: #555;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
  }

  h3 {
    margin-top: 0;
  }

  p {
    color: #666;
    line-height: 1.5;
  }
</style>