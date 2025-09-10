<script lang="ts">
	// Props
	export let images: string[] = [];
	export let heights: string[] = [];
	export let animationClass: string = '';
	export let altText: string = 'food';
	export let duplicateImages: boolean = true;

	// Computed values
	$: displayImages = duplicateImages ? [...images, ...images] : images;
	$: containerClasses = `flex flex-col h-full ${animationClass}`;

	// Helper function to get height class
	function getHeightClass(index: number): string {
		return heights.length > 0 ? heights[index % heights.length] : 'h-64';
	}
</script>

<div class={containerClasses}>
	{#each displayImages as image, index}
		<div class={`${getHeightClass(index)} flex-shrink-0 w-full`}>
			<img 
				src={image} 
				alt={`${altText} ${index + 1}`} 
				class="object-cover w-full h-full block transition-transform duration-300 hover:scale-105" 
				loading="lazy"
			/>
		</div>
	{/each}
</div>