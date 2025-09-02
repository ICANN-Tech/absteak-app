/**
 * Modal utility functions for global modal management
 * This module provides utilities for modal operations, integration with stores, and component management
 */

import type { ModalState } from '@Stores/Global/Modal';
import { modalStore } from '@Stores/Global/Modal';
import { get } from 'svelte/store';

/**
 * Modal configuration options
 */
export interface ModalConfig {
  type?: string;
  data?: any;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  persistent?: boolean;
}

/**
 * Modal utility class for managing modal operations
 */
export class ModalUtils {
  /**
   * Open a modal with specified configuration
   */
  static open(config: ModalConfig): void {
    modalStore.open(config.type, config.data);
  }

  /**
   * Close the current modal
   */
  static close(): void {
    modalStore.close();
  }

  /**
   * Toggle modal state
   */
  static toggle(): void {
    modalStore.toggle();
  }

  /**
   * Check if modal is currently open
   */
  static isOpen(): boolean {
    const state = get(modalStore);
    return state.isOpen;
  }

  /**
   * Get current modal state
   */
  static getState(): ModalState {
    return get(modalStore);
  }

  /**
   * Check if specific modal type is open
   */
  static isTypeOpen(type: string): boolean {
    const state = get(modalStore);
    return state.isOpen && state.type === type;
  }
}

/**
 * Setup modal keyboard event listeners
 */
export function setupModalKeyboardHandlers(): () => void {
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && ModalUtils.isOpen()) {
      ModalUtils.close();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown);
    
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }

  return () => {};
}

/**
 * Setup modal backdrop click handlers
 */
export function setupModalBackdropHandlers(): () => void {
  const handleBackdropClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-backdrop') && ModalUtils.isOpen()) {
      ModalUtils.close();
    }
  };

  if (typeof window !== 'undefined') {
    document.addEventListener('click', handleBackdropClick);
    
    return () => {
      document.removeEventListener('click', handleBackdropClick);
    };
  }

  return () => {};
}

/**
 * Initialize modal system with event handlers
 */
export function initializeModalSystem(): () => void {
  const cleanupKeyboard = setupModalKeyboardHandlers();
  const cleanupBackdrop = setupModalBackdropHandlers();

  return () => {
    cleanupKeyboard();
    cleanupBackdrop();
  };
}

/**
 * Convenience functions for common modal operations
 */
export const openModal = (type?: string, data?: any) => ModalUtils.open({ type, data });
export const closeModal = () => ModalUtils.close();
export const toggleModal = () => ModalUtils.toggle();
export const isModalOpen = () => ModalUtils.isOpen();
export const getModalState = () => ModalUtils.getState();

/**
 * Video modal specific utilities
 */
export const openVideoModal = (videoUrl: string, options?: any) => {
  ModalUtils.open({ type: 'video', data: { videoUrl, ...options } });
};

export const closeVideoModal = () => {
  if (ModalUtils.isTypeOpen('video')) {
    ModalUtils.close();
  }
};

export const isVideoModalOpen = () => ModalUtils.isTypeOpen('video');

/**
 * Confirmation modal utilities
 */
export const openConfirmModal = (message: string, onConfirm?: () => void, onCancel?: () => void) => {
  ModalUtils.open({ 
    type: 'confirm', 
    data: { message, onConfirm, onCancel } 
  });
};

export const openAlertModal = (message: string, onClose?: () => void) => {
  ModalUtils.open({ 
    type: 'alert', 
    data: { message, onClose } 
  });
};

/**
 * Loading modal utilities
 */
export const showLoadingModal = (message?: string) => {
  ModalUtils.open({ 
    type: 'loading', 
    data: { message: message || 'Loading...' } 
  });
};

export const hideLoadingModal = () => {
  if (ModalUtils.isTypeOpen('loading')) {
    ModalUtils.close();
  }
};

export default ModalUtils;