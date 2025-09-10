/**
 * Quick Links Constants for Footer Navigation
 * 
 * This file contains the navigation links configuration that integrates with Section.ts
 * for proper section jumping functionality in the footer quick links.
 * 
 * @module QuickLinkConstants
 * @version 1.0.0
 */

import { SectionEnum } from '../../../Enums/Guest/Section';
import type { Sections } from '../../../Types/Guest/Section.type';

export interface QuickLinkItem {
  id: string;
  sectionId: SectionEnum;
  translationKey: string;
  fallback: string;
  name: string;
}

/**
 * Quick links configuration that maps to actual sections
 * Each link corresponds to a section defined in Section.ts
 */
export const QUICK_LINKS: QuickLinkItem[] = [
  { 
    id: 'hero', 
    sectionId: SectionEnum.Hero,
    translationKey: 'home', 
    fallback: 'Home',
    name: 'Hero'
  },
  { 
    id: 'video-highlight', 
    sectionId: SectionEnum.VideoHighlight,
    translationKey: 'about', 
    fallback: 'About',
    name: 'About'
  },
  { 
    id: 'experience', 
    sectionId: SectionEnum.Experience,
    translationKey: 'experience', 
    fallback: 'Experience',
    name: 'Story'
  },
  { 
    id: 'chef', 
    sectionId: SectionEnum.Chef,
    translationKey: 'ourChef', 
    fallback: 'Our Chef',
    name: 'Chef'
  },
  { 
    id: 'menu', 
    sectionId: SectionEnum.Menu,
    translationKey: 'menu', 
    fallback: 'Menu',
    name: 'Menu'
  },
  { 
    id: 'booking', 
    sectionId: SectionEnum.Booking,
    translationKey: 'reservations', 
    fallback: 'Reservations',
    name: 'Reserve'
  }
];

/**
 * Helper function to get section ID by quick link ID
 * @param quickLinkId - The quick link ID
 * @returns The corresponding section enum value
 */
export function getSectionIdByQuickLinkId(quickLinkId: string): SectionEnum | undefined {
  const link = QUICK_LINKS.find(link => link.id === quickLinkId);
  return link?.sectionId;
}

/**
 * Helper function to get quick link by section ID
 * @param sectionId - The section enum value
 * @returns The corresponding quick link item
 */
export function getQuickLinkBySectionId(sectionId: SectionEnum): QuickLinkItem | undefined {
  return QUICK_LINKS.find(link => link.sectionId === sectionId);
}

// Export default for convenience
export default QUICK_LINKS;