<script context="module" lang="ts">
    import { page } from '@inertiajs/svelte';
	import { CONTAINER_RESPONSIVE, CONTAINER_SECTION } from '@Const/Guest/UI/Container';
	import { createMultilingualTranslation } from '@Utils/Global/Translation';
</script>

<script lang="ts">
	const translation = createMultilingualTranslation(
		() => $page.props.chef.general,
		['name', 'quote', 'description']
	);
    
	$: textContainerClasses = `${CONTAINER_SECTION.chef.content.right} ${CONTAINER_RESPONSIVE.text.base}`;
</script>

<div class={`${CONTAINER_SECTION.chef.content.right} ${textContainerClasses}`}>
	<div class={`${CONTAINER_SECTION.chef.flex}`}>
		<!-- Title and Quote -->
		<div class="flex flex-wrap flex-col">
			<h2 class={CONTAINER_SECTION.chef.text.title}>
				{$translation?.name || 'CHEF ABSTEAK'}
			</h2>
			<p class={CONTAINER_SECTION.chef.text.quote}>
				{`"` + ($translation?.quote || 'CHEF ABSTEAK') + `"`}
			</p>
		</div>

		<p class={CONTAINER_SECTION.chef.text.description}>
			{$translation?.description || '-'}
		</p>
	</div>
</div>
