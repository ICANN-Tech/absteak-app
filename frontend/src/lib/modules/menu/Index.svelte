<script context="module" lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';
</script>

<script lang="ts">
	import LeftContainer from './components/container/Left.svelte';
	import RightContainer from './components/container/Right.svelte';
	import { activeCategory, currentBackground } from './stores/interface';
</script>

<section
	class={`${CONTAINER_SECTION.menu.base} bg-cover bg-center`}
	style="background-image: url('{$currentBackground}');"
>
	<!-- Overlay for better readability -->
	<div class={`${CONTAINER_SECTION.menu.overlay.first}`}></div>
	<div class={`${CONTAINER_SECTION.menu.overlay.second}`}></div>

	<div class={`${CONTAINER_SECTION.menu.content.base}`}>
		<LeftContainer />
		<RightContainer />
	</div>
</section>
