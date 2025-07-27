<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  export let animation = 'fade'; // 'fade' | 'fly'
  export let duration = 600;
  export let y = 50; // untuk fly
  let visible = false;
  let el;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  });
</script>

<div bind:this={el}>
  {#if visible}
    {#if animation === 'fade'}
      <div transition:fade={{ duration }}>
        <slot />
      </div>
    {:else if animation === 'fly'}
      <div transition:fly={{ y, duration }}>
        <slot />
      </div>
    {/if}
  {/if}
</div> 