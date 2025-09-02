<script lang="ts">
  import { Button } from '../../Atoms/Index';
	import { PlayOutline } from 'flowbite-svelte-icons';

  interface Props {
    onclick?: () => void;
  }

  let { onclick }: Props = $props();

  function handleClick() {
    onclick?.();
  }
</script>

<div
  class="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-300 group-hover:bg-black/30"
>
  <Button
    type="button"
    aria-label="Play video"
    class="h-16 w-16 transform cursor-pointer rounded-full border-0 bg-primary-600 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary-700"
    on:click={handleClick}
  >
  <PlayOutline />
  </Button>
</div>
