import { writable } from 'svelte/store';
import { LocaleEnum } from '../Enums/Language.enum';
import type { Locales } from '../Types/Locale.type';

// Browser detection utility
const browser = typeof window !== 'undefined';

export interface LocaleState {
	current: LocaleEnum;
	available: Locales;
}

// Default locale state
const defaultLocale: LocaleState = {
	current: LocaleEnum.Id,
	available: [LocaleEnum.Id, LocaleEnum.En, LocaleEnum.Ko]
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

// Helper to set locale
export const setLocale = (locale: LocaleEnum): void => {
	localeStore.update((state) => ({
		...state,
		current: locale
	}));
};

// Helper to get current locale
export const getCurrentLocale = (): LocaleEnum => {
	let current: LocaleEnum = LocaleEnum.Id;
	localeStore.subscribe((state) => {
		current = state.current;
	})();
	return current;
};