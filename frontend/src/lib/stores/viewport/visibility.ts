/**
 * Viewport Visibility Management System
 * 
 * This module provides comprehensive visibility management for UI components with support for:
 * - Single component or multiple components (array) operations
 * - Area-based detection (mouse proximity)
 * - Time-based visibility cycles
 * - Trigger-based manual control
 * - Lock/unlock mechanisms for preventing visibility changes
 * 
 * @example Single component usage:
 * ```typescript
 * import { showComponent, hideComponent, ComponentId } from '$lib/stores/viewport/visibility';
 * 
 * // Show single component
 * showComponent(ComponentId.Navigation);
 * 
 * // Hide single component
 * hideComponent(ComponentId.Highlight);
 * ```
 * 
 * @example Multiple components usage:
 * ```typescript
 * import { showComponent, hideComponent, toggleComponentVisibility, ComponentId } from '$lib/stores/viewport/visibility';
 * 
 * // Show multiple components at once
 * showComponent([ComponentId.Navigation, ComponentId.Highlight]);
 * 
 * // Hide multiple components at once
 * hideComponent([ComponentId.Navigation, ComponentId.Highlight, ComponentId.ChatBot]);
 * 
 * // Toggle multiple components
 * toggleComponentVisibility([ComponentId.Locale, ComponentId.Operation]);
 * ```
 */

import { writable, derived, type Writable, type Readable } from 'svelte/store';
import { 
  createViewportPosition, 
  createTimeBasedPosition, 
  createAreaBasedPosition, 
  createTriggerBasedPosition,
  ViewportPositionPresets,
  getElementPosition,
  type ViewportPositionConfig,
  type ViewportPositionState
} from '$lib/utils/viewport/visibility.js';
import { ComponentId } from '$lib/enums';

// Global viewport visibility state
interface GlobalViewportState {
  activeComponents: Map<string, ViewportPositionState>;
  globalVisible: boolean;
  mousePosition: { x: number; y: number };
  isMouseTracking: boolean;
}

// Lock state interface
interface LockState {
  locked: boolean;
  lockedValue: boolean | null;
  originalValue: boolean | null; // Menyimpan nilai asli sebelum lock
}

// Create global state store
const globalState = writable<GlobalViewportState>({
  activeComponents: new Map(),
  globalVisible: true,
  mousePosition: { x: 0, y: 0 },
  isMouseTracking: false
});

// Lock management
const lockMap = new Map<string, LockState>();

/**
 * Set component visibility state directly (showComponent)
 * This function directly changes the showComponent state without modifying configuration
 * @param componentId - Component ID or array of Component IDs to modify
 * @param show - true to force show, false to force hide, null to use normal visibility logic
 */
export function setComponentVisibility(componentId: ComponentId | ComponentId[], show: boolean | null) {
  if (Array.isArray(componentId)) {
    const results = componentId.map(id => {
      const component = viewportVisibilityStore.getComponent(id);
      
      if (!component) {
        console.warn(`Component with ID "${id}" not found. Cannot set visibility.`);
        return false;
      }

      // Check if component is locked
      if (isLocked(id)) {
        console.warn(`Component with ID "${id}" is locked. Cannot change visibility.`);
        return false;
      }

      // Set the showComponent state
      component.setShowComponent(show);
      return true;
    });
    return results.every(result => result); // Return true only if all succeeded
  }

  const component = viewportVisibilityStore.getComponent(componentId);
  
  if (!component) {
    console.warn(`Component with ID "${componentId}" not found. Cannot set visibility.`);
    return false;
  }

  // Check if component is locked
  if (isLocked(componentId)) {
    console.warn(`Component with ID "${componentId}" is locked. Cannot change visibility.`);
    return false;
  }

  // Set the showComponent state
  component.setShowComponent(show);
  return true;
}

/**
 * Show component immediately
 * @param componentId - Component ID or array of Component IDs to show
 */
export function showComponent(componentId: ComponentId | ComponentId[]) {
  if (Array.isArray(componentId)) {
    const results = componentId.map(id => setComponentVisibility(id, true));
    return results.every(result => result); // Return true only if all succeeded
  }
  return setComponentVisibility(componentId, true);
}

/**
 * Hide component immediately
 * @param componentId - Component ID or array of Component IDs to hide
 */
export function hideComponent(componentId: ComponentId | ComponentId[]) {
  if (Array.isArray(componentId)) {
    const results = componentId.map(id => setComponentVisibility(id, false));
    return results.every(result => result); // Return true only if all succeeded
  }
  return setComponentVisibility(componentId, false);
}

/**
 * Reset component to use normal visibility logic
 * @param componentId - Component ID or array of Component IDs to reset
 */
export function resetComponentVisibility(componentId: ComponentId | ComponentId[]) {
  if (Array.isArray(componentId)) {
    const results = componentId.map(id => setComponentVisibility(id, null));
    return results.every(result => result); // Return true only if all succeeded
  }
  return setComponentVisibility(componentId, null);
}

/**
 * Toggle component visibility
 * @param componentId - Component ID or array of Component IDs to toggle
 */
export function toggleComponentVisibility(componentId: ComponentId | ComponentId[]) {
  if (Array.isArray(componentId)) {
    const results = componentId.map(id => {
      const component = viewportVisibilityStore.getComponent(id);
      
      if (!component) {
        console.warn(`Component with ID "${id}" not found. Cannot toggle visibility.`);
        return false;
      }

      // Check if component is locked
      if (isLocked(id)) {
        console.warn(`Component with ID "${id}" is locked. Cannot toggle visibility.`);
        return false;
      }

      // Get current showComponent state
      let currentShowComponent: boolean | null = null;
      component.showComponent.subscribe(value => {
        currentShowComponent = value;
      })();

      // Toggle logic
      if (currentShowComponent === true) {
        component.setShowComponent(false);
      } else if (currentShowComponent === false) {
        component.setShowComponent(true);
      } else {
        // If null, check current visible state to decide
        let currentVisible: boolean = false;
        component.visible.subscribe(value => {
          currentVisible = value;
        })();
        
        component.setShowComponent(!currentVisible);
      }

      return true;
    });
    return results.every(result => result); // Return true only if all succeeded
  }

  const component = viewportVisibilityStore.getComponent(componentId);
  
  if (!component) {
    console.warn(`Component with ID "${componentId}" not found. Cannot toggle visibility.`);
    return false;
  }

  // Check if component is locked
  if (isLocked(componentId)) {
    console.warn(`Component with ID "${componentId}" is locked. Cannot toggle visibility.`);
    return false;
  }

  // Get current showComponent state
  let currentShowComponent: boolean | null = null;
  component.showComponent.subscribe(value => {
    currentShowComponent = value;
  })();

  // Toggle logic
  if (currentShowComponent === true) {
    component.setShowComponent(false);
  } else if (currentShowComponent === false) {
    component.setShowComponent(true);
  } else {
    // If null, check current visible state to decide
    let currentVisible: boolean = false;
    component.visible.subscribe(value => {
      currentVisible = value;
    })();
    
    component.setShowComponent(!currentVisible);
  }

  return true;
}

/**
 * Check if a component is locked
 */
function isLocked(componentId: string): boolean {
  const lockState = lockMap.get(componentId);
  return lockState?.locked ?? false;
}

/**
 * Get locked value for a component
 */
function getLockedValue(componentId: string): boolean | null {
  const lockState = lockMap.get(componentId);
  return lockState?.lockedValue ?? null;
}

// Mouse position tracking
let mouseTrackingHandler: ((e: MouseEvent) => void) | null = null;

/**
 * Starts global mouse position tracking
 */
function startMouseTracking() {
  if (typeof window === 'undefined' || mouseTrackingHandler) return;
  
  mouseTrackingHandler = (e: MouseEvent) => {
    globalState.update(state => ({
      ...state,
      mousePosition: { x: e.clientX, y: e.clientY }
    }));
  };
  
  window.addEventListener('mousemove', mouseTrackingHandler);
  globalState.update(state => ({ ...state, isMouseTracking: true }));
}

/**
 * Stops global mouse position tracking
 */
function stopMouseTracking() {
  if (mouseTrackingHandler && typeof window !== 'undefined') {
    window.removeEventListener('mousemove', mouseTrackingHandler);
    mouseTrackingHandler = null;
  }
  globalState.update(state => ({ ...state, isMouseTracking: false }));
}

/**
 * Component visibility manager for individual components
 */
export class ViewportVisibilityManager {
  private componentId: string;
  private positionState: ViewportPositionState;
  private config: ViewportPositionConfig;

  constructor(componentId: string, config: ViewportPositionConfig = {}) {
    this.componentId = componentId;
    this.config = config;
    this.positionState = createViewportPosition(config);
    
    // Register component in global state
    globalState.update(state => {
      state.activeComponents.set(componentId, this.positionState);
      return state;
    });
  }

  /**
   * Get the visibility store for this component
   */
  get visible(): Writable<boolean> {
    return this.positionState.visible;
  }

  /**
   * Get the showComponent store for this component
   */
  get showComponent(): Writable<boolean | null> {
    return this.positionState.showComponent;
  }

  /**
   * Get all mode states
   */
  get modes() {
    return {
      isTimeMode: this.positionState.isTimeMode,
      isAreaMode: this.positionState.isAreaMode,
      isTriggerMode: this.positionState.isTriggerMode
    };
  }

  /**
   * Control methods
   */
  show = () => this.positionState.show();
  hide = () => this.positionState.hide();
  toggle = () => this.positionState.toggle();

  /**
   * Set showComponent state
   * @param show - true to force show, false to force hide, null to use normal visibility logic
   */
  setShowComponent = (show: boolean | null) => {
    // Check if component is locked
    if (isLocked(this.componentId)) {
      // If locked, ignore the request and keep the locked value
      const lockedValue = getLockedValue(this.componentId);
      this.positionState.setShowComponent(lockedValue);
      return;
    }
    
    // If not locked, proceed normally
    this.positionState.setShowComponent(show);
  };

  /**
   * Time-based mode controls
   */
  startTimeCycle = () => this.positionState.startTimeCycle();
  stopTimeCycle = () => this.positionState.stopTimeCycle();

  /**
   * Area-based mode controls
   */
  enableAreaMode = () => {
    startMouseTracking();
    this.positionState.enableAreaMode();
  };
  
  disableAreaMode = () => this.positionState.disableAreaMode();

  /**
   * Update component position for area detection
   */
  updatePosition = (x: number, y: number) => {
    this.positionState.updateComponentPosition(x, y);
  };

  /**
   * Update component position from DOM element
   */
  updatePositionFromElement = (element: HTMLElement) => {
    const position = getElementPosition(element);
    this.updatePosition(position.x, position.y);
  };

  /**
   * Set proximity radius for area detection
   */
  setProximityRadius = (radius: number) => {
    this.positionState.setProximityRadius(radius);
  };

  /**
   * Apply preset configuration
   */
  applyPreset = (preset: keyof typeof ViewportPositionPresets) => {
    const presetConfig = ViewportPositionPresets[preset];
    // Recreate position state with new config
    this.destroy();
    this.config = { ...this.config, ...presetConfig };
    this.positionState = createViewportPosition(this.config);
    
    // Re-register in global state
    globalState.update(state => {
      state.activeComponents.set(this.componentId, this.positionState);
      return state;
    });
  };

  /**
   * Destroy the component and clean up
   */
  destroy = () => {
    this.positionState.destroy();
    
    // Remove from global state
    globalState.update(state => {
      state.activeComponents.delete(this.componentId);
      
      // Stop mouse tracking if no components need it
      if (state.activeComponents.size === 0) {
        stopMouseTracking();
      }
      
      return state;
    });
  };
}

/**
 * Factory functions for common use cases
 */

/**
 * Creates a time-based visibility manager
 */
export function createTimeBasedVisibility(
  componentId: string, 
  config: Partial<ViewportPositionConfig> = {}
): ViewportVisibilityManager {
  return new ViewportVisibilityManager(componentId, {
    timeBasedMode: true,
    autoStart: true,
    hideDelay: 2000,
    showDelay: 2000,
    ...config
  });
}

/**
 * Creates an area-based visibility manager
 */
export function createAreaBasedVisibility(
  componentId: string,
  componentPosition: { x: number; y: number },
  config: Partial<ViewportPositionConfig> = {}
): ViewportVisibilityManager {
  const manager = new ViewportVisibilityManager(componentId, {
    areaBasedMode: true,
    autoStart: true,
    componentPosition,
    proximityRadius: 100,
    hideDelay: 2000,
    ...config
  });
  
  // Auto-enable area mode
  manager.enableAreaMode();
  
  return manager;
}

/**
 * Creates a trigger-based visibility manager
 */
export function createTriggerBasedVisibility(
  componentId: string,
  config: Partial<ViewportPositionConfig> = {}
): ViewportVisibilityManager {
  return new ViewportVisibilityManager(componentId, {
    triggerMode: true,
    initialVisible: false,
    ...config
  });
}

/**
 * Creates a state-based visibility manager with integrated state management
 * This provides a unified state that can be shared across components while maintaining uniqueness
 */
export function createStateVisibility(
  componentId: string,
  config: Partial<ViewportPositionConfig> = {}
): {
  visible: Readable<boolean>;
  showComponent: Writable<boolean | null>;
  isVisible: Readable<boolean>;
  finalVisible: Readable<boolean>;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  setShowComponent: (show: boolean | null) => void;
  destroy: () => void;
  manager: ViewportVisibilityManager;
} {
  const manager = new ViewportVisibilityManager(componentId, {
    triggerMode: true,
    initialVisible: false,
    ...config
  });

  // Create a derived store that mirrors the visibility state
  const isVisible = derived(manager.visible, $visible => $visible);

  // Create a derived store that combines visible and showComponent logic
  const finalVisible = derived(
    [manager.visible, manager.showComponent],
    ([$visible, $showComponent]) => {
      // If showComponent is true, always show regardless of visible state
      if ($showComponent === true) return true;
      // If showComponent is false, always hide regardless of visible state
      if ($showComponent === false) return false;
      // If showComponent is null, use normal visible state
      return $visible;
    }
  );

  return {
    visible: manager.visible,
    showComponent: manager.showComponent,
    isVisible,
    finalVisible,
    show: manager.show,
    hide: manager.hide,
    toggle: manager.toggle,
    setShowComponent: manager.setShowComponent,
    destroy: manager.destroy,
    manager
  };
}

/**
 * Creates an area-based state visibility manager with mouse proximity detection
 * Shows when mouse is near the component area, hides when mouse moves away
 */
export function createAreaBasedStateVisibility(
  componentId: string,
  config: Partial<ViewportPositionConfig> & {
    proximityRadius?: number;
    targetArea?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    areaOffset?: number;
  } = {}
): {
  visible: Readable<boolean>;
  showComponent: Writable<boolean | null>;
  isVisible: Readable<boolean>;
  finalVisible: Readable<boolean>;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  setShowComponent: (show: boolean | null) => void;
  updatePosition: (element: HTMLElement) => void;
  setProximityRadius: (radius: number) => void;
  enableAreaMode: () => void;
  disableAreaMode: () => void;
  destroy: () => void;
  manager: ViewportVisibilityManager;
} {
  const {
    proximityRadius = 100,
    targetArea = 'top',
    areaOffset = 50,
    ...restConfig
  } = config;

  // Calculate initial position based on target area
  let initialPosition = { x: 0, y: 0 };
  
  if (typeof window !== 'undefined') {
    const { innerWidth, innerHeight } = window;
    
    switch (targetArea) {
      case 'top':
        initialPosition = { x: innerWidth / 2, y: areaOffset };
        break;
      case 'bottom':
        initialPosition = { x: innerWidth / 2, y: innerHeight - areaOffset };
        break;
      case 'left':
        initialPosition = { x: areaOffset, y: innerHeight / 2 };
        break;
      case 'right':
        initialPosition = { x: innerWidth - areaOffset, y: innerHeight / 2 };
        break;
      case 'center':
        initialPosition = { x: innerWidth / 2, y: innerHeight / 2 };
        break;
    }
  }

  const manager = new ViewportVisibilityManager(componentId, {
    areaBasedMode: true,
    autoStart: true,
    proximityRadius,
    componentPosition: initialPosition,
    initialVisible: false,
    hideDelay: 1000,
    ...restConfig
  });

  // Create a derived store that mirrors the visibility state
  const isVisible = derived(manager.visible, $visible => $visible);

  // Create a derived store that combines visible and showComponent logic
  const finalVisible = derived(
    [manager.visible, manager.showComponent],
    ([$visible, $showComponent]) => {
      // If showComponent is true, always show regardless of visible state
      if ($showComponent === true) return true;
      // If showComponent is false, always hide regardless of visible state
      if ($showComponent === false) return false;
      // If showComponent is null, use normal visible state
      return $visible;
    }
  );

  // Auto-enable area mode
  manager.enableAreaMode();

  return {
    visible: manager.visible,
    showComponent: manager.showComponent,
    isVisible,
    finalVisible,
    show: manager.show,
    hide: manager.hide,
    toggle: manager.toggle,
    setShowComponent: manager.setShowComponent,
    updatePosition: manager.updatePositionFromElement,
    setProximityRadius: manager.setProximityRadius,
    enableAreaMode: manager.enableAreaMode,
    disableAreaMode: manager.disableAreaMode,
    destroy: manager.destroy,
    manager
  };
}

/**
 * Creates a hybrid visibility manager with multiple modes
 */
export function createHybridVisibility(
  componentId: string,
  config: ViewportPositionConfig
): ViewportVisibilityManager {
  const manager = new ViewportVisibilityManager(componentId, config);
  
  // Auto-enable area mode if configured
  if (config.areaBasedMode && config.autoStart) {
    manager.enableAreaMode();
  }
  
  return manager;
}

/**
 * Global visibility controls
 */
export const viewportVisibilityStore = {
  /**
   * Subscribe to global state
   */
  subscribe: globalState.subscribe,

  /**
   * Get current mouse position
   */
  mousePosition: derived(globalState, $state => $state.mousePosition),

  /**
   * Get all active components
   */
  activeComponents: derived(globalState, $state => 
    Array.from($state.activeComponents.keys())
  ),

  /**
   * Check if mouse tracking is active
   */
  isMouseTracking: derived(globalState, $state => $state.isMouseTracking),

  /**
   * Global visibility toggle
   */
  globalVisible: derived(globalState, $state => $state.globalVisible),

  /**
   * Show all components
   */
  showAll: () => {
    globalState.update(state => {
      state.activeComponents.forEach(component => component.show());
      state.globalVisible = true;
      return state;
    });
  },

  /**
   * Hide all components
   */
  hideAll: () => {
    globalState.update(state => {
      state.activeComponents.forEach(component => component.hide());
      state.globalVisible = false;
      return state;
    });
  },

  /**
   * Toggle all components
   */
  toggleAll: () => {
    globalState.update(state => {
      const newGlobalVisible = !state.globalVisible;
      state.activeComponents.forEach(component => {
        if (newGlobalVisible) {
          component.show();
        } else {
          component.hide();
        }
      });
      state.globalVisible = newGlobalVisible;
      return state;
    });
  },

  /**
   * Get component by ID
   */
  getComponent: (componentId: string): ViewportPositionState | undefined => {
    let component: ViewportPositionState | undefined;
    globalState.subscribe(state => {
      component = state.activeComponents.get(componentId);
    })();
    return component;
  },

  /**
   * Remove component by ID
   */
  removeComponent: (componentId: string) => {
    globalState.update(state => {
      const component = state.activeComponents.get(componentId);
      if (component) {
        component.destroy();
        state.activeComponents.delete(componentId);
      }
      
      // Stop mouse tracking if no components need it
      if (state.activeComponents.size === 0) {
        stopMouseTracking();
      }
      
      return state;
    });
  },

  /**
   * Clear all components
   */
  clearAll: () => {
    globalState.update(state => {
      state.activeComponents.forEach(component => component.destroy());
      state.activeComponents.clear();
      stopMouseTracking();
      return state;
    });
  },

  /**
   * Start global mouse tracking
   */
  startMouseTracking,

  /**
   * Stop global mouse tracking
   */
  stopMouseTracking
};

/**
 * Utility hook for Svelte components
 */
export function useViewportVisibility(
  componentId: string,
  config: ViewportPositionConfig = {}
) {
  const manager = new ViewportVisibilityManager(componentId, config);
  
  return {
    visible: manager.visible,
    modes: manager.modes,
    show: manager.show,
    hide: manager.hide,
    toggle: manager.toggle,
    startTimeCycle: manager.startTimeCycle,
    stopTimeCycle: manager.stopTimeCycle,
    enableAreaMode: manager.enableAreaMode,
    disableAreaMode: manager.disableAreaMode,
    updatePosition: manager.updatePosition,
    updatePositionFromElement: manager.updatePositionFromElement,
    setProximityRadius: manager.setProximityRadius,
    applyPreset: manager.applyPreset,
    destroy: manager.destroy
  };
}

/**
 * Lock visibility for specific component(s) or all components
 * When locked, showComponent will be forced to the locked value regardless of other settings
 * @param selectedComponent - Component ID(s) to lock: undefined for all components, string for single component, or array for multiple components
 * @param lockedValue - Value to lock showComponent to (true/false/null)
 */
export function lockVisibility(selectedComponent?: ComponentId | ComponentId[], lockedValue: boolean | null = false) {
  if (selectedComponent === undefined) {
    // Lock all components
    globalState.update(state => {
      state.activeComponents.forEach((component, id) => {
        // Get current showComponent value as original value
        let originalValue: boolean | null = null;
        component.showComponent.subscribe(value => {
          originalValue = value;
        })();
        
        lockMap.set(id, { locked: true, lockedValue, originalValue });
        component.setShowComponent(lockedValue);
      });
      return state;
    });
  } else if (Array.isArray(selectedComponent)) {
    // Lock multiple specific components
    selectedComponent.forEach(id => {
      const component = viewportVisibilityStore.getComponent(id);
      let originalValue: boolean | null = null;
      
      if (component) {
        // Get current showComponent value as original value
        component.showComponent.subscribe(value => {
          originalValue = value;
        })();
        
        lockMap.set(id, { locked: true, lockedValue, originalValue });
        component.setShowComponent(lockedValue);
      } else {
        // If component doesn't exist yet, set with null original value
        lockMap.set(id, { locked: true, lockedValue, originalValue: null });
      }
    });
  } else {
    // Lock single specific component
    const component = viewportVisibilityStore.getComponent(selectedComponent);
    let originalValue: boolean | null = null;
    
    if (component) {
      // Get current showComponent value as original value
      component.showComponent.subscribe(value => {
        originalValue = value;
      })();
      
      lockMap.set(selectedComponent, { locked: true, lockedValue, originalValue });
      component.setShowComponent(lockedValue);
    } else {
      // If component doesn't exist yet, set with null original value
      lockMap.set(selectedComponent, { locked: true, lockedValue, originalValue: null });
    }
  }
}

/**
 * Unlock visibility for specific component(s) or all components
 * @param selectedComponent - Component ID(s) to unlock: undefined for all components, string for single component, or array for multiple components
 * @param lockedValue - Value to set showComponent to when unlocking (true/false/null). If not provided, restores original value
 */
export function unlockVisibility(selectedComponent?: ComponentId | ComponentId[], lockedValue?: boolean | null) {
  if (selectedComponent === undefined) {
    // Unlock all components
    globalState.update(state => {
      state.activeComponents.forEach((component, id) => {
        const lockState = lockMap.get(id);
        const valueToSet = lockedValue !== undefined ? lockedValue : (lockState?.originalValue ?? null);
        
        lockMap.set(id, { locked: false, lockedValue: null, originalValue: null });
        // Set to specified lockedValue or restore original value
        component.setShowComponent(valueToSet);
      });
      return state;
    });
  } else if (Array.isArray(selectedComponent)) {
    // Unlock multiple specific components
    selectedComponent.forEach(id => {
      const lockState = lockMap.get(id);
      const valueToSet = lockedValue !== undefined ? lockedValue : (lockState?.originalValue ?? null);
      
      lockMap.set(id, { locked: false, lockedValue: null, originalValue: null });
      
      // Set to specified lockedValue or restore original value
      const component = viewportVisibilityStore.getComponent(id);
      if (component) {
        component.setShowComponent(valueToSet);
      }
    });
  } else {
    // Unlock single specific component
    const lockState = lockMap.get(selectedComponent);
    const valueToSet = lockedValue !== undefined ? lockedValue : (lockState?.originalValue ?? null);
    
    lockMap.set(selectedComponent, { locked: false, lockedValue: null, originalValue: null });
    
    // Set to specified lockedValue or restore original value
    const component = viewportVisibilityStore.getComponent(selectedComponent);
    if (component) {
      component.setShowComponent(valueToSet);
    }
  }
}

/**
 * Modify visibility configuration for a specific component
 * This function allows you to update the configuration of an existing component
 * @param componentId - Component ID to modify
 * @param config - New configuration to apply
 * @param options - Additional options for modification
 */
export function modifyVisibility(
  componentId: ComponentId, 
  config: Partial<ViewportPositionConfig>,
  options: {
    preserveCurrentState?: boolean; // Whether to preserve current visibility state
    applyImmediately?: boolean; // Whether to apply changes immediately
  } = {}
) {
  const { preserveCurrentState = true, applyImmediately = true } = options;
  
  // Get the existing component
  const existingComponent = viewportVisibilityStore.getComponent(componentId);
  
  if (!existingComponent) {
    console.warn(`Component with ID "${componentId}" not found. Cannot modify visibility.`);
    return null;
  }

  // Store current state if needed
  let currentVisibleState: boolean = false;
  let currentShowComponentState: boolean | null = null;
  
  if (preserveCurrentState) {
    existingComponent.visible.subscribe(value => {
      currentVisibleState = value;
    })();
    
    existingComponent.showComponent.subscribe(value => {
      currentShowComponentState = value;
    })();
  }

  // Get current lock state
  const lockState = lockMap.get(componentId);
  const isCurrentlyLocked = lockState?.locked ?? false;
  const lockedValue = lockState?.lockedValue ?? null;
  const originalValue = lockState?.originalValue ?? null;

  // Remove the existing component from global state
  globalState.update(state => {
    const component = state.activeComponents.get(componentId);
    if (component) {
      component.destroy();
      state.activeComponents.delete(componentId);
    }
    return state;
  });

  // Create new component with updated config
  const newComponent = createViewportPosition(config);
  
  // Register the new component in global state
  globalState.update(state => {
    state.activeComponents.set(componentId, newComponent);
    return state;
  });

  // Restore lock state if it was locked
  if (isCurrentlyLocked) {
    lockMap.set(componentId, { 
      locked: true, 
      lockedValue, 
      originalValue: preserveCurrentState ? currentShowComponentState : originalValue 
    });
  }

  // Apply changes immediately if requested
  if (applyImmediately) {
    if (isCurrentlyLocked) {
      // If locked, apply the locked value
      newComponent.setShowComponent(lockedValue);
    } else if (preserveCurrentState) {
      // Restore previous states
      if (currentVisibleState) {
        newComponent.show();
      } else {
        newComponent.hide();
      }
      newComponent.setShowComponent(currentShowComponentState);
    }
  }

  return {
    component: newComponent,
    previousState: preserveCurrentState ? {
      visible: currentVisibleState,
      showComponent: currentShowComponentState
    } : null,
    wasLocked: isCurrentlyLocked
  };
}

/**
 * Helper function to modify component to time-based mode
 * @param componentId - Component ID to modify
 * @param timeConfig - Time-based configuration
 */
export function setTimeBasedVisibility(
  componentId: ComponentId,
  timeConfig: {
    showDelay?: number;
    hideDelay?: number;
    autoStart?: boolean;
  } = {}
) {
  return modifyVisibility(componentId, {
    timeBasedMode: true,
    showDelay: timeConfig.showDelay ?? 2000,
    hideDelay: timeConfig.hideDelay ?? 2000,
    autoStart: timeConfig.autoStart ?? true
  });
}

/**
 * Helper function to modify component to area-based mode
 * @param componentId - Component ID to modify
 * @param areaConfig - Area-based configuration
 */
export function setAreaBasedVisibility(
  componentId: ComponentId,
  areaConfig: {
    componentPosition?: { x: number; y: number };
    proximityRadius?: number;
    hideDelay?: number;
    autoStart?: boolean;
  } = {}
) {
  return modifyVisibility(componentId, {
    areaBasedMode: true,
    componentPosition: areaConfig.componentPosition ?? { x: 0, y: 0 },
    proximityRadius: areaConfig.proximityRadius ?? 100,
    hideDelay: areaConfig.hideDelay ?? 2000,
    autoStart: areaConfig.autoStart ?? true
  });
}

/**
 * Helper function to modify component to trigger-based mode
 * @param componentId - Component ID to modify
 * @param triggerConfig - Trigger-based configuration
 */
export function setTriggerBasedVisibility(
  componentId: ComponentId,
  triggerConfig: {
    initialVisible?: boolean;
  } = {}
) {
  return modifyVisibility(componentId, {
    triggerMode: true,
    initialVisible: triggerConfig.initialVisible ?? false
  });
}

/**
 * Get current configuration of a component (read-only)
 * @param componentId - Component ID to get configuration for
 */
export function getVisibilityConfig(componentId: ComponentId) {
  const component = viewportVisibilityStore.getComponent(componentId);
  
  if (!component) {
    console.warn(`Component with ID "${componentId}" not found.`);
    return null;
  }

  // Get current states
  let visible: boolean = false;
  let showComponent: boolean | null = null;
  
  component.visible.subscribe(value => {
    visible = value;
  })();
  
  component.showComponent.subscribe(value => {
    showComponent = value;
  })();

  // Get lock state
  const lockState = lockMap.get(componentId);
  
  return {
    currentState: {
      visible,
      showComponent
    },
    lockState: {
      isLocked: lockState?.locked ?? false,
      lockedValue: lockState?.lockedValue ?? null,
      originalValue: lockState?.originalValue ?? null
    }
  };
}

/**
 * Check if visibility is locked for specific component(s) or all components
 * @param selectedComponent - Component ID(s) to check: undefined to check if all components are locked, string for single component, or array for multiple components
 * @returns true if locked, false if not locked. For arrays, returns true only if ALL specified components are locked
 */
export function isVisibilityLocked(selectedComponent?: ComponentId | ComponentId[]): boolean {
  if (selectedComponent === undefined) {
    // Check if all components are locked
    let hasComponents = false;
    globalState.subscribe(state => {
      hasComponents = state.activeComponents.size > 0;
      for (const [id] of state.activeComponents) {
        if (!isLocked(id)) {
          return false;
        }
      }
    })();
    return hasComponents; // Return true only if there are components and all are locked
  } else if (Array.isArray(selectedComponent)) {
    // Check if all specified components are locked
    if (selectedComponent.length === 0) return false;
    return selectedComponent.every(id => isLocked(id));
  } else {
    // Check single specific component
    return isLocked(selectedComponent);
  }
}

/**
 * Get locked value for a specific component
 * @param componentId - Component ID to get locked value for
 * @returns locked value or null if not locked
 */
export function getVisibilityLockedValue(componentId: string): boolean | null {
  return getLockedValue(componentId);
}

// Export types for external use
export type { ViewportPositionConfig, ViewportPositionState } from '$lib/utils/viewport/visibility.js';
export { ViewportPositionPresets } from '$lib/utils/viewport/visibility.js';

/**
 * ============================================================================
 * LEGACY COMPATIBILITY FUNCTIONS
 * ============================================================================
 * These functions provide backward compatibility with the old visibility store
 * They maintain the same API but use the new viewport visibility system internally
 */

// Legacy visibility store map for backward compatibility
const legacyVisibilityMap = new Map<string | null, Writable<boolean>>();

/**
 * Legacy function: Get visibility store for backward compatibility
 * @param id - Component identifier (string or null)
 * @returns Writable store for visibility state
 */
export function getVisibilityStore(id: string | null = null): Writable<boolean> {
  if (!legacyVisibilityMap.has(id)) {
    // Create a new writable store
    const store = writable(true);
    legacyVisibilityMap.set(id, store);
    
    // If id is provided and it's a valid ComponentId, sync with viewport system
       if (id && Object.values(ComponentId).includes(id as ComponentId)) {
         const componentId = id as ComponentId;
         
         // Try to get existing component or create a new one
         let component = viewportVisibilityStore.getComponent(componentId);
         
         if (!component) {
           // Create a new trigger-based component
           const manager = new ViewportVisibilityManager(componentId, {
             triggerMode: true,
             initialVisible: true
           });
           component = viewportVisibilityStore.getComponent(componentId);
         }
         
         // Sync the legacy store with the viewport component
         if (component) {
           component.visible.subscribe(visible => {
             store.set(visible);
           });
           
           // When legacy store changes, update the viewport component
           store.subscribe(visible => {
             if (visible) {
               component?.show();
             } else {
               component?.hide();
             }
           });
         }
       }
  }
  return legacyVisibilityMap.get(id)!;
}

/**
 * Legacy function: Create visibility handler for backward compatibility
 * @param id - Component identifier (string or null)
 * @returns Handler function that respects lock state
 */
export function createVisibilityHandler(id: string | null = null) {
  const store = getVisibilityStore(id);

  // Return the handler function that respects lock state
  const handler = (visible: boolean) => {
    // Check if component is locked (using new system if it's a ComponentId)
    if (id && Object.values(ComponentId).includes(id as ComponentId)) {
      const componentId = id as ComponentId;
      if (isLocked(componentId)) {
        // If locked, ignore attempts to change visibility to true
        if (visible === true) {
          return; // Ignore the change
        }
        // Allow setting to false even when locked
        store.set(visible);
      } else {
        // Normal behavior when not locked
        store.set(visible);
      }
    } else {
      // For non-ComponentId identifiers, use legacy lock check
      const legacyLockState = lockMap.get(id || 'legacy');
      if (legacyLockState?.locked) {
        // If locked, ignore attempts to change visibility to true
        if (visible === true) {
          return; // Ignore the change
        }
        // Allow setting to false even when locked
        store.set(visible);
      } else {
        // Normal behavior when not locked
        store.set(visible);
      }
    }
  };

  return handler;
}

/**
 * Legacy function: Create visibility toggle for backward compatibility
 * @param id - Component identifier (string or null)
 * @returns Toggle function that respects lock state
 */
export function createVisibilityToggle(id: string | null = null) {
  const store = getVisibilityStore(id);

  // Return the toggle function that respects lock state
  const toggle = () => {
    // Check if component is locked (using new system if it's a ComponentId)
    if (id && Object.values(ComponentId).includes(id as ComponentId)) {
      const componentId = id as ComponentId;
      if (isLocked(componentId)) {
        // If locked, ignore toggle attempts that would set to true
        store.update(current => {
          if (!current) {
            // Currently false, would toggle to true - ignore if locked
            return current;
          } else {
            // Currently true, would toggle to false - allow
            return !current;
          }
        });
      } else {
        // Normal toggle behavior when not locked
        store.update(current => !current);
      }
    } else {
      // For non-ComponentId identifiers, use legacy lock check
      const legacyLockState = lockMap.get(id || 'legacy');
      if (legacyLockState?.locked) {
        // If locked, ignore toggle attempts that would set to true
        store.update(current => {
          if (!current) {
            // Currently false, would toggle to true - ignore if locked
            return current;
          } else {
            // Currently true, would toggle to false - allow
            return !current;
          }
        });
      } else {
        // Normal toggle behavior when not locked
        store.update(current => !current);
      }
    }
  };

  return toggle;
}

/**
 * Get all legacy visibility stores for backward compatibility
 * @returns Map of all legacy visibility stores
 */
export function getAllVisibilityStores(): Map<string | null, Writable<boolean>> {
  return new Map(legacyVisibilityMap);
}

/**
 * Get all lock states for backward compatibility
 * @returns Map of all lock states
 */
export function getAllLockStates(): Map<string | null, { locked: boolean; lockedValue: boolean }> {
  const result = new Map<string | null, { locked: boolean; lockedValue: boolean }>();
  
  // Add ComponentId lock states
  for (const [componentId, lockState] of lockMap) {
    result.set(componentId, {
      locked: lockState.locked,
      lockedValue: lockState.lockedValue !== null ? Boolean(lockState.lockedValue) : false
    });
  }
  
  return result;
}