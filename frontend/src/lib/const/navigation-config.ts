// Configuration for which sections to show in different components
export interface NavigationConfig {
  // All sections that can be scrolled to
  allSections: string[];
  
  // Sections to show in header navigation
  headerSections: string[];
  
  // Sections to show in indicator
  indicatorSections: string[];
}

export const navigationConfig: NavigationConfig = {
  // All available sections (user can scroll to all of these)
  allSections: [
    'hero',
    'video-highlight', 
    'experience',
    'chef',
    'menu',
    'booking',
    'footer'
  ],
  
  // Only these sections will appear in header navigation
  // Example: showing only 3 sections in header
  headerSections: [
    'video-highlight',
    'experience',
    'chef', 
    'menu',
    'booking'
  ],
  
  // Only these sections will appear in indicator
  // Example: showing only 2 sections in indicator
  indicatorSections: [
    'hero',
    'video-highlight',
    'experience',
    'chef',
    'menu',
    'booking'
  ]
};

// Helper functions to get filtered sections
export function getHeaderSections(allSections: any[]) {
  if (!allSections || !Array.isArray(allSections)) {
    return [];
  }
  return allSections.filter(section => 
    navigationConfig.headerSections.includes(section.id)
  );
}

export function getIndicatorSections(allSections: any[]) {
  if (!allSections || !Array.isArray(allSections)) {
    return [];
  }
  return allSections.filter(section => 
    navigationConfig.indicatorSections.includes(section.id)
  );
}

export function getAllSections(allSections: any[]) {
  if (!allSections || !Array.isArray(allSections)) {
    return [];
  }
  return allSections.filter(section => 
    navigationConfig.allSections.includes(section.id)
  );
}