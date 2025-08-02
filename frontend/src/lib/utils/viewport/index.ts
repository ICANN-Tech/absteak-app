import { onMount } from 'svelte';
import { viewportStore, currentSectionIndex, isTransitioning, scrollEnabled } from '$lib/stores/viewport';
import { useScrollObserver } from './observer';
import { useViewportNavigator } from './navigator';
import { useComponentLoader } from './loader';
import { useIndicatorSystem } from './indicator';
import { useScrolling, type ScrollConfig } from './scrolling';

import type { Section } from '$lib/types';

// Re-export all utilities
export * from './observer';
export * from './navigator';
export * from './loader';
export * from './indicator';
export * from "./visibility";
// export * from './monitor';
export * from "./instantiate";
export * from './scrolling';
export { viewportStore, currentSectionIndex, isTransitioning, scrollEnabled } from '$lib/stores/viewport';

export interface ViewportSystemOptions {
  sections: Section[];
  scrollDelay?: number;
  preloadCallback?: (index: number) => Promise<void>;
  onSectionChange?: (index: number) => void;
  onScrollAttempt?: (direction: 'up' | 'down') => void;
  onNavigate?: (fromIndex: number, toIndex: number) => void;
  indicatorCallback?: () => void;
  autoStart?: boolean;
  // Scroll configuration
  scrollConfig?: ScrollConfig;
  enableScrollListener?: boolean;
}

export interface ViewportSystemReturn {
  // Stores (reactive)
  currentSectionIndex: typeof currentSectionIndex;
  isTransitioning: typeof isTransitioning;
  scrollEnabled: typeof scrollEnabled;
  
  // Navigation functions
  jumpToSection: (index: number) => Promise<boolean>;
  jumpToSectionById: (id: string) => Promise<boolean>;
  nextSection: () => Promise<boolean>;
  previousSection: () => Promise<boolean>;
  
  // Scroll control
  enableScroll: () => void;
  disableScroll: () => void;
  toggleScroll: () => void;
  isScrollEnabled: () => boolean;
  
  // Observer control
  startObserver: () => void;
  stopObserver: () => void;
  isObserverActive: () => boolean;
  
  // Utility functions
  getCurrentSection: () => { index: number; section: Section | null };
  getTotalSections: () => number;
  canNavigateTo: (index: number) => boolean;
  
  // Update functions
  updateOptions: (options: Partial<ViewportSystemOptions>) => void;
  setSections: (sections: Section[]) => void;
  setScrollDelay: (delay: number) => void;
  
  // Scroll utilities
  scrolling: ReturnType<typeof useScrolling>;
  startScrollListener: () => void;
  stopScrollListener: () => void;
}

/**
 * Comprehensive viewport system utility yang mengintegrasikan
 * store, observer, navigator, dan scrolling dalam satu interface
 */
export function useViewportSystem(options: ViewportSystemOptions): ViewportSystemReturn {
  const {
    sections,
    scrollDelay = 800,
    preloadCallback,
    onSectionChange,
    onScrollAttempt,
    onNavigate,
    indicatorCallback,
    autoStart = true,
    scrollConfig = {},
    enableScrollListener = true
  } = options;

  // Initialize viewport store
  viewportStore.setSections(sections);
  viewportStore.setScrollDelay(scrollDelay);

  // Create scrolling utilities
  const scrolling = useScrolling({
    enabled: true,
    delay: scrollDelay,
    preventNativeScroll: true,
    ...scrollConfig
  });

  // Create navigator
  const navigator = useViewportNavigator({
    preloadCallback,
    onNavigate,
    indicatorCallback
  });

  // Create scroll observer
  const scrollObserver = useScrollObserver({
    onSectionChange,
    onScrollAttempt,
    preloadCallback,
    indicatorCallback
  });

  // Setup scroll event handling
  if (enableScrollListener) {
    scrolling.onScroll((direction, fromIndex, toIndex) => {
      // Handle navigation based on scroll direction
      if (direction === 'down') {
        navigator.nextSection();
      } else if (direction === 'up') {
        navigator.previousSection();
      }
      
      // Call scroll attempt callback
      onScrollAttempt?.(direction);
    });
  }

  // Auto start observer and scroll listener if enabled
  if (autoStart) {
    onMount(() => {
      scrollObserver.start();
      
      if (enableScrollListener) {
        scrolling.startListener();
      }
      
      return () => {
        scrollObserver.stop();
        scrolling.stopListener();
      };
    });
  }

  return {
    // Reactive stores
    currentSectionIndex,
    isTransitioning,
    scrollEnabled,

    // Navigation functions
    jumpToSection: navigator.jumpToSection,
    jumpToSectionById: navigator.jumpToSectionById,
    nextSection: navigator.nextSection,
    previousSection: navigator.previousSection,

    // Scroll control
    enableScroll: navigator.enableScroll,
    disableScroll: navigator.disableScroll,
    toggleScroll: navigator.toggleScroll,
    isScrollEnabled: navigator.isScrollEnabled,

    // Observer control
    startObserver: scrollObserver.start,
    stopObserver: scrollObserver.stop,
    isObserverActive: scrollObserver.isActive,

    // Utility functions
    getCurrentSection: navigator.getCurrentSection,
    getTotalSections: navigator.getTotalSections,
    canNavigateTo: navigator.canNavigateTo,

    // Update functions
    updateOptions: (newOptions: Partial<ViewportSystemOptions>) => {
      if (newOptions.sections) {
        viewportStore.setSections(newOptions.sections);
      }
      if (newOptions.scrollDelay !== undefined) {
        viewportStore.setScrollDelay(newOptions.scrollDelay);
        scrolling.setDelay(newOptions.scrollDelay);
      }
      
      // Update scroll config
      if (newOptions.scrollConfig) {
        scrolling.updateConfig(newOptions.scrollConfig);
      }
      
      // Update navigator options
      navigator.updateOptions({
        preloadCallback: newOptions.preloadCallback,
        onNavigate: newOptions.onNavigate,
        indicatorCallback: newOptions.indicatorCallback
      });
      
      // Update observer options
      scrollObserver.updateOptions({
        onSectionChange: newOptions.onSectionChange,
        onScrollAttempt: newOptions.onScrollAttempt,
        preloadCallback: newOptions.preloadCallback,
        indicatorCallback: newOptions.indicatorCallback
      });
    },

    setSections: (newSections: Section[]) => {
      viewportStore.setSections(newSections);
    },

    setScrollDelay: (delay: number) => {
      viewportStore.setScrollDelay(delay);
      scrolling.setDelay(delay);
    },

    // Scroll utilities
    scrolling,
    startScrollListener: scrolling.startListener,
    stopScrollListener: scrolling.stopListener
  };
}

/**
 * Simplified viewport system untuk use case yang lebih sederhana
 */
export function useSimpleViewport(sections: Section[], preloadCallback?: (index: number) => Promise<void>) {
  return useViewportSystem({
    sections,
    preloadCallback,
    autoStart: true
  });
}

/**
 * Complete integrated viewport system yang menggabungkan semua utilities
 */
export function useCompleteViewportSystem(options: ViewportSystemOptions & {
  indicatorHideDelay?: number;
  mouseAreaPercentage?: number;
}) {
  const {
    sections,
    scrollDelay = 800,
    indicatorHideDelay = 3000,
    mouseAreaPercentage = 0.8,
    autoStart = true,
    ...restOptions
  } = options;

  // Component loader
  const componentLoader = useComponentLoader(sections);

  // Indicator system
  const indicator = useIndicatorSystem({
    hideDelay: indicatorHideDelay,
    mouseAreaPercentage
  });

  // Preload callback yang menggunakan component loader
  const preloadCallback = async (index: number) => {
    await componentLoader.preload(index);
    if (restOptions.preloadCallback) {
      await restOptions.preloadCallback(index);
    }
  };

  // Indicator callback
  const indicatorCallback = () => {
    indicator.showAndStartTimer();
    if (restOptions.indicatorCallback) {
      restOptions.indicatorCallback();
    }
  };

  // Main viewport system
  const viewport = useViewportSystem({
    sections,
    scrollDelay,
    preloadCallback,
    indicatorCallback,
    autoStart,
    ...restOptions
  });

  // Auto start mouse detector
  if (autoStart) {
    onMount(() => {
      indicator.startMouseDetector();
      
      return () => {
        indicator.stopMouseDetector();
      };
    });
  }

  return {
    // Viewport system
    ...viewport,

    // Component loader
    componentLoader,
    loadedComponents: componentLoader.loadedComponents,
    getComponent: componentLoader.getComponent,
    isComponentLoaded: componentLoader.isLoaded,
    preloadAllComponents: componentLoader.preloadAll,

    // Indicator system
    indicator,
    indicatorVisible: indicator.visible,
    showIndicator: indicator.show,
    hideIndicator: indicator.hide,
    toggleIndicator: indicator.toggle,
    startIndicatorTimer: indicator.startHideTimer,
    clearIndicatorTimer: indicator.clearHideTimer,

    // Mouse detector
    startMouseDetector: indicator.startMouseDetector,
    stopMouseDetector: indicator.stopMouseDetector,
    isInRightArea: indicator.isInRightArea
  };
}