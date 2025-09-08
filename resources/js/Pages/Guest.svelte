<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { sections } from "@Const/Guest/Control/Section";
    import { 
        currentSectionIndex, 
        navigationStore
    } from "@Stores/Guest/Viewport/Section";
    import { type SectionData } from "@Utils/Guest/Viewport/Section";
    import { 
        initializeNavigation,
        cleanupNavigation,
        type NavigationState
    } from "@Utils/Guest/Navigation/Index";

    import GuestLayout from "../Layouts/Guest.svelte";
    import Section from "../Components/Guest/Organisme/Layout/Section.svelte";
    import { Loading } from "../Components/Guest/Atoms/Index";

    /**
     * Navigation state management
     */
    let navigationState: NavigationState;
    let navigationCleanup: (() => void) | null = null;
    
    /**
     * Reactive statements for component state management
     */
    $: currentIndex = $currentSectionIndex;
    $: sectionsData = sections as SectionData[];
    $: isLoading = $navigationStore.isLoading;
    

    
    /**
     * Setup navigation using existing utilities
     */
    onMount(() => {
        if (typeof window !== 'undefined') {
            // Initialize navigation system
            const { state, cleanup } = initializeNavigation();
            navigationState = state;
            navigationCleanup = cleanup;
            
            // Prevent default scroll behavior on body
            document.body.style.overflow = 'hidden';
        }
    });
    
    /**
     * Cleanup navigation handlers
     */
    onDestroy(() => {
        if (typeof window !== 'undefined') {
            // Clean up navigation system
            if (navigationCleanup) {
                navigationCleanup();
                navigationCleanup = null;
            }
            
            // Additional cleanup for navigation state
            if (navigationState) {
                cleanupNavigation(navigationState);
            }
            
            // Restore default scroll behavior
            document.body.style.overflow = 'auto';
        }
    });
</script>

<GuestLayout>
    <!-- Loading State -->
    {#if isLoading}
        <div class="loading-container">
            <Loading
                size="lg"
                variant="full"
                message="Loading sections..."
                showMessage={true}
                animationType="pulse"
            />
        </div>
    {:else}
        <!-- Section Navigation -->
        {#each sectionsData as sectionData, index}
            {@const isActive = index === currentIndex}
            {@const slideOffset = isActive
                ? "0"
                : index > currentIndex
                  ? "100vh"
                  : "-100vh"}
            <Section section={sectionData} {isActive} {slideOffset} />
        {/each}
    {/if}
</GuestLayout>

<style>
    /**
     * Loading container styles
     * Provides full-screen overlay for loading state
     */
    .loading-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(4px);
        z-index: 999;
        transition: opacity 0.3s ease-in-out;
    }
    
    /**
     * Global scroll behavior enhancements
     */
    :global(html) {
        scroll-behavior: smooth;
        overflow: hidden;
    }
    
    :global(body) {
        overflow: hidden;
        height: 100vh;
        position: relative;
    }
    
    /**
     * Section transition styles
     */
    :global(.section-transition) {
        transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                   opacity 0.6s ease-in-out;
        will-change: transform, opacity;
    }
    
    /**
     * Scroll indicator enhancements
     */
    :global(.scroll-indicator) {
        transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        will-change: opacity, transform;
    }
    
    /**
     * Performance optimizations
     */
    :global(.section-container) {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
    }
    
    /**
     * Mobile touch improvements
     */
    :global(body) {
        touch-action: pan-y;
        -webkit-overflow-scrolling: touch;
    }
    
    /**
     * Prevent text selection during scroll transitions
     */
    :global(.scrolling) {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
</style>
