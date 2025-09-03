<script lang="ts">
    import { onMount } from "svelte";
    import { sections } from "@Const/Guest/Control/Section";
    import { 
        currentSectionIndex, 
        navigationStore 
    } from "@Stores/Guest/Viewport/Section";
    import {
        createMouseNavigationState,
        attachMouseNavigation,
        detachMouseNavigation,
        type MouseNavigationState,
    } from "@Utils/Guest/Navigation/Mouse";
    import {
        createKeyboardNavigationState,
        attachKeyboardNavigation,
        detachKeyboardNavigation,
        type KeyboardNavigationState,
    } from "@Utils/Guest/Navigation/Keyboard";
    import { type SectionData } from "@Utils/Guest/Viewport/Section";

    import Section from "../Components/Guest/Organisme/Layout/Section.svelte";
    import { Loading } from "../Components/Guest/Atoms/Index";

    /**
     * Component state
     */
    let mouseNavigationState: MouseNavigationState;
    let keyboardNavigationState: KeyboardNavigationState;

    /**
     * Reactive statements for component state management
     */
    $: currentIndex = $currentSectionIndex;
    $: sectionsData = sections as SectionData[];
    $: isLoading = $navigationStore.isLoading;

    /**
     * Initialize component on mount
     */
    onMount(() => {
        // Initialize navigation states
        mouseNavigationState = createMouseNavigationState();
        keyboardNavigationState = createKeyboardNavigationState();

        // Attach navigation handlers
        attachMouseNavigation(mouseNavigationState);
        attachKeyboardNavigation(keyboardNavigationState);

        // Cleanup function
        return () => {
            detachMouseNavigation(mouseNavigationState);
            detachKeyboardNavigation(keyboardNavigationState);
        };
    });
</script>

<main class="bg-primary-700/5 min-h-screen">
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
</main>

<!-- Hide scrollbar globally -->
<style>
    :global(html, body) {
        overflow-x: hidden;
        height: 100vh;
        margin: 0;
        padding: 0;
    }

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

    /* Hide scrollbars but allow scrolling */
    :global(*) {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* Internet Explorer 10+ */
    }

    :global(*::-webkit-scrollbar) {
        display: none; /* WebKit */
    }
</style>
