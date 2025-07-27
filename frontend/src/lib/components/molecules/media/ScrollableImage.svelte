<script lang="ts">
  import { Image } from '$lib/components/atoms';

  export let images: string[] = [];
  export let heights: string[] = [];
  export let animationClass = '';
</script>

<div class={`flex flex-col h-full ${animationClass}`}>
  {#each [...images, ...images] as image, index}
    <div class={`${heights[index % heights.length]} flex-shrink-0 w-full`}>
      <Image src={image} alt="food" class="object-cover w-full h-full block" />
    </div>
  {/each}
</div>