/**
 * Viewport Stores Index
 * 
 * Centralized exports for all viewport-related stores
 */

// Initialization state management
export {
  sectionsInitialized,
  componentsInitialized,
  highlightsInitialized,
  isLoading,
  error,
  appInitialized,
  initializationState,
  initializationActions,
  getCurrentInitializationState,
  isAppReady,
  logInitializationState
} from './instantiate';

export type {
  InitializationState,
  InitializationActions
} from './instantiate';

// Component visibility management
export * from './component';

// Highlight management
export * from './highlight';

// Visibility management
export * from './visibility';