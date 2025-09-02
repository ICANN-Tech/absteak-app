<script>
  export let size = 'md'; // sm, md, lg
  export let variant = 'full'; // full, icon, text
  export let href = '/';
  
  $: sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };
  
  $: textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };
</script>

<a {href} class="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors">
  {#if variant === 'full' || variant === 'icon'}
    <!-- SVG Logo Icon -->
    <svg class={sizeClasses[size]} viewBox="0 0 40 40" fill="currentColor">
      <path d="M20 2L35 12v16L20 38L5 28V12L20 2z" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="20" cy="20" r="6" fill="currentColor"/>
      <path d="M14 16l6 4 6-4" stroke="white" stroke-width="1.5" fill="none"/>
    </svg>
  {/if}
  
  {#if variant === 'full' || variant === 'text'}
    <span class="font-bold {textSizeClasses[size]} tracking-tight">
      AB<span class="text-gray-800">Steak</span>
    </span>
  {/if}
</a>