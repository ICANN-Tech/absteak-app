<script context="module" lang="ts">
	import { CONTAINER_RESPONSIVE, CONTAINER_SECTION } from '$lib/const';
	import { createTranslationStore } from '$lib/utils/translation';
</script>

<script lang="ts">
	const t = createTranslationStore();
    
	$: textContainerClasses = `${CONTAINER_SECTION.chef.content.right} ${CONTAINER_RESPONSIVE.text.base}`;
</script>

<div class={`${CONTAINER_SECTION.chef.content.right} ${textContainerClasses}`}>
	<div class={`${CONTAINER_SECTION.chef.flex}`}>
		<h2 class={CONTAINER_SECTION.chef.text.title}>
			{$t('chef.name') || 'CHEF ABSTEAK'}
		</h2>

		<p class={CONTAINER_SECTION.chef.text.description}>
			{$t('chef.quote') || $t('chef.description')}
		</p>
	</div>
</div>
