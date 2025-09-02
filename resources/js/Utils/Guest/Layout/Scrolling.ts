/**
 * Scrolling utility functions for Guest layout
 * This module provides utilities for scrolling behavior, viewport management, and indicator integration
 */

import type { Writable } from 'svelte/store';
import type { ModalState } from '@Stores/Global/Modal';
import type { IndicatorStore } from '@Utils/Guest/Viewport/Indicator';

/**
 * Extended indicator system interface returned by useIndicatorSystem
 */
export interface IndicatorSystem {
  indicatorStore: IndicatorStore;
  visible: any;
  show: () => void;
  hide: () => void;
  toggle: () => void;
  startHideTimer: () => void;
  clearHideTimer: () => void;
  setHideDelay: (delay: number) => void;
  isVisible: () => boolean;
  startMouseDetector: () => void;
  stopMouseDetector: () => void;
  isInRightArea: () => boolean;
  isInIndicatorArea: () => boolean;
  showAndStartTimer: () => void;
}

/**
 * Interface for section configuration
 */
export interface Section {
  id: string;
  name?: string;
  component?: any;
}

/**
 * Interface for scroll position information
 */
export interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right' | 'none';
}

/**
 * Interface for scroll behavior configuration
 */
export interface ScrollBehaviorConfig {
  smooth?: boolean;
  duration?: number;
  easing?: string;
  offset?: number;
}

/**
 * Interface for viewport store operations
 */
export interface ViewportStore {
  setSections: (sections: Section[]) => void;
  setCurrentSection: (index: number) => void;
  disableScroll: () => void;
  enableScroll: () => void;
}

/**
 * Interface for viewport state
 */
export interface ViewportState {
  section: {
    currentSection: string;
  };
}

/**
 * Interface for modal store
 */
export interface ModalStore extends Writable<{ isOpen: boolean }> {
  subscribe: (callback: (modal: { isOpen: boolean }) => void) => () => void;
}

/**
 * Configuration options for scroll integration
 */
export interface ScrollIntegrationOptions {
  hideDelay?: number;
  mouseAreaPercentage?: number;
  indicatorAreaRadius?: number;
}

/**
 * Handles modal store integration with scrolling and indicator systems
 * 
 * @param modalStore - The modal store to subscribe to
 * @param viewportStore - The viewport store for scroll control
 * @param indicator - The indicator system instance
 * 
 * @example
 * ```typescript
 * import { modalStore } from '@Stores/Global/Modal';
 * import { viewportStore } from '@Stores/Guest/Viewport/Index';
 * import { useIndicatorSystem } from '@Utils/Guest/Viewport/Indicator';
 * 
 * const indicator = useIndicatorSystem({ hideDelay: 3000 });
 * 
 * setupModalIntegration(modalStore, viewportStore, indicator);
 * ```
 */
export function setupModalIntegration(
  modalStore: { subscribe: (callback: (modal: ModalState) => void) => () => void },
  viewportStore: ViewportStore,
  indicator: IndicatorSystem
): () => void {
  return modalStore.subscribe((modal) => {
    if (modal.isOpen) {
      viewportStore.disableScroll();
      indicator.hide();
    } else {
      viewportStore.enableScroll();
      indicator.showAndStartTimer();
    }
  });
}

/**
 * Creates a function to jump to a specific section by index
 * 
 * @param sectionsForIndicator - Array of sections available for indicator navigation
 * @param sectionsForScrolling - Array of all sections for scrolling
 * @param viewportStore - The viewport store for section navigation
 * @param indicator - The indicator system instance
 * @returns Function that jumps to section by indicator index
 * 
 * @example
 * ```typescript
 * const jumpToSection = createJumpToSectionFunction(
 *   indicatorSections,
 *   allSections,
 *   viewportStore,
 *   indicator
 * );
 * 
 * // Jump to the second section in the indicator
 * jumpToSection(1);
 * ```
 */
export function createJumpToSectionFunction(
  sectionsForIndicator: Section[],
  sectionsForScrolling: Section[],
  viewportStore: ViewportStore,
  indicator: IndicatorSystem
): (index: number) => void {
  return (index: number) => {
    // Convert indicator section index to actual section index
    const indicatorSection = sectionsForIndicator[index];
    if (indicatorSection) {
      const actualIndex = sectionsForScrolling.findIndex((s) => s.id === indicatorSection.id);
      if (actualIndex !== -1) {
        viewportStore.setCurrentSection(actualIndex);
        indicator.showAndStartTimer();
      }
    }
  };
}

/**
 * Creates a reactive function to get current section index from sections array
 * 
 * @param sectionsForScrolling - Array of all sections for scrolling
 * @param viewportState - The current viewport state
 * @returns Current section index or -1 if not found
 * 
 * @example
 * ```typescript
 * const currentIndex = getCurrentSectionIndex(allSections, $viewportState);
 * console.log('Current section index:', currentIndex);
 * ```
 */
export function getCurrentSectionIndex(
  sectionsForScrolling: Section[],
  viewportState: ViewportState
): number {
  const currentSectionId = viewportState.section.currentSection;
  return sectionsForScrolling.findIndex((s) => s.id === currentSectionId);
}

/**
 * Creates a reactive function to get current indicator index from indicator sections
 * 
 * @param sectionsForIndicator - Array of sections available for indicator navigation
 * @param viewportState - The current viewport state
 * @returns Current indicator index or -1 if not found
 * 
 * @example
 * ```typescript
 * const indicatorIndex = getCurrentIndicatorIndex(indicatorSections, $viewportState);
 * console.log('Current indicator index:', indicatorIndex);
 * ```
 */
export function getCurrentIndicatorIndex(
  sectionsForIndicator: Section[],
  viewportState: ViewportState
): number {
  const currentSectionId = viewportState.section.currentSection;
  return sectionsForIndicator.findIndex((s) => s.id === currentSectionId);
}

/**
 * Sets up the viewport store with sections for scrolling
 * 
 * @param viewportStore - The viewport store instance
 * @param sections - Array of sections to set up
 * 
 * @example
 * ```typescript
 * setupViewportSections(viewportStore, allSections);
 * ```
 */
export function setupViewportSections(
  viewportStore: ViewportStore,
  sections: Section[]
): void {
  viewportStore.setSections(sections);
}

/**
 * Initializes the indicator system with configuration options
 * 
 * @param useIndicatorSystem - The indicator system factory function
 * @param options - Configuration options for the indicator system
 * @returns Configured indicator system instance
 * 
 * @example
 * ```typescript
 * import { useIndicatorSystem } from '@Utils/Guest/Viewport/Indicator';
 * 
 * const indicator = initializeIndicatorSystem(useIndicatorSystem, {
 *   hideDelay: 3000,
 *   mouseAreaPercentage: 0.8,
 *   indicatorAreaRadius: 100
 * });
 * ```
 */
export function initializeIndicatorSystem(
  useIndicatorSystem: (options: ScrollIntegrationOptions) => IndicatorSystem,
  options: ScrollIntegrationOptions = {}
): IndicatorSystem {
  return useIndicatorSystem({
    hideDelay: options.hideDelay ?? 3000,
    mouseAreaPercentage: options.mouseAreaPercentage ?? 0.8,
    indicatorAreaRadius: options.indicatorAreaRadius ?? 100
  });
}

/**
 * Starts the mouse detector for the indicator system when browser is available
 * 
 * @param indicator - The indicator system instance
 * @param browser - Browser availability flag
 * 
 * @example
 * ```typescript
 * import { browser } from '$app/environment';
 * 
 * startMouseDetector(indicator, browser);
 * ```
 */
export function startMouseDetector(
  indicator: IndicatorSystem,
  browser: boolean
): void {
  if (browser) {
    indicator.startMouseDetector();
  }
}

/**
 * Gets the current scroll position of the window
 * @returns Current scroll position with direction information
 */
export function getCurrentScrollPosition(): ScrollPosition {
  const x = window.scrollX || window.pageXOffset;
  const y = window.scrollY || window.pageYOffset;
  
  return {
    x,
    y,
    direction: 'none' // Direction would need to be tracked separately
  };
}

/**
 * Smoothly scrolls to a specific position
 * @param x - Horizontal position to scroll to
 * @param y - Vertical position to scroll to
 * @param config - Optional scroll behavior configuration
 */
export function smoothScrollTo(x: number, y: number, config: ScrollBehaviorConfig = {}): void {
  const { smooth = true, offset = 0 } = config;
  
  window.scrollTo({
    left: x,
    top: y + offset,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

/**
 * Scrolls to the top of the page
 * @param config - Optional scroll behavior configuration
 */
export function scrollToTop(config: ScrollBehaviorConfig = {}): void {
  smoothScrollTo(0, 0, config);
}

/**
 * Scrolls to the bottom of the page
 * @param config - Optional scroll behavior configuration
 */
export function scrollToBottom(config: ScrollBehaviorConfig = {}): void {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  smoothScrollTo(0, maxScroll, config);
}

/**
 * Checks if an element is currently in the viewport
 * @param element - The element to check
 * @param threshold - Optional threshold for visibility (0-1)
 * @returns True if element is in viewport
 */
export function isElementInViewport(element: Element, threshold: number = 0): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const verticalVisible = rect.top <= windowHeight * (1 - threshold) && rect.bottom >= windowHeight * threshold;
  const horizontalVisible = rect.left <= windowWidth * (1 - threshold) && rect.right >= windowWidth * threshold;
  
  return verticalVisible && horizontalVisible;
}

/**
 * Gets the current scroll progress as a percentage
 * @returns Scroll progress from 0 to 100
 */
export function getScrollProgress(): number {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  if (scrollHeight <= 0) return 0;
  
  return Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
}

/**
 * Creates a scroll event listener with throttling
 * @param callback - Function to call on scroll
 * @param throttleMs - Throttle delay in milliseconds
 * @returns Function to remove the listener
 */
export function createScrollListener(callback: (position: ScrollPosition) => void, throttleMs: number = 16): () => void {
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback(getCurrentScrollPosition());
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}