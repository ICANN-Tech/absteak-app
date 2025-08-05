import { d as derived, w as writable, g as get } from "./index7.js";
import "./visibility.js";
var ComponentId = /* @__PURE__ */ ((ComponentId2) => {
  ComponentId2["Navigation"] = "navigation";
  ComponentId2["Schedule"] = "schedule";
  ComponentId2["Highlight"] = "highlight";
  ComponentId2["LanguageSwitch"] = "language-switch";
  ComponentId2["VideoPromotion"] = "video-promotion";
  ComponentId2["ScrollIndicator"] = "scroll-indicator";
  ComponentId2["BackToTop"] = "back-to-top";
  ComponentId2["ChatBot"] = "chat-bot";
  ComponentId2["Operation"] = "operation";
  return ComponentId2;
})(ComponentId || {});
var SectionId = /* @__PURE__ */ ((SectionId2) => {
  SectionId2["Hero"] = "hero";
  SectionId2["VideoHighlight"] = "video-highlight";
  SectionId2["Experience"] = "experience";
  SectionId2["Chef"] = "chef";
  SectionId2["Menu"] = "menu";
  SectionId2["Booking"] = "booking";
  SectionId2["Footer"] = "footer";
  return SectionId2;
})(SectionId || {});
const sections = [
  {
    id: SectionId.Hero,
    name: "Hero",
    component: null
    // Will be loaded lazily
  },
  {
    id: SectionId.VideoHighlight,
    name: "About",
    component: null
    // Will be loaded lazily
  },
  {
    id: SectionId.Experience,
    name: "Story",
    component: null
    // Will be loaded lazily
  },
  {
    id: SectionId.Chef,
    name: "Chef",
    component: null
    // Will be loaded lazily
  },
  {
    id: SectionId.Menu,
    name: "Menu",
    component: null
    // Will be loaded lazily
  },
  {
    id: SectionId.Booking,
    name: "Reserve",
    component: null
    // Will be loaded lazily
  },
  {
    id: SectionId.Footer,
    name: "Footer",
    component: null
    // Will be loaded lazily
  }
];
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
};
const initialViewportState = {
  dimensions: {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0
  },
  scroll: {
    x: 0,
    y: 0,
    direction: "none",
    isScrolling: false,
    isDisabled: false,
    velocity: 0,
    lastScrollTime: 0
  },
  mouse: {
    x: 0,
    y: 0,
    isTracking: false,
    lastMoveTime: 0,
    isOverComponent: false,
    hoveredComponent: null
  },
  section: {
    currentSection: SectionId.Hero,
    previousSection: null,
    targetSection: null,
    isNavigating: false,
    navigationProgress: 0,
    sectionElements: /* @__PURE__ */ new Map()
  },
  responsive: {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    breakpoint: "lg",
    orientation: "landscape"
  },
  isInitialized: false,
  lastUpdate: Date.now()
};
const _viewportState = writable(initialViewportState);
const viewportState = _viewportState;
derived(
  _viewportState,
  ($state) => $state.scroll
);
derived(
  _viewportState,
  ($state) => $state.section
);
derived(
  _viewportState,
  ($state) => $state.mouse
);
derived(
  _viewportState,
  ($state) => $state.responsive
);
derived(
  _viewportState,
  ($state) => $state.dimensions
);
derived(
  _viewportState,
  ($state) => $state.section.currentSection
);
derived(
  _viewportState,
  ($state) => $state.scroll.isScrolling
);
derived(
  _viewportState,
  ($state) => $state.responsive.isMobile
);
derived(
  _viewportState,
  ($state) => $state.section.isNavigating
);
derived(
  _viewportState,
  ($state) => $state.scroll.isDisabled
);
function calculateResponsiveState(width, height) {
  let breakpoint = "xs";
  if (width >= BREAKPOINTS["2xl"]) breakpoint = "2xl";
  else if (width >= BREAKPOINTS.xl) breakpoint = "xl";
  else if (width >= BREAKPOINTS.lg) breakpoint = "lg";
  else if (width >= BREAKPOINTS.md) breakpoint = "md";
  else if (width >= BREAKPOINTS.sm) breakpoint = "sm";
  return {
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    breakpoint,
    orientation: width > height ? "landscape" : "portrait"
  };
}
function calculateScrollVelocity(currentY, previousY, timeDelta) {
  if (timeDelta === 0) return 0;
  return Math.abs(currentY - previousY) / timeDelta;
}
const viewportActions = {
  // Scroll actions
  setScrollPosition: (x, y) => {
    _viewportState.update((state) => {
      const now = Date.now();
      const timeDelta = now - state.scroll.lastScrollTime;
      const velocity = calculateScrollVelocity(y, state.scroll.y, timeDelta);
      let direction = "none";
      if (y > state.scroll.y) direction = "down";
      else if (y < state.scroll.y) direction = "up";
      return {
        ...state,
        scroll: {
          ...state.scroll,
          x,
          y,
          direction,
          velocity,
          lastScrollTime: now
        },
        lastUpdate: now
      };
    });
  },
  updateScrollDirection: (direction) => {
    _viewportState.update((state) => ({
      ...state,
      scroll: {
        ...state.scroll,
        direction
      },
      lastUpdate: Date.now()
    }));
  },
  setScrolling: (isScrolling2) => {
    _viewportState.update((state) => ({
      ...state,
      scroll: {
        ...state.scroll,
        isScrolling: isScrolling2
      },
      lastUpdate: Date.now()
    }));
  },
  disableScroll: () => {
    _viewportState.update((state) => ({
      ...state,
      scroll: {
        ...state.scroll,
        isDisabled: true
      },
      lastUpdate: Date.now()
    }));
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  },
  enableScroll: () => {
    _viewportState.update((state) => ({
      ...state,
      scroll: {
        ...state.scroll,
        isDisabled: false
      },
      lastUpdate: Date.now()
    }));
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  },
  // Section actions
  navigateToSection: (sectionId) => {
    _viewportState.update((state) => ({
      ...state,
      section: {
        ...state.section,
        targetSection: sectionId,
        isNavigating: true,
        navigationProgress: 0
      },
      lastUpdate: Date.now()
    }));
  },
  setCurrentSection: (sectionId) => {
    _viewportState.update((state) => ({
      ...state,
      section: {
        ...state.section,
        previousSection: state.section.currentSection,
        currentSection: sectionId,
        targetSection: null,
        isNavigating: false,
        navigationProgress: 1
      },
      lastUpdate: Date.now()
    }));
  },
  registerSectionElement: (sectionId, element) => {
    _viewportState.update((state) => {
      const newSectionElements = new Map(state.section.sectionElements);
      newSectionElements.set(sectionId, element);
      return {
        ...state,
        section: {
          ...state.section,
          sectionElements: newSectionElements
        },
        lastUpdate: Date.now()
      };
    });
  },
  unregisterSectionElement: (sectionId) => {
    _viewportState.update((state) => {
      const newSectionElements = new Map(state.section.sectionElements);
      newSectionElements.delete(sectionId);
      return {
        ...state,
        section: {
          ...state.section,
          sectionElements: newSectionElements
        },
        lastUpdate: Date.now()
      };
    });
  },
  // Mouse actions
  updateMousePosition: (x, y) => {
    _viewportState.update((state) => ({
      ...state,
      mouse: {
        ...state.mouse,
        x,
        y,
        lastMoveTime: Date.now()
      },
      lastUpdate: Date.now()
    }));
  },
  setMouseTracking: (isTracking) => {
    _viewportState.update((state) => ({
      ...state,
      mouse: {
        ...state.mouse,
        isTracking
      },
      lastUpdate: Date.now()
    }));
  },
  setHoveredComponent: (componentId) => {
    _viewportState.update((state) => ({
      ...state,
      mouse: {
        ...state.mouse,
        hoveredComponent: componentId,
        isOverComponent: componentId !== null
      },
      lastUpdate: Date.now()
    }));
  },
  // Dimension actions
  updateDimensions: (dimensions) => {
    _viewportState.update((state) => {
      const newDimensions = { ...state.dimensions, ...dimensions };
      const responsive = calculateResponsiveState(newDimensions.width, newDimensions.height);
      return {
        ...state,
        dimensions: newDimensions,
        responsive,
        lastUpdate: Date.now()
      };
    });
  },
  updateResponsiveState: (responsive) => {
    _viewportState.update((state) => ({
      ...state,
      responsive: {
        ...state.responsive,
        ...responsive
      },
      lastUpdate: Date.now()
    }));
  },
  // Utility actions
  initialize: () => {
    _viewportState.update((state) => ({
      ...state,
      isInitialized: true,
      lastUpdate: Date.now()
    }));
    console.log("🖥️ Viewport state management initialized");
  },
  reset: () => {
    _viewportState.set({
      ...initialViewportState,
      lastUpdate: Date.now()
    });
    console.log("🔄 Viewport state reset");
  }
};
const getCurrentViewportState = () => get(_viewportState);
const viewportStore = {
  disableScroll: viewportActions.disableScroll,
  enableScroll: viewportActions.enableScroll,
  // Legacy section management methods
  setSections: (sections2) => {
    console.log("🔄 setSections called (legacy compatibility mode)");
  },
  setCurrentSection: (index) => {
    const sectionIds = Object.values(SectionId);
    if (index >= 0 && index < sectionIds.length) {
      viewportActions.setCurrentSection(sectionIds[index]);
    }
  },
  // Legacy scroll management methods
  setScrollDelay: (delay) => {
    console.log("🔄 setScrollDelay called (legacy compatibility mode)");
  },
  toggleScroll: () => {
    console.log("🔄 toggleScroll called (legacy compatibility mode)");
  },
  updateLastScrollTime: () => {
    console.log("🔄 updateLastScrollTime called (legacy compatibility mode)");
  },
  setTransitioning: (isTransitioning2) => {
    console.log("🔄 setTransitioning called (legacy compatibility mode)");
  },
  // Legacy properties that might be accessed
  get canScroll() {
    return !get(_viewportState).scroll.isDisabled;
  },
  // Additional methods that might be needed
  subscribe: viewportState.subscribe,
  get: getCurrentViewportState,
  actions: viewportActions
};
const scrollEnabled = derived(_viewportState, ($state) => !$state.scroll.isDisabled);
const isTransitioning = derived(_viewportState, ($state) => $state.section.isNavigating);
const currentSectionIndex = derived(_viewportState, ($state) => {
  const sectionIds = Object.values(SectionId);
  return sectionIds.indexOf($state.section.currentSection);
});
const _sectionsInitialized = writable(false);
const _componentsInitialized = writable(false);
const _highlightsInitialized = writable(false);
const _isLoading = writable(false);
const _error = writable(null);
const sectionsInitialized = _sectionsInitialized;
const isLoading = _isLoading;
const error = _error;
derived(
  [_sectionsInitialized, _componentsInitialized, _highlightsInitialized],
  ([$sections, $components, $highlights]) => $sections && $components && $highlights
);
derived(
  [_sectionsInitialized, _componentsInitialized, _highlightsInitialized, _isLoading, _error],
  ([$sections, $components, $highlights, $loading, $error]) => ({
    sectionsInitialized: $sections,
    componentsInitialized: $components,
    highlightsInitialized: $highlights,
    isLoading: $loading,
    error: $error
  })
);
const currentHighlightIndex = writable(0);
const isHighlightTransitioning = writable(false);
const highlightsData = writable([]);
derived(
  [currentHighlightIndex, highlightsData],
  ([$currentIndex, $highlights]) => {
    if ($highlights && $highlights.length > 0 && $currentIndex >= 0 && $currentIndex < $highlights.length) {
      return $highlights[$currentIndex];
    }
    return null;
  }
);
const highlightStore = {
  // Jump to specific highlight by index
  jumpToHighlight: (index) => {
    highlightsData.subscribe((highlights) => {
      if (index >= 0 && index < highlights.length) {
        isHighlightTransitioning.set(true);
        currentHighlightIndex.set(index);
        const highlight2 = highlights[index];
        if (highlight2 && highlight2.sectionId) {
          import("./navigator.js").then(({ useViewportNavigator }) => {
            const navigator = useViewportNavigator();
            navigator.jumpToSectionById(highlight2.sectionId);
          });
          import("./visibility.js").then(({ resetComponentVisibility, isVisibilityLocked }) => {
            import("./index.js").then(({ ComponentId: ComponentId2 }) => {
              if (!isVisibilityLocked(ComponentId2.Highlight)) {
                resetComponentVisibility(ComponentId2.Highlight);
              }
            });
          });
        }
        setTimeout(() => {
          isHighlightTransitioning.set(false);
        }, 300);
      }
    })();
  },
  // Jump to highlight by ID
  jumpToHighlightById: (highlightId) => {
    highlightsData.subscribe((highlights) => {
      const targetIndex = highlights.findIndex((highlight2) => highlight2.id === highlightId);
      if (targetIndex !== -1) {
        highlightStore.jumpToHighlight(targetIndex);
      }
    })();
  },
  // Jump to highlight by section ID
  jumpToHighlightBySectionId: (sectionId) => {
    highlightsData.subscribe((highlights) => {
      const targetIndex = highlights.findIndex((highlight2) => highlight2.sectionId === sectionId);
      if (targetIndex !== -1) {
        highlightStore.jumpToHighlight(targetIndex);
      }
    })();
  },
  // Go to next highlight
  nextHighlight: () => {
    currentHighlightIndex.subscribe((currentIndex) => {
      highlightsData.subscribe((highlights) => {
        const nextIndex = (currentIndex + 1) % highlights.length;
        highlightStore.jumpToHighlight(nextIndex);
      })();
    })();
  },
  // Go to previous highlight
  previousHighlight: () => {
    currentHighlightIndex.subscribe((currentIndex) => {
      highlightsData.subscribe((highlights) => {
        const prevIndex = currentIndex === 0 ? highlights.length - 1 : currentIndex - 1;
        highlightStore.jumpToHighlight(prevIndex);
      })();
    })();
  },
  // Reset to first highlight
  reset: () => {
    currentHighlightIndex.set(0);
    isHighlightTransitioning.set(false);
  },
  // Update highlights data
  updateHighlights: (newHighlights) => {
    highlightsData.set(newHighlights);
    currentHighlightIndex.subscribe((currentIndex) => {
      if (currentIndex >= newHighlights.length) {
        currentHighlightIndex.set(0);
      }
    })();
  },
  // Sync highlight index with section changes (untuk scroll)
  syncWithSectionChange: (sectionId) => {
    highlightsData.subscribe((highlights) => {
      const targetIndex = highlights.findIndex((highlight2) => highlight2.sectionId === sectionId);
      if (targetIndex !== -1) {
        currentHighlightIndex.subscribe((currentIndex) => {
          if (targetIndex !== currentIndex) {
            currentHighlightIndex.set(targetIndex);
          }
        })();
      }
    })();
  },
  // Sync highlight index with section index
  syncWithSectionIndex: (sectionIndex) => {
    highlightsData.subscribe((highlights) => {
      if (sectionIndex >= 0 && sectionIndex < highlights.length) {
        currentHighlightIndex.set(sectionIndex);
      }
    })();
  }
};
const highlight = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  currentHighlightIndex,
  highlightStore,
  highlightsData,
  isHighlightTransitioning
}, Symbol.toStringTag, { value: "Module" }));
const DEFAULT_SCROLL_CONFIG = {
  enabled: true,
  delay: 800,
  smoothBehavior: true,
  preventNativeScroll: true
};
class ViewportScrollManager {
  config;
  onScrollCallback;
  wheelEventListener;
  keyEventListener;
  touchStartY = 0;
  touchEventListener;
  scrollDelay = 800;
  lastScrollTime = 0;
  constructor(config = {}) {
    this.config = { ...DEFAULT_SCROLL_CONFIG, ...config };
    this.scrollDelay = this.config.delay;
    this.initializeScrollState();
  }
  /**
   * Initialize scroll state in viewport store
   */
  initializeScrollState() {
    if (this.config.enabled) {
      viewportStore.actions.enableScroll();
    } else {
      viewportStore.actions.disableScroll();
    }
  }
  /**
   * Enable scrolling
   */
  enableScroll() {
    this.config.enabled = true;
    viewportStore.actions.enableScroll();
  }
  /**
   * Disable scrolling
   */
  disableScroll() {
    this.config.enabled = false;
    viewportStore.actions.disableScroll();
  }
  /**
   * Toggle scroll state
   */
  toggleScroll() {
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
  isScrollEnabled() {
    const state = get(viewportState);
    return !state.scroll.isDisabled;
  }
  /**
   * Set scroll delay
   */
  setScrollDelay(delay) {
    this.config.delay = delay;
    this.scrollDelay = delay;
  }
  /**
   * Get current scroll delay
   */
  getScrollDelay() {
    return this.scrollDelay;
  }
  /**
   * Check if can scroll (considering delay and transition state)
   */
  canScroll() {
    const state = get(viewportState);
    const now = Date.now();
    const timeSinceLastScroll = now - this.lastScrollTime;
    return !state.scroll.isDisabled && !state.section.isNavigating && timeSinceLastScroll >= this.scrollDelay;
  }
  /**
   * Update last scroll time
   */
  updateLastScrollTime() {
    this.lastScrollTime = Date.now();
  }
  /**
   * Get current scroll state
   */
  getScrollState() {
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
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.enabled !== void 0) {
      if (newConfig.enabled) {
        this.enableScroll();
      } else {
        this.disableScroll();
      }
    }
    if (newConfig.delay !== void 0) {
      this.setScrollDelay(newConfig.delay);
    }
  }
  /**
   * Set scroll event callback
   */
  onScroll(callback) {
    this.onScrollCallback = callback;
  }
  /**
   * Get section index from SectionId
   */
  getSectionIndex(sectionId) {
    const sectionIds = Object.values(SectionId);
    return sectionIds.indexOf(sectionId);
  }
  /**
   * Get SectionId from index
   */
  getSectionId(index) {
    const sectionIds = Object.values(SectionId);
    return sectionIds[index] || null;
  }
  /**
   * Handle scroll event with direction detection
   */
  handleScrollEvent(direction) {
    if (!this.canScroll()) return;
    const state = get(viewportState);
    const currentIndex = this.getSectionIndex(state.section.currentSection);
    const totalSections = Object.values(SectionId).length;
    let targetIndex = currentIndex;
    if (direction === "down" && currentIndex < totalSections - 1) {
      targetIndex = currentIndex + 1;
    } else if (direction === "up" && currentIndex > 0) {
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
  startScrollListener() {
    this.stopScrollListener();
    this.wheelEventListener = (event) => {
      if (this.config.preventNativeScroll) {
        event.preventDefault();
      }
      const direction = event.deltaY > 0 ? "down" : "up";
      this.handleScrollEvent(direction);
    };
    this.keyEventListener = (event) => {
      if (!this.canScroll()) return;
      let direction = null;
      switch (event.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          direction = "down";
          break;
        case "ArrowUp":
        case "PageUp":
          direction = "up";
          break;
      }
      if (direction) {
        event.preventDefault();
        this.handleScrollEvent(direction);
      }
    };
    this.touchEventListener = {
      start: (event) => {
        this.touchStartY = event.touches[0].clientY;
      },
      end: (event) => {
        if (!this.canScroll()) return;
        const touchEndY = event.changedTouches[0].clientY;
        const deltaY = this.touchStartY - touchEndY;
        const threshold = 50;
        if (Math.abs(deltaY) > threshold) {
          const direction = deltaY > 0 ? "down" : "up";
          this.handleScrollEvent(direction);
        }
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("wheel", this.wheelEventListener, { passive: false });
      window.addEventListener("keydown", this.keyEventListener);
      window.addEventListener("touchstart", this.touchEventListener.start, { passive: true });
      window.addEventListener("touchend", this.touchEventListener.end, { passive: true });
    }
  }
  /**
   * Stop listening to scroll events
   */
  stopScrollListener() {
    if (typeof window !== "undefined") {
      if (this.wheelEventListener) {
        window.removeEventListener("wheel", this.wheelEventListener);
      }
      if (this.keyEventListener) {
        window.removeEventListener("keydown", this.keyEventListener);
      }
      if (this.touchEventListener) {
        window.removeEventListener("touchstart", this.touchEventListener.start);
        window.removeEventListener("touchend", this.touchEventListener.end);
      }
    }
    this.wheelEventListener = void 0;
    this.keyEventListener = void 0;
    this.touchEventListener = void 0;
  }
  /**
   * Cleanup method
   */
  destroy() {
    this.stopScrollListener();
    this.onScrollCallback = void 0;
  }
}
function createScrollManager(config) {
  return new ViewportScrollManager(config);
}
const scrollUtils = {
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
  getState: () => {
    const state = get(viewportState);
    return {
      enabled: !state.scroll.isDisabled,
      delay: 800,
      // Default delay
      lastScrollTime: state.scroll.lastScrollTime,
      isTransitioning: state.section.isNavigating,
      canScroll: !state.scroll.isDisabled && !state.section.isNavigating
    };
  }
};
function useScrolling(config) {
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
[
  ComponentId.Navigation,
  ComponentId.LanguageSwitch,
  ComponentId.Schedule,
  ComponentId.Highlight,
  ComponentId.VideoPromotion,
  ComponentId.ChatBot,
  ComponentId.Operation,
  ComponentId.ScrollIndicator
];
const DEFAULT_INITIALIZATION_CONFIG = {
  // Components that should be visible on initial page load (Hero section)
  initiallyVisible: [
    ComponentId.LanguageSwitch
  ],
  // Components that should be hidden on initial page load
  initiallyHidden: [
    ComponentId.Navigation,
    ComponentId.Schedule,
    ComponentId.Highlight,
    ComponentId.VideoPromotion,
    ComponentId.ChatBot,
    ComponentId.Operation,
    ComponentId.ScrollIndicator
  ],
  // Default section (Hero section)
  defaultSection: SectionId.Hero
};
function createInitializationConfig(options) {
  Object.values(ComponentId);
  const visible = options.visible || DEFAULT_INITIALIZATION_CONFIG.initiallyVisible;
  const hidden = options.hidden || DEFAULT_INITIALIZATION_CONFIG.initiallyHidden;
  const overlap = visible.filter((component) => hidden.includes(component));
  if (overlap.length > 0) {
    console.warn("⚠️ Components cannot be both visible and hidden:", overlap);
  }
  return {
    initiallyVisible: visible,
    initiallyHidden: hidden,
    defaultSection: options.defaultSection || DEFAULT_INITIALIZATION_CONFIG.defaultSection
  };
}
({
  /**
   * Minimal UI - Only essential components visible
   */
  MINIMAL: createInitializationConfig({
    visible: [ComponentId.Navigation, ComponentId.LanguageSwitch],
    hidden: [
      ComponentId.Schedule,
      ComponentId.Highlight,
      ComponentId.VideoPromotion,
      ComponentId.ChatBot,
      ComponentId.Operation,
      ComponentId.ScrollIndicator
    ]
  }),
  /**
   * Full UI - All components visible (for testing)
   */
  FULL: createInitializationConfig({
    visible: Object.values(ComponentId),
    hidden: []
  }),
  /**
   * Hero focused - Components suitable for hero section
   */
  HERO_FOCUSED: createInitializationConfig({
    visible: [
      ComponentId.Navigation,
      ComponentId.LanguageSwitch,
      ComponentId.ScrollIndicator
    ],
    hidden: [
      ComponentId.Schedule,
      ComponentId.Highlight,
      ComponentId.VideoPromotion,
      ComponentId.ChatBot,
      ComponentId.Operation
    ]
  }),
  /**
   * Development mode - All components visible for debugging
   */
  DEVELOPMENT: createInitializationConfig({
    visible: Object.values(ComponentId),
    hidden: [],
    defaultSection: SectionId.Hero
  })
});
export {
  ComponentId as C,
  SectionId as S,
  viewportStore as a,
  sections as b,
  currentSectionIndex as c,
  sectionsInitialized as d,
  error as e,
  isLoading as f,
  scrollUtils as g,
  highlightStore as h,
  isTransitioning as i,
  highlightsData as j,
  currentHighlightIndex as k,
  highlight as l,
  scrollEnabled as s,
  useScrolling as u,
  viewportState as v
};
