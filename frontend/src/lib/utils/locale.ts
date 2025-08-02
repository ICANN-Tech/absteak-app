import { localeStore } from '$lib/stores/locale';
import type { Locale } from '$lib/types';
import { get } from 'svelte/store';

// Locale labels untuk display
export const localeLabels: Record<Locale, string> = {
	id: 'Bahasa Indonesia',
	en: 'English',
	ja: '日本語'
};

// Locale codes untuk HTML lang attribute
export const localeCodes: Record<Locale, string> = {
	id: 'id-ID',
	en: 'en-US',
	ja: 'ja-JP'
};

/**
 * Switch to a specific locale
 * @param locale - The locale to switch to
 */
export function switchLanguage(locale: Locale): void {
	const currentState = get(localeStore);
	
	if (currentState.available.includes(locale)) {
		localeStore.update(state => ({
			...state,
			current: locale
		}));
		
		// Update HTML lang attribute
		if (typeof document !== 'undefined') {
			document.documentElement.lang = localeCodes[locale];
		}
		
		console.log(`Language switched to: ${localeLabels[locale]} (${locale})`);
	} else {
		console.warn(`Locale '${locale}' is not available`);
	}
}

/**
 * Get the current locale
 */
export function getCurrentLocale(): Locale {
	return get(localeStore).current;
}

/**
 * Get available locales
 */
export function getAvailableLocales(): Locale[] {
	return get(localeStore).available;
}

/**
 * Get locale label for display
 */
export function getLocaleLabel(locale: Locale): string {
	return localeLabels[locale] || locale;
}

/**
 * Get locale code for HTML lang attribute
 */
export function getLocaleCode(locale: Locale): string {
	return localeCodes[locale] || locale;
}

/**
 * Check if a locale is currently active
 */
export function isLocaleActive(locale: Locale): boolean {
	return getCurrentLocale() === locale;
}