import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Locales } from '$lib/types';
import { Locale } from '$lib/enums';

export interface LocaleState {
	current: Locale;
	available: Locales;
}

// Default locale state
const defaultLocale: LocaleState = {
	current: Locale.Id,
	available: [Locale.Id, Locale.En, Locale.Ja]
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
	let current: Locale = Locale.Id;
	localeStore.subscribe((state) => {
		current = state.current;
	})();
	return current;
};