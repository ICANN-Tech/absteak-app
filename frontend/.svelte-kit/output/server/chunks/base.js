import { v as viewportState, S as SectionId } from "./initialize.js";
import "./visibility.js";
import { showVideoHighlightComponents, hideVideoHighlightComponents, registerVideoHighlightComponent, unregisterVideoHighlightComponent, getRegisteredVideoHighlightComponentsMap, updateManualComponentsTracking as updateManualComponentsTracking$1, getVisibilityStatistics as getVisibilityStatistics$1, subscribeToAllComponentsVisibility as subscribeToAllComponentsVisibility$1, subscribeToComponentVisibility as subscribeToComponentVisibility$1, getComponentVisibilityStore as getComponentVisibilityStore$1, getAllComponentsVisibilityStatus as getAllComponentsVisibilityStatus$1, isComponentCurrentlyVisible as isComponentCurrentlyVisible$1, getRegisteredComponentTrackingStore as getRegisteredComponentTrackingStore$1, getComponentTrackingStore as getComponentTrackingStore$1, showOnlyVideoHighlightComponents, toggleVideoHighlightComponent, hideOnlyVideoHighlightComponent, showOnlyVideoHighlightComponent, monitorVideoHighlightComponent, isComponentVisibleInVideoHighlight, getVideoHighlightVisibleComponents } from "./video-highlight.js";
import { showHeroComponents, hideHeroComponents, registerHeroComponent, unregisterHeroComponent, getRegisteredHeroComponents, updateManualComponentsTracking, getVisibilityStatistics, subscribeToAllComponentsVisibility, subscribeToComponentVisibility, getComponentVisibilityStore, getAllComponentsVisibilityStatus, isComponentCurrentlyVisible, getRegisteredComponentTrackingStore, getComponentTrackingStore, showOnlyHeroComponents, toggleHeroComponent, hideOnlyHeroComponent, showOnlyHeroComponent, monitorHeroComponent, isComponentVisibleInHero, getHeroVisibleComponents } from "./hero.js";
import { showExperienceComponents, hideExperienceComponents, registerExperienceComponent, unregisterExperienceComponent, getRegisteredExperienceComponents, updateExperienceManualComponentsTracking, getExperienceVisibilityStatistics, subscribeToAllExperienceComponentsVisibility, subscribeToExperienceComponentVisibility, getExperienceComponentVisibilityStore, getAllExperienceComponentsVisibilityStatus, isExperienceComponentCurrentlyVisible, getRegisteredExperienceComponentTrackingStore, getExperienceComponentTrackingStore, hideOnlyExperienceComponents, showOnlyExperienceComponents, toggleExperienceComponent, hideOnlyExperienceComponent, showOnlyExperienceComponent, monitorExperienceComponent, isExperienceComponentVisible, getVisibleExperienceComponents } from "./experience.js";
import { showChefComponents, hideChefComponents, registerChefComponent, unregisterChefComponent, getRegisteredChefComponents, updateChefManualComponentsTracking, getChefVisibilityStatistics, subscribeToAllChefComponentsVisibility, subscribeToChefComponentVisibility, getChefComponentVisibilityStore, getAllChefComponentsVisibilityStatus, isChefComponentCurrentlyVisible, getRegisteredChefComponentTrackingStore, getChefComponentTrackingStore, hideOnlyChefComponents, showOnlyChefComponents, toggleChefComponent, hideOnlyChefComponent, showOnlyChefComponent, monitorChefComponent, isChefComponentVisible, getVisibleChefComponents } from "./chef.js";
import { showMenuComponents, hideMenuComponents, registerMenuComponent, unregisterMenuComponent, getRegisteredMenuComponents, updateMenuManualComponentsTracking, getMenuVisibilityStatistics, subscribeToAllMenuComponentsVisibility, subscribeToMenuComponentVisibility, getMenuComponentVisibilityStore, getAllMenuComponentsVisibilityStatus, isMenuComponentCurrentlyVisible, getRegisteredMenuComponentTrackingStore, getMenuComponentTrackingStore, hideOnlyMenuComponents, showOnlyMenuComponents, toggleMenuComponent, hideOnlyMenuComponent, showOnlyMenuComponent, monitorMenuComponent, isMenuComponentVisible, getVisibleMenuComponents } from "./menu.js";
import { showBookingComponents, hideBookingComponents, registerBookingComponent, unregisterBookingComponent, getRegisteredBookingComponents, updateBookingManualComponentsTracking, getBookingVisibilityStatistics, subscribeToAllBookingComponentsVisibility, subscribeToBookingComponentVisibility, getBookingComponentVisibilityStore, getAllBookingComponentsVisibilityStatus, isBookingComponentCurrentlyVisible, getRegisteredBookingComponentTrackingStore, getBookingComponentTrackingStore, hideOnlyBookingComponents, showOnlyBookingComponents, toggleBookingComponent, hideOnlyBookingComponent, showOnlyBookingComponent, monitorBookingComponent, isBookingComponentVisible, getVisibleBookingComponents } from "./reservation.js";
import { showFooterComponents, hideFooterComponents, registerFooterComponent, unregisterFooterComponent, getRegisteredFooterComponents, updateFooterManualComponentsTracking, getFooterVisibilityStatistics, subscribeToAllFooterComponentsVisibility, subscribeToFooterComponentVisibility, getFooterComponentVisibilityStore, getAllFooterComponentsVisibilityStatus, isFooterComponentCurrentlyVisible, getRegisteredFooterComponentTrackingStore, getFooterComponentTrackingStore, hideOnlyFooterComponents, showOnlyFooterComponents, toggleFooterComponent, hideOnlyFooterComponent, showOnlyFooterComponent, monitorFooterComponent, isFooterComponentVisible, getVisibleFooterComponents } from "./footer.js";
class SectionMonitor {
  options;
  unsubscribe;
  currentSection = null;
  subscribers = /* @__PURE__ */ new Map();
  constructor(options = {}) {
    this.options = {
      enableVisibilityControl: true,
      // Default true untuk mengaktifkan video highlight visibility
      ...options
    };
  }
  /**
   * Start monitoring section changes
   */
  start() {
    if (this.unsubscribe) {
      this.stop();
    }
    this.unsubscribe = viewportState.subscribe((state) => {
      const currentSection = state.section.currentSection;
      if (currentSection && currentSection !== this.currentSection) {
        const previousSection = this.currentSection;
        this.currentSection = currentSection;
        if (this.options.enableVisibilityControl) {
          this.handleVisibility(this.currentSection, previousSection);
        }
        this.notifySubscribers(this.currentSection, previousSection);
        this.options.onSectionChange?.(this.currentSection, 0, previousSection);
      }
    });
  }
  /**
   * Stop monitoring section changes
   */
  stop() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = void 0;
      this.currentSection = null;
    }
  }
  /**
   * Handle video highlight visibility based on section change
   * @param currentSection - Current section ID
   * @param previousSection - Previous section ID
   */
  handleVisibility(currentSection, previousSection) {
    if (currentSection === SectionId.VideoHighlight) {
      showVideoHighlightComponents();
    } else if (previousSection === SectionId.VideoHighlight) {
      hideVideoHighlightComponents();
    }
    if (currentSection === SectionId.Hero) {
      showHeroComponents();
    } else if (previousSection === SectionId.Hero) {
      hideHeroComponents();
    }
    if (currentSection === SectionId.Experience) {
      showExperienceComponents();
    } else if (previousSection === SectionId.Experience) {
      hideExperienceComponents();
    }
    if (currentSection === SectionId.Chef) {
      showChefComponents();
    } else if (previousSection === SectionId.Chef) {
      hideChefComponents();
    }
    if (currentSection === SectionId.Menu) {
      showMenuComponents();
    } else if (previousSection === SectionId.Menu) {
      hideMenuComponents();
    }
    if (currentSection === SectionId.Booking) {
      showBookingComponents();
    } else if (previousSection === SectionId.Booking) {
      hideBookingComponents();
    }
    if (currentSection === SectionId.Footer) {
      showFooterComponents();
    } else if (previousSection === SectionId.Footer) {
      hideFooterComponents();
    }
  }
  /**
   * Subscribe to section changes
   * @param id - Unique identifier for the subscriber
   * @param callback - Callback function to be called when section changes
   */
  subscribe(id, callback) {
    this.subscribers.set(id, callback);
  }
  /**
   * Unsubscribe from section changes
   * @param id - Unique identifier for the subscriber
   */
  unsubscribeFromChanges(id) {
    this.subscribers.delete(id);
  }
  /**
   * Notify all subscribers about section change
   * @param currentSection - Current section ID
   * @param previousSection - Previous section ID
   */
  notifySubscribers(currentSection, previousSection) {
    this.subscribers.forEach((callback) => {
      callback(currentSection, previousSection);
    });
  }
  /**
   * Get the current section ID
   * @returns Current section ID
   */
  getCurrentSectionId() {
    return this.currentSection;
  }
  /**
   * Update options for the SectionMonitor
   * @param newOptions - New options to update
   */
  updateOptions(newOptions) {
    this.options = {
      ...this.options,
      ...newOptions
    };
  }
  /**
   * Check if the SectionMonitor is active
   * @returns True if active, false otherwise
   */
  isActive() {
    return this.unsubscribe !== void 0;
  }
  /**
   * Get number of active subscribers
   * @returns Number of subscribers
   */
  getSubscriberCount() {
    return this.subscribers.size;
  }
  /**
   * Handle component registration for specific sections
   * @param sectionId - Section ID where component should be active
   * @param componentId - Component ID to register
   * @param config - Configuration for createStateVisibility
   * @returns The visibility object for the component
   */
  handleComponent(sectionId, componentId, config = {}) {
    if (sectionId === SectionId.VideoHighlight) {
      return registerVideoHighlightComponent(componentId, config);
    }
    if (sectionId === SectionId.Hero) {
      return registerHeroComponent(componentId, config);
    }
    if (sectionId === SectionId.Experience) {
      return registerExperienceComponent(componentId, config);
    }
    if (sectionId === SectionId.Chef) {
      return registerChefComponent(componentId, config);
    }
    if (sectionId === SectionId.Menu) {
      return registerMenuComponent(componentId, config);
    }
    if (sectionId === SectionId.Booking) {
      return registerBookingComponent(componentId, config);
    }
    if (sectionId === SectionId.Footer) {
      return registerFooterComponent(componentId, config);
    }
    console.warn(`Section ${sectionId} is not supported for component registration yet.`);
    return null;
  }
  /**
   * Unregister component from specific section
   * @param sectionId - Section ID where component was registered
   * @param componentId - Component ID to unregister
   */
  unregisterComponent(sectionId, componentId) {
    if (sectionId === SectionId.VideoHighlight) {
      unregisterVideoHighlightComponent(componentId);
      return;
    }
    if (sectionId === SectionId.Hero) {
      unregisterHeroComponent(componentId);
      return;
    }
    if (sectionId === SectionId.Experience) {
      unregisterExperienceComponent(componentId);
      return;
    }
    if (sectionId === SectionId.Chef) {
      unregisterChefComponent(componentId);
      return;
    }
    if (sectionId === SectionId.Menu) {
      unregisterMenuComponent(componentId);
      return;
    }
    if (sectionId === SectionId.Booking) {
      unregisterBookingComponent(componentId);
      return;
    }
    if (sectionId === SectionId.Footer) {
      unregisterFooterComponent(componentId);
      return;
    }
    console.warn(`Section ${sectionId} is not supported for component unregistration yet.`);
  }
  /**
   * Get all registered components for a specific section
   * @param sectionId - Section ID to check
   * @returns Map of registered components or null if section not supported
   */
  getRegisteredComponents(sectionId) {
    if (sectionId === SectionId.VideoHighlight) {
      return getRegisteredVideoHighlightComponentsMap();
    }
    if (sectionId === SectionId.Hero) {
      return getRegisteredHeroComponents();
    }
    if (sectionId === SectionId.Experience) {
      return getRegisteredExperienceComponents();
    }
    if (sectionId === SectionId.Chef) {
      return getRegisteredChefComponents();
    }
    if (sectionId === SectionId.Menu) {
      return getRegisteredMenuComponents();
    }
    if (sectionId === SectionId.Booking) {
      return getRegisteredBookingComponents();
    }
    if (sectionId === SectionId.Footer) {
      return getRegisteredFooterComponents();
    }
    console.warn(`Section ${sectionId} is not supported for getting registered components yet.`);
    return null;
  }
  /**
   * Bulk register multiple components for a section
   * @param sectionId - Section ID where components should be active
   * @param components - Array of component configurations
   * @returns Array of visibility objects
   */
  handleMultipleComponents(sectionId, components) {
    return components.map(
      ({ componentId, config }) => this.handleComponent(sectionId, componentId, config)
    );
  }
  /**
   * Get section-specific functions
   * @returns Section-specific functions including tracking capabilities
   */
  getSectionFunctions() {
    return {
      // Video highlight functions
      videoHighlight: {
        // Basic functions
        getVideoHighlightVisibleComponents,
        isComponentVisibleInVideoHighlight,
        monitorVideoHighlightComponent,
        showVideoHighlightComponents,
        hideVideoHighlightComponents,
        // Exclusive visibility functions
        showOnlyVideoHighlightComponent,
        hideOnlyVideoHighlightComponent,
        toggleVideoHighlightComponent,
        showOnlyVideoHighlightComponents,
        // Tracking functions
        getComponentTrackingStore: getComponentTrackingStore$1,
        getRegisteredComponentTrackingStore: getRegisteredComponentTrackingStore$1,
        isComponentCurrentlyVisible: isComponentCurrentlyVisible$1,
        getAllComponentsVisibilityStatus: getAllComponentsVisibilityStatus$1,
        getComponentVisibilityStore: getComponentVisibilityStore$1,
        subscribeToComponentVisibility: subscribeToComponentVisibility$1,
        subscribeToAllComponentsVisibility: subscribeToAllComponentsVisibility$1,
        getVisibilityStatistics: getVisibilityStatistics$1,
        updateManualComponentsTracking: updateManualComponentsTracking$1
      },
      // Hero functions
      hero: {
        // Basic functions
        getHeroVisibleComponents,
        isComponentVisibleInHero,
        monitorHeroComponent,
        showHeroComponents,
        hideHeroComponents,
        // Exclusive visibility functions
        showOnlyHeroComponent,
        hideOnlyHeroComponent,
        toggleHeroComponent,
        showOnlyHeroComponents,
        // Tracking functions
        getComponentTrackingStore,
        getRegisteredComponentTrackingStore,
        isComponentCurrentlyVisible,
        getAllComponentsVisibilityStatus,
        getComponentVisibilityStore,
        subscribeToComponentVisibility,
        subscribeToAllComponentsVisibility,
        getVisibilityStatistics,
        updateManualComponentsTracking
      },
      // Experience functions
      experience: {
        // Basic functions
        getVisibleExperienceComponents,
        isExperienceComponentVisible,
        monitorExperienceComponent,
        showExperienceComponents,
        hideExperienceComponents,
        // Exclusive visibility functions
        showOnlyExperienceComponent,
        hideOnlyExperienceComponent,
        toggleExperienceComponent,
        showOnlyExperienceComponents,
        hideOnlyExperienceComponents,
        // Tracking functions
        getComponentTrackingStore: getExperienceComponentTrackingStore,
        getRegisteredComponentTrackingStore: getRegisteredExperienceComponentTrackingStore,
        isComponentCurrentlyVisible: isExperienceComponentCurrentlyVisible,
        getAllComponentsVisibilityStatus: getAllExperienceComponentsVisibilityStatus,
        getComponentVisibilityStore: getExperienceComponentVisibilityStore,
        subscribeToComponentVisibility: subscribeToExperienceComponentVisibility,
        subscribeToAllComponentsVisibility: subscribeToAllExperienceComponentsVisibility,
        getVisibilityStatistics: getExperienceVisibilityStatistics,
        updateManualComponentsTracking: updateExperienceManualComponentsTracking
      },
      // Chef functions
      chef: {
        // Basic functions
        getVisibleChefComponents,
        isChefComponentVisible,
        monitorChefComponent,
        showChefComponents,
        hideChefComponents,
        // Exclusive visibility functions
        showOnlyChefComponent,
        hideOnlyChefComponent,
        toggleChefComponent,
        showOnlyChefComponents,
        hideOnlyChefComponents,
        // Tracking functions
        getComponentTrackingStore: getChefComponentTrackingStore,
        getRegisteredComponentTrackingStore: getRegisteredChefComponentTrackingStore,
        isComponentCurrentlyVisible: isChefComponentCurrentlyVisible,
        getAllComponentsVisibilityStatus: getAllChefComponentsVisibilityStatus,
        getComponentVisibilityStore: getChefComponentVisibilityStore,
        subscribeToComponentVisibility: subscribeToChefComponentVisibility,
        subscribeToAllComponentsVisibility: subscribeToAllChefComponentsVisibility,
        getVisibilityStatistics: getChefVisibilityStatistics,
        updateManualComponentsTracking: updateChefManualComponentsTracking
      },
      // Menu functions
      menu: {
        // Basic functions
        getVisibleMenuComponents,
        isMenuComponentVisible,
        monitorMenuComponent,
        showMenuComponents,
        hideMenuComponents,
        // Exclusive visibility functions
        showOnlyMenuComponent,
        hideOnlyMenuComponent,
        toggleMenuComponent,
        showOnlyMenuComponents,
        hideOnlyMenuComponents,
        // Tracking functions
        getComponentTrackingStore: getMenuComponentTrackingStore,
        getRegisteredComponentTrackingStore: getRegisteredMenuComponentTrackingStore,
        isComponentCurrentlyVisible: isMenuComponentCurrentlyVisible,
        getAllComponentsVisibilityStatus: getAllMenuComponentsVisibilityStatus,
        getComponentVisibilityStore: getMenuComponentVisibilityStore,
        subscribeToComponentVisibility: subscribeToMenuComponentVisibility,
        subscribeToAllComponentsVisibility: subscribeToAllMenuComponentsVisibility,
        getVisibilityStatistics: getMenuVisibilityStatistics,
        updateManualComponentsTracking: updateMenuManualComponentsTracking
      },
      // Booking functions
      booking: {
        // Basic functions
        getVisibleBookingComponents,
        isBookingComponentVisible,
        monitorBookingComponent,
        showBookingComponents,
        hideBookingComponents,
        // Exclusive visibility functions
        showOnlyBookingComponent,
        hideOnlyBookingComponent,
        toggleBookingComponent,
        showOnlyBookingComponents,
        hideOnlyBookingComponents,
        // Tracking functions
        getComponentTrackingStore: getBookingComponentTrackingStore,
        getRegisteredComponentTrackingStore: getRegisteredBookingComponentTrackingStore,
        isComponentCurrentlyVisible: isBookingComponentCurrentlyVisible,
        getAllComponentsVisibilityStatus: getAllBookingComponentsVisibilityStatus,
        getComponentVisibilityStore: getBookingComponentVisibilityStore,
        subscribeToComponentVisibility: subscribeToBookingComponentVisibility,
        subscribeToAllComponentsVisibility: subscribeToAllBookingComponentsVisibility,
        getVisibilityStatistics: getBookingVisibilityStatistics,
        updateManualComponentsTracking: updateBookingManualComponentsTracking
      },
      // Footer functions
      footer: {
        // Basic functions
        getVisibleFooterComponents,
        isFooterComponentVisible,
        monitorFooterComponent,
        showFooterComponents,
        hideFooterComponents,
        // Exclusive visibility functions
        showOnlyFooterComponent,
        hideOnlyFooterComponent,
        toggleFooterComponent,
        showOnlyFooterComponents,
        hideOnlyFooterComponents,
        // Tracking functions
        getComponentTrackingStore: getFooterComponentTrackingStore,
        getRegisteredComponentTrackingStore: getRegisteredFooterComponentTrackingStore,
        isComponentCurrentlyVisible: isFooterComponentCurrentlyVisible,
        getAllComponentsVisibilityStatus: getAllFooterComponentsVisibilityStatus,
        getComponentVisibilityStore: getFooterComponentVisibilityStore,
        subscribeToComponentVisibility: subscribeToFooterComponentVisibility,
        subscribeToAllComponentsVisibility: subscribeToAllFooterComponentsVisibility,
        getVisibilityStatistics: getFooterVisibilityStatistics,
        updateManualComponentsTracking: updateFooterManualComponentsTracking
      }
    };
  }
}
let globalSectionMonitor = null;
function getSectionMonitor(options = {}) {
  if (!globalSectionMonitor) {
    globalSectionMonitor = new SectionMonitor(options);
  }
  return globalSectionMonitor;
}
function useSectionMonitor(options = {}) {
  const monitor2 = getSectionMonitor(options);
  const sectionFunctions2 = monitor2.getSectionFunctions();
  return {
    start: () => monitor2.start(),
    stop: () => monitor2.stop(),
    getCurrentSectionId: () => monitor2.getCurrentSectionId(),
    updateOptions: (newOptions) => monitor2.updateOptions(newOptions),
    isActive: () => monitor2.isActive(),
    subscribe: (id, callback) => monitor2.subscribe(id, callback),
    unsubscribeFromChanges: (id) => monitor2.unsubscribeFromChanges(id),
    getSubscriberCount: () => monitor2.getSubscriberCount(),
    // Component management functions
    handleComponent: (sectionId, componentId, config) => monitor2.handleComponent(sectionId, componentId, config),
    unregisterComponent: (sectionId, componentId) => monitor2.unregisterComponent(sectionId, componentId),
    getRegisteredComponents: (sectionId) => monitor2.getRegisteredComponents(sectionId),
    handleMultipleComponents: (sectionId, components) => monitor2.handleMultipleComponents(sectionId, components),
    // Section functions
    videoHighlight: sectionFunctions2.videoHighlight,
    hero: sectionFunctions2.hero,
    experience: sectionFunctions2.experience,
    chef: sectionFunctions2.chef,
    menu: sectionFunctions2.menu,
    booking: sectionFunctions2.booking,
    footer: sectionFunctions2.footer
  };
}
const monitor = new SectionMonitor();
const sectionFunctions = monitor.getSectionFunctions();
sectionFunctions.videoHighlight;
sectionFunctions.hero;
sectionFunctions.experience;
sectionFunctions.chef;
sectionFunctions.menu;
sectionFunctions.booking;
sectionFunctions.footer;
export {
  useSectionMonitor as u
};
