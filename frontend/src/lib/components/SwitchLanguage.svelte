<script lang="ts">
	import { fly } from 'svelte/transition';
	import { createIndicatorAutoHide } from '$lib/utils/autoPositionHide';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	// Fungsi untuk handle switch language (akan diimplementasi nanti)
	function switchLanguage(lang: string) {
		console.log('Switching to:', lang);
		// Implementasi switch language akan ditambahkan nanti
	}

	// Auto-hide functionality dengan cursor proximity detection
	let autoHide: ReturnType<typeof createIndicatorAutoHide> | null = null;
	let autoVisible = false; // Start hidden

	// Konfigurasi untuk left side positioning (karena switch language di kiri)
	const autoHideConfig = {
		hideDelay: 3000,
		positionThreshold: 0.8, // Untuk left side: clientX < innerWidth * (1 - 0.8) = 20% kiri
		positionSide: 'left' as const,
		initialVisible: false // Start hidden
	};

	// Enable auto-hide functionality
	const useAutoHide = true;

	// Determine final visibility - gunakan autoVisible jika useAutoHide aktif
	$: finalVisible = useAutoHide ? autoVisible : true;

	function handleLanguageClick(lang: string) {
		switchLanguage(lang);
		// Show component when user interacts
		if (autoHide) {
			autoHide.startHideTimer();
		}
	}

	onMount(() => {
		if (browser && useAutoHide) {
			autoHide = createIndicatorAutoHide(autoHideConfig);
			// Subscribe to auto-hide visibility
			const unsubscribe = autoHide.visible.subscribe(value => {
				autoVisible = value;
			});
			
			return unsubscribe;
		}
	});

	onDestroy(() => {
		if (autoHide) {
			autoHide.destroy();
		}
	});
</script>

<!-- Language Switch Component -->
{#if finalVisible}
	<div class="fixed left-4 top-1/2 -translate-y-1/2 z-20" transition:fly={{ x: -100, duration: 600 }}>
		<div
			class="bg-primary-950/80 flex flex-col gap-2 rounded-2xl border border-white/20 p-3 shadow-lg backdrop-blur-lg"
		>
			<!-- Indonesian Flag -->
			<button
				on:click={() => handleLanguageClick('id')}
				class="group flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 transition-all duration-300 hover:scale-125 hover:bg-white/20"
				title="Bahasa Indonesia"
			>
				<div class="h-6 w-8 overflow-hidden rounded-sm shadow-md">
					<!-- Indonesian Flag SVG -->
					<svg viewBox="0 0 3 2" class="h-full w-full">
						<rect width="3" height="1" fill="#FF0000" />
						<rect width="3" height="1" y="1" fill="#FFFFFF" />
					</svg>
				</div>
			</button>

			<!-- English Flag -->
			<button
				on:click={() => handleLanguageClick('en')}
				class="group flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 transition-all duration-300 hover:scale-125 hover:bg-white/20"
				title="English"
			>
				<div class="h-6 w-8 overflow-hidden rounded-sm shadow-md">
					<!-- UK Flag SVG -->
					<svg viewBox="0 0 60 30" class="h-full w-full">
						<!-- Blue background -->
						<rect width="60" height="30" fill="#012169" />
						<!-- White diagonals -->
						<g fill="white">
							<polygon points="0,0 60,30 60,24 8,0" />
							<polygon points="0,30 60,0 60,6 8,30" />
							<polygon points="0,6 52,30 60,30 60,24 8,0 0,0" />
							<polygon points="0,24 52,0 60,0 60,6 8,30 0,30" />
						</g>
						<!-- Red diagonals -->
						<g fill="#C8102E">
							<polygon points="0,0 60,30 60,26 6,0" />
							<polygon points="0,30 60,0 60,4 6,30" />
							<polygon points="0,4 54,30 60,30 60,26 6,0 0,0" />
							<polygon points="0,26 54,0 60,0 60,4 6,30 0,30" />
						</g>
						<!-- White cross -->
						<g fill="white">
							<rect x="25" y="0" width="10" height="30" />
							<rect x="0" y="10" width="60" height="10" />
						</g>
						<!-- Red cross -->
						<g fill="#C8102E">
							<rect x="27" y="0" width="6" height="30" />
							<rect x="0" y="12" width="60" height="6" />
						</g>
					</svg>
				</div>
			</button>
		</div>
	</div>
{:else}
	<div class="fixed top-1/2 -translate-y-1/2 z-20" transition:fly={{ x: -100, duration: 600 }}>
		<div
			class="bg-primary-950/80 flex flex-col gap-2 rounded-tr-2xl rounded-br-2xl border border-white/20 shadow-lg backdrop-blur-lg overflow-hidden"
		>
			<!-- Indonesian Flag (collapsed state) -->
			<div
				class="group flex h-14 w-14 items-center justify-center bg-white/10 transition-all duration-300"
				title="Bahasa Indonesia"
			>
				<div class="h-4 w-6 overflow-hidden rounded-sm shadow-md">
					<!-- Indonesian Flag SVG -->
					<svg viewBox="0 0 3 2" class="h-full w-full">
						<rect width="3" height="1" fill="#FF0000" />
						<rect width="3" height="1" y="1" fill="#FFFFFF" />
					</svg>
				</div>
			</div>
		</div>
	</div>
{/if}
