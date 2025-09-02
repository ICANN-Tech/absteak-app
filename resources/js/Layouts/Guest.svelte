<script lang="ts">
    import "../app.css";
    import { useIndicatorSystem } from "@Utils/Guest/Viewport/Indicator";
    import { onMount } from "svelte";
    import { initializeGuestLayout } from "@Utils/Guest/Layout";

    // Import new section navigation utilities
    import {
        jumpToSection,
        navigateToNextSection,
        navigateToPreviousSection,
        initializeAllSections,
    } from "@Utils/Guest/Viewport/Section";
    import {
        initializeIndicatorSystem,
    } from "@Utils/Guest/Layout/Scrolling";

    // Initialize all sections with new navigation system
    initializeAllSections();

    // Setup indicator system using utility function
    const indicator = initializeIndicatorSystem(useIndicatorSystem, {
        hideDelay: 3000,
        mouseAreaPercentage: 0.8,
        indicatorAreaRadius: 100,
    });

    // Layout cleanup function
    let layoutCleanup: (() => void) | undefined;

    // Navigation functions using new section system
    const handleJumpToSection = (sectionId: any) => {
        jumpToSection(sectionId);
    };

    const handleNextSection = () => {
        navigateToNextSection();
    };

    const handlePreviousSection = () => {
        navigateToPreviousSection();
    };

    // Export navigation functions for external use
    export { handleJumpToSection, handleNextSection, handlePreviousSection };

    // Component variables
    let Header: any;
    let Footer: any;
    let LanguageSwitch: any;
    let ScrollIndicator: any;
    let BackToTop: any;
    let ChatBotFab: any;

    // Initialize layout on mount
    onMount(() => {
        // Async initialization
        (async () => {
            try {
                const layoutResult = await initializeGuestLayout({
                    indicator,
                    enableModalSystem: true,
                    enableMouseDetector: true
                });

                // Assign loaded components
                const { components, cleanup } = layoutResult;
                Header = components.Header;
                Footer = components.Footer;
                LanguageSwitch = components.LanguageSwitch;
                ScrollIndicator = components.ScrollIndicator;
                BackToTop = components.BackToTop;
                ChatBotFab = components.ChatBotFab;

                // Store cleanup function
                layoutCleanup = cleanup;
            } catch (error) {
                console.warn("Layout initialization failed:", error);
            }
        })();

        // Return synchronous cleanup function
        return () => {
            if (layoutCleanup) {
                layoutCleanup();
            }
        };
    });
</script>

<Header />
<Footer />
<LanguageSwitch />

<slot />

<ChatBotFab />
<ScrollIndicator />
<BackToTop />

<style lang="scss">
    @use "../lib/styles/global.scss" as *;
</style>
