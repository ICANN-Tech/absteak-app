<script context="module" lang="ts">
	import { IMAGES } from './const/image.const';
	import { LogoIcon } from '$lib/components/atoms';
	import { createTranslationStore } from '$lib/utils/translation';
	import { CONTAINER_SECTION } from '$lib/const';
</script>

<script lang="ts">
	import HeroCarousel from '$lib/components/organisms/carousel/hero/Index.svelte';
	import ButtonGroup from './components/groups/Button.svelte';

	const t = createTranslationStore();
</script>

<HeroCarousel carouselId="top" images={IMAGES}>
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
</HeroCarousel>
