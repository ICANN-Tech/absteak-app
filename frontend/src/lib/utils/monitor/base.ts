/**
 * Main section monitoring utility
 * 
 * @param options 
 * @param options.onSectionChange - Callback function when section changes
 * @param options.enableVisibilityControl - Enable visibility control
 */

import { viewportStore, viewportState } from '$lib/stores/viewport/viewport';
import { get } from 'svelte/store';
import { SectionId, ComponentId } from '$lib/enums';
import { createStateVisibility, type ViewportPositionConfig } from '$lib/stores/viewport/visibility';
import { 
    showVideoHighlightComponents, 
    hideVideoHighlightComponents,
    getVideoHighlightVisibleComponents,
    isComponentVisibleInVideoHighlight,
    monitorVideoHighlightComponent,
    registerVideoHighlightComponent,
    unregisterVideoHighlightComponent,
    getRegisteredVideoHighlightComponents,
    getRegisteredVideoHighlightComponentsMap,
    // Exclusive visibility functions
    showOnlyVideoHighlightComponent,
    hideOnlyVideoHighlightComponent,
    toggleVideoHighlightComponent,
    showOnlyVideoHighlightComponents,
    // Tracking functions
    getComponentTrackingStore,
    getRegisteredComponentTrackingStore,
    isComponentCurrentlyVisible,
    getAllComponentsVisibilityStatus,
    getComponentVisibilityStore,
    subscribeToComponentVisibility,
    subscribeToAllComponentsVisibility,
    getVisibilityStatistics,
    updateManualComponentsTracking
} from './section/video-highlight';

import { 
    showHeroComponents, 
    hideHeroComponents,
    getHeroVisibleComponents,
    isComponentVisibleInHero,
    monitorHeroComponent,
    registerHeroComponent,
    unregisterHeroComponent,
    getRegisteredHeroComponents,
    // Exclusive visibility functions
    showOnlyHeroComponent,
    hideOnlyHeroComponent,
    toggleHeroComponent,
    showOnlyHeroComponents,
    // Tracking functions
    getComponentTrackingStore as getHeroComponentTrackingStore,
    getRegisteredComponentTrackingStore as getHeroRegisteredComponentTrackingStore,
    isComponentCurrentlyVisible as isHeroComponentCurrentlyVisible,
    getAllComponentsVisibilityStatus as getHeroAllComponentsVisibilityStatus,
    getComponentVisibilityStore as getHeroComponentVisibilityStore,
    subscribeToComponentVisibility as subscribeToHeroComponentVisibility,
    subscribeToAllComponentsVisibility as subscribeToHeroAllComponentsVisibility,
    getVisibilityStatistics as getHeroVisibilityStatistics,
    updateManualComponentsTracking as updateHeroManualComponentsTracking
} from './section/hero';

import { 
    showExperienceComponents,
    hideExperienceComponents,
    getVisibleExperienceComponents,
    isExperienceComponentVisible,
    monitorExperienceComponent,
    registerExperienceComponent,
    unregisterExperienceComponent,
    getRegisteredExperienceComponents,
    // Exclusive visibility functions
    showOnlyExperienceComponent,
    hideOnlyExperienceComponent,
    toggleExperienceComponent,
    showOnlyExperienceComponents,
    hideOnlyExperienceComponents,
    // Tracking functions
    getExperienceComponentTrackingStore,
    getRegisteredExperienceComponentTrackingStore,
    isExperienceComponentCurrentlyVisible,
    getAllExperienceComponentsVisibilityStatus,
    getExperienceComponentVisibilityStore,
    subscribeToExperienceComponentVisibility,
    subscribeToAllExperienceComponentsVisibility,
    getExperienceVisibilityStatistics,
    updateExperienceManualComponentsTracking
} from './section/experience';

import {
    showChefComponents,
    hideChefComponents,
    getVisibleChefComponents,
    isChefComponentVisible,
    monitorChefComponent,
    registerChefComponent,
    unregisterChefComponent,
    getRegisteredChefComponents,
    // Exclusive visibility functions
    showOnlyChefComponent,
    hideOnlyChefComponent,
    toggleChefComponent,
    showOnlyChefComponents,
    hideOnlyChefComponents,
    // Tracking functions
    getChefComponentTrackingStore,
    getRegisteredChefComponentTrackingStore,
    isChefComponentCurrentlyVisible,
    getAllChefComponentsVisibilityStatus,
    getChefComponentVisibilityStore,
    subscribeToChefComponentVisibility,
    subscribeToAllChefComponentsVisibility,
    getChefVisibilityStatistics,
    updateChefManualComponentsTracking
} from './section/chef';

import {
    showMenuComponents,
    hideMenuComponents,
    getVisibleMenuComponents,
    isMenuComponentVisible,
    monitorMenuComponent,
    registerMenuComponent,
    unregisterMenuComponent,
    getRegisteredMenuComponents,
    // Exclusive visibility functions
    showOnlyMenuComponent,
    hideOnlyMenuComponent,
    toggleMenuComponent,
    showOnlyMenuComponents,
    hideOnlyMenuComponents,
    // Tracking functions
    getMenuComponentTrackingStore,
    getRegisteredMenuComponentTrackingStore,
    isMenuComponentCurrentlyVisible,
    getAllMenuComponentsVisibilityStatus,
    getMenuComponentVisibilityStore,
    subscribeToMenuComponentVisibility,
    subscribeToAllMenuComponentsVisibility,
    getMenuVisibilityStatistics,
    updateMenuManualComponentsTracking
} from './section/menu';

import {
    showBookingComponents,
    hideBookingComponents,
    getVisibleBookingComponents,
    isBookingComponentVisible,
    monitorBookingComponent,
    registerBookingComponent,
    unregisterBookingComponent,
    getRegisteredBookingComponents,
    // Exclusive visibility functions
    showOnlyBookingComponent,
    hideOnlyBookingComponent,
    toggleBookingComponent,
    showOnlyBookingComponents,
    hideOnlyBookingComponents,
    // Tracking functions
    getBookingComponentTrackingStore,
    getRegisteredBookingComponentTrackingStore,
    isBookingComponentCurrentlyVisible,
    getAllBookingComponentsVisibilityStatus,
    getBookingComponentVisibilityStore,
    subscribeToBookingComponentVisibility,
    subscribeToAllBookingComponentsVisibility,
    getBookingVisibilityStatistics,
    updateBookingManualComponentsTracking
} from './section/reservation';

import {
    showFooterComponents,
    hideFooterComponents,
    getVisibleFooterComponents,
    isFooterComponentVisible,
    monitorFooterComponent,
    registerFooterComponent,
    unregisterFooterComponent,
    getRegisteredFooterComponents,
    // Exclusive visibility functions
    showOnlyFooterComponent,
    hideOnlyFooterComponent,
    toggleFooterComponent,
    showOnlyFooterComponents,
    hideOnlyFooterComponents,
    // Tracking functions
    getFooterComponentTrackingStore,
    getRegisteredFooterComponentTrackingStore,
    isFooterComponentCurrentlyVisible,
    getAllFooterComponentsVisibilityStatus,
    getFooterComponentVisibilityStore,
    subscribeToFooterComponentVisibility,
    subscribeToAllFooterComponentsVisibility,
    getFooterVisibilityStatistics,
    updateFooterManualComponentsTracking
} from './section/footer';

export interface SectionMonitorOptions {
    onSectionChange?: (section: SectionId, sectionIndex: number, previousSection: SectionId | null) => void;
    enableVisibilityControl?: boolean;
}

export interface ComponentRegistrationConfig {
    componentId: ComponentId;
    config?: Partial<ViewportPositionConfig>;
}

export class SectionMonitor {
    private options: SectionMonitorOptions;
    private unsubscribe?: () => void;
    private currentSection: SectionId | null = null;
    private subscribers: Map<string, (section: SectionId, previousSection: SectionId | null) => void> = new Map();

    constructor(options: SectionMonitorOptions = {}) {
        this.options = {
            enableVisibilityControl: true, // Default true untuk mengaktifkan video highlight visibility
            ...options
        };
    }

    /**
     * Start monitoring section changes
     */
    start(): void {
        if (this.unsubscribe) {
            this.stop(); // Stop existing monitoring
        }

        this.unsubscribe = viewportState.subscribe(state => {
            const currentSection = state.section.currentSection;

            if (currentSection && currentSection !== this.currentSection) {
                const previousSection = this.currentSection;
                this.currentSection = currentSection as SectionId;

                // Handle video highlight visibility
                if (this.options.enableVisibilityControl) {
                    this.handleVisibility(this.currentSection, previousSection);
                }

                // Notify all subscribers
                this.notifySubscribers(this.currentSection, previousSection);

                // Call custom callback if provided
                // Note: Section index is not available in the new state structure
                this.options.onSectionChange?.(this.currentSection, 0, previousSection);
            }
        });
    }

    /**
     * Stop monitoring section changes
     */
    stop(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = undefined;
            this.currentSection = null;
        }
    }

    /**
     * Handle video highlight visibility based on section change
     * @param currentSection - Current section ID
     * @param previousSection - Previous section ID
     */
    private handleVisibility(currentSection: SectionId, previousSection: SectionId | null): void {
        if (currentSection === SectionId.VideoHighlight) {
            showVideoHighlightComponents();
        } else if (previousSection === SectionId.VideoHighlight) {
            hideVideoHighlightComponents();
        }

        if (currentSection === SectionId.Hero) {
            showHeroComponents();
        } else if (previousSection === SectionId.Hero) {
            hideHeroComponents();
        }

        if (currentSection === SectionId.Experience) {
            showExperienceComponents();
        } else if (previousSection === SectionId.Experience) {
            hideExperienceComponents();
        }

        if (currentSection === SectionId.Chef) {
            showChefComponents();
        } else if (previousSection === SectionId.Chef) {
            hideChefComponents();
        }

        if (currentSection === SectionId.Menu) {
            showMenuComponents();
        } else if (previousSection === SectionId.Menu) {
            hideMenuComponents();
        }

        if (currentSection === SectionId.Booking) {
            showBookingComponents();
        } else if (previousSection === SectionId.Booking) {
            hideBookingComponents();
        }

        if (currentSection === SectionId.Footer) {
            showFooterComponents();
        } else if (previousSection === SectionId.Footer) {
            hideFooterComponents();
        }
    }

    /**
     * Subscribe to section changes
     * @param id - Unique identifier for the subscriber
     * @param callback - Callback function to be called when section changes
     */
    subscribe(id: string, callback: (section: SectionId, previousSection: SectionId | null) => void): void {
        this.subscribers.set(id, callback);
    }

    /**
     * Unsubscribe from section changes
     * @param id - Unique identifier for the subscriber
     */
    unsubscribeFromChanges(id: string): void {
        this.subscribers.delete(id);
    }

    /**
     * Notify all subscribers about section change
     * @param currentSection - Current section ID
     * @param previousSection - Previous section ID
     */
    private notifySubscribers(currentSection: SectionId, previousSection: SectionId | null): void {
        this.subscribers.forEach(callback => {
            callback(currentSection, previousSection);
        });
    }

    /**
     * Get the current section ID
     * @returns Current section ID
     */
    getCurrentSectionId(): SectionId | null {
        return this.currentSection;
    }

    /**
     * Update options for the SectionMonitor
     * @param newOptions - New options to update
     */
    updateOptions(newOptions: Partial<SectionMonitorOptions>): void {
        this.options = {
            ...this.options,
            ...newOptions
        };
    }

    /**
     * Check if the SectionMonitor is active
     * @returns True if active, false otherwise
     */
    isActive(): boolean {
        return this.unsubscribe !== undefined;
    }

    /**
     * Get number of active subscribers
     * @returns Number of subscribers
     */
    getSubscriberCount(): number {
        return this.subscribers.size;
    }

    /**
     * Handle component registration for specific sections
     * @param sectionId - Section ID where component should be active
     * @param componentId - Component ID to register
     * @param config - Configuration for createStateVisibility
     * @returns The visibility object for the component
     */
    handleComponent(
        sectionId: SectionId, 
        componentId: ComponentId, 
        config: Partial<ViewportPositionConfig> = {}
    ): ReturnType<typeof createStateVisibility> | null {
        // Support VideoHighlight section
        if (sectionId === SectionId.VideoHighlight) {
            return registerVideoHighlightComponent(componentId, config);
        }
        
        // Support Hero section
        if (sectionId === SectionId.Hero) {
            return registerHeroComponent(componentId, config);
        }
        
        // Support Experience section
        if (sectionId === SectionId.Experience) {
            return registerExperienceComponent(componentId, config);
        }
        
        // Support Chef section
        if (sectionId === SectionId.Chef) {
            return registerChefComponent(componentId, config);
        }
        
        // Support Menu section
        if (sectionId === SectionId.Menu) {
            return registerMenuComponent(componentId, config);
        }
        
        // Support Booking section
        if (sectionId === SectionId.Booking) {
            return registerBookingComponent(componentId, config);
        }
        
        // Support Footer section
        if (sectionId === SectionId.Footer) {
            return registerFooterComponent(componentId, config);
        }
        
        console.warn(`Section ${sectionId} is not supported for component registration yet.`);
        return null;
    }

    /**
     * Unregister component from specific section
     * @param sectionId - Section ID where component was registered
     * @param componentId - Component ID to unregister
     */
    unregisterComponent(sectionId: SectionId, componentId: ComponentId): void {
        // Support VideoHighlight section
        if (sectionId === SectionId.VideoHighlight) {
            unregisterVideoHighlightComponent(componentId);
            return;
        }
        
        // Support Hero section
        if (sectionId === SectionId.Hero) {
            unregisterHeroComponent(componentId);
            return;
        }
        
        // Support Experience section
        if (sectionId === SectionId.Experience) {
            unregisterExperienceComponent(componentId);
            return;
        }
        
        // Support Chef section
        if (sectionId === SectionId.Chef) {
            unregisterChefComponent(componentId);
            return;
        }
        
        // Support Menu section
        if (sectionId === SectionId.Menu) {
            unregisterMenuComponent(componentId);
            return;
        }
        
        // Support Booking section
        if (sectionId === SectionId.Booking) {
            unregisterBookingComponent(componentId);
            return;
        }
        
        // Support Footer section
        if (sectionId === SectionId.Footer) {
            unregisterFooterComponent(componentId);
            return;
        }
        
        console.warn(`Section ${sectionId} is not supported for component unregistration yet.`);
    }

    /**
     * Get all registered components for a specific section
     * @param sectionId - Section ID to check
     * @returns Map of registered components or null if section not supported
     */
    getRegisteredComponents(sectionId: SectionId): Map<ComponentId, ReturnType<typeof createStateVisibility>> | null {
        // Support VideoHighlight section
        if (sectionId === SectionId.VideoHighlight) {
            return getRegisteredVideoHighlightComponentsMap();
        }
        
        // Support Hero section
        if (sectionId === SectionId.Hero) {
            return getRegisteredHeroComponents();
        }
        
        // Support Experience section
        if (sectionId === SectionId.Experience) {
            return getRegisteredExperienceComponents();
        }
        
        // Support Chef section
        if (sectionId === SectionId.Chef) {
            return getRegisteredChefComponents();
        }
        
        // Support Menu section
        if (sectionId === SectionId.Menu) {
            return getRegisteredMenuComponents();
        }
        
        // Support Booking section
        if (sectionId === SectionId.Booking) {
            return getRegisteredBookingComponents();
        }
        
        // Support Footer section
        if (sectionId === SectionId.Footer) {
            return getRegisteredFooterComponents();
        }
        
        console.warn(`Section ${sectionId} is not supported for getting registered components yet.`);
        return null;
    }

    /**
     * Bulk register multiple components for a section
     * @param sectionId - Section ID where components should be active
     * @param components - Array of component configurations
     * @returns Array of visibility objects
     */
    handleMultipleComponents(
        sectionId: SectionId, 
        components: ComponentRegistrationConfig[]
    ): (ReturnType<typeof createStateVisibility> | null)[] {
        return components.map(({ componentId, config }) => 
            this.handleComponent(sectionId, componentId, config)
        );
    }

    /**
     * Get section-specific functions
     * @returns Section-specific functions including tracking capabilities
     */
    getSectionFunctions() {
        return {
            // Video highlight functions
            videoHighlight: {
                // Basic functions
                getVideoHighlightVisibleComponents,
                isComponentVisibleInVideoHighlight,
                monitorVideoHighlightComponent,
                showVideoHighlightComponents,
                hideVideoHighlightComponents,
                
                // Exclusive visibility functions
                showOnlyVideoHighlightComponent,
                hideOnlyVideoHighlightComponent,
                toggleVideoHighlightComponent,
                showOnlyVideoHighlightComponents,
                
                // Tracking functions
                getComponentTrackingStore,
                getRegisteredComponentTrackingStore,
                isComponentCurrentlyVisible,
                getAllComponentsVisibilityStatus,
                getComponentVisibilityStore,
                subscribeToComponentVisibility,
                subscribeToAllComponentsVisibility,
                getVisibilityStatistics,
                updateManualComponentsTracking
            },
            
            // Hero functions
            hero: {
                // Basic functions
                getHeroVisibleComponents,
                isComponentVisibleInHero,
                monitorHeroComponent,
                showHeroComponents,
                hideHeroComponents,
                
                // Exclusive visibility functions
                showOnlyHeroComponent,
                hideOnlyHeroComponent,
                toggleHeroComponent,
                showOnlyHeroComponents,
                
                // Tracking functions
                getComponentTrackingStore: getHeroComponentTrackingStore,
                getRegisteredComponentTrackingStore: getHeroRegisteredComponentTrackingStore,
                isComponentCurrentlyVisible: isHeroComponentCurrentlyVisible,
                getAllComponentsVisibilityStatus: getHeroAllComponentsVisibilityStatus,
                getComponentVisibilityStore: getHeroComponentVisibilityStore,
                subscribeToComponentVisibility: subscribeToHeroComponentVisibility,
                subscribeToAllComponentsVisibility: subscribeToHeroAllComponentsVisibility,
                getVisibilityStatistics: getHeroVisibilityStatistics,
                updateManualComponentsTracking: updateHeroManualComponentsTracking
            },
            
            // Experience functions
            experience: {
                // Basic functions
                getVisibleExperienceComponents,
                isExperienceComponentVisible,
                monitorExperienceComponent,
                showExperienceComponents,
                hideExperienceComponents,
                
                // Exclusive visibility functions
                showOnlyExperienceComponent,
                hideOnlyExperienceComponent,
                toggleExperienceComponent,
                showOnlyExperienceComponents,
                hideOnlyExperienceComponents,
                
                // Tracking functions
                getComponentTrackingStore: getExperienceComponentTrackingStore,
                getRegisteredComponentTrackingStore: getRegisteredExperienceComponentTrackingStore,
                isComponentCurrentlyVisible: isExperienceComponentCurrentlyVisible,
                getAllComponentsVisibilityStatus: getAllExperienceComponentsVisibilityStatus,
                getComponentVisibilityStore: getExperienceComponentVisibilityStore,
                subscribeToComponentVisibility: subscribeToExperienceComponentVisibility,
                subscribeToAllComponentsVisibility: subscribeToAllExperienceComponentsVisibility,
                getVisibilityStatistics: getExperienceVisibilityStatistics,
                updateManualComponentsTracking: updateExperienceManualComponentsTracking
            },
            
            // Chef functions
            chef: {
                // Basic functions
                getVisibleChefComponents,
                isChefComponentVisible,
                monitorChefComponent,
                showChefComponents,
                hideChefComponents,
                
                // Exclusive visibility functions
                showOnlyChefComponent,
                hideOnlyChefComponent,
                toggleChefComponent,
                showOnlyChefComponents,
                hideOnlyChefComponents,
                
                // Tracking functions
                getComponentTrackingStore: getChefComponentTrackingStore,
                getRegisteredComponentTrackingStore: getRegisteredChefComponentTrackingStore,
                isComponentCurrentlyVisible: isChefComponentCurrentlyVisible,
                getAllComponentsVisibilityStatus: getAllChefComponentsVisibilityStatus,
                getComponentVisibilityStore: getChefComponentVisibilityStore,
                subscribeToComponentVisibility: subscribeToChefComponentVisibility,
                subscribeToAllComponentsVisibility: subscribeToAllChefComponentsVisibility,
                getVisibilityStatistics: getChefVisibilityStatistics,
                updateManualComponentsTracking: updateChefManualComponentsTracking
            },
            
            // Menu functions
            menu: {
                // Basic functions
                getVisibleMenuComponents,
                isMenuComponentVisible,
                monitorMenuComponent,
                showMenuComponents,
                hideMenuComponents,
                
                // Exclusive visibility functions
                showOnlyMenuComponent,
                hideOnlyMenuComponent,
                toggleMenuComponent,
                showOnlyMenuComponents,
                hideOnlyMenuComponents,
                
                // Tracking functions
                getComponentTrackingStore: getMenuComponentTrackingStore,
                getRegisteredComponentTrackingStore: getRegisteredMenuComponentTrackingStore,
                isComponentCurrentlyVisible: isMenuComponentCurrentlyVisible,
                getAllComponentsVisibilityStatus: getAllMenuComponentsVisibilityStatus,
                getComponentVisibilityStore: getMenuComponentVisibilityStore,
                subscribeToComponentVisibility: subscribeToMenuComponentVisibility,
                subscribeToAllComponentsVisibility: subscribeToAllMenuComponentsVisibility,
                getVisibilityStatistics: getMenuVisibilityStatistics,
                updateManualComponentsTracking: updateMenuManualComponentsTracking
            },
            
            // Booking functions
            booking: {
                // Basic functions
                getVisibleBookingComponents,
                isBookingComponentVisible,
                monitorBookingComponent,
                showBookingComponents,
                hideBookingComponents,
                
                // Exclusive visibility functions
                showOnlyBookingComponent,
                hideOnlyBookingComponent,
                toggleBookingComponent,
                showOnlyBookingComponents,
                hideOnlyBookingComponents,
                
                // Tracking functions
                getComponentTrackingStore: getBookingComponentTrackingStore,
                getRegisteredComponentTrackingStore: getRegisteredBookingComponentTrackingStore,
                isComponentCurrentlyVisible: isBookingComponentCurrentlyVisible,
                getAllComponentsVisibilityStatus: getAllBookingComponentsVisibilityStatus,
                getComponentVisibilityStore: getBookingComponentVisibilityStore,
                subscribeToComponentVisibility: subscribeToBookingComponentVisibility,
                subscribeToAllComponentsVisibility: subscribeToAllBookingComponentsVisibility,
                getVisibilityStatistics: getBookingVisibilityStatistics,
                updateManualComponentsTracking: updateBookingManualComponentsTracking
            },
            
            // Footer functions
            footer: {
                // Basic functions
                getVisibleFooterComponents,
                isFooterComponentVisible,
                monitorFooterComponent,
                showFooterComponents,
                hideFooterComponents,
                
                // Exclusive visibility functions
                showOnlyFooterComponent,
                hideOnlyFooterComponent,
                toggleFooterComponent,
                showOnlyFooterComponents,
                hideOnlyFooterComponents,
                
                // Tracking functions
                getComponentTrackingStore: getFooterComponentTrackingStore,
                getRegisteredComponentTrackingStore: getRegisteredFooterComponentTrackingStore,
                isComponentCurrentlyVisible: isFooterComponentCurrentlyVisible,
                getAllComponentsVisibilityStatus: getAllFooterComponentsVisibilityStatus,
                getComponentVisibilityStore: getFooterComponentVisibilityStore,
                subscribeToComponentVisibility: subscribeToFooterComponentVisibility,
                subscribeToAllComponentsVisibility: subscribeToAllFooterComponentsVisibility,
                getVisibilityStatistics: getFooterVisibilityStatistics,
                updateManualComponentsTracking: updateFooterManualComponentsTracking
            }
        };
    }
}

/**
 * Global section monitor instance
 */
let globalSectionMonitor: SectionMonitor | null = null;

/**
 * Get or create global section monitor instance
 * @param options - SectionMonitorOptions
 * @returns SectionMonitor instance
 */
export function getSectionMonitor(options: SectionMonitorOptions = {}): SectionMonitor {
    if (!globalSectionMonitor) {
        globalSectionMonitor = new SectionMonitor(options);
    }
    return globalSectionMonitor;
}

/**
 * Factory function to create a SectionMonitor instance
 * 
 * @param options - SectionMonitorOptions
 * @returns SectionMonitor instance
 */
export function createSectionMonitor(options: SectionMonitorOptions = {}) {
    return new SectionMonitor(options);
}

/**
 * Hook-like function to use SectionMonitor
 * 
 * @param options - SectionMonitorOptions
 * @returns SectionMonitor instance methods
 */
export function useSectionMonitor(options: SectionMonitorOptions = {}) {
    const monitor = getSectionMonitor(options);
    const sectionFunctions = monitor.getSectionFunctions();
    
    return {
        start: () => monitor.start(),
        stop: () => monitor.stop(),
        getCurrentSectionId: () => monitor.getCurrentSectionId(),
        updateOptions: (newOptions: Partial<SectionMonitorOptions>) => monitor.updateOptions(newOptions),
        isActive: () => monitor.isActive(),
        subscribe: (id: string, callback: (section: SectionId, previousSection: SectionId | null) => void) => monitor.subscribe(id, callback),
        unsubscribeFromChanges: (id: string) => monitor.unsubscribeFromChanges(id),
        getSubscriberCount: () => monitor.getSubscriberCount(),
        
        // Component management functions
        handleComponent: (sectionId: SectionId, componentId: ComponentId, config?: Partial<ViewportPositionConfig>) => 
            monitor.handleComponent(sectionId, componentId, config),
        unregisterComponent: (sectionId: SectionId, componentId: ComponentId) => 
            monitor.unregisterComponent(sectionId, componentId),
        getRegisteredComponents: (sectionId: SectionId) => 
            monitor.getRegisteredComponents(sectionId),
        handleMultipleComponents: (sectionId: SectionId, components: ComponentRegistrationConfig[]) => 
            monitor.handleMultipleComponents(sectionId, components),
            
        // Section functions
        videoHighlight: sectionFunctions.videoHighlight,
        hero: sectionFunctions.hero,
        experience: sectionFunctions.experience,
        chef: sectionFunctions.chef,
        menu: sectionFunctions.menu,
        booking: sectionFunctions.booking,
        footer: sectionFunctions.footer,
    };
}

// Export the monitor instance and section functions
export const monitor = new SectionMonitor();
const sectionFunctions = monitor.getSectionFunctions();
export const videoHighlightFunctions = sectionFunctions.videoHighlight;
export const heroFunctions = sectionFunctions.hero;
export const experienceFunctions = sectionFunctions.experience;
export const chefFunctions = sectionFunctions.chef;
export const menuFunctions = sectionFunctions.menu;
export const bookingFunctions = sectionFunctions.booking;
export const footerFunctions = sectionFunctions.footer;