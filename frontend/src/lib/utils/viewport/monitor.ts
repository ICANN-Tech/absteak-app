/**
 * Monitoring your section change and control visibility
 * 
 * @param options 
 * @param options.onSectionChange - Callback function when section changes
 * @param options.enableVisibilityControl - Enable visibility control
 */

import { viewportStore } from '$lib/stores/viewport';
import { lockVisibility, unlockVisibility, showComponent } from '$lib/stores/viewport/visibility';
import { ComponentId, SectionId } from '$lib/enums';
import type { Section } from '$lib/types';

export interface SectionMonitorOptions {
  onSectionChange?: (section: SectionId, sectionIndex: number) => void;
  enableVisibilityControl?: boolean;
}

export class SectionMonitor {
  private options: SectionMonitorOptions;
  private unsubscribe?: () => void;
  private currentSection: SectionId | null = null;

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
      
      if (currentSection && currentSection.id !== this.currentSection) {
        const previousSection = this.currentSection;
        this.currentSection = currentSection.id as SectionId;

        // Handle visibility control
        if (this.options.enableVisibilityControl) {
          this.handleVisibilityControl(currentSection);
        }

        // Call custom callback if provided
        this.options.onSectionChange?.(currentSection.id as SectionId, state.currentSectionIndex);

        console.log(`Section changed: ${previousSection} -> ${currentSection.id}`);
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
  private handleVisibilityControl(section: Section): void {
    if (section.id === SectionId.Footer) {
      // Lock visibility when on footer section
      lockVisibility([ComponentId.Highlight, ComponentId.Navigation], false);
    } else if (section.id === SectionId.Hero) {
      // For Hero section, only lock Navigation but let Hero functions handle Highlight
      lockVisibility([ComponentId.Navigation], false);
    } else {
      // For other sections, unlock visibility but don't automatically show components
      // Let the section-specific logic handle component visibility
      unlockVisibility();
      
      // Only show LanguageSwitch as it should always be visible
      // Don't automatically show other components - let initialization config control this
      showComponent([ComponentId.LanguageSwitch]);
    }
  }

  /**
   * Get current section ID
   */
  getCurrentSectionId(): SectionId | null {
    return this.currentSection;
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
