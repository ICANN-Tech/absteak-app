<script context="module" lang="ts">
    import { CONTAINER_SECTION } from '$lib/const';
    import AnimateOnScroll from '$lib/components/AnimateOnScroll.svelte';
    import LeftContainer from './LeftContainer.svelte';
    import RightContainer from './RightContainer.svelte';
</script>

<script lang="ts">
	// Props for media
	export let thumbnailUrl: string = '/assets/thumbnail.png';
	export let thumbnailAlt: string = 'Video thumbnail';

	// Props for layout and styling
	export let backgroundColor: string = '#fdf6ee';
	export let layout_direction: 'normal' | 'reverse' = 'normal';
	export let containerClass: string = '';
	export let contentClass: string = '';
	export let mediaClass: string = '';

	// Props for animation
	export let animationType: 'fly' | 'fade' | 'scale' | 'slide' = 'fly';
	export let animationY: number = 40;
	export let animationDuration: number = 700;

	$: flexDirection = layout_direction === 'reverse' ? 'md:flex-row-reverse' : 'md:flex-row';
	$: sectionClasses = `${CONTAINER_SECTION.videoHighlight.base} ${containerClass}`;
	$: sectionStyle = `background-color: ${backgroundColor};`;
	$: contentContainerClasses = `${CONTAINER_SECTION.videoHighlight.content.base} ${flexDirection}`;
</script>

<AnimateOnScroll animation={animationType} y={animationY} duration={animationDuration}>
	<section class={sectionClasses} style={sectionStyle}>
		<div class={contentContainerClasses}>
			<LeftContainer {thumbnailUrl} {thumbnailAlt} {mediaClass} />

			<RightContainer className={contentClass} />
		</div>
	</section>
</AnimateOnScroll>
