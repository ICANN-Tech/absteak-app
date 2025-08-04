/**
 * Footer section monitoring utility
 * Implements MonitorModule interface for footer section component visibility management
 */

import { ComponentId } from '$lib/enums';
import { showComponent, hideComponent, createStateVisibility, type ViewportPositionConfig } from '$lib/stores/viewport/visibility';
import { writable, derived, type Readable } from 'svelte/store';
import type { MonitorSectionModule } from './index';
import { handleSectionCall, handleSectionExit, type SectionConfig } from './base';

// Registry untuk komponen yang terdaftar dengan createStateVisibility
const registeredComponents = new Map<ComponentId, ReturnType<typeof createStateVisibility>>();

// Tracking store untuk memantau status visibility semua components
const componentTrackingStore = writable<Map<ComponentId, boolean>>(new Map());

// Tracking store untuk registered components
const registeredComponentTrackingStore = writable<Map<ComponentId, boolean>>(new Map());

// Manual components yang dikelola secara manual (tidak menggunakan createStateVisibility)
const manualComponents = [ComponentId.Navigation, ComponentId.LanguageSwitch, ComponentId.Schedule];

// Footer-specific section configuration
const footerSectionConfig: SectionConfig = {
    hideOnCall: [
        ComponentId.Navigation,
        ComponentId.Schedule,
        ComponentId.Highlight,
        ComponentId.VideoPromotion,
        ComponentId.Operation
    ],
    showOnCall: [ComponentId.LanguageSwitch, ComponentId.BackToTop, ComponentId.ChatBot],
    showOnExit: [],
    hideOnExit: [ComponentId.BackToTop],
    manualComponents: [
        ComponentId.Navigation,
        ComponentId.LanguageSwitch,
        ComponentId.Schedule,
        ComponentId.Highlight,
        ComponentId.VideoPromotion,
        ComponentId.ChatBot,
        ComponentId.Operation,
        ComponentId.ScrollIndicator,
    ]
};

/**
 * Creates the footer monitor module
 * @returns MonitorModule implementation for footer section
 */
export function createFooterMonitor(): MonitorSectionModule {
    return {
        /**
         * Registers a component for viewport monitoring.
         */
        registeredComponents: (
            componentId: ComponentId,
            config?: Partial<ViewportPositionConfig>
        ): ReturnType<typeof createStateVisibility> => {
            // Default config untuk footer section
            const defaultConfig: Partial<ViewportPositionConfig> = {
                hideDelay: 1500,
                initialVisible: false,
                ...config
            };

            const visibility = createStateVisibility(componentId.toString(), defaultConfig);
            registeredComponents.set(componentId, visibility);
            
            // Setup tracking untuk component ini
            visibility.isDisplay.subscribe(isVisible => {
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
            // Use reusable base function for manual components
            handleSectionCall(footerSectionConfig, componentTrackingStore);
            
            // Explicitly force hide the Highlight component and lock it to prevent resetComponentVisibility from showing it
            import('$lib/stores/viewport/visibility').then(({ setComponentVisibility, lockVisibility }) => {
                import('$lib/enums').then(({ ComponentId }) => {
                    setComponentVisibility(ComponentId.Highlight, false);
                    lockVisibility(ComponentId.Highlight, false); // Lock it to hidden state
                });
            });
            
            // Handle registered components
            registeredComponents.forEach((visibility) => {
                visibility.hide();
            });
        },

        /**
         * Hides all components (manual + registered).
         */
        exitSection: (): void => {
            // Use reusable base function for manual components
            handleSectionExit(footerSectionConfig, componentTrackingStore);
            
            // Unlock and reset the Highlight component to use normal visibility logic when leaving footer
            import('$lib/stores/viewport/visibility').then(({ resetComponentVisibility, unlockVisibility }) => {
                import('$lib/enums').then(({ ComponentId }) => {
                    unlockVisibility(ComponentId.Highlight); // Unlock first
                    resetComponentVisibility(ComponentId.Highlight); // Then reset
                });
            });
            
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
            const isCurrentlyVisible = componentTrackingStore.subscribe(store => {
                return store.get(componentId) || false;
            });
            
            let shouldBeVisible = false;
            isCurrentlyVisible();
            
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
                ...manualComponents,
                ...Array.from(registeredComponents.keys())
            ];
            
            // Process all components
            allComponents.forEach(componentId => {
                if (componentId === targetComponentId) {
                    // Show target component
                    if (manualComponents.includes(componentId)) {
                        showComponent(componentId);
                    }
                    
                    const registeredComponent = registeredComponents.get(componentId);
                    if (registeredComponent) {
                        registeredComponent.show();
                    }
                } else {
                    // Hide other components
                    if (manualComponents.includes(componentId)) {
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
                ...manualComponents,
                ...Array.from(registeredComponents.keys())
            ];
            
            // Process all components
            allComponents.forEach(componentId => {
                if (componentId === targetComponentId) {
                    // Hide target component
                    if (manualComponents.includes(componentId)) {
                        hideComponent(componentId);
                    }
                    
                    const registeredComponent = registeredComponents.get(componentId);
                    if (registeredComponent) {
                        registeredComponent.hide();
                    }
                } else {
                    // Show other components
                    if (manualComponents.includes(componentId)) {
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
                if (manualComponents.includes(targetComponentId)) {
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
                footerMonitor.showOnlyComponent(targetComponentId);
            }
        },

        /**
         * Shows only the specified components and hides all others.
         */
        showOnlyComponents: (targetComponentIds: ComponentId[]): void => {
            const allComponents = [
                ...manualComponents,
                ...Array.from(registeredComponents.keys())
            ];
            
            // Process all components
            allComponents.forEach(componentId => {
                const shouldShow = targetComponentIds.includes(componentId);
                
                if (shouldShow) {
                    // Show target components
                    if (manualComponents.includes(componentId)) {
                        showComponent(componentId);
                    }
                    
                    const registeredComponent = registeredComponents.get(componentId);
                    if (registeredComponent) {
                        registeredComponent.show();
                    }
                } else {
                    // Hide other components
                    if (manualComponents.includes(componentId)) {
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
                ...manualComponents,
                ...Array.from(registeredComponents.keys())
            ];
            
            // Process all components
            allComponents.forEach(componentId => {
                const shouldHide = targetComponentIds.includes(componentId);
                
                if (shouldHide) {
                    // Hide target components
                    if (manualComponents.includes(componentId)) {
                        hideComponent(componentId);
                    }
                    
                    const registeredComponent = registeredComponents.get(componentId);
                    if (registeredComponent) {
                        registeredComponent.hide();
                    }
                } else {
                    // Show other components
                    if (manualComponents.includes(componentId)) {
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

// Create the footer monitor instance
export const footerMonitor = createFooterMonitor();

// Export individual functions for convenience
export const showFooterComponents = footerMonitor.callSection;
export const hideFooterComponents = footerMonitor.exitSection;
export const registerFooterComponent = footerMonitor.registeredComponents;
export const unregisterFooterComponent = footerMonitor.unregisteredComponents;
export const getVisibleFooterComponents = footerMonitor.getVisibleComponents;
export const isFooterComponentVisible = footerMonitor.isComponentVisible;
export const monitorFooterComponent = footerMonitor.monitorComponent;

// Exclusive visibility functions
export const showOnlyFooterComponent = footerMonitor.showOnlyComponent;
export const hideOnlyFooterComponent = footerMonitor.hideOnlyComponent;
export const toggleFooterComponent = footerMonitor.toggleComponent;
export const showOnlyFooterComponents = footerMonitor.showOnlyComponents;
export const hideOnlyFooterComponents = footerMonitor.hideOnlyComponents;

// Tracking functions
export const getFooterComponentTrackingStore = footerMonitor.getComponentTrackingStore;
export const getRegisteredFooterComponentTrackingStore = footerMonitor.getRegisteredComponentTrackingStore;
export const isFooterComponentCurrentlyVisible = footerMonitor.isComponentCurrentlyVisible;
export const getAllFooterComponentsVisibilityStatus = footerMonitor.getAllComponentsVisibilityStatus;
export const getFooterComponentVisibilityStore = footerMonitor.getComponentVisibilityStore;
export const subscribeToFooterComponentVisibility = footerMonitor.subscribeToComponentVisibility;
export const subscribeToAllFooterComponentsVisibility = footerMonitor.subscribeToAllComponentsVisibility;
export const getFooterVisibilityStatistics = footerMonitor.getVisibilityStatistics;
export const updateFooterManualComponentsTracking = footerMonitor.updateManualComponentsTracking;

/**
 * Get registered footer components
 * @returns Map of registered footer components
 */
export function getRegisteredFooterComponents(): Map<ComponentId, ReturnType<typeof createStateVisibility>> {
    return registeredComponents;
}