import { localeStore } from '$lib/stores/locale';
import { Locale } from '$lib/enums';
import { derived, readable } from 'svelte/store';

// Type untuk struktur translasi
export interface Translations {
	[key: string]: string | Translations;
}

// Type untuk variabel interpolasi
export interface TranslationVariables {
	[key: string]: string | number;
}

// Function untuk interpolasi variabel dalam string
function interpolateVariables(text: string, variables?: TranslationVariables): string {
	if (!variables || typeof text !== 'string') {
		return text;
	}

	return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
		const value = variables[key];
		return value !== undefined ? String(value) : match;
	});
}

// Cache untuk menyimpan translasi yang sudah dimuat
const translationCache = new Map<Locale, Translations>();

// Function untuk memuat file translasi
async function loadTranslations(locale: Locale, namespace: string = 'common'): Promise<Translations> {
	const cacheKey = `${locale}-${namespace}`;
	if (translationCache.has(cacheKey as Locale)) {
		return translationCache.get(cacheKey as Locale)!;
	}

	try {
		const translations = await import(`$lib/lang/${locale}/${namespace}.json`);
		const data = translations.default || translations;
		translationCache.set(cacheKey as Locale, data);
		return data;
	} catch (error) {
		console.warn(`Failed to load translations for locale: ${locale}, namespace: ${namespace}`, error);
		// Fallback ke bahasa Indonesia jika gagal
		if (locale !== Locale.Id) {
			return loadTranslations(Locale.Id, namespace);
		}
		return {};
	}
}

// Store untuk translasi yang reaktif
export const translations = derived(
	localeStore,
	($localeStore, set) => {
		loadTranslations($localeStore.current, 'common').then(set);
	},
	{} as Translations
);

// Helper function untuk mendapatkan teks terjemahan
export function t(key: string, fallback?: string, variables?: TranslationVariables): string {
	let currentTranslations: Translations = {};
	
	// Subscribe sekali untuk mendapatkan nilai saat ini
	const unsubscribe = translations.subscribe(value => {
		currentTranslations = value;
	});
	unsubscribe();

	// Split key untuk nested object (contoh: "hero.title")
	const keys = key.split('.');
	let result: any = currentTranslations;

	for (const k of keys) {
		if (result && typeof result === 'object' && k in result) {
			result = result[k];
		} else {
			const fallbackText = fallback || key;
			return interpolateVariables(fallbackText, variables);
		}
	}

	const finalText = typeof result === 'string' ? result : fallback || key;
	return interpolateVariables(finalText, variables);
}

// Store yang dapat digunakan dalam template Svelte
export const createTranslationStore = (namespace: string = 'common') => {
	const namespacedTranslations = derived(
		localeStore,
		($localeStore, set) => {
			loadTranslations($localeStore.current, namespace).then(set);
		},
		{} as Translations
	);

	return derived(namespacedTranslations, ($translations) => {
		return (key: string, fallback?: any, variables?: TranslationVariables) => {
			const keys = key.split('.');
			let result: any = $translations;

			for (const k of keys) {
				if (result && typeof result === 'object' && k in result) {
					result = result[k];
				} else {
					const fallbackValue = fallback || key;
					return typeof fallbackValue === 'string' 
						? interpolateVariables(fallbackValue, variables)
						: fallbackValue;
				}
			}

			// Kembalikan hasil apa adanya (string, array, object, dll)
			const finalResult = result !== undefined ? result : fallback || key;
			return typeof finalResult === 'string' 
				? interpolateVariables(finalResult, variables)
				: finalResult;
		};
	});
};