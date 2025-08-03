<script lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';
	import { createTranslationStore } from '$lib/utils/translation';
	import { MapLocation } from '../../components/organisms/location';
	import { BottomBar, QuickLink } from '$lib/components/molecules';
	import Newsletter from './components/containers/Newsletter.svelte';
	import AnimateOnScroll from '$lib/components/AnimateOnScroll.svelte';
	import RestaurantInfo from './components/containers/RestaurantInfo.svelte';

	const t = createTranslationStore('footer');
</script>

<AnimateOnScroll animation="fade" y={20} duration={800}>
	<footer class={CONTAINER_SECTION.footer.base}>
		<!-- Background decorative elements -->
		<div class={CONTAINER_SECTION.footer.background.base}>
			<div class={CONTAINER_SECTION.footer.background.first}></div>
			<div class={CONTAINER_SECTION.footer.background.second}></div>
		</div>

		<!-- Map Section -->
		<div class={CONTAINER_SECTION.footer.map.section}>
			<MapLocation 
				address="Jln. Merdeka No. 1, Jakarta"
				phone="08123456789"
				email="contact@absteak.com"
				title={$t('newsletter.restaurant.title')}
				description={$t('newsletter.restaurant.description')}
			/>
		</div>

		<div class={CONTAINER_SECTION.footer.main.section}>
			<div class={CONTAINER_SECTION.footer.main.container}>
				<!-- Main Footer Content -->
				<div class={CONTAINER_SECTION.footer.main.grid}>
					<!-- Restaurant Info -->
					<RestaurantInfo />

					<!-- Quick Links -->
					<QuickLink />

					<!-- Newsletter Subscription -->
					<Newsletter />
				</div>

				<!-- Bottom Footer -->
				<BottomBar />
			</div>
		</div>
	</footer>
</AnimateOnScroll>