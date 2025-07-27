<script lang="ts">
	import { layout } from '$lib/const';
	import AnimateOnScroll from '$lib/components/AnimateOnScroll.svelte';
	import { Image } from "$lib/components/atoms";

	// Props untuk kustomisasi konten
	export let chefName: string = 'AKIRA BACK';
	export let chefQuote: string = '"I love Jakarta." It is an amazing city that is a melting pot of culture just like my food. It\'s always been a place near and dear to me that I personally relate good with."';
	export let chefDescription: string = 'Hailing from the picturesque landscapes of Korea and nurtured amid the scenic beauty of Aspen, Colorado, Chef Akira Back infuses his culinary endeavours with a spirit of exploration and innovation. Originally a professional snowboarder, Back transitioned seamlessly into the culinary world, making his mark as the youngest executive chef for Nobu Matsuhisa.';
	
	// Props untuk media
	export let chefImageUrl: string = 'https://absteakjkt.com/wp-content/uploads/2024/01/ACR07440-683x1024.jpg';
	export let chefImageAlt: string = 'Chef Akira Back';

	// Props untuk overlay
	export let showOverlay: boolean = true;
	export let overlayOpacity: string = 'bg-black/20';
	export let hoverOverlayOpacity: string = 'bg-black/30';

	// Props untuk layout dan styling
	export let backgroundColor: string = '#fdf6ee';
	export let layout_direction: 'normal' | 'reverse' = 'normal';
	export let containerClass: string = '';
	export let contentClass: string = '';
	export let imageClass: string = '';
	export let overlayClass: string = '';

	// Props untuk animasi
	export let animationType: 'fly' | 'fade' | 'scale' | 'slide' = 'fly';
	export let animationY: number = 40;
	export let animationDuration: number = 700;

	// Props untuk hover effect
	export let enableHoverEffect: boolean = true;
	export let hoverScale: string = 'hover:scale-110';

	// Computed classes
	$: flexDirection = layout_direction === 'reverse' ? 'md:flex-row-reverse' : 'md:flex-row';
	$: sectionClasses = `flex h-screen w-full flex-col items-center gap-10 rounded-xl ${flexDirection} ${layout.margin.section} ${containerClass}`;
	$: sectionStyle = `background-color: ${backgroundColor};`;
	$: imageContainerClasses = `group relative w-full h-full overflow-hidden md:w-1/2`;
	$: imageClasses = `h-full w-full object-cover object-center transition-transform duration-300 ${enableHoverEffect ? `group-hover:scale-105` : ''} ${imageClass}`;
</script>

<AnimateOnScroll animation={animationType} y={animationY} duration={animationDuration}>
	<section class={sectionClasses} style={sectionStyle}>
		<div class="mx-auto flex flex-col md:flex-row h-full">
			<!-- Image Container with Overlay -->
			<div class={imageContainerClasses}>
				<Image 
					class={imageClasses} 
					src={chefImageUrl} 
					alt={chefImageAlt}
				/>

				{#if showOverlay}
					<div class="absolute inset-0 {overlayOpacity} transition-all duration-300 group-hover:{hoverOverlayOpacity} {overlayClass}">
						<!-- Custom overlay content -->
						<div class="absolute inset-0 flex items-center justify-center">
							<slot name="overlay" />
						</div>
					</div>
				{/if}
			</div>

			<!-- Content Container -->
			<div class="md:w-1/2 flex flex-col justify-center p-10 md:p-16 {contentClass}">
				<!-- Chef Name -->
				<h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
					{chefName}
				</h2>

				<!-- Chef Quote -->
				{#if chefQuote}
					<p class="text-gray-700 text-lg mb-4 italic">
						{chefQuote}
					</p>
				{/if}

				<!-- Chef Description -->
				{#if chefDescription}
					<p class="text-gray-700 text-lg">
						{chefDescription}
					</p>
				{/if}

				<!-- Slot untuk konten tambahan -->
				<slot name="additional-content" />
			</div>

			<!-- Slot untuk konten custom di luar layout standar -->
			<slot />
		</div>
	</section>
</AnimateOnScroll>