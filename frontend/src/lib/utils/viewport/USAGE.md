# Viewport Position Utility - Petunjuk Penggunaan

Utility ini menyediakan berbagai mode auto show/hide untuk komponen berdasarkan waktu, area proximity, dan trigger manual.

## Import

```typescript
import { 
  createViewportPosition,
  createTimeBasedPosition,
  createAreaBasedPosition,
  createTriggerBasedPosition,
  ViewportPositionPresets,
  getElementPosition,
  getElementCenter
} from '$lib/utils/viewport/position';
```

## Mode Penggunaan

### 1. Time-Based Auto Show/Hide

Komponen akan otomatis show/hide berdasarkan interval waktu yang ditentukan.

```typescript
// Menggunakan helper function
const timePosition = createTimeBasedPosition({
  hideDelay: 3000,  // Hide setelah 3 detik
  showDelay: 2000,  // Show setelah 2 detik
  initialVisible: true
});

// Atau menggunakan function utama
const timePosition = createViewportPosition({
  timeBasedMode: true,
  autoStart: true,
  hideDelay: 3000,
  showDelay: 2000
});
```

**Contoh penggunaan di Svelte:**

```svelte
<script>
  import { createTimeBasedPosition } from '$lib/utils/viewport/position';
  import { onMount } from 'svelte';

  let positionControl;

  onMount(() => {
    positionControl = createTimeBasedPosition({
      hideDelay: 2000,
      showDelay: 2000,
      initialVisible: false
    });

    return () => {
      positionControl.destroy();
    };
  });
</script>

{#if $positionControl?.visible}
  <div class="notification">
    Notifikasi yang muncul otomatis setiap 2 detik!
  </div>
{/if}

<button on:click={() => positionControl?.stopTimeCycle()}>
  Stop Auto Cycle
</button>
<button on:click={() => positionControl?.startTimeCycle()}>
  Start Auto Cycle
</button>
```

### 2. Area-Based Auto Show/Hide

Komponen akan show ketika cursor mendekati area tertentu dan hide ketika menjauh.

```typescript
// Posisi komponen (center point)
const componentPos = { x: 100, y: 200 };

const areaPosition = createAreaBasedPosition(componentPos, {
  proximityRadius: 150,  // Radius 150px
  hideDelay: 1000       // Hide setelah 1 detik keluar dari area
});

// Atau menggunakan helper untuk mendapatkan posisi element
const element = document.getElementById('myComponent');
const elementPos = getElementCenter(element);
const areaPosition = createAreaBasedPosition(elementPos);
```

**Contoh penggunaan di Svelte:**

```svelte
<script>
  import { createAreaBasedPosition, getElementCenter } from '$lib/utils/viewport/position';
  import { onMount } from 'svelte';

  let componentElement;
  let positionControl;

  onMount(() => {
    if (componentElement) {
      const position = getElementCenter(componentElement);
      positionControl = createAreaBasedPosition(position, {
        proximityRadius: 100,
        hideDelay: 500
      });
    }

    return () => {
      positionControl?.destroy();
    };
  });

  // Update posisi jika komponen bergerak
  function updatePosition() {
    if (componentElement && positionControl) {
      const newPos = getElementCenter(componentElement);
      positionControl.updateComponentPosition(newPos.x, newPos.y);
    }
  }
</script>

<div bind:this={componentElement} class="target-component">
  {#if $positionControl?.visible}
    <div class="tooltip">
      Tooltip muncul saat cursor dekat!
    </div>
  {/if}
  
  <button>Hover area di sekitar sini</button>
</div>

<button on:click={updatePosition}>Update Position</button>
```

### 3. Trigger-Based Show/Hide

Komponen hanya show/hide ketika di-trigger secara manual.

```typescript
const triggerPosition = createTriggerBasedPosition({
  initialVisible: false
});

// Manual control
triggerPosition.show();    // Show komponen
triggerPosition.hide();    // Hide komponen
triggerPosition.toggle();  // Toggle visibility
```

**Contoh penggunaan di Svelte:**

```svelte
<script>
  import { createTriggerBasedPosition } from '$lib/utils/viewport/position';
  import { onMount } from 'svelte';

  let positionControl;

  onMount(() => {
    positionControl = createTriggerBasedPosition();

    return () => {
      positionControl.destroy();
    };
  });
</script>

{#if $positionControl?.visible}
  <div class="modal">
    <h2>Modal Dialog</h2>
    <p>Konten modal di sini...</p>
    <button on:click={() => positionControl.hide()}>Close</button>
  </div>
{/if}

<button on:click={() => positionControl.show()}>Show Modal</button>
<button on:click={() => positionControl.toggle()}>Toggle Modal</button>
```

## Kombinasi Mode

Anda dapat mengkombinasikan beberapa mode sekaligus:

```typescript
const combinedPosition = createViewportPosition({
  timeBasedMode: true,
  areaBasedMode: true,
  componentPosition: { x: 200, y: 300 },
  proximityRadius: 100,
  hideDelay: 2000,
  showDelay: 1500,
  autoStart: false  // Manual start
});

// Aktifkan mode yang diinginkan
combinedPosition.startTimeCycle();  // Aktifkan time-based
combinedPosition.enableAreaMode();  // Aktifkan area-based
```

## Presets

Gunakan preset yang sudah disediakan untuk konfigurasi umum:

```typescript
import { ViewportPositionPresets } from '$lib/utils/viewport/position';

// Quick cycling (1 detik show/hide)
const quickPosition = createTimeBasedPosition(ViewportPositionPresets.quickCycle);

// Large proximity area (200px radius)
const wideAreaPosition = createAreaBasedPosition(
  { x: 100, y: 100 }, 
  ViewportPositionPresets.wideProximity
);

// Instant show/hide (tanpa delay)
const instantPosition = createTriggerBasedPosition(ViewportPositionPresets.instant);
```

## API Reference

### ViewportPositionState Methods

- `show()` - Tampilkan komponen langsung
- `hide()` - Sembunyikan komponen langsung  
- `toggle()` - Toggle visibility
- `startTimeCycle()` - Mulai time-based cycling
- `stopTimeCycle()` - Hentikan time-based cycling
- `enableAreaMode()` - Aktifkan area-based detection
- `disableAreaMode()` - Nonaktifkan area-based detection
- `updateComponentPosition(x, y)` - Update posisi komponen untuk area detection
- `setProximityRadius(radius)` - Set radius proximity area
- `destroy()` - Cleanup semua event listeners dan timers

### Stores

- `visible` - Writable store untuk visibility state
- `isTimeMode` - Writable store untuk status time mode
- `isAreaMode` - Writable store untuk status area mode  
- `isTriggerMode` - Writable store untuk status trigger mode

## Tips Penggunaan

1. **Selalu panggil `destroy()`** saat komponen di-unmount untuk cleanup
2. **Update posisi komponen** jika komponen bergerak menggunakan `updateComponentPosition()`
3. **Gunakan preset** untuk konfigurasi yang umum digunakan
4. **Kombinasikan mode** sesuai kebutuhan aplikasi
5. **Monitor performance** jika menggunakan area-based mode pada banyak komponen

## Contoh Lengkap

```svelte
<script>
  import { 
    createViewportPosition, 
    getElementCenter,
    ViewportPositionPresets 
  } from '$lib/utils/viewport/position';
  import { onMount } from 'svelte';

  let floatingElement;
  let positionControl;

  onMount(() => {
    positionControl = createViewportPosition({
      ...ViewportPositionPresets.standardCycle,
      areaBasedMode: true,
      componentPosition: { x: 300, y: 200 },
      proximityRadius: 120,
      autoStart: true
    });

    return () => {
      positionControl.destroy();
    };
  });

  function switchToTriggerMode() {
    positionControl.stopTimeCycle();
    positionControl.disableAreaMode();
    positionControl.isTriggerMode.set(true);
  }
</script>

<div class="container">
  {#if $positionControl?.visible}
    <div bind:this={floatingElement} class="floating-component">
      <h3>Floating Component</h3>
      <p>Mode: 
        {#if $positionControl.isTimeMode}Time-based{/if}
        {#if $positionControl.isAreaMode}Area-based{/if}
        {#if $positionControl.isTriggerMode}Trigger-based{/if}
      </p>
    </div>
  {/if}

  <div class="controls">
    <button on:click={() => positionControl.show()}>Show</button>
    <button on:click={() => positionControl.hide()}>Hide</button>
    <button on:click={() => positionControl.toggle()}>Toggle</button>
    <button on:click={switchToTriggerMode}>Switch to Trigger Mode</button>
  </div>
</div>

<style>
  .floating-component {
    position: fixed;
    top: 200px;
    left: 300px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 1000;
  }

  .controls {
    position: fixed;
    bottom: 20px;
    left: 20px;
    display: flex;
    gap: 8px;
  }
</style>
```