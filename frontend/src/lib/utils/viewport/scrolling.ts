import { get } from 'svelte/store';
import { viewportStore, viewportState, isScrollDisabled, isNavigating } from '$lib/stores/viewport/viewport';
import { SectionId } from '$lib/enums';

/**
 * Scroll configuration interface
 */
export interface ScrollConfig {
  enabled?: boolean;
  delay?: number;
  smoothBehavior?: boolean;
  preventNativeScroll?: boolean;
}

/**
 * Scroll state interface
 */
export interface ScrollState {
  enabled: boolean;
  delay: number;
  lastScrollTime: number;
  isTransitioning: boolean;
  canScroll: boolean;
}

/**
 * Scroll direction type
 */
export type ScrollDirection = 'up' | 'down';

/**
 * Scroll event callback type
 */
export type ScrollEventCallback = (direction: ScrollDirection, fromIndex: number, toIndex: number) => void;

/**
 * Default scroll configuration
 */
const DEFAULT_SCROLL_CONFIG: Required<ScrollConfig> = {
  enabled: true,
  delay: 800,
  smoothBehavior: true,
  preventNativeScroll: true
};

/**
 * Scroll utility class untuk mengelola semua aspek scrolling viewport
 */
export class ViewportScrollManager {
  private config: Required<ScrollConfig>;
  private onScrollCallback?: ScrollEventCallback;
  private wheelEventListener?: (event: WheelEvent) => void;
  private keyEventListener?: (event: KeyboardEvent) => void;
  private touchStartY: number = 0;
  private touchEventListener?: {
    start: (event: TouchEvent) => void;
    end: (event: TouchEvent) => void;
  };
  private scrollDelay: number = 800;
  private lastScrollTime: number = 0;

  constructor(config: ScrollConfig = {}) {
    this.config = { ...DEFAULT_SCROLL_CONFIG, ...config };
    this.scrollDelay = this.config.delay;
    this.initializeScrollState();
  }

  /**
   * Initialize scroll state in viewport store
   */
  private initializeScrollState(): void {
    if (this.config.enabled) {
      viewportStore.actions.enableScroll();
    } else {
      viewportStore.actions.disableScroll();
    }
  }

  /**
   * Enable scrolling
   */
  enableScroll(): void {
    this.config.enabled = true;
    viewportStore.actions.enableScroll();
  }

  /**
   * Disable scrolling
   */
  disableScroll(): void {
    this.config.enabled = false;
    viewportStore.actions.disableScroll();
  }

  /**
   * Toggle scroll state
   */
  toggleScroll(): void {
    this.config.enabled = !this.config.enabled;
    const state = get(viewportState);
    if (state.scroll.isDisabled) {
      viewportStore.actions.enableScroll();
    } else {
      viewportStore.actions.disableScroll();
    }
  }

  /**
   * Check if scrolling is currently enabled
   */
  isScrollEnabled(): boolean {
    const state = get(viewportState);
    return !state.scroll.isDisabled;
  }

  /**
   * Set scroll delay
   */
  setScrollDelay(delay: number): void {
    this.config.delay = delay;
    this.scrollDelay = delay;
  }

  /**
   * Get current scroll delay
   */
  getScrollDelay(): number {
    return this.scrollDelay;
  }

  /**
   * Check if can scroll (considering delay and transition state)
   */
  canScroll(): boolean {
    const state = get(viewportState);
    const now = Date.now();
    const timeSinceLastScroll = now - this.lastScrollTime;
    
    return !state.scroll.isDisabled && 
           !state.section.isNavigating && 
           timeSinceLastScroll >= this.scrollDelay;
  }

  /**
   * Update last scroll time
   */
  updateLastScrollTime(): void {
    this.lastScrollTime = Date.now();
  }

  /**
   * Get current scroll state
   */
  getScrollState(): ScrollState {
    const state = get(viewportState);
    return {
      enabled: !state.scroll.isDisabled,
      delay: this.scrollDelay,
      lastScrollTime: this.lastScrollTime,
      isTransitioning: state.section.isNavigating,
      canScroll: this.canScroll()
    };
  }

  /**
   * Update scroll configuration
   */
  updateConfig(newConfig: Partial<ScrollConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.enabled !== undefined) {
      if (newConfig.enabled) {
        this.enableScroll();
      } else {
        this.disableScroll();
      }
    }
    
    if (newConfig.delay !== undefined) {
      this.setScrollDelay(newConfig.delay);
    }
  }

  /**
   * Set scroll event callback
   */
  onScroll(callback: ScrollEventCallback): void {
    this.onScrollCallback = callback;
  }

  /**
   * Get section index from SectionId
   */
  private getSectionIndex(sectionId: SectionId): number {
    const sectionIds = Object.values(SectionId);
    return sectionIds.indexOf(sectionId);
  }

  /**
   * Get SectionId from index
   */
  private getSectionId(index: number): SectionId | null {
    const sectionIds = Object.values(SectionId);
    return sectionIds[index] || null;
  }

  /**
   * Handle scroll event with direction detection
   */
  private handleScrollEvent(direction: ScrollDirection): void {
    if (!this.canScroll()) return;

    const state = get(viewportState);
    const currentIndex = this.getSectionIndex(state.section.currentSection);
    const totalSections = Object.values(SectionId).length;

    let targetIndex = currentIndex;
    
    if (direction === 'down' && currentIndex < totalSections - 1) {
      targetIndex = currentIndex + 1;
    } else if (direction === 'up' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    }

    if (targetIndex !== currentIndex) {
      this.updateLastScrollTime();
      this.onScrollCallback?.(direction, currentIndex, targetIndex);
    }
  }

  /**
   * Start listening to scroll events
   */
  startScrollListener(): void {
    this.stopScrollListener(); // Clean up existing listeners

    // Wheel event listener
    this.wheelEventListener = (event: WheelEvent) => {
      if (this.config.preventNativeScroll) {
        event.preventDefault();
      }

      const direction: ScrollDirection = event.deltaY > 0 ? 'down' : 'up';
      this.handleScrollEvent(direction);
    };

    // Keyboard event listener
    this.keyEventListener = (event: KeyboardEvent) => {
      if (!this.canScroll()) return;

      let direction: ScrollDirection | null = null;
      
      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // Space key
          direction = 'down';
          break;
        case 'ArrowUp':
        case 'PageUp':
          direction = 'up';
          break;
      }

      if (direction) {
        event.preventDefault();
        this.handleScrollEvent(direction);
      }
    };

    // Touch event listeners
    this.touchEventListener = {
      start: (event: TouchEvent) => {
        this.touchStartY = event.touches[0].clientY;
      },
      end: (event: TouchEvent) => {
        if (!this.canScroll()) return;

        const touchEndY = event.changedTouches[0].clientY;
        const deltaY = this.touchStartY - touchEndY;
        const threshold = 50; // Minimum swipe distance

        if (Math.abs(deltaY) > threshold) {
          const direction: ScrollDirection = deltaY > 0 ? 'down' : 'up';
          this.handleScrollEvent(direction);
        }
      }
    };

    // Add event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('wheel', this.wheelEventListener, { passive: false });
      window.addEventListener('keydown', this.keyEventListener);
      window.addEventListener('touchstart', this.touchEventListener.start, { passive: true });
      window.addEventListener('touchend', this.touchEventListener.end, { passive: true });
    }
  }

  /**
   * Stop listening to scroll events
   */
  stopScrollListener(): void {
    if (typeof window !== 'undefined') {
      if (this.wheelEventListener) {
        window.removeEventListener('wheel', this.wheelEventListener);
      }
      if (this.keyEventListener) {
        window.removeEventListener('keydown', this.keyEventListener);
      }
      if (this.touchEventListener) {
        window.removeEventListener('touchstart', this.touchEventListener.start);
        window.removeEventListener('touchend', this.touchEventListener.end);
      }
    }

    this.wheelEventListener = undefined;
    this.keyEventListener = undefined;
    this.touchEventListener = undefined;
  }

  /**
   * Cleanup method
   */
  destroy(): void {
    this.stopScrollListener();
    this.onScrollCallback = undefined;
  }
}

/**
 * Create a new scroll manager instance
 */
export function createScrollManager(config?: ScrollConfig): ViewportScrollManager {
  return new ViewportScrollManager(config);
}

/**
 * Simple scroll utilities for quick access
 */
export const scrollUtils = {
  /**
   * Enable viewport scrolling
   */
  enable: () => viewportStore.actions.enableScroll(),

  /**
   * Disable viewport scrolling
   */
  disable: () => viewportStore.actions.disableScroll(),

  /**
   * Toggle viewport scrolling
   */
  toggle: () => {
    const state = get(viewportState);
    if (state.scroll.isDisabled) {
      viewportStore.actions.enableScroll();
    } else {
      viewportStore.actions.disableScroll();
    }
  },

  /**
   * Check if scrolling is enabled
   */
  isEnabled: () => {
    const state = get(viewportState);
    return !state.scroll.isDisabled;
  },

  /**
   * Check if currently transitioning
   */
  isTransitioning: () => {
    const state = get(viewportState);
    return state.section.isNavigating;
  },

  /**
   * Check if can scroll right now
   */
  canScroll: () => {
    const state = get(viewportState);
    return !state.scroll.isDisabled && !state.section.isNavigating;
  },

  /**
   * Get current scroll state
   */
  getState: (): ScrollState => {
    const state = get(viewportState);
    return {
      enabled: !state.scroll.isDisabled,
      delay: 800, // Default delay
      lastScrollTime: state.scroll.lastScrollTime,
      isTransitioning: state.section.isNavigating,
      canScroll: !state.scroll.isDisabled && !state.section.isNavigating
    };
  }
};

/**
 * Hook untuk Svelte components
 */
export function useScrolling(config?: ScrollConfig) {
  const manager = createScrollManager(config);

  return {
    manager,
    
    // Quick access methods
    enable: manager.enableScroll.bind(manager),
    disable: manager.disableScroll.bind(manager),
    toggle: manager.toggleScroll.bind(manager),
    isEnabled: manager.isScrollEnabled.bind(manager),
    canScroll: manager.canScroll.bind(manager),
    setDelay: manager.setScrollDelay.bind(manager),
    getDelay: manager.getScrollDelay.bind(manager),
    getState: manager.getScrollState.bind(manager),
    
    // Event handling
    onScroll: manager.onScroll.bind(manager),
    startListener: manager.startScrollListener.bind(manager),
    stopListener: manager.stopScrollListener.bind(manager),
    
    // Configuration
    updateConfig: manager.updateConfig.bind(manager),
    
    // Cleanup
    destroy: manager.destroy.bind(manager)
  };
}

/**
 * Temporary scroll disable utility
 */
export function withScrollDisabled<T>(fn: () => T | Promise<T>): Promise<T> {
  const wasEnabled = scrollUtils.isEnabled();
  
  scrollUtils.disable();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      if (wasEnabled) {
        scrollUtils.enable();
      }
    });
  } else {
    if (wasEnabled) {
      scrollUtils.enable();
    }
    return Promise.resolve(result);
  }
}

/**
 * Scroll delay utility
 */
export function withScrollDelay<T>(delay: number, fn: () => T | Promise<T>): Promise<T> {
  const originalDelay = scrollUtils.getState().delay;
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result;
  } else {
    return Promise.resolve(result);
  }
}

// Re-export store references for convenience
export { isScrollDisabled, isNavigating } from '$lib/stores/viewport/viewport';