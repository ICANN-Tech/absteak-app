<script context="module" lang="ts">
	import LeftContainer from './components/containers/Left.svelte';
	import RightContainer from './components/containers/Right.svelte';
	import AnimateOnScroll from '$lib/components/AnimateOnScroll.svelte';
	import { CONTAINER_SECTION } from '$lib/const';
</script>

<script lang="ts">
	// Props untuk layout dan styling
	export let backgroundColor: string = '#fdf6ee';
	export let layout_direction: 'normal' | 'reverse' = 'normal';
	export let containerClass: string = '';
	export let imageClass: string = '';

	// Props untuk animasi
	export let animationType: 'fly' | 'fade' | 'scale' | 'slide' = 'fly';
	export let animationY: number = 40;
	export let animationDuration: number = 700;

	// Computed classes dengan struktur 2 kolom responsive
	$: flexDirection = layout_direction === 'reverse' ? 'md:flex-row-reverse' : 'md:flex-row';
	$: sectionClasses = `${CONTAINER_SECTION.chef.base} ${containerClass}`;
	$: sectionStyle = `background-color: ${backgroundColor};`;
	$: contentContainerClasses = `${CONTAINER_SECTION.chef.content.base} ${flexDirection}`;
</script>

<AnimateOnScroll animation={animationType} y={animationY} duration={animationDuration}>
	<section class={sectionClasses} style={sectionStyle}>
		<div class={contentContainerClasses}>
			<LeftContainer {imageClass} />

			<RightContainer />
		</div>
	</section>
</AnimateOnScroll>
