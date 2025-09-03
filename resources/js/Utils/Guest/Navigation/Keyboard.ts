import { get } from 'svelte/store';
import { 
	isNavigationLocked,
	getNavigationCapabilities
} from '@Utils/Guest/Viewport/Section';
import { setActiveSection, visibleSections } from '@Stores/Guest/Viewport/Section';
import { SectionEnum } from '@Enums/Guest/Section';

/**
 * Type definitions for keyboard navigation
 */
export interface KeyboardNavigationState {
	isScrolling: boolean;
	isTransitioning: boolean;
	scrollTimeout?: number;
	transitionTimeout?: number;
}

export interface KeyboardNavigationConfig {
	SCROLL_RESET_DELAY: number;
	TRANSITION_DELAY: number;
}

export interface NavigationCapabilities {
	canGoNext: boolean;
	canGoPrevious: boolean;
	currentIndex: number;
}

/**
 * Default configuration for keyboard navigation
 */
export const DEFAULT_KEYBOARD_CONFIG: KeyboardNavigationConfig = {
	SCROLL_RESET_DELAY: 500, // Time to reset scrolling state
	TRANSITION_DELAY: 1500, // Delay for section transitions
};

/**
 * Supported keyboard navigation keys
 */
export const NAVIGATION_KEYS = {
	NEXT: ['ArrowDown', 'PageDown'],
	PREVIOUS: ['ArrowUp', 'PageUp'],
	HOME: ['Home'],
	END: ['End'],
} as const;

/**
 * Create a keyboard navigation handler with configurable state and settings
 * @param state - The navigation state object
 * @param config - Configuration options for navigation timing
 * @returns A keyboard event handler function
 */
export function createKeyboardNavigationHandler(
	state: KeyboardNavigationState,
	config: KeyboardNavigationConfig = DEFAULT_KEYBOARD_CONFIG
): (event: KeyboardEvent) => Promise<void> {
	return async function handleKeydown(event: KeyboardEvent): Promise<void> {
		// Block all keyboard navigation during transition
		if (state.isTransitioning || state.isScrolling || isNavigationLocked()) return;
		
		const capabilities: NavigationCapabilities = getNavigationCapabilities();
		let targetSection: SectionEnum | null = null;
		let shouldNavigate: boolean = false;
		
		switch (event.key) {
			case 'ArrowDown':
			case 'PageDown':
				event.preventDefault();
				if (capabilities.canGoNext) {
					shouldNavigate = true;
					try {
						// Start transition blocking
						state.isScrolling = true;
						state.isTransitioning = true;
						// Use direct section navigation to avoid highlight dependency
						const sections = get(visibleSections);
						const nextIndex = capabilities.currentIndex + 1;
						if (nextIndex < sections.length) {
							setActiveSection(sections[nextIndex].id, { triggerScroll: false });
						}
					} catch (error) {
						console.error('Navigation error:', error);
						// Reset states on error
						state.isScrolling = false;
						state.isTransitioning = false;
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
						state.isScrolling = true;
						state.isTransitioning = true;
						// Use direct section navigation to avoid highlight dependency
						const sections = get(visibleSections);
						const prevIndex = capabilities.currentIndex - 1;
						if (prevIndex >= 0) {
							setActiveSection(sections[prevIndex].id, { triggerScroll: false });
						}
					} catch (error) {
						console.error('Navigation error:', error);
						// Reset states on error
						state.isScrolling = false;
						state.isTransitioning = false;
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
				state.isScrolling = true;
				state.isTransitioning = true;
				// Use direct section navigation to avoid highlight dependency
				setActiveSection(targetSection, { triggerScroll: false });
			} catch (error) {
				console.error('Navigation error:', error);
				// Reset states on error
				state.isScrolling = false;
				state.isTransitioning = false;
			}
		}
		
		if (shouldNavigate) {
			// Clear existing timeouts
			if (state.scrollTimeout) clearTimeout(state.scrollTimeout);
			if (state.transitionTimeout) clearTimeout(state.transitionTimeout);
			
			// First, allow basic scrolling after short delay
			state.scrollTimeout = setTimeout(() => {
				state.isScrolling = false;
			}, config.SCROLL_RESET_DELAY);
			
			// Then, allow section transitions after longer delay
			state.transitionTimeout = setTimeout(() => {
				state.isTransitioning = false;
			}, config.TRANSITION_DELAY);
		}
	};
}

/**
 * Initialize keyboard navigation state with default values
 * @returns A new keyboard navigation state object
 */
export function createKeyboardNavigationState(): KeyboardNavigationState {
	return {
		isScrolling: false,
		isTransitioning: false,
	};
}

/**
 * Clean up keyboard navigation timeouts
 * @param state - The navigation state object
 */
export function cleanupKeyboardNavigation(state: KeyboardNavigationState): void {
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
 * Check if a key is a supported navigation key
 * @param key - The keyboard event key
 * @returns True if the key is supported for navigation
 */
export function isNavigationKey(key: string): boolean {
	return Object.values(NAVIGATION_KEYS).flat().includes(key as any);
}

/**
 * Get the navigation action for a given key
 * @param key - The keyboard key
 * @returns The navigation action or null if not a navigation key
 */
export function getNavigationAction(key: string): 'next' | 'previous' | 'home' | 'end' | null {
	if (NAVIGATION_KEYS.NEXT.includes(key as any)) return 'next';
	if (NAVIGATION_KEYS.PREVIOUS.includes(key as any)) return 'previous';
	if (NAVIGATION_KEYS.HOME.includes(key as any)) return 'home';
	if (NAVIGATION_KEYS.END.includes(key as any)) return 'end';
	return null;
}

/**
 * Attach keyboard navigation event listeners
 * @param state - The navigation state object
 * @param config - Configuration options for navigation timing
 * @returns Cleanup function to remove event listeners
 */
export function attachKeyboardNavigation(
	state: KeyboardNavigationState,
	config: KeyboardNavigationConfig = DEFAULT_KEYBOARD_CONFIG
): () => void {
	const handleKeydown = createKeyboardNavigationHandler(state, config);
	
	// Add event listener
	window.addEventListener('keydown', handleKeydown);
	
	// Return cleanup function
	return () => {
		window.removeEventListener('keydown', handleKeydown);
		cleanupKeyboardNavigation(state);
	};
}

/**
 * Detach keyboard navigation event listeners and cleanup resources
 * @param state - The navigation state to clean up
 */
export function detachKeyboardNavigation(state: KeyboardNavigationState): void {
	cleanupKeyboardNavigation(state);
}