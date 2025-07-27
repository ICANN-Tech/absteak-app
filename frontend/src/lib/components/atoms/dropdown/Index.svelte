<script lang="ts">
  import { Select } from 'flowbite-svelte';
  import { onMount, createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { 
    getDropdownClasses, 
    getLabelClasses, 
    UI_ICONS, 
    UI_MESSAGES,
    DROPDOWN_MENU,
    DROPDOWN_OPTION,
    DROPDOWN_SEARCH,
    DROPDOWN_BUTTON
  } from '$lib/const/ui';

  const dispatch = createEventDispatcher();

  export let label = '';
  export let placeholder = 'Select an option...';
  export let value: string | number = '';
  export let options: Array<{ value: string | number; label: string; disabled?: boolean }> = [];
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let error: string = '';
  export let success: string = '';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let name: string = '';
  export let id: string = '';
  export let variant: 'default' | 'elegant' | 'minimal' = 'elegant';
  export let icon: string = '';
  export let searchable: boolean = false;
  export let clearable: boolean = false;
  export let multiple: boolean = false;

  let isOpen = false;
  let searchTerm = '';
  let dropdownRef: HTMLDivElement;
  let selectRef: HTMLSelectElement;

  // Generate unique id if not provided
  onMount(() => {
    if (!id) {
      id = `dropdown-${Math.random().toString(36).substring(2, 9)}`;
    }
  });

  // Generate dropdown classes using UI constants
  $: selectClasses = getDropdownClasses(size, variant, {
    error: !!error,
    success: !!success,
    disabled
  });

  // Generate label classes using UI constants
  $: labelClasses = getLabelClasses(variant);

  // Generate menu classes
  $: menuClasses = `${DROPDOWN_MENU.base} ${DROPDOWN_MENU[variant]}`;

  // Generate search input classes
  $: searchInputClasses = `${DROPDOWN_SEARCH.input} ${DROPDOWN_SEARCH[variant]}`;

  // Filter options based on search term
  $: filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get selected option label
  $: selectedLabel = options.find(option => option.value === value)?.label || placeholder;

  function toggleDropdown() {
    if (!disabled) {
      isOpen = !isOpen;
    }
  }

  function selectOption(option: typeof options[0]) {
    if (!option.disabled) {
      value = option.value;
      isOpen = false;
      searchTerm = '';
      dispatch('change', { value: option.value, label: option.label });
    }
  }

  function clearSelection() {
    value = '';
    dispatch('change', { value: '', label: '' });
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false;
    }
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      isOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="flex flex-col gap-2" bind:this={dropdownRef}>
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
      <div class="{UI_ICONS.position} {UI_ICONS.color} z-10">
        <i class="{icon} {UI_ICONS.size}"></i>
      </div>
    {/if}

    <!-- Custom Dropdown Button -->
    <button
      type="button"
      {id}
      class="{selectClasses} dropdown-button {variant === 'elegant' ? 'dropdown-elegant' : ''}"
      style={icon ? 'padding-left: 2.5rem;' : ''}
      on:click={toggleDropdown}
      {disabled}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      {...$$restProps}
    >
      <div class="flex items-center justify-between">
        <span class={value ? DROPDOWN_OPTION.text[variant] : 'text-gray-400'}>
          {selectedLabel}
        </span>
        <div class="flex items-center gap-2">
          {#if clearable && value}
            <button
              type="button"
              class={DROPDOWN_BUTTON.clear}
              on:click|stopPropagation={clearSelection}
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          {/if}
          <svg 
            class="{DROPDOWN_BUTTON.arrow} {isOpen ? 'rotate-180' : ''}" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </button>

    <!-- Dropdown Menu -->
    {#if isOpen}
      <div 
        class={menuClasses}
        transition:slide={{ duration: 200, easing: quintOut }}
      >
        {#if searchable}
          <div class="{DROPDOWN_SEARCH.container} {variant === 'elegant' ? 'border-gray-700/50' : 'border-gray-200'}">
            <input
              type="text"
              placeholder="Search options..."
              bind:value={searchTerm}
              class={searchInputClasses}
            />
          </div>
        {/if}

        <div class="max-h-48 overflow-y-auto custom-scrollbar">
          {#if filteredOptions.length === 0}
            <div class="px-4 py-3 text-sm {variant === 'elegant' ? 'text-gray-400' : 'text-gray-500'}">
              No options found
            </div>
          {:else}
            {#each filteredOptions as option, index}
              <button
                type="button"
                class="{DROPDOWN_OPTION.base}
                  {option.disabled ? DROPDOWN_OPTION.disabled : 'cursor-pointer'}
                  {DROPDOWN_OPTION.hover[variant]}
                  {value === option.value ? DROPDOWN_OPTION.selected[variant] : DROPDOWN_OPTION.text[variant]}"
                on:click={() => selectOption(option)}
                disabled={option.disabled}
                in:fade={{ duration: 150, delay: index * 20 }}
              >
                <span>{option.label}</span>
                {#if value === option.value}
                  <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                {/if}
              </button>
            {/each}
          {/if}
        </div>
      </div>
    {/if}

    <!-- Hidden select for form submission -->
    <select
      bind:this={selectRef}
      {name}
      {required}
      bind:value
      class="sr-only"
      tabindex="-1"
      aria-hidden="true"
    >
      <option value="">Select an option</option>
      {#each options as option}
        <option value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      {/each}
    </select>
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
  /* Custom scrollbar untuk dropdown */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #f59e0b, #d97706);
    border-radius: 3px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #fbbf24, #f59e0b);
  }

  /* Enhanced focus styles */
  button:focus {
    outline: 2px solid rgba(245, 158, 11, 0.5);
    outline-offset: 2px;
  }

  /* Smooth transitions */
  * {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Enhanced backdrop blur */
  .backdrop-blur-sm {
    backdrop-filter: blur(8px) saturate(1.2);
  }

  /* Enhanced ring effects untuk dropdown */
  :global(button:focus) {
    animation: ringPulse 0.6s ease-out;
  }

  :global(button:active) {
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

  /* Glow effect untuk dropdown elegant variant */
  :global(.dropdown-elegant:focus) {
    box-shadow: 
      0 0 0 4px rgba(245, 158, 11, 0.4),
      0 0 20px rgba(245, 158, 11, 0.3),
      0 0 40px rgba(245, 158, 11, 0.1);
  }

  :global(.dropdown-elegant:active) {
    box-shadow: 
      0 0 0 6px rgba(245, 158, 11, 0.6),
      0 0 30px rgba(245, 158, 11, 0.4),
      0 0 60px rgba(245, 158, 11, 0.2);
  }

  /* Click effect untuk dropdown button */
  :global(.dropdown-button:active) {
    transform: scale(0.98);
    transition: transform 0.1s ease-out;
  }
</style>