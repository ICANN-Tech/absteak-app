<script>
  export let size = 'md'; // sm, md, lg, xl
  export let variant = 'full'; // full, icon, text
  export let message = 'Loading...'; // Loading message
  export let showMessage = true; // Show/hide loading message
  export let animationType = 'pulse'; // pulse, spin, bounce
  
  $: sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  $: textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };
  
  $: animationClasses = {
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce'
  };
  
  $: containerSizeClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-5'
  };
</script>

<div class="flex flex-col items-center justify-center {containerSizeClasses[size]}">
  <!-- Loading Icon with Logo Design -->
  <div class="relative {sizeClasses[size]} text-red-600">
    {#if variant === 'full' || variant === 'icon'}
      <!-- Main Logo SVG with Animation -->
      <svg 
        class="{sizeClasses[size]} {animationClasses[animationType]}" 
        viewBox="0 0 40 40" 
        fill="currentColor"
      >
        <!-- Outer hexagon with animated stroke -->
        <path 
          d="M20 2L35 12v16L20 38L5 28V12L20 2z" 
          stroke="currentColor" 
          stroke-width="2" 
          fill="none"
          class="animate-pulse"
        />
        
        <!-- Center circle with pulsing animation -->
        <circle 
          cx="20" 
          cy="20" 
          r="6" 
          fill="currentColor"
          class="animate-pulse"
        />
        
        <!-- Inner accent with subtle animation -->
        <path 
          d="M14 16l6 4 6-4" 
          stroke="white" 
          stroke-width="1.5" 
          fill="none"
          class="animate-pulse"
        />
      </svg>
      
      <!-- Rotating outer ring for enhanced loading effect -->
      {#if animationType === 'spin'}
        <div class="absolute inset-0 {sizeClasses[size]}">
          <svg 
            class="{sizeClasses[size]} animate-spin text-red-300" 
            viewBox="0 0 40 40" 
            fill="none"
          >
            <circle 
              cx="20" 
              cy="20" 
              r="18" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-dasharray="20 60" 
              stroke-linecap="round"
            />
          </svg>
        </div>
      {/if}
    {/if}
    
    {#if variant === 'full' || variant === 'text'}
      <!-- Animated text logo -->
      <div class="flex items-center justify-center mt-2">
        <span class="font-bold {textSizeClasses[size]} tracking-tight text-red-600">
          <span class="inline-block animate-pulse">AB</span><span class="inline-block text-gray-800 animate-pulse" style="animation-delay: 0.2s;">Steak</span>
        </span>
      </div>
    {/if}
  </div>
  
  <!-- Loading Message -->
  {#if showMessage && message}
    <div class="text-center">
      <p class="{textSizeClasses[size]} text-gray-600 animate-pulse font-medium">
        {message}
      </p>
      
      <!-- Animated dots -->
      <div class="flex justify-center space-x-1 mt-1">
        <div class="w-1 h-1 bg-red-600 rounded-full animate-bounce"></div>
        <div class="w-1 h-1 bg-red-600 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
        <div class="w-1 h-1 bg-red-600 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Custom animations for enhanced loading effects */
  @keyframes fadeInOut {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  
  @keyframes scaleInOut {
    0%, 100% { transform: scale(0.95); }
    50% { transform: scale(1.05); }
  }
  
  /* Enhanced pulse animation */
  .animate-pulse {
    animation: fadeInOut 2s ease-in-out infinite;
  }
  
  /* Smooth bounce for dots */
  .animate-bounce {
    animation: bounce 1.4s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      transform: translate3d(0, -8px, 0);
    }
    70% {
      transform: translate3d(0, -4px, 0);
    }
    90% {
      transform: translate3d(0, -2px, 0);
    }
  }
</style>