import { writable, type Writable } from 'svelte/store';

export interface AutoHideConfig {
  /** Duration in milliseconds before auto-hiding (default: 3000) */
  hideDelay?: number;
  /** Screen position threshold for showing (0-1, default: 0.8 for right 20%) */
  positionThreshold?: number;
  /** Position side to check ('left' | 'right' | 'top' | 'bottom', default: 'right') */
  positionSide?: 'left' | 'right' | 'top' | 'bottom';
  /** Initial visibility state (default: true) */
  initialVisible?: boolean;
  /** Manual trigger mode - requires manual activation before auto-hide works (default: false) */
  manualTrigger?: boolean;
}

export interface AutoHideState {
	visible: Writable<boolean>;
	show: () => void;
	hide: () => void;
	toggle: () => void;
	startHideTimer: () => void;
	clearHideTimer: () => void;
	activate: () => void;
	hasBeenActivated: Writable<boolean>;
	destroy: () => void;
}

/**
 * Creates an auto-hide utility with position-based visibility control
 * @param config Configuration options for auto-hide behavior
 * @returns Object with visibility store and control methods
 */
export function createAutoPositionHide(config: AutoHideConfig = {}): AutoHideState {
  const {
    hideDelay = 3000,
    positionThreshold = 0.8,
    positionSide = 'right',
    initialVisible = true,
    manualTrigger = false
  } = config;

  const visible = writable(initialVisible);
  const hasBeenActivated = writable(!manualTrigger); // Track if activated
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;
  let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  let isActivated = !manualTrigger; // If manual trigger is enabled, start as not activated

  /**
   * Activates the auto-hide functionality (for manual trigger mode)
   */
  function activate() {
    if (manualTrigger && !isActivated) {
      isActivated = true;
      hasBeenActivated.set(true);
      visible.set(true);
      initMouseTracking();
      startHideTimer();
    }
  }

  /**
   * Shows the element and starts the auto-hide timer
   */
  function show() {
    if (!isActivated && manualTrigger) return;
    visible.set(true);
    startHideTimer();
  }

  /**
   * Hides the element immediately
   */
  function hide() {
    visible.set(false);
    clearHideTimer();
  }

  /**
   * Toggles visibility state
   */
  function toggle() {
    if (!isActivated && manualTrigger) {
      activate();
      return;
    }
    
    visible.update(v => {
      if (!v) {
        startHideTimer();
      } else {
        clearHideTimer();
      }
      return !v;
    });
  }

  /**
   * Starts or restarts the auto-hide timer
   */
  function startHideTimer() {
    if (!isActivated && manualTrigger) return;
    clearHideTimer();
    visible.set(true);
    
    hideTimeout = setTimeout(() => {
      visible.set(false);
    }, hideDelay);
  }

  /**
   * Clears the auto-hide timer
   */
  function clearHideTimer() {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  }

  /**
   * Checks if mouse position should trigger visibility
   */
  function checkMousePosition(e: MouseEvent): boolean {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    switch (positionSide) {
      case 'right':
        return clientX > innerWidth * positionThreshold;
      case 'left':
        return clientX < innerWidth * (1 - positionThreshold);
      case 'bottom':
        return clientY > innerHeight * positionThreshold;
      case 'top':
        return clientY < innerHeight * (1 - positionThreshold);
      default:
        return false;
    }
  }

  /**
   * Handles mouse move events for position-based visibility
   */
  function handleMouseMove(e: MouseEvent) {
    if (!isActivated && manualTrigger) return;
    if (checkMousePosition(e)) {
      show();
    }
  }

  /**
   * Initializes mouse tracking for position-based auto-show
   */
  function initMouseTracking() {
    if (typeof window !== 'undefined' && !mouseMoveHandler) {
      mouseMoveHandler = handleMouseMove;
      window.addEventListener('mousemove', mouseMoveHandler);
    }
  }

  /**
   * Removes mouse tracking
   */
  function removeMouseTracking() {
    if (mouseMoveHandler && typeof window !== 'undefined') {
      window.removeEventListener('mousemove', mouseMoveHandler);
      mouseMoveHandler = null;
    }
  }

  /**
   * Destroys the auto-hide instance and cleans up
   */
  function destroy() {
    clearHideTimer();
    removeMouseTracking();
  }

  // Initialize mouse tracking only if not in manual trigger mode
  if (!manualTrigger) {
    initMouseTracking();
  }

  // Start initial timer if visible and not in manual trigger mode
  if (initialVisible && !manualTrigger) {
    startHideTimer();
  }

  return {
    visible,
    show,
    hide,
    toggle,
    startHideTimer,
    clearHideTimer,
    activate,
    hasBeenActivated,
    destroy
  };
}

/**
 * Creates a position-based auto-hide utility specifically for indicators
 * Optimized for right-side positioning with common defaults
 */
export function createIndicatorAutoHide(config: Partial<AutoHideConfig> = {}) {
  return createAutoPositionHide({
    hideDelay: 3000,
    positionThreshold: 0.8,
    positionSide: 'right',
    initialVisible: true,
    ...config
  });
}

/**
 * Creates a hover-based auto-hide utility
 * Shows on hover and hides after delay when not hovering
 */
export function createHoverAutoHide(
  element: HTMLElement | null,
  config: Partial<AutoHideConfig> = {}
): AutoHideState {
  const autoHide = createAutoPositionHide({
    hideDelay: 1000,
    initialVisible: false,
    ...config
  });

  let mouseEnterHandler: (() => void) | null = null;
  let mouseLeaveHandler: (() => void) | null = null;

  function initHoverTracking() {
    if (element) {
      mouseEnterHandler = () => {
        autoHide.show();
      };
      
      mouseLeaveHandler = () => {
        autoHide.startHideTimer();
      };

      element.addEventListener('mouseenter', mouseEnterHandler);
      element.addEventListener('mouseleave', mouseLeaveHandler);
    }
  }

  function removeHoverTracking() {
    if (element && mouseEnterHandler && mouseLeaveHandler) {
      element.removeEventListener('mouseenter', mouseEnterHandler);
      element.removeEventListener('mouseleave', mouseLeaveHandler);
      mouseEnterHandler = null;
      mouseLeaveHandler = null;
    }
  }

  // Override destroy to include hover cleanup
  const originalDestroy = autoHide.destroy;
  autoHide.destroy = () => {
    removeHoverTracking();
    originalDestroy();
  };

  initHoverTracking();

  return autoHide;
}

/**
 * Utility type for auto-hide configuration presets
 */
export const AutoHidePresets = {
  /** Quick hide for temporary notifications */
  quick: { hideDelay: 1500, positionThreshold: 0.9 },
  /** Standard hide for UI elements */
  standard: { hideDelay: 3000, positionThreshold: 0.8 },
  /** Slow hide for important elements */
  slow: { hideDelay: 5000, positionThreshold: 0.7 },
  /** Left side positioning */
  leftSide: { positionSide: 'left' as const, positionThreshold: 0.2 },
  /** Top positioning */
  topSide: { positionSide: 'top' as const, positionThreshold: 0.2 },
  /** Bottom positioning */
  bottomSide: { positionSide: 'bottom' as const, positionThreshold: 0.8 }
} as const;