/**
 * Modal Utility - Complete Modal Management System
 * 
 * This module provides a comprehensive modal management system with:
 * - Type-safe modal configuration and state management
 * - Accessibility features (focus management, keyboard navigation)
 * - Animation support with customizable durations
 * - Body scroll prevention with layout shift protection
 * - Event handling for backdrop clicks and keyboard events
 * - Modular design for easy integration with Svelte components
 * - Data management for modal content
 * 
 * @example
 * ```typescript
 * import { modalManager, modalDataStore } from '$lib/utils/modal';
 * 
 * // Set modal data and open
 * modalDataStore.setItem({ name: 'Item', desc: 'Description', price: '$10', img: 'url' });
 * modalManager.modal.openModal();
 * ```
 */


// Export manager and data utilities
export { modalManager, modalModule, modalUtils, createModalManager } from './manager';
export { modalDataStore, type ModalDataState } from './data';

// Export types
export type { Config, Module } from './module';