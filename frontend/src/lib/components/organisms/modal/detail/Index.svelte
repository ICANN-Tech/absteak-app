<script lang="ts">
	import { modalStore, type ModalItem } from '$lib/stores/modal';
	import { fade, scale, fly } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';

	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let position:
		| 'center'
		| 'top-left'
		| 'top-right'
		| 'middle-left'
		| 'middle-right'
		| 'bottom-left'
		| 'bottom-right' = 'center';

	const dispatch = createEventDispatcher();

	let isClosing = false;

	// Size classes mapping
	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	};

	// Position classes mapping
	const positionClasses = {
		center: 'items-center justify-center',
		'top-left': 'items-start justify-start',
		'top-right': 'items-start justify-end',
		'middle-left': 'items-center justify-start',
		'middle-right': 'items-center justify-end',
		'bottom-left': 'items-end justify-start',
		'bottom-right': 'items-end justify-end'
	};

	// Handle modal opening/closing with proper animations
	function closeModal() {
		if (isClosing) return;

		isClosing = true;

		// Wait for animation to complete before actually closing
		setTimeout(() => {
			modalStore.close();
			isClosing = false;
			dispatch('close');
		}, 400); // Match the animation duration
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault(); // Prevent default ESC behavior
			closeModal(); // Use the same closeModal function with animation
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if ($modalStore.isOpen || isClosing) && $modalStore.item}
	<!-- Modal backdrop -->
	<div
		class="fixed inset-0 z-[9999] flex {positionClasses[position]} p-4"
		in:fade={{ duration: 300, easing: quintOut }}
		out:fade={{ duration: 400, easing: quintOut }}
	>
		<!-- Backdrop overlay -->
		<div
			class="absolute inset-0 bg-black/80 backdrop-blur-sm"
			on:click={closeModal}
			role="button"
			tabindex="-1"
			aria-label="Close modal"
		></div>

		<!-- Modal content -->
		<div
			class="relative w-full overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/95 shadow-2xl backdrop-blur-md {sizeClasses[
				size
			]} flex max-h-[90vh] flex-col z-[10000]"
			in:scale={{ duration: 400, easing: backOut, start: 0.8 }}
			out:scale={{ duration: 400, easing: quintOut, start: 0.8 }}
		>
			<!-- Close button -->
			<button
				class="absolute top-4 right-4 z-20 rounded-full border border-gray-600/50 bg-black/60 p-2 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:border-amber-400/50 hover:bg-black/80"
				on:click={closeModal}
				aria-label="Close modal"
				in:scale={{ duration: 300, delay: 200, easing: backOut }}
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<!-- Header with food image -->
			<div class="relative flex-shrink-0">
				<div class="relative h-48 overflow-hidden md:h-64">
					<img
						src={$modalStore.item.img}
						alt={$modalStore.item.name}
						class="h-full w-full object-cover"
						in:fly={{ y: -30, duration: 600, delay: 200, easing: quintOut }}
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"
					></div>
				</div>
			</div>

			<!-- Scrollable Content -->
			<div class="modal-content min-h-0 flex-1 overflow-y-auto p-6">
				<div
					class="flex flex-col gap-4"
					in:fly={{ y: 20, duration: 500, delay: 300, easing: quintOut }}
				>
					<!-- Title and Price -->
					<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div class="flex-1">
							<h2 class="mb-2 text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
								{$modalStore.item.name}
							</h2>
							<p class="text-base leading-relaxed text-gray-200 drop-shadow-sm">
								{$modalStore.item.desc}
							</p>
						</div>
						<div class="flex-shrink-0">
							<div class="text-3xl font-bold text-amber-400 drop-shadow-lg">
								{$modalStore.item.price}
							</div>
						</div>
					</div>

					<!-- Additional details section -->
					<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
						<div class="rounded-lg border border-gray-700/30 bg-gray-800/50 p-3">
							<h3 class="mb-1 text-sm font-semibold text-amber-400">Ingredients</h3>
							<p class="text-xs text-gray-300">
								Premium quality ingredients carefully selected by our chefs.
							</p>
						</div>

						<div class="rounded-lg border border-gray-700/30 bg-gray-800/50 p-3">
							<h3 class="mb-1 text-sm font-semibold text-amber-400">Preparation</h3>
							<p class="text-xs text-gray-300">
								Traditional techniques with modern culinary innovation.
							</p>
						</div>

						<div class="rounded-lg border border-gray-700/30 bg-gray-800/50 p-3">
							<h3 class="mb-1 text-sm font-semibold text-amber-400">Serving</h3>
							<p class="text-xs text-gray-300">
								Perfectly plated and served at optimal temperature.
							</p>
						</div>
					</div>

					<!-- Action button -->
					<div class="mt-6 flex justify-center">
						<button
							class="rounded-full bg-amber-400 px-8 py-3 font-bold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-amber-500 hover:shadow-amber-400/30"
							on:click={() => {
								// Add to cart logic here
								closeModal();
							}}
							in:scale={{ duration: 500, delay: 400, easing: backOut }}
						>
							Order Now
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom scrollbar */
	:global(.modal-content::-webkit-scrollbar) {
		width: 8px;
	}

	:global(.modal-content::-webkit-scrollbar-track) {
		background: rgba(55, 65, 81, 0.3);
		border-radius: 4px;
	}

	:global(.modal-content::-webkit-scrollbar-thumb) {
		background: linear-gradient(180deg, #f59e0b, #d97706);
		border-radius: 4px;
		transition: background 0.2s ease;
	}

	:global(.modal-content::-webkit-scrollbar-thumb:hover) {
		background: linear-gradient(180deg, #d97706, #b45309);
	}

	/* Firefox scrollbar */
	:global(.modal-content) {
		scrollbar-width: thin;
		scrollbar-color: #f59e0b rgba(55, 65, 81, 0.3);
		scroll-behavior: smooth;
	}

	/* Ensure dialog doesn't interfere with backdrop */
	dialog {
		background: transparent;
		border: none;
		outline: none;
	}

	dialog::backdrop {
		display: none;
	}

	/* Prevent body scroll when modal is open */
	:global(body.modal-open) {
		overflow: hidden;
	}
</style>