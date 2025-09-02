import { writable, derived, get } from "svelte/store";
import { HighlightEnum, SectionEnum } from "@Enums/Guest/Index";
import type { Highlights, Highlight } from "../../../Types/Guest/Highlight.type";

/**
 * Enhanced Highlight State Management System
 * 
 * Provides comprehensive highlight functionality for navigation sections with:
 * - Dynamic highlight tracking and management
 * - Add/remove highlights capability
 * - Consistent state management across the application
 * - Circular dependency resolution
 * 
 * @module HighlightStore
 * @version 2.0.0
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Represents the state of a highlighted element
 */
export interface HighlightState {
  /** Unique identifier for the highlight */
  id: string;
  /** Display name of the highlight */
  name: string;
  /** Associated section ID */
  sectionId: string;
  /** Whether the highlight is currently active */
  isActive: boolean;
  /** Whether the highlight is locked from changes */
  isLocked: boolean;
  /** Custom data associated with the highlight */
  metadata?: Record<string, any>;
}

/**
 * Configuration options for highlight operations
 */
export interface HighlightOptions {
  /** Whether to trigger navigation when highlighting */
  triggerNavigation?: boolean;
  /** Whether to respect locked state */
  respectLocks?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Custom callback after highlight change */
  onComplete?: (highlightId: string) => void;
}

/**
 * Target for highlight operations - can be single ID or array of IDs
 */
export type HighlightTarget = string | string[];

// ============================================================================
// STORE DEFINITIONS
// ============================================================================

/** Current active highlight index */
export const currentHighlightIndex = writable<number>(0);

/** Transitioning state for animations */
export const isHighlightTransitioning = writable<boolean>(false);

/** Map of all highlight states by ID */
export const highlightStates = writable<Map<string, HighlightState>>(new Map());

/** Array of highlight data for compatibility */
export const highlightsData = writable<Highlights>([]);

/** Default highlight options */
const defaultOptions: HighlightOptions = {
  triggerNavigation: true,
  respectLocks: true,
  animationDuration: 300,
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize highlights with default data and setup reactive connections
 */
export const initializeHighlights = async (): Promise<void> => {
  try {
    // Try to load highlights from control file
    const { highlights } = await import('../../../Const/Guest/Control/Index');
    
    // Initialize highlight states
    const stateMap = new Map<string, HighlightState>();
    const highlightArray: Highlights = [];
    
    highlights.forEach((highlight: Highlight, index: number) => {
      const state: HighlightState = {
        id: highlight.id,
        name: highlight.name,
        sectionId: highlight.sectionId,
        isActive: index === 0, // First highlight is active by default
        isLocked: false,
        metadata: {}
      };
      
      stateMap.set(highlight.id, state);
      highlightArray.push(highlight);
    });
    
    highlightStates.set(stateMap);
    highlightsData.set(highlightArray);
    
  } catch (error) {
    console.warn('Failed to load highlights from control file, using fallback data:', error);
    
    // Fallback data with enhanced state management
    const fallbackHighlights: Highlight[] = [
      {
        id: HighlightEnum.VideoHighlight,
        name: 'Video Highlight',
        sectionId: SectionEnum.VideoHighlight
      },
      {
        id: HighlightEnum.Experience,
        name: 'Experience',
        sectionId: SectionEnum.Experience
      },
      {
        id: HighlightEnum.Chef,
        name: 'Chef',
        sectionId: SectionEnum.Chef
      },
      {
        id: HighlightEnum.Menu,
        name: 'Menu',
        sectionId: SectionEnum.Menu
      },
      {
        id: HighlightEnum.Booking,
        name: 'Reservation',
        sectionId: SectionEnum.Booking
      }
    ];
    
    const stateMap = new Map<string, HighlightState>();
    
    fallbackHighlights.forEach((highlight, index) => {
      const state: HighlightState = {
        id: highlight.id,
        name: highlight.name,
        sectionId: highlight.sectionId,
        isActive: index === 0,
        isLocked: false,
        metadata: {}
      };
      
      stateMap.set(highlight.id, state);
    });
    
    highlightStates.set(stateMap);
    highlightsData.set(fallbackHighlights);
  }
};


// ============================================================================
// DERIVED STORES
// ============================================================================

/**
 * Current active highlight derived from index and data
 */
export const currentHighlight = derived(
  [currentHighlightIndex, highlightsData],
  ([$currentIndex, $highlights]) => {
    if ($highlights && $highlights.length > 0 && $currentIndex >= 0 && $currentIndex < $highlights.length) {
      return $highlights[$currentIndex];
    }
    return null;
  }
);

/**
 * Active highlight states derived from the states map
 */
export const activeHighlights = derived(
  highlightStates,
  ($states) => {
    const active: HighlightState[] = [];
    $states.forEach((state) => {
      if (state.isActive) {
        active.push(state);
      }
    });
    return active;
  }
);

/**
 * Total count of highlights
 */
export const highlightCount = derived(
  highlightsData,
  ($highlights) => $highlights.length
);

// ============================================================================
// CORE HIGHLIGHT MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Add a new highlight to the system
 * @param highlight - The highlight to add
 * @param options - Configuration options
 */
export const addHighlight = (highlight: Highlight, options: HighlightOptions = {}): void => {
  const opts = { ...defaultOptions, ...options };
  
  const currentStates = get(highlightStates);
  const currentData = get(highlightsData);
  
  // Check if highlight already exists
  if (currentStates.has(highlight.id)) {
    console.warn(`Highlight with ID '${highlight.id}' already exists`);
    return;
  }
  
  // Create new highlight state
  const newState: HighlightState = {
    id: highlight.id,
    name: highlight.name,
    sectionId: highlight.sectionId,
    isActive: false,
    isLocked: false,
    metadata: {}
  };
  
  // Update stores
  const newStates = new Map(currentStates);
  newStates.set(highlight.id, newState);
  highlightStates.set(newStates);
  
  const newData = [...currentData, highlight];
  highlightsData.set(newData);
  
  opts.onComplete?.(highlight.id);
};

/**
 * Remove a highlight from the system
 * @param highlightId - ID of the highlight to remove
 * @param options - Configuration options
 */
export const removeHighlight = (highlightId: string, options: HighlightOptions = {}): void => {
  const opts = { ...defaultOptions, ...options };
  
  const currentStates = get(highlightStates);
  const currentData = get(highlightsData);
  
  // Check if highlight exists
  if (!currentStates.has(highlightId)) {
    console.warn(`Highlight with ID '${highlightId}' does not exist`);
    return;
  }
  
  // Check if locked
  const state = currentStates.get(highlightId);
  if (opts.respectLocks && state?.isLocked) {
    console.warn(`Cannot remove locked highlight '${highlightId}'`);
    return;
  }
  
  // Update stores
  const newStates = new Map(currentStates);
  newStates.delete(highlightId);
  highlightStates.set(newStates);
  
  const newData = currentData.filter(h => h.id !== highlightId);
  highlightsData.set(newData);
  
  // Adjust current index if necessary
  const currentIndex = get(currentHighlightIndex);
  const removedIndex = currentData.findIndex(h => h.id === highlightId);
  
  if (removedIndex !== -1 && currentIndex >= removedIndex && currentIndex > 0) {
    currentHighlightIndex.set(currentIndex - 1);
  } else if (newData.length === 0) {
    currentHighlightIndex.set(0);
  }
  
  opts.onComplete?.(highlightId);
};

/**
 * Activate a highlight by ID
 * @param highlightId - ID of the highlight to activate
 * @param options - Configuration options
 */
export const activateHighlight = (highlightId: string, options: HighlightOptions = {}): void => {
  const opts = { ...defaultOptions, ...options };
  
  const currentStates = get(highlightStates);
  const state = currentStates.get(highlightId);
  
  if (!state) {
    console.warn(`Highlight with ID '${highlightId}' does not exist`);
    return;
  }
  
  if (opts.respectLocks && state.isLocked) {
    console.warn(`Cannot activate locked highlight '${highlightId}'`);
    return;
  }
  
  // Deactivate all other highlights and activate the target
  const newStates = new Map(currentStates);
  newStates.forEach((s, id) => {
    s.isActive = id === highlightId;
  });
  
  highlightStates.set(newStates);
  
  // Update current index
  const currentData = get(highlightsData);
  const targetIndex = currentData.findIndex(h => h.id === highlightId);
  if (targetIndex !== -1) {
    currentHighlightIndex.set(targetIndex);
  }
  
  opts.onComplete?.(highlightId);
};

/**
 * Deactivate a highlight by ID
 * @param highlightId - ID of the highlight to deactivate
 * @param options - Configuration options
 */
export const deactivateHighlight = (highlightId: string, options: HighlightOptions = {}): void => {
  const opts = { ...defaultOptions, ...options };
  
  const currentStates = get(highlightStates);
  const state = currentStates.get(highlightId);
  
  if (!state) {
    console.warn(`Highlight with ID '${highlightId}' does not exist`);
    return;
  }
  
  if (opts.respectLocks && state.isLocked) {
    console.warn(`Cannot deactivate locked highlight '${highlightId}'`);
    return;
  }
  
  // Update state
  const newStates = new Map(currentStates);
  const updatedState = { ...state, isActive: false };
  newStates.set(highlightId, updatedState);
  highlightStates.set(newStates);
  
  opts.onComplete?.(highlightId);
};

/**
 * Toggle highlight activation state
 * @param highlightId - ID of the highlight to toggle
 * @param options - Configuration options
 */
export const toggleHighlight = (highlightId: string, options: HighlightOptions = {}): void => {
  const currentStates = get(highlightStates);
  const state = currentStates.get(highlightId);
  
  if (!state) {
    console.warn(`Highlight with ID '${highlightId}' does not exist`);
    return;
  }
  
  if (state.isActive) {
    deactivateHighlight(highlightId, options);
  } else {
    activateHighlight(highlightId, options);
  }
};

/**
 * Lock a highlight to prevent changes
 * @param target - Single highlight ID or array of IDs
 * @param options - Configuration options
 */
export const lockHighlight = (target: HighlightTarget, options: HighlightOptions = {}): void => {
  const opts = { ...defaultOptions, ...options };
  const targets = Array.isArray(target) ? target : [target];
  
  const currentStates = get(highlightStates);
  const newStates = new Map(currentStates);
  
  targets.forEach(highlightId => {
    const state = newStates.get(highlightId);
    if (state) {
      newStates.set(highlightId, { ...state, isLocked: true });
    }
  });
  
  highlightStates.set(newStates);
  
  targets.forEach(id => opts.onComplete?.(id));
};

/**
 * Unlock a highlight to allow changes
 * @param target - Single highlight ID or array of IDs
 * @param options - Configuration options
 */
export const unlockHighlight = (target: HighlightTarget, options: HighlightOptions = {}): void => {
  const opts = { ...defaultOptions, ...options };
  const targets = Array.isArray(target) ? target : [target];
  
  const currentStates = get(highlightStates);
  const newStates = new Map(currentStates);
  
  targets.forEach(highlightId => {
    const state = newStates.get(highlightId);
    if (state) {
      newStates.set(highlightId, { ...state, isLocked: false });
    }
  });
  
  highlightStates.set(newStates);
  
  targets.forEach(id => opts.onComplete?.(id));
};

// ============================================================================
// NAVIGATION AND UTILITY FUNCTIONS
// ============================================================================

/**
 * Jump to a specific highlight by index
 * @param index - Index of the highlight
 * @param options - Configuration options
 */
export const jumpToHighlight = (index: number, options: HighlightOptions = {}): void => {
  const opts = { ...defaultOptions, ...options };
  const highlights = get(highlightsData);
  
  if (index < 0 || index >= highlights.length) {
    console.warn(`Invalid highlight index: ${index}`);
    return;
  }
  
  const highlight = highlights[index];
  
  // Set transitioning state
  isHighlightTransitioning.set(true);
  
  // Update current index and activate highlight
  currentHighlightIndex.set(index);
  activateHighlight(highlight.id, { ...opts, triggerNavigation: false });
  
  // Handle navigation if enabled
  if (opts.triggerNavigation && highlight.sectionId) {
    // Use event-based navigation to avoid circular dependencies
    window.dispatchEvent(new CustomEvent('highlight:navigate', {
      detail: { sectionId: highlight.sectionId, highlightId: highlight.id }
    }));
  }
  
  // Reset transitioning state
  setTimeout(() => {
    isHighlightTransitioning.set(false);
    opts.onComplete?.(highlight.id);
  }, opts.animationDuration);
};

/**
 * Jump to highlight by ID
 * @param highlightId - ID of the highlight
 * @param options - Configuration options
 */
export const jumpToHighlightById = (highlightId: string, options: HighlightOptions = {}): void => {
  const highlights = get(highlightsData);
  const targetIndex = highlights.findIndex(h => h.id === highlightId);
  
  if (targetIndex !== -1) {
    jumpToHighlight(targetIndex, options);
  } else {
    console.warn(`Highlight with ID '${highlightId}' not found`);
  }
};

/**
 * Jump to highlight by section ID
 * @param sectionId - ID of the section
 * @param options - Configuration options
 */
export const jumpToHighlightBySectionId = (sectionId: string, options: HighlightOptions = {}): void => {
  const highlights = get(highlightsData);
  const targetIndex = highlights.findIndex(h => h.sectionId === sectionId);
  
  if (targetIndex !== -1) {
    jumpToHighlight(targetIndex, options);
  } else {
    console.warn(`Highlight with section ID '${sectionId}' not found`);
  }
};

/**
 * Navigate to next highlight
 * @param options - Configuration options
 */
export const nextHighlight = (options: HighlightOptions = {}): void => {
  const currentIndex = get(currentHighlightIndex);
  const highlights = get(highlightsData);
  const nextIndex = (currentIndex + 1) % highlights.length;
  
  jumpToHighlight(nextIndex, options);
};

/**
 * Navigate to previous highlight
 * @param options - Configuration options
 */
export const previousHighlight = (options: HighlightOptions = {}): void => {
  const currentIndex = get(currentHighlightIndex);
  const highlights = get(highlightsData);
  const prevIndex = currentIndex === 0 ? highlights.length - 1 : currentIndex - 1;
  
  jumpToHighlight(prevIndex, options);
};

/**
 * Get highlight state by ID
 * @param highlightId - ID of the highlight
 * @returns The highlight state or undefined
 */
export const getHighlightState = (highlightId: string): HighlightState | undefined => {
  const states = get(highlightStates);
  return states.get(highlightId);
};

/**
 * Check if a highlight is active
 * @param highlightId - ID of the highlight
 * @returns True if active, false otherwise
 */
export const isHighlightActive = (highlightId: string): boolean => {
  const state = getHighlightState(highlightId);
  return state?.isActive ?? false;
};

/**
 * Check if a highlight is locked
 * @param highlightId - ID of the highlight
 * @returns True if locked, false otherwise
 */
export const isHighlightLocked = (highlightId: string): boolean => {
  const state = getHighlightState(highlightId);
  return state?.isLocked ?? false;
};

/**
 * Reset all highlights to initial state
 * @param options - Configuration options
 */
export const resetAllHighlights = (options: HighlightOptions = {}): void => {
  const opts = { ...defaultOptions, ...options };
  
  // Reset stores
  currentHighlightIndex.set(0);
  isHighlightTransitioning.set(false);
  
  // Reset all highlight states
  const currentStates = get(highlightStates);
  const newStates = new Map(currentStates);
  
  newStates.forEach((state, id) => {
    if (!opts.respectLocks || !state.isLocked) {
      newStates.set(id, {
        ...state,
        isActive: false,
        isLocked: false
      });
    }
  });
  
  highlightStates.set(newStates);
  
  // Activate first highlight if available
  const highlights = get(highlightsData);
  if (highlights.length > 0) {
    activateHighlight(highlights[0].id, { ...opts, triggerNavigation: false });
  }
  
  opts.onComplete?.('reset');
};

/**
 * Sync highlight with section changes (for scroll events)
 * @param sectionId - ID of the section that became active
 * @param options - Configuration options
 */
export const syncWithSectionChange = (sectionId: string, options: HighlightOptions = {}): void => {
  const highlights = get(highlightsData);
  const targetIndex = highlights.findIndex(h => h.sectionId === sectionId);
  
  if (targetIndex !== -1) {
    const currentIndex = get(currentHighlightIndex);
    
    if (targetIndex !== currentIndex) {
      // Update without triggering navigation (since we're already at the section)
      currentHighlightIndex.set(targetIndex);
      activateHighlight(highlights[targetIndex].id, {
        ...options,
        triggerNavigation: false
      });
    }
  }
};

// ============================================================================
// HIGHLIGHT STORE OBJECT (for backward compatibility)
// ============================================================================

/**
 * Legacy highlight store object for backward compatibility
 * @deprecated Use individual functions instead
 */
export const highlightStore = {
  jumpToHighlight,
  jumpToHighlightById,
  jumpToHighlightBySectionId,
  nextHighlight,
  previousHighlight,
  reset: resetAllHighlights,
  updateHighlights: (newHighlights: Highlights) => {
    highlightsData.set(newHighlights);
    
    // Rebuild states map
    const stateMap = new Map<string, HighlightState>();
    newHighlights.forEach((highlight, index) => {
      const state: HighlightState = {
        id: highlight.id,
        name: highlight.name,
        sectionId: highlight.sectionId,
        isActive: index === 0,
        isLocked: false,
        metadata: {}
      };
      stateMap.set(highlight.id, state);
    });
    
    highlightStates.set(stateMap);
    
    // Reset index if out of bounds
    const currentIndex = get(currentHighlightIndex);
    if (currentIndex >= newHighlights.length) {
      currentHighlightIndex.set(0);
    }
  },
  syncWithSectionChange,
  syncWithSectionIndex: (sectionIndex: number) => {
    const highlights = get(highlightsData);
    if (sectionIndex >= 0 && sectionIndex < highlights.length) {
      currentHighlightIndex.set(sectionIndex);
      activateHighlight(highlights[sectionIndex].id, { triggerNavigation: false });
    }
  }
};