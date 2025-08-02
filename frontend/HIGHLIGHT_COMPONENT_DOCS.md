# Highlight Component Documentation

## Overview
Komponen Highlight adalah sistem indicator yang menampilkan navigasi visual untuk highlight sections dalam aplikasi. Komponen ini menggunakan state management yang terintegrasi dengan visibility management.

## Features
- ✅ Circle indicator dengan ukuran yang dapat disesuaikan
- ✅ Color scheme yang fleksibel (white, primary, auto)
- ✅ Tooltip yang dapat diaktifkan/dinonaktifkan
- ✅ State management terintegrasi
- ✅ Visibility management otomatis
- ✅ Smooth transitions dan animations

## Usage

### Basic Usage
```svelte
<script>
  import { Highlight } from '$lib/components/organisms/layout';
</script>

<Highlight />
```

### Advanced Usage
```svelte
<script>
  import { Highlight } from '$lib/components/organisms/layout';
</script>

<Highlight 
  colorScheme="primary"
  size="lg"
  showTooltip={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorScheme` | `'white' \| 'primary' \| 'auto'` | `'auto'` | Skema warna untuk indicator |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ukuran indicator |
| `showTooltip` | `boolean` | `true` | Menampilkan tooltip atau tidak |

## Color Schemes

### Auto Mode
Secara otomatis menyesuaikan warna berdasarkan current highlight index:
- Index 0, 2, 4: White color scheme
- Index lainnya: Primary color scheme

### White Mode
- Active: `bg-white`
- Inactive: `bg-white/30`

### Primary Mode
- Active: `bg-primary-950`
- Inactive: `bg-primary-950/30`

## Sizes

| Size | Class | Dimensions |
|------|-------|------------|
| `sm` | `w-1.5 h-1.5` | 6px × 6px |
| `md` | `w-2 h-2` | 8px × 8px |
| `lg` | `w-3 h-3` | 12px × 12px |

## State Management

Komponen menggunakan store dari `$lib/stores/viewport/highlight`:

```javascript
import { 
  currentHighlightIndex, 
  highlightsData, 
  highlightStore 
} from '$lib/stores/viewport/highlight';

// Jump to specific highlight
highlightStore.jumpToHighlight(2);

// Jump by ID
highlightStore.jumpToHighlightById('chef');

// Navigate
highlightStore.nextHighlight();
highlightStore.previousHighlight();
```

## Utility Functions

```javascript
import { 
  scrollToHighlight, 
  scrollToHighlightById,
  getCurrentHighlightIndex 
} from '$lib/utils/viewport/highlight';

// Scroll to highlight
scrollToHighlight(1);
scrollToHighlightById('experience');

// Get current index
const currentIndex = await getCurrentHighlightIndex();
```

## Indicator Component (Reusable)

Komponen Indicator juga telah diupdate untuk lebih reusable:

```svelte
<script>
  import { Indicator } from '$lib/components/atoms';
  
  const sections = [
    { id: 'section1', name: 'Section 1' },
    { id: 'section2', name: 'Section 2' }
  ];
  
  let currentIndex = 0;
  
  function handleSectionClick(index) {
    currentIndex = index;
    // Handle navigation logic
  }
</script>

<Indicator 
  {sections}
  currentSectionIndex={currentIndex}
  onSectionClick={handleSectionClick}
  visible={true}
  colorScheme="primary"
  size="md"
  showTooltip={true}
/>
```

## Integration Example

```svelte
<!-- +layout.svelte -->
<script>
  import { Highlight } from '$lib/components/organisms/layout';
  import { onMount } from 'svelte';
  import { updateHighlightVisibilityPosition } from '$lib/stores/viewport/highlight';
  
  onMount(() => {
    // Update visibility position on mount
    updateHighlightVisibilityPosition();
    
    // Update on window resize
    const handleResize = () => updateHighlightVisibilityPosition();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<main>
  <slot />
  
  <!-- Highlight indicator -->
  <Highlight colorScheme="auto" size="md" />
</main>
```