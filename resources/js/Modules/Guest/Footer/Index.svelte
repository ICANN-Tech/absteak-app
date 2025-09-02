<script lang="ts">
	import { CONTAINER_SECTION } from '../../../Const/Guest/UI/Container';
	import Newsletter from './Parts/Container/Newsletter.svelte';
	import RestaurantInfo from './Parts/Container/RestaurantInfo.svelte';
	import SocialMedia from './Parts/Container/SocialMedia.svelte';
</script>

<footer class={CONTAINER_SECTION.footer.base}>
		<!-- Background decorative elements -->
		<div class={CONTAINER_SECTION.footer.background.base}>
			<div class={CONTAINER_SECTION.footer.background.first}></div>
			<div class={CONTAINER_SECTION.footer.background.second}></div>
		</div>

		<!-- Map Section -->
		<div class={CONTAINER_SECTION.footer.map.section}>
			<div class="p-8 text-center text-white">
				<h3 class="text-xl font-bold mb-2">Visit Our Restaurant</h3>
				<p class="mb-4">Experience premium steaks in Jakarta</p>
				<div class="space-y-2">
					<p>📍 Jln. Merdeka No. 1, Jakarta</p>
					<p>📞 08123456789</p>
					<p>✉️ contact@absteak.com</p>
				</div>
			</div>
		</div>

		<div class={CONTAINER_SECTION.footer.main.section}>
			<div class={CONTAINER_SECTION.footer.main.container}>
				<!-- Main Footer Content -->
				<div class={CONTAINER_SECTION.footer.main.grid}>
					<!-- Restaurant Info -->
					<RestaurantInfo />

					<!-- Quick Links -->
					<div class="text-white">
						<h4 class="font-bold mb-4">Quick Links</h4>
						<ul class="space-y-2">
							<li><a href="#menu" class="hover:text-amber-400">Menu</a></li>
							<li><a href="#reservation" class="hover:text-amber-400">Reservation</a></li>
							<li><a href="#about" class="hover:text-amber-400">About Us</a></li>
							<li><a href="#contact" class="hover:text-amber-400">Contact</a></li>
						</ul>
					</div>

					<!-- Newsletter Subscription -->
					<Newsletter />

					<!-- Social Media -->
					<SocialMedia />
				</div>

				<!-- Bottom Footer -->
				<div class="border-t border-gray-700 pt-6 text-center text-gray-400">
					<p>&copy; 2024 ABSteak Restaurant. All rights reserved.</p>
				</div>
			</div>
		</div>
</footer>