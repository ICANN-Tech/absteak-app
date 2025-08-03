<script lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';
	import { ScrollableImage } from '$lib/components/molecules';
	import { fade } from 'svelte/transition';
	import { activeCategory, currentCategoryImages, imageHeights } from '../../stores/interface';
</script>

<div class={`${CONTAINER_SECTION.menu.content.right}`}>
	<!-- Left column - scrolling up -->
	<div class={`${CONTAINER_SECTION.menu.scrollableImage.left}`}>
		{#key $activeCategory}
			<div class="h-full" in:fade={{ duration: 600, delay: 200 }} out:fade={{ duration: 400 }}>
				<ScrollableImage
					images={$currentCategoryImages.leftColumn}
					heights={imageHeights.leftColumn}
					animationClass="animate-scroll-up"
				/>
			</div>
		{/key}
	</div>

	<!-- Right column - scrolling down -->
	<div class={`${CONTAINER_SECTION.menu.scrollableImage.right}`}>
		{#key $activeCategory}
			<div class="h-full" in:fade={{ duration: 600, delay: 400 }} out:fade={{ duration: 400 }}>
				<ScrollableImage
					images={$currentCategoryImages.rightColumn}
					heights={imageHeights.rightColumn}
					animationClass="animate-scroll-down"
				/>
			</div>
		{/key}
	</div>
</div>
