<script context="module" lang="ts">
    import { fly } from "svelte/transition";
    import { CONTAINER_PRESETS } from "@Const/Guest/UI/Container";
    import Selector from "@Components/Global/Atoms/Selector.svelte";
    import { localeStore } from "@Stores/Global/Index";
</script>

<div
    class={CONTAINER_PRESETS.positioned.leftCenter}
    transition:fly={{ x: -100, duration: 600 }}
>
    <div class={`${CONTAINER_PRESETS.panel.blur} p-2 opacity-60`}>
        <Selector locale={$localeStore.current} size="xs" />
    </div>
</div>
