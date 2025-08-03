<script lang="ts">
  import { Input } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import { getInputClasses, getLabelClasses, UI_ICONS, UI_MESSAGES } from '$lib/const/ui';

  export let label = '';
  export let placeholder = '';
  export let value: string = '';
  export let type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' = 'text';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let error: string = '';
  export let success: string = '';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let name: string = '';
  export let id: string = '';
  export let variant: 'default' | 'elegant' | 'minimal' = 'elegant';
  export let icon: string = '';
  export let readonly: boolean = false;
  export let className: string = '';

  // Generate unique id if not provided
  onMount(() => {
    if (!id) {
      id = `input-${Math.random().toString(36).substring(2, 9)}`;
    }
  });

  // Generate input classes using UI constants
  $: inputClasses = getInputClasses(size, variant, {
    error: !!error,
    success: !!success,
    disabled,
    readonly
  });

  // Generate label classes using UI constants
  $: labelClasses = getLabelClasses(variant);
</script>

<div class="flex flex-col gap-2">
  {#if label}
    <label 
      for={id} 
      class={labelClasses}
    >
      {label}
      {#if required}
        <span class="text-amber-400 ml-1">*</span>
      {/if}
    </label>
  {/if}

  <div class="relative">
    {#if icon}
      <div class="{UI_ICONS.position} {UI_ICONS.color[variant]}">
        <i class="{icon} {UI_ICONS.size}"></i>
      </div>
    {/if}
    <Input
      {id}
      {type}
      {placeholder}
      bind:value
      {name}
      {required}
      {disabled}
      {readonly}
      class="{inputClasses} {className} {variant === 'elegant' ? 'elegant-variant' : ''}"
      style={icon ? 'padding-left: 2.5rem;' : ''}
      {...$$restProps}
    />
  </div>

  {#if error}
    <div class={UI_MESSAGES.error}>
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <span>{error}</span>
    </div>
  {/if}

  {#if success}
    <div class={UI_MESSAGES.success}>
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <span>{success}</span>
    </div>
  {/if}
</div>

<style>
  /* Custom focus styles untuk elegant variant */
  :global(.elegant-input:focus) {
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1), 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  /* Smooth transitions */
  :global(.elegant-input) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Enhanced backdrop blur */
  :global(.elegant-input) {
    backdrop-filter: blur(8px) saturate(1.2);
  }

  /* Enhanced ring effects */
  :global(input:focus) {
    animation: ringPulse 0.6s ease-out;
  }

  :global(input:active) {
    animation: ringFlash 0.3s ease-out;
  }

  @keyframes ringPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
    }
  }

  @keyframes ringFlash {
    0% {
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.8);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(245, 158, 11, 0.4);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
    }
  }

  /* Glow effect untuk variant elegant */
  :global(.elegant-variant:focus) {
    box-shadow: 
      0 0 0 4px rgba(245, 158, 11, 0.4),
      0 0 20px rgba(245, 158, 11, 0.3),
      0 0 40px rgba(245, 158, 11, 0.1);
  }

  :global(.elegant-variant:active) {
    box-shadow: 
      0 0 0 6px rgba(245, 158, 11, 0.6),
      0 0 30px rgba(245, 158, 11, 0.4),
      0 0 60px rgba(245, 158, 11, 0.2);
  }
</style>
