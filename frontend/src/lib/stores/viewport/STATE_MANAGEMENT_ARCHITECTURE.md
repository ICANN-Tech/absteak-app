# Viewport State Management Architecture

## 📁 File Structure

```
src/lib/stores/viewport/
├── instantiate.ts          # ✨ State management (NEW)
├── index.ts                # 📦 Centralized exports
├── component.ts            # 🔧 Component visibility stores
├── highlight.ts            # ✨ Highlight management stores
└── visibility.ts           # 👁️ General visibility stores

src/lib/utils/viewport/
├── initialization.ts       # 🏗️ Business logic (NEW)
└── instantiate.ts          # ⚠️ Deprecated (backward compatibility)
```

## 🏗️ Architecture Overview

### **Separation of Concerns**

1. **State Management** (`/stores/viewport/instantiate.ts`)
   - Pure Svelte stores
   - Reactive state management
   - Type-safe interfaces
   - Development helpers

2. **Business Logic** (`/utils/viewport/initialization.ts`)
   - Initialization functions
   - Component loading
   - Error handling
   - Uses state stores for tracking

## 🎯 Key Features

### **State Management (`instantiate.ts`)**

```typescript
// ✅ Individual stores
export const sectionsInitialized: Readable<boolean>
export const componentsInitialized: Readable<boolean>
export const highlightsInitialized: Readable<boolean>
export const isLoading: Readable<boolean>
export const error: Readable<string | null>

// ✅ Derived stores
export const appInitialized: Readable<boolean>
export const initializationState: Readable<InitializationState>

// ✅ Actions
export const initializationActions: InitializationActions
```

### **Business Logic (`initialization.ts`)**

```typescript
// ✅ Main initialization function
export const initializeApp(): Promise<{sections: Sections, sectionsReady: boolean}>

// ✅ Individual initialization functions
export const initializeSections(): Promise<Sections>
export const initializeHighlights(): Promise<void>
```

## 🚀 Usage Examples

### **In Components**

```svelte
<script>
  import { 
    sectionsInitialized, 
    isLoading, 
    error,
    logInitializationState 
  } from '$lib/stores/viewport/instantiate';
  import { initializeApp } from '$lib/utils/viewport/initialization';

  onMount(async () => {
    try {
      await initializeApp();
      if (import.meta.env.DEV) {
        logInitializationState();
      }
    } catch (err) {
      console.error('Initialization failed:', err);
    }
  });
</script>

{#if $sectionsInitialized}
  <!-- Render sections -->
{:else if $error}
  <!-- Show error state -->
{:else if $isLoading}
  <!-- Show loading state -->
{/if}
```

### **In Utilities**

```typescript
import { initializationActions, getCurrentInitializationState } from '$lib/stores/viewport/instantiate';

// Update state
initializationActions.setSectionsInitialized(true);
initializationActions.setError('Something went wrong');

// Get current state synchronously
const state = getCurrentInitializationState();
if (state.sectionsInitialized) {
  // Do something
}
```

## 🎨 Best Practices

### **1. State Management**
- ✅ Use derived stores for computed values
- ✅ Keep stores focused and single-purpose
- ✅ Use actions for state updates
- ✅ Provide type safety

### **2. Error Handling**
- ✅ Centralized error state
- ✅ Clear error messages
- ✅ Automatic loading state management
- ✅ Graceful degradation

### **3. Development Experience**
- ✅ Development helpers (`logInitializationState`)
- ✅ Detailed console logging
- ✅ Type safety throughout
- ✅ Clear deprecation warnings

### **4. Performance**
- ✅ Lazy loading of components
- ✅ Minimal re-renders with derived stores
- ✅ Efficient state updates
- ✅ Memory cleanup

## 🔄 Migration Guide

### **From Old System**
```typescript
// ❌ Old way
import { sectionsInitialized } from '$lib/utils/viewport/instantiate';

// ✅ New way
import { sectionsInitialized } from '$lib/stores/viewport/instantiate';
// or
import { sectionsInitialized } from '$lib/stores/viewport';
```

### **State Updates**
```typescript
// ❌ Old way
sectionsInitialized.set(true);

// ✅ New way
import { initializationActions } from '$lib/stores/viewport/instantiate';
initializationActions.setSectionsInitialized(true);
```

## 🧪 Testing

The new architecture makes testing easier:

```typescript
import { initializationActions, getCurrentInitializationState } from '$lib/stores/viewport/instantiate';

// Test state changes
initializationActions.setSectionsInitialized(true);
const state = getCurrentInitializationState();
expect(state.sectionsInitialized).toBe(true);
```

## 🚀 Future Enhancements

1. **Persistence**: Add localStorage persistence for initialization state
2. **Analytics**: Track initialization performance
3. **Caching**: Cache loaded components
4. **Progressive Loading**: Implement progressive section loading
5. **Error Recovery**: Add automatic retry mechanisms

## 📚 Related Files

- `STATE_VISIBILITY_USAGE.md` - Component visibility patterns
- `README.md` - General viewport documentation
- `VisibilityDemo.svelte` - Example implementations