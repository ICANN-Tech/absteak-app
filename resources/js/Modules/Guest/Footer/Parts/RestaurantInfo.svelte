<script context="module" lang="ts">
	import { page } from "@inertiajs/svelte";
	import { CONTAINER_SECTION } from "../../../../Const/Guest/UI/Container";
	import { LogoIcon } from "../../../../Components/Global/Atoms/Icons/Index";
    import { createMultilingualTranslation } from "@/Utils/Global/Translation";
</script>

<script lang="ts">
	const translation = createMultilingualTranslation(
		() => $page.props.tagline.general,
		['title', 'description']
	)
</script>

<div class={CONTAINER_SECTION.footer.main.info.base}>
	<div>
		<LogoIcon size="lg" />

		<p class={CONTAINER_SECTION.footer.main.info.tagline}>
			{$translation?.title}
		</p>
		<p class={CONTAINER_SECTION.footer.main.info.description}>
			{$translation?.description}
		</p>
	</div>
</div>
