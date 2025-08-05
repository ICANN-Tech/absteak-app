import { hideComponent, showComponent, createStateVisibility } from "./visibility.js";
import { w as writable, d as derived } from "./index7.js";
import { D as DEFAULT_MANUAL_COMPONENTS, a as DEFAULT_SECTION_CONFIG, h as handleSectionExit, b as handleSectionCall } from "./base3.js";
const registeredComponents = /* @__PURE__ */ new Map();
const componentTrackingStore = writable(/* @__PURE__ */ new Map());
const registeredComponentTrackingStore = writable(/* @__PURE__ */ new Map());
function createMenuMonitor() {
  return {
    /**
     * Registers a component for viewport monitoring.
     */
    registeredComponents: (componentId, config) => {
      const defaultConfig = {
        hideDelay: 1500,
        initialVisible: false,
        ...config
      };
      const visibility = createStateVisibility(componentId.toString(), defaultConfig);
      registeredComponents.set(componentId, visibility);
      visibility.isDisplay.subscribe((isVisible) => {
        registeredComponentTrackingStore.update((store) => {
          const newStore = new Map(store);
          newStore.set(componentId, isVisible);
          return newStore;
        });
        componentTrackingStore.update((store) => {
          const newStore = new Map(store);
          newStore.set(componentId, isVisible);
          return newStore;
        });
      });
      return visibility;
    },
    /**
     * Unregisters a component from viewport monitoring.
     */
    unregisteredComponents: (componentId) => {
      const visibility = registeredComponents.get(componentId);
      if (visibility) {
        visibility.destroy();
        registeredComponents.delete(componentId);
        registeredComponentTrackingStore.update((store) => {
          const newStore = new Map(store);
          newStore.delete(componentId);
          return newStore;
        });
        componentTrackingStore.update((store) => {
          const newStore = new Map(store);
          newStore.delete(componentId);
          return newStore;
        });
      }
    },
    /**
     * Returns the visibility state of a component.
     */
    getComponentVisibility: (componentId) => {
      let currentState = false;
      componentTrackingStore.subscribe((store) => {
        currentState = store.get(componentId) || false;
      })();
      return currentState;
    },
    /**
     * Returns the visibility state of all components.
     */
    getAllComponentsVisibility: () => {
      let currentState = {};
      componentTrackingStore.subscribe((store) => {
        store.forEach((isVisible, componentId) => {
          currentState[componentId] = isVisible;
        });
      })();
      return currentState;
    },
    /**
     * Shows all registered components.
     */
    showRegisteredComponents: () => {
      registeredComponents.forEach((visibility) => {
        visibility.show();
      });
    },
    /**
     * Hides all registered components.
     */
    hideRegisteredComponents: () => {
      registeredComponents.forEach((visibility) => {
        visibility.hide();
      });
    },
    /**
     * Shows all components (manual + registered).
     */
    callSection: () => {
      handleSectionCall(DEFAULT_SECTION_CONFIG, componentTrackingStore);
      registeredComponents.forEach((visibility) => {
        visibility.show();
      });
    },
    /**
     * Shows all components (manual + registered).
     */
    exitSection: () => {
      handleSectionExit(DEFAULT_SECTION_CONFIG, componentTrackingStore);
      registeredComponents.forEach((visibility) => {
        visibility.show();
      });
    },
    /**
     * Returns list of currently visible components.
     */
    getVisibleComponents: () => {
      let visibleComponents = [];
      componentTrackingStore.subscribe((store) => {
        visibleComponents = [];
        store.forEach((isVisible, componentId) => {
          if (isVisible) {
            visibleComponents.push(componentId);
          }
        });
      })();
      return visibleComponents;
    },
    /**
     * Checks if a component is currently visible.
     */
    isComponentVisible: (componentId) => {
      let currentState = false;
      componentTrackingStore.subscribe((store) => {
        currentState = store.get(componentId) || false;
      })();
      return currentState;
    },
    /**
     * Monitors a specific component.
     */
    monitorComponent: function(componentId) {
      const shouldBeVisible = DEFAULT_SECTION_CONFIG.showOnCall?.includes(componentId) || false;
      return {
        shouldBeVisible,
        isInVisibleList: shouldBeVisible
      };
    },
    /**
     * Shows only the specified component and hides all others.
     */
    showOnlyComponent: (targetComponentId) => {
      const allComponents = [
        ...DEFAULT_MANUAL_COMPONENTS,
        ...Array.from(registeredComponents.keys())
      ];
      allComponents.forEach((componentId) => {
        if (componentId === targetComponentId) {
          if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
            showComponent(componentId);
          }
          const registeredComponent = registeredComponents.get(componentId);
          if (registeredComponent) {
            registeredComponent.show();
          }
        } else {
          if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
            hideComponent(componentId);
          }
          const registeredComponent = registeredComponents.get(componentId);
          if (registeredComponent) {
            registeredComponent.hide();
          }
        }
      });
      componentTrackingStore.update((store) => {
        const newStore = new Map(store);
        allComponents.forEach((componentId) => {
          newStore.set(componentId, componentId === targetComponentId);
        });
        return newStore;
      });
    },
    /**
     * Hides only the specified component and shows all others.
     */
    hideOnlyComponent: (targetComponentId) => {
      const allComponents = [
        ...DEFAULT_MANUAL_COMPONENTS,
        ...Array.from(registeredComponents.keys())
      ];
      allComponents.forEach((componentId) => {
        if (componentId === targetComponentId) {
          if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
            hideComponent(componentId);
          }
          const registeredComponent = registeredComponents.get(componentId);
          if (registeredComponent) {
            registeredComponent.hide();
          }
        } else {
          if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
            showComponent(componentId);
          }
          const registeredComponent = registeredComponents.get(componentId);
          if (registeredComponent) {
            registeredComponent.show();
          }
        }
      });
      componentTrackingStore.update((store) => {
        const newStore = new Map(store);
        allComponents.forEach((componentId) => {
          newStore.set(componentId, componentId !== targetComponentId);
        });
        return newStore;
      });
    },
    /**
     * Toggles the visibility of the specified component.
     */
    toggleComponent: (targetComponentId) => {
      let currentState = false;
      componentTrackingStore.subscribe((store) => {
        currentState = store.get(targetComponentId) || false;
      })();
      if (currentState) {
        if (DEFAULT_MANUAL_COMPONENTS.includes(targetComponentId)) {
          hideComponent(targetComponentId);
        }
        const registeredComponent = registeredComponents.get(targetComponentId);
        if (registeredComponent) {
          registeredComponent.hide();
        }
        componentTrackingStore.update((store) => {
          const newStore = new Map(store);
          newStore.set(targetComponentId, false);
          return newStore;
        });
      } else {
        menuMonitor.showOnlyComponent(targetComponentId);
      }
    },
    /**
     * Shows only the specified components and hides all others.
     */
    showOnlyComponents: (targetComponentIds) => {
      const allComponents = [
        ...DEFAULT_MANUAL_COMPONENTS,
        ...Array.from(registeredComponents.keys())
      ];
      allComponents.forEach((componentId) => {
        const shouldShow = targetComponentIds.includes(componentId);
        if (shouldShow) {
          if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
            showComponent(componentId);
          }
          const registeredComponent = registeredComponents.get(componentId);
          if (registeredComponent) {
            registeredComponent.show();
          }
        } else {
          if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
            hideComponent(componentId);
          }
          const registeredComponent = registeredComponents.get(componentId);
          if (registeredComponent) {
            registeredComponent.hide();
          }
        }
      });
      componentTrackingStore.update((store) => {
        const newStore = new Map(store);
        allComponents.forEach((componentId) => {
          newStore.set(componentId, targetComponentIds.includes(componentId));
        });
        return newStore;
      });
    },
    /**
     * Hides only the specified components and shows all others.
     */
    hideOnlyComponents: (targetComponentIds) => {
      const allComponents = [
        ...DEFAULT_MANUAL_COMPONENTS,
        ...Array.from(registeredComponents.keys())
      ];
      allComponents.forEach((componentId) => {
        const shouldHide = targetComponentIds.includes(componentId);
        if (shouldHide) {
          if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
            hideComponent(componentId);
          }
          const registeredComponent = registeredComponents.get(componentId);
          if (registeredComponent) {
            registeredComponent.hide();
          }
        } else {
          if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
            showComponent(componentId);
          }
          const registeredComponent = registeredComponents.get(componentId);
          if (registeredComponent) {
            registeredComponent.show();
          }
        }
      });
      componentTrackingStore.update((store) => {
        const newStore = new Map(store);
        allComponents.forEach((componentId) => {
          newStore.set(componentId, !targetComponentIds.includes(componentId));
        });
        return newStore;
      });
    },
    /**
     * Returns the component tracking store.
     */
    getComponentTrackingStore: () => {
      return componentTrackingStore;
    },
    /**
     * Returns the registered component tracking store.
     */
    getRegisteredComponentTrackingStore: () => {
      return registeredComponentTrackingStore;
    },
    /**
     * Checks if a component is currently visible.
     */
    isComponentCurrentlyVisible: (componentId) => {
      let currentState = false;
      componentTrackingStore.subscribe((store) => {
        currentState = store.get(componentId) || false;
      })();
      return currentState;
    },
    /**
     * Returns the visibility status of all components.
     */
    getAllComponentsVisibilityStatus: () => {
      let currentState = {};
      componentTrackingStore.subscribe((store) => {
        store.forEach((isVisible, componentId) => {
          currentState[componentId] = isVisible;
        });
      })();
      return currentState;
    },
    /**
     * Returns the component visibility store.
     */
    getComponentVisibilityStore: () => {
      return componentTrackingStore;
    },
    /**
     * Subscribes to component visibility changes.
     */
    subscribeToComponentVisibility: (componentId, callback) => {
      const store = derived(componentTrackingStore, ($store) => {
        return $store.get(componentId) || false;
      });
      store.subscribe(callback);
    },
    /**
     * Subscribes to all components visibility changes.
     */
    subscribeToAllComponentsVisibility: (callback) => {
      componentTrackingStore.subscribe((store) => {
        const visibilityStatus = {};
        store.forEach((isVisible, componentId) => {
          visibilityStatus[componentId] = isVisible;
        });
        callback(visibilityStatus);
      });
    },
    /**
     * Returns visibility statistics.
     */
    getVisibilityStatistics: () => {
      let stats = {
        totalComponents: 0,
        visibleComponents: 0,
        hiddenComponents: 0,
        visibilityPercentage: 0,
        visibleComponentIds: [],
        hiddenComponentIds: []
      };
      componentTrackingStore.subscribe((store) => {
        stats.totalComponents = store.size;
        stats.visibleComponents = 0;
        stats.visibleComponentIds = [];
        stats.hiddenComponentIds = [];
        store.forEach((isVisible, componentId) => {
          if (isVisible) {
            stats.visibleComponents++;
            stats.visibleComponentIds.push(componentId);
          } else {
            stats.hiddenComponentIds.push(componentId);
          }
        });
        stats.hiddenComponents = stats.totalComponents - stats.visibleComponents;
        stats.visibilityPercentage = stats.totalComponents > 0 ? stats.visibleComponents / stats.totalComponents * 100 : 0;
      })();
      return stats;
    },
    /**
     * Updates manual components tracking.
     */
    updateManualComponentsTracking: (componentIds, isVisible) => {
      componentTrackingStore.update((store) => {
        const newStore = new Map(store);
        componentIds.forEach((componentId) => {
          newStore.set(componentId, isVisible);
        });
        return newStore;
      });
    }
  };
}
const menuMonitor = createMenuMonitor();
const showMenuComponents = menuMonitor.callSection;
const hideMenuComponents = menuMonitor.exitSection;
const registerMenuComponent = menuMonitor.registeredComponents;
const unregisterMenuComponent = menuMonitor.unregisteredComponents;
const getVisibleMenuComponents = menuMonitor.getVisibleComponents;
const isMenuComponentVisible = menuMonitor.isComponentVisible;
const monitorMenuComponent = menuMonitor.monitorComponent;
const showOnlyMenuComponent = menuMonitor.showOnlyComponent;
const hideOnlyMenuComponent = menuMonitor.hideOnlyComponent;
const toggleMenuComponent = menuMonitor.toggleComponent;
const showOnlyMenuComponents = menuMonitor.showOnlyComponents;
const hideOnlyMenuComponents = menuMonitor.hideOnlyComponents;
const getMenuComponentTrackingStore = menuMonitor.getComponentTrackingStore;
const getRegisteredMenuComponentTrackingStore = menuMonitor.getRegisteredComponentTrackingStore;
const isMenuComponentCurrentlyVisible = menuMonitor.isComponentCurrentlyVisible;
const getAllMenuComponentsVisibilityStatus = menuMonitor.getAllComponentsVisibilityStatus;
const getMenuComponentVisibilityStore = menuMonitor.getComponentVisibilityStore;
const subscribeToMenuComponentVisibility = menuMonitor.subscribeToComponentVisibility;
const subscribeToAllMenuComponentsVisibility = menuMonitor.subscribeToAllComponentsVisibility;
const getMenuVisibilityStatistics = menuMonitor.getVisibilityStatistics;
const updateMenuManualComponentsTracking = menuMonitor.updateManualComponentsTracking;
function getRegisteredMenuComponents() {
  return registeredComponents;
}
export {
  createMenuMonitor,
  getAllMenuComponentsVisibilityStatus,
  getMenuComponentTrackingStore,
  getMenuComponentVisibilityStore,
  getMenuVisibilityStatistics,
  getRegisteredMenuComponentTrackingStore,
  getRegisteredMenuComponents,
  getVisibleMenuComponents,
  hideMenuComponents,
  hideOnlyMenuComponent,
  hideOnlyMenuComponents,
  isMenuComponentCurrentlyVisible,
  isMenuComponentVisible,
  menuMonitor,
  monitorMenuComponent,
  registerMenuComponent,
  showMenuComponents,
  showOnlyMenuComponent,
  showOnlyMenuComponents,
  subscribeToAllMenuComponentsVisibility,
  subscribeToMenuComponentVisibility,
  toggleMenuComponent,
  unregisterMenuComponent,
  updateMenuManualComponentsTracking
};
