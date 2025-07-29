# Viewport Visibility State Management

Sistem state management yang komprehensif untuk mengelola visibilitas komponen berdasarkan viewport dengan berbagai mode auto show/hide.

## Fitur Utama

- **Time-based visibility**: Auto show/hide berdasarkan interval waktu
- **Area-based visibility**: Show/hide berdasarkan proximity cursor ke area komponen
- **Trigger-based visibility**: Manual control untuk show/hide
- **Global state management**: Kontrol semua komponen secara terpusat
- **TypeScript support**: Full type safety
- **Svelte store integration**: Reactive state management
- **Cleanup management**: Automatic cleanup untuk mencegah memory leaks

## Struktur File

```
src/lib/stores/viewport/
├── visibility.ts          # State management utama
├── VisibilityDemo.svelte  # Demo komponen
└── README.md             # Dokumentasi ini
```

## Quick Start

### 1. Import State Management

```typescript
import { 
  ViewportVisibilityManager,
  createTimeBasedVisibility,
  createAreaBasedVisibility,
  createTriggerBasedVisibility,
  viewportVisibilityStore,
  useViewportVisibility
} from '$lib/stores/viewport/visibility.js';
```

### 2. Penggunaan Dasar

#### Time-based Visibility
```typescript
// Auto cycling antara show dan hide
const timeManager = createTimeBasedVisibility('my-component', {
  hideDelay: 2000,  // Hide setelah 2 detik
  showDelay: 1000   // Show setelah 1 detik
});

// Subscribe ke perubahan visibility
timeManager.visible.subscribe(isVisible => {
  console.log('Component visible:', isVisible);
});
```

#### Area-based Visibility
```typescript
// Show ketika cursor mendekati area komponen
const areaManager = createAreaBasedVisibility('my-component', 
  { x: 100, y: 100 },  // Posisi komponen
  {
    proximityRadius: 150,  // Radius deteksi 150px
    hideDelay: 1000       // Hide setelah 1 detik keluar area
  }
);

// Update posisi dari DOM element
const element = document.getElementById('my-component');
areaManager.updatePositionFromElement(element);
```

#### Trigger-based Visibility
```typescript
// Manual control
const triggerManager = createTriggerBasedVisibility('my-component');

// Control methods
triggerManager.show();
triggerManager.hide();
triggerManager.toggle();
```

### 3. Penggunaan dengan Hook (Recommended)

```typescript
// Di dalam Svelte component
import { onDestroy } from 'svelte';

const visibility = useViewportVisibility('my-component', {
  triggerMode: true,
  initialVisible: false
});

// Reactive visibility
$: isVisible = $visibility.visible;

// Cleanup otomatis saat component destroy
onDestroy(() => {
  visibility.destroy();
});
```

### 4. Global Controls

```typescript
// Kontrol semua komponen sekaligus
viewportVisibilityStore.showAll();
viewportVisibilityStore.hideAll();
viewportVisibilityStore.toggleAll();

// Subscribe ke global state
$: mousePos = $viewportVisibilityStore.mousePosition;
$: activeComponents = $viewportVisibilityStore.activeComponents;
$: isMouseTracking = $viewportVisibilityStore.isMouseTracking;
```

## API Reference

### ViewportVisibilityManager

Class utama untuk mengelola visibility komponen individual.

```typescript
class ViewportVisibilityManager {
  constructor(componentId: string, config: ViewportPositionConfig)
  
  // Properties
  visible: Writable<boolean>
  modes: {
    isTimeMode: Writable<boolean>
    isAreaMode: Writable<boolean>
    isTriggerMode: Writable<boolean>
  }
  
  // Control methods
  show(): void
  hide(): void
  toggle(): void
  
  // Time-based controls
  startTimeCycle(): void
  stopTimeCycle(): void
  
  // Area-based controls
  enableAreaMode(): void
  disableAreaMode(): void
  updatePosition(x: number, y: number): void
  updatePositionFromElement(element: HTMLElement): void
  setProximityRadius(radius: number): void
  
  // Configuration
  applyPreset(preset: keyof ViewportPositionPresets): void
  destroy(): void
}
```

### Factory Functions

#### createTimeBasedVisibility
```typescript
function createTimeBasedVisibility(
  componentId: string, 
  config?: Partial<ViewportPositionConfig>
): ViewportVisibilityManager
```

#### createAreaBasedVisibility
```typescript
function createAreaBasedVisibility(
  componentId: string,
  componentPosition: { x: number; y: number },
  config?: Partial<ViewportPositionConfig>
): ViewportVisibilityManager
```

#### createTriggerBasedVisibility
```typescript
function createTriggerBasedVisibility(
  componentId: string,
  config?: Partial<ViewportPositionConfig>
): ViewportVisibilityManager
```

#### createHybridVisibility
```typescript
function createHybridVisibility(
  componentId: string,
  config: ViewportPositionConfig
): ViewportVisibilityManager
```

### useViewportVisibility Hook

```typescript
function useViewportVisibility(
  componentId: string,
  config?: ViewportPositionConfig
): {
  visible: Writable<boolean>
  modes: {
    isTimeMode: Writable<boolean>
    isAreaMode: Writable<boolean>
    isTriggerMode: Writable<boolean>
  }
  show: () => void
  hide: () => void
  toggle: () => void
  startTimeCycle: () => void
  stopTimeCycle: () => void
  enableAreaMode: () => void
  disableAreaMode: () => void
  updatePosition: (x: number, y: number) => void
  updatePositionFromElement: (element: HTMLElement) => void
  setProximityRadius: (radius: number) => void
  applyPreset: (preset: keyof ViewportPositionPresets) => void
  destroy: () => void
}
```

### Global Store

```typescript
const viewportVisibilityStore = {
  // Derived stores
  mousePosition: Readable<{ x: number; y: number }>
  activeComponents: Readable<string[]>
  isMouseTracking: Readable<boolean>
  globalVisible: Readable<boolean>
  
  // Global controls
  showAll(): void
  hideAll(): void
  toggleAll(): void
  getComponent(componentId: string): ViewportPositionState | undefined
  removeComponent(componentId: string): void
  clearAll(): void
  startMouseTracking(): void
  stopMouseTracking(): void
}
```

### Configuration Interface

```typescript
interface ViewportPositionConfig {
  hideDelay?: number              // Default: 2000ms
  showDelay?: number              // Default: 2000ms
  proximityRadius?: number        // Default: 100px
  componentPosition?: { x: number; y: number }
  initialVisible?: boolean        // Default: false
  timeBasedMode?: boolean         // Default: false
  areaBasedMode?: boolean         // Default: false
  triggerMode?: boolean           // Default: false
  autoStart?: boolean             // Default: false
}
```

### Presets

```typescript
const ViewportPositionPresets = {
  quickCycle: { hideDelay: 1000, showDelay: 1000 },
  standardCycle: { hideDelay: 2000, showDelay: 2000 },
  slowCycle: { hideDelay: 4000, showDelay: 4000 },
  closeProximity: { proximityRadius: 50 },
  mediumProximity: { proximityRadius: 100 },
  wideProximity: { proximityRadius: 200 },
  instant: { hideDelay: 0, showDelay: 0 }
}
```

## Contoh Penggunaan dalam Svelte

### Basic Component

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createTriggerBasedVisibility } from '$lib/stores/viewport/visibility.js';
  
  let manager = createTriggerBasedVisibility('my-component');
  let isVisible = false;
  
  onMount(() => {
    manager.visible.subscribe(value => isVisible = value);
  });
  
  onDestroy(() => {
    manager.destroy();
  });
</script>

<button on:click={manager.toggle}>
  Toggle Component
</button>

{#if isVisible}
  <div class="my-component">
    Component is visible!
  </div>
{/if}
```

### Area-based Component

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createAreaBasedVisibility } from '$lib/stores/viewport/visibility.js';
  
  let manager: ViewportVisibilityManager;
  let element: HTMLElement;
  let isVisible = false;
  
  onMount(() => {
    manager = createAreaBasedVisibility('area-component', { x: 0, y: 0 });
    manager.visible.subscribe(value => isVisible = value);
    
    // Update position from element
    if (element) {
      manager.updatePositionFromElement(element);
    }
  });
  
  onDestroy(() => {
    manager?.destroy();
  });
</script>

<div bind:this={element} class="hover-area">
  Hover near this area
  
  {#if isVisible}
    <div class="tooltip">
      Tooltip appears when mouse is near!
    </div>
  {/if}
</div>
```

### Time-based Component

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createTimeBasedVisibility } from '$lib/stores/viewport/visibility.js';
  
  let manager = createTimeBasedVisibility('notification', {
    hideDelay: 3000,
    showDelay: 1000
  });
  let isVisible = false;
  
  onMount(() => {
    manager.visible.subscribe(value => isVisible = value);
  });
  
  onDestroy(() => {
    manager.destroy();
  });
  
  function toggleCycle() {
    manager.modes.isTimeMode.subscribe(isActive => {
      if (isActive) {
        manager.stopTimeCycle();
      } else {
        manager.startTimeCycle();
      }
    })();
  }
</script>

<button on:click={toggleCycle}>
  Toggle Auto Cycle
</button>

{#if isVisible}
  <div class="notification">
    Auto-cycling notification
  </div>
{/if}
```

## Best Practices

1. **Selalu cleanup**: Gunakan `onDestroy` untuk memanggil `manager.destroy()`
2. **Unique component IDs**: Pastikan setiap komponen memiliki ID yang unik
3. **Update positions**: Untuk area-based, update posisi ketika komponen berubah
4. **Use presets**: Manfaatkan preset untuk konfigurasi yang umum
5. **Global controls**: Gunakan global store untuk kontrol aplikasi-wide

## Integration dengan Utils

State management ini terintegrasi penuh dengan utility di `$lib/utils/viewport/visibility.ts`, memberikan:

- Konsistensi API antara utils dan stores
- Shared configuration dan types
- Optimized performance dengan shared mouse tracking
- Centralized cleanup management

## Demo

Lihat <mcfile name="VisibilityDemo.svelte" path="/Volumes/Mac/icann/Public/Projects/ABSteak/absteak-app/frontend/src/lib/stores/viewport/VisibilityDemo.svelte"></mcfile> untuk contoh lengkap penggunaan semua fitur.