<script context="module" lang="ts">
	import { CONTAINER_RESPONSIVE, CONTAINER_SECTION } from "$lib/const";
	import { createTranslationStore } from "$lib/utils/translation";
</script>

<script lang="ts">
    export let className: string = '';

	$: textContainerClasses = `${CONTAINER_SECTION.videoHighlight.content.right} ${CONTAINER_RESPONSIVE.text.base}`;

	const t = createTranslationStore();
</script>

<div class={`${textContainerClasses} ${className}`}>
	<div class={CONTAINER_SECTION.videoHighlight.flex}>
		<!-- Title -->
		<h2 class={CONTAINER_SECTION.videoHighlight.text.title}>
			{$t('videoHighlight.title') || 'ABSteak Culinary Excellence'}
		</h2>

		<!-- Subtitle -->
		{#if $t('videoHighlight.subtitle')}
			<p class={CONTAINER_SECTION.videoHighlight.text.subtitle}>
				{$t('videoHighlight.subtitle')}
			</p>
		{/if}

		<!-- Items List -->
		{#if (Array.isArray($t('videoHighlight.items')) && $t('videoHighlight.items').length > 0)}
			<ul class={CONTAINER_SECTION.videoHighlight.item.unordered}>
				{#each Array.isArray($t('videoHighlight.items')) ? $t('videoHighlight.items') : [] as item, i (`${i}-${item}`)}
					<li class={CONTAINER_SECTION.videoHighlight.item.list}>
						<svg
							class="h-5 w-5 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							viewBox="0 0 24 24"
						>
							<polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		{/if}

		<!-- Description -->
		{#if $t('videoHighlight.description')}
			<p class={CONTAINER_SECTION.videoHighlight.text.description}>
				{$t('videoHighlight.description')}
			</p>
		{/if}
	</div>
</div>
