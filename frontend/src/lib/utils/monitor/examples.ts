/**
 * Contoh penggunaan handleComponent di komponen Svelte
 * 
 * File ini menunjukkan cara menggunakan sistem baru untuk mengelola
 * komponen dengan createStateVisibility melalui section monitor
 */

import { onMount, onDestroy } from 'svelte';
import { useSectionMonitor } from '$lib/utils/monitor/base';
import { ComponentId, SectionId } from '$lib/enums';

// Contoh 1: Basic Usage - Register single component
export function exampleBasicUsage() {
    const { handleComponent, unregisterComponent } = useSectionMonitor();
    
    onMount(() => {
        // Register VideoPromotion component untuk VideoHighlight section
        const visibility = handleComponent(
            SectionId.VideoHighlight, 
            ComponentId.VideoPromotion, 
            { 
                hideDelay: 2000,
                initialVisible: false 
            }
        );
        
        if (visibility) {
            // Subscribe ke perubahan visibility
            visibility.finalVisible.subscribe(isVisible => {
                console.log('VideoPromotion visible:', isVisible);
                // Update UI berdasarkan visibility
            });
        }
    });
    
    onDestroy(() => {
        // Cleanup - unregister component
        unregisterComponent(SectionId.VideoHighlight, ComponentId.VideoPromotion);
    });
}

// Contoh 2: Multiple Components Registration
export function exampleMultipleComponents() {
    const { handleMultipleComponents } = useSectionMonitor();
    
    onMount(() => {
        // Register multiple components sekaligus
        const visibilityObjects = handleMultipleComponents(SectionId.VideoHighlight, [
            { 
                componentId: ComponentId.VideoPromotion, 
                config: { hideDelay: 2000, initialVisible: false } 
            },
            { 
                componentId: ComponentId.ChatBot, 
                config: { hideDelay: 3000, initialVisible: true } 
            },
            { 
                componentId: ComponentId.Operation, 
                config: { hideDelay: 1500, initialVisible: false } 
            }
        ]);
        
        // Handle setiap visibility object
        visibilityObjects.forEach((visibility, index) => {
            if (visibility) {
                visibility.finalVisible.subscribe(isVisible => {
                    console.log(`Component ${index} visible:`, isVisible);
                });
            }
        });
    });
}

// Contoh 3: Advanced Usage dengan Manual Control
export function exampleAdvancedUsage() {
    const { handleComponent, getRegisteredComponents } = useSectionMonitor();
    let videoPromotionVisibility: ReturnType<typeof handleComponent>;
    
    onMount(() => {
        // Register component
        videoPromotionVisibility = handleComponent(
            SectionId.VideoHighlight, 
            ComponentId.VideoPromotion, 
            { hideDelay: 2000 }
        );
        
        if (videoPromotionVisibility) {
            // Subscribe ke visibility changes
            videoPromotionVisibility.finalVisible.subscribe(isVisible => {
                if (isVisible) {
                    console.log('VideoPromotion is now visible');
                    // Trigger animations, load content, etc.
                } else {
                    console.log('VideoPromotion is now hidden');
                    // Cleanup, pause videos, etc.
                }
            });
        }
    });
    
    // Manual control functions
    function showVideoPromotion() {
        videoPromotionVisibility?.show();
    }
    
    function hideVideoPromotion() {
        videoPromotionVisibility?.hide();
    }
    
    function toggleVideoPromotion() {
        videoPromotionVisibility?.toggle();
    }
    
    // Check registered components
    function checkRegisteredComponents() {
        const registered = getRegisteredComponents(SectionId.VideoHighlight);
        if (registered) {
            console.log('Registered components:', Array.from(registered.keys()));
            
            // Access specific component
            const chatBotVisibility = registered.get(ComponentId.ChatBot);
            if (chatBotVisibility) {
                chatBotVisibility.show();
            }
        }
    }
    
    return {
        showVideoPromotion,
        hideVideoPromotion,
        toggleVideoPromotion,
        checkRegisteredComponents
    };
}

// Contoh 4: Integration dengan Svelte Component
export function createVideoPromotionComponent() {
    return `
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { useSectionMonitor } from '$lib/utils/monitor/section';
    import { ComponentId, SectionId } from '$lib/enums';
    
    const { handleComponent, unregisterComponent } = useSectionMonitor();
    let isVisible = false;
    let visibility: ReturnType<typeof handleComponent>;
    
    onMount(() => {
        // Register component dengan section monitor
        visibility = handleComponent(
            SectionId.VideoHighlight, 
            ComponentId.VideoPromotion, 
            { 
                hideDelay: 2000,
                initialVisible: false 
            }
        );
        
        if (visibility) {
            // Subscribe ke perubahan visibility
            const unsubscribe = visibility.finalVisible.subscribe(visible => {
                isVisible = visible;
            });
            
            // Cleanup subscription on destroy
            onDestroy(() => {
                unsubscribe();
                unregisterComponent(SectionId.VideoHighlight, ComponentId.VideoPromotion);
            });
        }
    });
    
    function handleManualShow() {
        visibility?.show();
    }
    
    function handleManualHide() {
        visibility?.hide();
    }
</script>

{#if isVisible}
    <div class="video-promotion" transition:fade>
        <h2>Video Promotion</h2>
        <p>This component is managed by section monitor!</p>
        
        <button on:click={handleManualShow}>Force Show</button>
        <button on:click={handleManualHide}>Force Hide</button>
    </div>
{/if}

<style>
    .video-promotion {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
    }
</style>
    `;
}

// ===== TRACKING EXAMPLES =====

// Contoh 5: Basic Tracking Usage
export function exampleBasicTracking() {
    const { videoHighlight } = useSectionMonitor();
    
    // Check apakah component sedang visible saat ini
    function checkComponentVisibility() {
        const isVideoPromotionVisible = videoHighlight.isComponentCurrentlyVisible(ComponentId.VideoPromotion);
        const isChatBotVisible = videoHighlight.isComponentCurrentlyVisible(ComponentId.ChatBot);
        
        console.log('VideoPromotion visible:', isVideoPromotionVisible);
        console.log('ChatBot visible:', isChatBotVisible);
    }
    
    // Get status semua components
    function getAllStatus() {
        const allStatus = videoHighlight.getAllComponentsVisibilityStatus();
        console.log('All components status:', allStatus);
    }
    
    // Get statistics
    function getStats() {
        const stats = videoHighlight.getVisibilityStatistics();
        console.log('Visibility statistics:', stats);
        console.log(`${stats.visibleComponents}/${stats.totalComponents} components visible (${stats.visibilityPercentage.toFixed(1)}%)`);
    }
    
    return {
        checkComponentVisibility,
        getAllStatus,
        getStats
    };
}

// Contoh 6: Reactive Tracking dengan Stores
export function exampleReactiveTracking() {
    const { videoHighlight } = useSectionMonitor();
    
    onMount(() => {
        // Subscribe ke perubahan visibility untuk specific component
        const unsubscribeVideoPromotion = videoHighlight.subscribeToComponentVisibility(
            ComponentId.VideoPromotion,
            (isVisible) => {
                console.log('VideoPromotion visibility changed:', isVisible);
                // Update UI, trigger animations, etc.
            }
        );
        
        // Subscribe ke perubahan semua components
        const unsubscribeAll = videoHighlight.subscribeToAllComponentsVisibility(
            (visibilityMap) => {
                console.log('Components visibility changed:', visibilityMap);
                // Update dashboard, analytics, etc.
            }
        );
        
        // Get reactive store untuk specific component
        const videoPromotionStore = videoHighlight.getComponentVisibilityStore(ComponentId.VideoPromotion);
        const unsubscribeStore = videoPromotionStore.subscribe(isVisible => {
            console.log('VideoPromotion store update:', isVisible);
        });
        
        // Cleanup
        onDestroy(() => {
            unsubscribeVideoPromotion();
            unsubscribeAll();
            unsubscribeStore();
        });
    });
}

// Contoh 7: Real-time Dashboard Component
export function createTrackingDashboard() {
    return `
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { useSectionMonitor } from '$lib/utils/monitor/section';
    import { ComponentId } from '$lib/enums';
    
    const { videoHighlight } = useSectionMonitor();
    
    let stats = {
        totalComponents: 0,
        visibleComponents: 0,
        hiddenComponents: 0,
        visibilityPercentage: 0,
        visibleComponentIds: [],
        hiddenComponentIds: []
    };
    
    let allComponentsStatus = {};
    let unsubscribeAll: () => void;
    
    onMount(() => {
        // Subscribe ke perubahan semua components
        unsubscribeAll = videoHighlight.subscribeToAllComponentsVisibility((visibilityMap) => {
            // Update stats
            stats = videoHighlight.getVisibilityStatistics();
            
            // Update status object
            allComponentsStatus = {};
            visibilityMap.forEach((isVisible, componentId) => {
                allComponentsStatus[componentId] = isVisible;
            });
            
            // Trigger reactivity
            stats = stats;
            allComponentsStatus = allComponentsStatus;
        });
        
        // Initial load
        stats = videoHighlight.getVisibilityStatistics();
        allComponentsStatus = videoHighlight.getAllComponentsVisibilityStatus();
    });
    
    onDestroy(() => {
        unsubscribeAll?.();
    });
</script>

<div class="tracking-dashboard">
    <h3>Component Visibility Dashboard</h3>
    
    <div class="stats">
        <div class="stat-item">
            <span class="label">Total Components:</span>
            <span class="value">{stats.totalComponents}</span>
        </div>
        <div class="stat-item">
            <span class="label">Visible:</span>
            <span class="value visible">{stats.visibleComponents}</span>
        </div>
        <div class="stat-item">
            <span class="label">Hidden:</span>
            <span class="value hidden">{stats.hiddenComponents}</span>
        </div>
        <div class="stat-item">
            <span class="label">Visibility:</span>
            <span class="value">{stats.visibilityPercentage.toFixed(1)}%</span>
        </div>
    </div>
    
    <div class="components-list">
        <h4>Component Status</h4>
        {#each Object.entries(allComponentsStatus) as [componentId, isVisible]}
            <div class="component-item" class:visible={isVisible} class:hidden={!isVisible}>
                <span class="component-name">{componentId}</span>
                <span class="status">{isVisible ? 'Visible' : 'Hidden'}</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .tracking-dashboard {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        max-width: 300px;
        z-index: 9999;
    }
    
    .stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 15px;
    }
    
    .stat-item {
        display: flex;
        justify-content: space-between;
    }
    
    .value.visible {
        color: #4ade80;
    }
    
    .value.hidden {
        color: #f87171;
    }
    
    .components-list {
        border-top: 1px solid #374151;
        padding-top: 15px;
    }
    
    .component-item {
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #374151;
    }
    
    .component-item.visible {
        color: #4ade80;
    }
    
    .component-item.hidden {
        color: #f87171;
    }
</style>
    `;
}

// Contoh 8: Advanced Tracking dengan Analytics
export function exampleAdvancedTracking() {
    const { videoHighlight } = useSectionMonitor();
    
    // Analytics data
    let visibilityHistory: Array<{
        timestamp: number;
        componentId: ComponentId;
        isVisible: boolean;
        duration?: number;
    }> = [];
    
    let componentTimers = new Map<ComponentId, number>();
    
    onMount(() => {
        // Track visibility changes dengan analytics
        const unsubscribe = videoHighlight.subscribeToAllComponentsVisibility((visibilityMap) => {
            const timestamp = Date.now();
            
            visibilityMap.forEach((isVisible, componentId) => {
                // Record visibility change
                const lastEntry = visibilityHistory
                    .filter(entry => entry.componentId === componentId)
                    .pop();
                
                if (!lastEntry || lastEntry.isVisible !== isVisible) {
                    // Calculate duration if component was visible
                    let duration: number | undefined;
                    if (lastEntry && lastEntry.isVisible && !isVisible) {
                        duration = timestamp - lastEntry.timestamp;
                    }
                    
                    visibilityHistory.push({
                        timestamp,
                        componentId,
                        isVisible,
                        duration
                    });
                    
                    // Update timers
                    if (isVisible) {
                        componentTimers.set(componentId, timestamp);
                    } else {
                        componentTimers.delete(componentId);
                    }
                }
            });
        });
        
        onDestroy(() => {
            unsubscribe();
        });
    });
    
    // Analytics functions
    function getComponentAnalytics(componentId: ComponentId) {
        const entries = visibilityHistory.filter(entry => entry.componentId === componentId);
        const visibleEntries = entries.filter(entry => entry.isVisible);
        const hiddenEntries = entries.filter(entry => !entry.isVisible && entry.duration);
        
        const totalVisibleTime = hiddenEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
        const averageVisibleTime = hiddenEntries.length > 0 ? totalVisibleTime / hiddenEntries.length : 0;
        
        return {
            totalShows: visibleEntries.length,
            totalHides: hiddenEntries.length,
            totalVisibleTime,
            averageVisibleTime,
            isCurrentlyVisible: videoHighlight.isComponentCurrentlyVisible(componentId)
        };
    }
    
    function exportAnalytics() {
        const analytics = {
            history: visibilityHistory,
            summary: Object.values(ComponentId).reduce((acc, componentId) => {
                acc[componentId] = getComponentAnalytics(componentId);
                return acc;
            }, {} as Record<ComponentId, any>),
            exportTime: Date.now()
        };
        
        console.log('Component Analytics:', analytics);
        return analytics;
    }
    
    return {
        getComponentAnalytics,
        exportAnalytics,
        getVisibilityHistory: () => visibilityHistory
    };
}