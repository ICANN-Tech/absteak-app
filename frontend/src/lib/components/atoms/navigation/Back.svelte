<script lang="ts">
  import { ChevronLeftOutline } from 'flowbite-svelte-icons';

  export let onclick: (() => void) | null = null;  
  export let className: string = '';

  const baseClasses = "relative z-30 flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors duration-200 font-medium text-[17px] -ml-1 px-1 py-1";

  $: finalClasses = className ? `${baseClasses} ${className}` : baseClasses;
</script>

<button
  class={finalClasses}
  onclick={onclick}
>
  <slot name="icon">
    <ChevronLeftOutline class="w-5 h-5" />
  </slot>
  <slot>Back</slot>
</button>