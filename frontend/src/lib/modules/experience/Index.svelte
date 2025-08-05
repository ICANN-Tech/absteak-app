<script context="module" lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';
	import { BACKGROUND_IMAGE_URL } from './const/background.const';
	import LeftContainer from './components/containers/Left.svelte';
	import RightContainer from './components/containers/Right.svelte';

	const backgroundImage: string = BACKGROUND_IMAGE_URL;
</script>

<script lang="ts">
	export let backgroundColor: string = '#fdf6ee';
	export let layoutDirection: 'normal' | 'reverse' = 'normal';

	$: flexDirection = layoutDirection === 'reverse' ? 'md:flex-row-reverse' : 'md:flex-row';
	$: sectionClasses = `${CONTAINER_SECTION.experience.base}`;
	$: sectionStyle = `background-color: ${backgroundColor}; background-image: url('${backgroundImage}'); background-repeat: repeat; background-size: cover;`;
	$: contentContainerClasses = `${CONTAINER_SECTION.experience.content.base} ${flexDirection}`;
</script>

<section class={sectionClasses} style={sectionStyle}>
	<div class={contentContainerClasses}>
		<LeftContainer />
		<RightContainer />
	</div>
</section>
