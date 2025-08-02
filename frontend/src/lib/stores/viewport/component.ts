/**
 * Component State Snapshot Management
 * 
 * This module provides functionality to capture, store, and restore component visibility states
 * with unique snapshot identifiers. Useful for modal systems that need to temporarily hide
 * components and restore them later.
 */

import { writable } from 'svelte/store';
import { ComponentId } from '$lib/enums';
import { 
  getVisibilityConfig, 
  showComponent, 
  hideComponent, 
  setComponentVisibility,
  isVisibilityLocked,
  getVisibilityLockedValue,
  unlockVisibility,
  lockVisibility
} from './visibility';

// Interface for component state snapshot
interface ComponentStateSnapshot {
  componentId: ComponentId;
  showComponent: boolean | null;
  visible: boolean;
  isLocked: boolean; // Track if component was locked
  lockedValue: boolean | null; // Track what value it was locked to
}

// Interface for snapshot collection
interface StateSnapshot {
  snapshotId: string;
  timestamp: number;
  components: ComponentStateSnapshot[];
}

// Store for managing snapshots
const snapshots = writable<Map<string, StateSnapshot>>(new Map());

/**
 * Get all available components
 */
function getAllComponents(): ComponentId[] {
  return [
    ComponentId.Navigation,
    ComponentId.Schedule,
    ComponentId.Highlight,
    ComponentId.LanguageSwitch,
    ComponentId.VideoPromotion,
    ComponentId.ChatBot,
    ComponentId.Operation
  ];
}

/**
 * Capture current state of all components
 * @param snapshotId Unique identifier for this snapshot (e.g., modal name)
 * @returns Success status
 */
export function captureComponentSnapshot(snapshotId: string): boolean {
  try {
    const allComponents = getAllComponents();
    const componentStates: ComponentStateSnapshot[] = [];

    allComponents.forEach(componentId => {
      const config = getVisibilityConfig(componentId);
      if (config) {
        const isLocked = isVisibilityLocked(componentId);
        const lockedValue = isLocked ? getVisibilityLockedValue(componentId) : null;
        
        componentStates.push({
          componentId,
          showComponent: config.currentState.showComponent,
          visible: config.currentState.visible,
          isLocked,
          lockedValue
        });
      }
    });

    const snapshot: StateSnapshot = {
      snapshotId,
      timestamp: Date.now(),
      components: componentStates
    };

    snapshots.update(store => {
      store.set(snapshotId, snapshot);
      return store;
    });

    console.log(`Component snapshot captured: ${snapshotId}`, componentStates);
    return true;
  } catch (error) {
    console.error(`Failed to capture component snapshot: ${snapshotId}`, error);
    return false;
  }
}

/**
 * Restore component states from snapshot
 * @param snapshotId Unique identifier for the snapshot to restore
 * @returns Success status
 */
export function restoreComponentSnapshot(snapshotId: string): boolean {
  try {
    let targetSnapshot: StateSnapshot | undefined;

    snapshots.subscribe(store => {
      targetSnapshot = store.get(snapshotId);
    })();

    if (!targetSnapshot) {
      console.warn(`Snapshot not found: ${snapshotId}`);
      return false;
    }

    // Restore each component to its previous state (including lock state)
    targetSnapshot.components.forEach(state => {
      console.log('Restoring component:', state.componentId, {
        showComponent: state.showComponent,
        visible: state.visible,
        isLocked: state.isLocked,
        lockedValue: state.lockedValue
      });
      
      // First, handle the lock state
      if (state.isLocked) {
        // If component was locked, restore it to locked state with original value
        lockVisibility(state.componentId, state.lockedValue);
      } else {
        // If component was not locked, make sure it's unlocked
        if (isVisibilityLocked(state.componentId)) {
          unlockVisibility(state.componentId);
        }
        
        // Then set the visibility state
        if (state.showComponent === true) {
          showComponent(state.componentId);
        } else if (state.showComponent === false) {
          hideComponent(state.componentId);
        } else {
          // If showComponent was null, reset to use normal visibility logic
          setComponentVisibility(state.componentId, null);
        }
      }
    });

    console.log(`Component snapshot restored: ${snapshotId}`, targetSnapshot.components);
    return true;
  } catch (error) {
    console.error(`Failed to restore component snapshot: ${snapshotId}`, error);
    return false;
  }
}

/**
 * Delete a snapshot
 * @param snapshotId Unique identifier for the snapshot to delete
 * @returns Success status
 */
export function deleteComponentSnapshot(snapshotId: string): boolean {
  try {
    snapshots.update(store => {
      const deleted = store.delete(snapshotId);
      if (deleted) {
        console.log(`Component snapshot deleted: ${snapshotId}`);
      } else {
        console.warn(`Snapshot not found for deletion: ${snapshotId}`);
      }
      return store;
    });
    return true;
  } catch (error) {
    console.error(`Failed to delete component snapshot: ${snapshotId}`, error);
    return false;
  }
}

/**
 * Check if a snapshot exists
 * @param snapshotId Unique identifier for the snapshot
 * @returns Whether the snapshot exists
 */
export function hasComponentSnapshot(snapshotId: string): boolean {
  let exists = false;
  snapshots.subscribe(store => {
    exists = store.has(snapshotId);
  })();
  return exists;
}

/**
 * Get all snapshot IDs
 * @returns Array of snapshot IDs
 */
export function getAllSnapshotIds(): string[] {
  let ids: string[] = [];
  snapshots.subscribe(store => {
    ids = Array.from(store.keys());
  })();
  return ids;
}

/**
 * Clear all snapshots
 */
export function clearAllSnapshots(): void {
  snapshots.update(store => {
    store.clear();
    console.log('All component snapshots cleared');
    return store;
  });
}

/**
 * Get snapshot details
 * @param snapshotId Unique identifier for the snapshot
 * @returns Snapshot details or null if not found
 */
export function getSnapshotDetails(snapshotId: string): StateSnapshot | null {
  let snapshot: StateSnapshot | null = null;
  snapshots.subscribe(store => {
    snapshot = store.get(snapshotId) || null;
  })();
  return snapshot;
}

/**
 * Hide all components and capture snapshot (handles locked components)
 * @param snapshotId Unique identifier for this snapshot
 * @returns Success status
 */
export function hideAllComponentsWithSnapshot(snapshotId: string): boolean {
  try {
    // First capture the current state (including lock states)
    const captured = captureComponentSnapshot(snapshotId);
    if (!captured) {
      return false;
    }

    // Get all components and their lock states
    const allComponents = getAllComponents();
    const lockedComponents: ComponentId[] = [];
    const unlockedComponents: ComponentId[] = [];

    // Separate locked and unlocked components
    allComponents.forEach(componentId => {
      if (isVisibilityLocked(componentId)) {
        lockedComponents.push(componentId);
      } else {
        unlockedComponents.push(componentId);
      }
    });

    // Hide unlocked components normally
    if (unlockedComponents.length > 0) {
      hideComponent(unlockedComponents);
    }

    // For locked components, temporarily unlock, hide, then lock back to hidden
    if (lockedComponents.length > 0) {
      lockedComponents.forEach(componentId => {
        // Temporarily unlock the component
        unlockVisibility(componentId);
        // Hide the component
        hideComponent(componentId);
        // Lock it back to hidden state
        lockVisibility(componentId, false);
      });
    }

    console.log(`All components hidden with snapshot: ${snapshotId}`, {
      unlockedComponents,
      lockedComponents
    });
    return true;
  } catch (error) {
    console.error(`Failed to hide components with snapshot: ${snapshotId}`, error);
    return false;
  }
}

/**
 * Utility functions for common modal operations
 */
export const componentSnapshotUtils = {
  // Create snapshot for modal
  captureForModal: (modalName: string) => captureComponentSnapshot(`modal-${modalName}`),
  
  // Restore snapshot for modal
  restoreForModal: (modalName: string) => restoreComponentSnapshot(`modal-${modalName}`),
  
  // Delete snapshot for modal
  cleanupForModal: (modalName: string) => deleteComponentSnapshot(`modal-${modalName}`),
  
  // Hide all and capture for modal
  hideAllForModal: (modalName: string) => hideAllComponentsWithSnapshot(`modal-${modalName}`),
  
  // Check if modal snapshot exists
  hasModalSnapshot: (modalName: string) => hasComponentSnapshot(`modal-${modalName}`)
};

// Export the snapshots store for debugging purposes
export { snapshots as componentSnapshots };