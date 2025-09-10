<script context="module" lang="ts">
    import { fly } from "svelte/transition";
    import { CONTAINER_PRESETS } from "@/Const/Guest/UI/Index";
    import {
        getLocaleLabel,
        LocaleEnum,
        LocaleEnumList,
    } from "../Enums/Language.enum";
    import { localeStore, setLocale } from "../Stores/Locale.store";
    import Selector from "./Selector.svelte";
</script>

<script lang="ts">
    function selectedClass(locale: LocaleEnum): string {
        const baseClass =
            "p-2 rounded-lg transition-all duration-300 hover:bg-white/10";
        const selectedClass = "bg-orange-500/20 border border-orange-500/30";
        const normalClass = "bg-white/5 border border-transparent";

        return `${baseClass} ${$localeStore.current === locale ? selectedClass : normalClass}`;
    }
</script>

<div
    class={CONTAINER_PRESETS.positioned.leftCenter}
    transition:fly={{ x: -100, duration: 600 }}
>
    <div
        class={`${CONTAINER_PRESETS.panel.blur} flex flex-col flex-wrap gap-4`}
    >
        {#each LocaleEnumList as locale}
            <button
                on:click={() => setLocale(locale)}
                class={selectedClass(locale)}
                title={getLocaleLabel(locale)}
            >
                <Selector {locale} size="xs" />
            </button>
        {/each}
    </div>
</div>
