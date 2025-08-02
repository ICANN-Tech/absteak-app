<script context="module" lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';
	import RightContainer from './RightContainer.svelte';
	import LeftContainer from './LeftContainer.svelte';
</script>

<script lang="ts">
	let activeCategory = 0;
	const backgroundImages: string[] = [
		'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920',
		'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=1920',
		'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1920'
	];
</script>

<section
	class={`${CONTAINER_SECTION.menu.base} bg-cover bg-center`}
	style="background-image: url('{backgroundImages[activeCategory] ||
		backgroundImages[0] ||
		'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920'}');"
>
	<!-- Overlay for better readability -->
	<div class={`${CONTAINER_SECTION.menu.overlay.first}`}></div>
	<div class={`${CONTAINER_SECTION.menu.overlay.second}`}></div>

	<div class={`${CONTAINER_SECTION.menu.content.base}`}>
		<LeftContainer {activeCategory} />
		<RightContainer {activeCategory} />
	</div>
</section>
