<script lang="ts">
  export let imageUrl: string = '';
  export let opacity: number = 0.4; // default overlay opacity
</script>

<div class="absolute inset-0">
  <!-- Base gradient background -->
  <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>

  <!-- Background image with enhanced overlay -->
  {#if imageUrl}
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url({imageUrl}); opacity: {opacity}"
    ></div>
  {/if}

  <!-- Noise texture overlay -->
  <div class="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
</div>