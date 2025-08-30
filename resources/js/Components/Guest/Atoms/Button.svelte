<script>
  export let variant = 'primary'; // primary, secondary, outline, ghost
  export let size = 'md'; // sm, md, lg
  export let disabled = false;
  export let type = 'button';
  export let href = null;
  export let target = null;
  export let onclick = null;

  $: baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  $: variantClasses = {
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
    ghost: 'text-red-600 hover:bg-red-50 focus:ring-red-500'
  };
  
  $: sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg'
  };
  
  $: classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
</script>

{#if href}
  <a {href} {target} class={classes} on:click={onclick}>
    <slot />
  </a>
{:else}
  <button {type} {disabled} class={classes} on:click={onclick}>
    <slot />
  </button>
{/if}