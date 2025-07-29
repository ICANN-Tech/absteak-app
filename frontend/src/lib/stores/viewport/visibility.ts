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
 * Lock visibility for specific component or all components
 * When locked, showComponent will be forced to the locked value regardless of other settings
 * @param componentId - Component ID to lock, or undefined to lock all components
 * @param lockedValue - Value to lock showComponent to (true/false/null)
 */
export function lockVisibility(componentId?: string, lockedValue: boolean | null = false) {
  if (componentId === undefined) {
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
  } else {
    // Lock specific component
    const component = viewportVisibilityStore.getComponent(componentId);
    let originalValue: boolean | null = null;
    
    if (component) {
      // Get current showComponent value as original value
      component.showComponent.subscribe(value => {
        originalValue = value;
      })();
      
      lockMap.set(componentId, { locked: true, lockedValue, originalValue });
      component.setShowComponent(lockedValue);
    } else {
      // If component doesn't exist yet, set with null original value
      lockMap.set(componentId, { locked: true, lockedValue, originalValue: null });
    }
  }
}

/**
 * Unlock visibility for specific component or all components
 * @param componentId - Component ID to unlock, or undefined to unlock all components
 */
export function unlockVisibility(componentId?: string) {
  if (componentId === undefined) {
    // Unlock all components
    globalState.update(state => {
      state.activeComponents.forEach((component, id) => {
        const lockState = lockMap.get(id);
        const originalValue = lockState?.originalValue ?? null;
        
        lockMap.set(id, { locked: false, lockedValue: null, originalValue: null });
        // Restore original value instead of resetting to null
        component.setShowComponent(originalValue);
      });
      return state;
    });
  } else {
    // Unlock specific component
    const lockState = lockMap.get(componentId);
    const originalValue = lockState?.originalValue ?? null;
    
    lockMap.set(componentId, { locked: false, lockedValue: null, originalValue: null });
    
    // Restore original value instead of resetting to null
    const component = viewportVisibilityStore.getComponent(componentId);
    if (component) {
      component.setShowComponent(originalValue);
    }
  }
}

/**
 * Check if visibility is locked for specific component or all components
 * @param componentId - Component ID to check, or undefined to check if all components are locked
 * @returns true if locked, false if not locked
 */
export function isVisibilityLocked(componentId?: string): boolean {
  if (componentId === undefined) {
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
  } else {
    // Check specific component
    return isLocked(componentId);
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