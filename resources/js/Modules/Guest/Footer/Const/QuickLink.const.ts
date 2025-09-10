/**
 * Quick Links Constants
 * 
 * This file contains the navigation links configuration for the footer quick links section.
 * Each link includes an ID for navigation, translation key, and fallback text.
 * 
 * @module QuickLinkConstants
 * @version 1.0.0
 */

export interface QuickLinkItem {
  id: string;
  translationKey: string;
  fallback: string;
}

export const QUICK_LINKS: QuickLinkItem[] = [
  { id: 'hero', translationKey: 'home', fallback: 'Home' },
  { id: 'video-highlight', translationKey: 'about', fallback: 'About' },
  { id: 'experience', translationKey: 'experience', fallback: 'Experience' },
  { id: 'chef', translationKey: 'ourChef', fallback: 'Our Chef' },
  { id: 'menu', translationKey: 'menu', fallback: 'Menu' },
  { id: 'booking', translationKey: 'reservations', fallback: 'Reservations' }
];

// Export default for convenience
export default QUICK_LINKS;