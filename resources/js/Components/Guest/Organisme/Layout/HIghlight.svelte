<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fly } from "svelte/transition";
    import { CONTAINER_PRESETS } from "@Const/Guest/UI/Container";
    import {
        currentHighlightIndex,
        highlightsData,
    } from "@Stores/Guest/Viewport/Highlight";
    import {
        createCombinedVisibility,
        ComponentId,
        type AreaBasedVisibilityConfig,
    } from "@Stores/Guest/Viewport/Visibility";
    import { useIndicatorSystem } from "@Utils/Guest/Viewport/Indicator";
    import { jumpToSection } from "@Utils/Guest/Viewport/Section";
    import { SectionEnum } from "@Enums/Guest/Section";

    /**
     * Enhanced visibility with area-based mouse detection
     *
     * Features:
     * - Shows when mouse enters right-center area (100px from right edge)
     * - Hides automatically when mouse exits 150px radius
     * - 2-second delay before hiding for smooth UX
     * - Maintains backward compatibility with global visibility control
     * - Configurable positioning and radius for reusability
     */
    const areaConfig: AreaBasedVisibilityConfig = {
        targetArea: "right", // Position at right-center of viewport
        areaOffset: 100, // Distance from right edge
        proximityRadius: 150, // Mouse detection radius
        hideDelay: 2000, // Hide after 2 seconds when mouse leaves area
        autoStart: true, // Enable area detection immediately
    };

    // Use combined visibility for area-based detection with global control
    const { isDisplay } = createCombinedVisibility(
        ComponentId.Highlight,
        areaConfig,
    );

    // Indicator system for auto-hide functionality
    const indicatorSystem = useIndicatorSystem({
        hideDelay: 3000,
        mouseAreaPercentage: 0.8,
        indicatorAreaRadius: 100,
    });

    /**
     * Handle highlight click navigation using existing jumpToSection function
     * @param index - Index of the highlight to navigate to
     */
    function handleHighlightClick(index: number): void {
        const highlight = $highlightsData[index];
        if (!highlight) return;

        try {
            // Update highlight index immediately for visual feedback
            currentHighlightIndex.set(index);

            // Use existing jumpToSection function for consistent navigation
            jumpToSection(highlight.sectionId as SectionEnum, {
                scrollConfig: {
                    behavior: "smooth",
                    offsetForHeader: true,
                },
                triggerScroll: true,
                loadComponent: false, // Don't reload components on navigation
            });
        } catch (error) {
            console.error("Failed to navigate to section:", error);
            // Fallback: try direct element scroll
            const element = document.getElementById(highlight.sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }
    }

    /**
     * Handle mouse enter - show indicator and clear hide timer
     */
    function handleMouseEnter(): void {
        indicatorSystem.show();
        indicatorSystem.clearHideTimer();
    }

    /**
     * Handle mouse leave - start hide timer
     */
    function handleMouseLeave(): void {
        indicatorSystem.startHideTimer();
    }

    /**
     * Initialize indicator system on component mount
     */
    onMount(() => {
        console.log("highlight", $highlightsData);
        indicatorSystem.startMouseDetector();
    });

    /**
     * Cleanup indicator system on component destroy
     */
    onDestroy(() => {
        indicatorSystem.stopMouseDetector();
    });
</script>

{#if $isDisplay && $highlightsData.length > 0}
    <div
        role="navigation"
        aria-label="Section highlights navigation"
        class={`${CONTAINER_PRESETS.panel.blur} fixed right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col space-y-2 rounded-l-2xl border-white/20 p-3 py-2 shadow-lg py-4`}
        transition:fly={{ x: 100, duration: 300 }}
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
    >
        {#each $highlightsData as highlight, index}
            {@const isActive = $currentHighlightIndex === index}

            <button
                type="button"
                class="w-3 h-3 rounded-full border-2 transition-all duration-300 {isActive
                    ? 'bg-white border-white'
                    : 'bg-transparent border-white/50 hover:border-white'}"
                title={highlight.name}
                aria-label="Navigate to {highlight.name} section"
                on:click={() => handleHighlightClick(index)}
            ></button>
        {/each}
    </div>
{/if}
