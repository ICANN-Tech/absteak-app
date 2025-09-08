import { initializeSectionMonitoring } from '../Viewport/Monitor';

/**
 * Simple utility to initialize section monitoring for Guest layout
 * @returns Cleanup function to stop monitoring
 */
export function initializeGuestMonitoring(): () => void {
  return initializeSectionMonitoring({
    enableConsoleLogging: true,
    logSectionActivations: true,
    logComponentLoading: true,
    logNavigationChanges: true,
    includeTimestamps: true,
    logPrefix: '[Guest Layout]'
  });
}