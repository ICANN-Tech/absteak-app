<script context="module" lang="ts">
	import ScrollableImage from '@Components/Guest/Molecules/Media/ScrollableImage.svelte';
	import { CONTAINER_SECTION } from '@Const/Guest/UI/Container';
	import {
		EXPERIENCE_LEFT_COLUMN_IMAGES,
		EXPERIENCE_RIGHT_COLUMN_IMAGES,
		EXPERIENCE_LEFT_COLUMN_HEIGHTS,
		EXPERIENCE_RIGHT_COLUMN_HEIGHTS,
		EXPERIENCE_ANIMATION_CLASSES,
		EXPERIENCE_ALT_TEXT
	} from '../Const/Image.const';
</script>

<script lang="ts">
	// Props with default values from constants
	export let leftColumnImages: string[] = EXPERIENCE_LEFT_COLUMN_IMAGES;
	export let rightColumnImages: string[] = EXPERIENCE_RIGHT_COLUMN_IMAGES;
	export let leftColumnHeights: string[] = EXPERIENCE_LEFT_COLUMN_HEIGHTS;
	export let rightColumnHeights: string[] = EXPERIENCE_RIGHT_COLUMN_HEIGHTS;

	// Computed classes
	$: imageContainerClasses = CONTAINER_SECTION.experience.content.right;
</script>

<div class={imageContainerClasses}>
	<!-- Left column - scrolling up -->
	<div class={CONTAINER_SECTION.experience.scrollableImage.left}>
		<ScrollableImage
			images={leftColumnImages}
			heights={leftColumnHeights}
			animationClass="animate-scroll-up"
		/>
	</div>

	<!-- Right column - scrolling down -->
	<div class={CONTAINER_SECTION.experience.scrollableImage.right}>
		<ScrollableImage
			images={rightColumnImages}
			heights={rightColumnHeights}
			animationClass="animate-scroll-down"
		/>
	</div>
</div>
