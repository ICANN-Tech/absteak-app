<script lang="ts">
	import { ControlMap, DetailContact, LandmarkMap } from '$lib/components/molecules';
	import { CONTAINER_SECTION, UI_LAYOUT } from '$lib/const';
	import { createTranslationStore } from '$lib/utils/translation';

	const t = createTranslationStore('footer');

	$: address = $t('address');
	$: phone = '021-123-4567';
	$: email = 'info@absteak.com';
	$: title = $t('title');
	$: description = $t('description');
</script>

<div class="mx-auto {UI_LAYOUT.maxWidth.content}">
	<div class={`${CONTAINER_SECTION.footer.map.content.base}`}>
		<div class={`${CONTAINER_SECTION.footer.map.content.info.location.base}`}>
			<div class={`${CONTAINER_SECTION.footer.map.content.info.base}`}>
				<h2 class={`${CONTAINER_SECTION.footer.map.content.info.title}`}>
					{title}
				</h2>
				<p class={`${CONTAINER_SECTION.footer.map.content.info.description}`}>
					{description}
				</p>
			</div>
			<DetailContact {address} {phone} {email} />
		</div>

		<div class={`${CONTAINER_SECTION.footer.map.content.info.location.base}`}>
			<LandmarkMap restaurantName="ABSteak" />
			<ControlMap {address} />
		</div>
	</div>
</div>
