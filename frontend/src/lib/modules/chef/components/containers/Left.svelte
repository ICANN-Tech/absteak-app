<script context="module" lang="ts">
	import { Image } from '$lib/components/atoms';
	import { CONTAINER_SECTION } from '$lib/const';

	const imageUrl: string =
		'https://absteakjkt.com/wp-content/uploads/2024/01/ACR07440-683x1024.jpg';
</script>

<script lang="ts">
	export let imageClass: string;

	$: imageContainerClasses = `${CONTAINER_SECTION.chef.content.left} group relative overflow-hidden`;
	$: imageClasses = `${CONTAINER_SECTION.chef.image.base} ${imageClass}`;
</script>

<div class={imageContainerClasses}>
	<Image class={imageClasses} src={imageUrl} alt="Chef Image" />

	<div class="absolute inset-0 bg-black/20 transition-all duration-300 group-hover:bg-black/30"></div>
</div>
