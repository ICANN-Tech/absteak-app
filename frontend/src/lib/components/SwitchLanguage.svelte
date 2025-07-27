<script lang="ts">
	import { fly } from 'svelte/transition';
	import { autoHide } from '$lib/utils/index';
	import { createVisibilityHandler, getVisibilityStore } from '$lib/stores/index';

	const isVisible = getVisibilityStore('switch-language');
	const visibilityHandler = createVisibilityHandler('switch-language');

	// Fungsi untuk handle switch language (akan diimplementasi nanti)
	function switchLanguage(lang: string) {
		console.log('Switching to:', lang);
		// Implementasi switch language akan ditambahkan nanti
	}
</script>

<!-- Language Switch Component -->
<div
	use:autoHide={{
		onChange: visibilityHandler,
		delay: 2100
	}}
>
{#if $isVisible}
	<div 
		class="fixed top-1/2 left-4 z-20" 
		transition:fly={{ x: -100, duration: 600 }}
	>
		<div
			class="flex flex-col gap-2 rounded-2xl border border-white/20 bg-primary-950/80 p-3 shadow-lg backdrop-blur-lg"
		>
			<!-- Indonesian Flag -->
			<button
				on:click={() => switchLanguage('id')}
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
				on:click={() => switchLanguage('en')}
				class="group flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 transition-all duration-300 hover:bg-white/20 hover:scale-125"
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
{/if}
</div>
