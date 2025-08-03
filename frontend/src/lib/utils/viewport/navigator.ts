import { viewportStore, viewportState } from '$lib/stores/viewport/viewport';
import { get } from 'svelte/store';
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
   * Helper function to get current section index from SectionId
   */
  private getSectionIndex(sectionId: SectionId): number {
    const sectionIds = Object.values(SectionId);
    return sectionIds.indexOf(sectionId);
  }

  /**
   * Helper function to get SectionId from index
   */
  private getSectionId(index: number): SectionId | null {
    const sectionIds = Object.values(SectionId);
    return sectionIds[index] || null;
  }

  /**
   * Helper function to get total sections count
   */
  private getTotalSectionsCount(): number {
    return Object.values(SectionId).length;
  }

  /**
   * Navigasi ke section tertentu berdasarkan index
   */
  async jumpToSection(targetIndex: number): Promise<boolean> {
    const state = get(viewportState);
    const currentIndex = this.getSectionIndex(state.section.currentSection);
    const sectionsLength = this.getTotalSectionsCount();
    const isTransitioning = state.section.isNavigating;

    // Validasi index
    if (targetIndex < 0 || targetIndex >= sectionsLength) {
      console.warn(`Invalid section index: ${targetIndex}. Valid range: 0-${sectionsLength - 1}`);
      return false;
    }

    // Jika sudah di section yang sama atau sedang transisi
    if (targetIndex === currentIndex || isTransitioning) {
      return false;
    }

    // Get target section ID
    const targetSectionId = this.getSectionId(targetIndex);
    if (!targetSectionId) {
      console.warn(`Invalid section index: ${targetIndex}`);
      return false;
    }

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
        viewportStore.actions.setCurrentSection(targetSectionId);

        // Sync highlight dengan section yang baru
        this.syncHighlightWithSection(targetIndex);

        // Fade in new section
        setTimeout(() => {
          const newSection = typeof document !== 'undefined' ? document.getElementById(`section-${targetIndex}`) : null;
          if (newSection) {
            newSection.style.opacity = '1';
          }
        }, 50);
      }, 300);

      // Callback untuk indicator
      this.options.indicatorCallback?.();

      return true;
    } catch (error) {
      console.error('Error during navigation:', error);
      return false;
    }
  }

  /**
   * Navigasi ke section berdasarkan ID
   */
  async jumpToSectionById(sectionId: string): Promise<boolean> {
    const sectionIds = Object.values(SectionId);
    const targetIndex = sectionIds.indexOf(sectionId as SectionId);
    
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
    const state = get(viewportState);
    const currentIndex = this.getSectionIndex(state.section.currentSection);
    const sectionsLength = this.getTotalSectionsCount();

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
    const state = get(viewportState);
    const currentIndex = this.getSectionIndex(state.section.currentSection);

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
    viewportStore.actions.enableScroll();
  }

  /**
   * Disable scroll functionality
   */
  disableScroll(): void {
    viewportStore.actions.disableScroll();
  }

  /**
   * Toggle scroll functionality
   */
  toggleScroll(): void {
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
  isScrollEnabled(): boolean {
    const state = get(viewportState);
    return !state.scroll.isDisabled;
  }

  /**
   * Get current section info
   */
  getCurrentSection(): { index: number; section: SectionId } {
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
  getTotalSections(): number {
    return this.getTotalSectionsCount();
  }

  /**
   * Check apakah bisa navigasi ke section tertentu
   */
  canNavigateTo(targetIndex: number): boolean {
    const state = get(viewportState);
    const sectionsLength = this.getTotalSectionsCount();
    const isTransitioning = state.section.isNavigating;

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
      const sectionId = this.getSectionId(sectionIndex);
      if (!sectionId) return;

      // Import highlight store dynamically untuk avoid circular dependency
      const { highlightStore } = await import('$lib/stores/viewport/highlight');
      
      // Sync highlight dengan section ID
      highlightStore.syncWithSectionChange(sectionId);

      // Handle section-specific component visibility
      await this.handleSectionMonitoring(sectionId);
      
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