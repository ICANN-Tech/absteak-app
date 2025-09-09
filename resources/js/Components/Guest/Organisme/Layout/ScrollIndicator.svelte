<script context="module" lang="ts">
    import {
        ComponentId,
        createVisibilityState,
    } from "@Stores/Guest/Viewport/Index";
    import ScrollMouseIcon from "@Components/Global/Atoms/Icons/ScrollMouse.svelte";
    import { fade } from "svelte/transition";

    const { isVisible } = createVisibilityState(ComponentId.ScrollIndicator);
</script>

{#if $isVisible}
    <div class="scroll-indicator" transition:fade={{ duration: 300 }}>
        <div class="flex items-center justify-center overflow-hidden">
            <div
                class="flex h-14 w-14 animate-pulse items-center justify-center text-lg text-white transition-all duration-300"
                aria-label="Scroll to next section"
            >
                <ScrollMouseIcon size="sm" color="warning" />
            </div>
        </div>
    </div>
{/if}

<style scoped lang="scss">
$indicator-bottom: 2rem;
$z-index-indicator: 20;

.scroll-indicator {
  position: fixed;
  bottom: $indicator-bottom;
  left: 50%;
  transform: translateX(-50%);
  z-index: $z-index-indicator;
  pointer-events: none;

  &.active {
    opacity: 1;
  }

  .bar {
    width: 50px;
    height: 4px;
    background-color: blue;
  }
}
</style>
