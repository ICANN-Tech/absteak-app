import { JapanFlag, IndonesiaFlag, UnitedKingdomFlag } from '$lib/components/atoms';
import { Locale } from '$lib/enums'; // Import your Locale enum

// Type for the returned Svelte Component
type FlagComponent = typeof IndonesiaFlag | typeof UnitedKingdomFlag | typeof JapanFlag; // Or a more generic SvelteComponent type

/**
 * Returns the Svelte component for a given locale's flag.
 * @param locale The Locale enum value.
 * @returns A Svelte component reference for the flag.
 */
export function getFlagByLocale(locale: Locale): FlagComponent | null {
  switch (locale) {
    case Locale.Id:
      return IndonesiaFlag;
    case Locale.En:
      return UnitedKingdomFlag;
    case Locale.Ja:
      return JapanFlag;
    default:
      console.warn(`No flag component found for locale: ${locale}`);
      return null;
  }
}