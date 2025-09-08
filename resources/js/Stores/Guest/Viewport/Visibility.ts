import { writable, derived, type Writable } from 'svelte/store';

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
  ScrollIndicator = 'scroll-indicator'
}

/**
 * Interface defining the visibility state of a single component
 * 
 * @interface ComponentVisibilityState
 * @property {boolean} visible - Current visibility status of the component
 * @property {number} lastUpdated - Timestamp of the last visibility change
 */
export interface ComponentVisibilityState {
  visible: boolean;
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
 * Initial visibility state for all components
 * All components start as visible
 */
const initialState: VisibilityStore = {
  [ComponentId.Navigation]: { visible: true, lastUpdated: Date.now() },
  [ComponentId.Highlight]: { visible: true, lastUpdated: Date.now() },
  [ComponentId.Locale]: { visible: true, lastUpdated: Date.now() },
  [ComponentId.Operation]: { visible: true, lastUpdated: Date.now() },
  [ComponentId.ChatBot]: { visible: true, lastUpdated: Date.now() },
  [ComponentId.Footer]: { visible: true, lastUpdated: Date.now() },
  [ComponentId.Header]: { visible: true, lastUpdated: Date.now() },
  [ComponentId.Sidebar]: { visible: true, lastUpdated: Date.now() },
  [ComponentId.ScrollIndicator]: { visible: false, lastUpdated: Date.now() }
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
 * Helper function to update component visibility state
 * 
 * @param {ComponentId[]} componentIds - Array of component IDs to update
 * @param {boolean} visible - New visibility state
 * @param {VisibilityOptions} [options] - Configuration options
 * 
 * @private
 */
function updateComponentsVisibility(
  componentIds: ComponentId[],
  visible: boolean
): void {
  visibilityStore.update(store => {
    const newStore = { ...store };
    
    componentIds.forEach(componentId => {
      const currentState = newStore[componentId];
      
      // Update the component state
      newStore[componentId] = {
        ...currentState,
        visible,
        lastUpdated: Date.now()
      };
    });
    
    return newStore;
  });
}

/**
 * Shows one or more components by setting their visibility to true
 * 
 * @param {ComponentTarget} target - Component ID(s) to show
 * @param {VisibilityOptions} [options] - Configuration options
 * 
 * @example
 * ```typescript
 * // Show a single component
 * showComponent(ComponentId.Navigation);
 * 
 * // Show multiple components
 * showComponent([ComponentId.Navigation, ComponentId.Highlight]);
 * 
 * // Force show a locked component
 * showComponent(ComponentId.ChatBot, { force: true });
 * ```
 */
export function showComponent(target: ComponentTarget): void {
  const componentIds = normalizeTarget(target);
  updateComponentsVisibility(componentIds, true);
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
 * Creates a visibility state manager for a component
 * @param componentId - The component identifier
 * @returns Object with isVisible and isDisplay stores
 */
export function createVisibilityState(componentId: ComponentId) {
  // isVisible: whether component should show/hide based on global visibility store
  const isVisible = derived(
    visibilityStore,
    ($store) => $store[componentId]?.visible ?? true
  );
  
  // isDisplay: for UI display logic (can be extended for more complex logic)
  const isDisplay = derived(
    isVisible,
    ($isVisible) => $isVisible
  );
  
  return {
    isVisible,
    isDisplay
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