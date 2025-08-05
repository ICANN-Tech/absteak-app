<script context="module" lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';
	import LeftContainer from './components/containers/Left.svelte';
	import RightContainer from './components/containers/Right.svelte';
</script>

<script lang="ts">
	export let backgroundColor: string = '#fdf6ee';
	export let layoutDirection: 'normal' | 'reverse' = 'normal';
	export let containerClass: string = '';
	export let contentClass: string = '';

	$: flexDirection = layoutDirection === 'reverse' ? 'md:flex-row-reverse' : 'md:flex-row';
	$: sectionClasses = `${CONTAINER_SECTION.videoHighlight.base} ${containerClass}`;
	$: sectionStyle = `background-color: ${backgroundColor};`;
	$: contentContainerClasses = `${CONTAINER_SECTION.videoHighlight.content.base} ${flexDirection}`;
</script>

<section class={sectionClasses} style={sectionStyle}>
	<div class={contentContainerClasses}>
		<LeftContainer />

		<RightContainer className={contentClass} />
	</div>
</section>
