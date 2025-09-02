<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { sections } from '@Const/Guest/Control/Section';
	import { 
		isNavigationLocked,
		getNavigationCapabilities
	} from '@Utils/Guest/Viewport/Section';
	import { currentSectionIndex, setActiveSection, visibleSections } from '@Stores/Guest/Viewport/Section';
	import { SectionEnum } from '../Enums/Guest/Section';

	let isScrolling = false;
	let isTransitioning = false;
	let scrollTimeout: number;
	let transitionTimeout: number;
	let lastScrollTime = 0;
	let lastScrollDirection: string | null = null;
	let scrollMomentumCount = 0;
	const SCROLL_DEBOUNCE_DELAY = 300; // Much higher for trackpad momentum
	const SCROLL_RESET_DELAY = 500; // Time to reset scrolling state
	const TRANSITION_DELAY = 1500; // Much longer delay for trackpad momentum
	const MOMENTUM_THRESHOLD = 1; // Very strict - only allow first event

	// Subscribe to the current section index from the store
	$: currentIndex = $currentSectionIndex;

	async function handleWheel(event: WheelEvent) {
		const now = Date.now();
		const direction = event.deltaY > 0 ? 'next' : 'previous';
		
		// Always prevent default to stop browser scrolling
		event.preventDefault();
		
		// Block all scroll events during transition
		if (isTransitioning || isScrolling || isNavigationLocked()) {
			return;
		}
		
		// Handle trackpad momentum/inertia scrolling
		if (lastScrollDirection === direction && now - lastScrollTime < SCROLL_DEBOUNCE_DELAY) {
			scrollMomentumCount++;
			// Ignore momentum events beyond threshold
			if (scrollMomentumCount > MOMENTUM_THRESHOLD) {
				return;
			}
		} else {
			// Reset momentum counter for new direction or after delay
			scrollMomentumCount = 0;
		}
		
		// Additional debouncing for rapid events
		if (now - lastScrollTime < SCROLL_DEBOUNCE_DELAY && scrollMomentumCount === 0) {
			return;
		}
		
		// Detect if this might be trackpad momentum (increased threshold)
		const isMomentumScroll = Math.abs(event.deltaY) < 20 && scrollMomentumCount > 0;
		if (isMomentumScroll) {
			return;
		}
		
		// Additional check: reject very rapid successive events
		if (now - lastScrollTime < 50) {
			return;
		}
		
		lastScrollTime = now;
		lastScrollDirection = direction;
		
		const capabilities = getNavigationCapabilities();
		
		try {
			// Start transition blocking
			isScrolling = true;
			isTransitioning = true;
			
			if (direction === 'next' && capabilities.canGoNext) {
				// Use direct section navigation to avoid highlight dependency
				const sections = get(visibleSections);
				const nextIndex = capabilities.currentIndex + 1;
				if (nextIndex < sections.length) {
					setActiveSection(sections[nextIndex].id, { triggerScroll: false });
				}
			} else if (direction === 'previous' && capabilities.canGoPrevious) {
				// Use direct section navigation to avoid highlight dependency
				const sections = get(visibleSections);
				const prevIndex = capabilities.currentIndex - 1;
				if (prevIndex >= 0) {
					setActiveSection(sections[prevIndex].id, { triggerScroll: false });
				}
			}
			
			// Clear existing timeouts
			clearTimeout(scrollTimeout);
			clearTimeout(transitionTimeout);
			
			// First, allow basic scrolling after short delay
			scrollTimeout = setTimeout(() => {
				isScrolling = false;
				scrollMomentumCount = 0; // Reset momentum counter
			}, SCROLL_RESET_DELAY);
			
			// Then, allow section transitions after longer delay
			transitionTimeout = setTimeout(() => {
				isTransitioning = false;
				lastScrollDirection = null; // Reset direction tracking
			}, TRANSITION_DELAY);
			
		} catch (error) {
			console.error('Navigation error:', error);
			// Reset states on error
			isScrolling = false;
			isTransitioning = false;
			scrollMomentumCount = 0;
			lastScrollDirection = null;
		}
	}

	async function handleKeydown(event: KeyboardEvent) {
		// Block all keyboard navigation during transition
		if (isTransitioning || isScrolling || isNavigationLocked()) return;
		
		const capabilities = getNavigationCapabilities();
		let targetSection: SectionEnum | null = null;
		let shouldNavigate = false;
		
		switch (event.key) {
			case 'ArrowDown':
			case 'PageDown':
				event.preventDefault();
				if (capabilities.canGoNext) {
					shouldNavigate = true;
					try {
						// Start transition blocking
						isScrolling = true;
						isTransitioning = true;
						// Use direct section navigation to avoid highlight dependency
						const sections = get(visibleSections);
						const nextIndex = capabilities.currentIndex + 1;
						if (nextIndex < sections.length) {
							setActiveSection(sections[nextIndex].id, { triggerScroll: false });
						}
					} catch (error) {
						console.error('Navigation error:', error);
						// Reset states on error
						isScrolling = false;
						isTransitioning = false;
					}
				}
				break;
			case 'ArrowUp':
			case 'PageUp':
				event.preventDefault();
				if (capabilities.canGoPrevious) {
					shouldNavigate = true;
					try {
						// Start transition blocking
						isScrolling = true;
						isTransitioning = true;
						// Use direct section navigation to avoid highlight dependency
						const sections = get(visibleSections);
						const prevIndex = capabilities.currentIndex - 1;
						if (prevIndex >= 0) {
							setActiveSection(sections[prevIndex].id, { triggerScroll: false });
						}
					} catch (error) {
						console.error('Navigation error:', error);
						// Reset states on error
						isScrolling = false;
						isTransitioning = false;
					}
				}
				break;
			case 'Home':
				event.preventDefault();
				targetSection = SectionEnum.Hero;
				shouldNavigate = true;
				break;
			case 'End':
				event.preventDefault();
				targetSection = SectionEnum.Footer;
				shouldNavigate = true;
				break;
			default:
				return;
		}
		
		if (targetSection) {
			try {
				// Start transition blocking
				isScrolling = true;
				isTransitioning = true;
				// Use direct section navigation to avoid highlight dependency
				setActiveSection(targetSection, { triggerScroll: false });
			} catch (error) {
				console.error('Navigation error:', error);
				// Reset states on error
				isScrolling = false;
				isTransitioning = false;
			}
		}
		
		if (shouldNavigate) {
			// Clear existing timeouts
			clearTimeout(scrollTimeout);
			clearTimeout(transitionTimeout);
			
			// First, allow basic scrolling after short delay
			scrollTimeout = setTimeout(() => {
				isScrolling = false;
			}, SCROLL_RESET_DELAY);
			
			// Then, allow section transitions after longer delay
			transitionTimeout = setTimeout(() => {
				isTransitioning = false;
			}, TRANSITION_DELAY);
		}
	}

	onMount(() => {
		console.log('Guest page initialized');
		
		// Add event listeners
		window.addEventListener('wheel', handleWheel, { passive: false });
		window.addEventListener('keydown', handleKeydown);
		
		// Cleanup on destroy
		return () => {
			window.removeEventListener('wheel', handleWheel);
			window.removeEventListener('keydown', handleKeydown);
			clearTimeout(scrollTimeout);
		};
	});
</script>

<main class="bg-primary-700/5 min-h-screen">
	{#if true}
		{#each sections as section, index}
			{@const isActive = index === currentIndex}
			{@const slideOffset = isActive ? '0' : (index > currentIndex ? '100vh' : '-100vh')}
			<div
				id={section.id}
				class="section-container {isActive ? 'active' : ''}"
				style="
					opacity: {isActive ? '1' : '0'};
					transform: translateY({slideOffset});
					transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
				"
			>
				{#if section.component}
					<svelte:component this={section.component} />
				{/if}
			</div>
		{/each}


	{:else}
		<div class="loading-container">
			<div class="loading-state">
				<div class="loading-spinner"></div>
				<p>Loading sections...</p>
			</div>
		</div>
	{/if}
</main>

<!-- Hide scrollbar globally -->
<style>
	:global(html, body) {
		overflow-x: hidden;
		height: 100vh;
		margin: 0;
		padding: 0;
	}

	.section-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1;
		overflow-y: auto;
		will-change: transform, opacity;
	}

	.section-container.active {
		z-index: 2;
	}

	.loading-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: rgba(0, 0, 0, 0.1);
		z-index: 999;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 16px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-container p {
		color: #666;
		font-size: 16px;
		margin: 0;
	}

	/* Loading State */
	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}





	/* Hide scrollbars but allow scrolling */
	:global(*) {
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* Internet Explorer 10+ */
	}

	:global(*::-webkit-scrollbar) {
		display: none; /* WebKit */
	}
</style>
