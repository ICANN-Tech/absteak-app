import type { SectionEnum } from '@Enums/Guest/Section';
import type { NavigationOptions } from '@Utils/Guest/Viewport/Section';

/**
 * Configuration for QuickLink navigation
 */
export interface QuickLinkNavigationConfig {
  /** Scroll behavior configuration */
  scrollConfig?: {
    behavior?: ScrollBehavior;
    offsetForHeader?: boolean;
    customOffset?: number;
  };
  /** Section change synchronization options */
  syncConfig?: {
    triggerNavigation?: boolean;
    respectLocks?: boolean;
  };
}

/**
 * Result of navigation attempt
 */
export interface NavigationResult {
  /** Whether navigation was successful */
  success: boolean;
  /** Target section ID if navigation was attempted */
  sectionId?: SectionEnum;
  /** Error message if navigation failed */
  error?: string;
}

/**
 * QuickLink navigation handler function type
 */
export type QuickLinkNavigationHandler = (
  linkId: string,
  config?: QuickLinkNavigationConfig
) => Promise<NavigationResult>;

/**
 * Default navigation configuration
 */
export const DEFAULT_NAVIGATION_CONFIG: QuickLinkNavigationConfig = {
  scrollConfig: {
    behavior: 'smooth',
    offsetForHeader: true
  },
  syncConfig: {
    triggerNavigation: false,
    respectLocks: true
  }
};