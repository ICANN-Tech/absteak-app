import { viewportStore } from '$lib/stores/viewport';
  import { useViewportNavigator } from '$lib/utils/viewport';
import type { Section } from '$lib/stores/viewport';

export interface ScrollObserverOptions {
  onSectionChange?: (index: number) => void;
  onScrollAttempt?: (direction: 'up' | 'down') => void;
  preloadCallback?: (index: number) => Promise<void>;
  indicatorCallback?: () => void;
}

export class ScrollObserver {
  private cleanup: (() => void) | null = null;
  private options: ScrollObserverOptions;

  constructor(options: ScrollObserverOptions = {}) {
    this.options = options;
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
      if (!viewportStore.canScroll()) {
        return;
      }

      const direction = e.deltaY > 0 ? 'down' : 'up';
      
      // Callback untuk scroll attempt
      this.options.onScrollAttempt?.(direction);

      // Get current state
      let currentIndex = 0;
      let sectionsLength = 0;
      
      viewportStore.subscribe(state => {
        currentIndex = state.currentSectionIndex;
        sectionsLength = state.sections.length;
      })();

      // Tentukan section selanjutnya
      let nextIndex = currentIndex + (direction === 'down' ? 1 : -1);

      // Batasi index dalam range yang valid
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= sectionsLength) nextIndex = sectionsLength - 1;

      // Jika index tidak berubah, tidak perlu transisi
      if (nextIndex === currentIndex) return;

      // Update state
      viewportStore.setTransitioning(true);
      viewportStore.updateLastScrollTime();

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
          viewportStore.setCurrentSection(nextIndex);
          
          // Callback untuk section change
          this.options.onSectionChange?.(nextIndex);

          // Fade in new section
          setTimeout(() => {
            const newSection = typeof document !== 'undefined' ? document.getElementById(`section-${nextIndex}`) : null;
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
      } catch (error) {
        console.error('Error during section transition:', error);
        viewportStore.setTransitioning(false);
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