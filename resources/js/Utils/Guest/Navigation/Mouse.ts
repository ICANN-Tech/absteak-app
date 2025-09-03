import { get } from 'svelte/store';
import { 
	isNavigationLocked,
	getNavigationCapabilities
} from '@Utils/Guest/Viewport/Section';
import { setActiveSection, visibleSections } from '@Stores/Guest/Viewport/Section';

/**
 * Type definitions for mouse navigation
 */
export interface MouseNavigationState {
	isScrolling: boolean;
	isTransitioning: boolean;
	lastScrollTime: number;
	lastScrollDirection: string | null;
	scrollMomentumCount: number;
	scrollTimeout?: number;
	transitionTimeout?: number;
}

export interface MouseNavigationConfig {
	SCROLL_DEBOUNCE_DELAY: number;
	SCROLL_RESET_DELAY: number;
	TRANSITION_DELAY: number;
	MOMENTUM_THRESHOLD: number;
}

/**
 * Default configuration for mouse navigation
 */
export const DEFAULT_MOUSE_CONFIG: MouseNavigationConfig = {
	SCROLL_DEBOUNCE_DELAY: 300, // Debounce delay for trackpad momentum
	SCROLL_RESET_DELAY: 500, // Time to reset scrolling state
	TRANSITION_DELAY: 1500, // Delay for section transitions
	MOMENTUM_THRESHOLD: 1, // Threshold for momentum events
};

/**
 * Create a mouse navigation handler with configurable state and settings
 * @param state - The navigation state object
 * @param config - Configuration options for navigation timing
 * @returns A wheel event handler function
 */
export function createMouseNavigationHandler(
	state: MouseNavigationState,
	config: MouseNavigationConfig = DEFAULT_MOUSE_CONFIG
): (event: WheelEvent) => Promise<void> {
	return async function handleWheel(event: WheelEvent): Promise<void> {
		const now = Date.now();
		const direction = event.deltaY > 0 ? 'next' : 'previous';
		
		// Always prevent default to stop browser scrolling
		event.preventDefault();
		
		// Block all scroll events during transition
		if (state.isTransitioning || state.isScrolling || isNavigationLocked()) {
			return;
		}
		
		// Handle trackpad momentum/inertia scrolling
		if (state.lastScrollDirection === direction && now - state.lastScrollTime < config.SCROLL_DEBOUNCE_DELAY) {
			state.scrollMomentumCount++;
			// Ignore momentum events beyond threshold
			if (state.scrollMomentumCount > config.MOMENTUM_THRESHOLD) {
				return;
			}
		} else {
			// Reset momentum counter for new direction or after delay
			state.scrollMomentumCount = 0;
		}
		
		// Additional debouncing for rapid events
		if (now - state.lastScrollTime < config.SCROLL_DEBOUNCE_DELAY && state.scrollMomentumCount === 0) {
			return;
		}
		
		// Detect if this might be trackpad momentum (increased threshold)
		const isMomentumScroll = Math.abs(event.deltaY) < 20 && state.scrollMomentumCount > 0;
		if (isMomentumScroll) {
			return;
		}
		
		// Additional check: reject very rapid successive events
		if (now - state.lastScrollTime < 50) {
			return;
		}
		
		state.lastScrollTime = now;
		state.lastScrollDirection = direction;
		
		const capabilities = getNavigationCapabilities();
		
		try {
			// Start transition blocking
			state.isScrolling = true;
			state.isTransitioning = true;
			
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
			if (state.scrollTimeout) clearTimeout(state.scrollTimeout);
			if (state.transitionTimeout) clearTimeout(state.transitionTimeout);
			
			// First, allow basic scrolling after short delay
			state.scrollTimeout = setTimeout(() => {
				state.isScrolling = false;
				state.scrollMomentumCount = 0; // Reset momentum counter
			}, config.SCROLL_RESET_DELAY);
			
			// Then, allow section transitions after longer delay
			state.transitionTimeout = setTimeout(() => {
				state.isTransitioning = false;
				state.lastScrollDirection = null; // Reset direction tracking
			}, config.TRANSITION_DELAY);
			
		} catch (error) {
			console.error('Navigation error:', error);
			// Reset states on error
			state.isScrolling = false;
			state.isTransitioning = false;
			state.scrollMomentumCount = 0;
			state.lastScrollDirection = null;
		}
	};
}

/**
 * Initialize mouse navigation state with default values
 * @returns A new mouse navigation state object
 */
export function createMouseNavigationState(): MouseNavigationState {
	return {
		isScrolling: false,
		isTransitioning: false,
		lastScrollTime: 0,
		lastScrollDirection: null,
		scrollMomentumCount: 0,
	};
}

/**
 * Clean up mouse navigation resources
 * @param state - The navigation state to clean up
 */
export function cleanupMouseNavigation(state: MouseNavigationState): void {
	if (state.scrollTimeout) {
		clearTimeout(state.scrollTimeout);
		state.scrollTimeout = undefined;
	}
	if (state.transitionTimeout) {
		clearTimeout(state.transitionTimeout);
		state.transitionTimeout = undefined;
	}
}

/**
 * Attach mouse navigation event listeners
 * @param state - The navigation state object
 * @param config - Configuration options for navigation timing
 * @returns Cleanup function to remove event listeners
 */
export function attachMouseNavigation(
	state: MouseNavigationState,
	config: MouseNavigationConfig = DEFAULT_MOUSE_CONFIG
): () => void {
	const handleWheel = createMouseNavigationHandler(state, config);
	
	// Add event listener
	window.addEventListener('wheel', handleWheel, { passive: false });
	
	// Return cleanup function
	return () => {
		window.removeEventListener('wheel', handleWheel);
		cleanupMouseNavigation(state);
	};
}

/**
 * Detach mouse navigation event listeners and cleanup resources
 * @param state - The navigation state to clean up
 */
export function detachMouseNavigation(state: MouseNavigationState): void {
	cleanupMouseNavigation(state);
}