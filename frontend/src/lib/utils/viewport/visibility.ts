import { writable, type Writable } from 'svelte/store';

export interface ViewportPositionConfig {
  /** Duration in milliseconds before auto-hiding (default: 2000) */
  hideDelay?: number;
  /** Duration in milliseconds before auto-showing (default: 2000) */
  showDelay?: number;
  /** Radius in pixels for area-based detection (default: 100) */
  proximityRadius?: number;
  /** Position of the component for area detection */
  componentPosition?: { x: number; y: number };
  /** Initial visibility state (default: false) */
  initialVisible?: boolean;
  /** Enable time-based auto show/hide cycling */
  timeBasedMode?: boolean;
  /** Enable area-based show/hide on cursor proximity */
  areaBasedMode?: boolean;
  /** Enable manual trigger mode only */
  triggerMode?: boolean;
  /** Auto-start time cycling on initialization */
  autoStart?: boolean;
  /** Force show/hide component regardless of visibility state (default: null) */
  showComponent?: boolean | null;
}

export interface ViewportPositionState {
  visible: Writable<boolean>;
  showComponent: Writable<boolean | null>;
  isTimeMode: Writable<boolean>;
  isAreaMode: Writable<boolean>;
  isTriggerMode: Writable<boolean>;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  setShowComponent: (show: boolean | null) => void;
  startTimeCycle: () => void;
  stopTimeCycle: () => void;
  enableAreaMode: () => void;
  disableAreaMode: () => void;
  updateComponentPosition: (x: number, y: number) => void;
  setProximityRadius: (radius: number) => void;
  destroy: () => void;
}

/**
 * Creates a viewport position utility with multiple auto show/hide modes
 * @param config Configuration options for position and visibility behavior
 * @returns Object with visibility store and control methods
 */
export function createViewportPosition(config: ViewportPositionConfig = {}): ViewportPositionState {
  const {
    hideDelay = 2000,
    showDelay = 2000,
    proximityRadius = 100,
    componentPosition = { x: 0, y: 0 },
    initialVisible = false,
    timeBasedMode = false,
    areaBasedMode = false,
    triggerMode = false,
    autoStart = false,
    showComponent = null
  } = config;

  // Stores
  const visible = writable(initialVisible);
  const showComponentStore = writable<boolean | null>(showComponent);
  const isTimeMode = writable(timeBasedMode);
  const isAreaMode = writable(areaBasedMode);
  const isTriggerMode = writable(triggerMode);

  // Internal state
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;
  let showTimeout: ReturnType<typeof setTimeout> | null = null;
  let timeCycleInterval: ReturnType<typeof setInterval> | null = null;
  let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  let currentComponentPosition = { ...componentPosition };
  let currentProximityRadius = proximityRadius;
  let isNearComponent = false;

  /**
   * Shows the component immediately
   */
  function show() {
    clearTimeouts();
    visible.set(true);
  }

  /**
   * Hides the component immediately
   */
  function hide() {
    clearTimeouts();
    visible.set(false);
  }

  /**
   * Toggles visibility state
   */
  function toggle() {
    visible.update(v => !v);
  }

  /**
   * Sets the showComponent state
   * @param show - true to force show, false to force hide, null to use normal visibility logic
   */
  function setShowComponent(show: boolean | null) {
    showComponentStore.set(show);
  }

  /**
   * Clears all active timeouts
   */
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

  /**
   * Starts time-based cycling between show and hide
   */
  function startTimeCycle() {
    stopTimeCycle();
    isTimeMode.set(true);
    
    timeCycleInterval = setInterval(() => {
      visible.update(v => {
        if (v) {
          // Currently visible, schedule hide
          hideTimeout = setTimeout(() => {
            visible.set(false);
          }, hideDelay);
        } else {
          // Currently hidden, schedule show
          showTimeout = setTimeout(() => {
            visible.set(true);
          }, showDelay);
        }
        return !v;
      });
    }, Math.max(hideDelay, showDelay));

    // Start with initial state
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

  /**
   * Stops time-based cycling
   */
  function stopTimeCycle() {
    isTimeMode.set(false);
    clearTimeouts();
    
    if (timeCycleInterval) {
      clearInterval(timeCycleInterval);
      timeCycleInterval = null;
    }
  }

  /**
   * Calculates distance between two points
   */
  function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  function handleMouseMove(e: MouseEvent) {
    const distance = calculateDistance(
      e.clientX,
      e.clientY,
      currentComponentPosition.x,
      currentComponentPosition.y
    );

    const wasNear = isNearComponent;
    isNearComponent = distance <= currentProximityRadius;

    // Mouse entered proximity area
    if (isNearComponent && !wasNear) {
      clearTimeouts();
      visible.set(true);
    }
    // Mouse left proximity area
    else if (!isNearComponent && wasNear) {
      clearTimeouts();
      hideTimeout = setTimeout(() => {
        visible.set(false);
      }, hideDelay);
    }
  }

  /**
   * Enables area-based show/hide mode
   */
  function enableAreaMode() {
    disableAreaMode(); // Clean up first
    isAreaMode.set(true);
    
    if (typeof window !== 'undefined') {
      mouseMoveHandler = handleMouseMove;
      window.addEventListener('mousemove', mouseMoveHandler);
    }
  }

  /**
   * Disables area-based show/hide mode
   */
  function disableAreaMode() {
    isAreaMode.set(false);
    clearTimeouts();
    
    if (mouseMoveHandler && typeof window !== 'undefined') {
      window.removeEventListener('mousemove', mouseMoveHandler);
      mouseMoveHandler = null;
    }
    isNearComponent = false;
  }

  /**
   * Updates the component position for area detection
   */
  function updateComponentPosition(x: number, y: number) {
    currentComponentPosition = { x, y };
  }

  /**
   * Sets the proximity radius for area detection
   */
  function setProximityRadius(radius: number) {
    currentProximityRadius = radius;
  }

  /**
   * Destroys the viewport position instance and cleans up
   */
  function destroy() {
    stopTimeCycle();
    disableAreaMode();
    clearTimeouts();
  }

  // Initialize based on configuration
  if (autoStart) {
    if (timeBasedMode) {
      startTimeCycle();
    }
    if (areaBasedMode) {
      enableAreaMode();
    }
  }

  // Set initial mode states
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

/**
 * Creates a time-based auto show/hide utility
 * Automatically cycles between show and hide states
 */
export function createTimeBasedPosition(config: Partial<ViewportPositionConfig> = {}) {
  return createViewportPosition({
    hideDelay: 2000,
    showDelay: 2000,
    timeBasedMode: true,
    autoStart: true,
    ...config
  });
}

/**
 * Creates an area-based auto show/hide utility
 * Shows when cursor is near component, hides when far
 */
export function createAreaBasedPosition(
  componentPosition: { x: number; y: number },
  config: Partial<ViewportPositionConfig> = {}
) {
  return createViewportPosition({
    hideDelay: 2000,
    proximityRadius: 100,
    componentPosition,
    areaBasedMode: true,
    autoStart: true,
    ...config
  });
}

/**
 * Creates a trigger-based show/hide utility
 * Only shows/hides when manually triggered
 */
export function createTriggerBasedPosition(config: Partial<ViewportPositionConfig> = {}) {
  return createViewportPosition({
    triggerMode: true,
    initialVisible: false,
    ...config
  });
}

/**
 * Utility presets for common viewport position configurations
 */
export const ViewportPositionPresets = {
  /** Quick cycling for notifications */
  quickCycle: { hideDelay: 1000, showDelay: 1000 },
  /** Standard cycling for UI elements */
  standardCycle: { hideDelay: 2000, showDelay: 2000 },
  /** Slow cycling for important elements */
  slowCycle: { hideDelay: 4000, showDelay: 4000 },
  /** Small proximity area */
  closeProximity: { proximityRadius: 50 },
  /** Medium proximity area */
  mediumProximity: { proximityRadius: 100 },
  /** Large proximity area */
  wideProximity: { proximityRadius: 200 },
  /** Instant show/hide */
  instant: { hideDelay: 0, showDelay: 0 }
} as const;

/**
 * Helper function to get element position for area-based detection
 */
export function getElementPosition(element: HTMLElement): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

/**
 * Helper function to get element center position relative to viewport
 */
export function getElementCenter(element: HTMLElement): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}