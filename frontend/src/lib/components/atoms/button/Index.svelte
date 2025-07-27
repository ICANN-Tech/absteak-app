<script lang="ts">
  import { Button as FBButton } from 'flowbite-svelte';

  // Props dengan type annotations yang benar
  export let variant: 'primary' | 'danger' | 'success' | 'warning' | 'info' = 'primary';
  export let type = 'button';
  export let disabled = false;
  export let className = '';
  export let href: string | undefined = undefined;
  export let pill = false; // Support untuk circle/pill button
  export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'; // Support untuk ukuran button
  export let circle = false; // Support untuk circle button (shorthand untuk pill + square)

  // Color mapping untuk Flowbite Button
  const colorMap: Record<typeof variant, string> = {
    primary: 'primary',
    danger: 'red',
    success: 'green',
    warning: 'yellow',
    info: 'cyan',
  };

  // Size mapping untuk circle button
  const circleSizeMap: Record<typeof size, string> = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  $: resolvedColor = colorMap[variant];
  $: isPill = pill || circle;
  $: circleClasses = circle ? `${circleSizeMap[size]} flex items-center justify-center` : '';
  $: combinedClassName = `${className} ${circleClasses}`.trim();
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
    {...($$restProps as any)}
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
    {...($$restProps as any)}
  >
    <slot />
  </FBButton>
{/if}
