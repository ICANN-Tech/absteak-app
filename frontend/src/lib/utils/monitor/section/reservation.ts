/**
 * Booking section monitoring utility
 * Implements MonitorModule interface for booking section component visibility management
 */

import { ComponentId } from '$lib/enums';
import { showComponent, hideComponent, createStateVisibility, type ViewportPositionConfig } from '$lib/stores/viewport/visibility';
import { writable, derived, type Readable } from 'svelte/store';
import type { MonitorSectionModule } from './index';
import { handleSectionCall, handleSectionExit, DEFAULT_MANUAL_COMPONENTS, DEFAULT_SECTION_CONFIG } from './base';

// Registry untuk komponen yang terdaftar dengan createStateVisibility
const registeredComponents = new Map<ComponentId, ReturnType<typeof createStateVisibility>>();

// Tracking store untuk memantau status visibility semua components
const componentTrackingStore = writable<Map<ComponentId, boolean>>(new Map());

// Tracking store untuk registered components
const registeredComponentTrackingStore = writable<Map<ComponentId, boolean>>(new Map());

/**
 * Creates the booking monitor module
 * @returns MonitorModule implementation for booking section
 */
export function createBookingMonitor(): MonitorSectionModule {
    return {
        /**
         * Registers a component for viewport monitoring.
         */
        registeredComponents: (
            componentId: ComponentId,
            config?: Partial<ViewportPositionConfig>
        ): ReturnType<typeof createStateVisibility> => {
            // Default config untuk booking section
            const defaultConfig: Partial<ViewportPositionConfig> = {
                hideDelay: 1500,
                initialVisible: false,
                ...config
            };

            const visibility = createStateVisibility(componentId.toString(), defaultConfig);
            registeredComponents.set(componentId, visibility);
            
            // Setup tracking untuk component ini
            visibility.finalVisible.subscribe(isVisible => {
                registeredComponentTrackingStore.update(store => {
                    const newStore = new Map(store);
                    newStore.set(componentId, isVisible);
                    return newStore;
                });
                
                // Update general tracking store juga
                componentTrackingStore.update(store => {
                    const newStore = new Map(store);
                    newStore.set(componentId, isVisible);
                    return newStore;
                });
            });
            
            return visibility;
        },

        /**
         * Unregisters a component from viewport monitoring.
         */
        unregisteredComponents: (componentId: ComponentId): void => {
            const visibility = registeredComponents.get(componentId);
            if (visibility) {
                visibility.destroy();
                registeredComponents.delete(componentId);
                
                // Remove from tracking stores
                registeredComponentTrackingStore.update(store => {
                    const newStore = new Map(store);
                    newStore.delete(componentId);
                    return newStore;
                });
                
                componentTrackingStore.update(store => {
                    const newStore = new Map(store);
                    newStore.delete(componentId);
                    return newStore;
                });
            }
        },

        /**
         * Returns the visibility state of a component.
         */
        getComponentVisibility: (componentId: ComponentId): boolean => {
            let currentState = false;
            componentTrackingStore.subscribe(store => {
                currentState = store.get(componentId) || false;
            })();
            return currentState;
        },

        /**
         * Returns the visibility state of all components.
         */
        getAllComponentsVisibility: (): Record<ComponentId, boolean> => {
            let currentState: Record<ComponentId, boolean> = {} as Record<ComponentId, boolean>;
            componentTrackingStore.subscribe(store => {
                store.forEach((isVisible, componentId) => {
                    currentState[componentId] = isVisible;
                });
            })();
            return currentState;
        },

        /**
         * Shows all registered components.
         */
        showRegisteredComponents: (): void => {
            registeredComponents.forEach((visibility) => {
                visibility.show();
            });
        },

        /**
         * Hides all registered components.
         */
        hideRegisteredComponents: (): void => {
            registeredComponents.forEach((visibility) => {
                visibility.hide();
            });
        },

        /**
         * Shows all components (manual + registered).
         */
        callSection: (): void => {
            // Use base function for manual components
            handleSectionCall(DEFAULT_SECTION_CONFIG, componentTrackingStore);
            
            // Handle registered components
            registeredComponents.forEach((visibility) => {
                visibility.show();
            });
        },

        /**
         * Shows all components (manual + registered).
         */
        exitSection: (): void => {
            // Use base function for manual components - show all registered components
            handleSectionCall(DEFAULT_SECTION_CONFIG, componentTrackingStore);
            
            // Handle registered components
            registeredComponents.forEach((visibility) => {
                visibility.show();
            });
        },

        /**
         * Returns list of currently visible components.
         */
        getVisibleComponents: (): ComponentId[] => {
            let visibleComponents: ComponentId[] = [];
            componentTrackingStore.subscribe(store => {
                visibleComponents = [];
                store.forEach((isVisible, componentId) => {
                    if (isVisible) {
                        visibleComponents.push(componentId);
                    }
                });
            })();
            return visibleComponents;
        },

        /**
         * Checks if a component is currently visible.
         */
        isComponentVisible: (componentId: ComponentId): boolean => {
            let currentState = false;
            componentTrackingStore.subscribe(store => {
                currentState = store.get(componentId) || false;
            })();
            return currentState;
        },

        /**
         * Monitors a specific component.
         */
        monitorComponent: (componentId: ComponentId): {
            shouldBeVisible: boolean;
            isInVisibleList: boolean;
        } => {
            const shouldBeVisible = DEFAULT_SECTION_CONFIG.showOnCall?.includes(componentId) || false;
            
            return {
                shouldBeVisible,
                isInVisibleList: shouldBeVisible
            };
        },

        /**
         * Shows only the specified component and hides all others.
         */
        showOnlyComponent: (targetComponentId: ComponentId): void => {
            const allComponents = [
                ...DEFAULT_MANUAL_COMPONENTS,
                ...Array.from(registeredComponents.keys())
            ];
            
            // Process all components
            allComponents.forEach(componentId => {
                if (componentId === targetComponentId) {
                    // Show target component
                    if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
                        showComponent(componentId);
                    }
                    
                    const registeredComponent = registeredComponents.get(componentId);
                    if (registeredComponent) {
                        registeredComponent.show();
                    }
                } else {
                    // Hide other components
                    if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
                        hideComponent(componentId);
                    }
                    
                    const registeredComponent = registeredComponents.get(componentId);
                    if (registeredComponent) {
                        registeredComponent.hide();
                    }
                }
            });
            
            // Update tracking store
            componentTrackingStore.update(store => {
                const newStore = new Map(store);
                allComponents.forEach(componentId => {
                    newStore.set(componentId, componentId === targetComponentId);
                });
                return newStore;
            });
        },

        /**
         * Hides only the specified component and shows all others.
         */
        hideOnlyComponent: (targetComponentId: ComponentId): void => {
            const allComponents = [
                ...DEFAULT_MANUAL_COMPONENTS,
                ...Array.from(registeredComponents.keys())
            ];
            
            // Process all components
            allComponents.forEach(componentId => {
                if (componentId === targetComponentId) {
                    // Hide target component
                    if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
                        hideComponent(componentId);
                    }
                    
                    const registeredComponent = registeredComponents.get(componentId);
                    if (registeredComponent) {
                        registeredComponent.hide();
                    }
                } else {
                    // Show other components
                    if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
                        showComponent(componentId);
                    }
                    
                    const registeredComponent = registeredComponents.get(componentId);
                    if (registeredComponent) {
                        registeredComponent.show();
                    }
                }
            });
            
            // Update tracking store
            componentTrackingStore.update(store => {
                const newStore = new Map(store);
                allComponents.forEach(componentId => {
                    newStore.set(componentId, componentId !== targetComponentId);
                });
                return newStore;
            });
        },

        /**
         * Toggles the visibility of the specified component.
         */
        toggleComponent: (targetComponentId: ComponentId): void => {
            let currentState = false;
            componentTrackingStore.subscribe(store => {
                currentState = store.get(targetComponentId) || false;
            })();
            
            if (currentState) {
                // If visible, hide only this component
                if (DEFAULT_MANUAL_COMPONENTS.includes(targetComponentId)) {
                    hideComponent(targetComponentId);
                }
                
                const registeredComponent = registeredComponents.get(targetComponentId);
                if (registeredComponent) {
                    registeredComponent.hide();
                }
                
                componentTrackingStore.update(store => {
                    const newStore = new Map(store);
                    newStore.set(targetComponentId, false);
                    return newStore;
                });
            } else {
                // If hidden, show only this component
                bookingMonitor.showOnlyComponent(targetComponentId);
            }
        },

        /**
         * Shows only the specified components and hides all others.
         */
        showOnlyComponents: (targetComponentIds: ComponentId[]): void => {
            const allComponents = [
                ...DEFAULT_MANUAL_COMPONENTS,
                ...Array.from(registeredComponents.keys())
            ];
            
            // Process all components
            allComponents.forEach(componentId => {
                const shouldShow = targetComponentIds.includes(componentId);
                
                if (shouldShow) {
                    // Show target components
                    if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
                        showComponent(componentId);
                    }
                    
                    const registeredComponent = registeredComponents.get(componentId);
                    if (registeredComponent) {
                        registeredComponent.show();
                    }
                } else {
                    // Hide other components
                    if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
                        hideComponent(componentId);
                    }
                    
                    const registeredComponent = registeredComponents.get(componentId);
                    if (registeredComponent) {
                        registeredComponent.hide();
                    }
                }
            });
            
            // Update tracking store
            componentTrackingStore.update(store => {
                const newStore = new Map(store);
                allComponents.forEach(componentId => {
                    newStore.set(componentId, targetComponentIds.includes(componentId));
                });
                return newStore;
            });
        },

        /**
         * Hides only the specified components and shows all others.
         */
        hideOnlyComponents: (targetComponentIds: ComponentId[]): void => {
            const allComponents = [
                ...DEFAULT_MANUAL_COMPONENTS,
                ...Array.from(registeredComponents.keys())
            ];
            
            // Process all components
            allComponents.forEach(componentId => {
                const shouldHide = targetComponentIds.includes(componentId);
                
                if (shouldHide) {
                    // Hide target components
                    if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
                        hideComponent(componentId);
                    }
                    
                    const registeredComponent = registeredComponents.get(componentId);
                    if (registeredComponent) {
                        registeredComponent.hide();
                    }
                } else {
                    // Show other components
                    if (DEFAULT_MANUAL_COMPONENTS.includes(componentId)) {
                        showComponent(componentId);
                    }
                    
                    const registeredComponent = registeredComponents.get(componentId);
                    if (registeredComponent) {
                        registeredComponent.show();
                    }
                }
            });
            
            // Update tracking store
            componentTrackingStore.update(store => {
                const newStore = new Map(store);
                allComponents.forEach(componentId => {
                    newStore.set(componentId, !targetComponentIds.includes(componentId));
                });
                return newStore;
            });
        },

        /**
         * Returns the component tracking store.
         */
        getComponentTrackingStore: (): Readable<Map<ComponentId, boolean>> => {
            return componentTrackingStore;
        },

        /**
         * Returns the registered component tracking store.
         */
        getRegisteredComponentTrackingStore: (): Readable<Map<ComponentId, boolean>> => {
            return registeredComponentTrackingStore;
        },

        /**
         * Checks if a component is currently visible.
         */
        isComponentCurrentlyVisible: (componentId: ComponentId): boolean => {
            let currentState = false;
            componentTrackingStore.subscribe(store => {
                currentState = store.get(componentId) || false;
            })();
            return currentState;
        },

        /**
         * Returns the visibility status of all components.
         */
        getAllComponentsVisibilityStatus: (): Record<ComponentId, boolean> => {
            let currentState: Record<ComponentId, boolean> = {} as Record<ComponentId, boolean>;
            componentTrackingStore.subscribe(store => {
                store.forEach((isVisible, componentId) => {
                    currentState[componentId] = isVisible;
                });
            })();
            return currentState;
        },

        /**
         * Returns the component visibility store.
         */
        getComponentVisibilityStore: (): Readable<Map<ComponentId, boolean>> => {
            return componentTrackingStore;
        },

        /**
         * Subscribes to component visibility changes.
         */
        subscribeToComponentVisibility: (
            componentId: ComponentId,
            callback: (isVisible: boolean) => void
        ): void => {
            const store = derived(componentTrackingStore, $store => {
                return $store.get(componentId) || false;
            });
            store.subscribe(callback);
        },

        /**
         * Subscribes to all components visibility changes.
         */
        subscribeToAllComponentsVisibility: (
            callback: (visibilityStatus: Record<ComponentId, boolean>) => void
        ): void => {
            componentTrackingStore.subscribe(store => {
                const visibilityStatus: Record<ComponentId, boolean> = {} as Record<ComponentId, boolean>;
                store.forEach((isVisible, componentId) => {
                    visibilityStatus[componentId] = isVisible;
                });
                callback(visibilityStatus);
            });
        },

        /**
         * Returns visibility statistics.
         */
        getVisibilityStatistics: (): {
            totalComponents: number;
            visibleComponents: number;
            hiddenComponents: number;
            visibilityPercentage: number;
            visibleComponentIds: ComponentId[];
            hiddenComponentIds: ComponentId[];
        } => {
            let stats = {
                totalComponents: 0,
                visibleComponents: 0,
                hiddenComponents: 0,
                visibilityPercentage: 0,
                visibleComponentIds: [] as ComponentId[],
                hiddenComponentIds: [] as ComponentId[]
            };
            
            componentTrackingStore.subscribe(store => {
                stats.totalComponents = store.size;
                stats.visibleComponents = 0;
                stats.visibleComponentIds = [];
                stats.hiddenComponentIds = [];
                
                store.forEach((isVisible, componentId) => {
                    if (isVisible) {
                        stats.visibleComponents++;
                        stats.visibleComponentIds.push(componentId);
                    } else {
                        stats.hiddenComponentIds.push(componentId);
                    }
                });
                
                stats.hiddenComponents = stats.totalComponents - stats.visibleComponents;
                stats.visibilityPercentage = stats.totalComponents > 0 
                    ? (stats.visibleComponents / stats.totalComponents) * 100 
                    : 0;
            })();
            
            return stats;
        },

        /**
         * Updates manual components tracking.
         */
        updateManualComponentsTracking: (
            componentIds: ComponentId[],
            isVisible: boolean
        ): void => {
            componentTrackingStore.update(store => {
                const newStore = new Map(store);
                componentIds.forEach(componentId => {
                    newStore.set(componentId, isVisible);
                });
                return newStore;
            });
        }
    };
}

// Create the booking monitor instance
export const bookingMonitor = createBookingMonitor();

// Export individual functions for convenience
export const showBookingComponents = bookingMonitor.callSection;
export const hideBookingComponents = bookingMonitor.exitSection;
export const registerBookingComponent = bookingMonitor.registeredComponents;
export const unregisterBookingComponent = bookingMonitor.unregisteredComponents;
export const getVisibleBookingComponents = bookingMonitor.getVisibleComponents;
export const isBookingComponentVisible = bookingMonitor.isComponentVisible;
export const monitorBookingComponent = bookingMonitor.monitorComponent;

// Exclusive visibility functions
export const showOnlyBookingComponent = bookingMonitor.showOnlyComponent;
export const hideOnlyBookingComponent = bookingMonitor.hideOnlyComponent;
export const toggleBookingComponent = bookingMonitor.toggleComponent;
export const showOnlyBookingComponents = bookingMonitor.showOnlyComponents;
export const hideOnlyBookingComponents = bookingMonitor.hideOnlyComponents;

// Tracking functions
export const getBookingComponentTrackingStore = bookingMonitor.getComponentTrackingStore;
export const getRegisteredBookingComponentTrackingStore = bookingMonitor.getRegisteredComponentTrackingStore;
export const isBookingComponentCurrentlyVisible = bookingMonitor.isComponentCurrentlyVisible;
export const getAllBookingComponentsVisibilityStatus = bookingMonitor.getAllComponentsVisibilityStatus;
export const getBookingComponentVisibilityStore = bookingMonitor.getComponentVisibilityStore;
export const subscribeToBookingComponentVisibility = bookingMonitor.subscribeToComponentVisibility;
export const subscribeToAllBookingComponentsVisibility = bookingMonitor.subscribeToAllComponentsVisibility;
export const getBookingVisibilityStatistics = bookingMonitor.getVisibilityStatistics;
export const updateBookingManualComponentsTracking = bookingMonitor.updateManualComponentsTracking;

/**
 * Get registered booking components
 * @returns Map of registered booking components
 */
export function getRegisteredBookingComponents(): Map<ComponentId, ReturnType<typeof createStateVisibility>> {
    return registeredComponents;
}