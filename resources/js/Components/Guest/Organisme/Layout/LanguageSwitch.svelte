
<script lang="ts">
	import { ComponentId, createCombinedVisibility, createVisibilityState } from '@Stores/Guest/Viewport/Index';
	import { LocaleEnum, localeStore, setLocale } from '@Stores/Global/Index';
	import { CONTAINER_PRESETS } from '@Const/Guest/UI/Container';
	import { fly } from 'svelte/transition';
	import Selector from '@Components/Global/Atoms/Selector.svelte';

	// Create combined visibility state for LanguageSwitch component
	const visibility = createCombinedVisibility(ComponentId.Locale, {
		targetArea: 'left',
		proximityRadius: 150,
		areaOffset: 100,
		hideDelay: 800
	});

	// Create visibility state for global visibility control
	const globalVisibility = createVisibilityState(ComponentId.Locale);

	const { isDisplay } = visibility;
	const { isVisible } = globalVisibility;

	// Language switching functions
	function switchLanguage(locale: LocaleEnum): void {
		setLocale(locale);
	}

	function handleLanguageClick(locale: LocaleEnum): void {
		switchLanguage(locale);
	}

	// Helper functions
	function selectedClass(locale: LocaleEnum): string {
		const baseClass = 'p-2 rounded-lg transition-all duration-300 hover:bg-white/10';
		const selectedClass = 'bg-orange-500/20 border border-orange-500/30';
		const normalClass = 'bg-white/5 border border-transparent';
		
		return `${baseClass} ${$localeStore.current === locale ? selectedClass : normalClass}`;
	}

	function getLocaleLabel(locale: LocaleEnum): string {
		switch (locale) {
			case LocaleEnum.Id:
				return 'Bahasa Indonesia';
			case LocaleEnum.En:
				return 'English';
			case LocaleEnum.Ja:
				return '日本語';
			default:
				return 'Unknown';
		}
	}
</script>

{#if $isDisplay}
	<div
		class={CONTAINER_PRESETS.positioned.leftCenter}
		transition:fly={{ x: -100, duration: 600 }}
	>
		<div class={`${CONTAINER_PRESETS.panel.blur} flex flex-col flex-wrap gap-4`}>
			<button
				on:click={() => switchLanguage(LocaleEnum.Id)}
				class={selectedClass(LocaleEnum.Id)}
				title={getLocaleLabel(LocaleEnum.Id)}
			>
				<Selector locale={LocaleEnum.Id} size="xs" />
			</button>

			<button
				on:click={() => handleLanguageClick(LocaleEnum.En)}
				class={selectedClass(LocaleEnum.En)}
				title={getLocaleLabel(LocaleEnum.En)}
			>
				<Selector locale={LocaleEnum.En} size="xs" />
			</button>

			<button
				on:click={() => handleLanguageClick(LocaleEnum.Ja)}
				class={selectedClass(LocaleEnum.Ja)}
				title={getLocaleLabel(LocaleEnum.Ja)}
			>
				<Selector locale={LocaleEnum.Ja} size="xs" />
		</button>
	</div>
</div>
{:else}
	{#if $isVisible}
		<div
			class={CONTAINER_PRESETS.positioned.leftCenter}
			transition:fly={{ x: -100, duration: 600 }}
		>
			<div class={`${CONTAINER_PRESETS.panel.blur} p-2`}>
				<Selector locale={$localeStore.current} size="xs" />
			</div>
		</div>
	{/if}
{/if}
