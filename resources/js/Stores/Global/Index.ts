/**
 * Global State Management System
 * 
 * This module provides comprehensive state management for global application state including:
 * - Locale/Language state management with persistence
 * - Translation utilities and reactive stores
 * - Multi-language support with fallback mechanisms
 * - Consistent global state across the application
 * 
 * @module GlobalStateManagement
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * import {
 *   // Locale Management
 *   LocaleState,
 *   localeStore,
 *   setLocale,
 *   getCurrentLocale,
 *   
 *   // Translation Management
 *   t,
 *   translations,
 *   createTranslationStore
 * } from './Global';
 * 
 * // Locale operations
 * setLocale(LocaleEnum.En);
 * const currentLang = getCurrentLocale();
 * 
 * // Translation operations
 * const welcomeText = t('welcome.message', 'Welcome!');
 * const pageTranslations = createTranslationStore('pages');
 * ```
 */

// Export all types and interfaces
export type {
  LocaleState
} from './Locale';

export type {
  Locales
} from '../../Types/Global/Locale.type';

export type {
  Translations,
  TranslationVariables
} from '../../Utils/Global/Translation';

// Export enums
export { LocaleEnum } from '../../Enums/Global/Locale';

// Export locale store and utilities
export {
  localeStore,
  setLocale,
  getCurrentLocale
} from './Locale';

// Export translation utilities
export {
  t,
  translations,
  createTranslationStore
} from '../../Utils/Global/Translation';

// Re-export everything for convenience
export * from './Locale';
export * from '../../Utils/Global/Translation';

// Import for default export
import {
  localeStore,
  setLocale,
  getCurrentLocale
} from './Locale';

import type { LocaleState } from './Locale';

import {
  t,
  translations,
  createTranslationStore
} from '../../Utils/Global/Translation';

import type {
  Translations,
  TranslationVariables
} from '../../Utils/Global/Translation';

import { LocaleEnum } from '../../Enums/Global/Locale';
import type { Locales } from '../../Types/Global/Locale.type';

/**
 * Default export providing all global state management functionality
 * 
 * @example
 * ```typescript
 * import GlobalStore from './Global';
 * 
 * // Use locale management
 * GlobalStore.setLocale(GlobalStore.LocaleEnum.En);
 * 
 * // Use translation
 * const text = GlobalStore.t('common.welcome');
 * ```
 */
export default {
  // Types
  LocaleEnum,
  
  // Locale Management
  localeStore,
  setLocale,
  getCurrentLocale,
  
  // Translation Management
  t,
  translations,
  createTranslationStore
};