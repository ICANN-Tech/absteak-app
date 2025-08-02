import { writable, derived, get } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';

/**
 * Initialization State Management
 * 
 * This module manages the initialization state of the application following Svelte best practices:
 * - Separation of concerns
 * - Reactive state management
 * - Type safety
 * - Clear state transitions
 */

// ============================================================================
// TYPES
// ============================================================================

export interface InitializationState {
  sectionsInitialized: boolean;
  componentsInitialized: boolean;
  highlightsInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface InitializationActions {
  setSectionsInitialized: (value: boolean) => void;
  setComponentsInitialized: (value: boolean) => void;
  setHighlightsInitialized: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// ============================================================================
// PRIVATE STORES
// ============================================================================

// Individual state stores - private to this module
const _sectionsInitialized = writable<boolean>(false);
const _componentsInitialized = writable<boolean>(false);
const _highlightsInitialized = writable<boolean>(false);
const _isLoading = writable<boolean>(false);
const _error = writable<string | null>(null);

// ============================================================================
// PUBLIC STORES
// ============================================================================

/**
 * Individual state stores - exported for direct access when needed
 */
export const sectionsInitialized: Readable<boolean> = _sectionsInitialized;
export const componentsInitialized: Readable<boolean> = _componentsInitialized;
export const highlightsInitialized: Readable<boolean> = _highlightsInitialized;
export const isLoading: Readable<boolean> = _isLoading;
export const error: Readable<string | null> = _error;

/**
 * Derived store that combines all initialization states
 * Useful for checking if the entire app is ready
 */
export const appInitialized: Readable<boolean> = derived(
  [_sectionsInitialized, _componentsInitialized, _highlightsInitialized],
  ([$sections, $components, $highlights]) => $sections && $components && $highlights
);

/**
 * Derived store that provides the complete initialization state
 * Useful for debugging and comprehensive state monitoring
 */
export const initializationState: Readable<InitializationState> = derived(
  [_sectionsInitialized, _componentsInitialized, _highlightsInitialized, _isLoading, _error],
  ([$sections, $components, $highlights, $loading, $error]) => ({
    sectionsInitialized: $sections,
    componentsInitialized: $components,
    highlightsInitialized: $highlights,
    isLoading: $loading,
    error: $error
  })
);

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Actions object that provides methods to update the initialization state
 * Following the action pattern for better organization and type safety
 */
export const initializationActions: InitializationActions = {
  setSectionsInitialized: (value: boolean) => {
    _sectionsInitialized.set(value);
    console.log(`📦 Sections initialized: ${value}`);
  },

  setComponentsInitialized: (value: boolean) => {
    _componentsInitialized.set(value);
    console.log(`🔧 Components initialized: ${value}`);
  },

  setHighlightsInitialized: (value: boolean) => {
    _highlightsInitialized.set(value);
    console.log(`✨ Highlights initialized: ${value}`);
  },

  setLoading: (value: boolean) => {
    _isLoading.set(value);
    if (value) {
      _error.set(null); // Clear error when starting to load
    }
    console.log(`⏳ Loading: ${value}`);
  },

  setError: (error: string | null) => {
    _error.set(error);
    if (error) {
      _isLoading.set(false); // Stop loading on error
      console.error(`❌ Initialization error: ${error}`);
    } else {
      console.log(`✅ Error cleared`);
    }
  },

  reset: () => {
    _sectionsInitialized.set(false);
    _componentsInitialized.set(false);
    _highlightsInitialized.set(false);
    _isLoading.set(false);
    _error.set(null);
    console.log('🔄 Initialization state reset');
  }
};

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Utility function to get current initialization state synchronously
 * Useful for conditional logic that needs immediate state access
 */
export const getCurrentInitializationState = (): InitializationState => ({
  sectionsInitialized: get(_sectionsInitialized),
  componentsInitialized: get(_componentsInitialized),
  highlightsInitialized: get(_highlightsInitialized),
  isLoading: get(_isLoading),
  error: get(_error)
});

/**
 * Utility function to check if app is fully initialized synchronously
 */
export const isAppReady = (): boolean => {
  const state = getCurrentInitializationState();
  return state.sectionsInitialized && 
         state.componentsInitialized && 
         state.highlightsInitialized && 
         !state.isLoading && 
         !state.error;
};

// ============================================================================
// DEVELOPMENT HELPERS
// ============================================================================

/**
 * Development helper to log current state
 * Only available in development mode
 */
export const logInitializationState = () => {
  if (import.meta.env.DEV) {
    const state = getCurrentInitializationState();
    console.group('🔍 Initialization State');
    console.log('Sections:', state.sectionsInitialized);
    console.log('Components:', state.componentsInitialized);
    console.log('Highlights:', state.highlightsInitialized);
    console.log('Loading:', state.isLoading);
    console.log('Error:', state.error);
    console.log('App Ready:', isAppReady());
    console.groupEnd();
  }
};