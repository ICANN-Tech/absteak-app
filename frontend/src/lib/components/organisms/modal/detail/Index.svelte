<script lang="ts">
	import { fade, scale, fly } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { createModalManager, modalDataStore, type ModalItem } from '$lib/utils/modal';

	// Props
	export let show = false;
	export let modalItem: ModalItem | null = null;
	export let showEscHint = true;

	// Modal Manager Config Props
	export let closeOnBackdrop = true;
	export let closeOnEscape = true;
	export let animationDuration = 400;
	export let preventBodyScroll = true;

	// Styling props
	export let backdropClass =
		'fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm';
	export let modalContainerClass = 'relative w-full overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/95 shadow-2xl backdrop-blur-md flex max-h-[90vh] flex-col z-[10000]';
	export let escHintClass =
		'absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 text-sm text-white backdrop-blur-sm';

	// Size and position props
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let position:
		| 'center'
		| 'top-left'
		| 'top-right'
		| 'middle-left'
		| 'middle-right'
		| 'bottom-left'
		| 'bottom-right' = 'center';

	// Animation props
	export let fadeInDuration = 300;
	export let scaleInDuration = 400;
	export let scaleInStart = 0.8;

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		open: void;
		close: void;
		modalOpened: void;
		modalClosed: void;
		orderNow: ModalItem;
	}>();

	// Create modal manager instance (keeping for potential future use)
	const modalManager = createModalManager({
		closeOnBackdrop,
		closeOnEscape,
		animationDuration,
		preventBodyScroll
	});

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

	// Reactive statement to handle show/hide
	$: if (show) {
		handleOpen();
	} else {
		handleClose();
	}

	// Sync modal manager state with component state
	$: modalManager.setModalOpen(show);

	function handleOpen() {
		if (modalItem) {
			modalDataStore.setItem(modalItem, {
				type: 'menu-item',
				title: modalItem.name,
				content: modalItem.desc
			});
		}
		modalManager.openModal();
		dispatch('open');
		dispatch('modalOpened');
	}

	function handleClose() {
		modalManager.closeModal();
		modalDataStore.clearItem();
		dispatch('close');
		dispatch('modalClosed');
	}

	function closeModal() {
		show = false;
	}

	// Use modal manager's backdrop click handler directly
	function handleBackdropClick(event: MouseEvent) {
		// Let the modal manager handle the backdrop click logic
		modalManager.handleBackdropClick(event);
		// The modal manager will call closeModal if conditions are met
		// We need to sync the component state when the modal manager closes
		if (closeOnBackdrop && event.target === event.currentTarget && modalManager.isModalOpen()) {
			closeModal();
		}
	}

	function handleBackdropKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			// For keyboard events, we handle it directly since modal manager expects MouseEvent
			if (closeOnBackdrop && event.target === event.currentTarget && modalManager.isModalOpen()) {
				closeModal();
			}
		}
	}

	// Remove the local handleKeydown function since we're using modalManager.handleKeydown directly in svelte:window

	function handleOrderNow() {
		if ($modalDataStore.item) {
			dispatch('orderNow', $modalDataStore.item);
		}
		closeModal();
	}

	// Cleanup on destroy
	onDestroy(() => {
		modalManager.destroy();
	});
</script>

<svelte:window on:keydown={(event) => {
	if (show && closeOnEscape && event.key === 'Escape') {
		closeModal();
	}
}} />

{#if show}
	<div
		class="{backdropClass} {positionClasses[position]}"
		tabindex="0"
		role="button"
		aria-label="Close modal"
		on:click={handleBackdropClick}
		on:keydown={handleBackdropKeydown}
		transition:fade={{ duration: fadeInDuration }}
	>
		<!-- ESC Hint -->
		{#if showEscHint}
			<div class={escHintClass} in:fade={{ duration: fadeInDuration, delay: 200 }}>
				<kbd class="rounded bg-white/20 px-1.5 py-0.5 font-mono text-xs">ESC</kbd>
				<span>to close</span>
			</div>
		{/if}

		<!-- Modal container -->
		<div
			class="{modalContainerClass} {sizeClasses[size]}"
			transition:scale={{ duration: scaleInDuration, start: scaleInStart }}
			on:click|stopPropagation
			role="dialog"
			aria-modal="true"
		>
			{#if $modalDataStore.item}
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
							src={$modalDataStore.item.img}
							alt={$modalDataStore.item.name}
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
									{$modalDataStore.item.name}
								</h2>
								<p class="text-base leading-relaxed text-gray-200 drop-shadow-sm">
									{$modalDataStore.item.desc}
								</p>
							</div>
							<div class="flex-shrink-0">
								<div class="text-3xl font-bold text-amber-400 drop-shadow-lg">
									{$modalDataStore.item.price}
								</div>
							</div>
						</div>

						<!-- Additional details section -->
						<div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
							<div class="rounded-lg border border-gray-700/30 bg-gray-800/50 p-3">
								<h3 class="mb-1 text-sm font-semibold text-amber-400">Ingredients</h3>
								<p class="text-xs text-gray-300">
									{#if $modalDataStore.item.ingredients && $modalDataStore.item.ingredients.length > 0}
										{$modalDataStore.item.ingredients.join(', ')}
									{:else}
										Premium quality ingredients carefully selected by our chefs.
									{/if}
								</p>
							</div>

							<div class="rounded-lg border border-gray-700/30 bg-gray-800/50 p-3">
								<h3 class="mb-1 text-sm font-semibold text-amber-400">Category</h3>
								<p class="text-xs text-gray-300">
									{$modalDataStore.item.category || 'Signature Dish'}
								</p>
							</div>

							<div class="rounded-lg border border-gray-700/30 bg-gray-800/50 p-3">
								<h3 class="mb-1 text-sm font-semibold text-amber-400">Allergens</h3>
								<p class="text-xs text-gray-300">
									{#if $modalDataStore.item.allergens && $modalDataStore.item.allergens.length > 0}
										{$modalDataStore.item.allergens.join(', ')}
									{:else}
										Please inform staff of any allergies.
									{/if}
								</p>
							</div>
						</div>

						<!-- Nutrition info if available -->
						{#if $modalDataStore.item.nutritionInfo}
							<div class="mt-4 rounded-lg border border-gray-700/30 bg-gray-800/50 p-4">
								<h3 class="mb-2 text-sm font-semibold text-amber-400">Nutrition Information</h3>
								<div class="grid grid-cols-2 gap-2 text-xs text-gray-300 md:grid-cols-4">
									<div>Calories: {$modalDataStore.item.nutritionInfo.calories}</div>
									<div>Protein: {$modalDataStore.item.nutritionInfo.protein}</div>
									<div>Carbs: {$modalDataStore.item.nutritionInfo.carbs}</div>
									<div>Fat: {$modalDataStore.item.nutritionInfo.fat}</div>
								</div>
							</div>
						{/if}

						<!-- Action button -->
						<div class="mt-6 flex justify-center">
							<button
								class="rounded-full bg-amber-400 px-8 py-3 font-bold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-amber-500 hover:shadow-amber-400/30"
								on:click={handleOrderNow}
								in:scale={{ duration: 500, delay: 400, easing: backOut }}
							>
								Order Now
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Slot for additional content -->
		<slot />
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