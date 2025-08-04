/**
 * Component Initialization System
 * 
 * This module handles the initial visibility state of components when the page first loads.
 * It provides a clean and maintainable way to configure which components should be visible
 * on initial page load, separate from section-specific component management.
 */

import { ComponentId } from "$lib/enums";
import { SectionId } from "$lib/enums";
import { showComponent, hideComponent, viewportVisibilityStore, unlockVisibility, lockVisibility, createStateVisibility, type ViewportPositionConfig } from "$lib/stores/viewport/visibility";
import { writable, type Readable } from "svelte/store";

// Registry for components registered with createStateVisibility
const registeredComponents = new Map<ComponentId, ReturnType<typeof createStateVisibility>>();

// Tracking store to monitor visibility status of all components
const componentTrackingStore = writable<Map<ComponentId, boolean>>(new Map());

// Tracking store for registered components
const registeredComponentTrackingStore = writable<Map<ComponentId, boolean>>(new Map());

// Manual components managed manually (not using createStateVisibility)
const manualComponents = [
    ComponentId.Navigation, 
    ComponentId.LanguageSwitch, 
    ComponentId.Schedule,
    ComponentId.Highlight,
    ComponentId.VideoPromotion,
    ComponentId.ChatBot,
    ComponentId.Operation,
    ComponentId.ScrollIndicator
];

/**
 * Configuration for initial component visibility
 */
export interface InitializationConfig {
    /** Components that should be visible on initial page load */
    initiallyVisible: ComponentId[];
    /** Components that should be hidden on initial page load */
    initiallyHidden: ComponentId[];
    /** The default section that should be active on page load */
    defaultSection: SectionId;
}

/**
 * Default initialization configuration
 * This defines which components are visible when the page first loads
 */
export const DEFAULT_INITIALIZATION_CONFIG: InitializationConfig = {
    // Components that should be visible on initial page load (Hero section)
    initiallyVisible: [
        ComponentId.LanguageSwitch,
    ],
    // Components that should be hidden on initial page load
    initiallyHidden: [
        ComponentId.Navigation,
        ComponentId.Schedule,
        ComponentId.Highlight,
        ComponentId.VideoPromotion,
        ComponentId.ChatBot,
        ComponentId.Operation,
        ComponentId.ScrollIndicator,
    ],
    // Default section (Hero section)
    defaultSection: SectionId.Hero
};

/**
 * Store to track initialization status
 */
const initializationStore = writable<{
    isInitialized: boolean;
    initializedAt: Date | null;
    config: InitializationConfig;
}>({
    isInitialized: false,
    initializedAt: null,
    config: DEFAULT_INITIALIZATION_CONFIG
});

/**
 * Initialize component visibility for first page load
 * This function should be called once when the page loads
 * 
 * @param config - Optional custom initialization configuration
 * @returns Promise that resolves when initialization is complete
 */
export async function initializeComponentVisibility(
    config: InitializationConfig = DEFAULT_INITIALIZATION_CONFIG
): Promise<void> {
    try {
        // Wait longer for all components to register themselves
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Debug: Check what components are currently registered
        const registeredComponents = viewportVisibilityStore.activeComponents;
        registeredComponents.subscribe(components => {
            console.log('🔍 Currently registered components:', components);
        })();
        
        // First, unlock all components to ensure we can control them
        console.log('🔓 Unlocking all components for initialization...');
        unlockVisibility(); // Unlock all components
        
        // Hide all components first to ensure clean state
        hideAllComponents();
        
        // Then show only the initially visible components
        if (config.initiallyVisible.length > 0) {
            showComponents(config.initiallyVisible);
        }
        
        // Re-lock the LanguageSwitch to be visible if it's in the visible list
        if (config.initiallyVisible.includes(ComponentId.LanguageSwitch)) {
            console.log('🔒 Locking LanguageSwitch to visible...');
            lockVisibility(ComponentId.LanguageSwitch, true);
        }
        
        // Update initialization store
        initializationStore.set({
            isInitialized: true,
            initializedAt: new Date(),
            config
        });
        
        console.log('✅ Component initialization completed successfully');
        console.log(`📍 Default section: ${config.defaultSection}`);
        
    } catch (error) {
        console.error('❌ Error during component initialization:', error);
        throw error;
    }
}

/**
 * Reset all components to their initial state
 * Useful for testing or when you need to restart the application state
 */
export function resetToInitialState(): void {
    const currentConfig = getCurrentConfig();
    initializeComponentVisibility(currentConfig);
}

/**
 * Get the current initialization configuration
 */
export function getCurrentConfig(): InitializationConfig {
    let currentConfig = DEFAULT_INITIALIZATION_CONFIG;
    
    initializationStore.subscribe(state => {
        currentConfig = state.config;
    })();
    
    return currentConfig;
}

/**
 * Check if the system has been initialized
 */
export function isInitialized(): boolean {
    let initialized = false;
    
    initializationStore.subscribe(state => {
        initialized = state.isInitialized;
    })();
    
    return initialized;
}

/**
 * Get initialization status as a readable store
 */
export function getInitializationStore(): Readable<{
    isInitialized: boolean;
    initializedAt: Date | null;
    config: InitializationConfig;
}> {
    return initializationStore;
}

/**
 * Create a custom initialization configuration
 * Helper function to create configuration objects with validation
 */
export function createInitializationConfig(options: {
    visible?: ComponentId[];
    hidden?: ComponentId[];
    defaultSection?: SectionId;
}): InitializationConfig {
    const allComponents = Object.values(ComponentId);
    
    // Validate that visible and hidden don't overlap
    const visible = options.visible || DEFAULT_INITIALIZATION_CONFIG.initiallyVisible;
    const hidden = options.hidden || DEFAULT_INITIALIZATION_CONFIG.initiallyHidden;
    
    const overlap = visible.filter(component => hidden.includes(component));
    if (overlap.length > 0) {
        console.warn('⚠️ Components cannot be both visible and hidden:', overlap);
    }
    
    return {
        initiallyVisible: visible,
        initiallyHidden: hidden,
        defaultSection: options.defaultSection || DEFAULT_INITIALIZATION_CONFIG.defaultSection
    };
}

/**
 * Predefined configurations for different scenarios
 */
export const INITIALIZATION_PRESETS = {
    /**
     * Minimal UI - Only essential components visible
     */
    MINIMAL: createInitializationConfig({
        visible: [ComponentId.Navigation, ComponentId.LanguageSwitch],
        hidden: [
            ComponentId.Schedule,
            ComponentId.Highlight,
            ComponentId.VideoPromotion,
            ComponentId.ChatBot,
            ComponentId.Operation,
            ComponentId.ScrollIndicator
        ]
    }),
    
    /**
     * Full UI - All components visible (for testing)
     */
    FULL: createInitializationConfig({
        visible: Object.values(ComponentId),
        hidden: []
    }),
    
    /**
     * Hero focused - Components suitable for hero section
     */
    HERO_FOCUSED: createInitializationConfig({
        visible: [
            ComponentId.Navigation,
            ComponentId.LanguageSwitch,
            ComponentId.ScrollIndicator
        ],
        hidden: [
            ComponentId.Schedule,
            ComponentId.Highlight,
            ComponentId.VideoPromotion,
            ComponentId.ChatBot,
            ComponentId.Operation
        ]
    }),
    
    /**
     * Development mode - All components visible for debugging
     */
    DEVELOPMENT: createInitializationConfig({
        visible: Object.values(ComponentId),
        hidden: [],
        defaultSection: SectionId.Hero
    })
};

/**
 * Initialize with a preset configuration
 */
export async function initializeWithPreset(
    presetName: keyof typeof INITIALIZATION_PRESETS
): Promise<void> {
    const preset = INITIALIZATION_PRESETS[presetName];
    console.log(`🎯 Initializing with preset: ${presetName}`);
    return initializeComponentVisibility(preset);
}

/**
 * Get all available component IDs
 */
export function getAllComponentIds(): ComponentId[] {
    return Object.values(ComponentId);
}

/**
 * Get initialization statistics
 */
export function getInitializationStats(): {
    totalComponents: number;
    visibleComponents: number;
    hiddenComponents: number;
    initializationTime: Date | null;
} {
    const allComponents = getAllComponentIds();
    const config = getCurrentConfig();
    
    let initTime: Date | null = null;
    initializationStore.subscribe(state => {
        initTime = state.initializedAt;
    })();
    
    return {
        totalComponents: allComponents.length,
        visibleComponents: config.initiallyVisible.length,
        hiddenComponents: config.initiallyHidden.length,
        initializationTime: initTime
    };
}

/**
 * Development helper function to quickly switch initialization modes
 * This can be called from browser console for testing different configurations
 */
export function switchInitializationMode(mode: 'minimal' | 'hero' | 'full' | 'default' = 'default'): void {
    console.log(`🔄 Switching to ${mode} initialization mode...`);
    
    switch (mode) {
        case 'minimal':
            initializeComponentVisibility(INITIALIZATION_PRESETS.MINIMAL);
            break;
        case 'hero':
            initializeComponentVisibility(INITIALIZATION_PRESETS.HERO_FOCUSED);
            break;
        case 'full':
            initializeComponentVisibility(INITIALIZATION_PRESETS.FULL);
            break;
        case 'default':
        default:
            initializeComponentVisibility(DEFAULT_INITIALIZATION_CONFIG);
            break;
    }
}

/**
 * Component Management Functions
 * Similar to footer implementation for handling both manual and registered components
 */

/**
 * Registers a component for initialization monitoring.
 */
export function registerComponent(
    componentId: ComponentId,
    config?: Partial<ViewportPositionConfig>
): ReturnType<typeof createStateVisibility> {
    // Default config for initialization
    const defaultConfig: Partial<ViewportPositionConfig> = {
        hideDelay: 1500,
        initialVisible: false,
        ...config
    };

    const visibility = createStateVisibility(componentId.toString(), defaultConfig);
    registeredComponents.set(componentId, visibility);
    
    // Setup tracking for this component
    visibility.isDisplay.subscribe(isVisible => {
        registeredComponentTrackingStore.update(store => {
            const newStore = new Map(store);
            newStore.set(componentId, isVisible);
            return newStore;
        });
        
        // Update general tracking store as well
        componentTrackingStore.update(store => {
            const newStore = new Map(store);
            newStore.set(componentId, isVisible);
            return newStore;
        });
    });
    
    return visibility;
}

/**
 * Unregisters a component from initialization monitoring.
 */
export function unregisterComponent(componentId: ComponentId): void {
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
}

/**
 * Returns the visibility state of a component.
 */
export function getComponentVisibility(componentId: ComponentId): boolean {
    let currentState = false;
    componentTrackingStore.subscribe(store => {
        currentState = store.get(componentId) || false;
    })();
    return currentState;
}

/**
 * Returns the visibility state of all components.
 */
export function getAllComponentsVisibility(): Record<ComponentId, boolean> {
    let currentState: Record<ComponentId, boolean> = {} as Record<ComponentId, boolean>;
    componentTrackingStore.subscribe(store => {
        store.forEach((isVisible, componentId) => {
            currentState[componentId] = isVisible;
        });
    })();
    return currentState;
}

/**
 * Shows all registered components.
 */
export function showRegisteredComponents(): void {
    registeredComponents.forEach((visibility) => {
        visibility.show();
    });
}

/**
 * Hides all registered components.
 */
export function hideRegisteredComponents(): void {
    registeredComponents.forEach((visibility) => {
        visibility.hide();
    });
}

/**
 * Shows all components (manual + registered).
 */
export function showAllComponents(): void {
    console.log('👁️ Showing all components (manual + registered)...');
    
    // Handle manual components
    manualComponents.forEach(componentId => {
        showComponent(componentId);
        // Update tracking store
        componentTrackingStore.update(store => {
            const newStore = new Map(store);
            newStore.set(componentId, true);
            return newStore;
        });
    });
    
    // Handle registered components
    registeredComponents.forEach((visibility) => {
        visibility.show();
    });
}

/**
 * Hides all components (manual + registered).
 */
export function hideAllComponents(): void {
    console.log('🙈 Hiding all components (manual + registered)...');
    
    // Handle manual components
    manualComponents.forEach(componentId => {
        console.log('hide all component', componentId);
        hideComponent(componentId);
        // Update tracking store
        componentTrackingStore.update(store => {
            const newStore = new Map(store);
            newStore.set(componentId, false);
            return newStore;
        });
    });
    
    // Handle registered components
    registeredComponents.forEach((visibility) => {
        visibility.hide();
    });
}

/**
 * Shows only the specified component and hides all others.
 */
export function showOnlyComponent(targetComponentId: ComponentId): void {
    console.log(`👁️ Showing only component: ${targetComponentId}`);
    
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
}

/**
 * Hides only the specified component and shows all others.
 */
export function hideOnlyComponent(targetComponentId: ComponentId): void {
    console.log(`🙈 Hiding only component: ${targetComponentId}`);
    
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
}

/**
 * Toggles the visibility of the specified component.
 */
export function toggleComponent(targetComponentId: ComponentId): void {
    let currentState = false;
    componentTrackingStore.subscribe(store => {
        currentState = store.get(targetComponentId) || false;
    })();
    
    console.log(`🔄 Toggling component ${targetComponentId} (currently ${currentState ? 'visible' : 'hidden'})`);
    
    if (currentState) {
        // If visible, hide only this component
        if (manualComponents.includes(targetComponentId)) {
            hideComponent(targetComponentId);
        }
        
        const registeredComponent = registeredComponents.get(targetComponentId);
        if (registeredComponent) {
            registeredComponent.hide();
        }
        
        // Update tracking store
        componentTrackingStore.update(store => {
            const newStore = new Map(store);
            newStore.set(targetComponentId, false);
            return newStore;
        });
    } else {
        // If hidden, show only this component
        if (manualComponents.includes(targetComponentId)) {
            showComponent(targetComponentId);
        }
        
        const registeredComponent = registeredComponents.get(targetComponentId);
        if (registeredComponent) {
            registeredComponent.show();
        }
        
        // Update tracking store
        componentTrackingStore.update(store => {
            const newStore = new Map(store);
            newStore.set(targetComponentId, true);
            return newStore;
        });
    }
}

/**
 * Shows specific components from a list.
 */
export function showComponents(componentIds: ComponentId[]): void {
    console.log('👁️ Showing specific components:', componentIds);
    
    componentIds.forEach(componentId => {
        // Handle manual components
        if (manualComponents.includes(componentId)) {
            showComponent(componentId);
        }
        
        // Handle registered components
        const registeredComponent = registeredComponents.get(componentId);
        if (registeredComponent) {
            registeredComponent.show();
        }
        
        // Update tracking store
        componentTrackingStore.update(store => {
            const newStore = new Map(store);
            newStore.set(componentId, true);
            return newStore;
        });
    });
}

/**
 * Hides specific components from a list.
 */
export function hideComponents(componentIds: ComponentId[]): void {
    console.log('🙈 Hiding specific components:', componentIds);
    
    componentIds.forEach(componentId => {
        // Handle manual components
        if (manualComponents.includes(componentId)) {
            hideComponent(componentId);
        }
        
        // Handle registered components
        const registeredComponent = registeredComponents.get(componentId);
        if (registeredComponent) {
            registeredComponent.hide();
        }
        
        // Update tracking store
        componentTrackingStore.update(store => {
            const newStore = new Map(store);
            newStore.set(componentId, false);
            return newStore;
        });
    });
}

/**
 * Returns list of currently visible components.
 */
export function getVisibleComponents(): ComponentId[] {
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
}

/**
 * Returns list of currently hidden components.
 */
export function getHiddenComponents(): ComponentId[] {
    const allComponents = [...manualComponents, ...Array.from(registeredComponents.keys())];
    const visibleComponents = getVisibleComponents();
    return allComponents.filter(componentId => !visibleComponents.includes(componentId));
}

/**
 * Checks if a component is currently visible.
 */
export function isComponentVisible(componentId: ComponentId): boolean {
    let currentState = false;
    componentTrackingStore.subscribe(store => {
        currentState = store.get(componentId) || false;
    })();
    return currentState;
}

/**
 * Get component tracking store as readable store.
 */
export function getComponentTrackingStore(): Readable<Map<ComponentId, boolean>> {
    return componentTrackingStore;
}

// Make the function available globally for development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
    (window as any).switchInitializationMode = switchInitializationMode;
    (window as any).showAllComponents = showAllComponents;
    (window as any).hideAllComponents = hideAllComponents;
    (window as any).showOnlyComponent = showOnlyComponent;
    (window as any).hideOnlyComponent = hideOnlyComponent;
    (window as any).toggleComponent = toggleComponent;
    (window as any).showComponents = showComponents;
    (window as any).hideComponents = hideComponents;
    (window as any).getVisibleComponents = getVisibleComponents;
    (window as any).getHiddenComponents = getHiddenComponents;
}