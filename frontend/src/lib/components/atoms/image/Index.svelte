<script lang="ts">
  export let src = '';
  export let alt = '';
</script>

<img src={src} alt={alt} class={`w-full h-auto`} {...$$restProps} />