import { w as writable } from "./index7.js";
import { hideComponent, showComponent, createStateVisibility } from "./visibility.js";
import { D as DEFAULT_MANUAL_COMPONENTS, a as DEFAULT_SECTION_CONFIG, h as handleSectionExit, b as handleSectionCall } from "./base3.js";
const registeredComponents = /* @__PURE__ */ new Map();
const componentTrackingStore = writable(/* @__PURE__ */ new Map());
const registeredComponentTrackingStore = writable(/* @__PURE__ */ new Map());
function createVideoHighlightMonitor() {
  return {
    /**
     * Registers a component for viewport monitoring.
     */
    registeredComponents: (componentId, config) => {
      const defaultConfig = {
        hideDelay: 2e3,
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
     * Shows components when entering video highlight section (all except ScrollIndicator and BackToTop).
     */
    callSection: () => {
      handleSectionCall(DEFAULT_SECTION_CONFIG, componentTrackingStore);
      registeredComponents.forEach((visibility) => {
        visibility.show();
      });
    },
    /**
     * Shows all components when exiting video highlight section.
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
    monitorComponent(componentId) {
      const isVisible = this.isComponentVisible(componentId);
      const isInConfig = DEFAULT_SECTION_CONFIG.showOnCall?.includes(componentId) || false;
      return {
        shouldBeVisible: isVisible,
        isInVisibleList: isInConfig
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
        const shouldShow = componentId === targetComponentId;
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
        const shouldHide = componentId === targetComponentId;
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
          newStore.set(componentId, componentId !== targetComponentId);
        });
        return newStore;
      });
    },
    /**
     * Toggles the visibility of a component.
     */
    toggleComponent(componentId) {
      const isCurrentlyVisible = this.isComponentVisible(componentId);
      if (isCurrentlyVisible) {
        this.hideOnlyComponent(componentId);
      } else {
        this.showOnlyComponent(componentId);
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
    // Additional interface methods
    getComponentTrackingStore: () => componentTrackingStore,
    getRegisteredComponentTrackingStore: () => registeredComponentTrackingStore,
    isComponentCurrentlyVisible: (componentId) => {
      let currentState = false;
      componentTrackingStore.subscribe((store) => {
        currentState = store.get(componentId) || false;
      })();
      return currentState;
    },
    getAllComponentsVisibilityStatus: () => {
      let currentState = {};
      componentTrackingStore.subscribe((store) => {
        store.forEach((isVisible, componentId) => {
          currentState[componentId] = isVisible;
        });
      })();
      return currentState;
    },
    getComponentVisibilityStore: () => componentTrackingStore,
    subscribeToComponentVisibility: (componentId, callback) => {
      componentTrackingStore.subscribe((store) => {
        const isVisible = store.get(componentId) || false;
        callback(isVisible);
      });
    },
    subscribeToAllComponentsVisibility: (callback) => {
      componentTrackingStore.subscribe((store) => {
        const record = {};
        store.forEach((isVisible, componentId) => {
          record[componentId] = isVisible;
        });
        callback(record);
      });
    },
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
const videoHighlightMonitor = createVideoHighlightMonitor();
function registerVideoHighlightComponent(componentId, config = {}) {
  return videoHighlightMonitor.registeredComponents(componentId, config);
}
function unregisterVideoHighlightComponent(componentId) {
  return videoHighlightMonitor.unregisteredComponents(componentId);
}
function getRegisteredVideoHighlightComponentsMap() {
  return new Map(registeredComponents);
}
function showVideoHighlightComponents(componentIds = []) {
  if (componentIds.length === 0) {
    videoHighlightMonitor.callSection();
  } else {
    componentIds.forEach((id) => videoHighlightMonitor.showOnlyComponent(id));
  }
}
function hideVideoHighlightComponents(componentIds = []) {
  if (componentIds.length === 0) {
    videoHighlightMonitor.exitSection();
  } else {
    componentIds.forEach((id) => videoHighlightMonitor.hideOnlyComponent(id));
  }
}
function getVideoHighlightVisibleComponents() {
  return videoHighlightMonitor.getVisibleComponents();
}
function isComponentVisibleInVideoHighlight(componentId) {
  return videoHighlightMonitor.isComponentVisible(componentId);
}
function monitorVideoHighlightComponent(componentId, config) {
  return videoHighlightMonitor.registeredComponents(componentId, config);
}
const getAllComponentsVisibilityStatus = () => videoHighlightMonitor.getAllComponentsVisibilityStatus();
const getComponentTrackingStore = () => videoHighlightMonitor.getComponentTrackingStore();
const getRegisteredComponentTrackingStore = () => videoHighlightMonitor.getRegisteredComponentTrackingStore();
const isComponentCurrentlyVisible = (componentId) => videoHighlightMonitor.isComponentCurrentlyVisible(componentId);
const getComponentVisibilityStore = () => videoHighlightMonitor.getComponentVisibilityStore();
const subscribeToComponentVisibility = (componentId, callback) => videoHighlightMonitor.subscribeToComponentVisibility(componentId, callback);
const subscribeToAllComponentsVisibility = (callback) => videoHighlightMonitor.subscribeToAllComponentsVisibility(callback);
const getVisibilityStatistics = () => videoHighlightMonitor.getVisibilityStatistics();
const updateManualComponentsTracking = (componentIds, isVisible) => videoHighlightMonitor.updateManualComponentsTracking(componentIds, isVisible);
const showOnlyVideoHighlightComponent = (componentId) => videoHighlightMonitor.showOnlyComponent(componentId);
const hideOnlyVideoHighlightComponent = (componentId) => videoHighlightMonitor.hideOnlyComponent(componentId);
const toggleVideoHighlightComponent = (componentId) => videoHighlightMonitor.toggleComponent(componentId);
const showOnlyVideoHighlightComponents = (componentIds) => videoHighlightMonitor.showOnlyComponents(componentIds);
export {
  createVideoHighlightMonitor,
  getAllComponentsVisibilityStatus,
  getComponentTrackingStore,
  getComponentVisibilityStore,
  getRegisteredComponentTrackingStore,
  getRegisteredVideoHighlightComponentsMap,
  getVideoHighlightVisibleComponents,
  getVisibilityStatistics,
  hideOnlyVideoHighlightComponent,
  hideVideoHighlightComponents,
  isComponentCurrentlyVisible,
  isComponentVisibleInVideoHighlight,
  monitorVideoHighlightComponent,
  registerVideoHighlightComponent,
  showOnlyVideoHighlightComponent,
  showOnlyVideoHighlightComponents,
  showVideoHighlightComponents,
  subscribeToAllComponentsVisibility,
  subscribeToComponentVisibility,
  toggleVideoHighlightComponent,
  unregisterVideoHighlightComponent,
  updateManualComponentsTracking,
  videoHighlightMonitor
};
