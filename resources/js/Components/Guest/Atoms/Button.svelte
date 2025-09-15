<script lang="ts">
  import { Button as FBButton } from 'flowbite-svelte';

  // Type definitions
  type ButtonVariant = 'primary' | 'danger' | 'success' | 'warning' | 'info';
  type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  type ButtonType = 'button' | 'submit' | 'reset';

  // Props with proper TypeScript annotations
  export let variant: ButtonVariant = 'primary';
  export let type: ButtonType = 'button';
  export let disabled: boolean = false;
  export let className: string = '';
  export let href: string | undefined = undefined;
  export let pill: boolean = false; // Support for circle/pill button
  export let size: ButtonSize = 'lg'; // Support for button sizes
  export let circle: boolean = false; // Support for circle button (shorthand for pill + square)

  // Flowbite Button color type
  type FlowbiteColor = 'primary' | 'red' | 'green' | 'yellow' | 'cyan' | 'dark' | 'alternative' | 'light' | 'secondary' | 'gray' | 'orange' | 'amber' | 'lime' | 'emerald' | 'teal' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'pink' | 'rose';

  // Color mapping for Flowbite Button
  const colorMap: Record<ButtonVariant, FlowbiteColor> = {
    primary: 'primary',
    danger: 'red',
    success: 'green',
    warning: 'yellow',
    info: 'cyan',
  } as const;

  // Size mapping for circle button
  const circleSizeMap: Record<ButtonSize, string> = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  } as const;

  // Reactive statements
  $: resolvedColor = colorMap[variant];
  $: isPill = pill || circle;
  $: circleClasses = circle ? `${circleSizeMap[size]} flex items-center justify-center` : '';
  $: combinedClassName = `bg-primary-900 ${className} ${circleClasses}`.trim();
</script>

{#if href}
  <!-- Safe: Link -->
  <FBButton
    href={href}
    color={resolvedColor}
    disabled={disabled}
    pill={isPill}
    size={circle ? undefined : size}
    class={combinedClassName}
    {...($$restProps)}
  >
    <slot />
  </FBButton>
{:else}
  <!-- Safe: Button -->
  <FBButton
    type={type}
    color={resolvedColor}
    disabled={disabled}
    pill={isPill}
    size={circle ? undefined : size}
    class={combinedClassName}
    {...($$restProps)}
  >
    <slot />
  </FBButton>
{/if}
