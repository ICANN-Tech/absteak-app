/**
 * Base component monitoring utilities
 * Provides common functionality for component-specific monitoring
 */

import { ComponentId } from '$lib/enums';
import { writable, type Writable } from 'svelte/store';
import { showComponent, hideComponent } from '$lib/stores/viewport/visibility';

/**
 * Configuration for component monitoring behavior
 */
export interface MonitorComponentConfig {
    /** Duration to extend visibility after interaction (ms) */
    interactionDuration: number;
    /** Duration to extend visibility on mouse enter (ms) */
    mouseEnterDuration: number;
    /** Duration to extend visibility on mouse leave (ms) */
    mouseLeaveDuration: number;
}

/**
 * Default configuration for component monitoring
 */
export const DEFAULT_COMPONENT_CONFIG: MonitorComponentConfig = {
    interactionDuration: 3000, // 3 seconds
    mouseEnterDuration: 1000,  // 1 second
    mouseLeaveDuration: 500    // 0.5 seconds
};

/**
 * Interface for component monitor modules
 */
export interface MonitorComponentModule {
    /** Component ID being monitored */
    componentId: ComponentId;
    /** Current interaction state */
    isInteracting: Writable<boolean>;
    /** Handle component interaction (e.g., button click) */
    handleInteraction: () => void;
    /** Handle mouse enter */
    handleMouseEnter: () => void;
    /** Handle mouse leave */
    handleMouseLeave: () => void;
    /** Check if component is currently in interaction state */
    isCurrentlyInteracting: () => boolean;
    /** Destroy the monitor and cleanup */
    destroy: () => void;
}

// Global registry to track components that are currently interacting
// This prevents section monitors from hiding components during interactions
const interactingComponents = new Set<ComponentId>();

/**
 * Check if a component is currently in interaction state
 * This is used by section monitors to avoid hiding interacting components
 */
export function isComponentInteracting(componentId: ComponentId): boolean {
    return interactingComponents.has(componentId);
}

/**
 * Override for hideComponent that respects interaction state
 * This prevents section monitors from hiding components during interactions
 */
export function hideComponentRespectingInteraction(componentId: ComponentId): void {
    if (!isComponentInteracting(componentId)) {
        hideComponent(componentId);
    }
}

/**
 * Creates a base component monitor for interaction tracking
 * @param componentId - The component to monitor
 * @param config - Configuration options
 * @returns MonitorComponentModule instance
 */
export function createBaseComponentMonitor(
    componentId: ComponentId,
    config: Partial<MonitorComponentConfig> = {}
): MonitorComponentModule {
    const finalConfig = { ...DEFAULT_COMPONENT_CONFIG, ...config };
    const isInteracting = writable(false);
    
    let interactionTimeout: number | null = null;
    let mouseEnterTimeout: number | null = null;
    let mouseLeaveTimeout: number | null = null;

    const clearTimeouts = () => {
        if (interactionTimeout) {
            clearTimeout(interactionTimeout);
            interactionTimeout = null;
        }
        if (mouseEnterTimeout) {
            clearTimeout(mouseEnterTimeout);
            mouseEnterTimeout = null;
        }
        if (mouseLeaveTimeout) {
            clearTimeout(mouseLeaveTimeout);
            mouseLeaveTimeout = null;
        }
    };

    const setInteracting = (value: boolean) => {
        isInteracting.set(value);
        
        // Update global registry
        if (value) {
            interactingComponents.add(componentId);
            // Force show the component when interacting
            showComponent(componentId);
        } else {
            interactingComponents.delete(componentId);
        }
    };

    return {
        componentId,
        isInteracting,
        
        handleInteraction: () => {
            clearTimeouts();
            setInteracting(true);
            
            interactionTimeout = setTimeout(() => {
                setInteracting(false);
                interactionTimeout = null;
            }, finalConfig.interactionDuration);
        },
        
        handleMouseEnter: () => {
            clearTimeouts();
            setInteracting(true);
            
            mouseEnterTimeout = setTimeout(() => {
                setInteracting(false);
                mouseEnterTimeout = null;
            }, finalConfig.mouseEnterDuration);
        },
        
        handleMouseLeave: () => {
            if (mouseEnterTimeout) {
                clearTimeout(mouseEnterTimeout);
                mouseEnterTimeout = null;
            }
            
            mouseLeaveTimeout = setTimeout(() => {
                setInteracting(false);
                mouseLeaveTimeout = null;
            }, finalConfig.mouseLeaveDuration);
        },
        
        isCurrentlyInteracting: () => {
            let current = false;
            isInteracting.subscribe(value => current = value)();
            return current;
        },
        
        destroy: () => {
            clearTimeouts();
            setInteracting(false);
        }
    };
}

/**
 * Utility function to extend visibility with interaction tracking
 * @param baseVisibility - Base visibility manager
 * @param monitor - Component monitor for interaction tracking
 * @returns Enhanced visibility manager with interaction support
 */
export function extendVisibilityWithInteraction<T extends { isVisible: any; show: () => void; hide: () => void; destroy?: () => void }>(
    baseVisibility: T,
    monitor: MonitorComponentModule
): T & {
    handleInteraction: () => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    destroy: () => void;
} {
    // Subscribe to interaction state changes
    monitor.isInteracting.subscribe(isInteracting => {
        if (isInteracting) {
            baseVisibility.show();
        }
        // Note: We don't automatically hide when interaction ends
        // because the base visibility manager should handle that
    });

    return {
        ...baseVisibility,
        handleInteraction: monitor.handleInteraction,
        handleMouseEnter: monitor.handleMouseEnter,
        handleMouseLeave: monitor.handleMouseLeave,
        destroy: () => {
            monitor.destroy();
            if (baseVisibility.destroy) {
                baseVisibility.destroy();
            }
        }
    };
}