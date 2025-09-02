<script lang="ts">
  // Props for thumbnail
  export let src: string;
  export let alt: string = 'Video thumbnail';
  export let onClick: () => void;
  export let showOverlay: boolean = true;
  export let showPlayButton: boolean = true;
  
  // Props for play button
  export let playButtonSize: 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  
  // Props for styling
  export let containerClass: string = '';
  export let imageClass: string = '';
  export let overlayClass: string = '';
  
  // Size mapping for play button
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };
  
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
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="{sizeMap[playButtonSize]} flex items-center justify-center rounded-full bg-white/90 shadow-lg transition-all duration-300 hover:bg-white hover:scale-110">
            <svg class="w-1/2 h-1/2 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      {:else}
        <!-- Custom overlay content -->
        <div class="absolute inset-0 flex items-center justify-center">
          <slot name="overlay" />
        </div>
      {/if}
    </div>
  {/if}
</div>
