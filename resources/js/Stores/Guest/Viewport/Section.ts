import { writable, derived, get } from 'svelte/store';
import { SectionEnum } from '../../../Enums/Guest/Section';
import type { Component } from 'svelte';

/**
 * Section State Management System
 * 
 * Provides comprehensive section navigation and state management including:
 * - Current section tracking
 * - Section navigation history
 * - Dynamic component loading
 * - Integration with viewport and highlight systems
 * 
 * @module SectionStore
 * @version 1.0.0
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Interface representing a section configuration
 */
export interface SectionConfig {
  /** Section identifier from SectionEnum */
  id: SectionEnum;
  /** Display name of the section */
  name: string;
  /** Component associated with this section */
  component?: Component | null;
  /** Whether the section is currently active */
  isActive: boolean;
  /** Whether the section is visible in navigation */
  isVisible: boolean;
  /** Custom metadata for the section */
  metadata?: Record<string, any>;
}

/**
 * Interface for section navigation state
 */
export interface SectionNavigationState {
  /** Currently active section */
  currentSection: SectionEnum;
  /** Previously active section */
  previousSection: SectionEnum | null;
  /** Navigation history */
  history: SectionEnum[];
  /** Whether navigation is locked */
  isLocked: boolean;
  /** Loading state for section transitions */
  isLoading: boolean;
}

/**
 * Configuration options for section operations
 */
export interface SectionOptions {
  /** Whether to add to navigation history */
  addToHistory?: boolean;
  /** Whether to trigger scroll to section */
  triggerScroll?: boolean;
  /** Whether to respect locked state */
  respectLocks?: boolean;
  /** Whether to load component if not already loaded */
  loadComponent?: boolean;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

// ============================================================================
// SECTION MAPPINGS
// ============================================================================

/**
 * Centralized mapping of section enums to their human-readable display names.
 * This provides a single source of truth for section naming throughout the application.
 * 
 * @example
 * const heroName = SECTION_NAMES[SectionEnum.Hero]; // Returns 'Hero'
 */
const SECTION_NAMES: Record<SectionEnum, string> = {
  [SectionEnum.Hero]: 'Hero',
  [SectionEnum.VideoHighlight]: 'Video Highlight',
  [SectionEnum.Experience]: 'Experience',
  [SectionEnum.Chef]: 'Chef',
  [SectionEnum.Menu]: 'Menu',
  [SectionEnum.Booking]: 'Booking',
  [SectionEnum.Footer]: 'Footer'
} as const;

/**
 * Centralized mapping of section enums to their navigation order indices.
 * This defines the sequence in which sections appear in the application flow.
 * Lower indices appear earlier in the navigation order.
 * 
 * @example
 * const heroOrder = SECTION_ORDER[SectionEnum.Hero]; // Returns 0 (first section)
 */
const SECTION_ORDER: Record<SectionEnum, number> = {
  [SectionEnum.Hero]: 0,
  [SectionEnum.VideoHighlight]: 1,
  [SectionEnum.Experience]: 2,
  [SectionEnum.Chef]: 3,
  [SectionEnum.Menu]: 4,
  [SectionEnum.Booking]: 5,
  [SectionEnum.Footer]: 6
} as const;

/**
 * Creates a standardized section configuration using enum-driven approach.
 * This factory function ensures consistent section configuration creation
 * by automatically resolving display names and order indices from centralized mappings.
 * 
 * Benefits:
 * - Eliminates manual configuration errors
 * - Ensures consistency across all sections
 * - Simplifies section creation process
 * - Centralizes configuration logic
 * 
 * @param id - Section identifier
 * @param overrides - Optional configuration overrides
 * @returns Complete section configuration object with auto-resolved properties
 * 
 * @example
 * const heroConfig = createSectionConfig(SectionEnum.Hero);
 * // Returns: { id: SectionEnum.Hero, name: 'Hero', component: null, isActive: true, isVisible: true, metadata: { order: 0 } }
 */
function createSectionConfig(
  id: SectionEnum,
  overrides: Partial<SectionConfig> = {}
): SectionConfig {
  return {
    id,
    name: SECTION_NAMES[id],
    component: null,
    isActive: id === SectionEnum.Hero, // Only Hero is active by default
    isVisible: true,
    metadata: { order: SECTION_ORDER[id] },
    ...overrides
  };
}

/**
 * Default section configurations using enum-driven approach
 */
const defaultSections: SectionConfig[] = [
  createSectionConfig(SectionEnum.Hero),
  createSectionConfig(SectionEnum.VideoHighlight),
  createSectionConfig(SectionEnum.Experience),
  createSectionConfig(SectionEnum.Chef),
  createSectionConfig(SectionEnum.Menu),
  createSectionConfig(SectionEnum.Booking),
  createSectionConfig(SectionEnum.Footer)
];

/**
 * Initial navigation state
 */
const initialNavigationState: SectionNavigationState = {
  currentSection: SectionEnum.Hero,
  previousSection: null,
  history: [SectionEnum.Hero],
  isLocked: false,
  isLoading: false
};

// ============================================================================
// STORES
// ============================================================================

/**
 * Store containing all section configurations
 */
export const sectionsStore = writable<Map<SectionEnum, SectionConfig>>(new Map(
  defaultSections.map(section => [section.id, section])
));

/**
 * Store containing navigation state
 */
export const navigationStore = writable<SectionNavigationState>(initialNavigationState);

/**
 * Store for tracking section loading states
 */
export const sectionLoadingStore = writable<Map<SectionEnum, boolean>>(new Map());

// ============================================================================
// DERIVED STORES
// ============================================================================

/**
 * Current active section configuration
 */
export const currentSectionConfig = derived(
  [sectionsStore, navigationStore],
  ([$sections, $navigation]) => {
    return $sections.get($navigation.currentSection) || null;
  }
);

/**
 * Array of all visible sections in order
 */
export const visibleSections = derived(
  sectionsStore,
  ($sections) => {
    return Array.from($sections.values())
      .filter(section => section.isVisible)
      .sort((a, b) => (a.metadata?.order || 0) - (b.metadata?.order || 0));
  }
);

/**
 * Current section index in visible sections array
 */
export const currentSectionIndex = derived(
  [visibleSections, navigationStore],
  ([$visibleSections, $navigation]) => {
    return $visibleSections.findIndex(section => section.id === $navigation.currentSection);
  }
);

/**
 * Whether there is a next section available
 */
export const hasNextSection = derived(
  [visibleSections, currentSectionIndex],
  ([$visibleSections, $currentIndex]) => {
    return $currentIndex < $visibleSections.length - 1;
  }
);

/**
 * Whether there is a previous section available
 */
export const hasPreviousSection = derived(
  currentSectionIndex,
  ($currentIndex) => {
    return $currentIndex > 0;
  }
);

// ============================================================================
// CORE SECTION MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Updates a section configuration
 * @param sectionId - Section to update
 * @param updates - Partial configuration updates
 */
export function updateSection(sectionId: SectionEnum, updates: Partial<SectionConfig>): void {
  sectionsStore.update(sections => {
    const section = sections.get(sectionId);
    if (section) {
      sections.set(sectionId, { ...section, ...updates });
    }
    return sections;
  });
}

/**
 * Sets the active section
 * @param sectionId - Section to activate
 * @param options - Configuration options
 */
export function setActiveSection(sectionId: SectionEnum, options: SectionOptions = {}): void {
  const currentNavigation = get(navigationStore);
  
  // Check if navigation is locked
  if (currentNavigation.isLocked && options.respectLocks !== false) {
    console.warn(`Section navigation is locked`);
    return;
  }
  
  // Check if section exists
  const sections = get(sectionsStore);
  const targetSection = sections.get(sectionId);
  if (!targetSection) {
    console.warn(`Section ${sectionId} not found`);
    return;
  }
  
  // Update navigation state
  navigationStore.update(nav => {
    const newHistory = options.addToHistory !== false 
      ? [...nav.history, sectionId]
      : nav.history;
    
    return {
      ...nav,
      currentSection: sectionId,
      previousSection: nav.currentSection,
      history: newHistory
    };
  });
  
  // Update section states
  sectionsStore.update(sections => {
    // Deactivate all sections
    sections.forEach((section, id) => {
      sections.set(id, { ...section, isActive: false });
    });
    
    // Activate target section
    const targetSection = sections.get(sectionId);
    if (targetSection) {
      sections.set(sectionId, { ...targetSection, isActive: true });
    }
    
    return sections;
  });
}

/**
 * Gets the configuration of a specific section
 * @param sectionId - Section to get
 * @returns Section configuration or null if not found
 */
export function getSectionConfig(sectionId: SectionEnum): SectionConfig | null {
  const sections = get(sectionsStore);
  return sections.get(sectionId) || null;
}

/**
 * Gets the current navigation state
 * @returns Current navigation state
 */
export function getNavigationState(): SectionNavigationState {
  return get(navigationStore);
}

/**
 * Locks section navigation
 */
export function lockNavigation(): void {
  navigationStore.update(nav => ({ ...nav, isLocked: true }));
}

/**
 * Unlocks section navigation
 */
export function unlockNavigation(): void {
  navigationStore.update(nav => ({ ...nav, isLocked: false }));
}

/**
 * Sets loading state for navigation
 * @param isLoading - Loading state
 */
export function setNavigationLoading(isLoading: boolean): void {
  navigationStore.update(nav => ({ ...nav, isLoading }));
}

/**
 * Resets all sections to initial state
 */
export function resetSections(): void {
  sectionsStore.set(new Map(
    defaultSections.map(section => [section.id, { ...section }])
  ));
  navigationStore.set({ ...initialNavigationState });
  sectionLoadingStore.set(new Map());
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets the display name for a section using enum mapping.
 * This function provides a centralized way to retrieve human-readable
 * section names from the SECTION_NAMES mapping.
 * 
 * @param sectionId - Section identifier
 * @returns Display name of the section
 * 
 * @example
 * const heroName = getSectionName(SectionEnum.Hero); // Returns 'Hero'
 * const menuName = getSectionName(SectionEnum.Menu); // Returns 'Menu'
 */
export function getSectionName(sectionId: SectionEnum): string {
  return SECTION_NAMES[sectionId];
}

/**
 * Gets the order index for a section using enum mapping.
 * This function provides access to the navigation order index
 * from the SECTION_ORDER mapping, useful for sorting and positioning.
 * 
 * @param sectionId - Section identifier
 * @returns Order index of the section (0-based)
 * 
 * @example
 * const heroOrder = getSectionOrder(SectionEnum.Hero); // Returns 0 (first section)
 * const footerOrder = getSectionOrder(SectionEnum.Footer); // Returns 6 (last section)
 */
export function getSectionOrder(sectionId: SectionEnum): number {
  return SECTION_ORDER[sectionId];
}

/**
 * Gets all section IDs in order
 * @returns Array of section IDs
 */
export function getAllSectionIds(): SectionEnum[] {
  const sections = get(visibleSections);
  return sections.map(section => section.id);
}

/**
 * Gets the index of a section in the visible sections array
 * @param sectionId - Section to find
 * @returns Index or -1 if not found
 */
export function getSectionIndex(sectionId: SectionEnum): number {
  const sections = get(visibleSections);
  return sections.findIndex(section => section.id === sectionId);
}

/**
 * Gets section by index
 * @param index - Index to get
 * @returns Section configuration or null if not found
 */
export function getSectionByIndex(index: number): SectionConfig | null {
  const sections = get(visibleSections);
  return sections[index] || null;
}

/**
 * Checks if a section exists
 * @param sectionId - Section to check
 * @returns True if section exists
 */
export function sectionExists(sectionId: SectionEnum): boolean {
  const sections = get(sectionsStore);
  return sections.has(sectionId);
}

/**
 * Gets the total number of visible sections
 * @returns Number of visible sections
 */
export function getSectionCount(): number {
  return get(visibleSections).length;
}