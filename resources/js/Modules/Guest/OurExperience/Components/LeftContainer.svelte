<script context="module" lang="ts">
    import {
        CONTAINER_RESPONSIVE,
        CONTAINER_SECTION,
    } from "@Const/Guest/UI/Container";
    import { page } from '@inertiajs/svelte';
    import { createMultilingualTranslation } from '@Utils/Global/Translation';
</script>

<script lang="ts">
	const translation = createMultilingualTranslation(
		() => $page.props.experience.general,
		['title', 'subtitle', 'content']
	);

    $: textContainerClasses = `${CONTAINER_SECTION.experience.content.left} ${CONTAINER_RESPONSIVE.text.base}`;

    $: {
        console.log('Experience', $page.props.experience);
    }
</script>

<div class={`${textContainerClasses}`}>
    <!-- Title -->
    <h2 class={CONTAINER_SECTION.experience.text.title}>
        {$translation.title || "Our Experience"}
    </h2>

    <!-- Subtitle -->
    <p class={CONTAINER_SECTION.experience.text.description}>
        {$translation.subtitle}
    </p>

	<!-- Content -->
    <p>{$translation.content || "Experience Description"}</p>
</div>
