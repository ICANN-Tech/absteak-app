<script lang="ts">
	import { createTranslationStore } from '@Utils/Global/Translation';
	import { QUICK_LINKS } from '@Const/Guest/Control/QuickLink';
	import { handleQuickLinkNavigation } from './Utils/Navigation';

	const t = createTranslationStore('footer');
</script>

<div class="space-y-4">
	<h3 class="text-xl font-bold text-white">{$t('quickLinks') || 'Quick Links'}</h3>
	<div class="flex flex-wrap flex-col gap-4 items-start">
		{#each QUICK_LINKS as link}
			<button
				class="quick-link-item"
				on:click={() => handleQuickLinkNavigation(link.id)}
			>
				{$t(link.translationKey) || link.fallback}
			</button>
		{/each}
	</div>
</div>