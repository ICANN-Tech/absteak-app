<script context="module" lang="ts">
	import { ScrollableImage } from '$lib/components/molecules';
	import { CONTAINER_SECTION } from '$lib/const';
	import {
		EXPERIENCE_LEFT_COLUMN_IMAGES,
		EXPERIENCE_RIGHT_COLUMN_IMAGES
	} from '../../const/image.const';
</script>

<script lang="ts">
	export let leftColumnImages: string[] = EXPERIENCE_LEFT_COLUMN_IMAGES;
	export let rightColumnImages: string[] = EXPERIENCE_RIGHT_COLUMN_IMAGES;
	export let leftColumnHeights: string[] = ['h-48', 'h-72', 'h-56', 'h-80', 'h-64', 'h-60'];
	export let rightColumnHeights: string[] = ['h-64', 'h-52', 'h-76', 'h-68', 'h-56', 'h-72'];

	$: imageContainerClasses = `${CONTAINER_SECTION.experience.content.right}`;
</script>

<div class={`${imageContainerClasses}`}>
	<div class={CONTAINER_SECTION.experience.scrollableImage.left}>
		<ScrollableImage
			images={leftColumnImages}
			heights={leftColumnHeights}
			animationClass="animate-scroll-up"
		/>
	</div>

	<div class={CONTAINER_SECTION.experience.scrollableImage.right}>
		<ScrollableImage
			images={rightColumnImages}
			heights={rightColumnHeights}
			animationClass="animate-scroll-down"
		/>
	</div>
</div>
