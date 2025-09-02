import { get } from 'svelte/store';
import {
  currentHighlightIndex,
  highlightsData,
  highlightStates,
  jumpToHighlight,
  jumpToHighlightById,
  jumpToHighlightBySectionId,
  nextHighlight as storeNextHighlight,
  previousHighlight as storePreviousHighlight,
  resetAllHighlights,
  highlightCount,
  activateHighlight,
  deactivateHighlight,
  toggleHighlight,
  lockHighlight,
  unlockHighlight,
  addHighlight,
  removeHighlight,
  getHighlightState,
  isHighlightActive,
  isHighlightLocked,
  syncWithSectionChange,
  activeHighlights
} from '../../../Stores/Guest/Viewport/Highlight';
import type { Highlights, Highlight } from '../../../Types/Guest/highlight.type';
import type { HighlightState, HighlightOptions } from '../../../Stores/Guest/Viewport/Highlight';
/**
 * Scroll to specific highlight by index
 */
export const scrollToHighlight = (index: number): void => {
  jumpToHighlight(index);
};

/**
 * Scroll to highlight by ID
 */
export const scrollToHighlightById = (highlightId: string): void => {
  jumpToHighlightById(highlightId);
};

/**
 * Get current highlight index
 */
export const getCurrentHighlightIndex = (): number => {
  return get(currentHighlightIndex);
};

/**
 * Get highlights data
 */
export const getHighlightsData = (): Highlights => {
  return get(highlightsData);
};

/**
 * Go to next highlight
 */
export const nextHighlight = (): void => {
  storeNextHighlight();
};

/**
 * Go to previous highlight
 */
export const previousHighlight = (): void => {
  storePreviousHighlight();
};

/**
 * Reset highlight to first
 */
export const resetHighlight = (): void => {
  resetAllHighlights();
};

/**
 * Update highlights data
 */
export const updateHighlights = (newHighlights: Highlights): void => {
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
};

/**
 * Get highlight by index
 */
export const getHighlightByIndex = (index: number) => {
  const highlights = getHighlightsData();
  return highlights[index] || null;
};

/**
 * Get highlight by ID
 */
export const getHighlightById = (highlightId: string) => {
  const highlights = getHighlightsData();
  return highlights.find(highlight => highlight.id === highlightId) || null;
};

/**
 * Check if highlight index is valid
 */
export const isValidHighlightIndex = (index: number): boolean => {
  const highlights = getHighlightsData();
  return index >= 0 && index < highlights.length;
};

/**
 * Get total highlights count
 */
export const getHighlightsCount = (): number => {
  return get(highlightCount);
};

/**
 * Scroll to highlight by section ID
 */
export const scrollToHighlightBySectionId = (sectionId: string): void => {
  jumpToHighlightBySectionId(sectionId);
};

/**
 * Activate a highlight by ID
 */
export const activateHighlightById = (highlightId: string, options?: HighlightOptions): void => {
  activateHighlight(highlightId, options);
};

/**
 * Deactivate a highlight by ID
 */
export const deactivateHighlightById = (highlightId: string, options?: HighlightOptions): void => {
  deactivateHighlight(highlightId, options);
};

/**
 * Toggle highlight activation state
 */
export const toggleHighlightById = (highlightId: string, options?: HighlightOptions): void => {
  toggleHighlight(highlightId, options);
};

/**
 * Lock a highlight to prevent changes
 */
export const lockHighlightById = (highlightId: string, options?: HighlightOptions): void => {
  lockHighlight(highlightId, options);
};

/**
 * Unlock a highlight to allow changes
 */
export const unlockHighlightById = (highlightId: string, options?: HighlightOptions): void => {
  unlockHighlight(highlightId, options);
};

/**
 * Add a new highlight to the system
 */
export const addNewHighlight = (highlight: Highlight, options?: HighlightOptions): void => {
  addHighlight(highlight, options);
};

/**
 * Remove a highlight from the system
 */
export const removeHighlightById = (highlightId: string, options?: HighlightOptions): void => {
  removeHighlight(highlightId, options);
};

/**
 * Get highlight state information
 */
export const getHighlightStateById = (highlightId: string): HighlightState | undefined => {
  return getHighlightState(highlightId);
};

/**
 * Check if a highlight is currently active
 */
export const checkHighlightActive = (highlightId: string): boolean => {
  return isHighlightActive(highlightId);
};

/**
 * Check if a highlight is locked
 */
export const checkHighlightLocked = (highlightId: string): boolean => {
  return isHighlightLocked(highlightId);
};

/**
 * Get all active highlights
 */
export const getActiveHighlights = (): HighlightState[] => {
  return get(activeHighlights);
};

/**
 * Get all highlight states
 */
export const getAllHighlightStates = (): Map<string, HighlightState> => {
  return get(highlightStates);
};

/**
 * Sync highlight with section change (for scroll events)
 */
export const syncHighlightWithSection = (sectionId: string, options?: HighlightOptions): void => {
  syncWithSectionChange(sectionId, options);
};

/**
 * Get highlight index by ID
 */
export const getHighlightIndexById = (highlightId: string): number => {
  const highlights = getHighlightsData();
  return highlights.findIndex(h => h.id === highlightId);
};

/**
 * Get highlight index by section ID
 */
export const getHighlightIndexBySectionId = (sectionId: string): number => {
  const highlights = getHighlightsData();
  return highlights.findIndex(h => h.sectionId === sectionId);
};

/**
 * Check if highlight exists by ID
 */
export const highlightExists = (highlightId: string): boolean => {
  const highlights = getHighlightsData();
  return highlights.some(h => h.id === highlightId);
};

/**
 * Get highlight by section ID
 */
export const getHighlightBySectionId = (sectionId: string) => {
  const highlights = getHighlightsData();
  return highlights.find(highlight => highlight.sectionId === sectionId) || null;
};