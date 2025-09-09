<script context="module" lang="ts">
	import { IMAGES } from './Const/Image.const';
	import { LogoIcon } from '@Components/Global/Atoms/Icons/Index';
	import { createTranslationStore } from '@Utils/Global/Translation';
	import { CONTAINER_SECTION } from '@Const/Guest/UI/Container';
</script>

<script lang="ts">
	// TODO: Create HeroCarousel component or use alternative
	import ButtonGroup from './Part/Group/Button.svelte';

	const t = createTranslationStore();
</script>

<!-- TODO: Replace with proper HeroCarousel component -->
<section id="hero" class="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
	<!-- Background Image -->
	{#if IMAGES && IMAGES[0]}
		<div class="absolute inset-0 bg-cover bg-center opacity-50" style="background-image: url('{IMAGES[0].url}')"></div>
	{/if}
	
	<div class={CONTAINER_SECTION.hero.base}>
		<div class={CONTAINER_SECTION.hero.content.centered}>
			<!-- Logo -->
			<div class={CONTAINER_SECTION.hero.logo.base}>
				<LogoIcon size="2xl" />
			</div>

			<!-- Description -->
			<p class={CONTAINER_SECTION.hero.text.description}>
				{$t(
					'hero.description',
					'Experience the finest culinary journey with premium steaks grilled to perfection.'
				)}
			</p>

			<!-- Button Group -->
			<ButtonGroup />
		</div>
	</div>
</section>
