<script lang="ts">
  import { fly, slide, fade, scale, blur } from 'svelte/transition';
  import { quintOut, elasticOut, bounceOut, backOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  export let message: string = '';
  export let type: 'success' | 'error' | 'warning' | 'info' = 'info';
  export let dismissible: boolean = true;
  export let autohide: boolean = true;
  export let timeout: number = 3000;
  export let position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let variant: 'default' | 'elegant' | 'minimal' = 'elegant';
  export let animation: 'fly' | 'slide' | 'fade' | 'scale' | 'blur' | 'bounce' | 'elastic' | 'flip' = 'slide';
  export let animationDuration: number = 400;
  export let animationEasing: 'quintOut' | 'elasticOut' | 'bounceOut' | 'backOut' = 'quintOut';
  export let onclose: (() => void) | undefined = undefined;

  let visible = true;
  let id = '';

  // Generate unique id
  onMount(() => {
    id = `toast-${Math.random().toString(36).substring(2, 9)}`;
  });

  // Auto hide functionality
  if (autohide && timeout > 0) {
    setTimeout(() => {
      visible = false;
      onclose?.();
    }, timeout);
  }

  // Type configurations
  const typeConfig = {
    success: {
      bgColor: 'bg-emerald-500/90',
      borderColor: 'border-emerald-400',
      textColor: 'text-white',
      iconColor: 'text-emerald-100',
      glowColor: 'shadow-emerald-500/25',
      icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
    },
    error: {
      bgColor: 'bg-red-500/90',
      borderColor: 'border-red-400',
      textColor: 'text-white',
      iconColor: 'text-red-100',
      glowColor: 'shadow-red-500/25',
      icon: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
    },
    warning: {
      bgColor: 'bg-amber-500/90',
      borderColor: 'border-amber-400',
      textColor: 'text-white',
      iconColor: 'text-amber-100',
      glowColor: 'shadow-amber-500/25',
      icon: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
    },
    info: {
      bgColor: 'bg-blue-500/90',
      borderColor: 'border-blue-400',
      textColor: 'text-white',
      iconColor: 'text-blue-100',
      glowColor: 'shadow-blue-500/25',
      icon: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'px-3 py-2',
      iconSize: 'w-4 h-4',
      textSize: 'text-sm',
      closeSize: 'w-6 h-6',
      closeIconSize: 'w-3 h-3'
    },
    md: {
      padding: 'px-4 py-3',
      iconSize: 'w-5 h-5',
      textSize: 'text-base',
      closeSize: 'w-8 h-8',
      closeIconSize: 'w-4 h-4'
    },
    lg: {
      padding: 'px-6 py-4',
      iconSize: 'w-6 h-6',
      textSize: 'text-lg',
      closeSize: 'w-10 h-10',
      closeIconSize: 'w-5 h-5'
    }
  };

  // Position classes
  const positionClasses = {
    'top-left': 'fixed top-5 left-5 z-50',
    'top-right': 'fixed top-5 right-5 z-50', 
    'bottom-left': 'fixed bottom-5 left-5 z-50',
    'bottom-right': 'fixed bottom-5 right-5 z-50'
  };

  // Easing functions mapping
  const easingMap = {
    quintOut,
    elasticOut,
    bounceOut,
    backOut
  };

  // Animation configurations
  const getAnimationConfig = () => {
    const easing = easingMap[animationEasing];
    const duration = animationDuration;
    
    switch (animation) {
      case 'fly':
        return {
          transition: fly,
          params: {
            y: position.includes('top') ? -50 : 50,
            x: position.includes('left') ? -50 : position.includes('right') ? 50 : 0,
            duration,
            easing
          }
        };
      case 'slide':
        return {
          transition: slide,
          params: {
            duration,
            easing
          }
        };
      case 'fade':
        return {
          transition: fade,
          params: {
            duration,
            easing
          }
        };
      case 'scale':
        return {
          transition: scale,
          params: {
            duration,
            easing,
            start: 0.8
          }
        };
      case 'blur':
        return {
          transition: blur,
          params: {
            duration,
            easing,
            amount: 10
          }
        };
      case 'bounce':
        return {
          transition: scale,
          params: {
            duration: duration * 1.2,
            easing: bounceOut,
            start: 0.3
          }
        };
      case 'elastic':
        return {
          transition: scale,
          params: {
            duration: duration * 1.5,
            easing: elasticOut,
            start: 0.1
          }
        };
      case 'flip':
        return {
          transition: fly,
          params: {
            y: position.includes('top') ? -100 : 100,
            duration,
            easing
          }
        };
      default:
        return {
          transition: fly,
          params: {
            y: position.includes('top') ? -50 : 50,
            duration,
            easing
          }
        };
    }
  };

  // Generate toast classes
  $: toastClasses = [
    // Base styles
    'flex items-center gap-3 rounded-xl border backdrop-blur-md',
    'transition-all duration-300 ease-out',
    'shadow-lg',
    
    // Type-specific styles
    typeConfig[type].bgColor,
    typeConfig[type].borderColor,
    typeConfig[type].textColor,
    typeConfig[type].glowColor,
    
    // Size-specific styles
    sizeConfig[size].padding,
    sizeConfig[size].textSize,
    
    // Variant-specific styles
    variant === 'elegant' ? 'elegant-toast' : '',
    variant === 'minimal' ? 'minimal-toast' : '',
    
    // Animation-specific styles
    animation === 'flip' ? 'transform-gpu' : ''
  ].filter(Boolean).join(' ');

  // Get current animation configuration
  $: animationConfig = getAnimationConfig();

  function handleClose() {
    visible = false;
    onclose?.();
  }
</script>

{#if visible}
  <div 
    class={positionClasses[position]}
  >
    {#key animation}
      {#if animation === 'slide'}
        <div 
          {id}
          class={toastClasses}
          role="alert"
          aria-live="polite"
          transition:slide|global={animationConfig.params}
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <svg 
              class="{sizeConfig[size].iconSize} {typeConfig[type].iconColor}" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fill-rule="evenodd" 
                d={typeConfig[type].icon} 
                clip-rule="evenodd" 
              />
            </svg>
          </div>
          
          <!-- Message -->
          <div class="flex-1 font-medium">
            {message}
          </div>
          
          <!-- Close button -->
          {#if dismissible}
            <button 
              type="button" 
              class="flex-shrink-0 {sizeConfig[size].closeSize} flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              on:click={handleClose}
              aria-label="Close notification"
            >
              <svg 
                class="{sizeConfig[size].closeIconSize}" 
                fill="none" 
                viewBox="0 0 14 14"
              >
                <path 
                  stroke="currentColor" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          {/if}
        </div>
      {:else if animation === 'fade'}
        <div 
          {id}
          class={toastClasses}
          role="alert"
          aria-live="polite"
          transition:fade|global={animationConfig.params}
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <svg 
              class="{sizeConfig[size].iconSize} {typeConfig[type].iconColor}" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fill-rule="evenodd" 
                d={typeConfig[type].icon} 
                clip-rule="evenodd" 
              />
            </svg>
          </div>
          
          <!-- Message -->
          <div class="flex-1 font-medium">
            {message}
          </div>
          
          <!-- Close button -->
          {#if dismissible}
            <button 
              type="button" 
              class="flex-shrink-0 {sizeConfig[size].closeSize} flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              on:click={handleClose}
              aria-label="Close notification"
            >
              <svg 
                class="{sizeConfig[size].closeIconSize}" 
                fill="none" 
                viewBox="0 0 14 14"
              >
                <path 
                  stroke="currentColor" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          {/if}
        </div>
      {:else if animation === 'scale' || animation === 'bounce' || animation === 'elastic'}
        <div 
          {id}
          class={toastClasses}
          role="alert"
          aria-live="polite"
          transition:scale|global={animationConfig.params}
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <svg 
              class="{sizeConfig[size].iconSize} {typeConfig[type].iconColor}" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fill-rule="evenodd" 
                d={typeConfig[type].icon} 
                clip-rule="evenodd" 
              />
            </svg>
          </div>
          
          <!-- Message -->
          <div class="flex-1 font-medium">
            {message}
          </div>
          
          <!-- Close button -->
          {#if dismissible}
            <button 
              type="button" 
              class="flex-shrink-0 {sizeConfig[size].closeSize} flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              on:click={handleClose}
              aria-label="Close notification"
            >
              <svg 
                class="{sizeConfig[size].closeIconSize}" 
                fill="none" 
                viewBox="0 0 14 14"
              >
                <path 
                  stroke="currentColor" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          {/if}
        </div>
      {:else if animation === 'blur'}
        <div 
          {id}
          class={toastClasses}
          role="alert"
          aria-live="polite"
          transition:blur|global={animationConfig.params}
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <svg 
              class="{sizeConfig[size].iconSize} {typeConfig[type].iconColor}" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fill-rule="evenodd" 
                d={typeConfig[type].icon} 
                clip-rule="evenodd" 
              />
            </svg>
          </div>
          
          <!-- Message -->
          <div class="flex-1 font-medium">
            {message}
          </div>
          
          <!-- Close button -->
          {#if dismissible}
            <button 
              type="button" 
              class="flex-shrink-0 {sizeConfig[size].closeSize} flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              on:click={handleClose}
              aria-label="Close notification"
            >
              <svg 
                class="{sizeConfig[size].closeIconSize}" 
                fill="none" 
                viewBox="0 0 14 14"
              >
                <path 
                  stroke="currentColor" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          {/if}
        </div>
      {:else}
        <div 
          {id}
          class={toastClasses}
          role="alert"
          aria-live="polite"
          transition:fly|global={animationConfig.params}
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <svg 
              class="{sizeConfig[size].iconSize} {typeConfig[type].iconColor}" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fill-rule="evenodd" 
                d={typeConfig[type].icon} 
                clip-rule="evenodd" 
              />
            </svg>
          </div>
          
          <!-- Message -->
          <div class="flex-1 font-medium">
            {message}
          </div>
          
          <!-- Close button -->
          {#if dismissible}
            <button 
              type="button" 
              class="flex-shrink-0 {sizeConfig[size].closeSize} flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              on:click={handleClose}
              aria-label="Close notification"
            >
              <svg 
                class="{sizeConfig[size].closeIconSize}" 
                fill="none" 
                viewBox="0 0 14 14"
              >
                <path 
                  stroke="currentColor" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          {/if}
        </div>
      {/if}
    {/key}
  </div>
{/if}