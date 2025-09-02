<script context="module" lang="ts">
	import { CONTAINER_SECTION } from '@Const/Guest/UI/Container';

	const imageUrl: string =
		'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=800&fit=crop&crop=face';
</script>

<script lang="ts">
	$: imageContainerClasses = `${CONTAINER_SECTION.chef.content.left} group relative overflow-hidden`;
	$: imageClasses = `${CONTAINER_SECTION.chef.image.base}`;
</script>

<div class={imageContainerClasses}>
	<img class={imageClasses} src={imageUrl} alt="Professional chef" />

	<div class="absolute inset-0 bg-black/20 transition-all duration-300 group-hover:bg-black/30"></div>
</div>
