<script context="module" lang="ts">
    import CurrentLanguage from "./Parts/CurrentLanguage.svelte"
    import SelectionList from "./Parts/SelectionList.svelte";
    import {
        ComponentId,
        createCombinedVisibility,
    } from "@Stores/Guest/Viewport/Index";

    const {isDisplay, isVisible} = createCombinedVisibility(ComponentId.Locale, {
        targetArea: "left",
        proximityRadius: 150,
        areaOffset: 100,
        hideDelay: 800,
    });
</script>

{#if $isDisplay}
    <SelectionList />
{:else if $isVisible}
    <CurrentLanguage />
{/if}
