<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';
  export let color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'white' = 'primary';

  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  }[size];

  const colorClass = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    danger: 'text-danger',
    warning: 'text-warning',
    info: 'text-info',
    white: 'text-white',
  }[color];

  export let className = '';
</script>

<svg class={`${sizeClass}  ${className}`} {...$$restProps} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd"/>
</svg>