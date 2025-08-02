<script lang="ts">
    export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';

    const sizeClass = {
        xs: 'w-8 h-8',
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32',
        '2xl': 'w-48 h-48',
    }
	export let className: string = '';
	export let title: string = 'Indonesia Flag';
</script>

<svg 
	viewBox="0 0 3 2" 
	class={`${sizeClass[size]} ${className}`} {...$$restProps}
	role="img"
	aria-label={title}
>
	<!-- Red stripe (top) -->
	<rect width="3" height="1" fill="#FF0000" />
	<!-- White stripe (bottom) -->
	<rect width="3" height="1" y="1" fill="#FFFFFF" />
</svg>