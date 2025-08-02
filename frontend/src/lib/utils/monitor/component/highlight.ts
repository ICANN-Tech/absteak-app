/**
 * Highlight component specific monitoring utilities
 * Provides lock-based visibility management for Highlight component interactions
 */

import { ComponentId } from '$lib/enums';
import { highlightStore } from '$lib/stores/viewport/highlight';
import { lockVisibility, unlockVisibility } from '$lib/stores/viewport/visibility';

/**
 * Configuration for highlight lock timeouts
 */
export const HIGHLIGHT_LOCK_CONFIG = {
    clickLockDuration: 3000,    // Keep visible for 3 seconds after click
    mouseEnterDuration: 1000,   // Keep visible for 1 second after mouse enter
    mouseLeaveDuration: 500     // Hide after 0.5 seconds after mouse leave
};

/**
 * Interface for Highlight lock-based monitor
 */
export interface HighlightLockMonitor {
    /**
     * Handles highlight button clicks with lock mechanism
     */
    handleHighlightClick: (index: number) => void;
    
    /**
     * Handles mouse enter with temporary lock
     */
    handleMouseEnter: () => void;
    
    /**
     * Handles mouse leave
     */
    handleMouseLeave: () => void;
    
    /**
     * Cleanup function to clear timeouts and unlock component
     */
    destroy: () => void;
    
    /**
     * Check if component is currently locked from click interaction
     */
    isLocked: () => boolean;
}

/**
 * Creates a lock-based monitor for the Highlight component
 * Uses the visibility lock mechanism to keep component visible during interactions
 */
export function createHighlightLockMonitor(
    config = HIGHLIGHT_LOCK_CONFIG
): HighlightLockMonitor {
    let isLocked = false;
    let lockTimeout: number | null = null;

    /**
     * Clears any existing timeout
     */
    function clearExistingTimeout() {
        if (lockTimeout) {
            clearTimeout(lockTimeout);
            lockTimeout = null;
        }
    }

    /**
     * Sets a timeout to unlock the component
     */
    function setUnlockTimeout(duration: number, fromClick = false) {
        clearExistingTimeout();
        lockTimeout = setTimeout(() => {
            unlockVisibility(ComponentId.Highlight);
            if (fromClick) {
                isLocked = false;
            }
            lockTimeout = null;
        }, duration);
    }

    return {
        handleHighlightClick: (index: number) => {
            // Lock the component to visible state
            lockVisibility(ComponentId.Highlight, true);
            isLocked = true;
            
            // Jump to the highlight
            highlightStore.jumpToHighlight(index);
            
            // Set timeout to unlock after configured duration
            setUnlockTimeout(config.clickLockDuration, true);
        },

        handleMouseEnter: () => {
            // Only lock if not already locked from click
            if (!isLocked) {
                lockVisibility(ComponentId.Highlight, true);
                setUnlockTimeout(config.mouseEnterDuration);
            }
        },

        handleMouseLeave: () => {
            // Only handle mouse leave if not locked from click
            if (!isLocked) {
                setUnlockTimeout(config.mouseLeaveDuration);
            }
        },

        destroy: () => {
            clearExistingTimeout();
            // Ensure component is unlocked when destroyed
            if (isLocked) {
                unlockVisibility(ComponentId.Highlight);
                isLocked = false;
            }
        },

        isLocked: () => isLocked
    };
}

// Legacy exports for backward compatibility (deprecated)
/**
 * @deprecated Use createHighlightLockMonitor instead
 */
export const HIGHLIGHT_COMPONENT_CONFIG = {
    interactionDuration: 5000,
    mouseEnterDuration: 1500,
    mouseLeaveDuration: 2000
};

/**
 * @deprecated Use createHighlightLockMonitor instead
 */
export function createHighlightMonitor() {
    console.warn('createHighlightMonitor is deprecated. Use createHighlightLockMonitor instead.');
    return createHighlightLockMonitor();
}

/**
 * @deprecated Use createHighlightLockMonitor instead
 */
export function createHighlightAreaVisibility() {
    console.warn('createHighlightAreaVisibility is deprecated. Use createHighlightLockMonitor instead.');
    return createHighlightLockMonitor();
}