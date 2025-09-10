<script lang="ts">
	export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';

	const sizeClass = {
		xs: 'w-8 h-8',	
		sm: 'w-12 h-12',
		md: 'w-16 h-16',
		lg: 'w-24 h-24',
		xl: 'w-32 h-32',
		'2xl': 'w-48 h-48'
	};
	export let className: string = '';
	export let title: string = 'Korea Flag';
</script>

<svg
	viewBox="0 0 60 40"
	class={`${sizeClass[size]} ${className}`}
	{...$$restProps}
	role="img"
	aria-label={title}
>
	<!-- White background -->
	<rect width="60" height="40" fill="white" />
	
	<!-- Central Taegeuk (Yin-Yang) -->
	<g transform="translate(30,20)">
		<!-- Red (Yang) semicircle -->
		<path d="M -6,0 A 6,6 0 0,1 6,0 A 3,3 0 0,1 0,0 A 3,3 0 0,0 -6,0" fill="#CD2E3A" />
		<!-- Blue (Yin) semicircle -->
		<path d="M -6,0 A 6,6 0 0,0 6,0 A 3,3 0 0,0 0,0 A 3,3 0 0,1 -6,0" fill="#0047A0" />
		<!-- Small red circle -->
		<circle cx="0" cy="-3" r="3" fill="#CD2E3A" />
		<!-- Small blue circle -->
		<circle cx="0" cy="3" r="3" fill="#0047A0" />
	</g>
	
	<!-- Four Trigrams -->
	<!-- Geon (Heaven) - top left -->
	<g transform="translate(15,10)" fill="black">
		<rect x="-6" y="-3" width="12" height="1" />
		<rect x="-6" y="-1" width="12" height="1" />
		<rect x="-6" y="1" width="12" height="1" />
	</g>
	
	<!-- Gon (Earth) - bottom right -->
	<g transform="translate(45,30)" fill="black">
		<rect x="-6" y="-3" width="5" height="1" />
		<rect x="1" y="-3" width="5" height="1" />
		<rect x="-6" y="-1" width="5" height="1" />
		<rect x="1" y="-1" width="5" height="1" />
		<rect x="-6" y="1" width="5" height="1" />
		<rect x="1" y="1" width="5" height="1" />
	</g>
	
	<!-- Gam (Water) - top right -->
	<g transform="translate(45,10)" fill="black">
		<rect x="-6" y="-3" width="5" height="1" />
		<rect x="1" y="-3" width="5" height="1" />
		<rect x="-6" y="-1" width="12" height="1" />
		<rect x="-6" y="1" width="5" height="1" />
		<rect x="1" y="1" width="5" height="1" />
	</g>
	
	<!-- Ri (Fire) - bottom left -->
	<g transform="translate(15,30)" fill="black">
		<rect x="-6" y="-3" width="12" height="1" />
		<rect x="-6" y="-1" width="5" height="1" />
		<rect x="1" y="-1" width="5" height="1" />
		<rect x="-6" y="1" width="12" height="1" />
	</g>
</svg>