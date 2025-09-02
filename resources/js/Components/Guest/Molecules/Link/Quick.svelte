<script lang="ts">
	import { jumpToHighlightById } from "@Stores/Guest/Viewport/Index";
	import { createTranslationStore } from "@Utils/Global/Translation";

	const t = createTranslationStore('footer');

	function handleNavigation(sectionId: string) {
		// Navigate to the section
		jumpToHighlightById(sectionId);
	}

	const quickLinks = [
		{ id: 'hero', translationKey: 'home', fallback: 'Home' },
		{ id: 'video-highlight', translationKey: 'about', fallback: 'About' },
		{ id: 'experience', translationKey: 'experience', fallback: 'Experience' },
		{ id: 'chef', translationKey: 'ourChef', fallback: 'Our Chef' },
		{ id: 'menu', translationKey: 'menu', fallback: 'Menu' },
		{ id: 'booking', translationKey: 'reservations', fallback: 'Reservations' }
	];
</script>

<div class="space-y-4">
	<h3 class="text-xl font-bold text-white">{$t('quickLinks') || 'Quick Links'}</h3>
	<div class="space-y-2">
		{#each quickLinks as link}
			<button
				type="button"
				class="block text-left text-gray-300 transition-colors duration-300 hover:text-amber-400 cursor-pointer"
				on:click={() => handleNavigation(link.id)}
			>
				{$t(link.translationKey) || link.fallback}
			</button>
		{/each}
	</div>
</div>