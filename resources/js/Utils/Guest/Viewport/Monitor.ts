import { navigationStore, sectionsStore, sectionLoadingStore, currentSectionIndex, getSectionName } from '../../../Stores/Guest/Viewport/Section';
import type { SectionNavigationState, SectionConfig } from '../../../Stores/Guest/Viewport/Section';
import { SectionEnum } from '../../../Enums/Guest/Section';
import { ComponentId, showComponent, hideComponent } from '../../../Stores/Guest/Viewport/Visibility';
import { get } from 'svelte/store';

/**
 * Section Monitoring System
 * 
 * Provides comprehensive monitoring and logging functionality for section state changes.
 * Tracks section activations, component loading, and navigation events for debugging
 * and performance analysis.
 * 
 * @module SectionMonitor
 * @version 1.0.0
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Interface for monitoring configuration
 */
export interface MonitorConfig {
  /** Whether to enable console logging */
  enableConsoleLogging?: boolean;
  /** Whether to log section activations */
  logSectionActivations?: boolean;
  /** Whether to log component loading events */
  logComponentLoading?: boolean;
  /** Whether to log navigation state changes */
  logNavigationChanges?: boolean;
  /** Whether to include timestamps in logs */
  includeTimestamps?: boolean;
  /** Custom log prefix */
  logPrefix?: string;
}

/**
 * Interface for section activation event
 */
export interface SectionActivationEvent {
  /** Section that became active */
  activeSection: SectionEnum;
  /** Previously active section */
  previousSection: SectionEnum | null;
  /** Timestamp of activation */
  timestamp: Date;
  /** Section configuration */
  sectionConfig: SectionConfig | null;
}

/**
 * Interface for component loading event
 */
export interface ComponentLoadingEvent {
  /** Section being loaded */
  section: SectionEnum;
  /** Loading state */
  isLoading: boolean;
  /** Timestamp of event */
  timestamp: Date;
}

// ============================================================================
// MONITORING STATE
// ============================================================================

/**
 * Default monitoring configuration
 */
const defaultConfig: MonitorConfig = {
  enableConsoleLogging: true,
  logSectionActivations: true,
  logComponentLoading: true,
  logNavigationChanges: true,
  includeTimestamps: true,
  logPrefix: '[SectionMonitor]'
};

/**
 * Current monitoring configuration
 */
let currentConfig: MonitorConfig = { ...defaultConfig };

/**
 * Previous navigation state for comparison
 */
let previousNavigationState: SectionNavigationState | null = null;

/**
 * Previous loading states for comparison
 */
let previousLoadingStates: Map<SectionEnum, boolean> = new Map();

/**
 * Previous section index for comparison
 */
let previousSectionIndex: number = -1;

/**
 * Previous sections map for deep comparison
 */
let previousSectionsMap: Map<SectionEnum, SectionConfig> = new Map();

/**
 * Change detection state tracking
 */
interface ChangeDetectionState {
  lastNavigationChange: Date;
  lastLoadingChange: Date;
  lastSectionChange: Date;
  changeCount: number;
}

let changeDetectionState: ChangeDetectionState = {
  lastNavigationChange: new Date(),
  lastLoadingChange: new Date(),
  lastSectionChange: new Date(),
  changeCount: 0
};

// ============================================================================
// DEEP COMPARISON UTILITIES
// ============================================================================

/**
 * Performs deep comparison of navigation states to detect specific changes.
 * This function provides granular change detection, allowing the monitor
 * to respond only to relevant state changes and avoid unnecessary processing.
 * 
 * Benefits:
 * - Reduces unnecessary event handling
 * - Provides specific change information for targeted responses
 * - Improves performance by avoiding redundant operations
 * - Enables detailed logging of state transitions
 * 
 * @param current - Current navigation state
 * @param previous - Previous navigation state (null for initial state)
 * @returns Object indicating what specific changes occurred
 * 
 * @example
 * const changes = compareNavigationStates(newState, oldState);
 * if (changes.sectionChanged) {
 *   // Handle section activation
 * }
 */
function compareNavigationStates(
  current: SectionNavigationState,
  previous: SectionNavigationState | null
): {
  hasChanges: boolean;
  sectionChanged: boolean;
  lockChanged: boolean;
  loadingChanged: boolean;
  historyChanged: boolean;
} {
  if (!previous) {
    return {
      hasChanges: true,
      sectionChanged: true,
      lockChanged: false,
      loadingChanged: false,
      historyChanged: true
    };
  }

  const sectionChanged = current.currentSection !== previous.currentSection;
  const lockChanged = current.isLocked !== previous.isLocked;
  const loadingChanged = current.isLoading !== previous.isLoading;
  const historyChanged = current.history.length !== previous.history.length ||
    !current.history.every((section, index) => section === previous.history[index]);

  return {
    hasChanges: sectionChanged || lockChanged || loadingChanged || historyChanged,
    sectionChanged,
    lockChanged,
    loadingChanged,
    historyChanged
  };
}

/**
 * Performs deep comparison of section configuration maps to detect changes.
 * This function identifies which specific sections have been modified, added, or removed,
 * enabling targeted responses to configuration changes.
 * 
 * The comparison checks:
 * - Section additions and removals
 * - Changes to section properties (name, component, visibility, etc.)
 * - Deep equality of configuration objects
 * 
 * @param current - Current section configurations map
 * @param previous - Previous section configurations map
 * @returns Array of section IDs that have changed configurations
 * 
 * @example
 * const changedSections = compareSectionConfigs(newConfigs, oldConfigs);
 * changedSections.forEach(sectionId => {
 *   console.log(`Section ${sectionId} configuration changed`);
 * });
 */
function compareSectionConfigs(
  current: Map<SectionEnum, SectionConfig>,
  previous: Map<SectionEnum, SectionConfig>
): SectionEnum[] {
  const changedSections: SectionEnum[] = [];

  // Check for changes in existing sections
  current.forEach((currentConfig, sectionId) => {
    const previousConfig = previous.get(sectionId);
    
    if (!previousConfig) {
      changedSections.push(sectionId);
      return;
    }

    // Compare key properties that affect functionality
    if (
      currentConfig.isActive !== previousConfig.isActive ||
      currentConfig.isVisible !== previousConfig.isVisible ||
      currentConfig.component !== previousConfig.component ||
      JSON.stringify(currentConfig.metadata) !== JSON.stringify(previousConfig.metadata)
    ) {
      changedSections.push(sectionId);
    }
  });

  // Check for removed sections
  previous.forEach((_, sectionId) => {
    if (!current.has(sectionId) && !changedSections.includes(sectionId)) {
      changedSections.push(sectionId);
    }
  });

  return changedSections;
}

/**
 * Updates the change detection state with timestamp and counter.
 * This function maintains a record of when different types of changes occurred,
 * which is useful for debugging, performance monitoring, and change frequency analysis.
 * 
 * The state tracking includes:
 * - Timestamps for each type of change
 * - Total change counter for overall activity monitoring
 * - Separate tracking for navigation, loading, and section changes
 * 
 * @param changeType - Type of change that occurred ('navigation', 'loading', or 'section')
 * 
 * @example
 * updateChangeDetectionState('navigation'); // Records navigation change timestamp
 * updateChangeDetectionState('section');   // Records section change timestamp
 */
function updateChangeDetectionState(changeType: 'navigation' | 'loading' | 'section'): void {
  const now = new Date();
  changeDetectionState.changeCount++;
  
  switch (changeType) {
    case 'navigation':
      changeDetectionState.lastNavigationChange = now;
      break;
    case 'loading':
      changeDetectionState.lastLoadingChange = now;
      break;
    case 'section':
      changeDetectionState.lastSectionChange = now;
      break;
  }
}

// ============================================================================
// LOGGING UTILITIES
// ============================================================================

/**
 * Creates a formatted log message with optional timestamp
 * @param message - Log message
 * @param includeTimestamp - Whether to include timestamp
 * @returns Formatted log message
 */
function formatLogMessage(message: string, includeTimestamp: boolean = true): string {
  const prefix = currentConfig.logPrefix || '[SectionMonitor]';
  const timestamp = includeTimestamp && currentConfig.includeTimestamps 
    ? `[${new Date().toISOString()}]` 
    : '';
  
  return `${prefix} ${timestamp} ${message}`.trim();
}

/**
 * Logs a message to console if logging is enabled
 * @param message - Message to log
 * @param level - Log level (log, warn, error)
 */
function logMessage(message: string, level: 'log' | 'warn' | 'error' = 'log'): void {
  if (!currentConfig.enableConsoleLogging) return;
  
  const formattedMessage = formatLogMessage(message);
  
  switch (level) {
    case 'warn':
      console.warn(formattedMessage);
      break;
    case 'error':
      console.error(formattedMessage);
      break;
    default:
      console.log(formattedMessage);
      break;
  }
}

/**
 * Gets the display name for a section using the centralized mapping
 * @param sectionId - Section identifier
 * @returns Human-readable section name
 */
function getSectionDisplayName(sectionId: SectionEnum): string {
  return getSectionName(sectionId);
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handles section activation events
 * @param event - Section activation event data
 */
function handleSectionActivation(event: SectionActivationEvent): void {
  if (!currentConfig.logSectionActivations) return;
  
  const activeSectionName = getSectionDisplayName(event.activeSection);
  const previousSectionName = event.previousSection 
    ? getSectionDisplayName(event.previousSection)
    : 'None';
  
  logMessage(`${activeSectionName} section loaded`);
  
  if (event.previousSection && event.previousSection !== event.activeSection) {
    logMessage(`Section transition: ${previousSectionName} → ${activeSectionName}`);
  }
  
  // Manage component visibility based on active section
  switch (event.activeSection) {
    case SectionEnum.Hero:
      // Hero section: Show scroll indicator, locale, compact navbar
      // Hide BackToTop and Highlight components
      showComponent(ComponentId.ScrollIndicator);
      showComponent(ComponentId.Locale);
      showComponent(ComponentId.Navigation); // Show navbar in compact mode
      hideComponent(ComponentId.BackToTop);
      hideComponent(ComponentId.Highlight);
      logMessage('Hero section: ScrollIndicator, Locale, Navigation (compact) visible; BackToTop, Highlight hidden');
      break;

    case SectionEnum.Footer:
      // Footer section: Hide navigation, show BackToTop
      // Hide Highlight component
      showComponent(ComponentId.BackToTop);
      hideComponent(ComponentId.Highlight);
      logMessage('Footer section: BackToTop visible; Navigation, Highlight hidden');
      break;
      
      default:
      hideComponent(ComponentId.Navigation);
      hideComponent(ComponentId.ScrollIndicator);
      showComponent(ComponentId.Highlight);
      hideComponent(ComponentId.BackToTop);
      logMessage('Default section: Navigation, Highlight visible; ScrollIndicator, BackToTop hidden');
      break;
  }
  
  // Log additional section details if available
  if (event.sectionConfig) {
    const { component, metadata } = event.sectionConfig;
    
    if (component) {
      logMessage(`${activeSectionName} section component is loaded and ready`);
    } else {
      logMessage(`${activeSectionName} section component not yet loaded`, 'warn');
    }
    
    if (metadata?.order !== undefined) {
      logMessage(`${activeSectionName} section order: ${metadata.order}`);
    }
  }
}

/**
 * Handles component loading events
 * @param event - Component loading event data
 */
function handleComponentLoading(event: ComponentLoadingEvent): void {
  if (!currentConfig.logComponentLoading) return;
  
  const sectionName = getSectionDisplayName(event.section);
  
  if (event.isLoading) {
    logMessage(`Loading ${sectionName} section component...`);
  } else {
    logMessage(`${sectionName} section component loading completed`);
  }
}

/**
 * Handles navigation state changes
 * @param currentState - Current navigation state
 * @param previousState - Previous navigation state
 */
function handleNavigationChange(
  currentState: SectionNavigationState,
  previousState: SectionNavigationState | null
): void {
  if (!currentConfig.logNavigationChanges) return;
  
  // Log navigation lock changes
  if (previousState && currentState.isLocked !== previousState.isLocked) {
    const lockStatus = currentState.isLocked ? 'locked' : 'unlocked';
    logMessage(`Navigation ${lockStatus}`);
  }
  
  // Log loading state changes
  if (previousState && currentState.isLoading !== previousState.isLoading) {
    const loadingStatus = currentState.isLoading ? 'started' : 'completed';
    logMessage(`Navigation loading ${loadingStatus}`);
  }
  
  // Log history changes
  if (previousState && currentState.history.length !== previousState.history.length) {
    logMessage(`Navigation history updated (${currentState.history.length} entries)`);
  }
}

/**
 * Handles section index changes
 * @param currentIndex - Current section index
 * @param previousIndex - Previous section index
 */
function handleSectionIndexChange(
  currentIndex: number,
  previousIndex: number
): void {
  if (!currentConfig.logNavigationChanges) return;
  
  if (currentIndex !== previousIndex) {
    logMessage(`Section index changed: ${previousIndex} → ${currentIndex}`);
    
    if (currentIndex >= 0) {
      logMessage(`Current section is at position ${currentIndex} in navigation order`);
    } else {
      logMessage(`Section index is invalid: ${currentIndex}`, 'warn');
    }
  }
}

// ============================================================================
// STORE SUBSCRIBERS
// ============================================================================

/**
 * Subscribes to navigation store changes with enhanced change detection
 */
function subscribeToNavigationChanges(): () => void {
  return navigationStore.subscribe((currentState) => {
    // Perform deep comparison to detect specific changes
    const changes = compareNavigationStates(currentState, previousNavigationState);
    
    if (!changes.hasChanges) {
      return; // No changes detected, skip processing
    }
    
    // Update change detection state
    updateChangeDetectionState('navigation');
    
    // Handle section activation only if section actually changed
    if (changes.sectionChanged) {
      const sections = get(sectionsStore);
      const sectionConfig = sections.get(currentState.currentSection) || null;
      
      const activationEvent: SectionActivationEvent = {
        activeSection: currentState.currentSection,
        previousSection: previousNavigationState?.currentSection || null,
        timestamp: new Date(),
        sectionConfig
      };
     
      handleSectionActivation(activationEvent);
      
      // Sync highlight with section change for proper highlight indicator
      import('../../../Stores/Guest/Viewport/Highlight').then(({ syncWithSectionChange }) => {
        syncWithSectionChange(currentState.currentSection, {
          triggerNavigation: false,
          respectLocks: true
        });
      }).catch(console.warn);
    }
    
    // Handle other navigation state changes
    if (changes.lockChanged || changes.loadingChanged || changes.historyChanged) {
      handleNavigationChange(currentState, previousNavigationState);
    }
    
    // Update previous state with deep copy
    previousNavigationState = {
      ...currentState,
      history: [...currentState.history] // Ensure history array is properly copied
    };
  });
}

/**
 * Subscribes to section loading store changes
 */
function subscribeToLoadingChanges(): () => void {
  return sectionLoadingStore.subscribe((currentLoadingStates) => {
    // Check for loading state changes
    currentLoadingStates.forEach((isLoading, sectionId) => {
      const previousLoading = previousLoadingStates.get(sectionId) || false;
      
      if (isLoading !== previousLoading) {
        const loadingEvent: ComponentLoadingEvent = {
          section: sectionId,
          isLoading,
          timestamp: new Date()
        };
        
        handleComponentLoading(loadingEvent);
      }
    });
    
    // Update previous loading states
    previousLoadingStates = new Map(currentLoadingStates);
  });
}

/**
 * Subscribes to current section index changes
 */
function subscribeToSectionIndexChanges(): () => void {
  return currentSectionIndex.subscribe((currentIndex) => {
    // Handle section index changes
    if (previousSectionIndex !== currentIndex) {
      handleSectionIndexChange(currentIndex, previousSectionIndex);
      
      // Update previous index
      previousSectionIndex = currentIndex;
    }
  });
}

/**
 * Subscribes to sections store changes with enhanced change detection
 */
function subscribeToSectionsChanges(): () => void {
  return sectionsStore.subscribe((currentSections) => {
    // Convert Map to a comparable format for change detection
    const currentSectionsMap = new Map(currentSections);
    
    // Perform deep comparison to detect specific changes
    const changedSections = compareSectionConfigs(currentSectionsMap, previousSectionsMap);
    
    if (changedSections.length === 0) {
      return; // No changes detected, skip processing
    }
    
    // Update change detection state
    updateChangeDetectionState('section');
    
    // Log detected changes for debugging
    if (currentConfig.enableConsoleLogging) {
      logMessage(`Section configuration changes detected: ${changedSections.length} sections modified`);
      
      changedSections.forEach(sectionId => {
        const sectionName = getSectionDisplayName(sectionId);
        logMessage(`  - ${sectionName} configuration updated`);
      });
    }
    
    // Update previous sections with deep copy
    previousSectionsMap = new Map(currentSectionsMap);
  });
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Initializes the section monitoring system
 * @param config - Monitoring configuration
 * @returns Cleanup function to stop monitoring
 */
export function initializeSectionMonitoring(config: Partial<MonitorConfig> = {}): () => void {
  // Update configuration
  currentConfig = { ...defaultConfig, ...config };
  
  // Initialize previous states
  previousNavigationState = get(navigationStore);
  previousLoadingStates = new Map(get(sectionLoadingStore));
  previousSectionIndex = get(currentSectionIndex);
  
  logMessage('Section monitoring initialized');
  
  // Immediately handle current active section on initialization
  const currentNavigationState = get(navigationStore);
  const sections = get(sectionsStore);
  const sectionConfig = sections.get(currentNavigationState.currentSection) || null;
  
  const initialActivationEvent: SectionActivationEvent = {
    activeSection: currentNavigationState.currentSection,
    previousSection: null,
    timestamp: new Date(),
    sectionConfig
  };
  
  handleSectionActivation(initialActivationEvent);
  
  // Subscribe to store changes
  const unsubscribeNavigation = subscribeToNavigationChanges();
  const unsubscribeLoading = subscribeToLoadingChanges();
  const unsubscribeSectionIndex = subscribeToSectionIndexChanges();
  const unsubscribeSections = subscribeToSectionsChanges();
  
  // Return cleanup function
  return () => {
    unsubscribeNavigation();
    unsubscribeLoading();
    unsubscribeSectionIndex();
    unsubscribeSections();
    logMessage('Section monitoring stopped');
  };
}

/**
 * Updates the monitoring configuration
 * @param config - New configuration options
 */
export function updateMonitoringConfig(config: Partial<MonitorConfig>): void {
  currentConfig = { ...currentConfig, ...config };
  logMessage('Monitoring configuration updated');
}

/**
 * Gets the current monitoring configuration
 * @returns Current configuration
 */
export function getMonitoringConfig(): MonitorConfig {
  return { ...currentConfig };
}

/**
 * Manually logs a section event
 * @param sectionId - Section identifier
 * @param message - Custom message
 * @param level - Log level
 */
export function logSectionEvent(
  sectionId: SectionEnum,
  message: string,
  level: 'log' | 'warn' | 'error' = 'log'
): void {
  const sectionName = getSectionDisplayName(sectionId);
  logMessage(`${sectionName}: ${message}`, level);
}



/**
 * Logs current section state for debugging
 */
export function logCurrentSectionState(): void {
  const navigationState = get(navigationStore);
  const sections = get(sectionsStore);
  const loadingStates = get(sectionLoadingStore);
  
  logMessage('=== Current Section State ===');
  logMessage(`Active Section: ${getSectionDisplayName(navigationState.currentSection)}`);
  logMessage(`Previous Section: ${navigationState.previousSection ? getSectionDisplayName(navigationState.previousSection) : 'None'}`);
  logMessage(`Navigation Locked: ${navigationState.isLocked}`);
  logMessage(`Navigation Loading: ${navigationState.isLoading}`);
  logMessage(`History Length: ${navigationState.history.length}`);
  
  // Log loading states
  if (loadingStates.size > 0) {
    logMessage('Loading States:');
    loadingStates.forEach((isLoading, sectionId) => {
      if (isLoading) {
        logMessage(`  - ${getSectionDisplayName(sectionId)}: Loading`);
      }
    });
  }
  
  logMessage('=== End Section State ===');
}

/**
 * Default export for easy initialization
 */
export default {
  initialize: initializeSectionMonitoring,
  updateConfig: updateMonitoringConfig,
  getConfig: getMonitoringConfig,
  logEvent: logSectionEvent,
  logCurrentState: logCurrentSectionState
};