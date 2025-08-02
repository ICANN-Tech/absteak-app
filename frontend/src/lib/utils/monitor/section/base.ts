import { ComponentId, SectionId } from "$lib/enums";
import { hideComponent, showComponent } from "$lib/stores/viewport/visibility";
import { hideComponentRespectingInteraction } from "$lib/utils/monitor/component";
import { writable, type Writable, type Readable } from "svelte/store";

/**
 * Configuration for section behavior
 */
export interface SectionConfig {
    /** Components to hide when section is called */
    hideOnCall?: ComponentId[];
    /** Components to show when section is called */
    showOnCall?: ComponentId[];
    /** Components to show when section exits */
    showOnExit?: ComponentId[];
    /** Components to hide when section exits */
    hideOnExit?: ComponentId[];
    /** All manual components managed by the section */
    manualComponents?: ComponentId[];
}

export const DEFAULT_MANUAL_COMPONENTS: ComponentId[] = [
        ComponentId.Navigation,
        ComponentId.Schedule,
        ComponentId.Highlight,
        ComponentId.LanguageSwitch,
        ComponentId.VideoPromotion,
        ComponentId.ChatBot,
        ComponentId.Operation
];

/**
 * Default section configuration
 * By default, hide all components except LanguageSwitch when section is called
 * and show all components when section exits
 */
export const DEFAULT_SECTION_CONFIG: SectionConfig = {
    hideOnCall: [
        ComponentId.ScrollIndicator,
        ComponentId.BackToTop
    ],
    showOnCall: [
        ComponentId.Navigation,
        ComponentId.Schedule,
        ComponentId.Highlight,
        ComponentId.LanguageSwitch,
        ComponentId.VideoPromotion,
        ComponentId.ChatBot,
        ComponentId.Operation
    ],
    showOnExit: [],
    hideOnExit: [
        ComponentId.ScrollIndicator,
        ComponentId.BackToTop
    ],
    manualComponents: DEFAULT_MANUAL_COMPONENTS
};

// Shared configuration for sections that show all components on call and hide all on exit
// Used by: experience, chef, menu, reservation sections
export const SHOW_ALL_ON_CALL_CONFIG: SectionConfig = {
    hideOnCall: [], // Don't hide any components when section is called
    showOnCall: [
        ComponentId.Navigation,
        ComponentId.Schedule,
        ComponentId.Highlight,
        ComponentId.LanguageSwitch,
        ComponentId.VideoPromotion,
        ComponentId.ChatBot,
        ComponentId.Operation
    ],
    showOnExit: [], // Don't show any components when section exits
    hideOnExit: [
        ComponentId.Navigation,
        ComponentId.Schedule,
        ComponentId.Highlight,
        ComponentId.LanguageSwitch,
        ComponentId.VideoPromotion,
        ComponentId.ChatBot,
        ComponentId.Operation
    ],
    manualComponents: [
        ComponentId.Navigation,
        ComponentId.LanguageSwitch,
        ComponentId.Schedule
    ]
};

/**
 * Show all components by their IDs
 * @param componentIds - Array of component IDs to show
 */
export function showAllComponents(componentIds: ComponentId[]): void {
    componentIds.forEach(componentId => {
        showComponent(componentId);
    });
}

/**
 * Hide all components by their IDs
 * @param componentIds - Array of component IDs to hide
 */
export function hideAllComponents(componentIds: ComponentId[]): void {
    componentIds.forEach(componentId => {
        hideComponentRespectingInteraction(componentId);
    });
}

/**
 * Show only specific components and hide all others
 * @param showComponents - Array of component IDs to show
 * @param allComponents - Array of all available component IDs
 */
export function showOnlyComponents(
    showComponents: ComponentId[], 
    allComponents: ComponentId[]
): void {
    allComponents.forEach(componentId => {
        if (showComponents.includes(componentId)) {
            showComponent(componentId);
        } else {
            hideComponentRespectingInteraction(componentId);
        }
    });
}

/**
 * Hide only specific components and show all others
 * @param hideComponents - Array of component IDs to hide
 * @param allComponents - Array of all available component IDs
 */
export function hideOnlyComponents(
    hideComponents: ComponentId[], 
    allComponents: ComponentId[]
): void {
    allComponents.forEach(componentId => {
        if (hideComponents.includes(componentId)) {
            hideComponentRespectingInteraction(componentId);
        } else {
            showComponent(componentId);
        }
    });
}

/**
 * Handle section call behavior - typically hides all components except specific ones
 * @param config - Section configuration object
 * @param trackingStore - Optional tracking store to update component states
 */
export function handleSectionCall(
    config: SectionConfig = DEFAULT_SECTION_CONFIG,
    trackingStore?: Writable<Map<ComponentId, boolean>>
): void {
    // Hide components specified in hideOnCall
    if (config.hideOnCall && config.hideOnCall.length > 0) {
        hideAllComponents(config.hideOnCall);
        
        // Update tracking store if provided
        if (trackingStore) {
            trackingStore.update(store => {
                const newStore = new Map(store);
                config.hideOnCall!.forEach(componentId => {
                    newStore.set(componentId, false);
                });
                return newStore;
            });
        }
    }
    
    // Show components specified in showOnCall
    if (config.showOnCall && config.showOnCall.length > 0) {
        showAllComponents(config.showOnCall);
        
        // Update tracking store if provided
        if (trackingStore) {
            trackingStore.update(store => {
                const newStore = new Map(store);
                config.showOnCall!.forEach(componentId => {
                    newStore.set(componentId, true);
                });
                return newStore;
            });
        }
    }
}

/**
 * Handle section exit behavior - typically shows all components
 * @param config - Section configuration object
 * @param trackingStore - Optional tracking store to update component states
 */
export function handleSectionExit(
    config: SectionConfig = DEFAULT_SECTION_CONFIG,
    trackingStore?: Writable<Map<ComponentId, boolean>>
): void {
    // Show components specified in showOnExit
    if (config.showOnExit && config.showOnExit.length > 0) {
        showAllComponents(config.showOnExit);
        
        // Update tracking store if provided
        if (trackingStore) {
            trackingStore.update(store => {
                const newStore = new Map(store);
                config.showOnExit!.forEach(componentId => {
                    newStore.set(componentId, true);
                });
                return newStore;
            });
        }
    }
    
    // Hide components specified in hideOnExit
    if (config.hideOnExit && config.hideOnExit.length > 0) {
        hideAllComponents(config.hideOnExit);
        
        // Update tracking store if provided
        if (trackingStore) {
            trackingStore.update(store => {
                const newStore = new Map(store);
                config.hideOnExit!.forEach(componentId => {
                    newStore.set(componentId, false);
                });
                return newStore;
            });
        }
    }
}

/**
 * Update tracking store for manual components
 * @param componentIds - Array of component IDs to update
 * @param isVisible - Visibility state to set
 * @param trackingStore - Tracking store to update
 */
export function updateManualComponentsTracking(
    componentIds: ComponentId[],
    isVisible: boolean,
    trackingStore: Writable<Map<ComponentId, boolean>>
): void {
    trackingStore.update(store => {
        const newStore = new Map(store);
        componentIds.forEach(componentId => {
            newStore.set(componentId, isVisible);
        });
        return newStore;
    });
}

/**
 * Get current visibility state of a component from tracking store
 * @param componentId - Component ID to check
 * @param trackingStore - Tracking store to read from
 * @returns Current visibility state
 */
export function getComponentVisibilityFromStore(
    componentId: ComponentId,
    trackingStore: Readable<Map<ComponentId, boolean>>
): boolean {
    let currentState = false;
    trackingStore.subscribe(store => {
        currentState = store.get(componentId) || false;
    })();
    return currentState;
}

/**
 * Get all components visibility status from tracking store
 * @param trackingStore - Tracking store to read from
 * @returns Record of component IDs and their visibility states
 */
export function getAllComponentsVisibilityFromStore(
    trackingStore: Readable<Map<ComponentId, boolean>>
): Record<ComponentId, boolean> {
    let currentState: Record<ComponentId, boolean> = {} as Record<ComponentId, boolean>;
    trackingStore.subscribe(store => {
        store.forEach((isVisible, componentId) => {
            currentState[componentId] = isVisible;
        });
    })();
    return currentState;
}
