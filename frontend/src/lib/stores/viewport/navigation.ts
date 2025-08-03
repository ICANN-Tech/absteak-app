/**
 * Navigation State Management
 * 
 * This module manages navigation between sections with smooth scrolling,
 * transition effects, and navigation history tracking.
 * 
 * @example Basic usage:
 * ```typescript
 * import { navigationState, navigationActions } from '$lib/stores/viewport/navigation';
 * 
 * // Navigate to section
 * navigationActions.navigateToSection('menu', { smooth: true, duration: 800 });
 * 
 * // Subscribe to navigation state
 * navigationState.subscribe(state => {
 *   console.log('Current section:', state.currentSection);
 *   console.log('Navigation progress:', state.progress);
 * });
 * ```
 */

import { writable, derived, get } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import { SectionId } from '$lib/enums';

// ============================================================================
// TYPES
// ============================================================================

export interface NavigationOptions {
  smooth?: boolean;
  duration?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  offset?: number;
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

export interface NavigationHistoryEntry {
  sectionId: SectionId;
  timestamp: number;
  scrollPosition: { x: number; y: number };
  duration: number;
}

export interface NavigationState {
  currentSection: SectionId;
  previousSection: SectionId | null;
  targetSection: SectionId | null;
  isNavigating: boolean;
  progress: number; // 0-1
  startTime: number;
  duration: number;
  options: NavigationOptions;
  history: NavigationHistoryEntry[];
  maxHistorySize: number;
  canGoBack: boolean;
  canGoForward: boolean;
  historyIndex: number;
}

export interface NavigationActions {
  // Basic navigation
  navigateToSection: (sectionId: SectionId, options?: NavigationOptions) => Promise<void>;
  navigateToNext: (options?: NavigationOptions) => Promise<void>;
  navigateToPrevious: (options?: NavigationOptions) => Promise<void>;
  
  // History navigation
  goBack: (options?: NavigationOptions) => Promise<void>;
  goForward: (options?: NavigationOptions) => Promise<void>;
  clearHistory: () => void;
  
  // Progress tracking
  updateProgress: (progress: number) => void;
  completeNavigation: () => void;
  cancelNavigation: () => void;
  
  // Section management
  setCurrentSection: (sectionId: SectionId) => void;
  registerSectionOrder: (sections: SectionId[]) => void;
  
  // Utility
  reset: () => void;
}

// ============================================================================
// SECTION ORDER CONFIGURATION
// ============================================================================

const DEFAULT_SECTION_ORDER: SectionId[] = [
  SectionId.Hero,
  SectionId.VideoHighlight,
  SectionId.Experience,
  SectionId.Chef,
  SectionId.Menu,
  SectionId.Booking,
  SectionId.Footer
];

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialNavigationState: NavigationState = {
  currentSection: SectionId.Hero,
  previousSection: null,
  targetSection: null,
  isNavigating: false,
  progress: 0,
  startTime: 0,
  duration: 800,
  options: {
    smooth: true,
    duration: 800,
    easing: 'ease-in-out',
    offset: 0
  },
  history: [],
  maxHistorySize: 50,
  canGoBack: false,
  canGoForward: false,
  historyIndex: -1
};

// ============================================================================
// PRIVATE STORES
// ============================================================================

const _navigationState = writable<NavigationState>(initialNavigationState);
const _sectionOrder = writable<SectionId[]>(DEFAULT_SECTION_ORDER);

// ============================================================================
// PUBLIC STORES
// ============================================================================

/**
 * Main navigation state store
 */
export const navigationState: Readable<NavigationState> = _navigationState;

/**
 * Section order configuration
 */
export const sectionOrder: Readable<SectionId[]> = _sectionOrder;

/**
 * Derived stores for specific navigation aspects
 */
export const currentSection: Readable<SectionId> = derived(
  _navigationState,
  ($state) => $state.currentSection
);

export const isNavigating: Readable<boolean> = derived(
  _navigationState,
  ($state) => $state.isNavigating
);

export const navigationProgress: Readable<number> = derived(
  _navigationState,
  ($state) => $state.progress
);

export const navigationHistory: Readable<NavigationHistoryEntry[]> = derived(
  _navigationState,
  ($state) => $state.history
);

export const canNavigateBack: Readable<boolean> = derived(
  _navigationState,
  ($state) => $state.canGoBack
);

export const canNavigateForward: Readable<boolean> = derived(
  _navigationState,
  ($state) => $state.canGoForward
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get section index in the order
 */
function getSectionIndex(sectionId: SectionId, order: SectionId[]): number {
  return order.indexOf(sectionId);
}

/**
 * Get next section in order
 */
function getNextSection(currentSection: SectionId, order: SectionId[]): SectionId | null {
  const currentIndex = getSectionIndex(currentSection, order);
  if (currentIndex === -1 || currentIndex >= order.length - 1) return null;
  return order[currentIndex + 1];
}

/**
 * Get previous section in order
 */
function getPreviousSection(currentSection: SectionId, order: SectionId[]): SectionId | null {
  const currentIndex = getSectionIndex(currentSection, order);
  if (currentIndex <= 0) return null;
  return order[currentIndex - 1];
}

/**
 * Add entry to navigation history
 */
function addToHistory(
  state: NavigationState,
  sectionId: SectionId,
  scrollPosition: { x: number; y: number },
  duration: number
): NavigationState {
  const entry: NavigationHistoryEntry = {
    sectionId,
    timestamp: Date.now(),
    scrollPosition,
    duration
  };

  let newHistory = [...state.history];
  
  // If we're not at the end of history, remove forward entries
  if (state.historyIndex < newHistory.length - 1) {
    newHistory = newHistory.slice(0, state.historyIndex + 1);
  }
  
  newHistory.push(entry);
  
  // Limit history size
  if (newHistory.length > state.maxHistorySize) {
    newHistory = newHistory.slice(-state.maxHistorySize);
  }
  
  const newIndex = newHistory.length - 1;
  
  return {
    ...state,
    history: newHistory,
    historyIndex: newIndex,
    canGoBack: newIndex > 0,
    canGoForward: false
  };
}

/**
 * Smooth scroll to element
 */
async function smoothScrollToElement(
  element: HTMLElement,
  options: NavigationOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const startY = window.scrollY;
    const targetY = element.offsetTop + (options.offset || 0);
    const distance = targetY - startY;
    const duration = options.duration || 800;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      let easedProgress = progress;
      switch (options.easing) {
        case 'ease-in':
          easedProgress = progress * progress;
          break;
        case 'ease-out':
          easedProgress = 1 - (1 - progress) * (1 - progress);
          break;
        case 'ease-in-out':
          easedProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          break;
        default:
          easedProgress = progress;
      }
      
      const currentY = startY + distance * easedProgress;
      window.scrollTo(0, currentY);
      
      // Update progress
      navigationActions.updateProgress(progress);
      options.onProgress?.(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }
    
    options.onStart?.();
    requestAnimationFrame(animate);
  });
}

// ============================================================================
// ACTIONS
// ============================================================================

export const navigationActions: NavigationActions = {
  // Basic navigation
  navigateToSection: async (sectionId: SectionId, options: NavigationOptions = {}) => {
    const state = get(_navigationState);
    
    // Don't navigate if already navigating to the same section
    if (state.isNavigating && state.targetSection === sectionId) {
      return;
    }
    
    // Cancel current navigation if any
    if (state.isNavigating) {
      navigationActions.cancelNavigation();
    }
    
    const mergedOptions = { ...state.options, ...options };
    
    _navigationState.update(currentState => ({
      ...currentState,
      targetSection: sectionId,
      isNavigating: true,
      progress: 0,
      startTime: performance.now(),
      duration: mergedOptions.duration || 800,
      options: mergedOptions
    }));
    
    try {
      // Find section element
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) {
        throw new Error(`Section element not found: ${sectionId}`);
      }
      
      // Perform navigation
      if (mergedOptions.smooth) {
        await smoothScrollToElement(sectionElement, mergedOptions);
      } else {
        sectionElement.scrollIntoView({ behavior: 'auto' });
      }
      
      // Update state and history
      _navigationState.update(currentState => {
        const newState = addToHistory(
          currentState,
          sectionId,
          { x: window.scrollX, y: window.scrollY },
          mergedOptions.duration || 800
        );
        
        return {
          ...newState,
          previousSection: currentState.currentSection,
          currentSection: sectionId,
          targetSection: null,
          isNavigating: false,
          progress: 1
        };
      });
      
      mergedOptions.onComplete?.();
      console.log(`🧭 Navigated to section: ${sectionId}`);
      
    } catch (error) {
      console.error('Navigation failed:', error);
      navigationActions.cancelNavigation();
      mergedOptions.onCancel?.();
      throw error;
    }
  },

  navigateToNext: async (options: NavigationOptions = {}) => {
    const state = get(_navigationState);
    const order = get(_sectionOrder);
    const nextSection = getNextSection(state.currentSection, order);
    
    if (nextSection) {
      await navigationActions.navigateToSection(nextSection, options);
    } else {
      console.warn('No next section available');
    }
  },

  navigateToPrevious: async (options: NavigationOptions = {}) => {
    const state = get(_navigationState);
    const order = get(_sectionOrder);
    const previousSection = getPreviousSection(state.currentSection, order);
    
    if (previousSection) {
      await navigationActions.navigateToSection(previousSection, options);
    } else {
      console.warn('No previous section available');
    }
  },

  // History navigation
  goBack: async (options: NavigationOptions = {}) => {
    const state = get(_navigationState);
    
    if (!state.canGoBack || state.historyIndex <= 0) {
      console.warn('Cannot go back in navigation history');
      return;
    }
    
    const targetIndex = state.historyIndex - 1;
    const targetEntry = state.history[targetIndex];
    
    if (targetEntry) {
      _navigationState.update(currentState => ({
        ...currentState,
        historyIndex: targetIndex,
        canGoBack: targetIndex > 0,
        canGoForward: true
      }));
      
      await navigationActions.navigateToSection(targetEntry.sectionId, options);
    }
  },

  goForward: async (options: NavigationOptions = {}) => {
    const state = get(_navigationState);
    
    if (!state.canGoForward || state.historyIndex >= state.history.length - 1) {
      console.warn('Cannot go forward in navigation history');
      return;
    }
    
    const targetIndex = state.historyIndex + 1;
    const targetEntry = state.history[targetIndex];
    
    if (targetEntry) {
      _navigationState.update(currentState => ({
        ...currentState,
        historyIndex: targetIndex,
        canGoBack: true,
        canGoForward: targetIndex < currentState.history.length - 1
      }));
      
      await navigationActions.navigateToSection(targetEntry.sectionId, options);
    }
  },

  clearHistory: () => {
    _navigationState.update(state => ({
      ...state,
      history: [],
      historyIndex: -1,
      canGoBack: false,
      canGoForward: false
    }));
    
    console.log('🗑️ Navigation history cleared');
  },

  // Progress tracking
  updateProgress: (progress: number) => {
    _navigationState.update(state => ({
      ...state,
      progress: Math.max(0, Math.min(1, progress))
    }));
  },

  completeNavigation: () => {
    _navigationState.update(state => ({
      ...state,
      isNavigating: false,
      progress: 1,
      targetSection: null
    }));
  },

  cancelNavigation: () => {
    const state = get(_navigationState);
    
    _navigationState.update(currentState => ({
      ...currentState,
      isNavigating: false,
      progress: 0,
      targetSection: null
    }));
    
    state.options.onCancel?.();
    console.log('❌ Navigation cancelled');
  },

  // Section management
  setCurrentSection: (sectionId: SectionId) => {
    _navigationState.update(state => ({
      ...state,
      previousSection: state.currentSection,
      currentSection: sectionId
    }));
  },

  registerSectionOrder: (sections: SectionId[]) => {
    _sectionOrder.set(sections);
    console.log('📋 Section order registered:', sections);
  },

  // Utility
  reset: () => {
    _navigationState.set(initialNavigationState);
    _sectionOrder.set(DEFAULT_SECTION_ORDER);
    console.log('🔄 Navigation state reset');
  }
};

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get current navigation state synchronously
 */
export const getCurrentNavigationState = (): NavigationState => get(_navigationState);

/**
 * Get current section synchronously
 */
export const getCurrentSection = (): SectionId => get(_navigationState).currentSection;

/**
 * Check if navigation is in progress
 */
export const isCurrentlyNavigating = (): boolean => get(_navigationState).isNavigating;

/**
 * Get section order synchronously
 */
export const getSectionOrder = (): SectionId[] => get(_sectionOrder);

// ============================================================================
// DEVELOPMENT HELPERS
// ============================================================================

/**
 * Development helper to log navigation state
 */
export const logNavigationState = () => {
  if (import.meta.env.DEV) {
    const state = getCurrentNavigationState();
    console.group('🧭 Navigation State');
    console.log('Current Section:', state.currentSection);
    console.log('Previous Section:', state.previousSection);
    console.log('Target Section:', state.targetSection);
    console.log('Is Navigating:', state.isNavigating);
    console.log('Progress:', state.progress);
    console.log('History Length:', state.history.length);
    console.log('Can Go Back:', state.canGoBack);
    console.log('Can Go Forward:', state.canGoForward);
    console.groupEnd();
  }
};

// Make utilities available globally in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).navigationState = navigationState;
  (window as any).navigationActions = navigationActions;
  (window as any).logNavigationState = logNavigationState;
}