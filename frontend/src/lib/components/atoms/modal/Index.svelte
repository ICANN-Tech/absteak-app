<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onDestroy, onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { modalStore } from '$lib/stores/modal';
	import { modalManager } from '$lib/utils/modal';
	import { Kbd } from 'flowbite-svelte';
	import { LeftMouseIcon } from '../icon';

	// Props
	export let id: string;
	export let title: string = '';
	export let onClose: () => void;
	export let closeOnBackdrop: boolean = true;
	export let closeOnEscape: boolean = true;
	export let preventScroll: boolean = true;
	export let trapFocus: boolean = true;
	export let animationDuration: number = 100;
	export let animationEasing = cubicOut;
	export let modalClass: string = '';
	export let backdropClass: string = '';
	export let headerClass: string = '';
	export let contentClass: string = '';
	export let footerClass: string = '';
	export let showHeader: boolean = true;
	export let showCloseButton: boolean = true;
	export let showFooter: boolean = false;

	// Modal element reference
	let modalElement: HTMLDivElement;

	// Create derived stores from modal store - only show if this is not a video modal
	import { isVideoModalActive } from '$lib/stores/modal';
	
	const isOpen = derived(modalStore, ($store) => {
		// If this is a video modal (id contains 'video'), check video modal state
		if (id && id.includes('video')) {
			return $store.isOpen && isVideoModalActive();
		} else {
			// For regular modals, only show if no video modal is active
			return $store.isOpen && !isVideoModalActive();
		}
	});
	
	const modalData = derived(modalStore, ($store) => ({
		item: $store.item,
		title: $store.item?.name || '',
		content: $store.item?.desc || '',
		type: 'default',
		data: $store.item
	}));

	// Handle ESC key globally but only close if closeOnEscape is true
	function handleGlobalKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && closeOnEscape && $isOpen) {
			closeModal();
		}
	}

	// Close modal using centralized store
	function closeModal() {
		modalStore.close();
		onClose?.(); // Call the callback if provided
	}

	// Handle backdrop clicks - PERBAIKI INI
	function handleBackdropClick(event: MouseEvent) {
		// Pastikan click tepat di backdrop, bukan di content
		if (closeOnBackdrop && event.target === event.currentTarget) {
			closeModal();
		}
	}

	// Handle focus management for accessibility
	function handleModalIntro(modalElement: HTMLElement) {
		if (trapFocus && modalElement) {
			const focusableElements = modalElement.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			if (focusableElements.length > 0) {
				(focusableElements[0] as HTMLElement).focus();
			}
		}
	}

	function handleCloseButtonClick() {
		closeModal();
	}

	onMount(() => {
		// Set modal element in manager
		modalManager.modal.setModalElement(modalElement);
	});

	onDestroy(() => {});

	// Handle body scroll prevention (fungsi wajib modal)
	$: if ($isOpen) {
		if (preventScroll && typeof document !== 'undefined') {
			document.body.style.overflow = 'hidden';
		}
	} else {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	}

	// Sync modal manager state
	$: modalManager.modal.setModalOpen($isOpen);
</script>

<slot name="event"></slot>

<!-- Global ESC key handler -->
<svelte:window on:keydown={handleGlobalKeydown} />

<!-- Modal backdrop and container -->
{#if $isOpen}
	<div
		bind:this={modalElement}
		tabindex="0"
		aria-label="Close modal"
		class="modal-overlay {modalClass}"
		style="--animation-duration: {animationDuration}ms; --animation-easing: {animationEasing};"
		in:fade={{ duration: animationDuration, easing: cubicOut }}
		out:fade={{ duration: animationDuration, easing: cubicOut }}
		on:introend={() => handleModalIntro(modalElement)}
		role="dialog"
		aria-modal="true"
		aria-labelledby={showHeader ? 'modal-title' : undefined}
	>
		<!-- ESC Hint -->
		{#if closeOnEscape}
			<button
				class="bg-primary-950/20 group absolute bottom-6 left-6 z-10 flex min-w-32 cursor-pointer items-center gap-2 rounded-xl p-6 px-4 py-3 backdrop-blur-md transition-all duration-200"
				in:fade={{ duration: 200, delay: 200 }}
				out:fade={{ duration: 200 }}
				on:click={closeModal}
			>
				<div class="w-full relative flex items-center justify-center">
					<div class="flex flex-wrap gap-2 items-center transition-all duration-200 group-hover:invisible group-hover:opacity-0">
						<Kbd>Esc</Kbd>
						<span class="ml-2 text-sm text-white/80">to close</span>
					</div>

					<div
						class="flex flex-wrap gap-2 items-center invisible absolute opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100"
					>
					<Kbd>
						<LeftMouseIcon size="sm" color="black" />
					</Kbd>
						<span class="ml-2 text-sm text-white/80">to close</span>
					</div>
				</div>
			</button>
		{/if}

		<div class="modal-backdrop {backdropClass}" role="presentation" on:click={handleBackdropClick}>
			<div
				class="modal-content mx-auto {contentClass}"
				in:scale={{
					duration: animationDuration,
					start: 0.9,
					opacity: 0,
					easing: cubicOut
				}}
				out:scale={{
					duration: animationDuration,
					start: 0.9,
					opacity: 0,
					easing: cubicOut
				}}
				on:click|stopPropagation
				on:keydown={(e) => {
					// Allow ESC key to bubble up, stop other keys
					if (e.key !== 'Escape') {
						e.stopPropagation();
					}
				}}
			>
				<!-- Modal Header -->
				{#if showHeader}
					<header class="modal-header {headerClass}">
						<h2 id="modal-title" class="modal-title">
							{$modalData.title}
						</h2>
						{#if showCloseButton}
							<button
								type="button"
								class="modal-close-button"
								on:click={handleCloseButtonClick}
								aria-label="Close modal"
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M18 6L6 18M6 6L18 18"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
						{/if}
					</header>
				{/if}

				<!-- Modal Content -->
				<main class="modal-body">
					<!-- Slot for custom content -->
					<slot modalData={$modalData} isOpen={$isOpen}>
						<!-- Default content when no slot is provided -->
						{#if $modalData.content}
							<p>{$modalData.content}</p>
						{/if}

						{#if $modalData.item}
							<div class="modal-item-details">
								<h3>Item Details</h3>
								<pre>{JSON.stringify($modalData.item, null, 2)}</pre>
							</div>
						{/if}
					</slot>
				</main>

				<!-- Modal Footer -->
				{#if showFooter}
					<footer class="modal-footer {footerClass}">
						<slot name="footer" modalData={$modalData} isOpen={$isOpen}>
							<!-- Default footer content -->
							<button
								type="button"
								class="modal-button modal-button-secondary"
								on:click={handleCloseButtonClick}
							>
								Cancel
							</button>
							<button
								type="button"
								class="modal-button modal-button-primary"
								on:click={handleCloseButtonClick}
							>
								OK
							</button>
						</slot>
					</footer>
				{/if}
			</div>
		</div>
	</div>
{/if}

<!--  -->

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.modal-content {
		position: relative;
		background: transparent;
		border-radius: 1.5rem;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
		max-width: 85vw;
		width: 100%;
		max-height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transform-origin: center;
	}

	.esc-hint {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		backdrop-filter: blur(8px);
		z-index: 1001;
	}

	.esc-key {
		background: rgba(255, 255, 255, 0.2);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-family: monospace;
		font-size: 0.75rem;
		font-weight: bold;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem 1.5rem 0 1.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.modal-title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #111827;
	}

	.modal-close-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 0.25rem;
		color: #6b7280;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-close-button:hover {
		background: #f3f4f6;
		color: #374151;
	}

	.modal-body {
		/* padding: 1.5rem; */
		overflow-y: auto;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.modal-footer {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		padding: 0 1.5rem 1.5rem 1.5rem;
		border-top: 1px solid #e5e7eb;
	}

	.modal-button {
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		border: 1px solid transparent;
		font-size: 0.875rem;
	}

	.modal-button-primary {
		background: #3b82f6;
		color: white;
	}

	.modal-button-primary:hover {
		background: #2563eb;
	}

	.modal-button-secondary {
		background: white;
		color: #374151;
		border-color: #d1d5db;
	}

	.modal-button-secondary:hover {
		background: #f9fafb;
	}

	.modal-item-details {
		margin-top: 1rem;
	}

	.modal-item-details h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #374151;
	}

	.modal-item-details pre {
		background: #f3f4f6;
		padding: 1rem;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		overflow-x: auto;
		margin: 0;
	}

	/* Responsive design */
	@media (max-width: 640px) {
		.modal-content {
			max-width: 95vw;
			max-height: 95vh;
			margin: 0.5rem;
		}

		.modal-header {
			padding: 1rem 1rem 0 1rem;
		}

		.modal-body {
			padding: 1rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		.modal-footer {
			padding: 0 1rem 1rem 1rem;
			flex-direction: column;
		}

		.modal-button {
			width: 100%;
		}

		.esc-hint {
			bottom: 0.5rem;
			left: 0.5rem;
			font-size: 0.75rem;
			padding: 0.5rem 0.75rem;
		}
	}
</style>
