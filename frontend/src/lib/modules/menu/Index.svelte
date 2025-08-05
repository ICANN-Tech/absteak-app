<script context="module" lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';
	import LeftContainer from './components/container/Left.svelte';
	import RightContainer from './components/container/Right.svelte';
</script>

<script lang="ts">
	import { currentBackground } from './stores/interface';
</script>

<section
	class={`${CONTAINER_SECTION.menu.base} bg-cover bg-center`}
	style="background-image: url('{$currentBackground}');"
>
	<div class={`${CONTAINER_SECTION.menu.overlay.first}`}></div>
	<div class={`${CONTAINER_SECTION.menu.overlay.second}`}></div>

	<div class={`${CONTAINER_SECTION.menu.content.base}`}>
		<LeftContainer />
		<RightContainer />
	</div>
</section>
