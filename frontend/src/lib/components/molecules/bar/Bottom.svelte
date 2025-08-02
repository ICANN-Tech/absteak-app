<script lang="ts">
	import { createTranslationStore } from '$lib/utils/translation';

	const t = createTranslationStore('footer');
	const currentYear = new Date().getFullYear();
</script>

<div class="h-full border-t border-gray-700 pt-8">
	<div class="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
		<div class="text-sm text-gray-400">
			{$t('copyright', undefined, { year: currentYear, name: 'AB Steak' }) ||
				`© ${currentYear} AB Steak. All rights reserved.`}
		</div>
		<div class="flex space-x-6 text-sm">
			<a href="/privacy" class="text-gray-400 transition-colors duration-300 hover:text-amber-400"
				>{$t('privacyPolicy') || 'Privacy Policy'}</a
			>
			<a href="/terms" class="text-gray-400 transition-colors duration-300 hover:text-amber-400"
				>{$t('termsOfService') || 'Terms of Service'}</a
			>
			<a href="/contact" class="text-gray-400 transition-colors duration-300 hover:text-amber-400"
				>{$t('contact') || 'Contact'}</a
			>
		</div>
	</div>
</div>
