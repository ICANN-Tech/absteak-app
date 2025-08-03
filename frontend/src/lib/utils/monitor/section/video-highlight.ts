import { writable, derived, type Readable } from 'svelte/store';
import { ComponentId } from '$lib/enums';
import { createStateVisibility, showComponent, hideComponent, type ViewportPositionConfig } from '$lib/stores/viewport/visibility';
import type { MonitorSectionModule } from './index';
import { DEFAULT_MANUAL_COMPONENTS, DEFAULT_SECTION_CONFIG, handleSectionCall, handleSectionExit, type SectionConfig } from './base';

// Store untuk tracking registered components
const registeredComponents = new Map<ComponentId, ReturnType<typeof createStateVisibility>>();

// Store untuk tracking component visibility
const componentTrackingStore = writable<Map<ComponentId, boolean>>(new Map());
const registeredComponentTrackingStore = writable<Map<ComponentId, boolean>>(new Map());

/**
 * Creates the video highlight monitor module
 * @returns MonitorModule implementation for video highlight section
 */
export function createVideoHighlightMonitor(): MonitorSectionModule {
    return {
        /**
         * Registers a component for viewport monitoring.
         */
        registeredComponents: (
            componentId: ComponentId,
            config?: Partial<ViewportPositionConfig>
        ): ReturnType<typeof createStateVisibility> => {
            // Default config untuk video highlight section
            const defaultConfig: Partial<ViewportPositionConfig> = {
                hideDelay: 2000,
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
         * Shows components when entering video highlight section (all except ScrollIndicator and BackToTop).
         */
        callSection: (): void => {
            // Use reusable base function for manual components
            handleSectionCall(DEFAULT_SECTION_CONFIG, componentTrackingStore);
            
            // Handle registered components - show them when entering video highlight
            registeredComponents.forEach((visibility) => {
                visibility.show();
            });
        },

        /**
         * Shows all components when exiting video highlight section.
         */
        exitSection: (): void => {
            // Use reusable base function for manual components
            handleSectionExit(DEFAULT_SECTION_CONFIG, componentTrackingStore);
            
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
        monitorComponent(componentId: ComponentId): { shouldBeVisible: boolean; isInVisibleList: boolean } {
            const isVisible = this.isComponentVisible(componentId);
            const isInConfig = DEFAULT_SECTION_CONFIG.showOnCall?.includes(componentId) || false;
            return {
                shouldBeVisible: isVisible,
                isInVisibleList: isInConfig
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
                const shouldShow = componentId === targetComponentId;
                
                if (shouldShow) {
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
                const shouldHide = componentId === targetComponentId;
                
                if (shouldHide) {
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
         * Toggles the visibility of a component.
         */
        toggleComponent(componentId: ComponentId): void {
            const isCurrentlyVisible = this.isComponentVisible(componentId);
            
            if (isCurrentlyVisible) {
                this.hideOnlyComponent(componentId);
            } else {
                this.showOnlyComponent(componentId);
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

        // Additional interface methods
        getComponentTrackingStore: (): Readable<Map<ComponentId, boolean>> => componentTrackingStore,
        getRegisteredComponentTrackingStore: (): Readable<Map<ComponentId, boolean>> => registeredComponentTrackingStore,
        isComponentCurrentlyVisible: (componentId: ComponentId): boolean => {
            let currentState = false;
            componentTrackingStore.subscribe(store => {
                currentState = store.get(componentId) || false;
            })();
            return currentState;
        },
        getAllComponentsVisibilityStatus: (): Record<ComponentId, boolean> => {
            let currentState: Record<ComponentId, boolean> = {} as Record<ComponentId, boolean>;
            componentTrackingStore.subscribe(store => {
                store.forEach((isVisible, componentId) => {
                    currentState[componentId] = isVisible;
                });
            })();
            return currentState;
        },
        getComponentVisibilityStore: (): Readable<Map<ComponentId, boolean>> => componentTrackingStore,
        subscribeToComponentVisibility: (componentId: ComponentId, callback: (visible: boolean) => void): void => {
            const unsubscribe = componentTrackingStore.subscribe(store => {
                const isVisible = store.get(componentId) || false;
                callback(isVisible);
            });
            // Note: In a real implementation, you might want to return the unsubscribe function
            // but the interface expects void, so we don't return it
        },
        subscribeToAllComponentsVisibility: (callback: (visibilityStatus: Record<ComponentId, boolean>) => void): void => {
            componentTrackingStore.subscribe(store => {
                const record: Record<ComponentId, boolean> = {} as Record<ComponentId, boolean>;
                store.forEach((isVisible, componentId) => {
                    record[componentId] = isVisible;
                });
                callback(record);
            });
        },
        getVisibilityStatistics: () => {
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
        updateManualComponentsTracking: (componentIds: ComponentId[], isVisible: boolean): void => {
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

// Create the video highlight monitor instance
export const videoHighlightMonitor = createVideoHighlightMonitor();

// Backward compatibility exports
export function registerVideoHighlightComponent(
    componentId: ComponentId, 
    config: Partial<ViewportPositionConfig> = {}
): ReturnType<typeof createStateVisibility> {
    return videoHighlightMonitor.registeredComponents(componentId, config);
}

export function unregisterVideoHighlightComponent(componentId: ComponentId): void {
    return videoHighlightMonitor.unregisteredComponents(componentId);
}

export function getRegisteredVideoHighlightComponents(): ComponentId[] {
    return Array.from(registeredComponents.keys());
}

export function getRegisteredVideoHighlightComponentsMap(): Map<ComponentId, ReturnType<typeof createStateVisibility>> {
    return new Map(registeredComponents);
}

export function showRegisteredVideoHighlightComponents(): void {
    return videoHighlightMonitor.showRegisteredComponents();
}

export function hideRegisteredVideoHighlightComponents(): void {
    return videoHighlightMonitor.hideRegisteredComponents();
}

export function showVideoHighlightComponents(componentIds: ComponentId[] = []): void {
    if (componentIds.length === 0) {
        // If no specific components provided, call the section to show default components
        videoHighlightMonitor.callSection();
    } else {
        // Show only the specified components
        componentIds.forEach(id => videoHighlightMonitor.showOnlyComponent(id));
    }
}

export function hideVideoHighlightComponents(componentIds: ComponentId[] = []): void {
    if (componentIds.length === 0) {
        // If no specific components provided, call the section exit to restore default state
        videoHighlightMonitor.exitSection();
    } else {
        // Hide only the specified components
        componentIds.forEach(id => videoHighlightMonitor.hideOnlyComponent(id));
    }
}

export function getVideoHighlightVisibleComponents(): ComponentId[] {
    return videoHighlightMonitor.getVisibleComponents();
}

export function isComponentVisibleInVideoHighlight(componentId: ComponentId): boolean {
    return videoHighlightMonitor.isComponentVisible(componentId);
}

export function monitorVideoHighlightComponent(
    componentId: ComponentId,
    config?: Partial<ViewportPositionConfig>
): ReturnType<typeof createStateVisibility> {
    return videoHighlightMonitor.registeredComponents(componentId, config);
}

// Additional backward compatibility exports
export const getAllComponentsVisibilityStatus = () => videoHighlightMonitor.getAllComponentsVisibilityStatus();
export const getComponentTrackingStore = () => videoHighlightMonitor.getComponentTrackingStore();
export const getRegisteredComponentTrackingStore = () => videoHighlightMonitor.getRegisteredComponentTrackingStore();
export const isComponentCurrentlyVisible = (componentId: ComponentId) => videoHighlightMonitor.isComponentCurrentlyVisible(componentId);
export const getComponentVisibilityStore = () => videoHighlightMonitor.getComponentVisibilityStore();
export const subscribeToComponentVisibility = (componentId: ComponentId, callback: (visible: boolean) => void) => videoHighlightMonitor.subscribeToComponentVisibility(componentId, callback);
export const subscribeToAllComponentsVisibility = (callback: (visibilityStatus: Record<ComponentId, boolean>) => void) => videoHighlightMonitor.subscribeToAllComponentsVisibility(callback);
export const getVisibilityStatistics = () => videoHighlightMonitor.getVisibilityStatistics();
export const updateManualComponentsTracking = (componentIds: ComponentId[], isVisible: boolean) => videoHighlightMonitor.updateManualComponentsTracking(componentIds, isVisible);

// Exclusive visibility functions
export const showOnlyVideoHighlightComponent = (componentId: ComponentId) => videoHighlightMonitor.showOnlyComponent(componentId);
export const hideOnlyVideoHighlightComponent = (componentId: ComponentId) => videoHighlightMonitor.hideOnlyComponent(componentId);
export const toggleVideoHighlightComponent = (componentId: ComponentId) => videoHighlightMonitor.toggleComponent(componentId);
export const showOnlyVideoHighlightComponents = (componentIds: ComponentId[]) => videoHighlightMonitor.showOnlyComponents(componentIds);
export const hideOnlyVideoHighlightComponents = (componentIds: ComponentId[]) => videoHighlightMonitor.hideOnlyComponents(componentIds);

// Call and exit functions
export const callVideoHighlightSection = () => videoHighlightMonitor.callSection();
export const exitVideoHighlightSection = () => videoHighlightMonitor.exitSection();
