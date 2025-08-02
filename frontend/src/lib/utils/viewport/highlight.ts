import { get } from 'svelte/store';
import { 
  currentHighlightIndex, 
  highlightsData, 
  highlightStore 
} from '$lib/stores/viewport/highlight';

/**
 * Scroll to specific highlight by index
 */
export const scrollToHighlight = (index: number): void => {
  highlightStore.jumpToHighlight(index);
};

/**
 * Scroll to highlight by ID
 */
export const scrollToHighlightById = (highlightId: string): void => {
  highlightStore.jumpToHighlightById(highlightId);
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
export const getHighlightsData = () => {
  return get(highlightsData);
};

/**
 * Go to next highlight
 */
export const nextHighlight = (): void => {
  highlightStore.nextHighlight();
};

/**
 * Go to previous highlight
 */
export const previousHighlight = (): void => {
  highlightStore.previousHighlight();
};

/**
 * Reset highlight to first
 */
export const resetHighlight = (): void => {
  highlightStore.reset();
};

/**
 * Update highlights data
 */
export const updateHighlights = (newHighlights: any[]): void => {
  highlightStore.updateHighlights(newHighlights);
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
  const highlights = getHighlightsData();
  return highlights.length;
};