/**
 * Navigation utilities index
 * Provides a unified interface for keyboard and mouse navigation
 */

// Import and re-export keyboard navigation
import {
	createKeyboardNavigationHandler,
	createKeyboardNavigationState,
	cleanupKeyboardNavigation,
	attachKeyboardNavigation,
	detachKeyboardNavigation,
	isNavigationKey,
	getNavigationAction,
	DEFAULT_KEYBOARD_CONFIG,
	NAVIGATION_KEYS,
	type KeyboardNavigationState,
	type KeyboardNavigationConfig,
	type NavigationCapabilities,
} from './Keyboard';

// Import and re-export mouse navigation
import {
	createMouseNavigationHandler,
	createMouseNavigationState,
	cleanupMouseNavigation,
	attachMouseNavigation,
	detachMouseNavigation,
	DEFAULT_MOUSE_CONFIG,
	type MouseNavigationState,
	type MouseNavigationConfig,
} from './Mouse';

// Re-export keyboard navigation
export {
	createKeyboardNavigationHandler,
	createKeyboardNavigationState,
	cleanupKeyboardNavigation,
	attachKeyboardNavigation,
	detachKeyboardNavigation,
	isNavigationKey,
	getNavigationAction,
	DEFAULT_KEYBOARD_CONFIG,
	NAVIGATION_KEYS,
	type KeyboardNavigationState,
	type KeyboardNavigationConfig,
	type NavigationCapabilities,
};

// Re-export mouse navigation
export {
	createMouseNavigationHandler,
	createMouseNavigationState,
	cleanupMouseNavigation,
	attachMouseNavigation,
	detachMouseNavigation,
	DEFAULT_MOUSE_CONFIG,
	type MouseNavigationState,
	type MouseNavigationConfig,
};

/**
 * Combined navigation state interface
 */
export interface NavigationState {
	keyboard: KeyboardNavigationState;
	mouse: MouseNavigationState;
}

/**
 * Combined navigation configuration
 */
export interface NavigationConfig {
	keyboard?: KeyboardNavigationConfig;
	mouse?: MouseNavigationConfig;
}

/**
 * Initialize complete navigation system with both keyboard and mouse support
 * @param config - Optional configuration for both navigation types
 * @returns Navigation state and cleanup function
 */
export function initializeNavigation(config?: NavigationConfig): {
	state: NavigationState;
	cleanup: () => void;
} {
	// Create navigation states
	const keyboardState = createKeyboardNavigationState();
	const mouseState = createMouseNavigationState();
	
	const state: NavigationState = {
		keyboard: keyboardState,
		mouse: mouseState,
	};
	
	// Attach event listeners
	const keyboardCleanup = attachKeyboardNavigation(
		keyboardState,
		config?.keyboard
	);
	const mouseCleanup = attachMouseNavigation(
		mouseState,
		config?.mouse
	);
	
	// Combined cleanup function
	const cleanup = () => {
		keyboardCleanup();
		mouseCleanup();
	};
	
	return { state, cleanup };
}

/**
 * Clean up all navigation resources
 * @param state - The navigation state to clean up
 */
export function cleanupNavigation(state: NavigationState): void {
	cleanupKeyboardNavigation(state.keyboard);
	cleanupMouseNavigation(state.mouse);
}

/**
 * Check if navigation is currently blocked
 * @param state - The navigation state to check
 * @returns True if any navigation is currently blocked
 */
export function isNavigationBlocked(state: NavigationState): boolean {
	return (
		state.keyboard.isScrolling ||
		state.keyboard.isTransitioning ||
		state.mouse.isScrolling ||
		state.mouse.isTransitioning
	);
}

/**
 * Reset all navigation states
 * @param state - The navigation state to reset
 */
export function resetNavigationState(state: NavigationState): void {
	// Reset keyboard state
	state.keyboard.isScrolling = false;
	state.keyboard.isTransitioning = false;
	cleanupKeyboardNavigation(state.keyboard);
	
	// Reset mouse state
	state.mouse.isScrolling = false;
	state.mouse.isTransitioning = false;
	state.mouse.lastScrollTime = 0;
	state.mouse.lastScrollDirection = null;
	state.mouse.scrollMomentumCount = 0;
	cleanupMouseNavigation(state.mouse);
}

/**
 * Create navigation handlers for manual event handling
 * @param state - The navigation state
 * @param config - Optional configuration
 * @returns Object with keyboard and mouse event handlers
 */
export function createNavigationHandlers(
	state: NavigationState,
	config?: NavigationConfig
): {
	keyboard: (event: KeyboardEvent) => Promise<void>;
	mouse: (event: WheelEvent) => Promise<void>;
} {
	return {
		keyboard: createKeyboardNavigationHandler(
			state.keyboard,
			config?.keyboard
		),
		mouse: createMouseNavigationHandler(
			state.mouse,
			config?.mouse
		),
	};
}

/**
 * Default navigation configuration
 */
export const DEFAULT_NAVIGATION_CONFIG: NavigationConfig = {
	keyboard: DEFAULT_KEYBOARD_CONFIG,
	mouse: DEFAULT_MOUSE_CONFIG,
};