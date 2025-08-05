import type { Sections } from "$lib/types";
import { sections } from "$lib/const/control/section";
import { initializeComponentVisibility } from "$lib/utils/monitor/section/initialize";
import { initializationActions } from "$lib/stores/viewport/instantiate";
import { initializeHighlights } from "$lib/stores/viewport/highlight";

/**
 * Initialization Logic
 * 
 * This module contains the business logic for initializing the application.
 * It uses the state management stores for tracking initialization progress.
 * 
 * Separation of concerns:
 * - State management: /lib/stores/viewport/instantiate.ts
 * - Business logic: /lib/utils/viewport/initialization.ts (this file)
 */

// ============================================================================
// COMPONENT LOADING
// ============================================================================

/**
 * Lazy load components to avoid circular imports
 * @param componentName - Name of the component to load
 * @returns Promise that resolves to the component or null if failed
 */
const loadComponent = async (componentName: string) => {
  try {
    switch (componentName) {
      case 'HeroSection':
        return (await import('$lib/modules/hero/Index.svelte')).default;
      case 'VideoHighlightSection':
        return (await import('$lib/modules/video-highlight/Index.svelte')).default;
      case 'ExperienceSection':
        return (await import('$lib/modules/experience/Index.svelte')).default;
      case 'ChefSection':
        return (await import('$lib/modules/chef/Index.svelte')).default;
      case 'MenuSection':
        return (await import('$lib/modules/menu/Index.svelte')).default;
      case 'ReservationSection':
        return (await import('$lib/modules/reservation/Index.svelte')).default;
      case 'FooterSection':
        return (await import('$lib/modules/footer/Index.svelte')).default;
      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to load component ${componentName}:`, error);
    return null;
  }
};

// ============================================================================
// INITIALIZATION FUNCTIONS
// ============================================================================

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

// ============================================================================
// MAIN INITIALIZATION FUNCTION
// ============================================================================

/**
 * Unified initialization function - handles everything in correct order
 * Uses the state management stores to track progress
 * 
 * 1. Initialize highlights
 * 2. Initialize component visibility (hide components before sections render)
 * 3. Load section components
 * 4. Update state stores accordingly
 * 
 * @returns Promise that resolves when all initialization is complete
 */
export const initializeApp = async (): Promise<{
  sections: Sections;
  sectionsReady: boolean;
}> => {
  try {
    initializationActions.setLoading(true);
    initializationActions.setError(null);
    
    const initializedSections = await initializeSections();

    await initializeHighlights();
    await initializeComponentVisibility();

    initializationActions.setComponentsInitialized(true);
    initializationActions.setSectionsInitialized(true);
    initializationActions.setHighlightsInitialized(true);
    
    return {
      sections: initializedSections,
      sectionsReady: true
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
    initializationActions.setError(errorMessage);

    throw error;
  } finally {
    initializationActions.setLoading(false);
  }
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use initializeApp() instead for better state management
 */
export const initializeViewportData = async (): Promise<{
  sections: Sections;
}> => {
  try {
    const initializedSections = await initializeSections();
    
    await initializeHighlights();
    
    return {
      sections: initializedSections
    };
  } catch (error) {
    throw error;
  }
};