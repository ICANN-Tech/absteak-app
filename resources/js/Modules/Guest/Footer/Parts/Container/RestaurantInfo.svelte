<script lang="ts">
	import { CONTAINER_SECTION } from "../../../../../Const/Guest/UI/Container";
	import { LogoIcon } from "../../../../../Components/Global/Atoms/Icons/Index";

	// Simple translation fallback
	const translations = {
		'tagline.title': 'ABSteak Restaurant',
		'tagline.description': 'Premium steaks and exceptional dining experience'
	};
	const t = (key: string) => translations[key as keyof typeof translations] || key;
</script>

<div class={CONTAINER_SECTION.footer.main.info.base}>
	<div>
		<LogoIcon size="lg" />

		<p class={CONTAINER_SECTION.footer.main.info.tagline}>
			{t('tagline.title')}
		</p>
		<p class={CONTAINER_SECTION.footer.main.info.description}>
			{t('tagline.description')}
		</p>
	</div>
</div>
