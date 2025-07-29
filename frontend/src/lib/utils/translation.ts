import { localeStore, type Locale } from '$lib/stores/locale';
import { derived, readable } from 'svelte/store';

// Type untuk struktur translasi
export interface Translations {
	[key: string]: string | Translations;
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
		if (locale !== 'id') {
			return loadTranslations('id', namespace);
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
export function t(key: string, fallback?: string): string {
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
			return fallback || key;
		}
	}

	return typeof result === 'string' ? result : fallback || key;
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
		return (key: string, fallback?: any) => {
			const keys = key.split('.');
			let result: any = $translations;

			for (const k of keys) {
				if (result && typeof result === 'object' && k in result) {
					result = result[k];
				} else {
					return fallback || key;
				}
			}

			// Kembalikan hasil apa adanya (string, array, object, dll)
			return result !== undefined ? result : fallback || key;
		};
	});
};