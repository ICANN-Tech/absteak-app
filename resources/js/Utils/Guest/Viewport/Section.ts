import { get } from 'svelte/store';
import { SectionEnum } from '../../../Enums/Guest/Section';
import {
  sectionsStore,
  navigationStore,
  sectionLoadingStore,
  setActiveSection,
  getSectionConfig,
  getNavigationState,
  getAllSectionIds,
  getSectionIndex,
  getSectionByIndex,
  hasNextSection,
  hasPreviousSection,
  currentSectionIndex,
  visibleSections,
  setNavigationLoading,
  updateSection
} from '../../../Stores/Guest/Viewport/Section';
import type { SectionConfig, SectionOptions } from '../../../Stores/Guest/Viewport/Section';
import {
  syncWithSectionChange,
  jumpToHighlightBySectionId,
  nextHighlight,
  previousHighlight
} from '../../../Stores/Guest/Viewport/Highlight';
import {
  ComponentId,
  showComponent,
  hideComponent
} from '../../../Stores/Guest/Viewport/Visibility';

// Type for Svelte components that can be dynamically imported
/**
 * Type definition for Svelte component constructors
 * Ensures type safety for dynamically loaded components
 */
type ComponentType = any;

/**
 * Section Navigation Utilities
 * 
 * Provides comprehensive section navigation functionality including:
 * - Direct section jumping with SectionEnum
 * - Next/previous navigation
 * - Component loading integration
 * - Smooth scrolling and transitions
 * - State synchronization with viewport stores
 * 
 * @module SectionNavigation
 * @version 1.0.0
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Interface for section data structure
 */
export interface SectionData {
	id: string;
	component?: any;
	[key: string]: any;
}

/**
 * Navigation direction for next/previous operations
 */
export type NavigationDirection = 'next' | 'previous';

/**
 * Component loading configuration
 */
export interface ComponentLoadConfig {
  /** Whether to preload adjacent components */
  preloadAdjacent?: boolean;
  /** Timeout for component loading in milliseconds */
  loadTimeout?: number;
  /** Whether to show loading indicator */
  showLoadingIndicator?: boolean;
}

/**
 * Animation direction for section transitions
 */
export type AnimationDirection = 'up' | 'down' | 'none';

/**
 * Animation configuration for section transitions
 */
export interface AnimationConfig {
  /** Animation direction */
  direction?: AnimationDirection;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Animation easing function */
  easing?: string;
  /** Whether to use slide animation */
  useSlideAnimation?: boolean;
}

/**
 * Scroll behavior configuration for section navigation
 */
export interface ScrollConfig {
  /** Scroll behavior type */
  behavior?: ScrollBehavior;
  /** Whether to offset for fixed headers */
  offsetForHeader?: boolean;
  /** Custom scroll offset in pixels */
  customOffset?: number;
  /** Duration for smooth scroll animation */
  duration?: number;
  /** Animation configuration */
  animation?: AnimationConfig;
}

/**
 * Complete navigation options
 */
export interface NavigationOptions extends SectionOptions {
  /** Component loading configuration */
  componentConfig?: ComponentLoadConfig;
  /** Scroll behavior configuration */
  scrollConfig?: ScrollConfig;
  /** Whether to manage component visibility automatically */
  manageVisibility?: boolean;
  /** Animation direction override */
  animationDirection?: AnimationDirection;
  /** Callback function after navigation completes */
  onComplete?: (section: SectionEnum) => void;
  /** Callback function if navigation fails */
  onError?: (error: Error) => void;
}

// ============================================================================
// COMPONENT LOADING UTILITIES
// ============================================================================

/**
 * Lazy load components to avoid circular imports
 * @param sectionId - Section enum identifier to load
 * @returns Promise that resolves to the component or null if failed
 */
const loadComponent = async (sectionId: SectionEnum): Promise<ComponentType | null> => {
  try {
    switch (sectionId) {
      case SectionEnum.Hero:
        return (await import('@Modules/Guest/Hero/Index.svelte')).default;
      case SectionEnum.VideoHighlight:
        return (await import('@Modules/Guest/VideoHighlight/Index.svelte')).default;
      case SectionEnum.Experience:
        return (await import('@Modules/Guest/OurExperience/Index.svelte')).default;
      case SectionEnum.Chef:
        return (await import('@Modules/Guest/OurChef/Index.svelte')).default;
      case SectionEnum.Menu:
        return (await import('@Modules/Guest/Menu/Index.svelte')).default;
      case SectionEnum.Booking:
        return (await import('@Modules/Guest/Reservation/Index.svelte')).default;
      case SectionEnum.Footer:
        return (await import('@Modules/Guest/Footer/Index.svelte')).default;
      default:
        console.warn(`Unknown section ID: ${sectionId}`);
        return null;
    }
  } catch (error) {
    console.error(`Failed to load component for section ${sectionId}:`, error);
    return null;
  }
};

// Component mapping is now handled directly in loadComponent function

/**
 * Loads a component for a specific section
 * @param sectionId - Section to load component for
 * @param config - Loading configuration
 * @returns Promise that resolves when component is loaded
 */
export async function loadSectionComponent(
  sectionId: SectionEnum,
  config: ComponentLoadConfig = {}
): Promise<ComponentType | null> {
  const { loadTimeout = 5000, showLoadingIndicator = true } = config;
  
  // Check if component is already loaded
  const sectionConfig = getSectionConfig(sectionId);
  if (sectionConfig?.component) {
    return sectionConfig.component;
  }
  
  // Set loading state
  if (showLoadingIndicator) {
    sectionLoadingStore.update(loading => {
      loading.set(sectionId, true);
      return loading;
    });
  }
  
  try {
    // Load component with timeout
    const component = await Promise.race([
      loadComponent(sectionId),
      new Promise<null>((_, reject) => 
        setTimeout(() => reject(new Error('Component load timeout')), loadTimeout)
      )
    ]);
    
    if (component) {
      // Update section with loaded component
      updateSection(sectionId, { component });
    }
    
    return component;
  } catch (error) {
    console.error(`Failed to load component for section ${sectionId}:`, error);
    return null;
  } finally {
    // Clear loading state
    if (showLoadingIndicator) {
      sectionLoadingStore.update(loading => {
        loading.delete(sectionId);
        return loading;
      });
    }
  }
}

/**
 * Preloads components for adjacent sections
 * @param currentSectionId - Current section
 */
export async function preloadAdjacentComponents(currentSectionId: SectionEnum): Promise<void> {
  const currentIndex = getSectionIndex(currentSectionId);
  const sections = get(visibleSections);
  
  const preloadPromises: Promise<ComponentType | null>[] = [];
  
  // Preload previous section
  if (currentIndex > 0) {
    const prevSection = sections[currentIndex - 1];
    if (prevSection && !prevSection.component) {
      preloadPromises.push(loadSectionComponent(prevSection.id, { showLoadingIndicator: false }));
    }
  }
  
  // Preload next section
  if (currentIndex < sections.length - 1) {
    const nextSection = sections[currentIndex + 1];
    if (nextSection && !nextSection.component) {
      preloadPromises.push(loadSectionComponent(nextSection.id, { showLoadingIndicator: false }));
    }
  }
  
  // Wait for all preloads to complete (but don't throw on errors)
  await Promise.allSettled(preloadPromises);
}

// ============================================================================
// SCROLLING UTILITIES
// ============================================================================

/**
 * Gets the DOM element for a section
 * @param sectionId - Section identifier
 * @returns DOM element or null if not found
 */
function getSectionElement(sectionId: SectionEnum): Element | null {
  // Try multiple possible selectors
  const selectors = [
    `#${sectionId}`,
    `#section-${sectionId.toLowerCase()}`,
    `[data-section="${sectionId}"]`,
    `[data-section-id="${sectionId}"]`,
    `.section-${sectionId.toLowerCase()}`
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
  }
  
  return null;
}

/**
 * Determines animation direction based on section navigation
 * @param fromSection - Current section
 * @param toSection - Target section
 * @returns Animation direction
 */
function getAnimationDirection(fromSection: SectionEnum, toSection: SectionEnum): AnimationDirection {
  const sectionOrder = [
    SectionEnum.Hero,
    SectionEnum.VideoHighlight,
    SectionEnum.Experience,
    SectionEnum.Chef,
    SectionEnum.Menu,
    SectionEnum.Booking,
    SectionEnum.Footer
  ];
  
  const fromIndex = sectionOrder.indexOf(fromSection);
  const toIndex = sectionOrder.indexOf(toSection);
  
  if (fromIndex === -1 || toIndex === -1) {
    return 'none';
  }
  
  return toIndex > fromIndex ? 'down' : 'up';
}

/**
 * Creates CSS animation styles for section transitions
 * @param direction - Animation direction
 * @param config - Animation configuration
 * @returns CSS animation styles
 */
function createAnimationStyles(direction: AnimationDirection, config: AnimationConfig): string {
  const { duration = 800, easing = 'cubic-bezier(0.4, 0.0, 0.2, 1)' } = config;
  
  if (direction === 'none') {
    return '';
  }
  
  const translateY = direction === 'down' ? '-100vh' : '100vh';
  
  return `
    @keyframes slideSection${direction === 'down' ? 'Down' : 'Up'} {
      0% {
        transform: translateY(${direction === 'down' ? '100vh' : '-100vh'});
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    .section-slide-${direction} {
      animation: slideSection${direction === 'down' ? 'Down' : 'Up'} ${duration}ms ${easing} forwards;
    }
  `;
}

/**
 * Applies animation to section element
 * @param element - Section element
 * @param direction - Animation direction
 * @param config - Animation configuration
 * @returns Promise that resolves when animation completes
 */
function applySectionAnimation(
  element: Element,
  direction: AnimationDirection,
  config: AnimationConfig
): Promise<void> {
  return new Promise((resolve) => {
    if (direction === 'none' || !config.useSlideAnimation) {
      resolve();
      return;
    }
    
    const { duration = 800 } = config;
    
    // Inject animation styles if not already present
    const styleId = `section-animation-styles-${direction}`;
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = createAnimationStyles(direction, config);
      document.head.appendChild(styleElement);
    }
    
    // Apply animation class
    const animationClass = `section-slide-${direction}`;
    element.classList.add(animationClass);
    
    // Remove animation class after completion
    const cleanup = () => {
      element.classList.remove(animationClass);
      resolve();
    };
    
    // Listen for animation end
    element.addEventListener('animationend', cleanup, { once: true });
    
    // Fallback timeout
    setTimeout(cleanup, duration + 100);
  });
}

/**
 * Scrolls to a specific section with smooth animation and slide transitions
 * @param sectionId - Section to scroll to
 * @param config - Scroll configuration
 * @param fromSection - Current section for animation direction
 * @returns Promise that resolves when scroll completes
 */
export async function scrollToSection(
  sectionId: SectionEnum,
  config: ScrollConfig = {},
  fromSection?: SectionEnum
): Promise<void> {
  const {
    behavior = 'smooth',
    offsetForHeader = true,
    customOffset = 0,
    duration = 600,
    animation = {
      useSlideAnimation: true,
      duration: 600,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  } = config;
  
  const element = getSectionElement(sectionId);
  if (!element) {
    throw new Error(`Section element not found for ${sectionId}`);
  }
  
  // Determine animation direction
  let animationDirection: AnimationDirection = 'none';
  if (fromSection && animation.useSlideAnimation) {
    animationDirection = config.animation?.direction || getAnimationDirection(fromSection, sectionId);
  }
  
  const rect = element.getBoundingClientRect();
  let targetY = window.pageYOffset + rect.top;
  
  // Apply header offset
  if (offsetForHeader) {
    const header = document.querySelector('header, .header, .navbar');
    if (header) {
      targetY -= header.getBoundingClientRect().height;
    }
  }
  
  // Apply custom offset
  targetY += customOffset;
  
  try {
     // Apply enhanced scroll animation without blocking
     if (animation.useSlideAnimation && animationDirection !== 'none') {
       // Apply subtle transform animation
       const htmlElement = element as HTMLElement;
       const translateY = animationDirection === 'down' ? '-20px' : '20px';
       htmlElement.style.transition = `transform ${animation.duration}ms ${animation.easing}, opacity ${animation.duration}ms ${animation.easing}`;
       htmlElement.style.transform = `translateY(${translateY})`;
       htmlElement.style.opacity = '0.8';
       
       // Perform smooth scroll
       window.scrollTo({
         top: targetY,
         behavior: 'smooth'
       });
       
       // Reset transform after brief delay
       setTimeout(() => {
         htmlElement.style.transform = 'translateY(0)';
         htmlElement.style.opacity = '1';
         
         // Clean up styles after animation
         setTimeout(() => {
           htmlElement.style.transition = '';
           htmlElement.style.transform = '';
           htmlElement.style.opacity = '';
         }, animation.duration);
       }, 100);
     } else {
       // Simple smooth scroll
       window.scrollTo({
         top: targetY,
         behavior: 'smooth'
       });
     }
    
    // Wait for scroll animation to complete
    await new Promise<void>(resolve => {
      const startTime = Date.now();
      const checkScroll = () => {
        if (Date.now() - startTime >= duration) {
          resolve();
        } else {
          requestAnimationFrame(checkScroll);
        }
      };
      checkScroll();
    });
  } catch (error) {
    console.error('Error during section scroll:', error);
    // Fallback to simple scroll
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  }
}

// ============================================================================
// VISIBILITY MANAGEMENT
// ============================================================================

/**
 * Manages component visibility based on section changes
 * @param sectionId - Current section
 */
function manageComponentVisibility(sectionId: SectionEnum): void {
  // Show ScrollIndicator only for Hero section
  if (sectionId === SectionEnum.Hero) {
    showComponent(ComponentId.ScrollIndicator);
  } else {
    hideComponent(ComponentId.ScrollIndicator);
  }
  
  // Add other component visibility rules here as needed
  // Example: Show/hide navigation, footer, etc. based on section
}

/**
 * Initializes component visibility for the current section
 */
export function initializeComponentVisibility(): void {
  const currentSection = getCurrentSection();
  manageComponentVisibility(currentSection);
}

// ============================================================================
// CORE NAVIGATION FUNCTIONS
// ============================================================================

/**
 * Jumps directly to a specific section with smooth slide animations
 * @param sectionId - Section to jump to
 * @param options - Navigation options
 * @returns Promise that resolves when navigation completes
 */
export async function jumpToSection(
  sectionId: SectionEnum,
  options: NavigationOptions = {}
): Promise<void> {
  const {
    componentConfig = {},
    scrollConfig = {
      animation: {
        useSlideAnimation: true,
        duration: 800,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
      }
    },
    triggerScroll = true,
    loadComponent: shouldLoadComponent = true,
    manageVisibility = true,
    animationDirection,
    onComplete,
    onError
  } = options;
  
  try {
    // Get current section for animation direction
    const currentSection = getCurrentSection();
    
    // Load component if needed (without loading state to avoid UI interference)
    if (shouldLoadComponent) {
      await loadSectionComponent(sectionId, componentConfig);
      
      // Preload adjacent components if configured
      if (componentConfig.preloadAdjacent) {
        preloadAdjacentComponents(sectionId).catch(console.warn);
      }
    }
    
    // Update section state
    setActiveSection(sectionId, options);
    
    // Manage component visibility based on section
    if (manageVisibility) {
      manageComponentVisibility(sectionId);
    }
    
    // Sync with highlight store
    syncWithSectionChange(sectionId, {
      triggerNavigation: false, // We're already handling navigation
      respectLocks: true
    });
    
    // Apply animation direction override if provided
    if (animationDirection && scrollConfig.animation) {
      scrollConfig.animation.direction = animationDirection;
    }
    
    // Scroll to section with animation if enabled
    if (triggerScroll) {
      await scrollToSection(sectionId, scrollConfig, currentSection);
    }
    
    // Call completion callback
    onComplete?.(sectionId);
  } catch (error) {
    const navigationError = error instanceof Error ? error : new Error('Navigation failed');
    console.error(`Failed to jump to section ${sectionId}:`, navigationError);
    onError?.(navigationError);
    throw navigationError;
  }
}

/**
 * Navigates to the next section with slide down animation
 * @param options - Navigation options
 * @returns Promise that resolves when navigation completes
 */
export async function navigateToNextSection(options: NavigationOptions = {}): Promise<void> {
  const hasNext = get(hasNextSection);
  if (!hasNext) {
    throw new Error('No next section available');
  }
  
  const currentIndex = get(currentSectionIndex);
  const sections = get(visibleSections);
  const nextSection = sections[currentIndex + 1];
  
  if (!nextSection) {
    throw new Error('Next section not found');
  }
  
  // Sync with highlight store for consistent state management
  nextHighlight({
    triggerNavigation: false, // We're handling navigation here
    respectLocks: true
  });
  
  // Force slide down animation for next section navigation
  const navigationOptions: NavigationOptions = {
    ...options,
    animationDirection: 'down',
    scrollConfig: {
      ...options.scrollConfig,
      animation: {
        useSlideAnimation: true,
        duration: 800,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        direction: 'down',
        ...options.scrollConfig?.animation
      }
    }
  };
  
  await jumpToSection(nextSection.id, navigationOptions);
}

/**
 * Navigates to the previous section with slide up animation
 * @param options - Navigation options
 * @returns Promise that resolves when navigation completes
 */
export async function navigateToPreviousSection(options: NavigationOptions = {}): Promise<void> {
  const hasPrev = get(hasPreviousSection);
  if (!hasPrev) {
    throw new Error('No previous section available');
  }
  
  const currentIndex = get(currentSectionIndex);
  const sections = get(visibleSections);
  const prevSection = sections[currentIndex - 1];
  
  if (!prevSection) {
    throw new Error('Previous section not found');
  }
  
  // Sync with highlight store for consistent state management
  previousHighlight({
    triggerNavigation: false, // We're handling navigation here
    respectLocks: true
  });
  
  // Force slide up animation for previous section navigation
  const navigationOptions: NavigationOptions = {
    ...options,
    animationDirection: 'up',
    scrollConfig: {
      ...options.scrollConfig,
      animation: {
        useSlideAnimation: true,
        duration: 800,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        direction: 'up',
        ...options.scrollConfig?.animation
      }
    }
  };
  
  await jumpToSection(prevSection.id, navigationOptions);
}

/**
 * Navigates in a specific direction
 * @param direction - Navigation direction
 * @param options - Navigation options
 * @returns Promise that resolves when navigation completes
 */
export async function navigateInDirection(
  direction: NavigationDirection,
  options: NavigationOptions = {}
): Promise<void> {
  if (direction === 'next') {
    await navigateToNextSection(options);
  } else {
    await navigateToPreviousSection(options);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets the current active section
 * @returns Current section ID
 */
export function getCurrentSection(): SectionEnum {
  return getNavigationState().currentSection;
}

/**
 * Gets the previous section
 * @returns Previous section ID or null
 */
export function getPreviousSection(): SectionEnum | null {
  return getNavigationState().previousSection;
}

/**
 * Checks if navigation is currently locked
 * @returns True if navigation is locked
 */
export function isNavigationLocked(): boolean {
  return getNavigationState().isLocked;
}

/**
 * Checks if navigation is currently loading
 * @returns True if navigation is loading
 */
export function isNavigationLoading(): boolean {
  return getNavigationState().isLoading;
}

/**
 * Gets navigation capabilities for current state
 * @returns Object with navigation capabilities
 */
export function getNavigationCapabilities(): {
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentIndex: number;
  totalSections: number;
} {
  const currentIndex = get(currentSectionIndex);
  const sections = get(visibleSections);
  
  return {
    canGoNext: get(hasNextSection),
    canGoPrevious: get(hasPreviousSection),
    currentIndex,
    totalSections: sections.length
  };
}

/**
 * Creates a navigation function for a specific section
 * @param sectionId - Section to create navigator for
 * @param defaultOptions - Default navigation options
 * @returns Navigation function
 */
export function createSectionNavigator(
  sectionId: SectionEnum,
  defaultOptions: NavigationOptions = {}
): () => Promise<void> {
  return () => jumpToSection(sectionId, defaultOptions);
}

/**
 * Batch loads multiple section components
 * @param sectionIds - Sections to load
 * @param config - Loading configuration
 * @returns Promise that resolves when all components are loaded
 */
export async function batchLoadSectionComponents(
  sectionIds: SectionEnum[],
  config: ComponentLoadConfig = {}
): Promise<(ComponentType | null)[]> {
  const loadPromises = sectionIds.map(sectionId => 
    loadSectionComponent(sectionId, { ...config, showLoadingIndicator: false })
  );
  
  const results = await Promise.allSettled(loadPromises);
  return results.map(result => 
    result.status === 'fulfilled' ? result.value : null
  );
}

/**
 * Initializes all section components
 * @param config - Loading configuration
 * @returns Promise that resolves when all sections are initialized
 */
export async function initializeAllSections(config: ComponentLoadConfig = {}): Promise<void> {
  const allSectionIds = getAllSectionIds();
  await batchLoadSectionComponents(allSectionIds, config);
}