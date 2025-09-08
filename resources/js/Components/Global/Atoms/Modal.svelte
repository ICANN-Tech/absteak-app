<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onDestroy } from 'svelte';
	import Kbd from '@Components/Global/Atoms/Kbd.svelte';
	import { LeftMouseIcon } from '@Components/Global/Atoms/Icons/Index';

	// Props
	export let show = false;
	export let closeOnBackdropClick = true;
	export let closeOnEscape = true;
	export let size: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'video' = 'md';
	export let title: string = '';
	export let preventScroll: boolean = true;
	export let trapFocus: boolean = true;
	export let animationDuration: number = 200;
	export let animationEasing = cubicOut;
	export let modalClass: string = '';
	export let backdropClass: string = '';
	export let headerClass: string = '';
	export let contentClass: string = '';
	export let showHeader: boolean = true;
	export let showCloseButton: boolean = true;
	export let closeButtonPosition: 'inside' | 'outside' = 'inside';

	// Event callbacks
	export let onclose: (() => void) | undefined = undefined;
	export let onopen: (() => void) | undefined = undefined;

	// Modal element reference
	let modalElement: HTMLDivElement;
	let previousActiveElement: HTMLElement | null = null;

	// Watch for show state changes
	let previousShowState = false;
	$: {
		if (show !== previousShowState) {
			if (show) {
				onopen?.();
				// Store the currently focused element
				if (typeof document !== 'undefined') {
					previousActiveElement = document.activeElement as HTMLElement;
				}
			} else {
				// Restore focus to previous element
				if (previousActiveElement && typeof document !== 'undefined') {
					previousActiveElement.focus();
					previousActiveElement = null;
				}
				onclose?.();
			}
			previousShowState = show;
		}
	}

	// Handle body scroll prevention
	$: if (show && preventScroll && typeof document !== 'undefined') {
		document.body.style.overflow = 'hidden';
	} else if (!show && typeof document !== 'undefined') {
		document.body.style.overflow = '';
	}

	function closeModal() {
		show = false;
	}

	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdropClick && event.target === event.currentTarget) {
			closeModal();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (closeOnEscape && event.key === 'Escape') {
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

	// Handle focus trapping
	function handleModalKeydown(event: KeyboardEvent) {
		if (!trapFocus || !modalElement) return;

		if (event.key === 'Tab') {
			const focusableElements = modalElement.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			const firstElement = focusableElements[0] as HTMLElement;
			const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

			if (event.shiftKey) {
				if (document.activeElement === firstElement) {
					event.preventDefault();
					lastElement?.focus();
				}
			} else {
				if (document.activeElement === lastElement) {
					event.preventDefault();
					firstElement?.focus();
				}
			}
		}
	}

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-full w-full h-full',
		video: 'max-w-7xl w-full'
	};

	onDestroy(() => {
		// Cleanup scroll prevention
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	});
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<div 
		bind:this={modalElement}
		class="modal-overlay fixed inset-0 z-50 flex items-center justify-center {modalClass}"
		class:bg-black={size !== 'video'}
		class:bg-opacity-50={size !== 'video'}
		class:bg-opacity-85={size === 'video'}
		class:backdrop-blur-sm={size !== 'video'}
		class:backdrop-blur-md={size === 'video'}
		on:click={handleBackdropClick}
		on:keydown={handleModalKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby={showHeader && title ? 'modal-title' : undefined}
		tabindex="-1"
		in:fade={{ duration: animationDuration, easing: animationEasing }}
		out:fade={{ duration: animationDuration, easing: animationEasing }}
		on:introend={() => trapFocus && handleModalIntro(modalElement)}
	>
		<div class="modal-backdrop {backdropClass}" role="presentation">
			<div 
				class="modal-content relative w-full {sizeClasses[size]} mx-4 {contentClass}"
				class:bg-white={size !== 'video'}
				class:rounded-lg={size !== 'video'}
				class:shadow-xl={size !== 'video'}
				class:overflow-hidden={size !== 'video'}
				in:scale={{ duration: animationDuration, start: 0.9, opacity: 0, easing: animationEasing }}
				out:scale={{ duration: animationDuration, start: 0.9, opacity: 0, easing: animationEasing }}
				on:click|stopPropagation
			>
				<!-- Close button for video modal (outside) -->
				{#if showCloseButton && closeButtonPosition === 'outside'}
					<button
						class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-20 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
						on:click={closeModal}
						aria-label="Close modal"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}

				<!-- Modal Header -->
				{#if showHeader && size !== 'video'}
					<header class="modal-header flex items-center justify-between p-4 border-b {headerClass}">
						<h2 id="modal-title" class="modal-title text-lg font-semibold">
							{title}
						</h2>
						{#if showCloseButton && closeButtonPosition === 'inside'}
							<button
								type="button"
								class="modal-close-button text-gray-400 hover:text-gray-600 transition-colors p-1"
								on:click={closeModal}
								aria-label="Close modal"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						{/if}
					</header>
				{/if}

				<!-- Modal Content -->
				<div class="modal-body" class:p-4={size !== 'video'}>
					<slot />
				</div>
			</div>

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
		</div>
	</div>
{/if}