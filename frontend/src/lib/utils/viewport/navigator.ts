import { viewportStore } from '$lib/stores/viewport';
import type { Section } from '$lib/types';
import { SectionId } from '$lib/enums';

export interface NavigatorOptions {
  preloadCallback?: (index: number) => Promise<void>;
  onNavigate?: (fromIndex: number, toIndex: number) => void;
  indicatorCallback?: () => void;
}

export class ViewportNavigator {
  private options: NavigatorOptions;

  constructor(options: NavigatorOptions = {}) {
    this.options = options;
  }

  /**
   * Navigasi ke section tertentu berdasarkan index
   */
  async jumpToSection(targetIndex: number): Promise<boolean> {
    let currentIndex = 0;
    let sectionsLength = 0;
    let isTransitioning = false;

    // Get current state
    viewportStore.subscribe(state => {
      currentIndex = state.currentSectionIndex;
      sectionsLength = state.sections.length;
      isTransitioning = state.isTransitioning;
    })();

    // Validasi index
    if (targetIndex < 0 || targetIndex >= sectionsLength) {
      console.warn(`Invalid section index: ${targetIndex}. Valid range: 0-${sectionsLength - 1}`);
      return false;
    }

    // Jika sudah di section yang sama atau sedang transisi
    if (targetIndex === currentIndex || isTransitioning) {
      return false;
    }

    // Mulai transisi
    viewportStore.setTransitioning(true);

    try {
      // Callback sebelum navigasi
      this.options.onNavigate?.(currentIndex, targetIndex);

      // Preload komponen jika ada callback
      if (this.options.preloadCallback) {
        await this.options.preloadCallback(targetIndex);
      }

      // Fade out current section
      const currentSection = typeof document !== 'undefined' ? document.getElementById(`section-${currentIndex}`) : null;
      if (currentSection) {
        currentSection.style.opacity = '0';
      }

      // Setelah fade out selesai, ganti section dan fade in
      setTimeout(() => {
        viewportStore.setCurrentSection(targetIndex);

        // Sync highlight dengan section yang baru
        this.syncHighlightWithSection(targetIndex);

        // Fade in new section
        setTimeout(() => {
          const newSection = typeof document !== 'undefined' ? document.getElementById(`section-${targetIndex}`) : null;
          if (newSection) {
            newSection.style.opacity = '1';
          }

          // Reset flag transisi
          setTimeout(() => {
            viewportStore.setTransitioning(false);
          }, 300);
        }, 50);
      }, 300);

      // Callback untuk indicator
      this.options.indicatorCallback?.();

      return true;
    } catch (error) {
      console.error('Error during navigation:', error);
      viewportStore.setTransitioning(false);
      return false;
    }
  }

  /**
   * Navigasi ke section berdasarkan ID
   */
  async jumpToSectionById(sectionId: string): Promise<boolean> {
    let sections: Section[] = [];
    
    viewportStore.subscribe(state => {
      sections = state.sections;
    })();

    const targetIndex = sections.findIndex(section => section.id === sectionId);
    
    if (targetIndex === -1) {
      console.warn(`Section with ID '${sectionId}' not found`);
      return false;
    }

    // Sync highlight sebelum jump untuk immediate feedback
    try {
      const { highlightStore } = await import('$lib/stores/viewport/highlight');
      highlightStore.syncWithSectionChange(sectionId);
    } catch (error) {
      console.error('Error syncing highlight before jump:', error);
    }

    return this.jumpToSection(targetIndex);
  }

  /**
   * Navigasi ke section selanjutnya
   */
  async nextSection(): Promise<boolean> {
    let currentIndex = 0;
    let sectionsLength = 0;

    viewportStore.subscribe(state => {
      currentIndex = state.currentSectionIndex;
      sectionsLength = state.sections.length;
    })();

    const nextIndex = currentIndex + 1;
    if (nextIndex >= sectionsLength) {
      return false; // Sudah di section terakhir
    }

    return this.jumpToSection(nextIndex);
  }

  /**
   * Navigasi ke section sebelumnya
   */
  async previousSection(): Promise<boolean> {
    let currentIndex = 0;

    viewportStore.subscribe(state => {
      currentIndex = state.currentSectionIndex;
    })();

    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      return false; // Sudah di section pertama
    }

    return this.jumpToSection(prevIndex);
  }

  /**
   * Enable scroll functionality
   */
  enableScroll(): void {
    viewportStore.enableScroll();
  }

  /**
   * Disable scroll functionality
   */
  disableScroll(): void {
    viewportStore.disableScroll();
  }

  /**
   * Toggle scroll functionality
   */
  toggleScroll(): void {
    viewportStore.toggleScroll();
  }

  /**
   * Check apakah scroll enabled
   */
  isScrollEnabled(): boolean {
    let enabled = false;
    viewportStore.subscribe(state => {
      enabled = state.scrollEnabled;
    })();
    return enabled;
  }

  /**
   * Get current section info
   */
  getCurrentSection(): { index: number; section: Section | null } {
    let currentIndex = 0;
    let sections: Section[] = [];

    viewportStore.subscribe(state => {
      currentIndex = state.currentSectionIndex;
      sections = state.sections;
    })();

    return {
      index: currentIndex,
      section: sections[currentIndex] || null
    };
  }

  /**
   * Get total sections count
   */
  getTotalSections(): number {
    let sectionsLength = 0;
    viewportStore.subscribe(state => {
      sectionsLength = state.sections.length;
    })();
    return sectionsLength;
  }

  /**
   * Check apakah bisa navigasi ke section tertentu
   */
  canNavigateTo(targetIndex: number): boolean {
    let sectionsLength = 0;
    let isTransitioning = false;

    viewportStore.subscribe(state => {
      sectionsLength = state.sections.length;
      isTransitioning = state.isTransitioning;
    })();

    return targetIndex >= 0 && 
           targetIndex < sectionsLength && 
           !isTransitioning;
  }

  /**
   * Update options
   */
  updateOptions(options: Partial<NavigatorOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Sync highlight dengan section yang aktif dan handle section monitoring
   */
  private async syncHighlightWithSection(sectionIndex: number): Promise<void> {
    try {
      // Get section info
      let sections: Section[] = [];
      viewportStore.subscribe(state => {
        sections = state.sections;
      })();

      const currentSection = sections[sectionIndex];
      if (!currentSection) return;

      // Import highlight store dynamically untuk avoid circular dependency
      const { highlightStore } = await import('$lib/stores/viewport/highlight');
      
      // Sync highlight dengan section ID
      highlightStore.syncWithSectionChange(currentSection.id);

      // Handle section-specific component visibility
      await this.handleSectionMonitoring(currentSection.id);
      
    } catch (error) {
      console.error('Error syncing highlight with section:', error);
    }
  }

  /**
   * Handle section monitoring untuk hide/show components berdasarkan section
   */
  private async handleSectionMonitoring(sectionId: string): Promise<void> {
    try {
      // Import section monitors dynamically
      switch (sectionId) {
        case SectionId.Footer:
          const { createFooterMonitor } = await import('$lib/utils/monitor/section/footer');
          const footerMonitor = createFooterMonitor();
          footerMonitor.callSection();
          break;
          
        case SectionId.Hero:
          const { createHeroMonitor } = await import('$lib/utils/monitor/section/hero');
          const heroMonitor = createHeroMonitor();
          heroMonitor.callSection();
          break;
          
        case SectionId.Experience:
          const { createExperienceMonitor } = await import('$lib/utils/monitor/section/experience');
          const experienceMonitor = createExperienceMonitor();
          experienceMonitor.callSection();
          break;
          
        case SectionId.Chef:
          const { createChefMonitor } = await import('$lib/utils/monitor/section/chef');
          const chefMonitor = createChefMonitor();
          chefMonitor.callSection();
          break;
          
        case SectionId.Menu:
          const { createMenuMonitor } = await import('$lib/utils/monitor/section/menu');
          const menuMonitor = createMenuMonitor();
          menuMonitor.callSection();
          break;
          
        case SectionId.Booking:
          const { createBookingMonitor } = await import('$lib/utils/monitor/section/reservation');
          const bookingMonitor = createBookingMonitor();
          bookingMonitor.callSection();
          break;
          
        case SectionId.VideoHighlight:
          const { createVideoHighlightMonitor } = await import('$lib/utils/monitor/section/video-highlight');
          const videoHighlightMonitor = createVideoHighlightMonitor();
          videoHighlightMonitor.callSection();
          break;
          
        default:
          console.warn(`No monitor found for section: ${sectionId}`);
      }
    } catch (error) {
      console.error('Error handling section monitoring:', error);
    }
  }
}

/**
 * Factory function untuk membuat navigator
 */
export function createViewportNavigator(options: NavigatorOptions = {}): ViewportNavigator {
  return new ViewportNavigator(options);
}

/**
 * Hook-like function untuk digunakan di Svelte component
 */
export function useViewportNavigator(options: NavigatorOptions = {}) {
  const navigator = createViewportNavigator(options);

  return {
    jumpToSection: (index: number) => navigator.jumpToSection(index),
    jumpToSectionById: (id: string) => navigator.jumpToSectionById(id),
    nextSection: () => navigator.nextSection(),
    previousSection: () => navigator.previousSection(),
    enableScroll: () => navigator.enableScroll(),
    disableScroll: () => navigator.disableScroll(),
    toggleScroll: () => navigator.toggleScroll(),
    isScrollEnabled: () => navigator.isScrollEnabled(),
    getCurrentSection: () => navigator.getCurrentSection(),
    getTotalSections: () => navigator.getTotalSections(),
    canNavigateTo: (index: number) => navigator.canNavigateTo(index),
    updateOptions: (newOptions: Partial<NavigatorOptions>) => navigator.updateOptions(newOptions)
  };
}