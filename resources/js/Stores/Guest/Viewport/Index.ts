/**
 * Viewport Management System
 * 
 * This module provides comprehensive state management for UI components including:
 * - Visibility state management with lock/unlock mechanisms
 * - Highlight state management for navigation sections
 * - Dynamic component tracking and management
 * - Consistent state across the application
 * 
 * @module ViewportManagement
 * @version 2.0.0
 * 
 * @example
 * ```typescript
 * import {
 *   // Visibility Management
 *   ComponentId,
 *   showComponent,
 *   hideComponent,
 *   toggleComponentVisibility,
 *   lockComponent,
 *   unlockComponent,
 *   
 *   // Highlight Management
 *   addHighlight,
 *   removeHighlight,
 *   activateHighlight,
 *   jumpToHighlight,
 *   nextHighlight,
 *   previousHighlight
 * } from './Viewport';
 * 
 * // Visibility operations
 * showComponent(ComponentId.Navigation);
 * hideComponent([ComponentId.Navigation, ComponentId.ChatBot]);
 * lockComponent(ComponentId.Header);
 * 
 * // Highlight operations
 * activateHighlight('video-highlight');
 * nextHighlight();
 * jumpToHighlightById('menu');
 * ```
 */

// Export all types and interfaces
export type {
  ComponentVisibilityState,
  ComponentTarget,
  VisibilityStore,
  VisibilityOptions
} from './Visibility';

// Export the ComponentId enum
export { ComponentId } from './Visibility';

// Export the visibility store
export { visibilityStore } from './Visibility';

// Export core visibility management functions
export {
  showComponent,
  hideComponent,
  toggleComponentVisibility
} from './Visibility';

// Export lock/unlock management functions
export {
  lockComponent,
  unlockComponent
} from './Visibility';

// Export utility functions
export {
  isComponentVisible,
  isComponentLocked,
  getComponentState,
  resetAllComponents
} from './Visibility';

// Export highlight management functions and types
export {
  HighlightState,
  HighlightOptions,
  HighlightTarget,
  addHighlight,
  removeHighlight,
  activateHighlight,
  deactivateHighlight,
  toggleHighlight,
  lockHighlight,
  unlockHighlight,
  jumpToHighlight,
  jumpToHighlightById,
  jumpToHighlightBySectionId,
  nextHighlight,
  previousHighlight,
  getHighlightState,
  isHighlightActive,
  isHighlightLocked,
  resetAllHighlights,
  syncWithSectionChange,
  highlightStates,
  activeHighlights,
  highlightCount
} from './Highlight';

/**
 * Re-export everything from Visibility module for convenience
 * This allows importing everything with a single import statement
 */
export * from './Visibility';

// Import all functions for default export
import {
  ComponentId,
  showComponent,
  hideComponent,
  toggleComponentVisibility,
  lockComponent,
  unlockComponent,
  isComponentVisible,
  isComponentLocked,
  getComponentState,
  resetAllComponents,
  visibilityStore
} from './Visibility';

import {
  HighlightState,
  HighlightOptions,
  HighlightTarget,
  addHighlight,
  removeHighlight,
  activateHighlight,
  deactivateHighlight,
  toggleHighlight,
  lockHighlight,
  unlockHighlight,
  jumpToHighlight,
  jumpToHighlightById,
  jumpToHighlightBySectionId,
  nextHighlight,
  previousHighlight,
  getHighlightState,
  isHighlightActive,
  isHighlightLocked,
  resetAllHighlights,
  syncWithSectionChange,
  highlightStates,
  activeHighlights,
  highlightCount
} from './Highlight';

/**
 * Default export containing the most commonly used functions
 * 
 * @example
 * ```typescript
 * import ViewportVisibility from './Viewport';
 * 
 * ViewportVisibility.showComponent(ComponentId.Navigation);
 * ViewportVisibility.hideComponent([ComponentId.Header, ComponentId.Footer]);
 * ```
 */
export default {
  // Component ID enum
  ComponentId,
  
  // Core visibility functions
  showComponent,
  hideComponent,
  toggleComponentVisibility,
  
  // Lock/unlock functions
  lockComponent,
  unlockComponent,
  
  // Utility functions
  isComponentVisible,
  isComponentLocked,
  getComponentState,
  resetAllComponents,
  
  // Store
  visibilityStore,
  
  // Highlight Management
  addHighlight,
  removeHighlight,
  activateHighlight,
  deactivateHighlight,
  toggleHighlight,
  lockHighlight,
  unlockHighlight,
  jumpToHighlight,
  jumpToHighlightById,
  jumpToHighlightBySectionId,
  nextHighlight,
  previousHighlight,
  getHighlightState,
  isHighlightActive,
  isHighlightLocked,
  resetAllHighlights,
  syncWithSectionChange,
  highlightStates,
  activeHighlights,
  highlightCount
};