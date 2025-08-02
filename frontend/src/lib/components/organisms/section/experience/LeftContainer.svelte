<script context="module" lang="ts">
	import { CONTAINER_RESPONSIVE, CONTAINER_SECTION } from "$lib/const";
	import { createTranslationStore } from "$lib/utils/translation";
</script>

<script lang="ts">
  const t = createTranslationStore();

  $: textContainerClasses = `${CONTAINER_SECTION.experience.content.left} ${CONTAINER_RESPONSIVE.text.base}`;
</script>

<div class={`${textContainerClasses}`}>
	<!-- Content dalam 1 baris vertikal ke bawah -->
	<div class={CONTAINER_SECTION.experience.flex}>
		<!-- Title -->
		<h2 class={CONTAINER_SECTION.experience.text.title}>
			{$t('experience.title')}
		</h2>

		<!-- Description -->
		<p class={CONTAINER_SECTION.experience.text.description}>
			{$t('experience.description')}
		</p>

		<!-- Subtitle -->
		<p class={CONTAINER_SECTION.experience.text.subtitle}>
			{$t('experience.subtitle') }
		</p>
	</div>
</div>
