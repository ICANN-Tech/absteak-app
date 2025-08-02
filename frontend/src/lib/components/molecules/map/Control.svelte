<script lang="ts">
	import { CONTAINER_SECTION } from '$lib/const';
	import { createTranslationStore } from '$lib/utils/translation';

	const t = createTranslationStore('footer');

	export let address: string;
	export let onGetDirections: () => void = () => {};
	export let onViewLarger: () => void = () => {};
	export let className: string = '';

	$: baseClasses = `${CONTAINER_SECTION.footer.map.content.interactive.control.base} ${className}`;
</script>

<div class={baseClasses}>
	<div class={`${CONTAINER_SECTION.footer.map.content.interactive.control.wrapper}`}>
		<div class={`${CONTAINER_SECTION.footer.map.content.interactive.control.address}`}>
			<span class="text-amber-400">📍</span>
			{address}
		</div>
		<div class={`${CONTAINER_SECTION.footer.map.content.interactive.control.button.base}`}>
			<button
				class={`${CONTAINER_SECTION.footer.map.content.interactive.control.button.direction}`}
				on:click={onGetDirections}
			>
				{$t('getDirections') || 'Get Directions'}
			</button>
			<button
				class={`${CONTAINER_SECTION.footer.map.content.interactive.control.button.view}`}
				on:click={onViewLarger}
			>
				{$t('viewLarger') || 'View Larger'}
			</button>
		</div>
	</div>
</div>
