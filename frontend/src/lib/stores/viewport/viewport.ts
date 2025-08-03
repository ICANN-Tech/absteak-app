/**
 * Viewport State Management System
 * 
 * This module provides centralized state management for viewport-related functionality including:
 * - Scroll position and behavior
 * - Section navigation and tracking
 * - Component visibility coordination
 * - Viewport dimensions and responsive breakpoints
 * - Mouse tracking and interaction states
 * 
 * @example Basic usage:
 * ```typescript
 * import { viewportState, viewportActions } from '$lib/stores/viewport/viewport';
 * 
 * // Subscribe to viewport state
 * viewportState.subscribe(state => {
 *   console.log('Current section:', state.currentSection);
 *   console.log('Scroll position:', state.scrollPosition);
 * });
 * 
 * // Navigate to section
 * viewportActions.navigateToSection('hero');
 * ```
 */

import { writable, derived, get } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import { SectionId, ComponentId } from '$lib/enums';

// ============================================================================
// TYPES
// ============================================================================

export interface ViewportDimensions {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
}

export interface ScrollState {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'none';
  isScrolling: boolean;
  isDisabled: boolean;
  velocity: number;
  lastScrollTime: number;
}

export interface MouseState {
  x: number;
  y: number;
  isTracking: boolean;
  lastMoveTime: number;
  isOverComponent: boolean;
  hoveredComponent: ComponentId | null;
}

export interface SectionState {
  currentSection: SectionId;
  previousSection: SectionId | null;
  targetSection: SectionId | null;
  isNavigating: boolean;
  navigationProgress: number; // 0-1
  sectionElements: Map<SectionId, HTMLElement>;
}

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  orientation: 'portrait' | 'landscape';
}

export interface ViewportState {
  dimensions: ViewportDimensions;
  scroll: ScrollState;
  mouse: MouseState;
  section: SectionState;
  responsive: ResponsiveState;
  isInitialized: boolean;
  lastUpdate: number;
}

export interface ViewportActions {
  // Scroll actions
  setScrollPosition: (x: number, y: number) => void;
  updateScrollDirection: (direction: 'up' | 'down' | 'none') => void;
  setScrolling: (isScrolling: boolean) => void;
  disableScroll: () => void;
  enableScroll: () => void;
  
  // Section actions
  navigateToSection: (sectionId: SectionId) => void;
  setCurrentSection: (sectionId: SectionId) => void;
  registerSectionElement: (sectionId: SectionId, element: HTMLElement) => void;
  unregisterSectionElement: (sectionId: SectionId) => void;
  
  // Mouse actions
  updateMousePosition: (x: number, y: number) => void;
  setMouseTracking: (isTracking: boolean) => void;
  setHoveredComponent: (componentId: ComponentId | null) => void;
  
  // Dimension actions
  updateDimensions: (dimensions: Partial<ViewportDimensions>) => void;
  updateResponsiveState: (responsive: Partial<ResponsiveState>) => void;
  
  // Utility actions
  initialize: () => void;
  reset: () => void;
}

// ============================================================================
// BREAKPOINT CONFIGURATION
// ============================================================================

const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialViewportState: ViewportState = {
  dimensions: {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0
  },
  scroll: {
    x: 0,
    y: 0,
    direction: 'none',
    isScrolling: false,
    isDisabled: false,
    velocity: 0,
    lastScrollTime: 0
  },
  mouse: {
    x: 0,
    y: 0,
    isTracking: false,
    lastMoveTime: 0,
    isOverComponent: false,
    hoveredComponent: null
  },
  section: {
    currentSection: SectionId.Hero,
    previousSection: null,
    targetSection: null,
    isNavigating: false,
    navigationProgress: 0,
    sectionElements: new Map()
  },
  responsive: {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    breakpoint: 'lg',
    orientation: 'landscape'
  },
  isInitialized: false,
  lastUpdate: Date.now()
};

// ============================================================================
// PRIVATE STORES
// ============================================================================

const _viewportState = writable<ViewportState>(initialViewportState);

// ============================================================================
// PUBLIC STORES
// ============================================================================

/**
 * Main viewport state store
 */
export const viewportState: Readable<ViewportState> = _viewportState;

/**
 * Derived stores for specific aspects of viewport state
 */
export const scrollState: Readable<ScrollState> = derived(
  _viewportState,
  ($state) => $state.scroll
);

export const sectionState: Readable<SectionState> = derived(
  _viewportState,
  ($state) => $state.section
);

export const mouseState: Readable<MouseState> = derived(
  _viewportState,
  ($state) => $state.mouse
);

export const responsiveState: Readable<ResponsiveState> = derived(
  _viewportState,
  ($state) => $state.responsive
);

export const dimensionsState: Readable<ViewportDimensions> = derived(
  _viewportState,
  ($state) => $state.dimensions
);

/**
 * Convenience derived stores
 */
export const currentSection: Readable<SectionId> = derived(
  _viewportState,
  ($state) => $state.section.currentSection
);

export const isScrolling: Readable<boolean> = derived(
  _viewportState,
  ($state) => $state.scroll.isScrolling
);

export const isMobile: Readable<boolean> = derived(
  _viewportState,
  ($state) => $state.responsive.isMobile
);

export const isNavigating: Readable<boolean> = derived(
  _viewportState,
  ($state) => $state.section.isNavigating
);

export const isScrollDisabled: Readable<boolean> = derived(
  _viewportState,
  ($state) => $state.scroll.isDisabled
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate responsive state based on dimensions
 */
function calculateResponsiveState(width: number, height: number): ResponsiveState {
  let breakpoint: ResponsiveState['breakpoint'] = 'xs';
  
  if (width >= BREAKPOINTS['2xl']) breakpoint = '2xl';
  else if (width >= BREAKPOINTS.xl) breakpoint = 'xl';
  else if (width >= BREAKPOINTS.lg) breakpoint = 'lg';
  else if (width >= BREAKPOINTS.md) breakpoint = 'md';
  else if (width >= BREAKPOINTS.sm) breakpoint = 'sm';
  
  return {
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    breakpoint,
    orientation: width > height ? 'landscape' : 'portrait'
  };
}

/**
 * Calculate scroll velocity
 */
function calculateScrollVelocity(currentY: number, previousY: number, timeDelta: number): number {
  if (timeDelta === 0) return 0;
  return Math.abs(currentY - previousY) / timeDelta;
}

// ============================================================================
// ACTIONS
// ============================================================================

export const viewportActions: ViewportActions = {
  // Scroll actions
  setScrollPosition: (x: number, y: number) => {
    _viewportState.update(state => {
      const now = Date.now();
      const timeDelta = now - state.scroll.lastScrollTime;
      const velocity = calculateScrollVelocity(y, state.scroll.y, timeDelta);
      
      let direction: 'up' | 'down' | 'none' = 'none';
      if (y > state.scroll.y) direction = 'down';
      else if (y < state.scroll.y) direction = 'up';
      
      return {
        ...state,
        scroll: {
          ...state.scroll,
          x,
          y,
          direction,
          velocity,
          lastScrollTime: now
        },
        lastUpdate: now
      };
    });
  },

  updateScrollDirection: (direction: 'up' | 'down' | 'none') => {
    _viewportState.update(state => ({
      ...state,
      scroll: {
        ...state.scroll,
        direction
      },
      lastUpdate: Date.now()
    }));
  },

  setScrolling: (isScrolling: boolean) => {
    _viewportState.update(state => ({
      ...state,
      scroll: {
        ...state.scroll,
        isScrolling
      },
      lastUpdate: Date.now()
    }));
  },

  disableScroll: () => {
    _viewportState.update(state => ({
      ...state,
      scroll: {
        ...state.scroll,
        isDisabled: true
      },
      lastUpdate: Date.now()
    }));
    
    // Apply CSS to disable scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  },

  enableScroll: () => {
    _viewportState.update(state => ({
      ...state,
      scroll: {
        ...state.scroll,
        isDisabled: false
      },
      lastUpdate: Date.now()
    }));
    
    // Remove CSS to enable scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  },

  // Section actions
  navigateToSection: (sectionId: SectionId) => {
    _viewportState.update(state => ({
      ...state,
      section: {
        ...state.section,
        targetSection: sectionId,
        isNavigating: true,
        navigationProgress: 0
      },
      lastUpdate: Date.now()
    }));
  },

  setCurrentSection: (sectionId: SectionId) => {
    _viewportState.update(state => ({
      ...state,
      section: {
        ...state.section,
        previousSection: state.section.currentSection,
        currentSection: sectionId,
        targetSection: null,
        isNavigating: false,
        navigationProgress: 1
      },
      lastUpdate: Date.now()
    }));
  },

  registerSectionElement: (sectionId: SectionId, element: HTMLElement) => {
    _viewportState.update(state => {
      const newSectionElements = new Map(state.section.sectionElements);
      newSectionElements.set(sectionId, element);
      
      return {
        ...state,
        section: {
          ...state.section,
          sectionElements: newSectionElements
        },
        lastUpdate: Date.now()
      };
    });
  },

  unregisterSectionElement: (sectionId: SectionId) => {
    _viewportState.update(state => {
      const newSectionElements = new Map(state.section.sectionElements);
      newSectionElements.delete(sectionId);
      
      return {
        ...state,
        section: {
          ...state.section,
          sectionElements: newSectionElements
        },
        lastUpdate: Date.now()
      };
    });
  },

  // Mouse actions
  updateMousePosition: (x: number, y: number) => {
    _viewportState.update(state => ({
      ...state,
      mouse: {
        ...state.mouse,
        x,
        y,
        lastMoveTime: Date.now()
      },
      lastUpdate: Date.now()
    }));
  },

  setMouseTracking: (isTracking: boolean) => {
    _viewportState.update(state => ({
      ...state,
      mouse: {
        ...state.mouse,
        isTracking
      },
      lastUpdate: Date.now()
    }));
  },

  setHoveredComponent: (componentId: ComponentId | null) => {
    _viewportState.update(state => ({
      ...state,
      mouse: {
        ...state.mouse,
        hoveredComponent: componentId,
        isOverComponent: componentId !== null
      },
      lastUpdate: Date.now()
    }));
  },

  // Dimension actions
  updateDimensions: (dimensions: Partial<ViewportDimensions>) => {
    _viewportState.update(state => {
      const newDimensions = { ...state.dimensions, ...dimensions };
      const responsive = calculateResponsiveState(newDimensions.width, newDimensions.height);
      
      return {
        ...state,
        dimensions: newDimensions,
        responsive,
        lastUpdate: Date.now()
      };
    });
  },

  updateResponsiveState: (responsive: Partial<ResponsiveState>) => {
    _viewportState.update(state => ({
      ...state,
      responsive: {
        ...state.responsive,
        ...responsive
      },
      lastUpdate: Date.now()
    }));
  },

  // Utility actions
  initialize: () => {
    _viewportState.update(state => ({
      ...state,
      isInitialized: true,
      lastUpdate: Date.now()
    }));
    
    console.log('🖥️ Viewport state management initialized');
  },

  reset: () => {
    _viewportState.set({
      ...initialViewportState,
      lastUpdate: Date.now()
    });
    
    console.log('🔄 Viewport state reset');
  }
};

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get current viewport state synchronously
 */
export const getCurrentViewportState = (): ViewportState => get(_viewportState);

/**
 * Get current section synchronously
 */
export const getCurrentSection = (): SectionId => get(_viewportState).section.currentSection;

/**
 * Get current scroll position synchronously
 */
export const getCurrentScrollPosition = (): { x: number; y: number } => {
  const state = get(_viewportState);
  return { x: state.scroll.x, y: state.scroll.y };
};

/**
 * Check if viewport is initialized
 */
export const isViewportInitialized = (): boolean => get(_viewportState).isInitialized;

/**
 * Get section element by ID
 */
export const getSectionElement = (sectionId: SectionId): HTMLElement | undefined => {
  return get(_viewportState).section.sectionElements.get(sectionId);
};

// ============================================================================
// DEVELOPMENT HELPERS
// ============================================================================

/**
 * Development helper to log current viewport state
 */
export const logViewportState = () => {
  if (import.meta.env.DEV) {
    const state = getCurrentViewportState();
    console.group('🖥️ Viewport State');
    console.log('Initialized:', state.isInitialized);
    console.log('Current Section:', state.section.currentSection);
    console.log('Scroll Position:', { x: state.scroll.x, y: state.scroll.y });
    console.log('Scroll Direction:', state.scroll.direction);
    console.log('Is Scrolling:', state.scroll.isScrolling);
    console.log('Mouse Position:', { x: state.mouse.x, y: state.mouse.y });
    console.log('Responsive:', state.responsive);
    console.log('Dimensions:', state.dimensions);
    console.groupEnd();
  }
};

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

/**
 * Legacy viewport store interface for backward compatibility
 */
export const viewportStore = {
  disableScroll: viewportActions.disableScroll,
  enableScroll: viewportActions.enableScroll,
  
  // Legacy section management methods
  setSections: (sections: any[]) => {
    // This is a no-op for backward compatibility
    // The new system manages sections differently
    console.log('🔄 setSections called (legacy compatibility mode)');
  },
  
  setCurrentSection: (index: number) => {
    // Convert index to SectionId for the new system
    // This assumes sections are in the same order as the SectionId enum
    const sectionIds = Object.values(SectionId);
    if (index >= 0 && index < sectionIds.length) {
      viewportActions.setCurrentSection(sectionIds[index] as SectionId);
    }
  },
  
  // Legacy scroll management methods
  setScrollDelay: (delay: number) => {
    // No-op for backward compatibility
    console.log('🔄 setScrollDelay called (legacy compatibility mode)');
  },
  
  toggleScroll: () => {
    // No-op for backward compatibility
    console.log('🔄 toggleScroll called (legacy compatibility mode)');
  },
  
  updateLastScrollTime: () => {
    // No-op for backward compatibility
    console.log('🔄 updateLastScrollTime called (legacy compatibility mode)');
  },
  
  setTransitioning: (isTransitioning: boolean) => {
    // No-op for backward compatibility
    console.log('🔄 setTransitioning called (legacy compatibility mode)');
  },
  
  // Legacy properties that might be accessed
  get canScroll() {
    return !get(_viewportState).scroll.isDisabled;
  },
  
  // Additional methods that might be needed
  subscribe: viewportState.subscribe,
  get: getCurrentViewportState,
  actions: viewportActions
};

// ============================================================================
// LEGACY STORE EXPORTS
// ============================================================================

/**
 * Legacy scroll enabled store for backward compatibility
 */
export const scrollEnabled = derived(_viewportState, ($state) => !$state.scroll.isDisabled);

/**
 * Legacy is transitioning store for backward compatibility
 */
export const isTransitioning = derived(_viewportState, ($state) => $state.section.isNavigating);

/**
 * Legacy current section index store for backward compatibility
 */
export const currentSectionIndex = derived(_viewportState, ($state) => {
  // Convert SectionId back to index for legacy compatibility
  const sectionIds = Object.values(SectionId);
  return sectionIds.indexOf($state.section.currentSection);
});

// Make utilities available globally in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).viewportState = viewportState;
  (window as any).viewportActions = viewportActions;
  (window as any).viewportStore = viewportStore;
  (window as any).logViewportState = logViewportState;
  (window as any).getCurrentViewportState = getCurrentViewportState;
}