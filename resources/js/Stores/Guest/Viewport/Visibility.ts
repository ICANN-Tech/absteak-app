import { writable, derived, type Writable, type Readable } from 'svelte/store';
import { SectionEnum } from '../../../Enums/Guest/Section';
import { navigationStore } from './Section';

/**
 * Enumeration of available component identifiers for visibility management
 * 
 * @enum {string}
 * @example
 * ```typescript
 * // Using component IDs for visibility operations
 * showComponent(ComponentId.Navigation);
 * hideComponent(ComponentId.ChatBot);
 * ```
 */
export enum ComponentId {
  Navigation = 'navigation',
  Highlight = 'highlight',
  Locale = 'locale',
  Operation = 'operation',
  ChatBot = 'chatbot',
  Footer = 'footer',
  Header = 'header',
  Sidebar = 'sidebar',
  ScrollIndicator = 'scroll-indicator',
  BackToTop = 'back-to-top'
}

/**
 * Interface defining the visibility state of a single component
 * 
 * @interface ComponentVisibilityState
 * @property {boolean} visible - Current visibility status of the component
 * @property {boolean} compact - Whether the component is in compact mode
 * @property {number} lastUpdated - Timestamp of the last visibility change
 */
export interface ComponentVisibilityState {
  visible: boolean;
  compact: boolean;
  lastUpdated: number;
}

/**
 * Type representing a single component ID or an array of component IDs
 * Used for operations that can work with both individual and grouped components
 * 
 * @type {ComponentId | ComponentId[]}
 */
export type ComponentTarget = ComponentId | ComponentId[];

/**
 * Interface for the complete visibility state management store
 * Maps component IDs to their visibility states
 * 
 * @interface VisibilityStore
 */
export interface VisibilityStore {
  [key: string]: ComponentVisibilityState;
}



/**
 * Creates a default component visibility state
 * @param visible - Initial visibility state (default: true)
 * @param compact - Initial compact state (default: false)
 * @returns ComponentVisibilityState object
 */
function createDefaultState(visible: boolean = true, compact: boolean = false): ComponentVisibilityState {
  return {
    visible,
    compact,
    lastUpdated: Date.now()
  };
}

/**
 * Initial visibility state for all components
 * Most components start as visible, except ScrollIndicator and BackToTop
 */
const initialState: VisibilityStore = {
  [ComponentId.Navigation]: createDefaultState(true),
  [ComponentId.Highlight]: createDefaultState(true),
  [ComponentId.Locale]: createDefaultState(true),
  [ComponentId.Operation]: createDefaultState(true),
  [ComponentId.ChatBot]: createDefaultState(true),
  [ComponentId.Footer]: createDefaultState(true),
  [ComponentId.Header]: createDefaultState(true),
  [ComponentId.Sidebar]: createDefaultState(true),
  [ComponentId.ScrollIndicator]: createDefaultState(false),
  [ComponentId.BackToTop]: createDefaultState(false)
};

/**
 * Svelte writable store containing the visibility state of all components
 * 
 * @type {Writable<VisibilityStore>}
 */
export const visibilityStore: Writable<VisibilityStore> = writable(initialState);

/**
 * Helper function to normalize component targets to an array
 * 
 * @param {ComponentTarget} target - Single component ID or array of component IDs
 * @returns {ComponentId[]} Array of component IDs
 * 
 * @private
 */
function normalizeTarget(target: ComponentTarget): ComponentId[] {
  return Array.isArray(target) ? target : [target];
}

/**
 * Helper function to update component visibility state efficiently
 * Uses a single store update for better performance with multiple components
 * 
 * @param {ComponentId[]} componentIds - Array of component IDs to update
 * @param {boolean} visible - New visibility state
 * @param {boolean} [compact=false] - Whether to show in compact mode
 * 
 * @private
 */
function updateComponentsVisibility(
  componentIds: ComponentId[],
  visible: boolean,
  compact: boolean = false
): void {
  if (componentIds.length === 0) return;
  
  const timestamp = Date.now();
  
  visibilityStore.update(store => {
    const newStore = { ...store };
    
    // Update all components with the same timestamp for consistency
    componentIds.forEach(componentId => {
      const currentState = newStore[componentId];
      if (currentState) {
        newStore[componentId] = {
          ...currentState,
          visible,
          compact,
          lastUpdated: timestamp
        };
      }
    });
    
    return newStore;
  });
}

/**
 * Shows one or more components by setting their visibility to true
 * 
 * @param {ComponentTarget} target - Component ID(s) to show
 * @param {boolean} [compact=false] - Whether to show in compact mode
 * 
 * @example
 * ```typescript
 * // Show a single component
 * showComponent(ComponentId.Navigation);
 * 
 * // Show multiple components
 * showComponent([ComponentId.Navigation, ComponentId.Highlight]);
 * 
 * // Show component in compact mode
 * showComponent(ComponentId.Navigation, true);
 * ```
 */
export function showComponent(target: ComponentTarget, compact: boolean = false): void {
  const componentIds = normalizeTarget(target);
  updateComponentsVisibility(componentIds, true, compact);
}

/**
 * Hides one or more components by setting their visibility to false
 * 
 * @param {ComponentTarget} target - Component ID(s) to hide
 * 
 * @example
 * ```typescript
 * // Hide a single component
 * hideComponent(ComponentId.Highlight);
 * 
 * // Hide multiple components
 * hideComponent([ComponentId.Navigation, ComponentId.ChatBot]);
 * ```
 */
export function hideComponent(target: ComponentTarget): void {
  const componentIds = normalizeTarget(target);
  updateComponentsVisibility(componentIds, false);
}

/**
 * Toggles the visibility of one or more components
 * 
 * @param {ComponentTarget} target - Component ID(s) to toggle
 * 
 * @example
 * ```typescript
 * // Toggle a single component
 * toggleComponentVisibility(ComponentId.Locale);
 * 
 * // Toggle multiple components
 * toggleComponentVisibility([ComponentId.Locale, ComponentId.Operation]);
 * ```
 */
export function toggleComponentVisibility(target: ComponentTarget): void {
  const componentIds = normalizeTarget(target);
  
  visibilityStore.update(store => {
    const newStore = { ...store };
    
    componentIds.forEach(componentId => {
      const currentState = newStore[componentId];
      
      // Update the component state
      newStore[componentId] = {
        ...currentState,
        visible: !currentState?.visible,
        lastUpdated: Date.now()
      };
    });
    
    return newStore;
  });
}



/**
 * Checks if a component is currently visible
 * 
 * @param {ComponentId} componentId - Component ID to check
 * @returns {boolean} True if component is visible, false otherwise
 * 
 * @example
 * ```typescript
 * if (isComponentVisible(ComponentId.Navigation)) {
 *   console.log('Navigation is visible');
 * }
 * ```
 */
export function isComponentVisible(componentId: ComponentId): boolean {
  let isVisible = false;
  
  visibilityStore.subscribe(store => {
    isVisible = store[componentId]?.visible ?? false;
  })();
  
  return isVisible;
}

/**
 * Checks if a component is currently in compact mode
 * 
 * @param {ComponentId} componentId - Component ID to check
 * @returns {boolean} True if component is in compact mode, false otherwise
 * 
 * @example
 * ```typescript
 * if (isComponentCompact(ComponentId.Navigation)) {
 *   console.log('Navigation is in compact mode');
 * }
 * ```
 */
export function isComponentCompact(componentId: ComponentId): boolean {
  let isCompact = false;
  
  visibilityStore.subscribe(store => {
    isCompact = store[componentId]?.compact ?? false;
  })();
  
  return isCompact;
}



/**
 * Resets all components to their initial visibility state
 * 
 * @example
 * ```typescript
 * // Reset all components
 * resetAllComponents();
 * ```
 */
export function resetAllComponents(): void {
  visibilityStore.update(store => {
    const newStore = { ...store };
    
    Object.keys(newStore).forEach(componentId => {
      // Reset to initial state
      newStore[componentId] = {
        visible: true,
        compact: false,
        lastUpdated: Date.now()
      };
    });
    
    return newStore;
  });
}



/**
 * Configuration interface for area-based visibility
 */
export interface AreaBasedVisibilityConfig {
  proximityRadius?: number;
  targetArea?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  areaOffset?: number;
  hideDelay?: number;
  autoStart?: boolean;
}

/**
 * Creates a simple visibility state manager for a component
 * Returns reactive stores for visibility, compact mode, and display state
 * 
 * @param componentId - The component identifier
 * @returns Object with isVisible, isCompact, isDisplay, and shouldShow stores
 */
export function createVisibilityState(componentId: ComponentId) {
  // Create a single derived store that computes all states at once for better performance
  const componentState = derived(
    visibilityStore,
    ($store) => {
      const state = $store[componentId];
      return {
        visible: state?.visible ?? true,
        compact: state?.compact ?? false,
        lastUpdated: state?.lastUpdated ?? Date.now()
      };
    }
  );
  
  // Individual derived stores for backward compatibility
  const isVisible = derived(componentState, ($state) => $state.visible);
  const isCompact = derived(componentState, ($state) => $state.compact);
  const isDisplay = derived(componentState, ($state) => $state.visible);
  
  // Alias for better naming consistency (shouldShow is more intuitive)
  const shouldShow = isVisible;
  
  return {
    isVisible,
    isCompact,
    isDisplay,
    shouldShow,
    // Expose the combined state for advanced use cases
    state: componentState
  };
}

/**
 * Creates a combined visibility manager that integrates area-based detection with global visibility control
 * @param componentId - The component identifier
 * @param config - Area-based visibility configuration
 * @returns Combined visibility state with global override capability
 */
export function createCombinedVisibility(
  componentId: ComponentId,
  config: AreaBasedVisibilityConfig = {}
) {
  const areaVisibility = createAreaBasedStateVisibility(componentId, config);
  const { isVisible } = createVisibilityState(componentId);
  
  // Combined visibility that respects global visibility control
  const isDisplay = derived(
    [areaVisibility.finalVisible, isVisible],
    ([$areaVisible, $globalVisible]) => {
      // If global visibility is explicitly set to false, hide component
      if (!$globalVisible) {
        return false;
      }
      // Otherwise, use area-based visibility
      return $areaVisible;
    }
  );
  
  return {
    ...areaVisibility,
    isVisible,
    isDisplay
  };
}

/**
 * Configuration for section-based visibility rules
 */
export interface SectionVisibilityRule {
  /** Section to apply this rule to */
  section: SectionEnum;
  /** Visibility mode for this section */
  mode: 'show' | 'hide' | 'proximity' | 'final';
  /** Whether to use compact mode (if applicable) */
  compact?: boolean;
}

/**
 * Configuration for section-based visibility manager
 */
export interface SectionBasedVisibilityConfig extends AreaBasedVisibilityConfig {
  /** Custom visibility rules for specific sections */
  rules?: SectionVisibilityRule[];
  /** Default visibility mode when no rule matches */
  defaultMode?: 'show' | 'hide' | 'proximity' | 'final';
  /** Whether to use compact mode by default */
  defaultCompact?: boolean;
}

/**
 * Creates an area-based state visibility manager with mouse proximity detection
 * Shows when mouse is near the component area, hides when mouse moves away
 */
export function createAreaBasedStateVisibility(
  componentId: ComponentId,
  config: AreaBasedVisibilityConfig = {}
) {
  const {
    proximityRadius = 100,
    targetArea = 'left',
    areaOffset = 50,
    hideDelay = 1000,
    autoStart = true
  } = config;

  // Mouse position tracking
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let hideTimeout: number | null = null;
  let isAreaMode = false;

  // Create writable stores
  const visible = writable(false);
  const showComponent = writable<boolean | null>(null);

  // Calculate initial position based on target area
  function calculateTargetPosition() {
    if (typeof window !== 'undefined') {
      const { innerWidth, innerHeight } = window;
      
      switch (targetArea) {
        case 'top':
          targetX = innerWidth / 2;
          targetY = areaOffset;
          break;
        case 'bottom':
          targetX = innerWidth / 2;
          targetY = innerHeight - areaOffset;
          break;
        case 'left':
          targetX = areaOffset;
          targetY = innerHeight / 2;
          break;
        case 'right':
          targetX = innerWidth - areaOffset;
          targetY = innerHeight / 2;
          break;
        case 'center':
          targetX = innerWidth / 2;
          targetY = innerHeight / 2;
          break;
      }
    }
  }

  // Calculate distance between mouse and target area
  function calculateDistance(): number {
    const dx = mouseX - targetX;
    const dy = mouseY - targetY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Update visibility based on proximity
  function updateVisibility() {
    if (!isAreaMode) return;

    const distance = calculateDistance();
    const isNear = distance <= proximityRadius;

    if (isNear) {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
      visible.set(true);
    } else {
      if (hideTimeout) return;
      
      hideTimeout = window.setTimeout(() => {
        visible.set(false);
        hideTimeout = null;
      }, hideDelay);
    }
  }

  // Mouse move handler
  function handleMouseMove(event: MouseEvent) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    updateVisibility();
  }

  // Window resize handler
  function handleResize() {
    calculateTargetPosition();
    updateVisibility();
  }

  // Enable area-based mode
  function enableAreaMode() {
    if (isAreaMode) return;
    
    isAreaMode = true;
    calculateTargetPosition();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);
    }
  }

  // Disable area-based mode
  function disableAreaMode() {
    if (!isAreaMode) return;
    
    isAreaMode = false;
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    }
    
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  }

  // Cleanup function
  function destroy() {
    disableAreaMode();
  }

  // Create derived stores
  const isDisplay = derived(visible, $visible => $visible);
  
  const finalVisible = derived(
    [visible, showComponent],
    ([$visible, $showComponent]) => {
      // If showComponent is true, always show regardless of visible state
      if ($showComponent === true) return true;
      // If showComponent is false, always hide regardless of visible state
      if ($showComponent === false) return false;
      // If showComponent is null, use normal visible state
      return $visible;
    }
  );

  // Auto-start if enabled
  if (autoStart) {
    enableAreaMode();
  }

  return {
    visible,
    isDisplay,
    finalVisible,
    destroy
  };
}

/**
 * Creates a section-based visibility manager that handles different visibility states
 * based on the active section and custom rules.
 * 
 * This is a reusable visibility manager that can be used by any component
 * to control its visibility based on the current active section.
 * 
 * @param componentId - Component identifier
 * @param config - Configuration options including section rules
 * @returns Object with visibility stores and control functions
 * 
 * @example
 * ```typescript
 * // Create navbar visibility with custom rules
 * const navbarVisibility = createSectionBasedVisibility(ComponentId.Navigation, {
 *   targetArea: 'top',
 *   proximityRadius: 150,
 *   rules: [
 *     { section: SectionEnum.Hero, mode: 'proximity' },
 *     { section: SectionEnum.Footer, mode: 'hide' }
 *   ],
 *   defaultMode: 'final'
 * });
 * 
 * // Use in component
 * const { shouldShow, isCompact } = navbarVisibility;
 * ```
 */
export function createSectionBasedVisibility(
  componentId: ComponentId,
  config: SectionBasedVisibilityConfig = {}
) {
  const {
    rules = [],
    defaultMode = 'final',
    defaultCompact = false,
    ...areaConfig
  } = config;

  // Create area-based visibility
  const visibility = createAreaBasedStateVisibility(componentId, areaConfig);
  const { isDisplay, finalVisible } = visibility;

  // Helper function to find rule for current section
  function findRuleForSection(section: SectionEnum): SectionVisibilityRule | null {
    return rules.find(rule => rule.section === section) || null;
  }

  // Smart visibility logic based on active section and rules
  const shouldShow: Readable<boolean> = derived(
    [navigationStore, isDisplay, finalVisible],
    ([$navigation, $isDisplay, $finalVisible]) => {
      const activeSection = $navigation.currentSection;
      const rule = findRuleForSection(activeSection);
      const mode = rule?.mode || defaultMode;
      
      switch (mode) {
        case 'show':
          return true;
        case 'hide':
          return false;
        case 'proximity':
          return $isDisplay;
        case 'final':
        default:
          return $finalVisible;
      }
    }
  );

  // Compact mode logic based on section rules
  const isCompact: Readable<boolean> = derived(
    [navigationStore, isDisplay, finalVisible],
    ([$navigation, $isDisplay, $finalVisible]) => {
      const activeSection = $navigation.currentSection;
      const rule = findRuleForSection(activeSection);
      
      // Use rule's compact setting or default
      const useCompact = rule?.compact !== undefined ? rule.compact : defaultCompact;
      
      if (!useCompact) return false;
      
      // Only show compact when component should be visible but not in full display mode
      const mode = rule?.mode || defaultMode;
      
      switch (mode) {
        case 'proximity':
          return $finalVisible && !$isDisplay;
        case 'final':
          return false; // Final mode doesn't support compact
        case 'show':
          return false; // Always show mode doesn't need compact
        case 'hide':
        default:
          return false;
      }
    }
  );

  return {
    shouldShow,
    isCompact,
    destroy: visibility.destroy,
    // Expose underlying visibility stores for advanced usage
    isDisplay,
    finalVisible
  };
}

/**
 * Creates navbar-specific visibility manager with predefined rules
 * This is a convenience function that sets up common navbar visibility patterns.
 * 
 * @param config - Optional configuration to override defaults
 * @returns Navbar visibility manager
 */
export function createNavbarVisibility(config: Partial<SectionBasedVisibilityConfig> = {}) {
  const sectionVisibility = createSectionBasedVisibility(ComponentId.Navigation, {
    targetArea: 'top',
    proximityRadius: 150,
    areaOffset: 100,
    hideDelay: 2000,
    autoStart: true,
    rules: [
      { section: SectionEnum.Hero, mode: 'proximity', compact: true },
      { section: SectionEnum.Footer, mode: 'hide' }
    ],
    defaultMode: 'final',
    ...config
  });
  
  // Get compact state from global store
  const { isCompact: globalCompact } = createVisibilityState(ComponentId.Navigation);
  
  return {
    shouldShow: sectionVisibility.shouldShow,
    isCompact: globalCompact,
    destroy: sectionVisibility.destroy,
    isDisplay: sectionVisibility.isDisplay,
    finalVisible: sectionVisibility.finalVisible
  };
}