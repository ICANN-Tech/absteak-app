<script lang="ts">
  import { PlayButton } from '$lib/components/molecules';
  
  // Props untuk thumbnail
  export let src: string;
  export let alt: string = 'Video thumbnail';
  export let onClick: () => void;
  export let showOverlay: boolean = true;
  export let showPlayButton: boolean = true;
  
  // Props untuk PlayButton
  export let playButtonSize: 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  export let playButtonColor: 'primary' | 'secondary' | 'red' | 'blue' | 'green' = 'primary';
  export let pingDelay1: number = 0.5;
  export let pingDelay2: number = 1.5;
  export let pingOpacity: number = 0.8;
  export let showPingAnimation: boolean = true;
  
  // Props untuk styling
  export let containerClass: string = '';
  export let imageClass: string = '';
  export let overlayClass: string = '';
  
  // Keyboard event handler
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  }
</script>

<div
  class="group relative aspect-video w-full cursor-pointer overflow-hidden {containerClass}"
  on:click={onClick}
  on:keydown={handleKeydown}
  role="button"
  tabindex="0"
  aria-label="Play video"
>
  <img 
    {src} 
    {alt} 
    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 {imageClass}" 
  />

  {#if showOverlay}
    <div class="absolute inset-0 bg-black/20 transition-all duration-300 group-hover:bg-black/30 {overlayClass}">
      {#if showPlayButton}
        <!-- Play button overlay -->
        <PlayButton 
          size={playButtonSize}
          color={playButtonColor}
          {pingDelay1}
          {pingDelay2}
          {pingOpacity}
          showPingAnimation={showPingAnimation}
          on:click={onClick} 
        />
      {:else}
        <!-- Custom overlay content -->
        <div class="absolute inset-0 flex items-center justify-center">
          <slot name="overlay" />
        </div>
      {/if}
    </div>
  {/if}
</div>
