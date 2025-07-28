/**
 * Monitoring your section change and control visibility
 * 
 * @param options 
 * @param options.onSectionChange - Callback function when section changes
 * @param options.enableVisibilityControl - Enable visibility control
 */

import { viewportStore } from '$lib/stores/viewport';
import { lockVisibility, unlockVisibility } from '$lib/stores/visibility';
import { SectionId } from '$lib/const/control/section';

export interface SectionMonitorOptions {
  onSectionChange?: (sectionId: string, sectionIndex: number) => void;
  enableVisibilityControl?: boolean;
}

export class SectionMonitor {
  private options: SectionMonitorOptions;
  private unsubscribe?: () => void;
  private currentSectionId: string | null = null;

  constructor(options: SectionMonitorOptions = {}) {
    this.options = {
      enableVisibilityControl: true,
      ...options
    };
  }

  /**
   * Start monitoring section changes
   */
  start(): void {
    if (this.unsubscribe) {
      this.stop(); // Stop existing monitoring
    }

    this.unsubscribe = viewportStore.subscribe(state => {
      const currentSection = state.sections[state.currentSectionIndex];
      
      if (currentSection && currentSection.id !== this.currentSectionId) {
        const previousSectionId = this.currentSectionId;
        this.currentSectionId = currentSection.id;

        // Handle visibility control
        if (this.options.enableVisibilityControl) {
          this.handleVisibilityControl(currentSection.id);
        }

        // Call custom callback if provided
        this.options.onSectionChange?.(currentSection.id, state.currentSectionIndex);

        console.log(`Section changed: ${previousSectionId} -> ${currentSection.id}`);
      }
    });
  }

  /**
   * Stop monitoring section changes
   */
  stop(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }

  /**
   * Handle visibility control based on current section
   */
  private handleVisibilityControl(sectionId: string): void {
    if ([SectionId.Footer, SectionId.Hero].includes(sectionId as SectionId)) {
      // Lock visibility when on footer section
      lockVisibility(undefined, false);
      console.log('Visibility locked - Footer section active');
    } else {
      // Unlock visibility for other sections
      unlockVisibility();
      console.log('Visibility unlocked - Non-footer section active');
    }
  }

  /**
   * Get current section ID
   */
  getCurrentSectionId(): string | null {
    return this.currentSectionId;
  }

  /**
   * Update monitor options
   */
  updateOptions(options: Partial<SectionMonitorOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Check if monitoring is active
   */
  isActive(): boolean {
    return this.unsubscribe !== undefined;
  }
}

/**
 * Factory function untuk membuat section monitor
 */
export function createSectionMonitor(options: SectionMonitorOptions = {}): SectionMonitor {
  return new SectionMonitor(options);
}

/**
 * Hook-like function untuk digunakan di Svelte component
 */
export function useSectionMonitor(options: SectionMonitorOptions = {}) {
  const monitor = createSectionMonitor(options);

  return {
    start: () => monitor.start(),
    stop: () => monitor.stop(),
    getCurrentSectionId: () => monitor.getCurrentSectionId(),
    updateOptions: (newOptions: Partial<SectionMonitorOptions>) => monitor.updateOptions(newOptions),
    isActive: () => monitor.isActive()
  };
}
