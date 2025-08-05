import { w as writable, d as derived } from "./index7.js";
function createViewportPosition(config = {}) {
  const {
    hideDelay = 2e3,
    showDelay = 2e3,
    proximityRadius = 100,
    componentPosition = { x: 0, y: 0 },
    initialVisible = false,
    timeBasedMode = false,
    areaBasedMode = false,
    triggerMode = false,
    autoStart = false,
    showComponent: showComponent2 = false
  } = config;
  const visible = writable(initialVisible);
  const showComponentStore = writable(showComponent2);
  const isTimeMode = writable(timeBasedMode);
  const isAreaMode = writable(areaBasedMode);
  const isTriggerMode = writable(triggerMode);
  let hideTimeout = null;
  let showTimeout = null;
  let timeCycleInterval = null;
  let mouseMoveHandler = null;
  let currentComponentPosition = { ...componentPosition };
  let currentProximityRadius = proximityRadius;
  let isNearComponent = false;
  function show() {
    clearTimeouts();
    visible.set(true);
  }
  function hide() {
    clearTimeouts();
    visible.set(false);
  }
  function toggle() {
    visible.update((v) => !v);
  }
  function setShowComponent(show2) {
    showComponentStore.set(show2);
  }
  function clearTimeouts() {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }
  }
  function startTimeCycle() {
    stopTimeCycle();
    isTimeMode.set(true);
    timeCycleInterval = setInterval(() => {
      visible.update((v) => {
        if (v) {
          hideTimeout = setTimeout(() => {
            visible.set(false);
          }, hideDelay);
        } else {
          showTimeout = setTimeout(() => {
            visible.set(true);
          }, showDelay);
        }
        return !v;
      });
    }, Math.max(hideDelay, showDelay));
    if (initialVisible) {
      visible.set(true);
      hideTimeout = setTimeout(() => {
        visible.set(false);
      }, hideDelay);
    } else {
      visible.set(false);
      showTimeout = setTimeout(() => {
        visible.set(true);
      }, showDelay);
    }
  }
  function stopTimeCycle() {
    isTimeMode.set(false);
    clearTimeouts();
    if (timeCycleInterval) {
      clearInterval(timeCycleInterval);
      timeCycleInterval = null;
    }
  }
  function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  function handleMouseMove(e) {
    const distance = calculateDistance(
      e.clientX,
      e.clientY,
      currentComponentPosition.x,
      currentComponentPosition.y
    );
    const wasNear = isNearComponent;
    isNearComponent = distance <= currentProximityRadius;
    if (isNearComponent && !wasNear) {
      clearTimeouts();
      visible.set(true);
    } else if (!isNearComponent && wasNear) {
      clearTimeouts();
      hideTimeout = setTimeout(() => {
        visible.set(false);
      }, hideDelay);
    }
  }
  function enableAreaMode() {
    disableAreaMode();
    isAreaMode.set(true);
    if (typeof window !== "undefined") {
      mouseMoveHandler = handleMouseMove;
      window.addEventListener("mousemove", mouseMoveHandler);
    }
  }
  function disableAreaMode() {
    isAreaMode.set(false);
    clearTimeouts();
    if (mouseMoveHandler && typeof window !== "undefined") {
      window.removeEventListener("mousemove", mouseMoveHandler);
      mouseMoveHandler = null;
    }
    isNearComponent = false;
  }
  function updateComponentPosition(x, y) {
    currentComponentPosition = { x, y };
  }
  function setProximityRadius(radius) {
    currentProximityRadius = radius;
  }
  function destroy() {
    stopTimeCycle();
    disableAreaMode();
    clearTimeouts();
  }
  if (autoStart) {
    if (timeBasedMode) {
      startTimeCycle();
    }
    if (areaBasedMode) {
      enableAreaMode();
    }
  }
  if (triggerMode) {
    isTriggerMode.set(true);
  }
  return {
    visible,
    showComponent: showComponentStore,
    isTimeMode,
    isAreaMode,
    isTriggerMode,
    show,
    hide,
    toggle,
    setShowComponent,
    startTimeCycle,
    stopTimeCycle,
    enableAreaMode,
    disableAreaMode,
    updateComponentPosition,
    setProximityRadius,
    destroy
  };
}
const ViewportPositionPresets = {
  /** Quick cycling for notifications */
  quickCycle: { hideDelay: 1e3, showDelay: 1e3 },
  /** Standard cycling for UI elements */
  standardCycle: { hideDelay: 2e3, showDelay: 2e3 },
  /** Slow cycling for important elements */
  slowCycle: { hideDelay: 4e3, showDelay: 4e3 },
  /** Small proximity area */
  closeProximity: { proximityRadius: 50 },
  /** Medium proximity area */
  mediumProximity: { proximityRadius: 100 },
  /** Large proximity area */
  wideProximity: { proximityRadius: 200 },
  /** Instant show/hide */
  instant: { hideDelay: 0, showDelay: 0 }
};
function getElementPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}
const globalState = writable({
  activeComponents: /* @__PURE__ */ new Map(),
  globalVisible: true,
  mousePosition: { x: 0, y: 0 },
  isMouseTracking: false
});
const lockMap = /* @__PURE__ */ new Map();
function setComponentVisibility(componentId, show) {
  if (Array.isArray(componentId)) {
    const results = componentId.map((id) => {
      const component2 = viewportVisibilityStore.getComponent(id);
      if (!component2) {
        console.warn(`Component with ID "${id}" not found. Cannot set visibility.`);
        return false;
      }
      if (isLocked(id)) {
        console.warn(`Component with ID "${id}" is locked. Cannot change visibility.`);
        return false;
      }
      component2.setShowComponent(show);
      return true;
    });
    return results.every((result) => result);
  }
  const component = viewportVisibilityStore.getComponent(componentId);
  if (!component) {
    console.warn(`Component with ID "${componentId}" not found. Cannot set visibility.`);
    return false;
  }
  if (isLocked(componentId)) {
    console.warn(`Component with ID "${componentId}" is locked. Cannot change visibility.`);
    return false;
  }
  component.setShowComponent(show);
  return true;
}
function showComponent(componentId) {
  if (Array.isArray(componentId)) {
    const results = componentId.map((id) => setComponentVisibility(id, true));
    return results.every((result) => result);
  }
  return setComponentVisibility(componentId, true);
}
function hideComponent(componentId) {
  if (Array.isArray(componentId)) {
    const results = componentId.map((id) => setComponentVisibility(id, false));
    return results.every((result) => result);
  }
  return setComponentVisibility(componentId, false);
}
function resetComponentVisibility(componentId) {
  if (Array.isArray(componentId)) {
    const results = componentId.map((id) => setComponentVisibility(id, null));
    return results.every((result) => result);
  }
  return setComponentVisibility(componentId, null);
}
function isLocked(componentId) {
  const lockState = lockMap.get(componentId);
  return lockState?.locked ?? false;
}
function getLockedValue(componentId) {
  const lockState = lockMap.get(componentId);
  return lockState?.lockedValue ?? null;
}
let mouseTrackingHandler = null;
function startMouseTracking() {
  if (typeof window === "undefined" || mouseTrackingHandler) return;
  mouseTrackingHandler = (e) => {
    globalState.update((state) => ({
      ...state,
      mousePosition: { x: e.clientX, y: e.clientY }
    }));
  };
  window.addEventListener("mousemove", mouseTrackingHandler);
  globalState.update((state) => ({ ...state, isMouseTracking: true }));
}
function stopMouseTracking() {
  if (mouseTrackingHandler && typeof window !== "undefined") {
    window.removeEventListener("mousemove", mouseTrackingHandler);
    mouseTrackingHandler = null;
  }
  globalState.update((state) => ({ ...state, isMouseTracking: false }));
}
class ViewportVisibilityManager {
  componentId;
  positionState;
  config;
  constructor(componentId, config = {}) {
    this.componentId = componentId;
    this.config = config;
    this.positionState = createViewportPosition(config);
    globalState.update((state) => {
      state.activeComponents.set(componentId, this.positionState);
      return state;
    });
  }
  /**
   * Get the visibility store for this component
   */
  get visible() {
    return this.positionState.visible;
  }
  /**
   * Get the showComponent store for this component
   */
  get showComponent() {
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
  setShowComponent = (show) => {
    if (isLocked(this.componentId)) {
      const lockedValue = getLockedValue(this.componentId);
      this.positionState.setShowComponent(lockedValue);
      return;
    }
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
  updatePosition = (x, y) => {
    this.positionState.updateComponentPosition(x, y);
  };
  /**
   * Update component position from DOM element
   */
  updatePositionFromElement = (element) => {
    const position = getElementPosition(element);
    this.updatePosition(position.x, position.y);
  };
  /**
   * Set proximity radius for area detection
   */
  setProximityRadius = (radius) => {
    this.positionState.setProximityRadius(radius);
  };
  /**
   * Apply preset configuration
   */
  applyPreset = (preset) => {
    const presetConfig = ViewportPositionPresets[preset];
    this.destroy();
    this.config = { ...this.config, ...presetConfig };
    this.positionState = createViewportPosition(this.config);
    globalState.update((state) => {
      state.activeComponents.set(this.componentId, this.positionState);
      return state;
    });
  };
  /**
   * Destroy the component and clean up
   */
  destroy = () => {
    this.positionState.destroy();
    globalState.update((state) => {
      state.activeComponents.delete(this.componentId);
      if (state.activeComponents.size === 0) {
        stopMouseTracking();
      }
      return state;
    });
  };
}
function createStateVisibility(componentId, config = {}) {
  const manager = new ViewportVisibilityManager(componentId, {
    triggerMode: true,
    initialVisible: false,
    ...config
  });
  const isVisible = derived(manager.visible, ($visible) => $visible);
  const finalVisible = derived(
    [manager.visible, manager.showComponent],
    ([$visible, $showComponent]) => {
      if ($showComponent === true) return true;
      if ($showComponent === false) return false;
      return $visible;
    }
  );
  return {
    visible: manager.visible,
    showComponent: manager.showComponent,
    isVisible,
    isDisplay: finalVisible,
    show: manager.show,
    hide: manager.hide,
    toggle: manager.toggle,
    setShowComponent: manager.setShowComponent,
    destroy: manager.destroy,
    manager
  };
}
function createAreaBasedStateVisibility(componentId, config = {}) {
  const {
    proximityRadius = 100,
    targetArea = "top",
    areaOffset = 50,
    ...restConfig
  } = config;
  let initialPosition = { x: 0, y: 0 };
  if (typeof window !== "undefined") {
    const { innerWidth, innerHeight } = window;
    switch (targetArea) {
      case "top":
        initialPosition = { x: innerWidth / 2, y: areaOffset };
        break;
      case "bottom":
        initialPosition = { x: innerWidth / 2, y: innerHeight - areaOffset };
        break;
      case "left":
        initialPosition = { x: areaOffset, y: innerHeight / 2 };
        break;
      case "right":
        initialPosition = { x: innerWidth - areaOffset, y: innerHeight / 2 };
        break;
      case "center":
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
    hideDelay: 1e3,
    ...restConfig
  });
  const isVisible = derived(manager.visible, ($visible) => $visible);
  const finalVisible = derived(
    [manager.visible, manager.showComponent],
    ([$visible, $showComponent]) => {
      if ($showComponent === true) return true;
      if ($showComponent === false) return false;
      return $visible;
    }
  );
  manager.enableAreaMode();
  return {
    visible: manager.visible,
    showComponent: manager.showComponent,
    isDisplay: isVisible,
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
const viewportVisibilityStore = {
  /**
   * Subscribe to global state
   */
  subscribe: globalState.subscribe,
  /**
   * Get current mouse position
   */
  mousePosition: derived(globalState, ($state) => $state.mousePosition),
  /**
   * Get all active components
   */
  activeComponents: derived(
    globalState,
    ($state) => Array.from($state.activeComponents.keys())
  ),
  /**
   * Check if mouse tracking is active
   */
  isMouseTracking: derived(globalState, ($state) => $state.isMouseTracking),
  /**
   * Global visibility toggle
   */
  globalVisible: derived(globalState, ($state) => $state.globalVisible),
  /**
   * Show all components
   */
  showAll: () => {
    globalState.update((state) => {
      state.activeComponents.forEach((component) => component.show());
      state.globalVisible = true;
      return state;
    });
  },
  /**
   * Hide all components
   */
  hideAll: () => {
    globalState.update((state) => {
      state.activeComponents.forEach((component) => component.hide());
      state.globalVisible = false;
      return state;
    });
  },
  /**
   * Toggle all components
   */
  toggleAll: () => {
    globalState.update((state) => {
      const newGlobalVisible = !state.globalVisible;
      state.activeComponents.forEach((component) => {
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
  getComponent: (componentId) => {
    let component;
    globalState.subscribe((state) => {
      component = state.activeComponents.get(componentId);
    })();
    return component;
  },
  /**
   * Remove component by ID
   */
  removeComponent: (componentId) => {
    globalState.update((state) => {
      const component = state.activeComponents.get(componentId);
      if (component) {
        component.destroy();
        state.activeComponents.delete(componentId);
      }
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
    globalState.update((state) => {
      state.activeComponents.forEach((component) => component.destroy());
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
function lockVisibility(selectedComponent, lockedValue = false) {
  if (selectedComponent === void 0) {
    globalState.update((state) => {
      state.activeComponents.forEach((component, id) => {
        let originalValue = null;
        component.showComponent.subscribe((value) => {
          originalValue = value;
        })();
        lockMap.set(id, { locked: true, lockedValue, originalValue });
        component.setShowComponent(lockedValue);
      });
      return state;
    });
  } else if (Array.isArray(selectedComponent)) {
    selectedComponent.forEach((id) => {
      const component = viewportVisibilityStore.getComponent(id);
      let originalValue = null;
      if (component) {
        component.showComponent.subscribe((value) => {
          originalValue = value;
        })();
        lockMap.set(id, { locked: true, lockedValue, originalValue });
        component.setShowComponent(lockedValue);
      } else {
        lockMap.set(id, { locked: true, lockedValue, originalValue: null });
      }
    });
  } else {
    const component = viewportVisibilityStore.getComponent(selectedComponent);
    let originalValue = null;
    if (component) {
      component.showComponent.subscribe((value) => {
        originalValue = value;
      })();
      lockMap.set(selectedComponent, { locked: true, lockedValue, originalValue });
      component.setShowComponent(lockedValue);
    } else {
      lockMap.set(selectedComponent, { locked: true, lockedValue, originalValue: null });
    }
  }
}
function unlockVisibility(selectedComponent, lockedValue) {
  if (selectedComponent === void 0) {
    globalState.update((state) => {
      state.activeComponents.forEach((component, id) => {
        const lockState = lockMap.get(id);
        const valueToSet = lockedValue !== void 0 ? lockedValue : lockState?.originalValue ?? null;
        lockMap.set(id, { locked: false, lockedValue: null, originalValue: null });
        component.setShowComponent(valueToSet);
      });
      return state;
    });
  } else if (Array.isArray(selectedComponent)) {
    selectedComponent.forEach((id) => {
      const lockState = lockMap.get(id);
      const valueToSet = lockedValue !== void 0 ? lockedValue : lockState?.originalValue ?? null;
      lockMap.set(id, { locked: false, lockedValue: null, originalValue: null });
      const component = viewportVisibilityStore.getComponent(id);
      if (component) {
        component.setShowComponent(valueToSet);
      }
    });
  } else {
    const lockState = lockMap.get(selectedComponent);
    const valueToSet = lockedValue !== void 0 ? lockedValue : lockState?.originalValue ?? null;
    lockMap.set(selectedComponent, { locked: false, lockedValue: null, originalValue: null });
    const component = viewportVisibilityStore.getComponent(selectedComponent);
    if (component) {
      component.setShowComponent(valueToSet);
    }
  }
}
function getVisibilityConfig(componentId) {
  const component = viewportVisibilityStore.getComponent(componentId);
  if (!component) {
    console.warn(`Component with ID "${componentId}" not found.`);
    return null;
  }
  let visible = false;
  let showComponent2 = null;
  component.visible.subscribe((value) => {
    visible = value;
  })();
  component.showComponent.subscribe((value) => {
    showComponent2 = value;
  })();
  const lockState = lockMap.get(componentId);
  return {
    currentState: {
      visible,
      showComponent: showComponent2
    },
    lockState: {
      isLocked: lockState?.locked ?? false,
      lockedValue: lockState?.lockedValue ?? null,
      originalValue: lockState?.originalValue ?? null
    }
  };
}
function isVisibilityLocked(selectedComponent) {
  if (selectedComponent === void 0) {
    let hasComponents = false;
    globalState.subscribe((state) => {
      hasComponents = state.activeComponents.size > 0;
      for (const [id] of state.activeComponents) {
        if (!isLocked(id)) {
          return false;
        }
      }
    })();
    return hasComponents;
  } else if (Array.isArray(selectedComponent)) {
    if (selectedComponent.length === 0) return false;
    return selectedComponent.every((id) => isLocked(id));
  } else {
    return isLocked(selectedComponent);
  }
}
function getVisibilityLockedValue(componentId) {
  return getLockedValue(componentId);
}
export {
  ViewportPositionPresets,
  ViewportVisibilityManager,
  createAreaBasedStateVisibility,
  createStateVisibility,
  getVisibilityConfig,
  getVisibilityLockedValue,
  hideComponent,
  isVisibilityLocked,
  lockVisibility,
  resetComponentVisibility,
  setComponentVisibility,
  showComponent,
  unlockVisibility,
  viewportVisibilityStore
};
