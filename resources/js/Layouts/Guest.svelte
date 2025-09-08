<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { initializeGuestMonitoring } from '@/Utils/Guest/Layout/Monitor';

    import LanguageSwitch from '@/Components/Guest/Organisme/Layout/LanguageSwitch.svelte';
    import ScrollIndicator from "@/Components/Guest/Organisme/Layout/ScrollIndicator.svelte";

    let cleanup: (() => void) | null = null;
    
    onMount(() => {
        cleanup = initializeGuestMonitoring();
    });
    
    onDestroy(() => {
        cleanup?.();
    });
</script>

<!-- <Header /> -->
<!-- <Footer /> -->
<LanguageSwitch />

<slot />

<!-- <ChatBotFab /> -->
<ScrollIndicator />
<!-- <BackToTop /> -->

<style>
</style>
