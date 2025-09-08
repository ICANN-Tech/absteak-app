/**
 * Guest layout utility functions
 * This module provides utilities for initializing layout components, modal systems, and event handlers
 */

import { initializeModalSystem } from '@Utils/Global/Modal';
import { startMouseDetector } from '@Utils/Guest/Layout/Scrolling';
import type { IndicatorSystem } from '@Utils/Guest/Layout/Scrolling';

/**
 * Component loading configuration
 */
export interface ComponentLoadConfig {
  loadHeader?: boolean;
  loadFooter?: boolean;
  loadLanguageSwitch?: boolean;
  loadScrollIndicator?: boolean;
  loadBackToTop?: boolean;
  loadChatBot?: boolean;
}

/**
 * Layout initialization options
 */
export interface LayoutInitOptions {
  indicator: IndicatorSystem;
  componentConfig?: ComponentLoadConfig;
  enableModalSystem?: boolean;
  enableMouseDetector?: boolean;
}

/**
 * Layout initialization result
 */
export interface LayoutInitResult {
  components: {
    Header?: any;
    Footer?: any;
    LanguageSwitch?: any;
    ScrollIndicator?: any;
    BackToTop?: any;
    ChatBotFab?: any;
  };
  cleanup: () => void;
}

/**
 * Initialize layout components with dynamic imports
 */
export async function initializeLayoutComponents(
  config: ComponentLoadConfig = {}
): Promise<{
  Header?: any;
  Footer?: any;
  LanguageSwitch?: any;
  ScrollIndicator?: any;
  BackToTop?: any;
  ChatBotFab?: any;
}> {
  const {
    loadHeader = true,
    loadFooter = true,
    loadLanguageSwitch = true,
    loadScrollIndicator = true,
    loadBackToTop = true,
    loadChatBot = true
  } = config;

  const components: any = {};

  try {
    const imports: Promise<any>[] = [];
    const componentKeys: string[] = [];

    if (loadHeader) {
      // @ts-ignore - Svelte component imports
      imports.push(import('@Components/Guest/Organisme/Layout/Header.svelte'));
      componentKeys.push('Header');
    }

    if (loadFooter) {
      // @ts-ignore - Svelte component imports
      imports.push(import('@Components/Guest/Organisme/Layout/Footer.svelte'));
      componentKeys.push('Footer');
    }

    if (loadLanguageSwitch) {
      // @ts-ignore - Svelte component imports
      imports.push(import('@Components/Guest/Organisme/Layout/LanguageSwitch.svelte'));
      componentKeys.push('LanguageSwitch');
    }

    if (loadScrollIndicator) {
      // @ts-ignore - Svelte component imports
      imports.push(import('@Components/Guest/Organisme/Layout/ScrollIndicator.svelte'));
      componentKeys.push('ScrollIndicator');
    }

    if (loadBackToTop) {
      // @ts-ignore - Svelte component imports
      imports.push(import('@Components/Guest/Molecules/Button/ScrollToUp.svelte'));
      componentKeys.push('BackToTop');
    }

    if (loadChatBot) {
      // @ts-ignore - Svelte component imports
      imports.push(import('@Modules/Guest/Chatbot/Index.svelte'));
      componentKeys.push('ChatBotFab');
    }

    const modules = await Promise.all(imports);
    
    modules.forEach((module, index) => {
      components[componentKeys[index]] = module.default;
    });

  } catch (error) {
    console.warn('Some components could not be loaded:', error);
  }

  return components;
}

/**
 * Initialize layout systems (modal, mouse detector, etc.)
 */
export function initializeLayoutSystems(
  indicator: IndicatorSystem,
  options: {
    enableModalSystem?: boolean;
    enableMouseDetector?: boolean;
  } = {}
): () => void {
  const {
    enableModalSystem = true,
    enableMouseDetector = true
  } = options;

  const cleanupFunctions: (() => void)[] = [];

  if (typeof window !== 'undefined') {
    // Initialize modal system
    if (enableModalSystem) {
      const modalCleanup = initializeModalSystem();
      cleanupFunctions.push(modalCleanup);
    }

    // Start mouse detector
    if (enableMouseDetector) {
      startMouseDetector(indicator, true);
      // Note: startMouseDetector doesn't return a cleanup function
      // but we can add one if needed in the future
    }
  }

  // Return combined cleanup function
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}

/**
 * Complete layout initialization
 */
export async function initializeGuestLayout(
  options: LayoutInitOptions
): Promise<LayoutInitResult> {
  const {
    indicator,
    componentConfig = {},
    enableModalSystem = true,
    enableMouseDetector = true
  } = options;

  // Initialize layout systems
  const systemsCleanup = initializeLayoutSystems(indicator, {
    enableModalSystem,
    enableMouseDetector
  });

  // Load components
  const components = await initializeLayoutComponents(componentConfig);

  return {
    components,
    cleanup: systemsCleanup
  };
}

/**
 * Utility function for component loading with error handling
 */
export async function loadComponentSafely(
  importPath: string,
  componentName: string
): Promise<any> {
  try {
    // @ts-ignore - Dynamic component imports
    const module = await import(importPath);
    return module.default;
  } catch (error) {
    console.warn(`Failed to load component ${componentName} from ${importPath}:`, error);
    return null;
  }
}

/**
 * Batch load multiple components
 */
export async function batchLoadComponents(
  componentMap: Record<string, string>
): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  
  const loadPromises = Object.entries(componentMap).map(async ([name, path]) => {
    const component = await loadComponentSafely(path, name);
    return { name, component };
  });

  const loadedComponents = await Promise.all(loadPromises);
  
  loadedComponents.forEach(({ name, component }) => {
    if (component) {
      results[name] = component;
    }
  });

  return results;
}

export default {
  initializeLayoutComponents,
  initializeLayoutSystems,
  initializeGuestLayout,
  loadComponentSafely,
  batchLoadComponents
};