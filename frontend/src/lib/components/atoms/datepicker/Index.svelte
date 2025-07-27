<script lang="ts">
  import { Datepicker } from 'flowbite-svelte';
  import { 
    getDatepickerClasses, 
    getDatepickerVariantClasses,
    getLabelClasses,
    UI_MESSAGES,
    UI_LABELS,
    type UI_VARIANTS
  } from '$lib/const/ui';

  // Props
  export let value: Date | undefined = undefined;
  export let label: string = '';
  export let placeholder: string = 'Pilih tanggal';
  export let variant: keyof typeof UI_VARIANTS = 'default';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let error: string = '';
  export let success: string = '';
  export let name: string = '';
  export let id: string = '';
  export let inline: boolean = true;
  export let closeOnSelect: boolean = true;
  export let autoHide: boolean = true;
  export let todayBtn: boolean = true;
  export let clearBtn: boolean = true;
  export let weekStart: number = 1; // 1 = Monday
  export let format: string = 'dd/mm/yyyy';
  export let minDate: Date | undefined = undefined;
  export let maxDate: Date | undefined = undefined;

  // Reactive classes
  $: containerClasses = getDatepickerClasses(variant);
  $: variantClasses = getDatepickerVariantClasses(variant);
  $: labelClasses = getLabelClasses(variant);
</script>

<!-- Label -->
{#if label}
  <label for={id} class={labelClasses}>
    {label}
    {#if required}
      <span class={UI_LABELS.required}>*</span>
    {/if}
  </label>
{/if}

<!-- Datepicker Container -->
<div class="relative">
  <Datepicker
    bind:value
    {placeholder}
    {disabled}
    {inline}
    class={containerClasses}
    classes={{
      columnHeader: variantClasses.columnHeader,
      input: variantClasses.input,
      button: variantClasses.button,
      actionButtons: variantClasses.actionButtons,
      polite: variantClasses.polite,
      dayButton: variantClasses.dayButton,
      titleVariant: variantClasses.titleVariant,
      monthButton: variantClasses.monthButton
    }}
  />
</div>

<!-- Error Message -->
{#if error}
  <div class={UI_MESSAGES.error}>
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
    </svg>
    <span>{error}</span>
  </div>
{/if}

<!-- Success Message -->
{#if success}
  <div class={UI_MESSAGES.success}>
    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    </svg>
    <span>{success}</span>
  </div>
{/if}