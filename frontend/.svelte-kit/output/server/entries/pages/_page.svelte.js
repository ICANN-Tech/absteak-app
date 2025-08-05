import { i as store_get, m as ensure_array_like, v as attr, t as attr_class, q as attr_style, e as escape_html, u as unsubscribe_stores, p as pop, c as push, x as stringify } from "../../chunks/index2.js";
import { S as SectionId, a as viewportStore, v as viewportState, u as useScrolling, s as scrollEnabled, i as isTransitioning, c as currentSectionIndex, b as sections, d as sectionsInitialized, e as error, f as isLoading, h as highlightStore } from "../../chunks/initialize.js";
import "../../chunks/visibility.js";
import { g as get } from "../../chunks/index7.js";
import { useViewportNavigator } from "../../chunks/navigator.js";
import { u as useSectionMonitor } from "../../chunks/base.js";
import "../../chunks/base3.js";
import "../../chunks/experience.js";
import "../../chunks/hero.js";
import { o as onDestroy } from "../../chunks/index-server.js";
class ScrollObserver {
  cleanup = null;
  options;
  lastScrollTime = 0;
  scrollDelay = 800;
  constructor(options = {}) {
    this.options = options;
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
   * Mulai observing scroll events
   */
  start() {
    if (this.cleanup) {
      this.stop();
    }
    const handleWheel = async (e) => {
      e.preventDefault();
      if (!this.canScroll()) {
        return;
      }
      const direction = e.deltaY > 0 ? "down" : "up";
      this.options.onScrollAttempt?.(direction);
      const state = get(viewportState);
      const currentIndex = this.getSectionIndex(state.section.currentSection);
      const sectionsLength = Object.values(SectionId).length;
      let nextIndex = currentIndex + (direction === "down" ? 1 : -1);
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= sectionsLength) nextIndex = sectionsLength - 1;
      if (nextIndex === currentIndex) return;
      const targetSectionId = this.getSectionId(nextIndex);
      if (!targetSectionId) return;
      this.updateLastScrollTime();
      try {
        if (this.options.preloadCallback) {
          await this.options.preloadCallback(nextIndex);
        }
        const currentSection = typeof document !== "undefined" ? document.getElementById(`section-${currentIndex}`) : null;
        if (currentSection) {
          currentSection.style.opacity = "0";
        }
        setTimeout(() => {
          const targetIndex = this.getSectionIndex(targetSectionId);
          viewportStore.setCurrentSection(targetIndex);
          this.options.onSectionChange?.(nextIndex);
          setTimeout(() => {
            const newSection = typeof document !== "undefined" ? document.getElementById(`section-${nextIndex}`) : null;
            if (newSection) {
              newSection.style.opacity = "1";
            }
          }, 50);
        }, 300);
        this.options.indicatorCallback?.();
      } catch (error2) {
        console.error("Error during section transition:", error2);
      }
    };
    const preventScroll = (e) => {
      e.preventDefault();
    };
    const preventKeyboardScroll = (e) => {
      const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
      if (keys.includes(e.keyCode)) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeyboardScroll);
    this.cleanup = () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeyboardScroll);
    };
  }
  /**
   * Berhenti observing scroll events
   */
  stop() {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
  }
  /**
   * Update options
   */
  updateOptions(options) {
    this.options = { ...this.options, ...options };
  }
  /**
   * Check apakah observer sedang aktif
   */
  isActive() {
    return this.cleanup !== null;
  }
}
function createScrollObserver(options = {}) {
  return new ScrollObserver(options);
}
function useScrollObserver(options = {}) {
  const observer = createScrollObserver(options);
  return {
    start: () => observer.start(),
    stop: () => observer.stop(),
    updateOptions: (newOptions) => observer.updateOptions(newOptions),
    isActive: () => observer.isActive()
  };
}
function useViewportSystem(options) {
  const {
    sections: sections2,
    scrollDelay = 800,
    preloadCallback,
    onSectionChange,
    onScrollAttempt,
    onNavigate,
    indicatorCallback,
    scrollConfig = {},
    enableScrollListener = true
  } = options;
  viewportStore.setSections(sections2);
  viewportStore.setScrollDelay(scrollDelay);
  const scrolling = useScrolling({
    enabled: true,
    delay: scrollDelay,
    preventNativeScroll: true,
    ...scrollConfig
  });
  const navigator = useViewportNavigator({
    preloadCallback,
    onNavigate,
    indicatorCallback
  });
  const scrollObserver = useScrollObserver({
    onSectionChange,
    onScrollAttempt,
    preloadCallback,
    indicatorCallback
  });
  if (enableScrollListener) {
    scrolling.onScroll((direction, fromIndex, toIndex) => {
      if (direction === "down") {
        navigator.nextSection();
      } else if (direction === "up") {
        navigator.previousSection();
      }
      onScrollAttempt?.(direction);
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
    updateOptions: (newOptions) => {
      if (newOptions.sections) {
        viewportStore.setSections(newOptions.sections);
      }
      if (newOptions.scrollDelay !== void 0) {
        viewportStore.setScrollDelay(newOptions.scrollDelay);
        scrolling.setDelay(newOptions.scrollDelay);
      }
      if (newOptions.scrollConfig) {
        scrolling.updateConfig(newOptions.scrollConfig);
      }
      navigator.updateOptions({
        preloadCallback: newOptions.preloadCallback,
        onNavigate: newOptions.onNavigate,
        indicatorCallback: newOptions.indicatorCallback
      });
      scrollObserver.updateOptions({
        onSectionChange: newOptions.onSectionChange,
        onScrollAttempt: newOptions.onScrollAttempt,
        preloadCallback: newOptions.preloadCallback,
        indicatorCallback: newOptions.indicatorCallback
      });
    },
    setSections: (newSections) => {
      viewportStore.setSections(newSections);
    },
    setScrollDelay: (delay) => {
      viewportStore.setScrollDelay(delay);
      scrolling.setDelay(delay);
    },
    // Scroll utilities
    scrolling,
    startScrollListener: scrolling.startListener,
    stopScrollListener: scrolling.stopListener
  };
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let currentSectionIndex2;
  const viewport = useViewportSystem({
    sections: sections.map((s) => ({ id: s.id, name: s.name, component: s.component, path: "" })),
    scrollDelay: 800,
    enableScrollListener: true,
    scrollConfig: {
      enabled: true,
      delay: 800,
      smoothBehavior: true,
      preventNativeScroll: true
    },
    onSectionChange: (index) => {
      console.log("Section changed to:", index);
      const section = sections[index];
      if (section) {
        if (section.id === "footer") ;
        else {
          highlightStore.syncWithSectionChange(section.id);
        }
      }
    },
    onScrollAttempt: (direction) => {
      console.log("Scroll attempt:", direction);
    },
    onNavigate: (fromIndex, toIndex) => {
      console.log(`Navigating from section ${fromIndex} to ${toIndex}`);
    }
  });
  const { stop: stopSectionMonitor } = useSectionMonitor();
  onDestroy(() => {
    stopSectionMonitor();
    viewport.stopScrollListener();
  });
  currentSectionIndex2 = sections.findIndex((section) => section.id === store_get($$store_subs ??= {}, "$viewportState", viewportState).section.currentSection);
  $$payload.out.push(`<main class="bg-primary-700/5 min-h-screen svelte-bmav8q">`);
  if (store_get($$store_subs ??= {}, "$sectionsInitialized", sectionsInitialized)) {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(sections);
    $$payload.out.push(`<!--[-->`);
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let section = each_array[index];
      const isActive = index === currentSectionIndex2;
      const slideOffset = isActive ? "0" : index > currentSectionIndex2 ? "100vh" : "-100vh";
      $$payload.out.push(`<div${attr("id", section.id)}${attr_class(`section-container ${stringify(isActive ? "active" : "")}`, "svelte-bmav8q")}${attr_style(` opacity: ${stringify(isActive ? "1" : "0")}; transform: translateY(${stringify(slideOffset)}); transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out; `)}>`);
      if (section.component) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<!---->`);
        section.component?.($$payload, {});
        $$payload.out.push(`<!---->`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div>`);
    }
    $$payload.out.push(`<!--]--> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div class="loading-container svelte-bmav8q">`);
    if (store_get($$store_subs ??= {}, "$error", error)) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="error-state svelte-bmav8q"><div class="error-icon svelte-bmav8q">❌</div> <h3 class="svelte-bmav8q">Initialization Error</h3> <p class="svelte-bmav8q">${escape_html(store_get($$store_subs ??= {}, "$error", error))}</p> <button class="retry-button svelte-bmav8q">Retry</button></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="loading-state svelte-bmav8q"><div class="loading-spinner svelte-bmav8q"></div> <p class="svelte-bmav8q">Loading sections...</p> `);
        {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`<div class="loading-state svelte-bmav8q"><div class="loading-spinner svelte-bmav8q"></div> <p class="svelte-bmav8q">Initializing...</p></div>`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></main>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
