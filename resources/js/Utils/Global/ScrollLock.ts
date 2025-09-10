/**
 * Scroll Lock Utility
 * 
 * This module provides utilities for locking and unlocking scrolling functionality
 * across the entire application. It integrates with the existing navigation system
 * to prevent both keyboard and mouse navigation when needed (e.g., when modals are open).
 */

import { lockNavigation, unlockNavigation } from '@Stores/Guest/Viewport/Section';

/**
 * Interface for scroll lock state
 */
export interface ScrollLockState {
  isLocked: boolean;
  lockCount: number;
  originalBodyOverflow: string;
  originalHtmlOverflow: string;
}

/**
 * Global scroll lock state
 */
let scrollLockState: ScrollLockState = {
  isLocked: false,
  lockCount: 0,
  originalBodyOverflow: '',
  originalHtmlOverflow: ''
};

/**
 * Lock scrolling functionality
 * 
 * This function:
 * - Prevents keyboard navigation (arrow keys, page up/down)
 * - Prevents mouse wheel navigation
 * - Prevents body scrolling
 * - Uses a reference counting system to handle multiple lock requests
 * 
 * @param reason - Optional reason for locking (for debugging)
 */
export function lockScrolling(reason?: string): void {
  if (typeof window === 'undefined') return;
  
  scrollLockState.lockCount++;
  
  // Only apply lock on first request
  if (scrollLockState.lockCount === 1) {
    // Store original overflow values
    scrollLockState.originalBodyOverflow = document.body.style.overflow || '';
    scrollLockState.originalHtmlOverflow = document.documentElement.style.overflow || '';
    
    // Lock navigation (keyboard and mouse)
    lockNavigation();
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    scrollLockState.isLocked = true;
    
    if (reason) {
      console.debug(`Scroll locked: ${reason}`);
    }
  }
}

/**
 * Unlock scrolling functionality
 * 
 * This function:
 * - Restores keyboard navigation
 * - Restores mouse wheel navigation
 * - Restores body scrolling
 * - Uses reference counting to only unlock when all lock requests are released
 * 
 * @param reason - Optional reason for unlocking (for debugging)
 */
export function unlockScrolling(reason?: string): void {
  if (typeof window === 'undefined') return;
  
  if (scrollLockState.lockCount > 0) {
    scrollLockState.lockCount--;
  }
  
  // Only remove lock when all requests are released
  if (scrollLockState.lockCount === 0 && scrollLockState.isLocked) {
    // Unlock navigation (keyboard and mouse)
    unlockNavigation();
    
    // Restore body scrolling
    document.body.style.overflow = scrollLockState.originalBodyOverflow;
    document.documentElement.style.overflow = scrollLockState.originalHtmlOverflow;
    
    scrollLockState.isLocked = false;
    
    if (reason) {
      console.debug(`Scroll unlocked: ${reason}`);
    }
  }
}

/**
 * Force unlock all scrolling
 * 
 * This function immediately unlocks scrolling regardless of the lock count.
 * Use with caution - typically only for cleanup or error recovery.
 */
export function forceUnlockScrolling(): void {
  if (typeof window === 'undefined') return;
  
  // Reset lock count
  scrollLockState.lockCount = 0;
  
  if (scrollLockState.isLocked) {
    // Unlock navigation
    unlockNavigation();
    
    // Restore body scrolling
    document.body.style.overflow = scrollLockState.originalBodyOverflow;
    document.documentElement.style.overflow = scrollLockState.originalHtmlOverflow;
    
    scrollLockState.isLocked = false;
    
    console.debug('Scroll force unlocked');
  }
}

/**
 * Check if scrolling is currently locked
 * 
 * @returns True if scrolling is locked
 */
export function isScrollingLocked(): boolean {
  return scrollLockState.isLocked;
}

/**
 * Get current scroll lock state
 * 
 * @returns Current scroll lock state
 */
export function getScrollLockState(): Readonly<ScrollLockState> {
  return { ...scrollLockState };
}

/**
 * Reset scroll lock state
 * 
 * This function resets the internal state without changing the actual scroll behavior.
 * Use only for testing or when you know the state is out of sync.
 */
export function resetScrollLockState(): void {
  scrollLockState = {
    isLocked: false,
    lockCount: 0,
    originalBodyOverflow: '',
    originalHtmlOverflow: ''
  };
}

/**
 * Utility function to temporarily lock scrolling for a specific duration
 * 
 * @param duration - Duration in milliseconds
 * @param reason - Optional reason for locking
 * @returns Promise that resolves when the lock is released
 */
export function temporaryLockScrolling(duration: number, reason?: string): Promise<void> {
  return new Promise((resolve) => {
    lockScrolling(reason);
    
    setTimeout(() => {
      unlockScrolling(reason);
      resolve();
    }, duration);
  });
}

/**
 * Cleanup function for scroll lock utility
 * 
 * Call this when the application is being destroyed or during cleanup.
 */
export function cleanupScrollLock(): void {
  forceUnlockScrolling();
  resetScrollLockState();
}