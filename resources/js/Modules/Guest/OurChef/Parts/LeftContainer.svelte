<script context="module" lang="ts">
    import { page } from '@inertiajs/svelte';
	import { CONTAINER_SECTION } from '@Const/Guest/UI/Container';
    import type { Configuration } from '@/Types/Guest/Configuration.type';
</script>

<script lang="ts">
	const image: Configuration | null = $page.props.chef.image as Configuration | null;
	const imageUrl: string = image?.value || '';

	$: imageContainerClasses = `${CONTAINER_SECTION.chef.content.left} group relative overflow-hidden`;
	$: imageClasses = `${CONTAINER_SECTION.chef.image.base}`;
</script>

<div class={imageContainerClasses}>
	<img class={imageClasses} src={imageUrl} alt="Professional chef" />

	<div class="absolute inset-0 bg-black/20 transition-all duration-300 group-hover:bg-black/30"></div>
</div>
