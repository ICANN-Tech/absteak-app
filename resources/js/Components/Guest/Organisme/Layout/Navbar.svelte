<script context="module" lang="ts">
    import { fly } from "svelte/transition";
    import { LogoIcon } from "@Components/Global/Atoms/Icons/Index";
    import {
        createVisibilityState,
        ComponentId,
    } from "@Stores/Guest/Viewport/Visibility";

    const { isVisible } = createVisibilityState(ComponentId.Navigation);
</script>

{#if $isVisible}
    <header
        class="fixed left-0 top-0 z-20 w-full"
        in:fly={{ y: -20, duration: 300, delay: 600 }}
        out:fly={{ y: -20, duration: 200, delay: 200 }}
    >
        <nav
            class="bg-primary-950/80 mx-auto flex w-fit items-center justify-between rounded-b-3xl border-b border-white/20 px-4 py-4 shadow-lg backdrop-blur-lg"
        >
            <LogoIcon size="sm" />
        </nav>
    </header>
{/if}
