/**
 * Index module for Guest Layout utilities
 * Re-exports all scrolling functionality from Scrolling.ts
 */

// Re-export everything from Scrolling module
export * from './Scrolling';

/**
 * Re-export types and interfaces for convenience
 */
export type { Section, ViewportStore, ViewportState, IndicatorSystem } from './Scrolling';