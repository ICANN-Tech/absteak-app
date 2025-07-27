<script context="module" lang="ts">
  // Types
  export interface StepperStep {
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
    completed?: boolean;
    active?: boolean;
    disabled?: boolean;
  }

  export type StepperVariant = 'default' | 'elegant' | 'minimal';
  export type StepperOrientation = 'horizontal' | 'vertical';
  export type StepperType = 'numbered' | 'icon' | 'progress';
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { 
    getStepperContainerClasses,
    getStepperIndicatorClasses,
    getStepperConnectorClasses,
    getLabelClasses,
    UI_MESSAGES,
    UI_LABELS,
    type UI_VARIANTS
  } from '$lib/const/ui';

  // Props
  export let steps: StepperStep[] = [];
  export let currentStep: number = 0;
  export let variant: StepperVariant = 'default';
  export let orientation: StepperOrientation = 'horizontal';
  export let type: StepperType = 'numbered';
  export let label: string = '';
  export let clickable: boolean = true;
  export let showConnector: boolean = true;
  export let disabled: boolean = false;
  export let error: string = '';
  export let success: string = '';
  export let id: string = '';
  export let classes: {
    container?: string;
    step?: string;
    connector?: string;
    content?: string;
  } = {};

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    stepClick: { step: StepperStep; index: number };
    stepChange: { step: StepperStep; index: number };
  }>();

  // Reactive classes
  $: containerClasses = getStepperContainerClasses(variant, orientation) + ` ${classes.container || ''}`;
  $: labelClasses = getLabelClasses(variant as keyof typeof UI_VARIANTS);

  // Get step classes
  function getStepClasses(step: StepperStep, index: number): string {
    // Additional stepper-specific classes
    const stepClasses = orientation === 'horizontal' 
      ? 'flex flex-col items-center text-center'
      : 'flex items-center space-x-3';

    return `${stepClasses} ${classes.step || ''}`;
  }

  // Get connector classes
  function getConnectorClasses(index: number): string {
    const isCompleted = index < currentStep;
    return getStepperConnectorClasses(variant, orientation, isCompleted) + ` ${classes.connector || ''}`;
  }

  // Handle step click
  function handleStepClick(step: StepperStep, index: number) {
    if (!clickable || step.disabled || disabled) return;
    
    dispatch('stepClick', { step, index });
    
    if (index !== currentStep) {
      currentStep = index;
      dispatch('stepChange', { step, index });
    }
  }

  // Get step indicator content
  function getStepIndicator(step: StepperStep, index: number): string {
    if (type === 'icon' && step.icon) {
      return step.icon;
    }
    if (type === 'progress' && (step.completed || index < currentStep)) {
      return '✓';
    }
    return (index + 1).toString();
  }

  // Get step indicator classes
  function getLocalStepIndicatorClasses(step: StepperStep, index: number): string {
    const isActive = index === currentStep;
    const isCompleted = step.completed || index < currentStep;
    
    const state = isCompleted ? 'completed' : isActive ? 'active' : 'inactive';
    return getStepperIndicatorClasses(variant, state);
  }
</script>

<!-- Label -->
{#if label}
  <label for={id} class={labelClasses}>
    {label}
  </label>
{/if}

<!-- Stepper Container -->
<div class={containerClasses} {id}>
  {#each steps as step, index (step.id)}
    <!-- Step -->
    <div 
      class={getStepClasses(step, index)}
      role="button"
      tabindex={clickable && !step.disabled && !disabled ? 0 : -1}
      on:click={() => handleStepClick(step, index)}
      on:keydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStepClick(step, index);
        }
      }}
      aria-current={index === currentStep ? 'step' : undefined}
      aria-disabled={step.disabled || disabled}
    >
      <!-- Step Indicator -->
      <div class={getLocalStepIndicatorClasses(step, index)}>
        {#if type === 'icon' && step.icon}
          <i class={step.icon}></i>
        {:else if type === 'progress' && (step.completed || index < currentStep)}
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        {:else}
          {index + 1}
        {/if}
      </div>

      <!-- Step Content -->
      <div class={`${orientation === 'horizontal' ? 'mt-2' : 'ml-3'} ${classes.content || ''}`}>
        <div class="text-sm text-white font-medium">
          {step.title}
        </div>
      </div>
    </div>

    <!-- Connector -->
    {#if showConnector && index < steps.length - 1}
      <div class={getConnectorClasses(index)}></div>
    {/if}
  {/each}
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