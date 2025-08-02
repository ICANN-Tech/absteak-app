/**
 * Component monitoring utilities
 * Exports all component-specific monitoring functions
 */

// Base component monitoring
export {
    createBaseComponentMonitor,
    extendVisibilityWithInteraction,
    isComponentInteracting,
    hideComponentRespectingInteraction,
    DEFAULT_COMPONENT_CONFIG,
    type MonitorComponentModule,
    type MonitorComponentConfig
} from './base';

export {
    createHighlightLockMonitor,
    HIGHLIGHT_LOCK_CONFIG,
    type HighlightLockMonitor,
    // Legacy exports (deprecated)
    createHighlightMonitor,
    createHighlightAreaVisibility,
    HIGHLIGHT_COMPONENT_CONFIG
} from './highlight';