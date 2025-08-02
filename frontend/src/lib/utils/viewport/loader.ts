import type { Section, ComponentType } from '$lib/types';

export interface ComponentCache {
  get: (path: string) => any;
  set: (path: string, component: any) => void;
  has: (path: string) => boolean;
  clear: () => void;
}

export interface LoadedComponents {
  [key: number]: any;
}

/**
 * Create component cache untuk menyimpan komponen yang sudah di-load
 */
export function createComponentCache(): ComponentCache {
  const cache = new Map<string, any>();

  return {
    get: (path: string) => cache.get(path),
    set: (path: string, component: any) => cache.set(path, component),
    has: (path: string) => cache.has(path),
    clear: () => cache.clear()
  };
}

/**
 * Dynamic component loader berdasarkan path
 */
export async function loadComponent(sectionComponent: ComponentType, cache?: ComponentCache): Promise<any> {
  // Cek cache terlebih dahulu jika ada
  if (cache && cache.has(sectionComponent.name)) {
    return cache.get(sectionComponent.name);
  }

  return sectionComponent;
}

/**
 * Preload komponen untuk section tertentu dan sekitarnya
 */
export async function preloadComponents(
  centerIndex: number,
  sections: Section[],
  loadedComponents: LoadedComponents,
  cache?: ComponentCache
): Promise<LoadedComponents> {
  const indicesToLoad = [
    centerIndex - 1, // Previous
    centerIndex,     // Current
    centerIndex + 1  // Next
  ].filter(index => index >= 0 && index < sections.length);

  const loadPromises = indicesToLoad.map(async (index) => {
    if (!loadedComponents[index]) {
      const section = sections[index];
      if (section) {
        const component = await loadComponent(section.component, cache);
        if (component) {
          loadedComponents[index] = component;
        }
      }
    }
  });

  await Promise.all(loadPromises);
  
  // Return new object untuk trigger reactivity di Svelte
  return { ...loadedComponents };
}

/**
 * Preload semua komponen sekaligus (untuk performa yang lebih baik)
 */
export async function preloadAllComponents(
  sections: Section[],
  cache?: ComponentCache
): Promise<LoadedComponents> {
  const loadedComponents: LoadedComponents = {};

  const loadPromises = sections.map(async (section, index) => {
    const component = await loadComponent(section.component, cache);
    if (component) {
      loadedComponents[index] = component;
    }
  });

  await Promise.all(loadPromises);
  return loadedComponents;
}

/**
 * Hook untuk component loading dengan cache
 */
export function useComponentLoader(sections: Section[]) {
  const cache = createComponentCache();
  let loadedComponents: LoadedComponents = {};

  const preload = async (centerIndex: number) => {
    loadedComponents = await preloadComponents(centerIndex, sections, loadedComponents, cache);
    return loadedComponents;
  };

  const preloadAll = async () => {
    loadedComponents = await preloadAllComponents(sections, cache);
    return loadedComponents;
  };

  const getComponent = (index: number) => {
    return loadedComponents[index] || null;
  };

  const isLoaded = (index: number) => {
    return !!loadedComponents[index];
  };

  const clearCache = () => {
    cache.clear();
    loadedComponents = {};
  };

  return {
    preload,
    preloadAll,
    getComponent,
    isLoaded,
    clearCache,
    cache,
    get loadedComponents() {
      return loadedComponents;
    }
  };
}