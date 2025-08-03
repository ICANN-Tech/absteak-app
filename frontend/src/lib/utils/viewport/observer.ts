import { get } from 'svelte/store';
import { viewportStore, viewportState } from '$lib/stores/viewport/viewport';
import { SectionId } from '$lib/enums';

export interface ScrollObserverOptions {
  onSectionChange?: (index: number) => void;
  onScrollAttempt?: (direction: 'up' | 'down') => void;
  preloadCallback?: (index: number) => Promise<void>;
  indicatorCallback?: () => void;
}

export class ScrollObserver {
  private cleanup: (() => void) | null = null;
  private options: ScrollObserverOptions;
  private lastScrollTime: number = 0;
  private scrollDelay: number = 800;

  constructor(options: ScrollObserverOptions = {}) {
    this.options = options;
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
   * Check if can scroll (considering delay and transition state)
   */
  private canScroll(): boolean {
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
  private updateLastScrollTime(): void {
    this.lastScrollTime = Date.now();
  }

  /**
   * Mulai observing scroll events
   */
  start(): void {
    if (this.cleanup) {
      this.stop();
    }

    const handleWheel = async (e: WheelEvent) => {
      e.preventDefault();

      // Cek apakah bisa scroll
      if (!this.canScroll()) {
        return;
      }

      const direction = e.deltaY > 0 ? 'down' : 'up';
      
      // Callback untuk scroll attempt
      this.options.onScrollAttempt?.(direction);

      // Get current state
      const state = get(viewportState);
      const currentIndex = this.getSectionIndex(state.section.currentSection);
      const sectionsLength = Object.values(SectionId).length;

      // Tentukan section selanjutnya
      let nextIndex = currentIndex + (direction === 'down' ? 1 : -1);

      // Batasi index dalam range yang valid
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= sectionsLength) nextIndex = sectionsLength - 1;

      // Jika index tidak berubah, tidak perlu transisi
      if (nextIndex === currentIndex) return;

      // Get target section ID
      const targetSectionId = this.getSectionId(nextIndex);
      if (!targetSectionId) return;

      // Update last scroll time
      this.updateLastScrollTime();

      try {
        // Preload komponen jika ada callback
        if (this.options.preloadCallback) {
          await this.options.preloadCallback(nextIndex);
        }

        // Fade out current section
        const currentSection = typeof document !== 'undefined' ? document.getElementById(`section-${currentIndex}`) : null;
        if (currentSection) {
          currentSection.style.opacity = '0';
        }

        // Setelah fade out selesai, ganti section dan fade in
        setTimeout(() => {
          // Convert SectionId to index for legacy compatibility
          const targetIndex = this.getSectionIndex(targetSectionId);
          viewportStore.setCurrentSection(targetIndex);
          
          // Callback untuk section change
          this.options.onSectionChange?.(nextIndex);

          // Fade in new section
          setTimeout(() => {
            const newSection = typeof document !== 'undefined' ? document.getElementById(`section-${nextIndex}`) : null;
            if (newSection) {
              newSection.style.opacity = '1';
            }
          }, 50);
        }, 300);

        // Callback untuk indicator
        this.options.indicatorCallback?.();
      } catch (error) {
        console.error('Error during section transition:', error);
      }
    };

    // Prevent manual scrolling
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    // Prevent keyboard scrolling
    const preventKeyboardScroll = (e: KeyboardEvent) => {
      const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // space, page up/down, end, home, arrow keys
      if (keys.includes(e.keyCode)) {
        e.preventDefault();
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeyboardScroll);

    // Setup cleanup function
    this.cleanup = () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeyboardScroll);
    };
  }

  /**
   * Berhenti observing scroll events
   */
  stop(): void {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
  }

  /**
   * Update options
   */
  updateOptions(options: Partial<ScrollObserverOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Check apakah observer sedang aktif
   */
  isActive(): boolean {
    return this.cleanup !== null;
  }
}

/**
 * Factory function untuk membuat scroll observer
 */
export function createScrollObserver(options: ScrollObserverOptions = {}): ScrollObserver {
  return new ScrollObserver(options);
}

/**
 * Hook-like function untuk digunakan di Svelte component
 */
export function useScrollObserver(options: ScrollObserverOptions = {}) {
  const observer = createScrollObserver(options);

  return {
    start: () => observer.start(),
    stop: () => observer.stop(),
    updateOptions: (newOptions: Partial<ScrollObserverOptions>) => observer.updateOptions(newOptions),
    isActive: () => observer.isActive()
  };
}