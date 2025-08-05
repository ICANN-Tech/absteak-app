<script context="module" lang="ts">
	import LeftContainer from './components/containers/Left.svelte';
	import RightContainer from './components/containers/Right.svelte';
	import { CONTAINER_SECTION } from '$lib/const';
</script>

<script lang="ts">
	export let backgroundColor: string = '#fdf6ee';
	export let layout_direction: 'normal' | 'reverse' = 'normal';
	export let containerClass: string = '';

	$: flexDirection = layout_direction === 'reverse' ? 'md:flex-row-reverse' : 'md:flex-row';
	$: sectionClasses = `${CONTAINER_SECTION.chef.base} ${containerClass}`;
	$: sectionStyle = `background-color: ${backgroundColor};`;
	$: contentContainerClasses = `${CONTAINER_SECTION.chef.content.base} ${flexDirection}`;
</script>

<section class={sectionClasses} style={sectionStyle}>
	<div class={contentContainerClasses}>
		<LeftContainer />

		<RightContainer />
	</div>
</section>
