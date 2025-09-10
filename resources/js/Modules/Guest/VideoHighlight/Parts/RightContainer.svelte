<script context="module" lang="ts">
	import { page } from '@inertiajs/svelte';
	import { CONTAINER_RESPONSIVE, CONTAINER_SECTION } from "@Const/Guest/UI/Container";
	import { createMultilingualTranslation } from "@Utils/Global/Translation";

</script>

<script lang="ts">
	export let className: string = '';
	
	$: highlight = $page.props.highlight;
	$: textContainerClasses = `${CONTAINER_SECTION.videoHighlight.content.right} ${CONTAINER_RESPONSIVE.text.base}`;
	
	const translation = createMultilingualTranslation(
		() => highlight?.general,
		['title', 'subtitle', 'description', 'items']
	)
</script>

<div class={`${textContainerClasses} ${className}`}>
	<div class={CONTAINER_SECTION.videoHighlight.flex}>
		<!-- Title -->
		<h2 class={CONTAINER_SECTION.videoHighlight.text.title}>
			{$translation.title || 'ABSteak Culinary Excellence'}
		</h2>

		<!-- Subtitle -->
		{#if $translation.subtitle}
			<p class={CONTAINER_SECTION.videoHighlight.text.subtitle}>
				{$translation.subtitle}
			</p>
		{/if}

		<!-- Items List -->
		{#if (Array.isArray($translation.items) && $translation.items.length > 0)}
			<ul class={CONTAINER_SECTION.videoHighlight.item.unordered}>
				{#each Array.isArray($translation.items) ? $translation.items : [] as item, i (`${i}-${item}`)}
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
		{#if $translation.description}
			<p class={CONTAINER_SECTION.videoHighlight.text.description}>
				{$translation.description}
			</p>
		{/if}
	</div>
</div>
