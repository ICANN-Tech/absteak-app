<script lang="ts">
	import { createTranslationStore } from "$lib/utils/translation";

	const t = createTranslationStore('footer');
</script>

<div class="space-y-4">
							<h3 class="text-xl font-bold text-white">{$t('quickLinks') || 'Quick Links'}</h3>
							<div class="space-y-2">
								<a href="#hero" class="block text-gray-300 hover:text-amber-400 transition-colors duration-300">{$t('home') || 'Home'}</a>
								<a href="#video-highlight" class="block text-gray-300 hover:text-amber-400 transition-colors duration-300">{$t('about') || 'About'}</a>
								<a href="#experience" class="block text-gray-300 hover:text-amber-400 transition-colors duration-300">{$t('experience') || 'Experience'}</a>
								<a href="#chef" class="block text-gray-300 hover:text-amber-400 transition-colors duration-300">{$t('ourChef') || 'Our Chef'}</a>
								<a href="#menu" class="block text-gray-300 hover:text-amber-400 transition-colors duration-300">{$t('menu') || 'Menu'}</a>
								<a href="#booking" class="block text-gray-300 hover:text-amber-400 transition-colors duration-300">{$t('reservations') || 'Reservations'}</a>
							</div>
						</div>