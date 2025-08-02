<script lang="ts">
	import type { Props } from './props';
	import { defaultProps } from './props';

	// Component props with proper typing
	export let size: Props['size'] = defaultProps.size;
	export let color: Props['color'] = defaultProps.color;
	export let className = '';

	// Size configurations
	const sizeConfig = {
		sm: { width: 44, height: 46, viewBox: '0 0 46 54' },
		md: { width: 52, height: 58, viewBox: '0 0 58 72' },
		lg: { width: 60, height: 70, viewBox: '0 0 70 90' },
		xl: { width: 68, height: 82, viewBox: '0 0 82 108' },
		'2xl': { width: 76, height: 94, viewBox: '0 0 94 126' }
	};

	// Color configurations
	const colorConfig = {
		primary: '#3b82f6',
		secondary: '#6b7280',
		success: '#10b981',
		danger: '#ef4444',
		warning: '#f59e0b',
		info: '#06b6d4',
		white: '#ffffff',
		black: '#000000'
	};

	// Get current configuration
	$: currentSize = sizeConfig[size];
	$: currentColor = colorConfig[color];

	// Calculate responsive dimensions based on size
	$: mouseWidth = currentSize.width * 0.5;
	$: mouseHeight = currentSize.height * 0.83;
	$: mouseX = (parseInt(currentSize.viewBox.split(' ')[2]) - mouseWidth) / 2;
	$: mouseY = currentSize.height * 0.08;
	$: scrollWidth = mouseWidth * 0.13;
	$: scrollHeight = mouseHeight * 0.2;
	$: scrollX = mouseX + (mouseWidth - scrollWidth) / 2;
	$: scrollY = mouseY + mouseHeight * 0.14;
	$: indicatorRadius = scrollWidth * 0.6;
	$: indicatorX = mouseX + mouseWidth / 2;
	$: indicatorY = scrollY + scrollHeight * 1.2;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={currentSize.width}
	height={currentSize.height}
	viewBox={currentSize.viewBox}
	class={className}
	role="img"
	aria-label="Scroll down indicator"
>
	<style>
		/* Scroll animation keyframes */
		@keyframes scrollDown {
			0% {
				transform: translateY(0);
				opacity: 0.8;
			}
			50% {
				transform: translateY(8px);
				opacity: 0.3;
			}
			100% {
				transform: translateY(0);
				opacity: 0.8;
			}
		}

		/* Scroll indicator animation */
		.scroll-indicator {
			animation: scrollDown 2s infinite ease-in-out;
			transform-origin: center;
		}
	</style>

	<!-- Mouse body -->
	<rect
		x={mouseX}
		y={mouseY}
		width={mouseWidth}
		height={mouseHeight}
		rx={mouseWidth / 2}
		ry={mouseWidth / 2}
		fill="transparent"
		stroke={currentColor}
		stroke-width="2"
	/>

	<!-- Scroll wheel area -->
	<rect
		x={scrollX}
		y={scrollY}
		width={scrollWidth}
		height={scrollHeight}
		rx={scrollWidth / 2}
		ry={scrollWidth / 2}
		fill="transparent"
		stroke={currentColor}
		stroke-width="1"
	/>

	<!-- Animated scroll indicator -->
	<circle
		class="scroll-indicator"
		cx={indicatorX}
		cy={indicatorY}
		r={indicatorRadius}
		fill={currentColor}
		opacity="0.8"
	/>
</svg>
