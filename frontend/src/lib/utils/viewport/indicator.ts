import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

export interface IndicatorState {
  visible: boolean;
  hideTimeout: ReturnType<typeof setTimeout> | null;
  hideDelay: number;
}

export interface IndicatorStore {
  subscribe: (run: (value: IndicatorState) => void) => () => void;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  startHideTimer: () => void;
  clearHideTimer: () => void;
  setHideDelay: (delay: number) => void;
  isVisible: () => boolean;
}

/**
 * Create indicator store untuk mengelola visibility indicator
 */
export function createIndicatorStore(initialHideDelay: number = 3000): IndicatorStore {
  const initialState: IndicatorState = {
    visible: true,
    hideTimeout: null,
    hideDelay: initialHideDelay
  };

  const { subscribe, update } = writable<IndicatorState>(initialState);

  const clearHideTimer = () => {
    if (!browser) return;
    
    update(state => {
      if (state.hideTimeout) {
        clearTimeout(state.hideTimeout);
      }
      return {
        ...state,
        hideTimeout: null
      };
    });
  };

  const startHideTimer = () => {
    if (!browser) return;
    
    update(state => {
      // Clear existing timeout
      if (state.hideTimeout) {
        clearTimeout(state.hideTimeout);
      }

      // Set indicator to visible first
      const newTimeout = setTimeout(() => {
        update(currentState => ({
          ...currentState,
          visible: false,
          hideTimeout: null
        }));
      }, state.hideDelay);

      return {
        ...state,
        visible: true,
        hideTimeout: newTimeout
      };
    });
  };

  return {
    subscribe,

    show: () => {
      update(state => ({
        ...state,
        visible: true
      }));
    },

    hide: () => {
      clearHideTimer();
      update(state => ({
        ...state,
        visible: false
      }));
    },

    toggle: () => {
      update(state => ({
        ...state,
        visible: !state.visible
      }));
    },

    startHideTimer,
    clearHideTimer,

    setHideDelay: (delay: number) => {
      update(state => ({
        ...state,
        hideDelay: delay
      }));
    },

    isVisible: () => {
      let visible = false;
      update(state => {
        visible = state.visible;
        return state;
      });
      return visible;
    }
  };
}

/**
 * Mouse area detector untuk show/hide indicator
 */
export interface MouseAreaOptions {
  rightAreaPercentage?: number; // Persentase area kanan untuk show indicator
  indicatorAreaRadius?: number; // Radius area sekitar indicator untuk prevent hide
  onEnterRightArea?: () => void;
  onLeaveRightArea?: () => void;
  onEnterIndicatorArea?: () => void;
  onLeaveIndicatorArea?: () => void;
}

export function useMouseAreaDetector(options: MouseAreaOptions = {}) {
  const {
    rightAreaPercentage = 0.8, // 80% dari kiri, 20% area kanan
    indicatorAreaRadius = 100, // 100px radius sekitar indicator
    onEnterRightArea,
    onLeaveRightArea,
    onEnterIndicatorArea,
    onLeaveIndicatorArea
  } = options;

  let isInRightArea = false;
  let isInIndicatorArea = false;
  let isStarted = false;

  const handleMouseMove = (e: MouseEvent) => {
    if (!browser) return;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Check right area
    const threshold = windowWidth * rightAreaPercentage;
    const nowInRightArea = mouseX > threshold;

    if (nowInRightArea && !isInRightArea) {
      // Masuk ke area kanan
      isInRightArea = true;
      onEnterRightArea?.();
    } else if (!nowInRightArea && isInRightArea) {
      // Keluar dari area kanan
      isInRightArea = false;
      onLeaveRightArea?.();
    }

    // Check indicator area (fixed right-6 top-1/2)
    const indicatorX = windowWidth - 24; // right-6 = 24px from right
    const indicatorY = windowHeight / 2; // top-1/2
    const distance = Math.sqrt(
      Math.pow(mouseX - indicatorX, 2) + Math.pow(mouseY - indicatorY, 2)
    );
    
    const nowInIndicatorArea = distance <= indicatorAreaRadius;

    if (nowInIndicatorArea && !isInIndicatorArea) {
      // Masuk ke area indicator
      isInIndicatorArea = true;
      onEnterIndicatorArea?.();
    } else if (!nowInIndicatorArea && isInIndicatorArea) {
      // Keluar dari area indicator
      isInIndicatorArea = false;
      onLeaveIndicatorArea?.();
    }
  };

  const start = () => {
    if (!browser || isStarted) return;
    isStarted = true;
    window.addEventListener('mousemove', handleMouseMove);
  };

  const stop = () => {
    if (!browser || !isStarted) return;
    isStarted = false;
    window.removeEventListener('mousemove', handleMouseMove);
  };

  return {
    start,
    stop,
    isInRightArea: () => isInRightArea,
    isInIndicatorArea: () => isInIndicatorArea
  };
}

/**
 * Complete indicator management system
 */
export function useIndicatorSystem(options: {
  hideDelay?: number;
  mouseAreaPercentage?: number;
  indicatorAreaRadius?: number;
  autoHideOnModal?: boolean;
} = {}) {
  const {
    hideDelay = 3000,
    mouseAreaPercentage = 0.8,
    indicatorAreaRadius = 100,
    autoHideOnModal = true
  } = options;

  const indicatorStore = createIndicatorStore(hideDelay);
  let preventHide = false;

  const mouseDetector = useMouseAreaDetector({
    rightAreaPercentage: mouseAreaPercentage,
    indicatorAreaRadius,
    onEnterRightArea: () => {
      indicatorStore.show();
      if (!preventHide) {
        indicatorStore.startHideTimer();
      }
    },
    onEnterIndicatorArea: () => {
      preventHide = true;
      indicatorStore.clearHideTimer();
      indicatorStore.show();
    },
    onLeaveIndicatorArea: () => {
      preventHide = false;
      indicatorStore.startHideTimer();
    }
  });

  // Derived store untuk kemudahan akses
  const visible = derived(indicatorStore, state => state.visible);

  return {
    // Store
    indicatorStore,
    visible,

    // Control functions
    show: indicatorStore.show,
    hide: indicatorStore.hide,
    toggle: indicatorStore.toggle,
    startHideTimer: () => {
      if (!preventHide) {
        indicatorStore.startHideTimer();
      }
    },
    clearHideTimer: indicatorStore.clearHideTimer,
    setHideDelay: indicatorStore.setHideDelay,
    isVisible: indicatorStore.isVisible,

    // Mouse detector
    startMouseDetector: mouseDetector.start,
    stopMouseDetector: mouseDetector.stop,
    isInRightArea: mouseDetector.isInRightArea,
    isInIndicatorArea: mouseDetector.isInIndicatorArea,

    // Convenience function
    showAndStartTimer: () => {
      indicatorStore.show();
      if (!preventHide) {
        indicatorStore.startHideTimer();
      }
    }
  };
}

/**
 * Layout indicator system - untuk digunakan di +layout.svelte
 */
export function useLayoutIndicatorSystem(sections: Array<{ id: string; name?: string }> | undefined, options: {
  hideDelay?: number;
  mouseAreaPercentage?: number;
  indicatorAreaRadius?: number;
  scrollDelay?: number;
  onSectionChange?: (index: number) => void;
  onScrollAttempt?: (direction: 'up' | 'down') => void;
} = {}) {
  const {
    hideDelay = 3000,
    mouseAreaPercentage = 0.8,
    indicatorAreaRadius = 100,
    scrollDelay = 800,
    onSectionChange,
    onScrollAttempt
  } = options;

  // Ensure sections is always an array
  const safeSections = sections || [];

  // Setup indicator system
  const indicator = useIndicatorSystem({
    hideDelay,
    mouseAreaPercentage,
    indicatorAreaRadius
  });

  // Current section tracking
  const currentSectionIndex = writable(0);
  const isTransitioning = writable(false);

  // Jump to section function
  const jumpToSection = (index: number) => {
    if (index < 0 || index >= safeSections.length) return;
    
    isTransitioning.set(true);
    currentSectionIndex.set(index);
    
    // Trigger section change callback
    onSectionChange?.(index);
    
    // Show indicator and start timer
    indicator.showAndStartTimer();
    
    // Reset transitioning state
    setTimeout(() => {
      isTransitioning.set(false);
    }, scrollDelay);
  };

  // Start mouse detector only in browser
  const startMouseDetector = () => {
    if (browser) {
      indicator.startMouseDetector();
    }
  };

  return {
    // Stores
    currentSectionIndex,
    isTransitioning,
    indicatorVisible: indicator.visible,
    
    // Functions
    jumpToSection,
    startMouseDetector,
    
    // Indicator controls
    showIndicator: indicator.show,
    hideIndicator: indicator.hide,
    showAndStartTimer: indicator.showAndStartTimer,
    
    // Cleanup
    destroy: () => {
      indicator.stopMouseDetector();
    }
  };
}