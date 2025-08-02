/**
 * @deprecated This file has been refactored. Use the new files instead:
 * - State management: /lib/stores/viewport/instantiate.ts
 * - Business logic: /lib/utils/viewport/initialization.ts
 * 
 * This file is kept for backward compatibility and will be removed in a future version.
 */

import type { Sections } from "$lib/types";
import { sections } from "$lib/const/control/section";
import { initializeComponentVisibility } from "$lib/utils/monitor/section/initialize";
import { initializationActions } from "$lib/stores/viewport/instantiate";

// Re-export for backward compatibility
export { sectionsInitialized, componentsInitialized } from "$lib/stores/viewport/instantiate";

/**
 * Lazy load components to avoid circular imports
 * @param componentName - Name of the component to load
 * @returns Promise that resolves to the component or null if failed
 */
const loadComponent = async (componentName: string) => {
  try {
    switch (componentName) {
      case 'HeroSection':
        return (await import('$lib/components/organisms/section/hero/Index.svelte')).default;
      case 'VideoHighlightSection':
        return (await import('$lib/components/organisms/section/video-highlight/Index.svelte')).default;
      case 'ExperienceSection':
        return (await import('$lib/components/organisms/section/experience/Index.svelte')).default;
      case 'ChefSection':
        return (await import('$lib/components/organisms/section/chef/Index.svelte')).default;
      case 'MenuSection':
        return (await import('$lib/components/organisms/section/menu/Index.svelte')).default;
      case 'ReservationSection':
        return (await import('$lib/components/organisms/section/reservation/Index.svelte')).default;
      case 'FooterSection':
        return (await import('$lib/components/organisms/section/footer/Index.svelte')).default;
      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to load component ${componentName}:`, error);
    return null;
  }
};

/**
 * Initialize sections with lazy-loaded components
 * This function loads all section components dynamically to avoid circular imports
 * @returns Promise that resolves to the initialized sections array
 */
export const initializeSections = async (): Promise<Sections> => {
  const componentMap = [
    { index: 0, name: 'HeroSection' },
    { index: 1, name: 'VideoHighlightSection' },
    { index: 2, name: 'ExperienceSection' },
    { index: 3, name: 'ChefSection' },
    { index: 4, name: 'MenuSection' },
    { index: 5, name: 'ReservationSection' },
    { index: 6, name: 'FooterSection' }
  ];

  for (const { index, name } of componentMap) {
    const component = await loadComponent(name);
    if (component && sections[index]) {
      sections[index].component = component;
    }
  }

  return sections;
};

/**
 * Initialize highlights data with lazy loading
 * This function can be extended to handle highlight-specific initialization
 * @returns Promise that resolves when highlights are initialized
 */
export const initializeHighlights = async (): Promise<void> => {
  // This can be extended for highlight-specific initialization
  // For now, it's a placeholder for future highlight initialization logic
  console.log('Highlights initialized');
};

/**
 * Unified initialization function - handles everything in correct order
 * 1. Initialize component visibility (hide components before sections render)
 * 2. Load section components
 * 3. Set sections as initialized
 * @returns Promise that resolves when all initialization is complete
 */
export const initializeApp = async (): Promise<{
  sections: Sections;
  sectionsReady: boolean;
}> => {
  console.warn('⚠️ This function is deprecated. Use initializeApp from /lib/utils/viewport/initialization.ts instead.');
  
  try {
    console.log('🚀 Starting app initialization...');
    initializationActions.setLoading(true);
    
    // Step 1: Initialize component visibility FIRST (hide components before sections render)
    console.log('🔧 Initializing component visibility...');
    await initializeComponentVisibility();
    initializationActions.setComponentsInitialized(true);
    
    // Step 2: Load section components
    console.log('📦 Loading section components...');
    const initializedSections = await initializeSections();
    
    // Step 3: Initialize highlights
    await initializeHighlights();
    
    // Step 4: Mark sections as ready for rendering
    initializationActions.setSectionsInitialized(true);
    initializationActions.setLoading(false);
    
    console.log('✅ App initialization complete');
    
    return {
      sections: initializedSections,
      sectionsReady: true
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
    initializationActions.setError(errorMessage);
    console.error('❌ Failed to initialize app:', error);
    throw error;
  }
};

/**
 * Initialize all viewport-related data
 * This is the main initialization function that should be called on app startup
 * @returns Promise that resolves when all initialization is complete
 */
export const initializeViewportData = async (): Promise<{
  sections: Sections;
}> => {
  try {
    // Initialize sections
    const initializedSections = await initializeSections();
    
    // Initialize highlights
    await initializeHighlights();
    
    console.log('Viewport data initialization complete');
    
    return {
      sections: initializedSections
    };
  } catch (error) {
    console.error('Failed to initialize viewport data:', error);
    throw error;
  }
};