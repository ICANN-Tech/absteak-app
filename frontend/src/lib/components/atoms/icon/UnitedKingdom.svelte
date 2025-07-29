<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';

	const sizeClass = {
		sm: 'w-12 h-12',
		md: 'w-16 h-16',
		lg: 'w-24 h-24',
		xl: 'w-32 h-32',
		'2xl': 'w-48 h-48'
	};
	export let className: string = '';
	export let title: string = 'Indonesia Flag';
</script>

<svg
	viewBox="0 0 60 30"
	class={`${sizeClass[size]} ${className}`}
	{...$$restProps}
	role="img"
	aria-label={title}
>
	<!-- Blue background -->
	<rect width="60" height="30" fill="#012169" />
	<!-- White diagonals -->
	<g fill="white">
		<polygon points="0,0 60,30 60,24 8,0" />
		<polygon points="0,30 60,0 60,6 8,30" />
		<polygon points="0,6 52,30 60,30 60,24 8,0 0,0" />
		<polygon points="0,24 52,0 60,0 60,6 8,30 0,30" />
	</g>
	<!-- Red diagonals -->
	<g fill="#C8102E">
		<polygon points="0,0 60,30 60,26 6,0" />
		<polygon points="0,30 60,0 60,4 6,30" />
		<polygon points="0,4 54,30 60,30 60,26 6,0 0,0" />
		<polygon points="0,26 54,0 60,0 60,4 6,30 0,30" />
	</g>
	<!-- White cross -->
	<g fill="white">
		<rect x="25" y="0" width="10" height="30" />
		<rect x="0" y="10" width="60" height="10" />
	</g>
	<!-- Red cross -->
	<g fill="#C8102E">
		<rect x="27" y="0" width="6" height="30" />
		<rect x="0" y="12" width="60" height="6" />
	</g>
</svg>
