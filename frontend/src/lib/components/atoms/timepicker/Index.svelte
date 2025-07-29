<script context="module" lang="ts">
  // Types
  export interface TimeSlot {
    time: string;
    available: boolean;
    label?: string;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { 
    getTimepickerContainerClasses, 
    getTimepickerSlotClasses,
    getLabelClasses,
    UI_MESSAGES,
    UI_LABELS,
    type UI_VARIANTS
  } from '$lib/const/ui';

  // Props
  export let timeSlots: TimeSlot[] = [];
  export let selectedTime: string = '';
  export let label: string = '';
  export let variant: keyof typeof UI_VARIANTS = 'default';
  export let columns: number = 4;
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let error: string = '';
  export let success: string = '';
  export let id: string = '';
  export let name: string = '';

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    timeSelected: { time: string; slot: TimeSlot };
    timeUnselected: { time: string; slot: TimeSlot };
  }>();

  // Internal selected time state
  let internalSelectedTime = selectedTime;

  // Sync with external selectedTime prop
  $: internalSelectedTime = selectedTime;

  // Reactive classes
  $: containerClasses = getTimepickerContainerClasses(variant, columns);
  $: labelClasses = getLabelClasses(variant);

  // Handle time slot selection with toggle functionality
  function selectTimeSlot(time: string) {
    if (disabled) return;
    
    const slot = timeSlots.find((slot) => slot.time === time);
    if (slot && slot.available) {
      // Toggle selection: if already selected, unselect it
      if (internalSelectedTime === time) {
        internalSelectedTime = '';
        selectedTime = '';
        dispatch('timeUnselected', { time, slot });
      } else {
        // Select the time slot
        internalSelectedTime = time;
        selectedTime = time;
        dispatch('timeSelected', { time, slot });
      }
    }
  }

  // Get slot state for styling - dibuat reactive
  $: getSlotState = (slot: TimeSlot) => {
    if (!slot.available) return 'unavailable';
    if (internalSelectedTime === slot.time) return 'selected';
    return 'available';
  };

  // Get slot classes - dibuat reactive
  $: getSlotClasses = (slot: TimeSlot) => {
    const state = getSlotState(slot);
    return getTimepickerSlotClasses(variant, state);
  };
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

<!-- Time Picker Container -->
<div class={containerClasses} {id}>
  {#each timeSlots as slot (slot.time + internalSelectedTime)}
    <button
      type="button"
      class={getTimepickerSlotClasses(variant, 
        !slot.available ? 'unavailable' : 
        internalSelectedTime === slot.time ? 'selected' : 
        'available'
      )}
      disabled={!slot.available || disabled}
      on:click={() => selectTimeSlot(slot.time)}
      aria-pressed={internalSelectedTime === slot.time}
      aria-label={slot.label || `Pilih waktu ${slot.time}`}
    >
      <span class="p-1 text-xs">{slot.time}</span>
      {#if slot.label}
        <span class="block text-xs opacity-75">{slot.label}</span>
      {/if}
    </button>
  {/each}
</div>

<!-- Hidden input for form submission -->
{#if name}
  <input type="hidden" {name} value={selectedTime} />
{/if}

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