import type { ComponentId } from "$lib/enums";
import type { createStateVisibility } from "$lib/stores/viewport/visibility";
import type { ViewportPositionConfig } from "$lib/utils/viewport";
import type { Readable } from "svelte/store";

export interface MonitorSectionModule {
    /**
     * Registers a component for viewport monitoring.
     * @param componentId The unique ID of the component.
     * @param config Configuration for the viewport position.
     * Note: Default values for config should be handled in the *implementation*, not the interface.
     */
    registeredComponents: (
        componentId: ComponentId,
        // REMOVED THE DEFAULT VALUE HERE
        config?: Partial<ViewportPositionConfig> // Make it optional instead of giving a default
    ) => ReturnType<typeof createStateVisibility>;

    /**
     * Unregisters a component from viewport monitoring.
     * @param componentId The unique ID of the component.
     */
    unregisteredComponents: (componentId: ComponentId) => void;

    /**
     * Returns the visibility state of a component.
     * @param componentId The unique ID of the component.
     */
    getComponentVisibility: (componentId: ComponentId) => boolean;

    /**
     * Returns the visibility state of all components.
     */
    getAllComponentsVisibility: () => Record<ComponentId, boolean>;
    
    /**
     * Shows all registered components.
     */
    showRegisteredComponents: () => void;

    /**
     * Hides all registered components.
     */
    hideRegisteredComponents: () => void;

    /**
     * Toggles the visibility state of all registered components.
     */
    callSection: () => void;

    /**
     * Toggles the visibility state of all registered components.
     */
    exitSection: () => void;

    /**
     * Toggles the visibility state of all registered components.
     */
    getVisibleComponents: () => ComponentId[];

    /**
     * Returns the visibility state of all registered components.
     */
    isComponentVisible: (componentId: ComponentId) => boolean;

    /**
     * Returns the visibility state of all registered components.
     */
    monitorComponent: (componentId: ComponentId) => {
        shouldBeVisible: boolean,
        isInVisibleList: boolean,
    };

    /**
     * Returns the visibility state of all registered components.
     */
    showOnlyComponent: (targetComponentId: ComponentId) => void;

    /**
     * Returns the visibility state of all registered components.
     */
    hideOnlyComponent: (targetComponentId: ComponentId) => void;

    /**
     * Returns the visibility state of all registered components.
     */
    toggleComponent: (targetComponentId: ComponentId) => void;

    /**
     * Returns the visibility state of all registered components.
     */
    showOnlyComponents: (targetComponentIds: ComponentId[]) => void;

    /**
     * Returns the visibility state of all registered components.
     */
    hideOnlyComponents: (targetComponentIds: ComponentId[]) => void;

    /**
     * Returns the visibility state of all registered components.
     */
    getComponentTrackingStore: () => Readable<Map<ComponentId, boolean>>;

    /**
     * Returns the visibility state of all registered components.
     */
    getRegisteredComponentTrackingStore: () => Readable<Map<ComponentId, boolean>>;

    /**
     * Returns the visibility state of all registered components.
     */
    isComponentCurrentlyVisible: (componentId: ComponentId) => boolean;

    /**
     * Returns the visibility state of all registered components.
     */
    getAllComponentsVisibilityStatus: () => Record<ComponentId, boolean>;

    /**
     * Returns the visibility state of all registered components.
     */
    getComponentVisibilityStore: () => Readable<Map<ComponentId, boolean>>;

    /**
     * Returns the visibility state of all registered components.
     */
    subscribeToComponentVisibility: (
        componentId: ComponentId,
        callback: (isVisible: boolean) => void
    ) => void;

    /**
     * Returns the visibility state of all registered components.
     */
    subscribeToAllComponentsVisibility: (
        callback: (visibilityStatus: Record<ComponentId, boolean>) => void
    ) => void;

    /**
     * Returns the visibility state of all registered components.
     */
    getVisibilityStatistics: () => {
        totalComponents: number;
        visibleComponents: number;
        hiddenComponents: number;
        visibilityPercentage: number;
        visibleComponentIds: ComponentId[];
        hiddenComponentIds: ComponentId[];
    };
    
    /**
     * Returns the visibility state of all registered components.
     */
    updateManualComponentsTracking: (
        componentIds: ComponentId[],
        isVisible: boolean
    ) => void;
}

export * as experienceMonitor from "./experience"
export * as baseMonitor from "./base"
export * as initializeMonitor from "./initialize"