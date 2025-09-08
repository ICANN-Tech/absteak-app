import type { Sections } from '../../../Types/Guest/Section.type';
import { sections } from '../../../Const/Guest/Control/Section';
import { initializeHighlights } from '../../../Stores/Guest/Viewport/Highlight';
import { hideComponent, ComponentId } from '../../../Stores/Guest/Viewport/Visibility';
import { initializeComponentVisibility } from './Section';

/**
 * Initialization Logic
 * 
 * This module contains the business logic for initializing the application.
 * It uses the state management stores for tracking initialization progress.
 * 
 * Separation of concerns:
 * - State management: /Stores/Guest/Viewport/Instantiate.ts
 * - Business logic: /Utils/Guest/Viewport/Initialization.ts (this file)
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
        return (await import('../../../Modules/Guest/Hero/Index.svelte')).default;
      case 'VideoHighlightSection':
        return (await import('../../../Modules/Guest/VideoHighlight/Index.svelte')).default;
      case 'ExperienceSection':
        return (await import('../../../Modules/Guest/OurExperience/Index.svelte')).default;
      case 'ChefSection':
        return (await import('../../../Modules/Guest/OurChef/Index.svelte')).default;
      case 'MenuSection':
        return (await import('../../../Modules/Guest/Menu/Index.svelte')).default;
      case 'ReservationSection':
        return (await import('../../../Modules/Guest/Reservation/Index.svelte')).default;
      case 'FooterSection':
        return (await import('../../../Modules/Guest/Footer/Index.svelte')).default;
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
 * 
 * 1. Initialize highlights
 * 2. Initialize component visibility (hide components before sections render)
 * 3. Initialize section-based component visibility
 * 4. Load section components
 * 
 * @returns Promise that resolves when all initialization is complete
 */
export const initializeApp = async (): Promise<{
  sections: Sections;
  sectionsReady: boolean;
}> => {
  try {
    const initializedSections = await initializeSections();

    await initializeHighlights();
    
    // Hide components that should be initially hidden
    hideComponent([ComponentId.ChatBot, ComponentId.Sidebar]);
    
    // Initialize component visibility based on current section
    initializeComponentVisibility();
    
    return {
      sections: initializedSections,
      sectionsReady: true
    };
  } catch (error) {
    console.error('Initialization error:', error);
    throw error;
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