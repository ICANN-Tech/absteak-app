// Export all interfaces and types
export type { VideoConfig, MediaModule, UtilityModule, ManagerConfig, ManagerModule } from './module';
export type { VideoOverlayState } from './manager';

// Export the main manager functions
export { createMediaManager, mediaManager, mediaModule, utilityModule, mediaUtils } from './manager';

// Export everything from manager for backward compatibility
export * as manager from './manager';