<script context="module" lang="ts">
    import LanguageSwitch from "@Components/Guest/Organisme/Layout/LanguageSwitch/Index.svelte"
    import BackToTop from '@/Components/Guest/Organisme/Layout/BackToTop.svelte';
</script>

<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { initializeGuestMonitoring } from '@/Utils/Guest/Layout/Monitor';
    import { initializeApp } from '@/Utils/Guest/Viewport/Initialization';

    import Navbar from '@/Components/Guest/Organisme/Layout/Navbar.svelte';
    import ScrollIndicator from "@/Components/Guest/Organisme/Layout/ScrollIndicator.svelte";
    import Highlight from '@/Components/Guest/Organisme/Layout/Highlight.svelte';

    let cleanup: (() => void) | null = null;
    
    onMount(async () => {
        // Initialize app data (highlights, sections, etc.)
        await initializeApp();
        
        // Initialize monitoring
        cleanup = initializeGuestMonitoring();
    });
    
    onDestroy(() => {
        cleanup?.();
    });
</script>

<Navbar />

<!-- <Header /> -->
<!-- <Footer /> -->
<LanguageSwitch />
<Highlight />

<slot />

<!-- <ChatBotFab /> -->
<ScrollIndicator />
<BackToTop />

<style>
</style>
