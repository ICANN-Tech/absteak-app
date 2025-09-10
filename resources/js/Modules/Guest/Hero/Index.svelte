<script context="module" lang="ts">
	import { LogoIcon } from '@Components/Global/Atoms/Icons/Index';
	import { CONTAINER_SECTION } from '@Const/Guest/UI/Container';
	import Background from './Part/Background.svelte';
	import Description from './Part/Description.svelte';
</script>

<!-- TODO: Replace with proper HeroCarousel component -->
<section id="hero" class="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
	<!-- Background Image -->
	<Background />
	
	<div class={CONTAINER_SECTION.hero.base}>
		<div class={CONTAINER_SECTION.hero.content.centered}>
			<!-- Logo -->
			<div class={CONTAINER_SECTION.hero.logo.base}>
				<LogoIcon size="2xl" />
			</div>

			<!-- Description -->
			<Description />
		</div>
	</div>
</section>
