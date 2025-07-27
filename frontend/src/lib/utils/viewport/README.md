# Viewport Management System

Sistem manajemen viewport yang lengkap untuk aplikasi Svelte dengan fitur scroll-based section navigation.

## 📁 Struktur File

```
src/lib/utils/viewport/
├── index.ts           # Main export dan integrated system
├── observer.ts        # Scroll observer untuk deteksi scroll
├── navigator.ts       # Navigation control dan scroll management
├── loader.ts          # Component loading dan caching
├── indicator.ts       # Indicator management
└── example-page.svelte # Contoh implementasi
```

## 🚀 Quick Start

### Implementasi Sederhana

```typescript
import { useCompleteViewportSystem } from '$lib/utils/viewport';

const sections = [
  { id: 'hero', path: '$lib/components/Hero.svelte' },
  { id: 'about', path: '$lib/components/About.svelte' }
];

const viewport = useCompleteViewportSystem({
  sections,
  scrollDelay: 800,
  indicatorHideDelay: 3000
});

// Akses reactive stores
const { currentSectionIndex, indicatorVisible, loadedComponents } = viewport;
```

### Implementasi Manual (Lebih Kontrol)

```typescript
import { 
  useViewportSystem, 
  useComponentLoader, 
  useIndicatorSystem 
} from '$lib/utils/viewport';

// Setup terpisah untuk kontrol lebih detail
const componentLoader = useComponentLoader(sections);
const indicator = useIndicatorSystem({ hideDelay: 3000 });
const viewport = useViewportSystem({
  sections,
  preloadCallback: componentLoader.preload,
  indicatorCallback: indicator.showAndStartTimer
});
```

## 📚 API Reference

### 1. **useCompleteViewportSystem(options)**

Sistem terintegrasi yang menggabungkan semua fitur.

**Options:**
```typescript
{
  sections: Section[];                    // Daftar section
  scrollDelay?: number;                   // Delay antar scroll (default: 800ms)
  indicatorHideDelay?: number;            // Delay hide indicator (default: 3000ms)
  mouseAreaPercentage?: number;           // Area mouse untuk show indicator (default: 0.8)
  autoStart?: boolean;                    // Auto start observer (default: true)
  onSectionChange?: (index: number) => void;
  onScrollAttempt?: (direction: 'up' | 'down') => void;
  onNavigate?: (from: number, to: number) => void;
  preloadCallback?: (index: number) => Promise<void>;
  indicatorCallback?: () => void;
}
```

**Returns:**
```typescript
{
  // Reactive stores
  currentSectionIndex: Readable<number>;
  isTransitioning: Readable<boolean>;
  scrollEnabled: Readable<boolean>;
  indicatorVisible: Readable<boolean>;
  
  // Navigation
  jumpToSection: (index: number) => Promise<boolean>;
  jumpToSectionById: (id: string) => Promise<boolean>;
  nextSection: () => Promise<boolean>;
  previousSection: () => Promise<boolean>;
  
  // Scroll control
  enableScroll: () => void;
  disableScroll: () => void;
  toggleScroll: () => void;
  
  // Component loading
  loadedComponents: LoadedComponents;
  getComponent: (index: number) => any;
  isComponentLoaded: (index: number) => boolean;
  
  // Indicator control
  showIndicator: () => void;
  hideIndicator: () => void;
  startIndicatorTimer: () => void;
}
```

### 2. **useScrollObserver(options)**

Observer untuk mendeteksi scroll dan mengubah section.

**Features:**
- ✅ Scroll ke bawah → section berikutnya
- ✅ Scroll ke atas → section sebelumnya
- ✅ Prevent default scroll behavior
- ✅ Configurable callbacks

### 3. **useViewportNavigator(options)**

Navigator untuk kontrol navigasi dan scroll.

**Features:**
- ✅ Jump to section by index atau ID
- ✅ Next/previous navigation
- ✅ Enable/disable scroll
- ✅ Validation dan error handling

### 4. **useComponentLoader(sections)**

Loader untuk dynamic import dan caching komponen.

**Features:**
- ✅ Dynamic import berdasarkan path
- ✅ Component caching
- ✅ Preload adjacent sections
- ✅ Lazy loading support

### 5. **useIndicatorSystem(options)**

System untuk mengelola indicator visibility.

**Features:**
- ✅ Auto hide dengan timer
- ✅ Mouse area detection
- ✅ Show/hide controls
- ✅ Configurable delays

## 🎯 Use Cases

### 1. **Basic Section Navigation**
```typescript
const viewport = useCompleteViewportSystem({ sections });

// Navigate programmatically
await viewport.jumpToSection(2);
await viewport.jumpToSectionById('hero');
await viewport.nextSection();
```

### 2. **Scroll Control**
```typescript
// Disable scroll sementara (misal saat modal terbuka)
viewport.disableScroll();

// Enable kembali
viewport.enableScroll();

// Toggle
viewport.toggleScroll();
```

### 3. **Component Preloading**
```typescript
const viewport = useCompleteViewportSystem({
  sections,
  preloadCallback: async (index) => {
    // Custom preload logic
    console.log('Preloading section:', index);
  }
});

// Preload semua komponen sekaligus
await viewport.preloadAllComponents();
```

### 4. **Indicator Management**
```typescript
const viewport = useCompleteViewportSystem({
  sections,
  indicatorHideDelay: 5000, // 5 detik
  mouseAreaPercentage: 0.9   // 10% area kanan
});

// Manual control
viewport.showIndicator();
viewport.hideIndicator();
viewport.startIndicatorTimer();
```

## 🔧 Integration dengan Modal

```typescript
import { modalStore } from '$lib/stores/modal';

const viewport = useCompleteViewportSystem({ sections });

// Auto disable scroll saat modal terbuka
modalStore.subscribe(modal => {
  if (modal.isOpen) {
    viewport.disableScroll();
    viewport.hideIndicator();
  } else {
    viewport.enableScroll();
    viewport.startIndicatorTimer();
  }
});
```

## 📱 Responsive Considerations

```typescript
// Adjust mouse area untuk mobile
const isMobile = window.innerWidth < 768;

const viewport = useCompleteViewportSystem({
  sections,
  mouseAreaPercentage: isMobile ? 0.7 : 0.8,
  indicatorHideDelay: isMobile ? 2000 : 3000
});
```

## 🐛 Debugging

```typescript
const viewport = useCompleteViewportSystem({
  sections,
  onSectionChange: (index) => console.log('Section:', index),
  onScrollAttempt: (dir) => console.log('Scroll:', dir),
  onNavigate: (from, to) => console.log(`${from} → ${to}`)
});

// Check current state
console.log('Current section:', viewport.getCurrentSection());
console.log('Can navigate to 2:', viewport.canNavigateTo(2));
console.log('Scroll enabled:', viewport.isScrollEnabled());
```

## ⚡ Performance Tips

1. **Preload Strategy**: Gunakan `preloadAllComponents()` untuk UX yang lebih smooth
2. **Component Caching**: Cache otomatis mengurangi re-import
3. **Lazy Loading**: Komponen di-load on-demand secara default
4. **Memory Management**: Cleanup otomatis saat component unmount

## 🔄 Migration dari +page.svelte Lama

**Before:**
```typescript
// Logic scroll manual di +page.svelte
let isTransitioning = false;
let currentSectionIndex = 0;
// ... 200+ lines of scroll logic
```

**After:**
```typescript
// Satu line setup
const viewport = useCompleteViewportSystem({ sections });
```

**Benefits:**
- ✅ 90% less code
- ✅ Better type safety
- ✅ Easier testing
- ✅ Reusable across pages
- ✅ Better separation of concerns