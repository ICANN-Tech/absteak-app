<script>
  import Icon from '../Atoms/Icon.svelte';
  
  export let position = 'bottom-right'; // bottom-right, bottom-left, top-right, top-left
  export let icon = 'phone';
  export let href = null;
  export let onclick = null;
  export let tooltip = '';
  export let variant = 'primary'; // primary, secondary
  
  let showTooltip = false;
  
  $: positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };
  
  $: variantClasses = {
    primary: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white hover:bg-gray-50 text-red-600 shadow-lg hover:shadow-xl border border-gray-200'
  };
  
  $: buttonClasses = `fixed z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${positionClasses[position]} ${variantClasses[variant]}`;
  
  function handleClick() {
    if (onclick) {
      onclick();
    }
  }
  
  function showTooltipHandler() {
    if (tooltip) {
      showTooltip = true;
    }
  }
  
  function hideTooltipHandler() {
    showTooltip = false;
  }
</script>

{#if href}
  <a 
    {href}
    class={buttonClasses}
    on:mouseenter={showTooltipHandler}
    on:mouseleave={hideTooltipHandler}
    on:focus={showTooltipHandler}
    on:blur={hideTooltipHandler}
  >
    <Icon name={icon} size="lg" />
  </a>
{:else}
  <button 
    class={buttonClasses}
    on:click={handleClick}
    on:mouseenter={showTooltipHandler}
    on:mouseleave={hideTooltipHandler}
    on:focus={showTooltipHandler}
    on:blur={hideTooltipHandler}
  >
    <Icon name={icon} size="lg" />
  </button>
{/if}

<!-- Tooltip -->
{#if tooltip && showTooltip}
  <div 
    class="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none transition-opacity duration-200"
    class:bottom-20={position.includes('bottom')}
    class:top-20={position.includes('top')}
    class:right-6={position.includes('right')}
    class:left-6={position.includes('left')}
  >
    {tooltip}
    <div 
      class="absolute w-2 h-2 bg-gray-900 transform rotate-45 left-1/2 -translate-x-1/2"
      class:bottom-[-4px]={position.includes('bottom')}
      class:top-[-4px]={position.includes('top')}
    ></div>
  </div>
{/if}