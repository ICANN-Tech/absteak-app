<script lang="ts">
    export let size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';

    const sizeClass = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32',
        '2xl': 'w-48 h-48',
    }
    export let className: string = '';
    export let title: string = 'Japan Flag';
</script>

<svg 
    viewBox="0 0 3 2" 
    class={`${sizeClass[size]} ${className}`} {...$$restProps}
    role="img"
    aria-label={title}
>
    <!-- White background -->
    <rect width="3" height="2" fill="#FFFFFF" />
    <!-- Red circle (sun) -->
    <circle cx="1.5" cy="1" r="0.6" fill="#BC002D" />
</svg>