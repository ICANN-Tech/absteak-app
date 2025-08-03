<script context="module" lang="ts">
	import Title from './parts/Title.svelte';
	import Information from './parts/Information.svelte';
	import Nutrition from './parts/Nutrition.svelte';
</script>

<script lang="ts">
	import { Modal } from '$lib/components/atoms';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { DetailModalService } from '../../../services/detail/modal.service';
	import type { DetailMenuItem, DetailModalProps } from '../../../types/menu.type';

	// Props with proper typing
	export let animationDuration: DetailModalProps['animationDuration'] = 400;

	// Callback props (modern Svelte approach instead of createEventDispatcher)
	export let onOpen: (() => void) | undefined = undefined;
	export let onClose: (() => void) | undefined = undefined;
	export let onModalOpened: (() => void) | undefined = undefined;
	export let onModalClosed: (() => void) | undefined = undefined;

	// Use the service for modal state management
	const isModalOpen = DetailModalService.isOpen();
	const currentItem = DetailModalService.getCurrentItem();
	const modalId = DetailModalService.getModalId();

	// Watch for modal state changes to call callback props
	let previousModalState = false;
	$: {
		if ($isModalOpen !== previousModalState) {
			if ($isModalOpen) {
				onOpen?.();
				onModalOpened?.();
			} else {
				onClose?.();
				onModalClosed?.();
			}
			previousModalState = $isModalOpen;
		}
	}

	function closeModal() {
		DetailModalService.close();
	}
</script>

<Modal
	id={modalId}
	onClose={closeModal}
	closeOnBackdrop={true}
	closeOnEscape={true}
	preventScroll={true}
	trapFocus={false}
	{animationDuration}
	modalClass="detail-modal " 
	backdropClass="detail-modal-backdrop"
	contentClass="min-w-[35vw] max-w-[90vw] detail-modal-content"
	showHeader={false}
	showCloseButton={false}
	showFooter={false}
>
	{#if $currentItem}
		<!-- Content Container -->
		<div class="overflow-y-auto rounded-2xl bg-gray-900/95">
			<!-- Header with food image -->
			<div class="relative flex-shrink-0">
				<div class="relative h-40 overflow-hidden rounded-t-2xl md:h-48">
					<button 
						aria-label="Close modal"
						class="bg-primary-950/40 group-hover:bg-primary-950 absolute right-2 top-2 z-10 cursor-pointer rounded-full p-4 text-white transition-all"
						on:click={closeModal}
					>
						<svg
							class="group-hover:text-primary-500 h-5 w-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
					<img
						src={$currentItem.img}
						alt={$currentItem.name}
						class="h-full w-full object-cover"
						in:fly={{ y: -30, duration: 600, delay: 200, easing: quintOut }}
					/>
					<div
						class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"
					></div>
				</div>
			</div>
			<div
				class="relative space-y-4 p-4"
				in:fly={{ y: 20, duration: 500, delay: 300, easing: quintOut }}
			>
				<!-- Title and Price -->
				<Title name={$currentItem.name} price={$currentItem.price} desc={$currentItem.desc} />

				<!-- Additional details section -->
				<Information category={$currentItem.category} ingredients={$currentItem.ingredients} allergens={$currentItem.allergens} />

				<!-- Nutrition info if available -->
				{#if $currentItem.nutritionInfo}
					<Nutrition
						calories={$currentItem.nutritionInfo.calories}
						protein={$currentItem.nutritionInfo.protein}
						carbs={$currentItem.nutritionInfo.carbs}
						fat={$currentItem.nutritionInfo.fat}
					/>
				{/if}
			</div>
		</div>
	{/if}
</Modal>

<style>
	:global(.detail-modal) {
		padding: 0 !important;
		border: none !important;
		background: transparent !important;
		max-width: 100vw !important;
		max-height: 100vh !important;
		width: 100% !important;
		height: 100% !important;
		overflow: hidden !important;
		outline: none !important;
		box-shadow: none !important;
	}

	:global(.detail-modal-backdrop) {
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		width: 100% !important;
		height: 100% !important;
		padding: 1rem !important;
		background: rgba(0, 0, 0, 0.5) !important;
		backdrop-filter: blur(4px) !important;
		border: none !important;
		outline: none !important;
	}

	:global(.detail-modal-content) {
		background: transparent !important;
		border-radius: 0 !important;
		box-shadow: none !important;
		max-width: 400px !important;
		width: 100% !important;
		max-height: 90vh !important;
		overflow: hidden !important;
		display: flex !important;
		flex-direction: column !important;
		align-items: center !important;
		justify-content: center !important;
		padding: 0 !important;
		margin: 0 auto !important;
		position: relative !important;
		border: none !important;
		outline: none !important;
		pointer-events: auto !important;
	}
</style>
