<script lang="ts">
	import { CONTAINER_OVERFLOW, CONTAINER_PRESETS } from '$lib/const';
	import type { Locale } from '$lib/enums';
	import { getFlagByLocale } from '$lib/utils/flag';

	export let locale: Locale;
	export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

	const sizeClass: Record<typeof size, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

	$: flagComponent = getFlagByLocale(locale);
</script>

<div class={`${sizeClass[size]} ${CONTAINER_OVERFLOW.hidden} ${CONTAINER_PRESETS.wrapper}`}>
	<svelte:component this={flagComponent} size={size} className="h-full w-full" />
</div>
