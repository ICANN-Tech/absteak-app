import { syncWithSectionChange } from '@Stores/Guest/Viewport/Highlight';
import { jumpToSection } from '@Utils/Guest/Viewport/Section';
import { getSectionIdByQuickLinkId } from '@Const/Guest/Control/QuickLink';
import type {
  QuickLinkNavigationConfig,
  NavigationResult,
  QuickLinkNavigationHandler
} from '../Types/Navigation';

/**
 * QuickLink Navigation Utility
 * 
 * Provides centralized navigation functionality for QuickLink components.
 * Handles section jumping with smooth scrolling and state synchronization.
 * 
 * @module QuickLinkNavigation
 * @version 1.0.0
 */

/**
 * Default navigation configuration
 */
const defaultConfig: QuickLinkNavigationConfig = {
  scrollConfig: {
    behavior: 'smooth',
    offsetForHeader: true
  },
  syncConfig: {
    triggerNavigation: false,
    respectLocks: true
  }
};

/**
 * Handles QuickLink navigation with error handling and state management
 * 
 * @param linkId - The QuickLink ID to navigate to
 * @param config - Navigation configuration options
 * @returns Promise that resolves to navigation result
 * 
 * @example
 * ```typescript
 * // Basic navigation
 * const result = await handleQuickLinkNavigation('hero');
 * 
 * // Navigation with custom config
 * const result = await handleQuickLinkNavigation('menu', {
 *   scrollConfig: {
 *     behavior: 'auto',
 *     offsetForHeader: false
 *   }
 * });
 * ```
 */
export const handleQuickLinkNavigation: QuickLinkNavigationHandler = async (
  linkId: string,
  config: QuickLinkNavigationConfig = {}
): Promise<NavigationResult> => {
  // Merge with default configuration
  const mergedConfig = {
    scrollConfig: { ...defaultConfig.scrollConfig, ...config.scrollConfig },
    syncConfig: { ...defaultConfig.syncConfig, ...config.syncConfig }
  };

  try {
    // Get the corresponding section ID for the quick link
    const sectionId = getSectionIdByQuickLinkId(linkId);
    
    if (!sectionId) {
      const errorMessage = `No section found for quick link: ${linkId}`;
      console.warn(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }

    // Navigate to the section with smooth scrolling
    await jumpToSection(sectionId, {
      scrollConfig: mergedConfig.scrollConfig
    });

    // Synchronize with section change for consistent state management
    syncWithSectionChange(sectionId, mergedConfig.syncConfig);

    return {
      success: true,
      sectionId
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Navigation failed';
    console.error('QuickLink navigation error:', error);
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Creates a navigation handler with pre-configured options
 * 
 * @param defaultConfig - Default configuration to use for all navigations
 * @returns Configured navigation handler function
 */
export const createQuickLinkNavigator = (
  defaultConfig: QuickLinkNavigationConfig
): QuickLinkNavigationHandler => {
  return (linkId: string, config?: QuickLinkNavigationConfig) => {
    const mergedConfig = {
      scrollConfig: { ...defaultConfig.scrollConfig, ...config?.scrollConfig },
      syncConfig: { ...defaultConfig.syncConfig, ...config?.syncConfig }
    };
    
    return handleQuickLinkNavigation(linkId, mergedConfig);
  };
};

/**
 * Export default configuration for external use
 */
export { defaultConfig as DEFAULT_QUICKLINK_NAVIGATION_CONFIG };