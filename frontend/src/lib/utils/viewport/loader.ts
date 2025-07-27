import type { Section } from '$lib/stores/viewport';

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
export async function loadComponent(sectionPath: string, cache?: ComponentCache): Promise<any> {
  // Cek cache terlebih dahulu jika ada
  if (cache && cache.has(sectionPath)) {
    return cache.get(sectionPath);
  }

  try {
    let component: any;

    // Dynamic import berdasarkan path
    switch (sectionPath) {
      case '$lib/components/Hero.svelte':
        component = (await import('$lib/components/Hero.svelte')).default;
        break;
      case '$lib/components/organisms/section/video-highlight/Index.svelte':
        component = (await import('$lib/components/organisms/section/video-highlight/Index.svelte')).default;
        break;
      case '$lib/components/organisms/section/experience/Index.svelte':
        component = (await import('$lib/components/organisms/section/experience/Index.svelte')).default;
        break;
      case '$lib/components/organisms/section/chef/Index.svelte':
        component = (await import('$lib/components/organisms/section/chef/Index.svelte')).default;
        break;
      case '$lib/components/organisms/section/menu/Index.svelte':
        component = (await import('$lib/components/organisms/section/menu/Index.svelte')).default;
        break;
      case '$lib/components/organisms/section/booking/Index.svelte':
        component = (await import('$lib/components/organisms/section/booking/Index.svelte')).default;
        break;
      case '$lib/components/CustomPartiesSlider.svelte':
        component = (await import('$lib/components/CustomPartiesSlider.svelte')).default;
        break;
      case '$lib/components/Footer.svelte':
        component = (await import('$lib/components/Footer.svelte')).default;
        break;
      default:
        // Fallback untuk path yang tidak dikenal
        try {
          const module = await import(/* @vite-ignore */ sectionPath);
          component = module.default;
        } catch (fallbackError) {
          console.error(`Failed to load component with fallback: ${sectionPath}`, fallbackError);
          return null;
        }
    }

    // Simpan ke cache jika ada
    if (cache && component) {
      cache.set(sectionPath, component);
    }

    return component;
  } catch (error) {
    console.error(`Failed to load component: ${sectionPath}`, error);
    return null;
  }
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
        const component = await loadComponent(section.path, cache);
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
    const component = await loadComponent(section.path, cache);
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