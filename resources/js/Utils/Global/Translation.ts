import { localeStore } from '../../Stores/Global/Locale';
import { LocaleEnum } from '../../Enums/Global/Locale';
import { derived, type Readable } from 'svelte/store';
import { page } from '@inertiajs/svelte';

// Type untuk struktur translasi
export interface Translations {
	[key: string]: string | Translations;
}

// Type untuk variabel interpolasi
export interface TranslationVariables {
	[key: string]: string | number;
}

// Type for multilingual configuration value
export interface MultilingualValue {
	[key: string]: string | undefined;
	en?: string;
	id?: string;
}

// Type for configuration structure
export interface ConfigurationValue {
	title?: MultilingualValue;
	description?: MultilingualValue;
	[key: string]: any;
}

// Type for configuration item
export interface ConfigurationItem {
	type: string;
	value: ConfigurationValue;
}

// Type for all configurations
export interface Configurations {
	[key: string]: ConfigurationItem;
}

// Type definitions for better type safety
export interface TranslationConfig<T = any> {
	key?: string;
	value?: T;
	group?: string;
	type?: string;
}

export interface TranslatedResult<T = any> {
	raw: T;
	text?: string;
	[key: string]: any;
}

/**
 * Get translated text from multilingual configuration value
 * @param multilingualValue - Object containing translations for different languages
 * @param currentLocale - Current locale from store
 * @param fallback - Fallback text if translation not found
 * @returns Translated text
 */
export function getTranslatedText(
	multilingualValue: MultilingualValue | undefined,
	currentLocale: LocaleEnum,
	fallback: string = ''
): string {
	if (!multilingualValue) return fallback;
	
	// Try to get text for current locale
	const localeKey = currentLocale.toLowerCase();
	const text = multilingualValue[localeKey];
	if (text) return text;
	
	// Fallback to other language if current not available
	const fallbackLocale = currentLocale === LocaleEnum.En ? 'id' : 'en';
	return multilingualValue[fallbackLocale] || fallback;
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
const translationCache = new Map<LocaleEnum, Translations>();

// Function untuk memuat file translasi
async function loadTranslations(locale: LocaleEnum, namespace: string = 'common'): Promise<Translations> {
	const cacheKey = `${locale}-${namespace}` as LocaleEnum;
	if (translationCache.has(cacheKey)) {
		return translationCache.get(cacheKey)!;
	}

	try {
		// Dynamic import for translation files
		const translations = await import(`../../Lang/${locale}/${namespace}.json`);
		const data = translations.default || translations;
		translationCache.set(cacheKey, data);
		return data;
	} catch (error) {
		console.warn(`Failed to load translations for locale: ${locale}, namespace: ${namespace}`, error);
		// Fallback ke bahasa Indonesia jika gagal
		if (locale !== LocaleEnum.Id) {
			return loadTranslations(LocaleEnum.Id, namespace);
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
/**
 * Configuration for multilingual translation
 */
interface MultilingualTranslationConfig<T = any> {
	data: T[] | T | (() => T[] | T);
	fields: string[];
	namespace?: string;
	fallbackLocale?: LocaleEnum;
}

/**
 * Result type for multilingual translation
 */
type MultilingualTranslationResult<T> = T extends any[] ? T : T;

/**
 * Translation function type
 */
type TranslationFunction = (key: string, fallback?: any, variables?: TranslationVariables) => string;

/**
 * Translation store type that can be used with $ syntax
 */
type TranslationStore = import('svelte/store').Readable<TranslationFunction>;

/**
 * Creates a reusable translation function that handles both single translations and multilingual objects.
 * Supports configuration-based data input, dynamic data handling, and maintains backward compatibility.
 * 
 * @param config - Configuration object or namespace string for backward compatibility
 * @param fields - Translation fields (optional when using namespace)
 * @returns Svelte store with translation function
 * 
 * @example
 * // Single translation with namespace
 * const t = createMultilingualTranslation('common');
 * $t('greeting') // Returns translated greeting
 * 
 * @example
 * // Configuration-based multilingual objects
 * const menuTranslation = createMultilingualTranslation({
 *   data: () => $page.props.configurations?.menu,
 *   fields: ['name', 'description'],
 *   namespace: 'menu'
 * });
 * 
 * @example
 * // Dynamic array data
 * const itemsTranslation = createMultilingualTranslation({
 *   data: menuItems,
 *   fields: ['title', 'content']
 * });
 */
// Function overloads for better type safety
export function createMultilingualTranslation(namespace: string): TranslationStore;
export function createMultilingualTranslation<T = any>(config: MultilingualTranslationConfig<T>, fields?: string[]): import('svelte/store').Readable<any>;
export function createMultilingualTranslation<T = any>(
	data: T[] | T | (() => T[] | T),
	fields?: string[],
	namespace?: string
): Readable<any>;
export function createMultilingualTranslation<T = any>(
	config: MultilingualTranslationConfig<T> | string | T[] | T | (() => T[] | T),
	fields?: string[],
	namespace: string = 'common'
): any {
	// Handle backward compatibility - if config is string, treat as namespace
	if (typeof config === 'string') {
		return createTranslationStore(config);
	}

	// Handle direct data input (like ConfigurationTranslation.ts)
	if (typeof config === 'function' || Array.isArray(config) || (typeof config === 'object' && config !== null && !('data' in config))) {
		return derived(
			[page, localeStore],
			([$page, $localeStore]) => {
				const currentLocale = $localeStore.current;
				const localeKey = currentLocale.toLowerCase();
				
				// Get data (support function or direct value)
				const resolvedData = (typeof config === 'function' && 'call' in config) ? (config as () => T[] | T)() : config;
				
				if (!resolvedData) {
					return fields ? 
						fields.reduce((acc, field) => ({ ...acc, [field]: '' }), { raw: null }) :
						{ text: '', raw: null };
				}
				
				// Handle array of data
				if (Array.isArray(resolvedData)) {
					return resolvedData.map(item => translateConfigItem(item, fields, currentLocale, localeKey));
				}
				
				// Handle single data item
				return translateConfigItem(resolvedData, fields, currentLocale, localeKey);
			}
		);
	}

	const { data, fields: configFields, namespace: configNamespace = 'common', fallbackLocale = LocaleEnum.En } = config as MultilingualTranslationConfig<T>;
	const translationFields = configFields || fields || [];
	const finalNamespace = configNamespace || namespace;

	// Create namespace-based translations for fallback
	const namespacedTranslations = derived(
		localeStore,
		($localeStore, set) => {
			loadTranslations($localeStore.current, finalNamespace).then(set);
		},
		{} as Translations
	);

	return derived(
		[localeStore, namespacedTranslations],
		([$localeStore, $namespacedTranslations]) => {
			/**
			 * Main translation function that handles both single translations and multilingual objects
			 * @param keyOrData - Translation key for namespace-based translations, or undefined for data-based
			 * @param fallback - Fallback value if translation not found
			 * @param variables - Variables for string interpolation
			 * @returns Translated content
			 */
			const translate = (keyOrData?: string, fallback?: any, variables?: TranslationVariables) => {
				// If keyOrData is provided, handle as namespace-based translation
				if (keyOrData) {
					return translateWithNamespace(keyOrData, $namespacedTranslations, fallback, variables);
				}

				// Handle data-based translation
				return translateWithData();
			};

			/**
			 * Translates using namespace-based approach (traditional method)
			 */
			const translateWithNamespace = (
				key: string,
				translations: Translations,
				fallback?: any,
				variables?: TranslationVariables
			) => {
				const keys = key.split('.');
				let result: any = translations;

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

				const finalResult = result !== undefined ? result : fallback || key;
				return typeof finalResult === 'string'
					? interpolateVariables(finalResult, variables)
					: finalResult;
			};

			/**
			 * Translates using configuration-based data approach
			 */
			const translateWithData = (): MultilingualTranslationResult<T> => {
				const currentLocale = $localeStore.current;
				
				// Resolve data (handle function or direct value)
				const resolvedData = (typeof data === 'function' && 'call' in data)
					? (data as () => T[] | T)()
					: data;

				if (!resolvedData) {
					return resolvedData as MultilingualTranslationResult<T>;
				}

				// Handle array data
				if (Array.isArray(resolvedData)) {
					return resolvedData.map(item => 
						translateItem(item, translationFields, currentLocale, finalNamespace)
					) as MultilingualTranslationResult<T>;
				}

				// Handle single item
				return translateItem(
					resolvedData,
					translationFields,
					currentLocale,
					finalNamespace
				) as MultilingualTranslationResult<T>;
			};

			/**
			 * Helper function to translate individual items
			 */
			const translateItem = (
				item: any,
				fields: string[],
				currentLocale: LocaleEnum,
				namespace: string
			) => {
				if (!item || typeof item !== 'object') {
					return item;
				}

				const translatedItem = { ...item };

				for (const field of fields) {
					if (item[field]) {
						try {
							const fieldData = typeof item[field] === 'string'
								? JSON.parse(item[field])
								: item[field];

							if (fieldData && typeof fieldData === 'object') {
								// Try current locale first, then fallback
								const localeKey = currentLocale.toLowerCase();
								translatedItem[field] = fieldData[localeKey] 
									|| fieldData[fallbackLocale.toLowerCase()] 
									|| fieldData[Object.keys(fieldData)[0]] 
									|| item[field];
							} else {
								translatedItem[field] = item[field];
							}
						} catch {
							// If parsing fails, use original value
							translatedItem[field] = item[field];
						}
					}
				}

				return translatedItem;
			};

			return translate;
		}
	);
};

/**
 * Creates a translation store for namespace-based translations
 * Maintained for backward compatibility with existing code
 */
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

/**
 * Create a reactive store for multilingual data translation (legacy support)
 * @param configKey - Key of the configuration (e.g., 'experience')
 * @param fields - Optional array of field names to translate
 * @returns Derived store with translated data
 */
export function createMultilingualStore(configKey: string, fields?: string[]): Readable<any> {
	return derived(
		[page, localeStore],
		([$page, $localeStore]) => {
			const configurations = $page.props.configurations as Configurations || {};
			const config = configurations[configKey];
			return translateConfigItem(config, fields, $localeStore.current, $localeStore.current.toLowerCase());
		}
	);
}

/**
 * Get specific translated field from configuration
 * @param configKey - Key of the configuration
 * @param fieldKey - Key of the field (e.g., 'title', 'description')
 * @param fallback - Fallback text
 * @returns Derived store with translated field
 */
export function createConfigurationField(configKey: string, fieldKey: string, fallback: string = '') {
	return derived(
		[page, localeStore],
		([$page, $localeStore]) => {
			const configurations = $page.props.configurations as Configurations || {};
			const config = configurations[configKey];
			
			if (!config || !config.value || !config.value[fieldKey]) {
				return fallback;
			}
			
			const currentLocale = $localeStore.current;
			return getTranslatedText(config.value[fieldKey] as MultilingualValue, currentLocale, fallback);
		}
	);
}

/**
 * Backward compatibility alias for createMultilingualStore with fields
 * @param configKey - Key of the configuration (e.g., 'experience')
 * @returns Derived store with translated configuration (title and description)
 */
export function createConfigurationTranslation(configKey: string) {
	return createMultilingualStore(configKey, ['title', 'description']);
}

/**
 * Utility function to get all available configurations with translations
 * @returns Derived store with all translated configurations
 */
export function createAllConfigurationsTranslation() {
	return derived(
		[page, localeStore],
		([$page, $localeStore]) => {
			const configurations = $page.props.configurations as Configurations || {};
			const currentLocale = $localeStore.current;
			const translatedConfigs: Record<string, any> = {};
			
			for (const [key, config] of Object.entries(configurations)) {
				if (config && config.value) {
					translatedConfigs[key] = {
						title: getTranslatedText(config.value.title, currentLocale, 'Title'),
						description: getTranslatedText(config.value.description, currentLocale, 'Description'),
						raw: config.value
					};
				}
			}
			
			return translatedConfigs;
		}
	);
}

/**
 * Helper function to translate individual configuration items
 */
function translateConfigItem(item: any, fields?: string[], currentLocale?: LocaleEnum, localeKey?: string): any {
	if (!item) return fields ? fields.reduce((acc, field) => ({ ...acc, [field]: '' }), { raw: null }) : { text: '', raw: null };
	
	// Helper function to translate nested values
	const translateNestedValue = (value: any): any => {
		if (!value) return value;
		
		// Handle array of multilingual objects
		if (Array.isArray(value)) {
			return value.map(arrayItem => {
				if (arrayItem && typeof arrayItem === 'object') {
					// Check if it's a multilingual object (has locale keys)
					if (arrayItem[localeKey!] || arrayItem['en'] || arrayItem['id']) {
						return getTranslatedText(arrayItem as MultilingualValue, currentLocale!, '');
					}
					// If it's an object with nested fields, recursively translate
					return translateConfigItem(arrayItem, undefined, currentLocale, localeKey);
				}
				return arrayItem;
			});
		}
		
		// Handle multilingual object
		if (typeof value === 'object' && (value[localeKey!] || value['en'] || value['id'])) {
			return getTranslatedText(value as MultilingualValue, currentLocale!, '');
		}
		
		return value;
	};
	
	// Handle configuration object with value property
	if (item.value) {
		if (fields && fields.length > 0) {
			const translatedFields = fields.reduce((acc, field) => {
				const fieldValue = item.value[field];
				acc[field] = translateNestedValue(fieldValue) || '';
				return acc;
			}, {} as Record<string, any>);
			
			return { ...translatedFields, raw: item.value };
		}
		
		const directTranslation = item.value[localeKey!] || item.value['en'] || item.value['id'] || '';
		return { text: directTranslation, raw: item.value };
	}
	
	// Handle direct multilingual object
	if (fields && fields.length > 0) {
		const translatedFields = fields.reduce((acc, field) => {
			const fieldValue = item[field];
			acc[field] = translateNestedValue(fieldValue) || '';
			return acc;
		}, {} as Record<string, any>);
		
		return { ...translatedFields, raw: item };
	}
	
	// Handle direct translation object
	const directTranslation = item[localeKey!] || item['en'] || item['id'] || '';
	return { text: directTranslation, raw: item };
}