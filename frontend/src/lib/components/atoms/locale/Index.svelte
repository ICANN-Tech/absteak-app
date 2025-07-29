<script lang="ts">
	import { fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { UnitedKingdomIcon, IndonesiaIcon, JapanFlag } from '$lib/components/atoms';
	import { createAreaBasedStateVisibility } from '$lib/stores/viewport/visibility';
	import { localeStore, type Locale } from '$lib/stores/locale';
	import { switchLanguage, getLocaleLabel } from '$lib/utils/locale';

	function handleLanguageClick(locale: Locale) {
		switchLanguage(locale);
	}

	const visibility = createAreaBasedStateVisibility('language', {
		targetArea: 'left',
		proximityRadius: 150,
		areaOffset: 100,
		initialVisible: false,
		hideDelay: 2000,
		showComponent: true
	});
	const { isVisible, showComponent } = visibility;

	$: selectedClass = (locale: string) => `group flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 hover:scale-125 hover:bg-white/20 ${$localeStore.current === locale ? 'bg-white/20' : ''}`;

	onDestroy(() => {
		visibility.destroy();
	});
</script>

{#if $isVisible}
	<div
		class="fixed left-4 top-1/2 z-20 -translate-y-1/2"
		transition:fly={{ x: -100, duration: 600 }}
	>
		<div
			class="bg-primary-950/80 flex flex-col gap-2 rounded-2xl border border-white/20 p-3 shadow-lg backdrop-blur-lg"
		>
			<button
				on:click={() => handleLanguageClick('id')}
				class={selectedClass('id')}
				title={getLocaleLabel('id')}
			>
				<div class="h-6 w-8 overflow-hidden rounded-sm shadow-md">
					<IndonesiaIcon size="md" className="h-full w-full" />
				</div>
			</button>

			<button
				on:click={() => handleLanguageClick('en')}
				class={selectedClass('en')}
				title={getLocaleLabel('en')}
			>
				<div class="h-6 w-8 overflow-hidden rounded-sm shadow-md">
					<UnitedKingdomIcon size="md" className="h-full w-full" />
				</div>
			</button>

			<button
				on:click={() => handleLanguageClick('ja')}
				class={selectedClass('ja')}
				title={getLocaleLabel('ja')}
			>
				<div class="h-6 w-8 overflow-hidden rounded-sm shadow-md">
					<JapanFlag size="md" className="h-full w-full" />
				</div>
			</button>
		</div>
	</div>
{:else}
	<div class="fixed top-1/2 z-20 -translate-y-1/2" transition:fly={{ x: -100, duration: 600 }}>
		<div
			class="bg-primary-950/80 flex flex-col gap-2 overflow-hidden rounded-br-2xl rounded-tr-2xl border border-white/20 shadow-lg backdrop-blur-lg"
		>
			<div
				class="group flex h-14 w-14 items-center justify-center bg-white/10 transition-all duration-300"
				title={getLocaleLabel($localeStore.current)}
			>
				<div class="h-4 w-6 overflow-hidden rounded-sm shadow-md">
					{#if $localeStore.current === 'id'}
						<IndonesiaIcon size="md" className="h-full w-full" />
					{:else if $localeStore.current === 'en'}
						<UnitedKingdomIcon size="md" className="h-full w-full" />
					{:else if $localeStore.current === 'ja'}
						<JapanFlag size="md" className="h-full w-full" />
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
