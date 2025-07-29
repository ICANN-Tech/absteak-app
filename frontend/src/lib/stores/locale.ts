import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Locale = 'id' | 'en' | 'ja';

export interface LocaleState {
	current: Locale;
	available: Locale[];
}

// Default locale state
const defaultLocale: LocaleState = {
	current: 'id',
	available: ['id', 'en', 'ja']
};

// Get initial locale from localStorage or default
function getInitialLocale(): LocaleState {
	if (!browser) return defaultLocale;
	
	try {
		const stored = localStorage.getItem('locale');
		if (stored) {
			const parsed = JSON.parse(stored);
			if (defaultLocale.available.includes(parsed.current)) {
				return { ...defaultLocale, current: parsed.current };
			}
		}
	} catch (error) {
		console.warn('Failed to parse stored locale:', error);
	}
	
	return defaultLocale;
}

// Create the locale store
export const localeStore = writable<LocaleState>(getInitialLocale());

// Subscribe to store changes and persist to localStorage
if (browser) {
	localeStore.subscribe((state) => {
		try {
			localStorage.setItem('locale', JSON.stringify(state));
		} catch (error) {
			console.warn('Failed to save locale to localStorage:', error);
		}
	});
}

// Helper to get current locale
export const getCurrentLocale = (): Locale => {
	let current: Locale = 'id';
	localeStore.subscribe((state) => {
		current = state.current;
	})();
	return current;
};