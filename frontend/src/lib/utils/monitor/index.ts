export * from "./base";
export * from "./section/video-highlight";
export * from "./section";
export * from "./component";

// Hero exports with explicit naming to avoid conflicts
export {
    showHeroComponents,
    hideHeroComponents,
    getHeroVisibleComponents,
    isComponentVisibleInHero,
    monitorHeroComponent,
    registerHeroComponent,
    unregisterHeroComponent,
    getRegisteredHeroComponents,
    showOnlyHeroComponent,
    hideOnlyHeroComponent,
    toggleHeroComponent,
    showOnlyHeroComponents,
    getComponentTrackingStore as getHeroComponentTrackingStore,
    getRegisteredComponentTrackingStore as getHeroRegisteredComponentTrackingStore,
    isComponentCurrentlyVisible as isHeroComponentCurrentlyVisible,
    getAllComponentsVisibilityStatus as getHeroAllComponentsVisibilityStatus,
    getComponentVisibilityStore as getHeroComponentVisibilityStore,
    subscribeToComponentVisibility as subscribeToHeroComponentVisibility,
    subscribeToAllComponentsVisibility as subscribeToHeroAllComponentsVisibility,
    getVisibilityStatistics as getHeroVisibilityStatistics,
    updateManualComponentsTracking as updateHeroManualComponentsTracking
} from "./section/hero";