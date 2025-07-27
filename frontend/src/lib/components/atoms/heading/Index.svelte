<script>
  export let level = 2;
  export let text = '';
  export let className = '';
</script>

<svelte:component this={"h" + level} class={className}>
  {text}
</svelte:component>