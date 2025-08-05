import { S as SectionId, a as viewportStore, v as viewportState } from "./initialize.js";
import { g as get } from "./index7.js";
class ViewportNavigator {
  options;
  constructor(options = {}) {
    this.options = options;
  }
  /**
   * Helper function to get current section index from SectionId
   */
  getSectionIndex(sectionId) {
    const sectionIds = Object.values(SectionId);
    return sectionIds.indexOf(sectionId);
  }
  /**
   * Helper function to get SectionId from index
   */
  getSectionId(index) {
    const sectionIds = Object.values(SectionId);
    return sectionIds[index] || null;
  }
  /**
   * Helper function to get total sections count
   */
  getTotalSectionsCount() {
    return Object.values(SectionId).length;
  }
  /**
   * Navigasi ke section tertentu berdasarkan index
   */
  async jumpToSection(targetIndex) {
    const state = get(viewportState);
    const currentIndex = this.getSectionIndex(state.section.currentSection);
    const sectionsLength = this.getTotalSectionsCount();
    const isTransitioning = state.section.isNavigating;
    if (targetIndex < 0 || targetIndex >= sectionsLength) {
      console.warn(`Invalid section index: ${targetIndex}. Valid range: 0-${sectionsLength - 1}`);
      return false;
    }
    if (targetIndex === currentIndex || isTransitioning) {
      return false;
    }
    const targetSectionId = this.getSectionId(targetIndex);
    if (!targetSectionId) {
      console.warn(`Invalid section index: ${targetIndex}`);
      return false;
    }
    try {
      this.options.onNavigate?.(currentIndex, targetIndex);
      if (this.options.preloadCallback) {
        await this.options.preloadCallback(targetIndex);
      }
      const currentSection = typeof document !== "undefined" ? document.getElementById(`section-${currentIndex}`) : null;
      if (currentSection) {
        currentSection.style.opacity = "0";
      }
      setTimeout(() => {
        viewportStore.actions.setCurrentSection(targetSectionId);
        this.syncHighlightWithSection(targetIndex);
        setTimeout(() => {
          const newSection = typeof document !== "undefined" ? document.getElementById(`section-${targetIndex}`) : null;
          if (newSection) {
            newSection.style.opacity = "1";
          }
        }, 50);
      }, 300);
      this.options.indicatorCallback?.();
      return true;
    } catch (error) {
      console.error("Error during navigation:", error);
      return false;
    }
  }
  /**
   * Navigasi ke section berdasarkan ID
   */
  async jumpToSectionById(sectionId) {
    const sectionIds = Object.values(SectionId);
    const targetIndex = sectionIds.indexOf(sectionId);
    if (targetIndex === -1) {
      console.warn(`Section with ID '${sectionId}' not found`);
      return false;
    }
    try {
      const { highlightStore } = await import("./initialize.js").then((n) => n.l);
      highlightStore.syncWithSectionChange(sectionId);
    } catch (error) {
      console.error("Error syncing highlight before jump:", error);
    }
    return this.jumpToSection(targetIndex);
  }
  /**
   * Navigasi ke section selanjutnya
   */
  async nextSection() {
    const state = get(viewportState);
    const currentIndex = this.getSectionIndex(state.section.currentSection);
    const sectionsLength = this.getTotalSectionsCount();
    const nextIndex = currentIndex + 1;
    if (nextIndex >= sectionsLength) {
      return false;
    }
    return this.jumpToSection(nextIndex);
  }
  /**
   * Navigasi ke section sebelumnya
   */
  async previousSection() {
    const state = get(viewportState);
    const currentIndex = this.getSectionIndex(state.section.currentSection);
    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      return false;
    }
    return this.jumpToSection(prevIndex);
  }
  /**
   * Enable scroll functionality
   */
  enableScroll() {
    viewportStore.actions.enableScroll();
  }
  /**
   * Disable scroll functionality
   */
  disableScroll() {
    viewportStore.actions.disableScroll();
  }
  /**
   * Toggle scroll functionality
   */
  toggleScroll() {
    const state = get(viewportState);
    if (state.scroll.isDisabled) {
      viewportStore.actions.enableScroll();
    } else {
      viewportStore.actions.disableScroll();
    }
  }
  /**
   * Check apakah scroll enabled
   */
  isScrollEnabled() {
    const state = get(viewportState);
    return !state.scroll.isDisabled;
  }
  /**
   * Get current section info
   */
  getCurrentSection() {
    const state = get(viewportState);
    const currentIndex = this.getSectionIndex(state.section.currentSection);
    return {
      index: currentIndex,
      section: state.section.currentSection
    };
  }
  /**
   * Get total sections count
   */
  getTotalSections() {
    return this.getTotalSectionsCount();
  }
  /**
   * Check apakah bisa navigasi ke section tertentu
   */
  canNavigateTo(targetIndex) {
    const state = get(viewportState);
    const sectionsLength = this.getTotalSectionsCount();
    const isTransitioning = state.section.isNavigating;
    return targetIndex >= 0 && targetIndex < sectionsLength && !isTransitioning;
  }
  /**
   * Update options
   */
  updateOptions(options) {
    this.options = { ...this.options, ...options };
  }
  /**
   * Sync highlight dengan section yang aktif dan handle section monitoring
   */
  async syncHighlightWithSection(sectionIndex) {
    try {
      const sectionId = this.getSectionId(sectionIndex);
      if (!sectionId) return;
      const { highlightStore } = await import("./initialize.js").then((n) => n.l);
      highlightStore.syncWithSectionChange(sectionId);
      await this.handleSectionMonitoring(sectionId);
    } catch (error) {
      console.error("Error syncing highlight with section:", error);
    }
  }
  /**
   * Handle section monitoring untuk hide/show components berdasarkan section
   */
  async handleSectionMonitoring(sectionId) {
    try {
      switch (sectionId) {
        case SectionId.Footer:
          const { createFooterMonitor } = await import("./footer.js");
          const footerMonitor = createFooterMonitor();
          footerMonitor.callSection();
          break;
        case SectionId.Hero:
          const { createHeroMonitor } = await import("./hero.js");
          const heroMonitor = createHeroMonitor();
          heroMonitor.callSection();
          break;
        case SectionId.Experience:
          const { createExperienceMonitor } = await import("./experience.js");
          const experienceMonitor = createExperienceMonitor();
          experienceMonitor.callSection();
          break;
        case SectionId.Chef:
          const { createChefMonitor } = await import("./chef.js");
          const chefMonitor = createChefMonitor();
          chefMonitor.callSection();
          break;
        case SectionId.Menu:
          const { createMenuMonitor } = await import("./menu.js");
          const menuMonitor = createMenuMonitor();
          menuMonitor.callSection();
          break;
        case SectionId.Booking:
          const { createBookingMonitor } = await import("./reservation.js");
          const bookingMonitor = createBookingMonitor();
          bookingMonitor.callSection();
          break;
        case SectionId.VideoHighlight:
          const { createVideoHighlightMonitor } = await import("./video-highlight.js");
          const videoHighlightMonitor = createVideoHighlightMonitor();
          videoHighlightMonitor.callSection();
          break;
        default:
          console.warn(`No monitor found for section: ${sectionId}`);
      }
    } catch (error) {
      console.error("Error handling section monitoring:", error);
    }
  }
}
function createViewportNavigator(options = {}) {
  return new ViewportNavigator(options);
}
function useViewportNavigator(options = {}) {
  const navigator = createViewportNavigator(options);
  return {
    jumpToSection: (index) => navigator.jumpToSection(index),
    jumpToSectionById: (id) => navigator.jumpToSectionById(id),
    nextSection: () => navigator.nextSection(),
    previousSection: () => navigator.previousSection(),
    enableScroll: () => navigator.enableScroll(),
    disableScroll: () => navigator.disableScroll(),
    toggleScroll: () => navigator.toggleScroll(),
    isScrollEnabled: () => navigator.isScrollEnabled(),
    getCurrentSection: () => navigator.getCurrentSection(),
    getTotalSections: () => navigator.getTotalSections(),
    canNavigateTo: (index) => navigator.canNavigateTo(index),
    updateOptions: (newOptions) => navigator.updateOptions(newOptions)
  };
}
export {
  ViewportNavigator,
  createViewportNavigator,
  useViewportNavigator
};
