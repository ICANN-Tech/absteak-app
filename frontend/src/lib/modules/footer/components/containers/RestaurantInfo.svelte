<script lang="ts">
	import { LogoIcon } from "$lib/components";
	import { CONTAINER_SECTION } from "$lib/const";
	import { createTranslationStore } from "$lib/utils/translation";

	const t = createTranslationStore('footer');
</script>

<div class={CONTAINER_SECTION.footer.main.info.base}>
	<div>
		<LogoIcon size="lg" />

		<p class={CONTAINER_SECTION.footer.main.info.tagline}>
			{$t('newsletter.tagline.title')}
		</p>
		<p class={CONTAINER_SECTION.footer.main.info.description}>
			{$t('newsletter.tagline.description')}
		</p>
	</div>
</div>
