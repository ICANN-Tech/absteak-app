<script context="module" lang="ts">
	import { createAreaBasedStateVisibility, lockVisibility } from '$lib/stores/viewport/visibility';
	import { ComponentId } from '$lib/enums';

	const visibility = createAreaBasedStateVisibility(ComponentId.LanguageSwitch, {
		targetArea: 'left',
		proximityRadius: 150,
		areaOffset: 100,
		hideDelay: 2000,
		showComponent: true
	});

	// Lock visibility to true so it's not affected by monitor systems
	lockVisibility(ComponentId.LanguageSwitch, true);

	export const { isVisible, showComponent } = visibility;
	export const updateVisibilityPosition = visibility.updatePosition;
	export const destroyVisibilityManager = visibility.destroy;
</script>

<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { localeStore } from '$lib/stores/locale';
	import { switchLanguage, getLocaleLabel } from '$lib/utils/locale';
	import { CONTAINER_PRESETS } from '$lib/const';
	import { Locale } from '$lib/enums';
	import { Selector } from '$lib/components/atoms';

	function handleLanguageClick(locale: Locale) {
		switchLanguage(locale);
	}

	$: selectedClass = (locale: string) =>
		`group flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 hover:scale-125 hover:bg-white/20 ${$localeStore.current === locale ? 'bg-white/20' : ''}`;

	onDestroy(() => visibility.destroy);
</script>

{#if $showComponent && $isVisible}
	<div
		class={CONTAINER_PRESETS.positioned.leftCenter}
		transition:fly={{ x: -100, duration: 600 }}
	>
		<div class={`${CONTAINER_PRESETS.panel.blur} flex flex-col flex-wrap gap-4`}>
			<!-- Full interactive version when visible -->
			<button
				on:click={() => switchLanguage(Locale.Id)}
				class={selectedClass(Locale.Id)}
				title={getLocaleLabel(Locale.Id)}
			>
				<Selector locale={Locale.Id} size="xs" />
			</button>

			<button
				on:click={() => handleLanguageClick(Locale.En)}
				class={selectedClass(Locale.En)}
				title={getLocaleLabel(Locale.En)}
			>
				<Selector locale={Locale.En} size="xs" />
			</button>

			<button
				on:click={() => handleLanguageClick(Locale.Ja)}
				class={selectedClass(Locale.Ja)}
				title={getLocaleLabel(Locale.Ja)}
			>
				<Selector locale={Locale.Ja} size="xs" />
			</button>
		</div>
	</div>
{:else if $showComponent}
	<div
		class={`${CONTAINER_PRESETS.panel.blur} ${CONTAINER_PRESETS.positioned.leftCenter}`}
		transition:fly={{ x: -100, duration: 600 }}
	>
		<!-- Minimal version when not visible -->
		{#if $localeStore.current === Locale.Id}
			<Selector locale={Locale.Id} size="xs" />
		{:else if $localeStore.current === Locale.En}
			<Selector locale={Locale.En} size="xs" />
		{:else if $localeStore.current === Locale.Ja}
			<Selector locale={Locale.Ja} size="xs" />
		{/if}
	</div>
{/if}
