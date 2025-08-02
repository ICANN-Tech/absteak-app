<script lang="ts">
	import { CONTAINER_SECTION, CONTAINER_RESPONSIVE, CONTAINER_GAPS, UI_LAYOUT } from '$lib/const';
	import AnimateOnScroll from '$lib/components/AnimateOnScroll.svelte';
	import { Image } from "$lib/components/atoms";
	import { createTranslationStore } from '$lib/utils/translation';

	const t = createTranslationStore();

	// Props untuk kustomisasi konten - menggunakan translasi sebagai default
	export let chefName: string = '';
	export let chefQuote: string = '';
	export let chefDescription: string = '';
	
	// Props untuk media
	export let chefImageUrl: string = CONTAINER_SECTION.chef.imageUrl.chef;
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

	// Computed classes dengan struktur 2 kolom responsive
	$: flexDirection = layout_direction === 'reverse' ? 'md:flex-row-reverse' : 'md:flex-row';
	$: sectionClasses = `${CONTAINER_SECTION.chef.base} ${containerClass}`;
	$: sectionStyle = `background-color: ${backgroundColor};`;
	$: contentContainerClasses = `${CONTAINER_SECTION.chef.content.base} ${flexDirection}`;
	$: imageContainerClasses = `${CONTAINER_SECTION.chef.content.left} group relative overflow-hidden`;
	$: textContainerClasses = `${CONTAINER_SECTION.chef.content.right} ${CONTAINER_RESPONSIVE.text.base}`;
	$: imageClasses = `${CONTAINER_SECTION.chef.image.base} ${enableHoverEffect ? hoverScale : ''} ${imageClass}`;
</script>

<AnimateOnScroll animation={animationType} y={animationY} duration={animationDuration}>
	<section class={sectionClasses} style={sectionStyle}>
		<!-- Container dengan 2 kolom responsive -->
		<div class={contentContainerClasses}>
			<!-- Image Container (Kolom Kiri) -->
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

			<!-- Text Content Container (Kolom Kanan) -->
			<div class={`${CONTAINER_SECTION.chef.content.right} ${textContainerClasses} ${contentClass}`}>
				<!-- Content dalam 1 baris vertikal ke bawah -->
				<div class={`${CONTAINER_SECTION.chef.flex}`}>
					<!-- Chef Name -->
					<h2 class={CONTAINER_SECTION.chef.text.title}>
						{chefName || $t('chef.name') || 'CHEF ABSTEAK'}
					</h2>

					<!-- Chef Quote/Description dalam satu paragraf -->
					<p class={CONTAINER_SECTION.chef.text.description}>
						{chefQuote || $t('chef.quote') || chefDescription || $t('chef.description') || '"Kami berkomitmen untuk menghadirkan pengalaman kuliner terbaik dengan steak premium berkualitas tinggi. Tim chef berpengalaman di ABSteak menggabungkan teknik memasak modern dengan cita rasa autentik untuk menciptakan hidangan steak yang sempurna."'}
					</p>
				</div>

				<!-- Slot untuk konten tambahan -->
				<slot name="additional-content" />
			</div>
		</div>

		<!-- Slot untuk konten custom di luar layout standar -->
		<slot />
	</section>
</AnimateOnScroll>