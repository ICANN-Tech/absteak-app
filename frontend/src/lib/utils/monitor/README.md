# Monitor System Usage

## Files Structure

- `section.ts` - Main monitor yang mengelola section changes dan component registration
- `video-highlight.ts` - Video highlight specific functions dan component registry
- `examples.ts` - Contoh penggunaan praktis untuk berbagai skenario
- `section.test.ts` - Unit tests untuk memverifikasi functionality
- `README.md` - Dokumentasi lengkap

## Arsitektur

### 1. `section.ts` - Main Monitor
- Berisi semua fungsi monitoring utama: `start()`, `stop()`, `subscribe()`, dll
- Mengelola perubahan section secara global
- Memanggil fungsi spesifik dari file lain ketika section berubah
- **NEW**: Mengelola komponen yang terdaftar dengan `createStateVisibility`

### 2. `video-highlight.ts` - Video Highlight Functions
- Hanya berisi fungsi-fungsi spesifik untuk video highlight
- Tidak ada `start()`, `stop()`, atau `subscribe()`
- Pure functions yang dipanggil oleh `section.ts`
- **NEW**: Registry system untuk komponen dengan `createStateVisibility`

## Penggunaan

### Basic Usage
```typescript
import { useSectionMonitor } from '$lib/utils/monitor/section';
import { ComponentId, SectionId } from '$lib/enums';

// Di component Svelte
const { start, stop, handleComponent } = useSectionMonitor();

onMount(() => {
    start(); // Mulai monitoring, otomatis handle video highlight
});

onDestroy(() => {
    stop(); // Stop monitoring
});
```

## Usage Examples

### Basic Usage

```typescript
import { useSectionMonitor } from '$lib/utils/monitor/section';
import { SectionId } from '$lib/enums';

const { start, stop, subscribe, videoHighlight } = useSectionMonitor();

// Start monitoring
start();

// Subscribe to section changes
subscribe((section) => {
  console.log('Current section:', section);
});

// Access video highlight functions
const visibleComponents = videoHighlight.getVideoHighlightVisibleComponents();
```

### Component Registration dengan createStateVisibility

Sistem baru memungkinkan Anda mendaftarkan komponen yang akan dikelola secara otomatis menggunakan `createStateVisibility`:

```typescript
import { ComponentId, SectionId } from '$lib/enums';
import { onMount, onDestroy } from 'svelte';

const { handleComponent, unregisterComponent } = useSectionMonitor();

onMount(() => {
  // Register VideoPromotion component untuk VideoHighlight section
  const visibility = handleComponent(
    SectionId.VideoHighlight, 
    ComponentId.VideoPromotion, 
    { 
      hideDelay: 2000,
      initialVisible: false 
    }
  );
  
  if (visibility) {
    // Subscribe ke perubahan visibility
    visibility.finalVisible.subscribe(isVisible => {
      console.log('VideoPromotion visible:', isVisible);
      // Update UI berdasarkan visibility
    });
  }
});

onDestroy(() => {
  // Cleanup - unregister component
  unregisterComponent(SectionId.VideoHighlight, ComponentId.VideoPromotion);
});
```

### Multiple Components Registration

```typescript
const { handleMultipleComponents } = useSectionMonitor();

// Register multiple components sekaligus
const visibilityObjects = handleMultipleComponents(SectionId.VideoHighlight, [
  { 
    componentId: ComponentId.VideoPromotion, 
    config: { hideDelay: 2000, initialVisible: false } 
  },
  { 
    componentId: ComponentId.ChatBot, 
    config: { hideDelay: 3000, initialVisible: true } 
  },
  { 
    componentId: ComponentId.Operation, 
    config: { hideDelay: 1500, initialVisible: false } 
  }
]);

// Handle setiap visibility object
visibilityObjects.forEach((visibility, index) => {
  if (visibility) {
    visibility.finalVisible.subscribe(isVisible => {
      console.log(`Component ${index} visible:`, isVisible);
    });
  }
});
```

### Advanced Usage dengan Manual Control

```typescript
let videoPromotionVisibility: ReturnType<typeof handleComponent>;

onMount(() => {
  // Register component
  videoPromotionVisibility = handleComponent(
    SectionId.VideoHighlight, 
    ComponentId.VideoPromotion, 
    { hideDelay: 2000 }
  );
  
  if (videoPromotionVisibility) {
    // Subscribe ke visibility changes
    videoPromotionVisibility.finalVisible.subscribe(isVisible => {
      if (isVisible) {
        console.log('VideoPromotion is now visible');
        // Trigger animations, load content, etc.
      } else {
        console.log('VideoPromotion is now hidden');
        // Cleanup, pause videos, etc.
      }
    });
  }
});

// Manual control functions
function showVideoPromotion() {
  videoPromotionVisibility?.show();
}

function hideVideoPromotion() {
  videoPromotionVisibility?.hide();
}

function toggleVideoPromotion() {
  videoPromotionVisibility?.toggle();
}
```

### Tracking Component Visibility

#### Basic Tracking
```typescript
import { useSectionMonitor } from '$lib/utils/monitor/section';
import { ComponentId } from '$lib/enums';

const { videoHighlight } = useSectionMonitor();

// Check if a component is currently visible
const isVideoPromotionVisible = videoHighlight.isComponentCurrentlyVisible(ComponentId.VideoPromotion);
console.log('VideoPromotion visible:', isVideoPromotionVisible);

// Get all components visibility status
const allStatus = videoHighlight.getAllComponentsVisibilityStatus();
console.log('All components status:', allStatus);

// Get visibility statistics
const stats = videoHighlight.getVisibilityStatistics();
console.log(`${stats.visibleComponents}/${stats.totalComponents} components visible (${stats.visibilityPercentage.toFixed(1)}%)`);
```

#### Reactive Tracking with Stores
```typescript
import { onMount, onDestroy } from 'svelte';

const { videoHighlight } = useSectionMonitor();

onMount(() => {
    // Subscribe to specific component visibility changes
    const unsubscribeVideoPromotion = videoHighlight.subscribeToComponentVisibility(
        ComponentId.VideoPromotion,
        (isVisible) => {
            console.log('VideoPromotion visibility changed:', isVisible);
            // Update UI, trigger animations, etc.
        }
    );
    
    // Subscribe to all components visibility changes
    const unsubscribeAll = videoHighlight.subscribeToAllComponentsVisibility(
        (visibilityMap) => {
            console.log('Components visibility changed:', visibilityMap);
            // Update dashboard, analytics, etc.
        }
    );
    
    // Get reactive store for specific component
    const videoPromotionStore = videoHighlight.getComponentVisibilityStore(ComponentId.VideoPromotion);
    const unsubscribeStore = videoPromotionStore.subscribe(isVisible => {
        console.log('VideoPromotion store update:', isVisible);
    });
    
    // Cleanup
    onDestroy(() => {
        unsubscribeVideoPromotion();
        unsubscribeAll();
        unsubscribeStore();
    });
});
```

#### Real-time Dashboard Component
```svelte
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { useSectionMonitor } from '$lib/utils/monitor/section';
    
    const { videoHighlight } = useSectionMonitor();
    
    let stats = {
        totalComponents: 0,
        visibleComponents: 0,
        hiddenComponents: 0,
        visibilityPercentage: 0
    };
    
    let allComponentsStatus = {};
    let unsubscribeAll;
    
    onMount(() => {
        // Subscribe to all components visibility changes
        unsubscribeAll = videoHighlight.subscribeToAllComponentsVisibility((visibilityMap) => {
            // Update stats
            stats = videoHighlight.getVisibilityStatistics();
            
            // Update status object
            allComponentsStatus = {};
            visibilityMap.forEach((isVisible, componentId) => {
                allComponentsStatus[componentId] = isVisible;
            });
            
            // Trigger reactivity
            stats = stats;
            allComponentsStatus = allComponentsStatus;
        });
        
        // Initial load
        stats = videoHighlight.getVisibilityStatistics();
        allComponentsStatus = videoHighlight.getAllComponentsVisibilityStatus();
    });
    
    onDestroy(() => {
        unsubscribeAll?.();
    });
</script>

<div class="tracking-dashboard">
    <h3>Component Visibility Dashboard</h3>
    
    <div class="stats">
        <div>Total: {stats.totalComponents}</div>
        <div>Visible: {stats.visibleComponents}</div>
        <div>Hidden: {stats.hiddenComponents}</div>
        <div>Visibility: {stats.visibilityPercentage.toFixed(1)}%</div>
    </div>
    
    <div class="components-list">
        {#each Object.entries(allComponentsStatus) as [componentId, isVisible]}
            <div class="component-item" class:visible={isVisible}>
                <span>{componentId}</span>
                <span>{isVisible ? 'Visible' : 'Hidden'}</span>
            </div>
        {/each}
    </div>
</div>
```

### Integration dengan Svelte Component

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { useSectionMonitor } from '$lib/utils/monitor/section';
  import { ComponentId, SectionId } from '$lib/enums';
  
  const { handleComponent, unregisterComponent } = useSectionMonitor();
  let isVisible = false;
  let visibility: ReturnType<typeof handleComponent>;
  
  onMount(() => {
    // Register component dengan section monitor
    visibility = handleComponent(
      SectionId.VideoHighlight, 
      ComponentId.VideoPromotion, 
      { 
        hideDelay: 2000,
        initialVisible: false 
      }
    );
    
    if (visibility) {
      // Subscribe ke perubahan visibility
      const unsubscribe = visibility.finalVisible.subscribe(visible => {
        isVisible = visible;
      });
      
      // Cleanup subscription on destroy
      onDestroy(() => {
        unsubscribe();
        unregisterComponent(SectionId.VideoHighlight, ComponentId.VideoPromotion);
      });
    }
  });
  
  function handleManualShow() {
    visibility?.show();
  }
  
  function handleManualHide() {
    visibility?.hide();
  }
</script>

{#if isVisible}
  <div class="video-promotion" transition:fade>
    <h2>Video Promotion</h2>
    <p>This component is managed by section monitor!</p>
    
    <button on:click={handleManualShow}>Force Show</button>
    <button on:click={handleManualHide}>Force Hide</button>
  </div>
{/if}
```

### Checking Registered Components

```typescript
const { getRegisteredComponents } = useSectionMonitor();

// Check registered components
function checkRegisteredComponents() {
  const registered = getRegisteredComponents(SectionId.VideoHighlight);
  if (registered) {
    console.log('Registered components:', Array.from(registered.keys()));
    
    // Access specific component
    const chatBotVisibility = registered.get(ComponentId.ChatBot);
    if (chatBotVisibility) {
      chatBotVisibility.show();
    }
  }
}
```



### Menggunakan Video Highlight Functions (Existing)
```typescript
import { useSectionMonitor } from '$lib/utils/monitor/section';

const { videoHighlight } = useSectionMonitor();

// Cek komponen mana yang visible di video highlight
const visibleComponents = videoHighlight.getVideoHighlightVisibleComponents();

// Cek apakah komponen tertentu visible di video highlight
const isVisible = videoHighlight.isComponentVisibleInVideoHighlight(ComponentId.Navigation);

// Monitor komponen spesifik
const componentStatus = videoHighlight.monitorVideoHighlightComponent(ComponentId.Schedule);
```

### Advanced Usage dengan Custom Callback
```typescript
const { start } = useSectionMonitor({
    enableVisibilityControl: true, // default: true
    onSectionChange: (section, sectionIndex, previousSection) => {
        console.log(`Section changed from ${previousSection} to ${section}`);
    }
});
```

## Cara Kerja

1. **Start Monitor**: `useSectionMonitor().start()`
2. **Section Berubah**: Monitor mendeteksi perubahan section
3. **Component Handling**: 
   - **Manual Components**: Jika section === `VideoHighlight`, panggil `showVideoHighlightComponents()`
   - **Registered Components**: Otomatis show/hide komponen yang terdaftar dengan `createStateVisibility`
4. **Notify Subscribers**: Beritahu semua subscriber tentang perubahan
5. **Custom Callback**: Jalankan callback custom jika ada

## **NEW: Perbedaan Manual vs Registered Components**

### Manual Components (Existing)
- Hardcoded di `video-highlight.ts`
- Menggunakan `showComponent()` / `hideComponent()` langsung
- Contoh: Navigation, LanguageSwitch, Schedule

### Registered Components (NEW)
- Dinamis, bisa didaftarkan dari mana saja
- Menggunakan `createStateVisibility` dengan konfigurasi custom
- Otomatis dikelola oleh section monitor
- Contoh: VideoPromotion, ChatBot, Operation

## Testing

Untuk menjalankan unit tests:

```bash
npm run test src/lib/utils/monitor/section.test.ts
```

Atau untuk menjalankan semua tests:

```bash
npm run test
```

## Troubleshooting

### Component tidak terdaftar
- Pastikan section yang digunakan adalah `SectionId.VideoHighlight`
- Pastikan `start()` sudah dipanggil sebelum `handleComponent()`
- Periksa console untuk error messages

### Visibility tidak berubah
- Pastikan `createStateVisibility` berfungsi dengan benar
- Periksa konfigurasi `hideDelay` dan `initialVisible`
- Pastikan component element ada di DOM

### Memory leaks
- Selalu panggil `unregisterComponent()` di `onDestroy()`
- Unsubscribe dari visibility changes
- Panggil `stop()` ketika tidak diperlukan

## Best Practices

1. **Lifecycle Management**: Selalu register di `onMount()` dan unregister di `onDestroy()`
2. **Error Handling**: Periksa return value dari `handleComponent()` sebelum menggunakan
3. **Performance**: Gunakan `handleMultipleComponents()` untuk bulk registration
4. **Cleanup**: Selalu cleanup subscriptions dan registrations
5. **Testing**: Gunakan unit tests untuk memverifikasi behavior

## API Reference

### `useSectionMonitor()`

Returns an object with the following methods:

#### Component Management

##### `handleComponent(sectionId, componentId, config?)`
- **Parameters:**
  - `sectionId`: The section identifier (currently only `SectionId.VideoHighlight` is supported)
  - `componentId`: The component identifier
  - `config`: Optional configuration object with `ViewportPositionConfig` properties
- **Returns:** Visibility control object with `show()`, `hide()`, and `finalVisible` store, or `null` if section is not supported
- **Description:** Registers a component with the section monitor and returns visibility controls

##### `handleMultipleComponents(sectionId, components)`
- **Parameters:**
  - `sectionId`: The section identifier
  - `components`: Array of `ComponentRegistrationConfig` objects
- **Returns:** Array of visibility control objects
- **Description:** Registers multiple components at once

##### `unregisterComponent(sectionId, componentId)`
- **Parameters:**
  - `sectionId`: The section identifier
  - `componentId`: The component identifier
- **Description:** Unregisters a component from the section monitor

##### `getRegisteredComponents(sectionId)`
- **Parameters:**
  - `sectionId`: The section identifier
- **Returns:** Array of registered component IDs
- **Description:** Returns a list of all registered components for the specified section

#### Tracking Functions

##### `videoHighlight.isComponentCurrentlyVisible(componentId)`
- **Parameters:**
  - `componentId`: The component identifier
- **Returns:** `boolean` - Whether the component is currently visible
- **Description:** Checks if a specific component is currently visible

##### `videoHighlight.getAllComponentsVisibilityStatus()`
- **Returns:** Object with component IDs as keys and visibility status as values
- **Description:** Gets the current visibility status of all components

##### `videoHighlight.getVisibilityStatistics()`
- **Returns:** Object with statistics about component visibility
  ```typescript
  {
    totalComponents: number;
    visibleComponents: number;
    hiddenComponents: number;
    visibilityPercentage: number;
    visibleComponentIds: ComponentId[];
    hiddenComponentIds: ComponentId[];
  }
  ```
- **Description:** Gets comprehensive statistics about component visibility

##### `videoHighlight.getComponentVisibilityStore(componentId)`
- **Parameters:**
  - `componentId`: The component identifier
- **Returns:** Svelte readable store that emits boolean values
- **Description:** Gets a reactive store for a specific component's visibility

##### `videoHighlight.subscribeToComponentVisibility(componentId, callback)`
- **Parameters:**
  - `componentId`: The component identifier
  - `callback`: Function that receives visibility status updates
- **Returns:** Unsubscribe function
- **Description:** Subscribes to visibility changes for a specific component

##### `videoHighlight.subscribeToAllComponentsVisibility(callback)`
- **Parameters:**
  - `callback`: Function that receives a Map of all component visibility statuses
- **Returns:** Unsubscribe function
- **Description:** Subscribes to visibility changes for all components

##### `videoHighlight.getComponentTrackingStore()`
- **Returns:** Svelte readable store containing visibility status of all components
- **Description:** Gets the main tracking store for all components

##### `videoHighlight.getRegisteredComponentTrackingStore()`
- **Returns:** Svelte readable store containing visibility status of registered components only
- **Description:** Gets the tracking store for registered components only

## Keuntungan Arsitektur Ini

- ✅ **Simple**: Hanya perlu `start()` satu kali
- ✅ **Modular**: Fungsi video highlight terpisah di file sendiri
- ✅ **Scalable**: Mudah menambah section baru (misal: `chef.ts`, `experience.ts`)
- ✅ **Clean**: Tidak ada duplikasi start/stop di setiap file
- ✅ **Best Practice**: Separation of concerns yang jelas
- ✅ **NEW - Flexible**: Komponen bisa didaftarkan dinamis dengan konfigurasi custom
- ✅ **NEW - Powerful**: Menggunakan `createStateVisibility` untuk kontrol yang lebih advanced