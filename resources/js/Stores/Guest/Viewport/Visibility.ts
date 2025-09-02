import { writable, type Writable } from 'svelte/store';

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
  Sidebar = 'sidebar'
}

/**
 * Interface defining the visibility state of a single component
 * 
 * @interface ComponentVisibilityState
 * @property {boolean} visible - Current visibility status of the component
 * @property {boolean} locked - Whether the component's visibility is locked from changes
 * @property {number} lastUpdated - Timestamp of the last visibility change
 */
export interface ComponentVisibilityState {
  visible: boolean;
  locked: boolean;
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
 * Configuration options for visibility operations
 * 
 * @interface VisibilityOptions
 * @property {boolean} [force] - Force the operation even if component is locked
 * @property {boolean} [silent] - Perform operation without triggering store updates
 */
export interface VisibilityOptions {
  force?: boolean;
  silent?: boolean;
}

/**
 * Initial visibility state for all components
 * All components start as visible and unlocked
 */
const initialState: VisibilityStore = {
  [ComponentId.Navigation]: { visible: true, locked: false, lastUpdated: Date.now() },
  [ComponentId.Highlight]: { visible: true, locked: false, lastUpdated: Date.now() },
  [ComponentId.Locale]: { visible: true, locked: false, lastUpdated: Date.now() },
  [ComponentId.Operation]: { visible: true, locked: false, lastUpdated: Date.now() },
  [ComponentId.ChatBot]: { visible: true, locked: false, lastUpdated: Date.now() },
  [ComponentId.Footer]: { visible: true, locked: false, lastUpdated: Date.now() },
  [ComponentId.Header]: { visible: true, locked: false, lastUpdated: Date.now() },
  [ComponentId.Sidebar]: { visible: true, locked: false, lastUpdated: Date.now() }
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
  visible: boolean,
  options: VisibilityOptions = {}
): void {
  if (options.silent) return;

  visibilityStore.update(store => {
    const newStore = { ...store };
    
    componentIds.forEach(componentId => {
      const currentState = newStore[componentId];
      
      // Skip if component is locked and force is not enabled
      if (currentState?.locked && !options.force) {
        console.warn(`Component ${componentId} is locked and cannot be modified without force option`);
        return;
      }
      
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
export function showComponent(target: ComponentTarget, options: VisibilityOptions = {}): void {
  const componentIds = normalizeTarget(target);
  updateComponentsVisibility(componentIds, true, options);
}

/**
 * Hides one or more components by setting their visibility to false
 * 
 * @param {ComponentTarget} target - Component ID(s) to hide
 * @param {VisibilityOptions} [options] - Configuration options
 * 
 * @example
 * ```typescript
 * // Hide a single component
 * hideComponent(ComponentId.Highlight);
 * 
 * // Hide multiple components
 * hideComponent([ComponentId.Navigation, ComponentId.ChatBot]);
 * 
 * // Force hide a locked component
 * hideComponent(ComponentId.Sidebar, { force: true });
 * ```
 */
export function hideComponent(target: ComponentTarget, options: VisibilityOptions = {}): void {
  const componentIds = normalizeTarget(target);
  updateComponentsVisibility(componentIds, false, options);
}

/**
 * Toggles the visibility of one or more components
 * 
 * @param {ComponentTarget} target - Component ID(s) to toggle
 * @param {VisibilityOptions} [options] - Configuration options
 * 
 * @example
 * ```typescript
 * // Toggle a single component
 * toggleComponentVisibility(ComponentId.Locale);
 * 
 * // Toggle multiple components
 * toggleComponentVisibility([ComponentId.Locale, ComponentId.Operation]);
 * 
 * // Force toggle locked components
 * toggleComponentVisibility(ComponentId.Navigation, { force: true });
 * ```
 */
export function toggleComponentVisibility(target: ComponentTarget, options: VisibilityOptions = {}): void {
  const componentIds = normalizeTarget(target);
  
  visibilityStore.update(store => {
    const newStore = { ...store };
    
    componentIds.forEach(componentId => {
      const currentState = newStore[componentId];
      
      // Skip if component is locked and force is not enabled
      if (currentState?.locked && !options.force) {
        console.warn(`Component ${componentId} is locked and cannot be modified without force option`);
        return;
      }
      
      // Toggle the component visibility
      newStore[componentId] = {
        ...currentState,
        visible: !currentState.visible,
        lastUpdated: Date.now()
      };
    });
    
    return newStore;
  });
}

/**
 * Locks one or more components to prevent visibility changes
 * 
 * @param {ComponentTarget} target - Component ID(s) to lock
 * 
 * @example
 * ```typescript
 * // Lock a single component
 * lockComponent(ComponentId.Header);
 * 
 * // Lock multiple components
 * lockComponent([ComponentId.Header, ComponentId.Footer]);
 * ```
 */
export function lockComponent(target: ComponentTarget): void {
  const componentIds = normalizeTarget(target);
  
  visibilityStore.update(store => {
    const newStore = { ...store };
    
    componentIds.forEach(componentId => {
      if (newStore[componentId]) {
        newStore[componentId] = {
          ...newStore[componentId],
          locked: true,
          lastUpdated: Date.now()
        };
      }
    });
    
    return newStore;
  });
}

/**
 * Unlocks one or more components to allow visibility changes
 * 
 * @param {ComponentTarget} target - Component ID(s) to unlock
 * 
 * @example
 * ```typescript
 * // Unlock a single component
 * unlockComponent(ComponentId.Header);
 * 
 * // Unlock multiple components
 * unlockComponent([ComponentId.Header, ComponentId.Footer]);
 * ```
 */
export function unlockComponent(target: ComponentTarget): void {
  const componentIds = normalizeTarget(target);
  
  visibilityStore.update(store => {
    const newStore = { ...store };
    
    componentIds.forEach(componentId => {
      if (newStore[componentId]) {
        newStore[componentId] = {
          ...newStore[componentId],
          locked: false,
          lastUpdated: Date.now()
        };
      }
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
 * Checks if a component is currently locked
 * 
 * @param {ComponentId} componentId - Component ID to check
 * @returns {boolean} True if component is locked, false otherwise
 * 
 * @example
 * ```typescript
 * if (isComponentLocked(ComponentId.Header)) {
 *   console.log('Header is locked');
 * }
 * ```
 */
export function isComponentLocked(componentId: ComponentId): boolean {
  let isLocked = false;
  
  visibilityStore.subscribe(store => {
    isLocked = store[componentId]?.locked ?? false;
  })();
  
  return isLocked;
}

/**
 * Gets the complete visibility state of a component
 * 
 * @param {ComponentId} componentId - Component ID to get state for
 * @returns {ComponentVisibilityState | null} Component state or null if not found
 * 
 * @example
 * ```typescript
 * const state = getComponentState(ComponentId.Navigation);
 * if (state) {
 *   console.log(`Visible: ${state.visible}, Locked: ${state.locked}`);
 * }
 * ```
 */
export function getComponentState(componentId: ComponentId): ComponentVisibilityState | null {
  let state: ComponentVisibilityState | null = null;
  
  visibilityStore.subscribe(store => {
    state = store[componentId] ?? null;
  })();
  
  return state;
}

/**
 * Resets all components to their initial visibility state
 * 
 * @param {VisibilityOptions} [options] - Configuration options
 * 
 * @example
 * ```typescript
 * // Reset all components
 * resetAllComponents();
 * 
 * // Force reset even locked components
 * resetAllComponents({ force: true });
 * ```
 */
export function resetAllComponents(options: VisibilityOptions = {}): void {
  visibilityStore.update(store => {
    const newStore = { ...store };
    
    Object.keys(newStore).forEach(componentId => {
      const currentState = newStore[componentId];
      
      // Skip if component is locked and force is not enabled
      if (currentState?.locked && !options.force) {
        return;
      }
      
      // Reset to initial state
      newStore[componentId] = {
        visible: true,
        locked: false,
        lastUpdated: Date.now()
      };
    });
    
    return newStore;
  });
}