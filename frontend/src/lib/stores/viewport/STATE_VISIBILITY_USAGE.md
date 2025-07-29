# State Visibility Management - Petunjuk Penggunaan

Sistem visibility menyediakan dua fungsi utama untuk state management yang terintegrasi:
- `createStateVisibility`: State management dasar untuk visibility komponen dengan ID unik
- `createAreaBasedStateVisibility`: Visibilitas berbasis area dengan deteksi kedekatan mouse

## Import

```typescript
import { createStateVisibility, createAreaBasedStateVisibility } from '$lib/stores/viewport/visibility.js';
```

## Penggunaan Dasar

### State Visibility

Untuk komponen dengan kontrol visibility manual:

```typescript
const visibility = createStateVisibility('my-component', {
  initialVisible: false,
  hideDelay: 3000
});
```

### Area-Based State Visibility

Untuk komponen yang muncul berdasarkan posisi mouse di area tertentu:

```typescript
const visibility = createAreaBasedStateVisibility('navigation', {
  targetArea: 'top',        // Area target: 'top', 'bottom', 'left', 'right', 'center'
  proximityRadius: 150,     // Radius deteksi dalam pixel
  areaOffset: 100,          // Offset dari tepi area
  initialVisible: false,
  hideDelay: 2000
});
```

### 1. Komponen Operation Hours (Contoh Implementasi)

```svelte
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { createStateVisibility } from '$lib/stores/viewport/visibility.js';

  // Create state-based visibility dengan ID unik
  const visibility = createStateVisibility('operation-hours', {
    initialVisible: false,
    hideDelay: 3000
  });

  // Extract store dan control functions
  const { isVisible, show, hide } = visibility;

  onDestroy(() => {
    visibility.destroy();
  });
</script>

{#if $isVisible}
  <div on:mouseleave={() => setTimeout(() => hide(), 1500)}>
    <!-- Konten komponen -->
  </div>
{:else}
  <button on:click={show}>Show</button>
{/if}
```

### 2. Komponen Navigation Menu

```svelte
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { createStateVisibility } from '$lib/stores/viewport/visibility.js';

  // ID unik untuk navigation menu
  const visibility = createStateVisibility('nav-menu', {
    initialVisible: true,
    hideDelay: 2000
  });

  const { isVisible, show, hide, toggle } = visibility;

  onDestroy(() => {
    visibility.destroy();
  });
</script>

{#if $isVisible}
  <nav>
    <button on:click={hide}>Close Menu</button>
    <!-- Menu items -->
  </nav>
{:else}
  <button on:click={show}>Open Menu</button>
{/if}
```

### 3. Komponen Modal/Dialog

```svelte
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { createStateVisibility } from '$lib/stores/viewport/visibility.js';

  // ID unik untuk modal
  const visibility = createStateVisibility('user-profile-modal', {
    initialVisible: false,
    hideDelay: 0 // Instant hide untuk modal
  });

  const { isVisible, show, hide } = visibility;

  onDestroy(() => {
    visibility.destroy();
  });
</script>

{#if $isVisible}
  <div class="modal-backdrop" on:click={hide}>
    <div class="modal-content" on:click|stopPropagation>
      <button on:click={hide}>×</button>
      <!-- Modal content -->
    </div>
  </div>
{/if}

<button on:click={show}>Open Profile</button>
```

### 4. Komponen dengan Area-Based Visibility

```svelte
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { createAreaBasedStateVisibility } from '$lib/stores/viewport/visibility.js';

  let element: HTMLElement;
  
  // Navigation yang muncul saat mouse di area atas
  const visibility = createAreaBasedStateVisibility('top-navigation', {
    targetArea: 'top',
    proximityRadius: 150,
    areaOffset: 100,
    initialVisible: false,
    hideDelay: 2000
  });

  const { isVisible } = visibility;

  // Update posisi elemen untuk deteksi area
  $: if (element) {
    visibility.updatePosition(element);
  }

  onDestroy(() => {
    visibility.destroy();
  });
</script>

{#if $isVisible}
  <nav bind:this={element} class="top-navigation">
    <!-- Navigation items -->
    <a href="/home">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
{/if}

<style>
  .top-navigation {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.9);
    padding: 1rem;
  }
</style>
```

## API Reference

### createStateVisibility(componentId, config)

**Parameters:**
- `componentId` (string): ID unik untuk komponen. Harus unique di seluruh aplikasi.
- `config` (object): Konfigurasi opsional

**Returns:**
```typescript
{
  visible: Readable<boolean>;      // Store visibility utama
  isVisible: Readable<boolean>;    // Store visibility yang sama (alias)
  show: () => void;                // Fungsi untuk menampilkan
  hide: () => void;                // Fungsi untuk menyembunyikan
  toggle: () => void;              // Fungsi untuk toggle visibility
  destroy: () => void;             // Cleanup function
  manager: ViewportVisibilityManager; // Manager instance untuk kontrol advanced
}
```

### createAreaBasedStateVisibility(componentId, config)

**Parameters:**
- `componentId` (string): ID unik untuk komponen
- `config` (object): Konfigurasi dengan opsi area-based

**Returns:**
```typescript
{
  visible: Readable<boolean>;
  isVisible: Readable<boolean>;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  destroy: () => void;
  updatePosition: (element: HTMLElement) => void; // Update posisi untuk deteksi area
  manager: ViewportVisibilityManager;
}
```

**Config Options:**
```typescript
{
  // Basic options
  initialVisible?: boolean;        // Default: false
  hideDelay?: number;             // Delay sebelum hide (ms), default: 2000
  showDelay?: number;             // Delay sebelum show (ms), default: 2000
  
  // Area-based options (untuk createAreaBasedStateVisibility)
  targetArea?: 'top' | 'bottom' | 'left' | 'right' | 'center'; // Default: 'top'
  proximityRadius?: number;       // Radius deteksi mouse (px), default: 100
  areaOffset?: number;           // Offset dari tepi area (px), default: 50
  
  // ... opsi lainnya dari ViewportPositionConfig
}
```

## Keunggulan

### 1. **State Management Terintegrasi**
- State tersimpan dalam global state manager
- Dapat diakses dari komponen lain jika diperlukan
- Automatic cleanup saat komponen di-destroy

### 2. **ID Unik untuk Setiap Komponen**
- Mencegah konflik state antar komponen
- Memungkinkan multiple instance dengan state terpisah
- Mudah di-debug dan di-monitor

### 3. **Area-Based Detection**
- Deteksi otomatis berdasarkan posisi mouse
- Konfigurasi area target yang fleksibel
- Radius dan offset yang dapat disesuaikan
- Integrasi seamless dengan viewport tracking

### 4. **Reactive dan Performant**
- Menggunakan Svelte stores untuk reactivity
- Minimal re-render dengan derived stores
- Efficient memory management
- Optimized mouse tracking

### 5. **Best Practices**
- Consistent API across components
- Proper cleanup dengan onDestroy
- Type-safe dengan TypeScript
- Flexible configuration options

## Contoh Penggunaan Advanced

### Sharing State Antar Komponen

```svelte
<!-- ParentComponent.svelte -->
<script lang="ts">
  import { viewportVisibilityStore } from '$lib/stores/viewport/visibility.js';
  
  // Akses state dari komponen lain
  $: operationHoursComponent = viewportVisibilityStore.getComponent('operation-hours');
  
  function toggleOperationHours() {
    if (operationHoursComponent) {
      operationHoursComponent.toggle();
    }
  }
</script>

<button on:click={toggleOperationHours}>
  Toggle Operation Hours from Parent
</button>
```

### Global Control

```svelte
<script lang="ts">
  import { viewportVisibilityStore } from '$lib/stores/viewport/visibility.js';
  
  function hideAllComponents() {
    viewportVisibilityStore.hideAll();
  }
  
  function showAllComponents() {
    viewportVisibilityStore.showAll();
  }
</script>

<button on:click={hideAllComponents}>Hide All</button>
<button on:click={showAllComponents}>Show All</button>
```

## Hide Component Feature

Fitur `hideComponent` memungkinkan Anda untuk menyembunyikan komponen secara paksa, mengabaikan status `isVisible` normal.

### Penggunaan Hide Component

```typescript
import { createStateVisibility } from '$lib/stores/viewport/visibility.js';

const visibility = createStateVisibility('my-component', {
  initialVisible: true,
  hideDelay: 1000
});

const { isVisible, finalVisible, setHideComponent, hideComponent } = visibility;

// Kontrol hideComponent
setHideComponent(true);   // Paksa sembunyikan
setHideComponent(false);  // Paksa tampilkan
setHideComponent(null);   // Gunakan logika normal (default)
```

### Dalam Template Svelte

```svelte
<script>
  const { finalVisible, setHideComponent } = createStateVisibility('demo');
</script>

<!-- Gunakan finalVisible untuk rendering kondisional -->
{#if $finalVisible}
  <div>Komponen terlihat</div>
{/if}

<!-- Kontrol hideComponent -->
<button on:click={() => setHideComponent(true)}>Force Hide</button>
<button on:click={() => setHideComponent(false)}>Force Show</button>
<button on:click={() => setHideComponent(null)}>Normal Mode</button>
```

### Logika finalVisible

```typescript
// Formula yang digunakan:
finalVisible = hideComponent === true ? false : 
               hideComponent === false ? true : 
               isVisible
```

### Nilai hideComponent

- **`null` (default)**: Menggunakan logika visibility normal berdasarkan `isVisible`
- **`false`**: Memaksa komponen untuk ditampilkan, mengabaikan `isVisible`
- **`true`**: Memaksa komponen untuk disembunyikan, mengabaikan `isVisible`

### Contoh Use Cases

1. **Conditional Override**: Sembunyikan komponen berdasarkan kondisi tertentu
2. **Admin Controls**: Tampilkan/sembunyikan elemen untuk role tertentu
3. **Feature Flags**: Kontrol visibilitas fitur secara dinamis
4. **Emergency Hide**: Sembunyikan komponen saat terjadi error

## Tips dan Best Practices

1. **Gunakan ID yang Descriptive**: `'user-menu'`, `'operation-hours'`, `'product-modal'`
2. **Selalu Cleanup**: Gunakan `onDestroy(() => visibility.destroy())`
3. **Consistent Naming**: Gunakan kebab-case untuk component IDs
4. **Avoid Conflicts**: Pastikan setiap komponen memiliki ID yang unik
5. **Performance**: Gunakan derived stores untuk computed values
6. **Area-Based Usage**: 
   - Gunakan untuk navigation, toolbars, atau floating elements
   - Set proximityRadius sesuai dengan ukuran komponen
   - Adjust areaOffset untuk kontrol yang lebih presisi
7. **Element Positioning**: Selalu update posisi elemen dengan `updatePosition()` untuk area-based detection
8. **Responsive Design**: Pertimbangkan area detection pada berbagai ukuran layar
9. **Hide Component**: 
   - Selalu gunakan `finalVisible` untuk kondisional rendering
   - `hideComponent` memiliki prioritas tertinggi dalam logika visibility
   - Pastikan untuk reset `hideComponent` ke `null` jika tidak diperlukan lagi

## Troubleshooting

### State Tidak Update
- Pastikan menggunakan `$isVisible` dengan reactive syntax
- Check apakah `destroy()` dipanggil di `onDestroy`

### Konflik State
- Pastikan setiap komponen menggunakan `componentId` yang unik
- Check dengan `viewportVisibilityStore.activeComponents` untuk melihat komponen aktif

### Area Detection Tidak Bekerja
- Pastikan `updatePosition(element)` dipanggil setelah element ter-mount
- Check apakah element memiliki posisi yang valid
- Verify targetArea sesuai dengan layout komponen
- Adjust proximityRadius jika area detection terlalu sensitif/tidak sensitif

### Performance Issues
- Gunakan hideDelay yang reasonable untuk menghindari flickering
- Pertimbangkan proximityRadius yang tidak terlalu besar
- Monitor dengan browser dev tools untuk mouse event frequency

### Memory Leaks
- Selalu panggil `destroy()` di `onDestroy`
- Jangan lupa cleanup event listeners manual jika ada
- Area-based visibility otomatis cleanup mouse tracking